// Variables globales
let audioContext;
let audioElement;
let analyser;
let gainNode;
let compressorNode;
let audioSource; // Guardar la fuente de audio
let isPlaying = false;
let deferredPrompt;
let autoplayUnlockBound = false;

// Elementos del DOM
const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const statusText = document.getElementById('statusText');
const statusDot = document.querySelector('.status-dot');
const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const equalizerBtn = document.getElementById('equalizerBtn');
const equalizerMenuBtn = document.getElementById('equalizerMenuBtn');
const equalizerModal = document.getElementById('equalizerModal');
const closeEqualizerBtn = document.getElementById('closeEqualizerBtn');
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const dismissBtn = document.getElementById('dismissBtn');
const installMenuBtn = document.getElementById('installMenuBtn');
const shareBtn = document.getElementById('shareBtn');

// Stream URL - Usando proxy CORS para evitar restricciones
// Se carga desde streams-config.js
let STREAM_URL = 'https://stream.zeno.fm/qt55qqa7dbtuv';

// Configuración de streams alternativos
const STREAMS = {
    // Stream principal de Zeno.fm
    zeno: 'https://stream.zeno.fm/qt55qqa7dbtuv',

    // Usando un proxy CORS público (puede ser lento pero funciona en desarrollo local)
    zenoCors: 'https://cors-anywhere.herokuapp.com/https://stream.zeno.fm/qt55qqa7dbtuv',

    // Stream de prueba (para verificar que la app funciona)
    test: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

// Función para cambiar stream
function switchStream(streamKey) {
    if (STREAMS[streamKey]) {
        STREAM_URL = STREAMS[streamKey];
        if (window.audioElement) {
            window.audioElement.src = STREAM_URL;
            console.log('Stream cambiado a:', streamKey, '→', STREAM_URL);
        }
    } else {
        console.error('Stream no encontrado:', streamKey);
        console.log('Streams disponibles:', Object.keys(STREAMS));
    }
}

// Exportar
window.switchStream = switchStream;
window.STREAMS = STREAMS;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Restaurar volumen guardado ANTES de inicializar el audio
    const savedVolume = localStorage.getItem('radioVolumeV2');
    if (savedVolume !== null) {
        volumeSlider.value = savedVolume;
    } else {
        volumeSlider.value = 150; // 150% por defecto (Modo Amplificado)
    }

    initAudio();
    initMetadata(); // Inicializar obtención de metadatos
    setupEventListeners();
    setupPWA();
    attemptAutoplay(); // Intentar reproducción automática al abrir la PWA
});

// Actualizar ícono del botón Play/Pause
function updatePlayButtonIcon(playing) {
    if (!playBtn) return;
    if (playing) {
        playBtn.classList.add('playing');
        playBtn.setAttribute('aria-label', 'Pausar');
        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="margin-left: 0;">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
        `;
    } else {
        playBtn.classList.remove('playing');
        playBtn.setAttribute('aria-label', 'Reproducir');
        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
        `;
    }
}

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

    // Crear nodo de ganancia (Amplificador de volumen)
    gainNode = audioContext.createGain();
    gainNode.gain.value = 1.5;

    // Crear analizador
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    // Conectar elemento de audio al contexto (solo una vez)
    if (!audioSource) {
        try {
            audioSource = audioContext.createMediaElementSource(audioElement);
            audioSource.connect(gainNode);
            gainNode.connect(analyser);
            analyser.connect(audioContext.destination);
            console.log('Audio source y amplificador conectados correctamente');
        } catch (e) {
            console.warn('No se pudo conectar al analizador:', e);
            analyser.connect(audioContext.destination);
        }
    }

    // Exportar para otros módulos
    window.audioContext = audioContext;
    window.audioElement = audioElement;
    window.analyser = analyser;
    window.gainNode = gainNode;
    window.audioSource = audioSource;

    // Configurar volumen inicial
    updateVolume();

    // Timeout para detectar si no se conecta
    let connectionTimeout;

    // Event listeners del audio
    audioElement.addEventListener('play', () => {
        isPlaying = true;
        updatePlayButtonIcon(true);
        updateStatus('Reproduciendo', true);
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        // Limpiar timeout si se conecta
        clearTimeout(connectionTimeout);
    });

    audioElement.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayButtonIcon(false);
        updateStatus('Pausado', false);
        clearTimeout(connectionTimeout);
    });

    audioElement.addEventListener('error', (e) => {
        clearTimeout(connectionTimeout);
        const errorCode = audioElement.error?.code;
        let errorMsg = 'Error de conexión';

        if (errorCode === 4) {
            errorMsg = 'Formato no soportado';
        } else if (errorCode === 3) {
            errorMsg = 'Descarga interrumpida';
        } else if (errorCode === 2) {
            errorMsg = 'Error de red';
        }

        updateStatus(errorMsg, false);
        console.error('Error de audio:', audioElement.error, e);
    });

    audioElement.addEventListener('loadstart', () => {
        updateStatus('Conectando...', false);

        // Timeout de 10 segundos para conectar
        connectionTimeout = setTimeout(() => {
            if (!isPlaying) {
                updateStatus('Timeout de conexión', false);
                console.warn('Timeout: No se pudo conectar al stream');
            }
        }, 10000);
    });

    audioElement.addEventListener('canplay', () => {
        clearTimeout(connectionTimeout);
        if (isPlaying) {
            updateStatus('Reproduciendo', true);
        }
    });

    audioElement.addEventListener('playing', () => {
        clearTimeout(connectionTimeout);
        updateStatus('Reproduciendo', true);
    });

    audioElement.addEventListener('stalled', () => {
        updateStatus('Buffering...', false);
    });

    audioElement.addEventListener('loadedmetadata', () => {
        console.log('Metadata cargado');
    });
}

