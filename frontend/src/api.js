const API_URL = "http://localhost:8000/transcribe";

export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Transcription failed");
  }

  return await response.json(); // { text: "..." }
}
