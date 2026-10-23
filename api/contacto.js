// Formulario de contacto de atdesarrolloweb.es (función de Vercel).
// Envía dos correos con Resend: el aviso a contacto@atdesarrolloweb.es
// (responder va directo al cliente) y la confirmación al cliente.
// Necesita la variable RESEND_API_KEY en Vercel y el dominio verificado en Resend.

const DESTINO = 'contacto@atdesarrolloweb.es';
const REMITENTE = 'AT · Desarrollo web <contacto@atdesarrolloweb.es>';
const WEB = 'https://www.atdesarrolloweb.es';
const WHATSAPP = ''; // número con prefijo, sin espacios ni +. Ej.: 34600111222

// Qué puede pedir el cliente y qué le contesto en la confirmación.
const SERVICIOS = {
  'web-nueva': {
    nombre: 'Una web nueva para el negocio',
    respuesta: 'Voy a mirar qué tipo de negocio tienes y te preparo una propuesta de web: qué páginas llevaría, cómo se vería en el móvil y cuánto costaría, con el dominio y el correo incluidos.',
  },
  renovar: {
    nombre: 'Renovar la web actual',
    respuesta: 'Voy a revisar tu web actual (velocidad, cómo se ve en el móvil y cómo aparece en Google) y te digo qué cambiaría y qué presupuesto tendría.',
  },
  'dominio-correo': {
    nombre: 'Dominio y correo profesional',
    respuesta: 'Te explico qué dominio te conviene, cuánto cuesta al año y cómo dejar funcionando un correo con el nombre de tu negocio.',
  },
  google: {
    nombre: 'Aparecer en Google (SEO local)',
    respuesta: 'Voy a buscar tu negocio en Google y en Google Maps para ver cómo apareces hoy, y te propongo qué mejorar para que te encuentren los clientes de tu zona.',
  },
  mantenimiento: {
    nombre: 'Mantenimiento y cambios',
    respuesta: 'Dime qué cambios necesitas y con qué frecuencia, y te paso un precio cerrado para mantener la web al día.',
  },
  otro: {
    nombre: 'Otra cosa',
    respuesta: 'Leo con calma lo que me cuentas y te contesto con la mejor forma de hacerlo.',
  },
};

// Límite sencillo por IP (se reinicia cuando Vercel recicla la función).
const envios = new Map();
const LIMITE = 5;
const VENTANA = 60 * 60 * 1000;

function demasiados(ip) {
  const ahora = Date.now();
  const recientes = (envios.get(ip) || []).filter((t) => ahora - t < VENTANA);
  recientes.push(ahora);
  envios.set(ip, recientes);
  return recientes.length > LIMITE;
}

