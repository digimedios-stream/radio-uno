from PIL import Image

# Cargar imagen original
img = Image.open(r'C:\Users\Usuario\Documents\Radio-Uno-Casereña\assets\logo.png').convert("RGBA")

# Recortar el espacio transparente (padding) del logo original
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# Añadir padding del 25% para que encaje bien en la zona segura
width, height = img.size
padding = int(max(width, height) * 0.25)
new_size = (width + padding * 2, height + padding * 2)

# Centrar la imagen
x = (new_size[0] - width) // 2
y = (new_size[1] - height) // 2

# 1. Crear imagen centrada transparente (para iconos normales)
transparent_bg = Image.new("RGBA", new_size, (0, 0, 0, 0))
transparent_bg.paste(img, (x, y))

# 2. Crear imagen centrada con fondo oscuro (para iconos maskable y splash screen)
# El color es #0f172a (RGB: 15, 23, 42)
dark_bg = Image.new("RGBA", new_size, (15, 23, 42, 255))
dark_bg.paste(img, (x, y), mask=img)

sizes = [192, 512]
for size in sizes:
    # Icono normal
    icon = transparent_bg.resize((size, size), Image.Resampling.LANCZOS)
    icon.save(rf'C:\Users\Usuario\Documents\Radio-Uno-Casereña\assets\icon-{size}.png')
    
    # Icono maskable (para Android)
    icon_maskable = dark_bg.resize((size, size), Image.Resampling.LANCZOS)
    icon_maskable.save(rf'C:\Users\Usuario\Documents\Radio-Uno-Casereña\assets\icon-{size}-maskable.png')

print('Iconos creados exitosamente')
