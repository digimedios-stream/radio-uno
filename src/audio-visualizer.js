// Visualizador de espectro
class AudioVisualizer {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.bars = document.querySelectorAll('.bar');
        this.dataArray = null;
        this.bufferLength = 0;
        this.animationId = null;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.start();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    start() {
        // Esperar a que el analizador esté disponible
        const checkAnalyser = setInterval(() => {
            if (window.analyser) {
                clearInterval(checkAnalyser);
                this.analyser = window.analyser;
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
                this.animate();
            }
        }, 100);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (!this.analyser) return;
        
        // Obtener datos de frecuencia
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Limpiar canvas
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);
        
        // Dibujar visualizador
        this.drawVisualizer();
        
        // Actualizar barras
        this.updateBars();
    }
    
    drawVisualizer() {
        const width = this.canvas.width / window.devicePixelRatio;
        const height = this.canvas.height / window.devicePixelRatio;
        const barWidth = width / this.bufferLength * 2.5;
        let x = 0;
        
        // Crear gradiente
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.6)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.4)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.bufferLength; i++) {
            const barHeight = (this.dataArray[i] / 255) * height * 0.8;
            
            // Dibujar barra
            this.ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            
            // Efecto de brillo
            this.ctx.strokeRect(x, height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
        
        // Dibujar línea de onda suave
        this.drawWaveform();
    }
    
    drawWaveform() {
        const width = this.canvas.width / window.devicePixelRatio;
        const height = this.canvas.height / window.devicePixelRatio;
        const centerY = height / 2;
        
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        const sliceWidth = width / this.bufferLength;
        let x = 0;
        
        for (let i = 0; i < this.bufferLength; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = (v * height) / 4 + centerY;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        this.ctx.lineTo(width, centerY);
        this.ctx.stroke();
    }
    
    updateBars() {
        // Actualizar barras pequeñas en la parte inferior
        const step = Math.floor(this.bufferLength / this.bars.length);
        
        this.bars.forEach((bar, index) => {
            const value = this.dataArray[index * step];
            const height = (value / 255) * 100;
            bar.style.height = Math.max(20, height) + 'px';
        });
    }
}

// Inicializar visualizador cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AudioVisualizer();
    });
} else {
    new AudioVisualizer();
}
