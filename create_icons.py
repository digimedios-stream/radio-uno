from PIL import Image
import os

# Cargar imagen original
img = Image.open(r'C:\Users\Usuario\Documents\Radio-Uno-Casereña\assets\logo.png').convert("RGBA")

# Recortar el espacio transparente (padding) del logo original
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# Añadir un pequeño padding consistente (10%)
width, height = img.size
padding = int(max(width, height) * 0.1)
new_size = (width + padding * 2, height + padding * 2)
new_img = Image.new("RGBA", new_size, (0, 0, 0, 0))
new_img.paste(img, (padding, padding))
img = new_img

# Hacer la imagen cuadrada para el ícono final (centrado)
max_dim = max(img.size)
square_img = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
x = (max_dim - img.size[0]) // 2
y = (max_dim - img.size[1]) // 2
square_img.paste(img, (x, y))
img = square_img

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
