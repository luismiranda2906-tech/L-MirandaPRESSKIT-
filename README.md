# L'Miranda · web

Web de L'Miranda (DJ / productor, Barcelona). Se publica en Netlify desde la rama `main`: sin comando de build, directorio de publicación `/`.

## Archivos

- `index.html`: la web publicada. Es un único archivo con las imágenes incrustadas.
- `src/`: lo necesario para volver a generarla.
  - `template_o.html`: estructura, estilos y código de la página.
  - `build.py`: rellena la plantilla y escribe `../index.html`.
  - `ctrl.py`: dibujo del controlador DJ.
  - `player.js`: reproductor de SoundCloud.
  - `panels_k.html`: contenido de las secciones (shows, bio, prensa, rider, booking).
  - `img/`: imagen de la tienda, recortes, fotos y logo de Deprerreo.

## Regenerar

```
cd src
pip install pillow
python3 build.py
```

Las secciones Fotos y Vídeos muestran las carpetas de Google Drive directamente, así que lo que se sube a esas carpetas aparece solo.
