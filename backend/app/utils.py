import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def summarize_medical_text(text: str) -> dict:
    try:
        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=f"""
Extract structured medical information from this transcription.

Transcription:
\"\"\"{text}\"\"\"

Rules:
- Extract only explicitly mentioned information.
- Do NOT infer missing details.
- If not mentioned, return null.
- If no medications mentioned, return empty list [].
""",
            config=types.GenerateContentConfig(
                temperature=0.0,  # deterministic
                response_mime_type="application/json",
                response_schema={
    "type": "object",
    "properties": {
        "reason_for_visit": {
            "type": "string",
            "nullable": True
        },
        "diagnosis": {
            "type": "string",
            "nullable": True
        },
        "medications": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "dosage": {
                        "type": "string",
                        "nullable": True
                    },
                    "duration": {
                        "type": "string",
                        "nullable": True
                    }
                },
                "required": ["name"]
            }
        },
        "advice": {
            "type": "string",
            "nullable": True
        }
    },
    "required": [
        "reason_for_visit",
        "diagnosis",
        "medications",
        "advice"
    ]
}

            )
        )

        return json.loads(response.text)

    except Exception as e:
        print("Error in summarization:", e)
        return {
            "reason_for_visit": None,
            "diagnosis": None,
            "medications": [],
            "advice": None
        }
