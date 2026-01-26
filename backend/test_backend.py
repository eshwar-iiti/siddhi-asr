import sys
import os
from app.medical_corrector import medical_text_correct
from app.utils import summarize_medical_text

def test_correction():
    print("Testing Medical Correction...")
    raw_text = "The patient has high fever and I am prescribing paracetmol and azithral for 5 days."
    corrected = medical_text_correct(raw_text)
    print(f"Raw: {raw_text}")
    print(f"Corrected: {corrected}")
    return corrected

def test_summarization(text):
    print("\nTesting Medical Summarization...")
    summary = summarize_medical_text(text)
    import json
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    # Add current directory to path to import app
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    
    corrected_text = test_correction()
    test_summarization(corrected_text)
