from openai import OpenAI
import json

client = OpenAI()

def summarize_medical_text(text: str) -> dict:
    """
    Summarizes medical transcription into a structured prescription format.
    """
    prompt = f"""
    Analyze the following medical transcription and extract key information into a structured JSON format.
    
    Transcription: "{text}"
    
    Extract the following fields:
    1. reason_for_visit: The main symptoms or reason the patient is seeing the doctor.
    2. diagnosis: The suspected or confirmed medical condition.
    3. medications: A list of objects, each containing 'name', 'dosage', and 'duration'.
    4. advice: Any lifestyle advice or follow-up instructions given by the doctor.
    
    Return ONLY a valid JSON object.
    
    Example Output:
    {{
        "reason_for_visit": "High fever and cough for 3 days",
        "diagnosis": "Viral Upper Respiratory Tract Infection",
        "medications": [
            {{"name": "Dolo 650", "dosage": "1 tablet thrice a day", "duration": "3 days"}},
            {{"name": "Azithromycin 500mg", "dosage": "1 tablet once a day", "duration": "5 days"}}
        ],
        "advice": "Drink plenty of fluids and rest. Follow up if fever persists after 3 days."
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a medical scribe that converts clinical notes into structured summaries."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in summarization: {e}")
        return {
            "reason_for_visit": "Not specified",
            "diagnosis": "Not specified",
            "medications": [],
            "advice": "Not specified"
        }
