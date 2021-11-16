const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const NOTES_MAP = {
  'C1': 32.703,
  'D1': 36.708,
  'E1': 41.203,
  'F1': 43.654,
  'G1': 48.999,
  'A1': 55.000,
  'B1': 61.735,
  'C2': 65.406,
  'D2': 73.416,
  'E2': 82.407,
  'F2': 87.307,
  'G2': 97.999,
  'A2': 110.00,
  'B2': 123.47,
  'C3': 130.81,
  'D3': 146.83,
  'E3': 164.81,
  'F3': 174.61,
  'G3': 196.00,
  'A3': 220.00,
  'B3': 246.94,
  'C4': 261.63,
  'D4': 293.66,
  'E4': 329.63,
  'F4': 349.23,
  'G4': 392.00,
  'A4': 440.00,
  'B4': 493.88,
  'C5': 523.25,
  'D5': 587.32,
  'E5': 659.26,
  'F5': 698.46,
  'G5': 783.99,
  'A5': 880.00,
  'B5': 987.77,
  'C6': 1046.5,
  'D6': 1174.7,
  'E6': 1318.5,
  'F6': 1396.9,
  'G6': 1568.0,
  'A6': 1760.0,
  'B6': 1975.5,
  'C7': 2093.0,
  'D7': 2349.3,
  'E7': 2637.0,
  'F7': 2793.8,
  'G7': 3136.0,
  'A7': 3520.0,
  'B7': 3951.1,
  'C8': 4186.0,
  'D8': 4698.6,
  'E8': 5274.0,
  'F8': 5587.7,
  'G8': 6271.9,
  'A8': 7040.0,
  'B8': 7902.1,
  'C#1': 34.648,
  'C#2': 69.296,
  'C#3': 138.59,
  'C#4': 277.18,
  'C#5': 554.37,
  'C#6': 1108.7,
  'C#7': 2217.5,
  'C#8': 4434.9,
  'D#1': 38.891,
  'D#2': 77.782,
  'D#3': 155.56,
  'D#4': 311.13,
  'D#5': 622.25,
  'D#6': 1244.5,
  'D#7': 2489.0,
  'D#8': 4978.0,
  'F#1': 46.249,
  'F#2': 92.499,
  'F#3': 185.00,
  'F#4': 369.99,
  'F#5': 739.99,
  'F#6': 1480.0,
  'F#7': 2960.0,
  'F#8': 5919.9,
  'G#1': 51.913,
  'G#2': 103.83,
  'G#3': 207.65,
  'G#4': 415.30,
  'G#5': 830.61,
  'G#6': 1661.2,
  'G#7': 3322.4,
  'G#8': 6644.9,
  'A#1': 58.270,
  'A#2': 116.54,
  'A#3': 233.08,
  'A#4': 466.16,
  'A#5': 932.33,
  'A#6': 1864.7,
  'A#7': 3729.3,
  'A#8': 7458.6,
};

class Sound {
  constructor(context) {
    this.context = context;
  }

  init() {
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
  }

  play(note, prevDuration) {
    // create and connect oscillator and gain nodes
    this.init();
    this.time = this.context.currentTime;

    // setup sound
    this.oscillator.type = osctypeInput.value || 'sine';
    this.oscillator.frequency.value = note.frequency;
    this.gainNode.gain.setValueAtTime(0.3, this.time + prevDuration);

    // play sound
    this.oscillator.start(this.time + prevDuration);
    this.gainNode.gain.exponentialRampToValueAtTime(0.1, this.time + prevDuration + note.duration);
    this.oscillator.stop(this.time + prevDuration + note.duration);
  }

  // stop() {
  //   this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1);
  //   this.oscillator.stop(this.context.currentTime + 1);
  // }
}

const playButton = document.getElementById('play-button');
const textarea = document.getElementById('textarea');
const tempoInput = document.getElementById('tempo');
const osctypeInput = document.getElementById('osctype');
playButton.addEventListener('click', play);

function play(event) {
  event.preventDefault();
  // audioContext.resume().then(() => {
  //   console.log('Playback resumed successfully');

  // if (playButton.textContent === 'Play') {
  const noteCode = textarea.value;

  if (!noteCode) {
    return;
  }

  const notes = parseNoteCode(noteCode);
  const sound = new Sound(audioContext);

  notes.reduce((delay, {duration, frequency}) => {
    sound.play({frequency, duration}, delay);

    return round(delay + duration);
  }, 0);
    // sound.stop();

    // playButton.textContent = 'Pause';
  // } else {
  //   sound.sto/p();
  //   playButton.textContent = 'Play';
  // }
  // });

}

function parseNoteCode(noteCode) {
  const tempo = tempoInput.value || 100;
  const noteData = noteCode.replace(/\n/g, ' ',).split(' ');
  const notes = [];

  noteData.forEach(item => {
    const itemArr = item.split('/');
    const frequency = itemArr[0] ? NOTES_MAP[itemArr[0]] : null;

    if (frequency) {
      let multiplier = 1;

      if (itemArr[1].includes('.')) {
        multiplier = 1.5;
        itemArr[1] = itemArr[1].replace('.', '');
      }

      const duration = multiplier / +itemArr[1];
      const note = {
        frequency,
        duration: this.noteDurationToMs(tempo, duration),
      };

      notes.push(note);
    }
  });

  return notes;
}

function noteDurationToMs (tempo, duration) {
  return 60 * 4 * round(duration) / tempo;
}

function round(value) {
  return Math.round((value) * 100) / 100;
}
