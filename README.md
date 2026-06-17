# Siddhi-ASR: Medical Speech-to-Text for Indian Healthcare

> A noise-robust, accent-adapted medical speech recognition system designed specifically for the Indian healthcare context.

---
## Website
🔗 https://siddhi-asr.vercel.app/
---
## Overview

Traditional ASR systems often struggle with Indian regional accents, background noise in busy clinics, and complex medical terminology. **Siddhi-ASR** addresses these challenges through a two-step pipeline — **Acoustic Transcription** followed by **LLM-based Medical Correction** — significantly reducing Word Error Rate (WER) and generating structured medical summaries.

---

## Key Features

- **Accent Adaptation** — Fine-tuned to handle Indian and regional English accents.
- **Medical Terminology Correction** — Uses Gemini LLM to correct misspellings of complex drug names (e.g., Azithromycin, Pantoprazole) and medical conditions.
- **Noise Robustness** — Optimized for real-world healthcare environments with background reverberation.
- **Automatic Summarization** — Generates structured summaries including *Reason for Visit*, *Diagnosis*, and *Medications*.

---

## Technology Architecture

| Layer | Technology | Role |
|---|---|---|
| Frontend | React | Interactive UI for audio recording and file uploads |
| Backend | FastAPI | High-performance server handling inference and API logic |
| ASR Model | Whisper-small | Primary Speech-to-Text conversion |
| Correction | Gemini LLM | Refines raw text and corrects specialized medical terms |
| Dataset | Eka Care (via HuggingFace) | Medical speech/text training data |

---

## Methodology

1. **Ingestion** — Audio is recorded via the browser or uploaded as an `.mkv` / `.wav` file.
2. **Standardization** — The backend normalizes audio formats and applies noise reduction.
3. **Raw Transcription** — The Whisper-small model converts audio into raw text.
4. **Refinement** — Raw text is passed to Gemini LLM, which acts as a *Medical Editor* to fix context and drug names.
5. **Summary** — The system outputs a structured medical summary for the doctor.

---

## Performance Results

Testing shows significant improvements over raw ASR output:

| Metric | Raw ASR | After LLM Correction | Improvement |
|---|---|---|---|
| Average WER | 0.3201 | 0.2343 | **~26.8%** |
| Corpus-level WER | 0.1677 | 0.1400 | **~16.5%** |

---


## **Demo Video**



https://github.com/user-attachments/assets/737721d0-0ad9-4649-a112-fed869f0b7b5



## Getting Started

### Prerequisites

- Python 3.9+
- Node.js & npm
- Gemini API Key (for the LLM correction layer)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/eshwar-iiti/siddhi-asr.git
cd siddhi-asr
```

**2. Backend setup**

```bash
cd backend
pip install -r requirements.txt
# Add your Gemini API Key to .env
python main.py
```

**3. Frontend setup**

```bash
cd ../frontend
npm install
npm start
```

---



## Report/ Poster:
![presentation_poster_siddhi](https://github.com/user-attachments/assets/e3143caf-317f-4e88-bca1-e1641fb5f152)


