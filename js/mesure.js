/* Mesure d'audience Google Analytics 4 (szmaj.be)
   - Consentement refusé par défaut (Consent Mode v2) : rien n'est stocké tant que le visiteur n'a pas accepté.
   - Petit bandeau : « Accepter » active les cookies de mesure, « Refuser » garde la mesure anonyme sans cookie.
   - Le choix est mémorisé 6 mois. Lien « Gérer les cookies » possible via window.szmajConsent().
   - Événements : generate_lead (page /merci après envoi du formulaire), clic_telephone, clic_email. */
(function () {
  var GA_ID = 'G-NNYGRR51LT';
  var KEY = 'szmaj_consent';
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };

  function readChoice() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (v && v.t && Date.now() - v.t < MAX_AGE) return v.c;
    } catch (e) {}
    return null;
  }
  function saveChoice(c) {
    try { localStorage.setItem(KEY, JSON.stringify({ c: c, t: Date.now() })); } catch (e) {}
  }

  var choice = readChoice();
  gtag('consent', 'default', {
    analytics_storage: choice === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    wait_for_update: 500
  });
  gtag('js', new Date());
  gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });

  var s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  /* Événement de conversion : arrivée sur /merci après le formulaire */
  if (/^\/merci(\.html)?\/?$/.test(location.pathname)) {
    gtag('event', 'generate_lead', { method: 'formulaire_contact' });
  }

  /* Clics téléphone et e-mail */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('tel:') === 0) gtag('event', 'clic_telephone', { link_url: h });
    else if (h.indexOf('mailto:') === 0) gtag('event', 'clic_email', { link_url: h });
  });

  /* Bandeau de consentement */
  function banner() {
    if (document.getElementById('szmaj-consent')) return;
    var css = document.createElement('style');
    css.textContent =
      '#szmaj-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#0E3329;color:#F4EEE3;border:1px solid rgba(201,169,110,.55);border-radius:4px;' +
      'box-shadow:0 18px 40px rgba(0,0,0,.3);padding:18px 20px;font:400 14px/1.55 Poppins,sans-serif}' +
      '#szmaj-consent p{margin:0 0 14px}#szmaj-consent a{color:#C9A96E}' +
      '#szmaj-consent .b{display:flex;gap:10px;flex-wrap:wrap}' +
      '#szmaj-consent button{cursor:pointer;font:500 12px Poppins,sans-serif;letter-spacing:1.6px;text-transform:uppercase;' +
      'padding:11px 18px;border-radius:2px;border:1px solid #C9A96E}' +
      '#szmaj-consent .ok{background:#C9A96E;color:#0B2B23}#szmaj-consent .no{background:transparent;color:#F4EEE3}';
    document.head.appendChild(css);
    var d = document.createElement('div');
    d.id = 'szmaj-consent';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Cookies de mesure d’audience');
    d.innerHTML =
      '<p>J’utilise Google Analytics pour savoir quelles pages sont lues. Rien de publicitaire. ' +
      'Vous acceptez les cookies de mesure ? <a href="/confidentialite#cookies">En savoir plus</a></p>' +
      '<div class="b"><button type="button" class="ok">Accepter</button><button type="button" class="no">Refuser</button></div>';
    document.body.appendChild(d);
    d.querySelector('.ok').onclick = function () {
      saveChoice('granted'); gtag('consent', 'update', { analytics_storage: 'granted' }); d.remove();
    };
    d.querySelector('.no').onclick = function () {
      saveChoice('denied'); gtag('consent', 'update', { analytics_storage: 'denied' }); d.remove();
    };
  }
  window.szmajConsent = function () { try { localStorage.removeItem(KEY); } catch (e) {} banner(); };

  if (choice === null) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner);
    else banner();
  }
})();
