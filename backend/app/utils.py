import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def summarize_medical_text(text: str) -> dict:
    prompt = f"""
    Analyze the following medical transcription and extract key information into a structured JSON format.

    Transcription: "{text}"

    Extract the following fields:
    1. reason_for_visit
    2. diagnosis
    3. medications (name, dosage, duration)
    4. advice

    Return ONLY a valid JSON object.
    """

    try:
        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        text = response.text.strip()
        if not text:
            raise ValueError("Empty response from Gemini")

        return json.loads(text)

    except Exception as e:
        print("Error in summarization:", e)
        return {
            "reason_for_visit": "Not specified",
            "diagnosis": "Not specified",
            "medications": [],
            "advice": "Not specified"
        }
