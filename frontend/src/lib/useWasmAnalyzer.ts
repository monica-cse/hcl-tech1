/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

// Type for the WASM module
type WasmModule = {
  cwrap: (fn: string, returnType: string, argTypes: string[]) => (...args: any[]) => any;
};

export default function useWasmAnalyzer() {
  const [analyzeSentiment, setAnalyzeSentiment] = useState<(text: string) => string | null>(() => null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the WASM module from public/wasm/analyze.js
    const loadWasm = async () => {
      try {
        const moduleFactory = await import("../../public/wasm/analyze.js");
        const instance = (await moduleFactory.default()) as WasmModule;

        const analyze = instance.cwrap("analyze", "string", ["string"]);
        setAnalyzeSentiment(() => analyze);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load WASM module:", err);
        setAnalyzeSentiment(() => null);
        setLoading(false);
      }
    };

    loadWasm();
  }, []);

  return { analyzeSentiment, loading };
}
