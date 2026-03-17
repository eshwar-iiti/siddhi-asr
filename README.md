#Siddhi-ASR: Medical Speech-to-Text for Indian Healthcare

## **Overview**

Traditional ASR systems often struggle with Indian regional accents, background noise in busy clinics, and complex medical terminology. Siddhi-ASR is a noise-robust, accent-adapted medical speech-to-text system designed specifically for the Indian healthcare context.
By utilizing a two-step pipeline—Acoustic Transcription followed by LLM-based Medical Correction—Siddhi-ASR significantly reduces Word Error Rate (WER) and provides structured medical summaries.

## **Key Features**

Accent Adaptation: Fine-tuned logic to handle Indian and regional English accents.

Medical Terminology Correction: Uses Gemini LLM to correct misspellings of complex drug names (e.g., Azithromycin, Pantoprazole) and medical conditions.

Noise Robustness: Optimized to perform in real-world healthcare environments with background reverberation.

Automatic Summarization: Generates structured summaries including "Reason for Visit," "Diagnosis," and "Medications."

##  **Technology Architecture**
*Frontend: React (Interactive UI for audio recording and file uploads.)
*Backend: FastAPI (High-performance server handling inference and API logic.)
*ASR Model: Whisper-small (Primary Speech-to-Text conversion.)
*Correction: Gemini LLM (Refines raw text and corrects specialized medical terms.)
*Dataset: Eka Care Medical speech/text dataset via HuggingFace.

## **Methodology**
Ingestion: Audio is recorded via the browser or uploaded as an .mkv/.wav file.

Standardization: The backend normalizes audio formats and reduces noise.

Raw Transcription: The Whisper-small model converts audio into raw text.

Refinement: Raw text is passed to Gemini LLM, which acts as a "Medical Editor" to fix context and drug names.

Summary: The system outputs a structured medical summary for the doctor.

## **Performance Results** 
Our testing shows significant improvements over raw ASR outputs:
Average Raw WER: 0.3201 
After LLM correction- Average Corrected WER: 0.2343 (~26.8% Improvement)
Corpus-level WER: Improved from 0.1677 to 0.1400 (~16.5% Improvement)

## **How to Use**
###Prerequisites
Python 3.9+

Node.js & npm

Gemini API Key (for the LLM correction layer)

###Installation

Clone the Repo: (Bash) 

git clone https://github.com/eshwar-iiti/siddhi-asr.git

cd siddhi-asr

###Backend Setup:(Bash)

cd backend

pip install -r requirements.txt

# Add your API Key to .env

python main.py

###Frontend Setup:(Bash)

cd ../frontend

npm install

npm start
