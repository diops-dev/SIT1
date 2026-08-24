/* ==========================================================
   Solidaire Inca Tour, modale « Demander un devis »
   Ouverte par tout élément portant l'attribut data-devis.
   data-devis="Nom du circuit" pré-remplit le sujet.
   ----------------------------------------------------------
   À RENSEIGNER AVANT MISE EN LIGNE
   ENDPOINT : URL du service qui reçoit le formulaire
   (Formspree, Brevo, script interne...). Tant qu'elle est
   vide, le formulaire ouvre le client mail du visiteur avec
   un message pré-rempli, rien n'est perdu.
   ========================================================== */
(function () {
  var ENDPOINT = 'https://formsubmit.co/ajax/contact@kirakutravel.com';
  var MAIL = 'contact@kirakutravel.com';
  var AGENDA = 'https://calendar.app.google/NsEizZRPr2kRaaeq5';

  var script = document.currentScript ||
    document.querySelector('script[src*="assets/js/devis.js"]');
  var root = script.src.replace(/assets\/js\/devis\.js.*$/, '');

  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div class="sit-modal-scrim" id="sit-devis" hidden role="dialog" aria-modal="true" aria-labelledby="sit-devis-titre">' +
      '<div class="sit-modal">' +
        '<button type="button" class="sit-modal-close" data-devis-close aria-label="Fermer"><i data-lucide="x"></i></button>' +
        '<div data-devis-form>' +
          '<div class="eyebrow">Demander un devis</div>' +
          '<h3 class="sit-modal-title" id="sit-devis-titre">Construisons votre voyage.</h3>' +
          '<p class="sit-modal-lead">Décrivez-nous brièvement ce que vous cherchez. Frédéric vous appelle ensuite pour préciser l\'itinéraire, aucun engagement.</p>' +
          '<form class="sit-form" novalidate>' +
            '<input type="hidden" name="circuit" value="" />' +
            '<div class="sit-form-row">' +
              '<label>Votre prénom et nom<input name="nom" required autocomplete="name" placeholder="Marie Dupont" /></label>' +
              '<label>Email<input name="email" type="email" required autocomplete="email" placeholder="vous@exemple.fr" /></label>' +
            '</div>' +
            '<div class="sit-form-row">' +
              '<label>Téléphone<input name="telephone" type="tel" autocomplete="tel" placeholder="06 12 34 56 78" /></label>' +
              '<label>Nombre de voyageurs<input name="voyageurs" type="number" min="1" max="30" value="2" /></label>' +
            '</div>' +
            '<div class="sit-form-row">' +
              '<label>Période souhaitée' +
                '<select name="periode">' +
                  '<option>Avril, mai 2027</option>' +
                  '<option>Juin, juillet 2027</option>' +
                  '<option>Août, septembre 2027</option>' +
                  '<option>Octobre, novembre 2027</option>' +
                  '<option>Je ne sais pas encore</option>' +
                '</select>' +
              '</label>' +
              '<label>Formule' +
                '<select name="formule">' +
                  '<option>En petit groupe</option>' +
                  '<option>En privé</option>' +
                  '<option>Sur mesure</option>' +
                  '<option>Je ne sais pas encore</option>' +
                '</select>' +
              '</label>' +
            '</div>' +
            '<label>Ce que vous aimeriez vivre' +
              '<textarea name="message" rows="4" placeholder="Randonnée, rencontres avec les coopératives, Machu Picchu, plutôt nature ou plutôt villes..."></textarea>' +
            '</label>' +
            '<label class="sit-form-consent">' +
              '<input type="checkbox" name="consentement" required />' +
              '<span>J\'accepte que mes coordonnées soient utilisées pour être recontacté au sujet de ce projet de voyage.</span>' +
            '</label>' +
            '<p class="sit-form-error" data-devis-error hidden></p>' +
            '<button type="submit" class="btn btn-primary btn-large">Envoyer à Frédéric <span aria-hidden="true">&rarr;</span></button>' +
            '<p class="sit-form-rdv">Vous préférez en parler de vive voix ? <a data-rdv href="' + AGENDA + '" target="_blank" rel="noopener">Réservez un créneau téléphonique</a>.</p>' +
            '<p class="sit-form-help">Réponse personnelle sous 24 h ouvrées. Vos coordonnées restent confidentielles et ne sont jamais cédées.</p>' +
          '</form>' +
        '</div>' +
        '<div class="sit-modal-sent" data-devis-sent hidden>' +
          '<img src="' + root + 'assets/bird-gold.png" alt="" style="height:88px;margin-bottom:14px" />' +
          '<h3 class="sit-modal-title">Merci, c\'est noté.</h3>' +
          '<p>Frédéric vous répondra personnellement sous 24 h ouvrées.</p>' +
          '<div class="sit-modal-actions">' +
            '<a class="btn btn-primary" data-rdv href="' + AGENDA + '" target="_blank" rel="noopener">Prendre rendez-vous</a>' +
            '<button type="button" class="btn btn-secondary" data-devis-close>Fermer</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap.firstChild);

  var scrim   = document.getElementById('sit-devis');
  var form    = scrim.querySelector('form');
  var paneF   = scrim.querySelector('[data-devis-form]');
  var paneS   = scrim.querySelector('[data-devis-sent]');
  var errorEl = scrim.querySelector('[data-devis-error]');
  var lastFocus = null;

  function open(circuit) {
    lastFocus = document.activeElement;
    form.elements.circuit.value = circuit || '';
    paneF.hidden = false;
    paneS.hidden = true;
    errorEl.hidden = true;
    scrim.hidden = false;
    document.body.classList.add('sit-no-scroll');
    if (window.lucide) window.lucide.createIcons();
    var first = form.querySelector('input');
    if (first) first.focus();
  }
  function close() {
    scrim.hidden = true;
    document.body.classList.remove('sit-no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-devis]');
    if (trigger) {
      e.preventDefault();
      open(trigger.getAttribute('data-devis'));
      return;
    }
    if (e.target.closest('[data-devis-close]') || e.target === scrim) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !scrim.hidden) close();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data._subject = 'Site SIT, demande de devis' + (data.circuit ? ' : ' + data.circuit : '');
    data._template = 'table';
    data._captcha = 'false';

    if (!data.nom || !data.email || !data.consentement) {
      errorEl.textContent = 'Merci de renseigner votre nom, votre email et de cocher la case de consentement.';
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;

    var done = function () { paneF.hidden = true; paneS.hidden = false; };

    if (ENDPOINT) {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (r.ok) { done(); } else { throw new Error('HTTP ' + r.status); }
      }).catch(function () {
        errorEl.textContent = 'L\'envoi a échoué. Écrivez-nous directement à ' + MAIL + '.';
        errorEl.hidden = false;
      });
      return;
    }

    var sujet = 'Demande de devis' + (data.circuit ? ' : ' + data.circuit : '');
    var corps = [
      'Nom : ' + data.nom,
      'Email : ' + data.email,
      'Téléphone : ' + (data.telephone || 'non renseigné'),
      'Voyageurs : ' + data.voyageurs,
      'Période : ' + data.periode,
      'Formule : ' + data.formule,
      data.circuit ? 'Circuit : ' + data.circuit : '',
      '',
      data.message || ''
    ].filter(Boolean).join('\n');
    window.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(sujet) +
                           '&body=' + encodeURIComponent(corps);
    done();
  });
})();
