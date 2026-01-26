import os
import json
import re
from typing import Optional
from openai import OpenAI

# Initialize OpenAI client for Gemini (using the provided environment variable)
# The user mentioned providing Gemini key in .env, we'll assume it's set as GEMINI_API_KEY
# For Manus environment, we use the pre-configured OpenAI client which can point to Gemini
client = OpenAI()

def get_medical_correction(text: str) -> str:
    """
    Uses LLM to correct medical terminology in the transcribed text, 
    specifically handling Indian accents and common misspellings.
    """
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
        response = client.chat.completions.create(
            model="gpt-4.1-mini", # Using available model in Manus
            messages=[
                {"role": "system", "content": "You are a helpful medical assistant specializing in transcription correction."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error in LLM correction: {e}")
        return text # Fallback to original text

def medical_text_correct(text: str) -> str:
    """
    Main entry point for medical text correction.
    Combines LLM correction with any local dictionary logic if needed.
    """
    if not text:
        return ""
    
    # Primary correction via LLM
    corrected_text = get_medical_correction(text)
    
    return corrected_text
