/* =======================
   DOM ELEMENTS
======================= */
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const uploadBtn = document.getElementById("uploadBtn");
const audioFile = document.getElementById("audioFile");

const rawTextDiv = document.getElementById("rawText");
const medicalTextDiv = document.getElementById("medicalText");

const playBtn = document.getElementById("playBtn");
const timeSpan = document.getElementById("time");

const reasonVisitSpan = document.getElementById("reasonVisit");
const diagnosisSpan = document.getElementById("diagnosis");
const medicationsList = document.getElementById("medicationsList");
const adviceSpan = document.getElementById("advice");

/* =======================
   STATE
======================= */
let mediaRecorder;
let audioChunks = [];
let currentAudioBlob = null;

/* =======================
   WAVESURFER INIT
======================= */
const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "#334155",
  progressColor: "#22d3ee",
  cursorColor: "#67e8f9",
  height: 90,
  barWidth: 2,
  barGap: 2,
  responsive: true,
});

/* =======================
   LOAD AUDIO INTO WAVES
======================= */
function loadAudio(blob) {
  const url = URL.createObjectURL(blob);
  wavesurfer.load(url);
  currentAudioBlob = blob;
}

/* =======================
   RECORD AUDIO
======================= */
recordBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    loadAudio(blob);
  };

  mediaRecorder.start();
  recordBtn.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  recordBtn.disabled = false;
  stopBtn.disabled = true;
};

/* =======================
   UPLOAD AUDIO FILE
======================= */
audioFile.onchange = () => {
  if (!audioFile.files[0]) return;
  loadAudio(audioFile.files[0]);
};

/* =======================
   PLAY / PAUSE
======================= */
playBtn.onclick = () => {
  wavesurfer.playPause();
};

wavesurfer.on("play", () => {
  playBtn.innerText = "⏸ Pause";
});

wavesurfer.on("pause", () => {
  playBtn.innerText = "▶️ Play";
});

/* =======================
   TIME UPDATE
======================= */
wavesurfer.on("audioprocess", () => {
  const t = Math.floor(wavesurfer.getCurrentTime());
  timeSpan.innerText =
    `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
});

/* =======================
   TRANSCRIBE
======================= */
uploadBtn.onclick = async () => {
  if (!currentAudioBlob) {
    alert("Please record or select an audio file first");
    return;
  }

  const formData = new FormData();
  formData.append("file", currentAudioBlob);

  uploadBtn.innerText = "⏳ Transcribing...";
  uploadBtn.disabled = true;

  try {
    const res = await fetch("http://127.0.0.1:8000/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    renderResult(data);
  } catch (err) {
    alert("Transcription failed");
    console.error(err);
  }

  uploadBtn.innerText = "⬆️ Transcribe";
  uploadBtn.disabled = false;
};

/* =======================
   DIFF HIGHLIGHTING
======================= */
function highlightDiff(oldText, newText) {
  const oldWords = oldText.split(" ");
  const newWords = newText.split(" ");

  return newWords
    .map(word =>
      oldWords.includes(word)
        ? word
        : `<span class="added">${word}</span>`
    )
    .join(" ");
}

/* =======================
   RENDER RESULT
======================= */
// function renderResult(data) {
//   rawTextDiv.innerText = data.raw_text || "-";

//   medicalTextDiv.innerHTML = highlightDiff(
//     data.raw_text || "",
//     data.medical_text || ""
//   );
// }

function renderResult(data) {
  rawTextDiv.innerText = data.raw_text || "-";

  medicalTextDiv.innerHTML = highlightDiff(
    data.raw_text || "",
    data.medical_text || ""
  );

  // ===== Structured Summary Rendering =====
  if (!data.summary) return;

  const summary = data.summary;

  reasonVisitSpan.textContent =
    summary.reason_for_visit || "-";

  diagnosisSpan.textContent =
    summary.diagnosis || "-";

  adviceSpan.textContent =
    summary.advice || "-";

  medicationsList.innerHTML = "";

  if (!summary.medications || summary.medications.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No medications prescribed";
    medicationsList.appendChild(li);
  } else {
    summary.medications.forEach(med => {
      const li = document.createElement("li");

      li.textContent =
        `${med.name} | Dosage: ${med.dosage || "N/A"} | Duration: ${med.duration || "N/A"}`;

      medicationsList.appendChild(li);
    });
  }
}
