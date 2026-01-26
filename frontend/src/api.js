import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Assuming the backend runs on port 8000

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  // The backend expects a file named 'file'
  formData.append('file', audioBlob, 'recording.wav');

  try {
    const response = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // The new backend will return { raw_text, medical_text, summary }
    return response.data;
  } catch (error) {
    // Log the full error for debugging
    console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
    // Re-throw a more user-friendly error
    throw new Error('Failed to get transcription from the server.');
  }
};
