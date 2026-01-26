import React, { useState, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { transcribeAudio } from '../api';
import { 
  Mic, 
  Square, 
  Upload, 
  FileText, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Stethoscope,
  Pill,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpeechToText() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({ audio: true });

  const handleTranscribe = async (blob) => {
    setLoading(true);
    setError(null);
    try {
      const data = await transcribeAudio(blob);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordedTranscription = async () => {
    if (!mediaBlobUrl) return;
    const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
    handleTranscribe(blob);
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleTranscribe(selectedFile);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-2">
          <Stethoscope className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Siddhi <span className="text-blue-500">ASR</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Advanced Medical Speech-to-Text for Indian Clinical Contexts. 
          Powered by Whisper & Gemini for high-accuracy medical transcription.
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recording Card */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Mic className="w-5 h-5 text-blue-500" />
              Live Recording
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
              status === 'recording' ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-white/5 text-gray-400'
            }`}>
              {status}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {status !== 'recording' ? (
              <button
                onClick={startRecording}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-medium transition-all active:scale-95"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-medium transition-all active:scale-95"
              >
                <Square className="w-5 h-5" />
                Stop Recording
              </button>
            )}
          </div>

          {mediaBlobUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4 border-t border-white/5"
            >
              <audio src={mediaBlobUrl} controls className="w-full h-10" />
              <button
                onClick={handleRecordedTranscription}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                Transcribe Recording
              </button>
            </motion.div>
          )}
        </div>

        {/* Upload Card */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-500" />
            Upload Audio
          </h2>
          <p className="text-gray-400 text-sm">
            Upload an existing audio file (WAV, MP3, M4A) for medical transcription and summarization.
          </p>
          <label className="relative group cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 group-hover:border-blue-500/50 rounded-2xl p-10 transition-all bg-white/[0.02] group-hover:bg-blue-500/[0.02]">
              <Upload className="w-8 h-8 text-gray-500 group-hover:text-blue-500 mb-2 transition-colors" />
              <span className="text-gray-400 group-hover:text-gray-300 font-medium">
                {file ? file.name : 'Click to browse or drag & drop'}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-400 animate-pulse">Processing medical audio with AI...</p>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4"
          >
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h3 className="text-red-500 font-semibold">Transcription Error</h3>
              <p className="text-red-400/80 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Transcription Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Raw Whisper Output</h3>
                <p className="text-gray-300 leading-relaxed italic">"{result.raw_text}"</p>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-8 space-y-4">
                <h3 className="text-sm font-medium text-blue-500 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Medical Corrected (Gemini)
                </h3>
                <p className="text-white leading-relaxed font-medium">"{result.medical_text}"</p>
              </div>
            </div>

            {/* Summary / Prescription Card */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden">
              <div className="bg-blue-600 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white tracking-tight text-white">Clinical Summary</h2>
                </div>
                <span className="text-blue-100 text-sm font-medium px-3 py-1 bg-white/10 rounded-full">AI Generated</span>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <section className="space-y-3">
                    <h4 className="text-blue-500 font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Reason for Visit
                    </h4>
                    <p className="text-gray-300">{result.summary.reason_for_visit}</p>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-blue-500 font-semibold flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Diagnosis
                    </h4>
                    <p className="text-gray-300">{result.summary.diagnosis}</p>
                  </section>
                </div>

                <div className="space-y-8">
                  <section className="space-y-4">
                    <h4 className="text-blue-500 font-semibold flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Medications
                    </h4>
                    <div className="space-y-3">
                      {result.summary.medications.length > 0 ? (
                        result.summary.medications.map((med, idx) => (
                          <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-white">{med.name}</p>
                              <p className="text-sm text-gray-400">{med.dosage}</p>
                            </div>
                            <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">
                              {med.duration}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No medications listed.</p>
                      )}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-blue-500 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Advice & Follow-up
                    </h4>
                    <p className="text-gray-300">{result.summary.advice}</p>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
