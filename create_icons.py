from PIL import Image
import os

# Cargar imagen original
img = Image.open(r'C:\Users\Usuario\Documents\Radio-Uno-Casereña\assets\logo.png')

# Crear iconos en diferentes tamaños
sizes = [192, 512]
for size in sizes:
    # Icono normal
    icon = img.resize((size, size), Image.Resampling.LANCZOS)
    icon.save(rf'C:\Users\Usuario\Documents\Radio-Uno-Casereña\assets\icon-{size}.png')
    
    # Icono maskable (para Android)
    icon_maskable = img.resize((size, size), Image.Resampling.LANCZOS)
    icon_maskable.save(rf'C:\Users\Usuario\Documents\Radio-Uno-Casereña\assets\icon-{size}-maskable.png')

print('Iconos creados exitosamente')
