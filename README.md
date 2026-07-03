# Radio Uno Casereña 90.7 MHz

Una aplicación web moderna y responsiva para transmisión en vivo de Radio Uno Casereña.

## Características

✨ **Moderno y Responsivo**
- Diseño 100% responsive (mobile-first)
- Interfaz elegante con tema oscuro
- Animaciones suaves y transiciones

🎵 **Reproductor de Audio**
- Transmisión en vivo desde Zeno.fm
- Controles de play/pause
- Control de volumen
- Indicador de estado de conexión

📊 **Visualizador de Espectro**
- Visualizador de espectro en tiempo real
- Sincronizado con el audio
- Barras animadas en la parte inferior

🎚️ **Ecualizador Avanzado**
- 7 presets preconfigurados:
  - Plano
  - Pop
  - Rock
  - Vocal
  - Jazz
  - Clásica
  - Reggaeton
- 5 bandas de frecuencia ajustables
- Persistencia de configuración en LocalStorage

📱 **Progressive Web App (PWA)**
- Instalable en PC, iOS y Android
- Funciona offline (interfaz)
- Prompt de instalación automático
- Opción de instalar desde el menú

🔗 **Enlaces Rápidos**
- Facebook
- Ubicación en Google Maps
- Placeholder para WhatsApp

## Instalación

### Opción 1: GitHub Pages (Recomendado)

1. Haz fork de este repositorio
2. Ve a Settings → Pages
3. Selecciona `main` como rama de publicación
4. Tu app estará disponible en `https://tu-usuario.github.io/radio-uno-casereña`

### Opción 2: Servidor Local

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## Uso

### Reproducir
1. Abre la app
2. Haz clic en el botón play circular grande
3. Ajusta el volumen con el slider

### Ecualizador
1. Haz clic en el icono de ecualizador (🎚️)
2. Selecciona un preset o ajusta manualmente las bandas
3. Los cambios se guardan automáticamente

### Instalar App
- **Automático**: Se mostrará un prompt al abrir la app
- **Manual**: Abre el menú (☰) y selecciona "Instalar App"

### Acceder a Redes Sociales
- Haz clic en los iconos de Facebook, ubicación, etc.
- Se abrirán en una nueva pestaña

## Estructura del Proyecto

```
radio-uno-casereña/
├── index.html              # Página principal
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker
├── src/
│   ├── styles.css         # Estilos principales
│   ├── app.js             # Lógica del reproductor
│   ├── audio-visualizer.js # Visualizador de espectro
│   ├── equalizer.js       # Ecualizador
│   └── pwa-installer.js   # Instalador PWA
├── assets/
│   ├── logo.png           # Logo de la radio
│   ├── icon-192.png       # Icono 192x192
│   ├── icon-512.png       # Icono 512x512
│   └── icon-*-maskable.png # Iconos maskable para Android
└── README.md              # Este archivo
```

## Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsivo con Flexbox/Grid
- **JavaScript Vanilla** - Sin dependencias externas
- **Web Audio API** - Visualizador de espectro
- **Service Worker** - Funcionalidad offline
- **PWA** - Instalación como app nativa

## Compatibilidad

- ✅ Chrome/Edge (versión 90+)
- ✅ Firefox (versión 88+)
- ✅ Safari (versión 14+)
- ✅ iOS Safari (versión 14+)
- ✅ Android Chrome

## Próximas Mejoras

- [ ] Panel de administrador para agregar WhatsApp
- [ ] Más redes sociales
- [ ] Programación de la radio
- [ ] Historial de canciones
- [ ] Notificaciones push
- [ ] Tema claro/oscuro

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contacto

Para más información sobre Radio Uno Casereña:
- 📍 Ubicación: Caseros, Argentina
- 📱 Facebook: [Radio Uno Caseros](https://www.facebook.com/RadioUnoCaseros?locale=es_LA)
- 📻 Frecuencia: 90.7 MHz

---

Desarrollado con ❤️ para Radio Uno Casereña
