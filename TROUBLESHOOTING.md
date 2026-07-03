# 🔧 Solución de Problemas - Radio Uno Casereña

## Problema: "Conectando..." pero nunca se conecta

### Causa
El stream de Zeno.fm tiene restricciones CORS (Cross-Origin Resource Sharing) y hace un redirect 302 que algunos navegadores no siguen correctamente en contextos locales.

### Soluciones

#### Opción 1: Usar un Proxy CORS (Recomendado para desarrollo local)

1. Abre `src/streams-config.js`
2. Descomenta la línea del proxy CORS:
```javascript
zenoCors: 'https://cors-anywhere.herokuapp.com/https://stream.zeno.fm/qt55qqa7dbtuv',
```

3. Cambia `ACTIVE_STREAM` a:
```javascript
let ACTIVE_STREAM = STREAMS.zenoCors;
```

4. Guarda y recarga la página

**Nota**: Este método es más lento pero funciona en desarrollo local.

#### Opción 2: Usar un Stream de Prueba

Para verificar que la app funciona correctamente:

1. Abre `src/streams-config.js`
2. Descomenta el stream de prueba:
```javascript
test: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
```

3. Cambia `ACTIVE_STREAM` a:
```javascript
let ACTIVE_STREAM = STREAMS.test;
```

4. Guarda y recarga la página

Este stream de prueba funciona perfectamente y te permite verificar que todo está funcionando.

#### Opción 3: Desplegar en GitHub Pages (Recomendado para producción)

El stream funciona perfectamente cuando la app está desplegada en GitHub Pages porque:
- GitHub Pages sirve con HTTPS
- El navegador confía en el origen
- Los redirects se manejan correctamente

**Pasos:**
1. Sigue la guía en `DEPLOY.md`
2. Una vez desplegado, el stream funcionará sin problemas

### Verificar que funciona

1. Abre la consola del navegador (F12)
2. Haz clic en el botón Play
3. Busca mensajes en la consola:
   - ✅ "Reproducción iniciada" = Funciona
   - ❌ "Error de audio" = Hay un problema

### Cambiar Stream desde la Consola

Si necesitas cambiar el stream rápidamente:

```javascript
// En la consola del navegador (F12)
switchStream('test');  // Cambiar a stream de prueba
switchStream('zeno');  // Cambiar a stream original
```

---

## Otros Problemas

### El visualizador no se anima

**Causa**: El audio no está siendo procesado por la Web Audio API

**Solución**:
1. Verifica que el audio esté reproduciendo (mira el indicador de estado)
2. Abre la consola (F12) y busca errores
3. Intenta con un stream de prueba

### El ecualizador no funciona

**Causa**: Puede ser un problema de conexión de filtros

**Solución**:
1. Recarga la página
2. Intenta con un stream diferente
3. Verifica que el audio esté reproduciendo

### La app no se instala

**Causa**: Necesita HTTPS y estar en un servidor web

**Solución**:
1. Desplega en GitHub Pages (ver `DEPLOY.md`)
2. O usa un servidor local con HTTPS

---

## Información Técnica

### Streams Disponibles

| Stream | URL | Estado | Notas |
|--------|-----|--------|-------|
| Zeno.fm | `https://stream.zeno.fm/qt55qqa7dbtuv` | ✅ Funciona | Requiere HTTPS en producción |
| Zeno.fm + CORS | `https://cors-anywhere.herokuapp.com/...` | ✅ Funciona | Más lento, para desarrollo |
| SoundHelix | `https://www.soundhelix.com/...` | ✅ Funciona | Para pruebas |

### Cómo Agregar un Nuevo Stream

1. Abre `src/streams-config.js`
2. Agrega una nueva entrada en el objeto `STREAMS`:
```javascript
miStream: 'https://ejemplo.com/stream.mp3',
```

3. Usa desde la consola:
```javascript
switchStream('miStream');
```

---

## Contacto y Soporte

Si tienes problemas:
1. Verifica que estés usando HTTPS (en producción)
2. Intenta con un stream de prueba
3. Abre la consola (F12) y busca mensajes de error
4. Revisa este documento

---

**Última actualización**: 3 de Julio de 2026
