// Variables globales
let audioContext;
let audioElement;
let analyser;
let isPlaying = false;
let deferredPrompt;

// Elementos del DOM
const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const statusText = document.getElementById('statusText');
const statusDot = document.querySelector('.status-dot');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const equalizerBtn = document.getElementById('equalizerBtn');
const equalizerMenuBtn = document.getElementById('equalizerMenuBtn');
const equalizerModal = document.getElementById('equalizerModal');
const closeEqualizerBtn = document.getElementById('closeEqualizerBtn');
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const dismissBtn = document.getElementById('dismissBtn');
const installMenuBtn = document.getElementById('installMenuBtn');

// Stream URL
const STREAM_URL = 'https://stream.zeno.fm/qt55qqa7dbtuv';

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    setupEventListeners();
    setupPWA();
});

// Inicializar audio
function initAudio() {
    // Crear elemento de audio
    audioElement = new Audio();
    audioElement.crossOrigin = 'anonymous';
    audioElement.src = STREAM_URL;
    
    // Crear contexto de audio
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Crear analizador
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    // Conectar elemento de audio al contexto
    try {
        const source = audioContext.createMediaElementAudioSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    } catch (e) {
        console.warn('No se pudo conectar al analizador:', e);
        // Fallback: conectar directamente al destino
        analyser.connect(audioContext.destination);
    }
    
    // Configurar volumen inicial
    updateVolume();
    
    // Event listeners del audio
    audioElement.addEventListener('play', () => {
        isPlaying = true;
        playBtn.classList.add('playing');
        updateStatus('Reproduciendo', true);
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    });
    
    audioElement.addEventListener('pause', () => {
        isPlaying = false;
        playBtn.classList.remove('playing');
        updateStatus('Pausado', false);
    });
    
    audioElement.addEventListener('error', (e) => {
        updateStatus('Error de conexión', false);
        console.error('Error de audio:', audioElement.error, e);
    });
    
    audioElement.addEventListener('loadstart', () => {
        updateStatus('Conectando...', false);
    });
    
    audioElement.addEventListener('canplay', () => {
        if (isPlaying) {
            updateStatus('Reproduciendo', true);
        }
    });
    
    audioElement.addEventListener('playing', () => {
        updateStatus('Reproduciendo', true);
    });
    
    audioElement.addEventListener('stalled', () => {
        updateStatus('Buffering...', false);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Play/Pause
    playBtn.addEventListener('click', togglePlay);
    
    // Volumen
    volumeSlider.addEventListener('input', updateVolume);
    
    // Menú móvil
    menuBtn.addEventListener('click', toggleMenu);
    
    // Ecualizador
    equalizerBtn.addEventListener('click', openEqualizer);
    equalizerMenuBtn.addEventListener('click', () => {
        closeMenu();
        openEqualizer();
    });
    closeEqualizerBtn.addEventListener('click', closeEqualizer);
    equalizerModal.addEventListener('click', (e) => {
        if (e.target === equalizerModal) {
            closeEqualizer();
        }
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            closeMenu();
        }
    });
}

// Toggle Play/Pause
function togglePlay() {
    // Reanudar contexto de audio si está suspendido
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('Audio context reanudado');
        }).catch(err => {
            console.error('Error al reanudar contexto:', err);
        });
    }
    
    if (isPlaying) {
        audioElement.pause();
    } else {
        // Asegurar que el src está configurado
        if (!audioElement.src) {
            audioElement.src = STREAM_URL;
        }
        
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Reproducción iniciada');
                })
                .catch(err => {
                    console.error('Error al reproducir:', err);
                    updateStatus('Error: ' + err.message, false);
                });
        }
    }
}

// Actualizar volumen
function updateVolume() {
    const volume = volumeSlider.value / 100;
    audioElement.volume = volume;
    volumeValue.textContent = volumeSlider.value + '%';
    
    // Guardar en localStorage
    localStorage.setItem('radioVolume', volumeSlider.value);
}

// Actualizar estado
function updateStatus(text, connected) {
    statusText.textContent = text;
    if (connected) {
        statusDot.classList.add('connected');
    } else {
        statusDot.classList.remove('connected');
    }
}

// Toggle menú móvil
function toggleMenu() {
    mobileMenu.classList.toggle('hidden');
    menuBtn.classList.toggle('active');
}

function closeMenu() {
    mobileMenu.classList.add('hidden');
    menuBtn.classList.remove('active');
}

// Ecualizador
function openEqualizer() {
    equalizerModal.classList.remove('hidden');
}

function closeEqualizer() {
    equalizerModal.classList.add('hidden');
}

// PWA Setup
function setupPWA() {
    // Escuchar evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    // Escuchar si ya está instalada
    window.addEventListener('appinstalled', () => {
        console.log('App instalada');
        deferredPrompt = null;
        installPrompt.classList.add('hidden');
    });
    
    // Restaurar volumen guardado
    const savedVolume = localStorage.getItem('radioVolume');
    if (savedVolume) {
        volumeSlider.value = savedVolume;
        updateVolume();
    }
}

function showInstallPrompt() {
    installPrompt.classList.remove('hidden');
}

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Usuario respondió: ${outcome}`);
        deferredPrompt = null;
        installPrompt.classList.add('hidden');
    }
});

dismissBtn.addEventListener('click', () => {
    installPrompt.classList.add('hidden');
});

installMenuBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Usuario respondió: ${outcome}`);
        deferredPrompt = null;
        installPrompt.classList.add('hidden');
    } else {
        alert('La app ya está instalada o no está disponible para instalar');
    }
    closeMenu();
});

// Exportar para otros módulos
window.audioContext = audioContext;
window.audioElement = audioElement;
window.analyser = analyser;
