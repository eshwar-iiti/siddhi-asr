from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import shutil
import os

from app.stt import transcribe_audio
from app.medical_corrector import medical_text_correct
from app.utils import summarize_medical_text

app = FastAPI(title="Siddhi ASR API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    # Save uploaded audio to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        # Transcribe using file PATH
        raw_text = transcribe_audio(tmp_path)
        
        # Correct medical terms using LLM
        medical_text = medical_text_correct(raw_text)
        
        # Generate structured summary
        summary = summarize_medical_text(medical_text)

        return {
            "raw_text": raw_text,
            "medical_text": medical_text,
            "summary": summary
        }
    except Exception as e:
        return {"error": str(e)}
    finally:
        # Cleanup
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
