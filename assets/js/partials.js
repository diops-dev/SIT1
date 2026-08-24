/* ==========================================================
   Solidaire Inca Tour, header + footer partagés
   Injectés dans <div data-include="header" data-active="..."> et
   <div data-include="footer">. Chemins calculés depuis la position
   réelle de ce script, le site fonctionne donc à toute profondeur.
   ========================================================== */
(function () {
  var script = document.currentScript ||
    document.querySelector('script[src*="assets/js/partials.js"]');
  var root = script.src.replace(/assets\/js\/partials\.js.*$/, '');

  var TEL = '+33670094964';
  var TEL_LABEL = '+33 6 70 09 49 64';
  var MAIL = 'contact@kirakutravel.com';
  var AGENDA = 'https://calendar.app.google/NsEizZRPr2kRaaeq5';

  var NAV = [
    { key: 'voyages',    label: 'Nos voyages',           href: root + 'circuits/index.html' },
    { key: 'departs',    label: 'Prochains départs',     href: root + 'departs/index.html' },
    { key: 'engagement', label: 'Notre engagement',      href: root + 'engagement.html' },
    { key: 'perou',      label: 'Le Pérou',              href: root + 'le-perou/index.html' },
    { key: 'carnet',     label: 'Carnet de route',       href: root + 'le-perou/carnet/index.html' }
  ];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function headerHTML(active) {
    var links = NAV.map(function (it) {
      return '<a href="' + it.href + '"' + (it.key === active ? ' class="active" aria-current="page"' : '') +
             '>' + esc(it.label) + '</a>';
    }).join('');
    return '' +
      '<a class="sit-skip" href="#contenu">Aller au contenu</a>' +
      '<header class="sit-nav">' +
        '<a class="sit-nav-brand" href="' + root + 'index.html">' +
          '<img src="' + root + 'assets/logo-flat.png" alt="Solidaire Inca Tour" />' +
          '<div class="sit-nav-brand-text">Solidaire<br>Inca Tour</div>' +
        '</a>' +
        '<nav class="sit-nav-links" aria-label="Navigation principale">' + links + '</nav>' +
        '<div class="sit-nav-cta">' +
          '<a class="sit-nav-phone" href="tel:' + TEL + '"><i data-lucide="phone"></i>' + TEL_LABEL + '</a>' +
          '<button type="button" class="btn btn-primary" data-devis>Demander un devis</button>' +
          '<button type="button" class="sit-burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="sit-drawer">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</header>' +
      '<div class="sit-drawer" id="sit-drawer" hidden>' +
        '<nav aria-label="Navigation mobile">' + links + '</nav>' +
        '<a class="sit-drawer-phone" href="tel:' + TEL + '"><i data-lucide="phone"></i>' + TEL_LABEL + '</a>' +
        '<button type="button" class="btn btn-primary btn-block" data-devis>Demander un devis</button>' +
        '<a class="btn btn-secondary btn-block" data-rdv href="' + AGENDA + '" target="_blank" rel="noopener">Prendre rendez-vous</a>' +
      '</div>';
  }

  function footerHTML() {
    return '' +
      '<footer class="sit-footer">' +
        '<img class="sit-footer-glyph" src="' + root + 'assets/bird-gold.png" alt="" />' +
        '<div class="sit-footer-inner">' +
          '<div class="sit-footer-brand">' +
            '<img src="' + root + 'assets/logo-flat.png" alt="Solidaire Inca Tour" style="height:64px;filter:brightness(1.05)" />' +
            '<p>Agence de tourisme solidaire au&nbsp;Pérou. Voyager autrement, voyager utile.</p>' +
            '<div class="sit-footer-contact">' +
              '<div><i data-lucide="phone"></i><a href="tel:' + TEL + '">' + TEL_LABEL + '</a></div>' +
              '<div><i data-lucide="mail"></i><a href="mailto:' + MAIL + '">' + MAIL + '</a></div>' +
              '<div><i data-lucide="calendar"></i><a data-rdv href="' + AGENDA + '" target="_blank" rel="noopener">Prendre rendez-vous</a></div>' +
            '</div>' +
          '</div>' +
          '<div class="sit-footer-cols">' +
            '<div><h5>Nos voyages</h5><ul>' +
              '<li><a href="' + root + 'circuits/saveurs-du-perou.html">Saveurs du Pérou</a></li>' +
              '<li><a href="' + root + 'circuits/el-inti.html">El Inti</a></li>' +
              '<li><a href="' + root + 'circuits/essentiel-perou.html">L\'Essentiel du Pérou</a></li>' +
              '<li><a href="' + root + 'circuits/grand-sud-amazonie.html">Grand Sud et Amazonie</a></li>' +
              '<li><a href="' + root + 'circuits/escapade-andine-solidaire.html">Escapade Andine solidaire</a></li>' +
              '<li><a href="' + root + 'circuits/index.html">Tous nos itinéraires</a></li>' +
              '<li><a href="' + root + 'voyage-sur-mesure.html">Voyage sur mesure</a></li>' +
            '</ul></div>' +
            '<div><h5>L\'agence</h5><ul>' +
              '<li><a href="' + root + 'engagement.html">Notre engagement</a></li>' +
              '<li><a href="' + root + 'le-perou/index.html">Le Pérou</a></li>' +
              '<li><a href="' + root + 'le-perou/carnet/index.html">Carnet de route</a></li>' +
              '<li><a href="' + root + 'contact.html">Nous contacter</a></li>' +
              '<li><a data-rdv href="' + AGENDA + '" target="_blank" rel="noopener">Prendre rendez-vous</a></li>' +
            '</ul></div>' +
            '<div><h5>Pratique</h5><ul>' +
              '<li><a href="' + root + 'departs/index.html">Prochains départs</a></li>' +
              '<li><a href="' + root + 'le-perou/carnet/preparer-son-voyage-perou.html">Préparer son voyage</a></li>' +
              '<li><a href="' + root + 'conditions-generales-vente.html">Conditions générales de vente</a></li>' +
              '<li><a href="' + root + 'mentions-legales.html">Mentions légales</a></li>' +
              '<li><a href="' + root + 'confidentialite.html">Politique de confidentialité</a></li>' +
            '</ul></div>' +
          '</div>' +
        '</div>' +
        '<div class="sit-footer-base">' +
          '<span>© 2026 Solidaire Inca Tour · Lima, Pérou</span>' +
          '<span>« Voyager autrement, voyager utile. »</span>' +
          '<span class="sit-footer-credit">Site réalisé par <a href="https://www.shorai-group.com" target="_blank" rel="noopener">ShorAI Consulting</a></span>' +
        '</div>' +
      '</footer>';
  }

  document.querySelectorAll('[data-include="header"]').forEach(function (el) {
    el.outerHTML = headerHTML(el.getAttribute('data-active'));
  });
  document.querySelectorAll('[data-include="footer"]').forEach(function (el) {
    el.outerHTML = footerHTML();
  });

  /* ---- menu mobile ---- */
  var burger = document.querySelector('.sit-burger');
  var drawer = document.getElementById('sit-drawer');
  if (burger && drawer) {
    var toggle = function (open) {
      drawer.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.classList.toggle('sit-burger-open', open);
      document.body.classList.toggle('sit-no-scroll', open);
    };
    burger.addEventListener('click', function () { toggle(drawer.hidden); });
    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') toggle(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) toggle(false);
    });
  }

  /* ---- ombre de la barre au défilement ---- */
  var nav = document.querySelector('.sit-nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('sit-nav-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- lien unique de prise de rendez-vous ---- */
  document.querySelectorAll('a[data-rdv]').forEach(function (a) {
    a.setAttribute('href', AGENDA);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  if (window.lucide) window.lucide.createIcons();
})();
