/* Solidaire Inca Tour, filtres du catalogue.
   Les fiches sont écrites en dur dans la page (bon pour le référencement),
   le script ne fait que masquer celles qui ne correspondent pas. */
(function () {
  var root = document.querySelector('[data-catalogue]');
  if (!root) return;

  var cards   = Array.prototype.slice.call(root.querySelectorAll('.sit-trip-card'));
  var grid    = root.querySelector('.sit-trip-grid');
  var empty   = root.querySelector('.sit-empty-state');
  var pills   = root.querySelector('[data-active-pills]');
  var counter = root.querySelector('[data-count]');

  var state = { type: 'tous', duree: 'tous', themes: [] };

  var LABELS = {};
  root.querySelectorAll('.sit-filter-opts .sit-pill').forEach(function (b) {
    LABELS[b.dataset.group + ':' + b.dataset.value] = b.textContent.trim();
  });

  function matches(card) {
    var type = card.dataset.type;
    if (state.type !== 'tous' && type !== state.type && type !== 'les-deux') return false;
    var d = parseInt(card.dataset.days, 10);
    if (state.duree === 'court' && d > 8) return false;
    if (state.duree === 'moyen' && (d < 9 || d > 14)) return false;
    if (state.duree === 'long'  && d < 15) return false;
    var themes = (card.dataset.themes || '').split('|');
    return state.themes.every(function (t) { return themes.indexOf(t) !== -1; });
  }

  function render() {
    var shown = 0;
    cards.forEach(function (c) {
      var ok = matches(c);
      c.hidden = !ok;
      if (ok) shown++;
    });
    if (grid)  grid.hidden = shown === 0;
    if (empty) empty.hidden = shown > 0;
    if (counter) {
      counter.textContent = shown === cards.length
        ? 'Catalogue · ' + cards.length + ' voyages'
        : shown + (shown > 1 ? ' voyages correspondent' : ' voyage correspond') + ' à votre recherche';
    }

    root.querySelectorAll('.sit-filter-opts .sit-pill').forEach(function (b) {
      var on = b.dataset.group === 'theme'
        ? state.themes.indexOf(b.dataset.value) !== -1
        : state[b.dataset.group] === b.dataset.value;
      b.classList.toggle('sit-pill-active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    if (pills) {
      var active = [];
      if (state.type  !== 'tous') active.push({ g: 'type',  v: state.type });
      if (state.duree !== 'tous') active.push({ g: 'duree', v: state.duree });
      state.themes.forEach(function (t) { active.push({ g: 'theme', v: t }); });
      pills.hidden = active.length === 0;
      pills.innerHTML = active.map(function (a) {
        return '<button type="button" class="sit-pill sit-pill-x" data-clear-group="' + a.g +
               '" data-clear-value="' + a.v + '">' + (LABELS[a.g + ':' + a.v] || a.v) +
               ' <b aria-hidden="true">&#10005;</b><span class="sit-sr">Retirer ce filtre</span></button>';
      }).join('') + '<button type="button" class="sit-filter-clear" data-clear-all>Réinitialiser</button>';
    }
  }

  root.addEventListener('click', function (e) {
    var pill = e.target.closest('.sit-filter-opts .sit-pill');
    if (pill) {
      var g = pill.dataset.group, v = pill.dataset.value;
      if (g === 'theme') {
        var i = state.themes.indexOf(v);
        if (i === -1) { state.themes.push(v); } else { state.themes.splice(i, 1); }
      } else {
        state[g] = v;
      }
      return render();
    }
    var x = e.target.closest('[data-clear-group]');
    if (x) {
      var cg = x.dataset.clearGroup, cv = x.dataset.clearValue;
      if (cg === 'theme') { state.themes = state.themes.filter(function (t) { return t !== cv; }); }
      else { state[cg] = 'tous'; }
      return render();
    }
    if (e.target.closest('[data-clear-all]')) {
      state = { type: 'tous', duree: 'tous', themes: [] };
      return render();
    }
  });

  /* Filtre pré-appliqué via l'ancre : circuits/index.html#groupe ou #prive */
  var hash = (location.hash || '').replace('#', '');
  if (hash === 'groupe' || hash === 'prive') state.type = hash;

  render();
})();