function texto(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function escapar(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escaparConSaltos(s) {
  return escapar(s).replace(/\r?\n/g, '<br>');
}

// --- Plantillas (tablas y estilos en línea para que se vean bien en Outlook y Gmail) ---

const C = {
  fondo: '#0d0e11',
  caja: '#15171c',
  caja2: '#1d2027',
  linea: '#2a2c31',
  crema: '#f1ece3',
  gris: '#a39e95',
  oro: '#d6a756',
};
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Helvetica,Arial,sans-serif";

function cabecera(etiqueta) {
  return `<tr><td style="padding:34px 40px 26px;border-bottom:1px solid ${C.linea}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-family:${SERIF};font-size:22px;color:${C.crema}">AT<span style="color:${C.oro}">.</span> <span style="font-family:${SANS};font-size:13px;color:${C.gris}">Desarrollo web</span></td>
      <td align="right" style="font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.oro}">${etiqueta}</td>
    </tr></table>
  </td></tr>`;
}

function pie() {
  return `<tr><td style="padding:26px 40px 34px;border-top:1px solid ${C.linea};font-family:${SANS};font-size:12px;line-height:1.6;color:${C.gris}">
    AT · Desarrollo web · <a href="${WEB}" style="color:${C.oro};text-decoration:none">atdesarrolloweb.es</a> · <a href="mailto:${DESTINO}" style="color:${C.oro};text-decoration:none">${DESTINO}</a>
  </td></tr>`;
}

function boton(href, etiqueta) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 10px 6px 0;display:inline-table"><tr>
    <td bgcolor="${C.oro}" style="border-radius:999px">
      <a href="${href}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:14px;font-weight:bold;color:#14110b;text-decoration:none;border-radius:999px">${etiqueta}</a>
    </td>
  </tr></table>`;
}

function fila(etiqueta, valor) {
  return `<tr>
    <td valign="top" style="padding:12px 0;border-bottom:1px solid ${C.linea};width:130px;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.gris}">${etiqueta}</td>
    <td valign="top" style="padding:12px 0;border-bottom:1px solid ${C.linea};font-family:${SANS};font-size:15px;line-height:1.55;color:${C.crema}">${valor}</td>
  </tr>`;
}

function tarjeta(filas) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.caja2}" style="background:${C.caja2};border-radius:14px">
    <tr><td style="padding:8px 24px 10px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filas}</table></td></tr>
  </table>`;
}

function envoltura(preheader, contenido) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"></head>
<body style="margin:0;padding:0;background:${C.fondo}">
<div style="display:none;max-height:0;overflow:hidden">${escapar(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.fondo}" style="background:${C.fondo}"><tr><td align="center" style="padding:30px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" bgcolor="${C.caja}" style="width:100%;max-width:600px;background:${C.caja};border:1px solid ${C.linea};border-radius:22px">
    ${contenido}
  </table>
</td></tr></table>
</body></html>`;
}

function titulo(antes, cursiva) {
  return `<h1 style="margin:0 0 16px;font-family:${SERIF};font-weight:normal;font-size:32px;line-height:1.15;color:${C.crema}">${antes} <em style="color:${C.oro}">${cursiva}</em></h1>`;
}

function parrafo(html) {
  return `<p style="margin:0 0 18px;font-family:${SANS};font-size:15px;line-height:1.65;color:${C.gris}">${html}</p>`;
}

function correoCliente(d) {
  const servicio = SERVICIOS[d.servicio];
  const nombre = escapar(d.nombre.split(' ')[0]);
  const enlaceWa = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola, Antonio. Soy ${d.nombre}, te acabo de escribir desde la web por: ${servicio.nombre.toLowerCase()}.`)}`
    : '';
  const filas =
    fila('Lo que pides', escapar(servicio.nombre)) +
    (d.negocio ? fila('Negocio', escapar(d.negocio)) : '') +
    fila('Tu mensaje', escaparConSaltos(d.mensaje));
  return envoltura(
    `He recibido tu mensaje, ${d.nombre.split(' ')[0]}. Te contesto en menos de 24 horas.`,
    cabecera('Solicitud recibida') +
      `<tr><td style="padding:36px 40px 10px">
        ${titulo(`Gracias, ${nombre}.`, 'Ya tengo tu mensaje.')}
        ${parrafo(escapar(servicio.respuesta))}
        ${parrafo('Normalmente contesto en menos de 24 horas, desde <a href="mailto:' + DESTINO + '" style="color:' + C.oro + ';text-decoration:none">' + DESTINO + '</a>. Si quieres añadir algo, responde a este correo.')}
      </td></tr>
      <tr><td style="padding:6px 40px 26px">
        <p style="margin:0 0 12px;font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.oro}">Resumen de lo que me has enviado</p>
        ${tarjeta(filas)}
      </td></tr>
      <tr><td style="padding:0 40px 34px">
        ${boton(WEB + '/proyectos/', 'Ver proyectos')}
        ${enlaceWa ? boton(enlaceWa, 'Escribirme por WhatsApp') : ''}
      </td></tr>` +
      pie()
  );
}

function correoNegocio(d) {
  const servicio = SERVICIOS[d.servicio];
  const fecha = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid', dateStyle: 'full', timeStyle: 'short' });
  const tel = d.telefono.replace(/[^\d+]/g, '');
  const telWa = tel.replace(/^\+/, '').replace(/^(?=[6-9]\d{8}$)/, '34');
  const filas =
    fila('Nombre', escapar(d.nombre)) +
    fila('Correo', `<a href="mailto:${escapar(d.email)}" style="color:${C.oro};text-decoration:none">${escapar(d.email)}</a>`) +
    (d.telefono ? fila('Teléfono', `<a href="tel:${escapar(tel)}" style="color:${C.oro};text-decoration:none">${escapar(d.telefono)}</a>`) : '') +
    (d.negocio ? fila('Negocio', escapar(d.negocio)) : '') +
    fila('Necesita', escapar(servicio.nombre)) +
    fila('Mensaje', escaparConSaltos(d.mensaje)) +
    fila('Recibido', escapar(fecha));
  const asunto = `Re: ${servicio.nombre}`;
  return envoltura(
    `${d.nombre} · ${servicio.nombre}`,
    cabecera('Nuevo contacto') +
      `<tr><td style="padding:36px 40px 10px">
        ${titulo('Nueva solicitud', 'desde la web')}
        ${parrafo(`<strong style="color:${C.crema}">${escapar(d.nombre)}</strong> quiere: ${escapar(servicio.nombre.toLowerCase())}. Si respondes a este correo, le llega directamente.`)}
      </td></tr>
      <tr><td style="padding:6px 40px 26px">${tarjeta(filas)}</td></tr>
      <tr><td style="padding:0 40px 34px">
        ${boton(`mailto:${escapar(d.email)}?subject=${encodeURIComponent(asunto)}`, 'Responder por correo')}
        ${d.telefono ? boton(`https://wa.me/${telWa}`, 'Abrir WhatsApp') : ''}
      </td></tr>` +
      pie()
  );
}

async function enviar(cuerpo) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  // Campo oculto: si viene relleno, es un bot. Se responde ok para no darle pistas.
  if (texto(b.trampa, 200)) return res.status(200).json({ ok: true });

  const d = {
    nombre: texto(b.nombre, 80),
    email: texto(b.email, 120),
    telefono: texto(b.telefono, 30),
    negocio: texto(b.negocio, 120),
    servicio: texto(b.servicio, 40),
    mensaje: texto(b.mensaje, 3000),
  };

  if (d.nombre.length < 2) return res.status(400).json({ ok: false, error: 'Escribe tu nombre.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return res.status(400).json({ ok: false, error: 'Revisa el correo, no parece válido.' });
  if (d.telefono && d.telefono.replace(/\D/g, '').length < 9) return res.status(400).json({ ok: false, error: 'Revisa el teléfono.' });
  if (!SERVICIOS[d.servicio]) return res.status(400).json({ ok: false, error: 'Elige qué necesitas.' });
  if (d.mensaje.length < 10) return res.status(400).json({ ok: false, error: 'Cuéntame un poco más en el mensaje.' });
  if (b.privacidad !== true) return res.status(400).json({ ok: false, error: 'Tienes que aceptar la política de privacidad.' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'desconocida';
  if (demasiados(ip)) return res.status(429).json({ ok: false, error: 'Has enviado varios mensajes seguidos. Prueba dentro de un rato o escríbeme por correo.' });

  if (!process.env.RESEND_API_KEY) {
    console.error('Falta RESEND_API_KEY');
    return res.status(500).json({ ok: false, error: 'El formulario no está disponible ahora mismo.' });
  }

  try {
    await enviar({
      from: REMITENTE,
      to: [DESTINO],
      reply_to: d.email,
      subject: `Nueva solicitud desde la web · ${d.nombre}`,
      html: correoNegocio(d),
    });
  } catch (e) {
    console.error('Aviso al negocio:', e.message);
    return res.status(502).json({ ok: false, error: 'No se ha podido enviar. Escríbeme a ' + DESTINO + '.' });
  }

  // Si falla la confirmación, el mensaje ya me ha llegado: solo se registra.
  try {
    await enviar({
      from: REMITENTE,
      to: [d.email],
      reply_to: DESTINO,
      subject: 'He recibido tu mensaje · AT Desarrollo web',
      html: correoCliente(d),
    });
  } catch (e) {
    console.error('Confirmación al cliente:', e.message);
  }

  return res.status(200).json({ ok: true, nombre: d.nombre.split(' ')[0], servicio: SERVICIOS[d.servicio].nombre });
};
