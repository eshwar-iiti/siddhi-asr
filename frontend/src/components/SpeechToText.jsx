import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { transcribeAudio } from "../api";

export default function SpeechToText() {
  const [rawText, setRawText] = useState("");
  const [medicalText, setMedicalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ audio: true });

  const transcribeBlob = async (blob) => {
    setLoading(true);
    setRawText("");
    setMedicalText("");

    try {
      const result = await transcribeAudio(blob);
      console.log("Backend response:", result);

      setRawText(result.raw_text);
      setMedicalText(result.medical_text);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false); // ✅ ALWAYS runs
    }
  };

  // 🎙️ Recorded audio
  const handleRecordedTranscription = async () => {
    if (!mediaBlobUrl) return;
    const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
    transcribeBlob(blob);
  };

  // 📁 Uploaded file
  const handleFileUpload = () => {
    if (!file) return;
    transcribeBlob(file);
  };

  return (
    <div>
      {/* RECORD SECTION */}
      <h3>Record Audio</h3>
      <p>Status: {status}</p>

      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording} style={{ marginLeft: 10 }}>
        Stop
      </button>

      {mediaBlobUrl && (
        <>
          <br /><br />
          <audio src={mediaBlobUrl} controls />
          <br />
          <button onClick={handleRecordedTranscription}>
            Transcribe Recording
          </button>
        </>
      )}

      <hr />

      {/* UPLOAD SECTION */}
      <h3>Upload Audio File</h3>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br />
      <button onClick={handleFileUpload}>
        Transcribe File
      </button>

      <hr />

      {/* OUTPUT */}
      <h3>Transcription</h3>

      {loading && <p>Processing...</p>}

      {!loading && rawText && (
        <>
          <h4>Before (Whisper)</h4>
          <p>{rawText}</p>
        </>
      )}

      {!loading && medicalText && (
        <>
          <h4>After (Medical Corrected - BioBERT)</h4>
          <p>{medicalText}</p>
        </>
      )}
    </div>
  );
}
