// Configuración de streams alternativos
// Si el stream principal no funciona, puedes usar uno de estos

const STREAMS = {
    // Stream principal de Zeno.fm
    zeno: 'https://stream.zeno.fm/qt55qqa7dbtuv',
    
    // Alternativas (descomenta la que funcione mejor)
    // Usando un proxy CORS público (puede ser lento)
    // zenoCors: 'https://cors-anywhere.herokuapp.com/https://stream.zeno.fm/qt55qqa7dbtuv',
    
    // Stream de prueba (comentado)
    // test: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

// Seleccionar stream activo
let ACTIVE_STREAM = STREAMS.zeno;

// Función para cambiar stream
function switchStream(streamKey) {
    if (STREAMS[streamKey]) {
        ACTIVE_STREAM = STREAMS[streamKey];
        if (window.audioElement) {
            window.audioElement.src = ACTIVE_STREAM;
            console.log('Stream cambiado a:', streamKey);
        }
    }
}

// Exportar
window.switchStream = switchStream;
window.STREAMS = STREAMS;
