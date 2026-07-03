// PWA Installer
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        // Escuchar evento beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
        
        // Escuchar si ya está instalada
        window.addEventListener('appinstalled', () => {
            console.log('PWA instalada correctamente');
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        });
        
        // Detectar si está en modo standalone (instalada)
        if (this.isStandalone()) {
            this.hideInstallPrompt();
        }
    }
    
    showInstallPrompt() {
        const installPrompt = document.getElementById('installPrompt');
        if (installPrompt) {
            installPrompt.classList.remove('hidden');
        }
    }
    
    hideInstallPrompt() {
        const installPrompt = document.getElementById('installPrompt');
        if (installPrompt) {
            installPrompt.classList.add('hidden');
        }
    }
    
    isStandalone() {
        return window.navigator.standalone === true ||
               window.matchMedia('(display-mode: standalone)').matches ||
               window.matchMedia('(display-mode: fullscreen)').matches;
    }
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PWAInstaller();
    });
} else {
    new PWAInstaller();
}
