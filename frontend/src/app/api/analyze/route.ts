import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

// ✅ If using Prisma to save results
// import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  // 🔐 Validate API key
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { text, postId } = await req.json(); // postId optional

  return new Promise((resolve) => {
    // 👇 Windows vs Unix binary path handling
    const cppProcess = spawn(
      process.platform === 'win32'
        ? 'cpp-bin/analyzer.exe'
        : './cpp-bin/analyzer'
    );

    let output = '';

    cppProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    cppProcess.stderr.on('data', (error) => {
      console.error('C++ Error:', error.toString());
    });

    cppProcess.on('close', async () => {
      const sentiment = output.trim();

      // ✅ Save result to database (optional)
      /*
      if (postId) {
        await prisma.analysis.create({
          data: { postId, text, sentiment },
        });
      }
      */

      resolve(NextResponse.json({ sentiment }));
    });

    cppProcess.stdin.write(text + '\n');
    cppProcess.stdin.end();
  });
}
