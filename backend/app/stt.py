import torch
import librosa
from transformers import WhisperProcessor, WhisperForConditionalGeneration

processor = WhisperProcessor.from_pretrained("openai/whisper-small")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")
model.eval()

def transcribe_audio(path: str) -> str:
    audio, sr = librosa.load(path, sr=16000)

    inputs = processor(
        audio,
        sampling_rate=16000,
        return_tensors="pt"
    )

    with torch.no_grad():
        predicted_ids = model.generate(inputs.input_features)

    return processor.batch_decode(
        predicted_ids,
        skip_special_tokens=True
    )[0]
