// Botón flotante de WhatsApp con el mensaje ya escrito según la página.
// El número va también en api/contacto.js (botón del correo de confirmación).
(function () {
  var NUMERO = '34601048544';
  if (!NUMERO) return;

  var ruta = location.pathname;
  var texto = 'Hola, Antonio. He visto tu web y me gustaría que me hicieras una página para mi negocio. Mi negocio es: ';
  if (ruta.indexOf('/servicios') === 0) texto = 'Hola, Antonio. He visto tus servicios y quería preguntarte por: ';
  if (ruta.indexOf('/proyectos') === 0) texto = 'Hola, Antonio. He visto tus proyectos y me gustaría algo parecido para mi negocio, que es: ';

  var enlace = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(texto);
  var visible = '+' + NUMERO.slice(0, 2) + ' ' + NUMERO.slice(2).replace(/(\d{3})(?=\d)/g, '$1 ');

  // Dato en la página de contacto
  var dato = document.querySelector('.at-dato-wa');
  if (dato) {
    var a = dato.querySelector('.at-wa');
    a.href = enlace; a.target = '_blank'; a.rel = 'noopener'; a.textContent = visible;
    dato.hidden = false;
  }

  var b = document.createElement('a');
  b.className = 'at-wa-flotante';
  b.href = enlace; b.target = '_blank'; b.rel = 'noopener';
  b.setAttribute('aria-label', 'Escríbeme por WhatsApp');
  b.innerHTML = '<svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4z"/></svg>';
  b.addEventListener('click', function () { if (window.clarity) window.clarity('event', 'whatsapp'); });

  var s = document.createElement('style');
  s.textContent = '.at-wa-flotante{position:fixed;right:22px;bottom:22px;z-index:9999;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#d6a756;color:#14110b!important;box-shadow:0 10px 30px rgba(0,0,0,.45);transition:transform .25s}.at-wa-flotante:hover{transform:translateY(-3px)}@media (max-width:640px){.at-wa-flotante{right:16px;bottom:16px;width:54px;height:54px}}';
  document.head.appendChild(s);
  document.body.appendChild(b);
})();
