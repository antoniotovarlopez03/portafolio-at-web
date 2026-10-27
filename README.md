# Portafolio AT · Desarrollo web

Web estática de www.atdesarrolloweb.es, publicada en Vercel (publica sola al hacer push a `main`).

- Páginas: `index.html` y una carpeta por página (`proyectos/`, `servicios/`, `sobre-mi/`, `contacto/`, `politica-de-privacidad/`).
- Estilos y comportamiento comunes: `assets/estilos.css` y `assets/sitio.js` (menú, WhatsApp y formulario).
- Formulario: `api/contacto.js`, función de Vercel que envía los correos con Resend (necesita `RESEND_API_KEY`).
- `portafolio-at.pdf`: el portafolio en PDF que se descarga desde la web.
