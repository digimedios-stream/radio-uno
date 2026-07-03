# Guía de Despliegue en GitHub Pages

## Pasos para desplegar tu Radio Uno Casereña en GitHub Pages

### 1. Crear un repositorio en GitHub

1. Ve a [github.com](https://github.com) y crea una cuenta si no tienes
2. Haz clic en "New repository"
3. Nombre: `radio-uno-casereña` (o el que prefieras)
4. Descripción: "PWA moderna para Radio Uno Casereña 90.7 MHz"
5. Selecciona "Public"
6. Haz clic en "Create repository"

### 2. Subir los archivos

#### Opción A: Usando Git (Recomendado)

```bash
# En la carpeta del proyecto
cd C:\Users\Usuario\Documents\Radio-Uno-Casereña

# Configurar el repositorio remoto
git remote add origin https://github.com/tu-usuario/radio-uno-casereña.git
git branch -M main
git push -u origin main
```

#### Opción B: Subir archivos directamente en GitHub

1. Ve a tu repositorio en GitHub
2. Haz clic en "Add file" → "Upload files"
3. Arrastra todos los archivos de la carpeta
4. Haz clic en "Commit changes"

### 3. Habilitar GitHub Pages

1. Ve a Settings del repositorio
2. En el menú izquierdo, selecciona "Pages"
3. En "Source", selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
4. Haz clic en "Save"

### 4. Esperar a que se publique

- GitHub Pages tardará 1-2 minutos en publicar
- Tu app estará disponible en: `https://tu-usuario.github.io/radio-uno-casereña`

### 5. Verificar que funciona

1. Abre la URL en tu navegador
2. Verifica que:
   - El logo se carga correctamente
   - El reproductor funciona
   - El visualizador de espectro se anima
   - El ecualizador abre correctamente
   - Los enlaces a Facebook y ubicación funcionan

## Configuración adicional (Opcional)

### Usar un dominio personalizado

1. Ve a Settings → Pages
2. En "Custom domain", ingresa tu dominio (ej: radio.tudominio.com)
3. Sigue las instrucciones para configurar los DNS

### Habilitar HTTPS

- GitHub Pages habilita HTTPS automáticamente
- Espera 5-10 minutos después de configurar

## Actualizar la app

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

GitHub Pages se actualizará automáticamente en 1-2 minutos.

## Solucionar problemas

### La app no se carga
- Verifica que todos los archivos estén en el repositorio
- Comprueba que el archivo `index.html` esté en la raíz
- Espera 5 minutos y recarga la página

### Los estilos no se ven
- Limpia el caché del navegador (Ctrl+Shift+Delete)
- Verifica que `src/styles.css` esté en el repositorio

### El audio no funciona
- Verifica que el stream de Zeno.fm esté activo
- Comprueba la consola del navegador (F12) para errores CORS

## Próximos pasos

1. Agregar WhatsApp (cuando tengas el número)
2. Agregar más redes sociales
3. Crear un panel de administrador
4. Agregar programación de la radio

¡Tu app está lista para ser compartida! 🎉
