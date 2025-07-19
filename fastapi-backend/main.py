from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import json

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev; use specific origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str

@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    try:
        # Call C++ exe and pass text via stdin
        result = subprocess.run(
            ["analyze.exe"],
            input=request.text,
            capture_output=True,
            text=True,
            check=True
        )
        output = result.stdout.strip()
        return json.loads(output)

    except subprocess.CalledProcessError as e:
        return {"error": "C++ analysis failed", "details": e.stderr}

    except json.JSONDecodeError:
        return {"error": "Invalid JSON from C++ output"}
