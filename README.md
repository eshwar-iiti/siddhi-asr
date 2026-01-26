# Siddhi ASR v2.0 - Enhanced Medical Transcription

This version of Siddhi ASR includes significant improvements in transcription accuracy, a modern dark-themed UI, and automated medical summarization.

## Key Enhancements

### 1. AI-Powered Medical Correction
- **Whisper + Gemini**: We've integrated Gemini to post-process Whisper's output. This specifically targets Indian accents and complex medical terminology that standard ASR models often miss.
- **Contextual Awareness**: The correction pipeline understands clinical context, ensuring that terms like "Azithral" or "Dolo" are correctly identified and formatted.

### 2. Modern Dark-Mode UI
- **Tech Stack**: Built with React, Tailwind CSS, and Framer Motion.
- **Features**:
    - Real-time recording status indicators.
    - Side-by-side comparison of raw vs. corrected text.
    - Professional "Clinical Summary" card layout.
    - Responsive design for tablets and desktops.

### 3. Automated Clinical Summarization
- **Structured Output**: Automatically extracts Reason for Visit, Diagnosis, Medications (with dosage/duration), and Advice.
- **Prescription Ready**: The summary is formatted in a clean, readable fashion suitable for clinical documentation.

## Getting Started

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `pip install -r requirements.txt`.
3. Set your Gemini API key in a `.env` file: `OPENAI_API_KEY=your_key_here` (The system uses an OpenAI-compatible client for Gemini).
4. Run the server: `uvicorn app.main:app --reload`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `pnpm install`.
3. Run the development server: `pnpm dev`.

## Project Structure
- `backend/app/medical_corrector.py`: Logic for LLM-based term correction.
- `backend/app/utils.py`: Logic for medical summarization.
- `frontend/src/components/SpeechToText.jsx`: The main UI component.
- `frontend/src/api.js`: Updated API client for the new backend structure.
