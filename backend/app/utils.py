import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def summarize_medical_text(text: str) -> dict:
    prompt = f"""
You are a medical information extraction system.

Task:
Analyze the following medical transcription and extract structured clinical information.

Transcription:
"{text}"

Instructions:
- Extract only information explicitly mentioned in the transcription.
- Do NOT infer or hallucinate missing details.
- If a field is not mentioned, return null (do not guess).
- Output must be valid JSON only.
- Do not include any explanation, commentary, or extra text.

Required JSON schema:

{
  "reason_for_visit": string | null,
  "diagnosis": string | null,
  "medications": [
    {
      "name": string,
      "dosage": string | null,
      "duration": string | null
    }
  ],
  "advice": string | null
}

Additional Rules:
- If no medications are mentioned, return an empty list [].
- Preserve original medical terminology from the transcription.
- Do not rephrase unless necessary for clarity.
- Ensure the JSON is properly formatted and parsable.

Return ONLY the JSON object.
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
