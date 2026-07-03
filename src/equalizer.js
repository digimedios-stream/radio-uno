// Ecualizador
class Equalizer {
    constructor() {
        this.filters = {};
        this.presets = {
            flat: { 60: 0, 250: 0, 1000: 0, 4000: 0, 16000: 0 },
            pop: { 60: -5, 250: 4, 1000: 4, 4000: 3, 16000: -2 },
            rock: { 60: 5, 250: 3, 1000: -4, 4000: 4, 16000: 3 },
            vocal: { 60: -8, 250: -5, 1000: 4, 4000: 4, 16000: -3 },
            jazz: { 60: 3, 250: 2, 1000: -2, 4000: 2, 16000: 4 },
            classical: { 60: 4, 250: 3, 1000: -3, 4000: 2, 16000: 5 },
            reggaeton: { 60: 8, 250: 5, 1000: -3, 4000: 2, 16000: 4 }
        };
        
        this.currentPreset = 'flat';
        this.init();
    }
    
    init() {
        // Esperar a que el contexto de audio esté disponible
        const checkContext = setInterval(() => {
            if (window.audioContext && window.audioElement && window.audioSource) {
                clearInterval(checkContext);
                this.setupFilters();
                this.setupEventListeners();
                this.loadSavedPreset();
            }
        }, 100);
    }
    
    setupFilters() {
        const audioContext = window.audioContext;
        const audioSource = window.audioSource;
        
        // Crear filtros para cada frecuencia
        const frequencies = [60, 250, 1000, 4000, 16000];
        
        frequencies.forEach(freq => {
            const filter = audioContext.createBiquadFilter();
            filter.type = 'peaking';
            filter.frequency.value = freq;
            filter.Q.value = 1;
            filter.gain.value = 0;
            this.filters[freq] = filter;
        });
        
        // Conectar filtros en cadena (sin desconectar, ya está conectado)
        let lastNode = audioSource;
        
        frequencies.forEach(freq => {
            lastNode.connect(this.filters[freq]);
            lastNode = this.filters[freq];
        });
        
        // Conectar al analizador y al destino
        lastNode.connect(window.analyser);
        
        console.log('Ecualizador configurado correctamente');
    }
    
    setupEventListeners() {
        // Event listeners para sliders
        document.querySelectorAll('.eq-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const freq = parseInt(e.target.dataset.freq);
                const value = parseInt(e.target.value);
                
                // Actualizar valor mostrado
                e.target.parentElement.querySelector('.eq-value').textContent = value;
                
                // Aplicar filtro
                if (this.filters[freq]) {
                    this.filters[freq].gain.value = value;
                    console.log(`Filtro ${freq}Hz: ${value}dB`);
                }
                
                // Marcar preset como personalizado
                this.currentPreset = 'custom';
                this.updatePresetButtons();
                
                // Guardar en localStorage
                this.saveEQSettings();
            });
        });
        
        // Event listeners para presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.applyPreset(preset);
            });
        });
    }
    
    applyPreset(presetName) {
        if (!this.presets[presetName]) return;
        
        const preset = this.presets[presetName];
        
        // Aplicar valores del preset
        Object.entries(preset).forEach(([freq, gain]) => {
            const freqNum = parseInt(freq);
            
            // Actualizar slider
            const slider = document.querySelector(`[data-freq="${freqNum}"]`);
            if (slider) {
                slider.value = gain;
                slider.parentElement.querySelector('.eq-value').textContent = gain;
            }
            
            // Aplicar filtro
            if (this.filters[freqNum]) {
                this.filters[freqNum].gain.value = gain;
                console.log(`Preset ${presetName}: ${freqNum}Hz = ${gain}dB`);
            }
        });
        
        this.currentPreset = presetName;
        this.updatePresetButtons();
        this.saveEQSettings();
    }
    
    updatePresetButtons() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            if (btn.dataset.preset === this.currentPreset) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    saveEQSettings() {
        const settings = {
            preset: this.currentPreset,
            values: {}
        };
        
        document.querySelectorAll('.eq-slider').forEach(slider => {
            const freq = slider.dataset.freq;
            settings.values[freq] = parseInt(slider.value);
        });
        
        localStorage.setItem('eqSettings', JSON.stringify(settings));
    }
    
    loadSavedPreset() {
        const saved = localStorage.getItem('eqSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                if (settings.preset && this.presets[settings.preset]) {
                    this.applyPreset(settings.preset);
                } else if (settings.values) {
                    // Restaurar valores personalizados
                    Object.entries(settings.values).forEach(([freq, gain]) => {
                        const slider = document.querySelector(`[data-freq="${freq}"]`);
                        if (slider) {
                            slider.value = gain;
                            slider.parentElement.querySelector('.eq-value').textContent = gain;
                            
                            if (this.filters[freq]) {
                                this.filters[freq].gain.value = gain;
                            }
                        }
                    });
                    this.currentPreset = 'custom';
                    this.updatePresetButtons();
                }
            } catch (e) {
                console.error('Error al cargar configuración del ecualizador:', e);
            }
        }
    }
}

// Inicializar ecualizador cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Equalizer();
    });
} else {
    new Equalizer();
}
