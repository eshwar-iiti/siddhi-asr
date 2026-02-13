# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# import tempfile
# import shutil
# import os

# from app.stt import transcribe_audio
# from app.medical_corrector import medical_text_correct
# from app.utils import summarize_medical_text

# app = FastAPI(title="Siddhi ASR API")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/transcribe")
# async def transcribe(file: UploadFile = File(...)):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
#         shutil.copyfileobj(file.file, tmp)
#         tmp_path = tmp.name

#     try:
#         raw_text = transcribe_audio(tmp_path) # speech to text
#         medical_text = medical_text_correct(raw_text) # LLM fixing
        
#         # summary = summarize_medical_text(medical_text)

#         # return {
#         #     "raw_text": raw_text,
#         #     "medical_text": medical_text,
#         #     "summary": summary
#         # }

#         return {
#             "raw_text": raw_text,
#             "medical_text": medical_text
#                 }
    
#     except Exception as e:
#         return {"error": str(e)}
#     finally:
#         if os.path.exists(tmp_path):
#             os.remove(tmp_path)

# @app.get("/health")
# async def health_check():
#     return {"status": "healthy"}

from fastapi import FastAPI, UploadFile, File, Query
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
async def transcribe(
    file: UploadFile = File(...),
    generate_summary: bool = Query(True)
):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        # 1️⃣ Speech → Text
        raw_text = transcribe_audio(tmp_path)

        # 2️⃣ Medical correction
        medical_text = medical_text_correct(raw_text)

        response_data = {
            "raw_text": raw_text,
            "medical_text": medical_text
        }

        # 3️⃣ Optional structured summary
        if generate_summary:
            summary = summarize_medical_text(medical_text)
            response_data["summary"] = summary

        return response_data

    except Exception as e:
        return {"error": str(e)}

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
