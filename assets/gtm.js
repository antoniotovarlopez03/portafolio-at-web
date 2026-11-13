// AT · Desarrollo web — Google Tag Manager con el modo de consentimiento v2.
// Se carga en el <head> sin defer para que el consentimiento quede fijado antes de GTM.
// Todo va denegado por defecto; si el visitante ya aceptó en otra visita
// (clave «at-cookies» en localStorage), se concede la analítica al momento.
// El aviso y los botones para cambiar la elección están en assets/sitio.js.
(function (w, d) {
  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
  w.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
  var eleccion = null;
  try { eleccion = localStorage.getItem('at-cookies'); } catch (e) { /* navegación privada */ }
  if (eleccion === 'aceptadas') w.gtag('consent', 'update', { analytics_storage: 'granted' });

  w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var s = d.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-M8NRLTX2';
  d.head.appendChild(s);
})(window, document);
