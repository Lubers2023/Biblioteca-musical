// Base de datos de Teoría Musical
const NOTES_NAMING = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

const DATA = {
    // Escalas
    "scale-major": { name: "Escala Mayor (Jónica)", intervals: [0, 2, 4, 5, 7, 9, 11], formula: "T - T - S - T - T - T - S", desc: "Base de la armonía funcional en la música occidental." },
    "scale-minor-nat": { name: "Escala Menor Natural", intervals: [0, 2, 3, 5, 7, 8, 10], formula: "T - S - T - T - S - T - T", desc: "Posee un carácter melancólico o sombrío." },
    "scale-minor-harm": { name: "Escala Menor Armónica", intervals: [0, 2, 3, 5, 7, 8, 11], formula: "T - S - T - T - S - T.5 - S", desc: "Con 7mo grado elevado, típica de la música clásica y flamenca." },
    "scale-minor-mel": { name: "Escala Menor Melódica", intervals: [0, 2, 3, 5, 7, 9, 11], formula: "T - S - T - T - T - T - S", desc: "Suaviza el salto de la menor armónica elevando también el 6to grado." },
    "scale-penta-maj": { name: "Pentatónica Mayor", intervals: [0, 2, 4, 7, 9], formula: "1 - 2 - 3 - 5 - 6", desc: "Escala de 5 notas ampliamente usada en Folk, Pop y Country." },
    "scale-penta-min": { name: "Pentatónica Menor / Blues", intervals: [0, 3, 5, 7, 10], formula: "1 - b3 - 4 - 5 - b7", desc: "Fundamental en el Rock, Blues e improvisación." },

    // Modos
    "mode-dorian": { name: "Modo Dórico", intervals: [0, 2, 3, 5, 7, 9, 10], formula: "1 - 2 - b3 - 4 - 5 - 6 - b7", desc: "Menor con 6ta mayor, sonido Jazzero / Funk." },
    "mode-phrygian": { name: "Modo Frigio", intervals: [0, 1, 3, 5, 7, 8, 10], formula: "1 - b2 - b3 - 4 - 5 - b6 - b7", desc: "Característico por su 2da menor, muy usado en flamenco y metal." },
    "mode-lydian": { name: "Modo Lidio", intervals: [0, 2, 4, 6, 7, 9, 11], formula: "1 - 2 - 3 - #4 - 5 - 6 - 7", desc: "Mayor con 4ta aumentada, genera un ambiente místico/espacial." },
    "mode-mixolydian": { name: "Modo Mixolidio", intervals: [0, 2, 4, 5, 7, 9, 10], formula: "1 - 2 - 3 - 4 - 5 - 6 - b7", desc: "Mayor con 7ma menor, sonido clásico del Blues y Rock." },
    "mode-locrian": { name: "Modo Lócrio", intervals: [0, 1, 3, 5, 6, 8, 10], formula: "1 - b2 - b3 - 4 - b5 - b6 - b7", desc: "Inestable y tenso por su 5ta disminuida." },

    // Acordes
    "chord-maj": { name: "Acorde Mayor", intervals: [0, 4, 7], formula: "1 - 3 - 5 (Tríada)", desc: "Sonido estable, brillante y alegre." },
    "chord-min": { name: "Acorde Menor", intervals: [0, 3, 7], formula: "1 - b3 - 5 (Tríada)", desc: "Sonido suave, triste o introspectivo." },
    "chord-dim": { name: "Acorde Disminuido", intervals: [0, 3, 6], formula: "1 - b3 - b5 (Tríada)", desc: "Tensión alta, requiere resolución." },
    "chord-aug": { name: "Acorde Aumentado", intervals: [0, 4, 8], formula: "1 - 3 - #5 (Tríada)", desc: "Sonido flotante e inestable." },
    "chord-sus2": { name: "Acorde Suspendido 2", intervals: [0, 2, 7], formula: "1 - 2 - 5", desc: "Sin tercera, sonido abierto y ambiguo." },
    "chord-sus4": { name: "Acorde Suspendido 4", intervals: [0, 5, 7], formula: "1 - 4 - 5", desc: "Crea una tensión armónica que suele resolver en la 3ra." },
    "chord-maj7": { name: "Acorde Mayor 7", intervals: [0, 4, 7, 11], formula: "1 - 3 - 5 - 7", desc: "Muy común en el Jazz, Bossanova y Pop suave." },
    "chord-min7": { name: "Acorde Menor 7", intervals: [0, 3, 7, 10], formula: "1 - b3 - 5 - b7", desc: "Suave, sofisticado, base del Neo-Soul y Jazz." },
    "chord-dom7": { name: "Acorde Dominante 7", intervals: [0, 4, 7, 10], formula: "1 - 3 - 5 - b7", desc: "El acorde de tensión por excelencia en el Blues y música tonal." },
    "chord-m7b5": { name: "Semidisminuido (m7b5)", intervals: [0, 3, 6, 10], formula: "1 - b3 - b5 - b7", desc: "Usado frecuentemente como II grado en tonalidades menores." },
    "chord-dim7": { name: "Disminuido 7", intervals: [0, 3, 6, 9], formula: "1 - b3 - b5 - bb7", desc: "Acorde simétrico de máxima tensión dramática." }
};

