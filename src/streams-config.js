// Configuración de streams alternativos
// Si el stream principal no funciona, puedes usar uno de estos

const STREAMS = {
    // Stream principal de Zeno.fm
    zeno: 'https://stream.zeno.fm/qt55qqa7dbtuv',
    
    // Usando un proxy CORS público (puede ser lento pero funciona en desarrollo local)
    zenoCors: 'https://cors-anywhere.herokuapp.com/https://stream.zeno.fm/qt55qqa7dbtuv',
    
    // Stream de prueba (para verificar que la app funciona)
    test: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

// Seleccionar stream activo
// Cambia esto si el stream principal no funciona
let ACTIVE_STREAM = STREAMS.zeno;

// Para desarrollo local, descomenta una de estas líneas:
// let ACTIVE_STREAM = STREAMS.zenoCors;  // Usa proxy CORS
// let ACTIVE_STREAM = STREAMS.test;      // Usa stream de prueba

// Función para cambiar stream
function switchStream(streamKey) {
    if (STREAMS[streamKey]) {
        ACTIVE_STREAM = STREAMS[streamKey];
        if (window.audioElement) {
            window.audioElement.src = ACTIVE_STREAM;
            console.log('Stream cambiado a:', streamKey, '→', ACTIVE_STREAM);
        }
    } else {
        console.error('Stream no encontrado:', streamKey);
        console.log('Streams disponibles:', Object.keys(STREAMS));
    }
}

// Exportar
window.switchStream = switchStream;
window.STREAMS = STREAMS;

// Log de información
console.log('📻 Radio Uno Casereña - Streams disponibles:');
console.log('Streams:', Object.keys(STREAMS));
console.log('Stream activo:', ACTIVE_STREAM);
console.log('Para cambiar: switchStream("test") o switchStream("zenoCors")');
