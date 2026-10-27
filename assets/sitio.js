// AT · Desarrollo web — comportamiento común: menú del móvil, revelado al hacer scroll,
// botón de WhatsApp con el mensaje según la página y envío del formulario de contacto.
(function () {
  document.documentElement.classList.remove('sin-js');

  // Menú del móvil
  var boton = document.querySelector('.abrir-menu');
  var nav = document.querySelector('.navegacion');
  if (boton && nav) {
    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abierto));
      nav.classList.toggle('abierta', !abierto);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { boton.setAttribute('aria-expanded', 'false'); nav.classList.remove('abierta'); }
    });
  }

  // Revelado al hacer scroll
  var rev = document.querySelectorAll('.rev');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visto'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rev.forEach(function (el) { obs.observe(el); });
  } else {
    rev.forEach(function (el) { el.classList.add('visto'); });
  }

  // Microsoft Clarity solo con permiso (LSSI art. 22.2): el script no se carga
  // hasta que el visitante pulsa «Aceptar», y la elección se guarda en el navegador.
  // Además se le manda la señal de consentimiento que Microsoft pide para la UE.
  var CLARITY = 'z4g8fhmtl6';
  var CLAVE = 'at-cookies';
  function leerEleccion() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardarEleccion(v) { try { localStorage.setItem(CLAVE, v); } catch (e) { /* navegación privada */ } }
  function cargarClarity() {
    if (document.getElementById('clarity-tag')) return;
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    var tag = document.createElement('script');
    tag.id = 'clarity-tag'; tag.async = true; tag.src = 'https://www.clarity.ms/tag/' + CLARITY;
    document.head.appendChild(tag);
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
  }
  function retirarClarity() {
    if (!window.clarity) return;
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
    window.clarity('consent', false);
  }
  function mostrarAviso() {
    if (document.querySelector('.aviso-cookies')) return;
    var aviso = document.createElement('div');
    aviso.className = 'aviso-cookies';
    aviso.setAttribute('role', 'dialog');
    aviso.setAttribute('aria-label', 'Aviso de cookies');
    aviso.innerHTML = '<p class="aviso-titulo">¿Me ayudas a mejorar la web?</p>' +
      '<p>Con tu permiso uso Microsoft Clarity para ver, de forma anónima, cómo se navega por la web (clics y desplazamiento). Si lo rechazas, la web funciona igual. <a href="/cookies/">Más información</a>.</p>' +
      '<div class="aviso-botones"><button type="button" class="boton boton-borde" data-eleccion="rechazadas">Rechazar</button>' +
      '<button type="button" class="boton boton-oro" data-eleccion="aceptadas">Aceptar</button></div>';
    aviso.addEventListener('click', function (e) {
      var b = e.target.closest('[data-eleccion]');
      if (!b) return;
      var antes = leerEleccion();
      var eleccion = b.getAttribute('data-eleccion');
      guardarEleccion(eleccion);
      aviso.remove();
      if (eleccion === 'aceptadas') cargarClarity();
      else if (antes === 'aceptadas') retirarClarity();
    });
    document.body.appendChild(aviso);
  }
  var eleccion = leerEleccion();
  if (eleccion === 'aceptadas') cargarClarity();
  else if (eleccion !== 'rechazadas') mostrarAviso();
  document.querySelectorAll('[data-cambiar-cookies]').forEach(function (b) { b.addEventListener('click', mostrarAviso); });
  function evento(nombre) { if (window.clarity) window.clarity('event', nombre); }

  // WhatsApp: el mensaje cambia según la página. El número va también en api/contacto.js.
  var NUMERO = '34601048544';
  var ruta = location.pathname;
  var texto = 'Hola. He visto tu web y me gustaría una página para mi negocio. Mi negocio es: ';
  if (ruta.indexOf('/servicios') === 0) texto = 'Hola. He visto tus servicios y quería preguntarte por: ';
  if (ruta.indexOf('/proyectos') === 0) texto = 'Hola. He visto tus proyectos y me gustaría algo parecido para mi negocio, que es: ';
  var enlaceWa = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(texto);
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = enlaceWa;
    a.addEventListener('click', function () { evento('whatsapp'); });
  });

  var flotante = document.createElement('a');
  flotante.className = 'wa-flotante';
  flotante.href = enlaceWa; flotante.target = '_blank'; flotante.rel = 'noopener';
  flotante.setAttribute('aria-label', 'Escríbeme por WhatsApp');
  flotante.innerHTML = '<svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4z"/></svg>';
  flotante.addEventListener('click', function () { evento('whatsapp'); });
  document.body.appendChild(flotante);
  document.querySelectorAll('a[href$=".pdf"]').forEach(function (a) {
    a.addEventListener('click', function () { evento('descarga_pdf'); });
  });

  // Formulario de contacto (envía a /api/contacto, que manda los correos con Resend)
  var f = document.getElementById('formulario');
  if (!f) return;
  var aviso = f.querySelector('.aviso');
  var enviar = f.querySelector('button[type=submit]');
  var ok = document.getElementById('enviado');

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = {};
    ['nombre', 'email', 'telefono', 'negocio', 'servicio', 'mensaje', 'trampa'].forEach(function (k) { d[k] = f.elements[k].value; });
    d.privacidad = f.elements.privacidad.checked;
    if (!f.checkValidity() || !d.privacidad) {
      aviso.textContent = 'Revisa los campos: nombre, correo, qué necesitas, mensaje y la casilla de privacidad.';
      f.reportValidity();
      return;
    }
    aviso.textContent = '';
    enviar.disabled = true;
    enviar.firstChild.nodeValue = 'Enviando… ';

    fetch('/api/contacto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error(r.error || '');
        ok.querySelector('[data-nombre]').textContent = r.nombre || d.nombre;
        ok.querySelector('[data-servicio]').textContent = (r.servicio || 'tu proyecto').toLowerCase();
        f.hidden = true; ok.hidden = false;
        evento('formulario_enviado');
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function (err) {
        aviso.textContent = (err.message || 'No se ha podido enviar.') + ' ';
        var a = document.createElement('a');
        a.href = 'mailto:contacto@atdesarrolloweb.es'; a.textContent = 'Escríbeme por correo';
        aviso.appendChild(a);
        enviar.disabled = false;
        enviar.firstChild.nodeValue = 'Enviar mensaje ';
      });
  });
})();
