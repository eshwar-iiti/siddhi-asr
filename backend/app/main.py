from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import shutil
import os

from app.stt import transcribe_audio
from app.medical_corrector import medical_text_correct
app = FastAPI()

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

    # Transcribe using file PATH
    text = transcribe_audio(tmp_path)
    clean_text = medical_text_correct(text)

    # Cleanup
    os.remove(tmp_path)

    return {
    "raw_text": text,
    "medical_text": clean_text
}

