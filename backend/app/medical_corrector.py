import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_medical_correction(text: str) -> str:
 
    prompt = f"""
    You are a medical transcription expert. Your task is to correct the following transcription 
    which was generated from a doctor's speech (Indian accent). 
    The transcription may contain misspellings of medical terms, medications, or anatomical parts.
    
    Original Transcription: "{text}"
    
    Instructions:
    1. Correct any misspelled medical terms or medications.
    2. Maintain the original meaning and flow of the sentence.
    3. If a term is ambiguous, choose the most likely medical term in an Indian clinical context.
    4. Return ONLY the corrected text.
    
    Corrected Transcription:
    """
    
    try:
        print("Calling Gemini")
        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error in LLM correction: {e}")
        return text 

def medical_text_correct(text: str) -> str:
    if not text:
        return ""
    
    corrected_text = get_medical_correction(text)
    
    return corrected_text