// Inicializar la obtención de metadatos de Zeno.fm (Now Playing)
function initMetadata() {
    const nowPlayingElement = document.getElementById('nowPlaying');
    // El ID de la estación de Zeno se extrae de la URL: qt55qqa7dbtuv
    const zenoStationId = 'qt55qqa7dbtuv';
    const sseUrl = `https://api.zeno.fm/mounts/metadata/subscribe/${zenoStationId}`;

    if (window.EventSource) {
        const source = new EventSource(sseUrl);

        source.addEventListener('message', (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.streamTitle) {
                    nowPlayingElement.textContent = `🎵 ${data.streamTitle}`;
                    nowPlayingElement.classList.remove('loading-text');
                } else {
                    nowPlayingElement.textContent = '🎵 Radio Uno Casereña';
                }
            } catch (err) {
                console.error('Error parseando metadatos:', err);
            }
        });

        source.addEventListener('error', (e) => {
            console.error('Error de conexión SSE con Zeno.fm');
            // source.close(); // Opcionalmente cerrar si falla mucho
        });
    } else {
        nowPlayingElement.textContent = '🎵 Radio Uno Casereña (Metadatos no soportados)';
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Play/Pause
    playBtn.addEventListener('click', togglePlay);

    // Volumen
    volumeSlider.addEventListener('input', updateVolume);

    // Menú móvil
    menuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', closeMenu);

    // Compartir está manejado en línea en index.html para evitar problemas de caché

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
        if (!mobileMenu.classList.contains('hidden') && !menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            closeMenu();
        }
    });
}

// Iniciar reproducción automáticamente al abrir la PWA
function attemptAutoplay() {
    if (isPlaying) return;

    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
    }

    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Reproducción automática iniciada');
            })
            .catch(() => {
                isPlaying = false;
                updatePlayButtonIcon(false);
                console.log('Autoplay bloqueado hasta el primer toque');
                updateStatus('Toca para escuchar', false);
                bindAutoplayUnlock();
            });
    }
}

// Si el navegador bloquea el autoplay inicial, iniciar al primer toque en pantalla
function bindAutoplayUnlock() {
    if (autoplayUnlockBound) return;
    autoplayUnlockBound = true;

    const unlockHandler = (e) => {
        document.removeEventListener('click', unlockHandler);
        autoplayUnlockBound = false;

        // Si tocó el botón Play directamente, su propio listener togglePlay lo manejará
        if (e && e.target && playBtn && playBtn.contains(e.target)) {
            return;
        }

        if (!isPlaying) {
            togglePlay();
        }
    };

    document.addEventListener('click', unlockHandler);
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
        if (!audioElement.src || audioElement.error) {
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
                    // Reintentar recargando el stream si quedó interrumpido
                    audioElement.src = STREAM_URL;
                    audioElement.play().catch(err2 => {
                        updateStatus('Error: ' + err2.message, false);
                    });
                });
        }
    }
}

// Actualizar volumen (Soporta de 0% a 200% con amplificador Web Audio)
function updateVolume() {
    const rawValue = parseInt(volumeSlider.value, 10);
    const volume = rawValue / 100; // 0.0 a 2.0

    // Mantener el volumen nativo hasta 1.0 y amplificar con gainNode
    audioElement.volume = Math.min(1.0, volume);
    if (gainNode) {
        gainNode.gain.value = volume * 1.8;
    }

    volumeValue.textContent = rawValue + '%';
    if (rawValue > 100) {
        volumeValue.classList.add('boosted');
    } else {
        volumeValue.classList.remove('boosted');
    }

    // Guardar en localStorage
    localStorage.setItem('radioVolumeV2', rawValue);
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


