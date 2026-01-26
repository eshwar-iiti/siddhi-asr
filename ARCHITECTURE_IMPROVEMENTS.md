# Architecture Improvements for Siddhi ASR

## 1. Transcription Pipeline Enhancement
The current pipeline uses `whisper-small` and a simple fuzzy-matching dictionary. We will upgrade this to a multi-stage process:
- **Stage 1: Whisper Transcription**: Continue using Whisper for initial ASR.
- **Stage 2: LLM-based Medical Correction**: Use Gemini (via the provided API key) to correct the raw transcription. The prompt will include context about Indian accents and medical terminology.
- **Stage 3: Medical Term Validation**: Cross-reference corrected terms with a curated medical database to ensure accuracy.

## 2. Medical Summarization (Prescription Fashion)
A new endpoint will be added to process the corrected text into a structured medical summary:
- **Reason for Visit**: Chief complaints and symptoms.
- **Diagnosis**: Potential or confirmed medical conditions.
- **Medication**: Tablet names, dosage, and duration.
- **Advice**: Lifestyle or follow-up instructions.

## 3. Frontend Redesign
- **Theme**: Modern Dark Mode using Tailwind CSS and Lucide icons.
- **Components**:
    - **Audio Recorder**: Visual feedback during recording.
    - **Transcription View**: Side-by-side comparison of raw vs. corrected text.
    - **Summary Card**: A clean, printable "Prescription" style summary.
- **Tech Stack**: React, Tailwind CSS, Framer Motion for animations.

## 4. Backend Refactoring
- **FastAPI**: Add new endpoints for summarization.
- **Environment Variables**: Use `.env` for Gemini API key.
- **Error Handling**: Robust handling for API failures and audio processing errors.
