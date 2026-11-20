/* Mesure d'audience Google Analytics 4, chargée uniquement après accord. */
(function () {
  var GA_ID = ''; // G-XXXXXXXXXX : vide = aucune mesure, aucun bandeau
  var KEY = 'szmaj-consent';
  if (!GA_ID) return;
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function load() {
    if (window.__ga) return; window.__ga = 1;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }
  function banner() {
    if (document.getElementById('cc')) return;
    var st = document.createElement('style');
    st.textContent = '#cc{position:fixed;z-index:60;left:16px;right:16px;bottom:16px;max-width:440px;background:#0B2B23;color:#F4EEE3;border:1px solid rgba(201,169,110,.5);border-radius:4px;padding:18px 20px;font:300 14px/1.5 Poppins,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.25)}#cc p{margin:0 0 14px}#cc a{color:#C9D3CD}#cc div{display:flex;gap:10px}#cc button{flex:1;font:400 14px Poppins,sans-serif;padding:11px 12px;border-radius:2px;cursor:pointer;border:1px solid #C9A96E}#cc .n{background:transparent;color:#F4EEE3}#cc .y{background:#C9A96E;color:#0B2B23}#cc button:focus-visible{outline:2px solid #F4EEE3;outline-offset:2px}@media (max-width:760px){#cc{bottom:84px}}';
    document.head.appendChild(st);
    var d = document.createElement('div');
    d.id = 'cc'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cookies de mesure d’audience');
    d.innerHTML = '<p>J’utilise Google Analytics pour savoir quelles pages vous sont utiles, uniquement avec votre accord. <a href="/confidentialite">En savoir plus</a></p><div><button class="n" type="button">Refuser</button><button class="y" type="button">Accepter</button></div>';
    document.body.appendChild(d);
    d.querySelector('.n').onclick = function () { set('denied'); d.remove(); };
    d.querySelector('.y').onclick = function () { set('granted'); d.remove(); load(); };
  }
  window.szmajCookies = function () { try { localStorage.removeItem(KEY); } catch (e) {} banner(); };
  var c = get();
  if (c === 'granted') load();
  else if (c !== 'denied') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();
  }
})();