// Sintetizador con Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playNote(freq, duration = 1.0, delay = 0) {
    setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }, delay * 1000);
}

function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}

// Inicializar Instrumentos en el DOM
function buildPiano() {
    const pianoEl = document.getElementById('piano-keyboard');
    pianoEl.innerHTML = '';
    
    // Generar 2 Octavas (del MIDI 60/C4 al 83/B5)
    for (let midi = 60; midi < 84; midi++) {
        const noteIndex = midi % 12;
        const isBlack = [1, 3, 6, 8, 10].includes(noteIndex);
        
        const key = document.createElement('div');
        key.className = `key ${isBlack ? 'black' : 'white'}`;
        key.dataset.midi = midi;
        key.dataset.note = noteIndex;

        const label = document.createElement('span');
        label.className = 'key-label';
        label.innerText = NOTES_NAMING[noteIndex];
        key.appendChild(label);

        key.addEventListener('click', () => {
            playNote(midiToFreq(midi));
        });

        pianoEl.appendChild(key);
    }
}

function buildGuitar() {
    const fretboardEl = document.getElementById('fretboard');
    fretboardEl.innerHTML = '';
    
    // Afinación estándar (E4, B3, G3, D3, A2, E2)
    const tuningMIDI = [64, 59, 55, 50, 45, 40];

    tuningMIDI.forEach(stringBaseMidi => {
        const stringEl = document.createElement('div');
        stringEl.className = 'string';

        for (let fret = 0; fret <= 12; fret++) {
            const currentMidi = stringBaseMidi + fret;
            const noteIndex = currentMidi % 12;

            const fretEl = document.createElement('div');
            fretEl.className = 'fret';

            const noteDot = document.createElement('div');
            noteDot.className = 'fret-note';
            noteDot.dataset.note = noteIndex;
            noteDot.innerText = NOTES_NAMING[noteIndex];

            fretEl.appendChild(noteDot);
            stringEl.appendChild(fretEl);
        }
        fretboardEl.appendChild(stringEl);
    });
}

// Actualización de UI y Resaltado de Notas
function updateUI() {
    const rootVal = parseInt(document.getElementById('root-note').value);
    const catKey = document.getElementById('category-select').value;
    const selectedData = DATA[catKey];

    // Actualizar Texto
    const rootName = NOTES_NAMING[rootVal];
    document.getElementById('info-title').innerText = `${selectedData.name} de ${rootName}`;
    document.getElementById('info-formula').innerText = selectedData.formula;
    document.getElementById('info-desc').innerText = selectedData.desc;

    // Calcular notas activas
    const activeNotes = selectedData.intervals.map(interval => (rootVal + interval) % 12);
    
    // Mostrar nombres de las notas
    const activeNames = activeNotes.map(n => NOTES_NAMING[n]);
    document.getElementById('info-notes').innerText = activeNames.join(' - ');

    // Actualizar Piano
    document.querySelectorAll('.key').forEach(key => {
        const keyNote = parseInt(key.dataset.note);
        key.classList.remove('active', 'root');
        if (keyNote === rootVal) {
            key.classList.add('root');
        } else if (activeNotes.includes(keyNote)) {
            key.classList.add('active');
        }
    });

    // Actualizar Guitarra
    document.querySelectorAll('.fret-note').forEach(dot => {
        const dotNote = parseInt(dot.dataset.note);
        dot.classList.remove('active', 'root');
        if (dotNote === rootVal) {
            dot.classList.add('root');
        } else if (activeNotes.includes(dotNote)) {
            dot.classList.add('active');
        }
    });
}

// Reproducción
function playCurrent(isArpeggio = false) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const rootVal = parseInt(document.getElementById('root-note').value);
    const catKey = document.getElementById('category-select').value;
    const intervals = DATA[catKey].intervals;

    const baseMidi = 60 + rootVal; // C4 base

    intervals.forEach((interval, index) => {
        const midi = baseMidi + interval;
        const delay = isArpeggio ? index * 0.25 : 0;
        playNote(midiToFreq(midi), 1.2, delay);
    });
}

// Event Listeners y Manejo de Pestañas
document.addEventListener('DOMContentLoaded', () => {
    buildPiano();
    buildGuitar();
    updateUI();

    document.getElementById('root-note').addEventListener('change', updateUI);
    document.getElementById('category-select').addEventListener('change', updateUI);

    document.getElementById('btn-play').addEventListener('click', () => playCurrent(false));
    document.getElementById('btn-arpeggio').addEventListener('click', () => playCurrent(true));

    // Tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-view`).classList.add('active');
        });
    });
});