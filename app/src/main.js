import { exercises } from './data/exercises.js';
import { generateWeeklyPlan, buildExerciseSequence } from './lib/plan.js';

const exerciseList = document.querySelector('#exerciseList');
const exerciseDetail = document.querySelector('#exerciseDetail');
const planGrid = document.querySelector('#planGrid');
const levelSelect = document.querySelector('#levelSelect');
const recordButton = document.querySelector('#recordButton');
const playbackButton = document.querySelector('#playbackButton');
const audioPlayer = document.querySelector('#audioPlayer');
const noteInput = document.querySelector('#noteInput');
const saveNoteButton = document.querySelector('#saveNoteButton');
const noteStatus = document.querySelector('#noteStatus');
const recorderState = document.querySelector('#recorderState');
const recordingTimer = document.querySelector('#recordingTimer');

const storageKeys = {
  notes: 'diccao.notes',
  recordings: 'diccao.recordings'
};

let currentSelection = 0;
let mediaRecorder = null;
let audioChunks = [];
let mediaStream = null;
let recordingStart = 0;
let recordingTimerId = null;

function renderExercises(level = 'iniciante') {
  const sequence = buildExerciseSequence(exercises, level);
  exerciseList.innerHTML = '';

  sequence.forEach((exercise, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `exercise-item ${index === currentSelection ? 'active' : ''}`;
    button.innerHTML = `
      <h3>${exercise.title}</h3>
      <p>${exercise.duration}</p>
    `;
    button.addEventListener('click', () => {
      currentSelection = index;
      renderExercises(level);
      renderDetail(sequence[index]);
    });
    exerciseList.appendChild(button);
  });

  renderDetail(sequence[currentSelection] || sequence[0]);
}

function renderDetail(exercise) {
  if (!exercise) {
    return;
  }

  exerciseDetail.innerHTML = `
    <span class="tag">${exercise.focus}</span>
    <h3>${exercise.title}</h3>
    <p>${exercise.objective}</p>
    <p><strong>Teste:</strong> ${exercise.prompt}</p>
    <ul>
      ${exercise.steps.map((step) => `<li>${step}</li>`).join('')}
    </ul>
  `;
}

function renderPlan(level = 'iniciante') {
  const plan = generateWeeklyPlan(level);
  planGrid.innerHTML = '';

  plan.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'plan-card';
    card.innerHTML = `
      <p class="day">${item.day}</p>
      <p class="time">${item.minutes} min</p>
      <h3>${item.focus}</h3>
      <p>${item.goal}</p>
    `;
    planGrid.appendChild(card);
  });
}

function loadNote() {
  const note = localStorage.getItem(storageKeys.notes) ?? '';
  noteInput.value = note;
}

function saveNote() {
  const value = noteInput.value.trim();
  localStorage.setItem(storageKeys.notes, value);
  noteStatus.textContent = value
    ? 'Nota salva com sucesso.'
    : 'Nota limpa. Você ainda pode escrever algo novo.';
}

function formatTimer(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

async function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    recorderState.textContent = 'Seu navegador não suporta gravação.';
    return;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const options = { mimeType: 'audio/webm' };
    mediaRecorder = new MediaRecorder(mediaStream, options);
    audioChunks = [];
    recordingStart = Date.now();

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const stored = JSON.parse(localStorage.getItem(storageKeys.recordings) || '[]');
      stored.push({ url: audioUrl, createdAt: new Date().toISOString() });
      localStorage.setItem(storageKeys.recordings, JSON.stringify(stored));
      audioPlayer.src = audioUrl;
      audioPlayer.load();
      recorderState.textContent = 'Gravação salva.';
      clearInterval(recordingTimerId);
      recordingTimer.textContent = '00:00';
      mediaStream?.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    recordButton.textContent = 'Parar';
    recorderState.textContent = 'Gravando...';

    recordingTimerId = setInterval(() => {
      recordingTimer.textContent = formatTimer(Date.now() - recordingStart);
    }, 250);
  } catch (error) {
    console.error(error);
    recorderState.textContent = 'Não foi possível acessar o microfone.';
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    recordButton.textContent = 'Gravar';
  }
}

function playLatestRecording() {
  const recordings = JSON.parse(localStorage.getItem(storageKeys.recordings) || '[]');
  const latest = recordings.at(-1);

  if (!latest) {
    recorderState.textContent = 'Ainda não há gravação para ouvir.';
    return;
  }

  audioPlayer.src = latest.url;
  audioPlayer.play();
  recorderState.textContent = 'Reproduzindo última gravação.';
}

levelSelect.addEventListener('change', (event) => {
  currentSelection = 0;
  renderExercises(event.target.value);
  renderPlan(event.target.value);
});

recordButton.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    stopRecording();
    return;
  }

  startRecording();
});

playbackButton.addEventListener('click', playLatestRecording);
saveNoteButton.addEventListener('click', saveNote);

renderExercises();
renderPlan();
loadNote();
