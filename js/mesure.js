/* Mesure d'audience Google Analytics 4 sans cookies : consentement refusé par défaut,
   aucun cookie déposé, aucun bandeau. Google ne reçoit que des signaux anonymes. */
(function () {
  var GA_ID = 'G-7F2239LB3M';
  if (!GA_ID) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  gtag('js', new Date());
  gtag('config', GA_ID, { client_storage: 'none', allow_google_signals: false, allow_ad_personalization_signals: false });
  var s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
})();
