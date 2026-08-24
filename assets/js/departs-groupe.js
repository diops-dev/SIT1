/* Solidaire Inca Tour, composant Départs Groupe
   JavaScript natif, sans dépendance, sans étape de build.
   Deux usages :
   - <div data-departs-groupe="1004"></div>  -> liste des départs d'un seul circuit,
     insérée sous l'onglet "En petit groupe" du panneau de réservation.
   - <div data-departs-groupe-catalogue></div> -> page catalogue, tous circuits,
     avec filtres circuit / mois / thème reflétés dans l'URL. */

(function () {
  "use strict";

  // À renseigner par l'agence avant mise en production. Tant que ce champ
  // est vide, le formulaire affiche la demande sans tenter d'envoi réseau.
  var ENDPOINT = "https://formsubmit.co/ajax/contact@kirakutravel.com";

  var scriptEl = document.currentScript;
  var ROOT = scriptEl.src.replace(/assets\/js\/departs-groupe\.js.*$/, "");
  var DATA_URL = ROOT + "data/departs-groupe.json";

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var THEMES = {
    "fete-peruvienne": "Pendant une grande fête péruvienne",
    "vacances-scolaires": "Pendant les vacances scolaires",
    "hors-vacances": "Hors des vacances scolaires, quand le Pérou est plus calme"
  };

  var dataPromise = null;
  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch(DATA_URL)
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(function (json) {
          if (!json || !Array.isArray(json.departs) || !Array.isArray(json.circuits)) throw new Error("JSON invalide");
          return json;
        });
    }
    return dataPromise;
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function parseISO(iso) {
    var p = iso.split("-");
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  }

  /* « 1er mai » et jamais « 1 mai ». L'annee est indispensable :
     le calendrier couvre 2026 et 2027. */
  function fmtDayMonth(iso, avecAnnee) {
    var d = parseISO(iso);
    var jour = d.getUTCDate();
    return (jour === 1 ? "1er" : jour) + " " + MOIS[d.getUTCMonth()] +
           (avecAnnee === false ? "" : " " + d.getUTCFullYear());
  }

  function fmtPrice(eur) {
    return eur.toLocaleString("fr-FR") + "\u00a0\u20ac";
  }

  function isUpcoming(iso, ref) {
    return iso >= (ref || todayISO());
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- Repli commun (fetch en échec, ou aucun départ) ----------
  function renderFallback(container) {
    container.innerHTML =
      '<div class="sitdg-fallback">' +
      "<p>Nous n'avons pas de date de groupe à afficher pour le moment sur ce circuit.</p>" +
      '<div class="sitdg-fallback-actions">' +
      '<a class="btn btn-secondary" href="' + ROOT + 'voyage-sur-mesure.html">Voyage sur mesure</a>' +
      '<a class="btn btn-primary" href="' + ROOT + 'contact.html">Prendre rendez-vous</a>' +
      "</div></div>";
  }

  // ================= Widget fiche circuit =================
  function initTripWidget(container) {
    var ref = container.getAttribute("data-departs-groupe");
    loadData().then(function (data) {
      var circuit = data.circuits.filter(function (c) { return c.ref === ref; })[0];
      if (!circuit) { renderFallback(container); return; }
      var today = todayISO();
      var upcoming = data.departs
        .filter(function (d) { return d.refCircuit === ref; })
        .filter(function (d) { return d.statut !== "annule"; })
        .filter(function (d) { return isUpcoming(d.depart, today); })
        .sort(function (a, b) { return a.depart < b.depart ? -1 : 1; });
      if (!upcoming.length) { renderFallback(container); return; }
      renderTripWidget(container, data.regles, circuit, upcoming);
    }).catch(function () { renderFallback(container); });
  }

  function renderTripWidget(container, regles, circuit, departs) {
    var uid = "sitdg-" + circuit.ref;
    var visibleCount = 4;
    var html = "";
    html += '<div class="sitdg-badges">';
    html += '<span class="sitdg-badge sitdg-badge-full">' + escapeHtml(regles.badgeFormule) + "</span>";
    html += '<span class="sitdg-badge sitdg-badge-short">' + escapeHtml(regles.badgeFormuleCourt) + "</span>";
    html += "</div>";
    html += '<form class="sitdg-form" novalidate>';
    html += '<fieldset class="sitdg-fieldset"><legend class="sitdg-legend">Choisissez une date de départ</legend>';
    html += '<div class="sitdg-list">';
    departs.forEach(function (d, i) {
      var complet = d.statut === "complet";
      var rowId = uid + "-" + d.id;
      html += '<div class="sitdg-row ' + (complet ? "sitdg-row-complet" : "") + '" ' + (i >= visibleCount ? 'hidden data-sitdg-extra="1"' : "") + ">";
      html += '<input class="sitdg-radio" type="radio" id="' + rowId + '" name="' + uid + '-date" value="' + d.id + '" ' + (complet ? "disabled" : "") + ">";
      html += '<label class="sitdg-row-label" for="' + rowId + '">';
      html += '<span class="sitdg-row-main">';
      var memeAnnee = d.depart.slice(0, 4) === d.retour.slice(0, 4);
      html += '<span class="sitdg-row-dates">' + fmtDayMonth(d.depart, !memeAnnee) + " \u2192 " + fmtDayMonth(d.retour) + "</span>";
      html += '<span class="sitdg-row-duration">' + circuit.dureeJours + " jours</span>";
      html += "</span>";
      html += '<span class="sitdg-row-side">';
      html += complet
        ? '<span class="sitdg-complet-tag">Complet</span>'
        : '<span class="sitdg-price">à partir de <strong>' + fmtPrice(circuit.prixAPartirDeEUR) + "</strong></span>";
      html += "</span>";
      if (d.fete) html += '<span class="sitdg-fete">' + escapeHtml(d.fete) + "</span>";
      html += "</label></div>";
    });
    html += "</div>";
    if (departs.length > visibleCount) {
      html += '<button type="button" class="sitdg-more-btn">Voir toutes les dates</button>';
    }
    html += "</fieldset>";
    html += '<p class="sitdg-mention">' + escapeHtml(regles.mentionLegaleFormule) + "</p>";

    html += '<div class="sitdg-travelers" hidden>';
    html += '<label for="' + uid + '-nb">Nombre de voyageurs</label>';
    html += '<input type="number" id="' + uid + '-nb" min="1" max="' + regles.jaugeMax + '" value="2">';
    html += "</div>";

    html += '<div class="sitdg-recap" aria-live="polite" hidden>';
    html += '<dl>';
    html += '<div><dt>Dates</dt><dd class="sitdg-recap-dates"></dd></div>';
    html += '<div><dt>Durée</dt><dd class="sitdg-recap-duree"></dd></div>';
    html += '<div><dt>Voyageurs</dt><dd class="sitdg-recap-nb"></dd></div>';
    html += '<div class="sitdg-recap-total"><dt>Prix indicatif total</dt><dd class="sitdg-recap-total-val"></dd></div>';
    html += "</dl></div>";

    html += '<div class="sitdg-contact" hidden>';
    html += '<label>Nom et prénom<input type="text" name="nom" required autocomplete="name"></label>';
    html += '<label>Email<input type="email" name="email" required autocomplete="email"></label>';
    html += '<label>Téléphone<input type="tel" name="telephone" autocomplete="tel"></label>';
    html += '<label class="sitdg-honeypot" aria-hidden="true"><input type="text" name="entreprise" tabindex="-1" autocomplete="off"></label>';
    html += "</div>";

    html += '<button type="submit" class="sitdg-submit" hidden>Demander cette date</button>';
    html += "</form>";
    html += '<p class="sitdg-status" role="status"></p>';

    container.innerHTML = html;
    wireTripWidget(container, regles, circuit, departs, uid);
  }

  function wireTripWidget(container, regles, circuit, departs, uid) {
    var form = container.querySelector(".sitdg-form");
    var moreBtn = container.querySelector(".sitdg-more-btn");
    var travelersBox = container.querySelector(".sitdg-travelers");
    var nbInput = container.querySelector("#" + uid + "-nb");
    var recapBox = container.querySelector(".sitdg-recap");
    var contactBox = container.querySelector(".sitdg-contact");
    var submitBtn = container.querySelector(".sitdg-submit");
    var status = container.querySelector(".sitdg-status");

    if (moreBtn) {
      moreBtn.addEventListener("click", function () {
        container.querySelectorAll("[data-sitdg-extra]").forEach(function (row) { row.hidden = false; });
        moreBtn.remove();
      });
    }

    var selected = null;
    function onSelect(id) {
      selected = departs.filter(function (d) { return d.id === id; })[0] || null;
      if (!selected) return;
      travelersBox.hidden = false;
      recapBox.hidden = false;
      contactBox.hidden = false;
      submitBtn.hidden = false;
      if (regles.afficherPlacesRestantes === false && selected.placesRestantes != null) {
        nbInput.max = String(Math.min(regles.jaugeMax, selected.placesRestantes || regles.jaugeMax));
        if (+nbInput.value > +nbInput.max) nbInput.value = nbInput.max;
      } else {
        nbInput.max = String(regles.jaugeMax);
      }
      updateRecap();
    }

    function updateRecap() {
      if (!selected) return;
      var nb = Math.max(1, Math.min(+nbInput.max || regles.jaugeMax, +nbInput.value || 1));
      nbInput.value = nb;
      container.querySelector(".sitdg-recap-dates").textContent = fmtDayMonth(selected.depart) + " \u2192 " + fmtDayMonth(selected.retour);
      container.querySelector(".sitdg-recap-duree").textContent = circuit.dureeJours + " jours";
      container.querySelector(".sitdg-recap-nb").textContent = nb + (nb > 1 ? " voyageurs" : " voyageur");
      container.querySelector(".sitdg-recap-total-val").textContent = fmtPrice(circuit.prixAPartirDeEUR * nb);
    }

    form.addEventListener("change", function (e) {
      if (e.target.name === uid + "-date") onSelect(e.target.value);
      if (e.target === nbInput) updateRecap();
    });
    nbInput && nbInput.addEventListener("input", updateRecap);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!selected) return;
      var fd = new FormData(form);
      if (fd.get("entreprise")) return; // honeypot rempli, requête silencieusement ignorée
      var nbVoy = +nbInput.value;
      var payload = {
        _subject: "Site SIT, demande de place : " + circuit.titre + " du " + fmtDayMonth(selected.depart),
        _template: "table",
        _captcha: "false",
        circuit: circuit.titre + " (ref " + circuit.ref + ")",
        dates: fmtDayMonth(selected.depart) + " au " + fmtDayMonth(selected.retour),
        duree: circuit.dureeJours + " jours",
        nombreVoyageurs: nbVoy,
        prixIndicatifTotal: fmtPrice(circuit.prixAPartirDeEUR * nbVoy),
        nom: fd.get("nom"),
        email: fd.get("email"),
        telephone: fd.get("telephone") || "non renseigne",
        idDepart: selected.id,
        refCircuit: circuit.ref
      };
      submitBtn.disabled = true;
      status.textContent = "Envoi en cours\u2026";
      status.removeAttribute("data-kind");
      sendRequest(payload).then(function () {
        status.textContent = "Merci, votre demande a bien été envoyée. Frédéric vous recontacte pour confirmer.";
        status.setAttribute("data-kind", "ok");
        submitBtn.disabled = false;
      }).catch(function () {
        status.textContent = "L'envoi a échoué. Écrivez-nous à contact@kirakutravel.com ou appelez le +33 6 70 09 49 64.";
        status.setAttribute("data-kind", "error");
        submitBtn.disabled = false;
      });
    });
  }

  function sendRequest(payload) {
    if (!ENDPOINT) {
      console.warn("departs-groupe.js : ENDPOINT n'est pas configuré, demande non envoyée.", payload);
      return Promise.reject(new Error("ENDPOINT absent"));
    }
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); });
  }

  // ================= Mode catalogue =================
  function initCatalogue(container) {
    loadData().then(function (data) {
      renderCatalogue(container, data);
    }).catch(function () { renderFallback(container); });
  }

  function readFilters() {
    var qs = new URLSearchParams(location.search);
    return {
      circuit: qs.get("circuit") || "",
      mois: qs.get("mois") || "",
      theme: qs.get("theme") ? qs.get("theme").split(",") : []
    };
  }
  function writeFilters(f) {
    var qs = new URLSearchParams();
    if (f.circuit) qs.set("circuit", f.circuit);
    if (f.mois) qs.set("mois", f.mois);
    if (f.theme.length) qs.set("theme", f.theme.join(","));
    var qstr = qs.toString();
    history.replaceState(null, "", location.pathname + (qstr ? "?" + qstr : ""));
  }

  function renderCatalogue(container, data) {
    var filters = readFilters();
    var today = todayISO();

    container.innerHTML =
      '<div class="sitdg-catalogue-filters">' +
      '<div class="sitdg-filter"><label for="sitdg-f-circuit">Circuit</label><select id="sitdg-f-circuit">' +
      '<option value="">Tous les circuits</option>' +
      data.circuits.map(function (c) { return '<option value="' + c.ref + '">' + escapeHtml(c.titre) + "</option>"; }).join("") +
      "</select></div>" +
      '<div class="sitdg-filter"><label for="sitdg-f-mois">Mois</label><select id="sitdg-f-mois">' +
      '<option value="">Tous les mois</option>' +
      MOIS.map(function (m, i) { return '<option value="' + pad(i + 1) + '">' + m + (data.regles.moisFermes.indexOf(i + 1) > -1 ? " (fermé)" : "") + "</option>"; }).join("") +
      "</select></div>" +
      '<div class="sitdg-theme-group"><span>Thème</span><div class="sitdg-theme-options">' +
      Object.keys(THEMES).map(function (key) {
        return '<label class="sitdg-theme-option"><input type="checkbox" value="' + key + '" ' + (filters.theme.indexOf(key) > -1 ? "checked" : "") + ">" + THEMES[key] + "</label>";
      }).join("") +
      "</div></div>" +
      "</div>" +
      '<div class="sitdg-results"></div>';

    var circuitSel = container.querySelector("#sitdg-f-circuit");
    var moisSel = container.querySelector("#sitdg-f-mois");
    var themeChecks = container.querySelectorAll(".sitdg-theme-option input");
    circuitSel.value = filters.circuit;
    moisSel.value = filters.mois;

    function currentFilters() {
      return {
        circuit: circuitSel.value,
        mois: moisSel.value,
        theme: Array.prototype.filter.call(themeChecks, function (c) { return c.checked; }).map(function (c) { return c.value; })
      };
    }

    function apply() {
      var f = currentFilters();
      writeFilters(f);
      renderResults(container.querySelector(".sitdg-results"), data, f, today);
    }

    circuitSel.addEventListener("change", apply);
    moisSel.addEventListener("change", apply);
    themeChecks.forEach(function (c) { c.addEventListener("change", apply); });

    renderResults(container.querySelector(".sitdg-results"), data, filters, today);
  }

  function renderResults(box, data, filters, today) {
    var moisFermeSelectionne = filters.mois && data.regles.moisFermes.indexOf(+filters.mois) > -1;
    if (moisFermeSelectionne) {
      box.innerHTML =
        '<div class="sitdg-season-closed"><p>' + escapeHtml(data.regles.messageSaisonFermee) + "</p>" +
        '<div class="sitdg-season-closed-actions">' +
        '<a class="btn btn-secondary" href="' + ROOT + 'voyage-sur-mesure.html">Voyage sur mesure</a>' +
        '<a class="btn btn-primary" href="' + ROOT + 'circuits/index.html">Voir nos circuits en formule privée</a>' +
        "</div></div>";
      return;
    }

    var circuitsByRef = {};
    data.circuits.forEach(function (c) { circuitsByRef[c.ref] = c; });

    var rows = data.departs
      .filter(function (d) { return d.statut !== "annule"; })
      .filter(function (d) { return isUpcoming(d.depart, today); })
      .filter(function (d) { return !filters.circuit || d.refCircuit === filters.circuit; })
      .filter(function (d) { return !filters.mois || d.depart.slice(5, 7) === filters.mois; })
      .filter(function (d) { return !filters.theme.length || filters.theme.indexOf(d.categorie) > -1; })
      .sort(function (a, b) { return a.depart < b.depart ? -1 : 1; });

    if (!rows.length) {
      box.innerHTML =
        '<div class="sitdg-empty"><p>Aucun départ ne correspond à cette sélection.</p>' +
        '<button type="button" class="btn btn-secondary" id="sitdg-reset">Réinitialiser les filtres</button></div>';
      box.querySelector("#sitdg-reset").addEventListener("click", function () {
        history.replaceState(null, "", location.pathname);
        location.reload();
      });
      return;
    }

    var html = '<div class="sitdg-catalogue-list">';
    rows.forEach(function (d) {
      var circuit = circuitsByRef[d.refCircuit];
      var complet = d.statut === "complet";
      html += '<div class="sitdg-catalogue-row ' + (complet ? "sitdg-row-complet" : "") + '">';
      html += '<div class="sitdg-catalogue-main">';
      html += '<div class="sitdg-catalogue-circuit"><a href="' + ROOT + "circuits/" + circuit.slug + '.html">' + escapeHtml(circuit.titre) + "</a></div>";
      html += '<div class="sitdg-catalogue-dates">' + fmtDayMonth(d.depart) + " \u2192 " + fmtDayMonth(d.retour) + " \u00b7 " + circuit.dureeJours + " jours</div>";
      if (d.fete) html += '<div class="sitdg-fete">' + escapeHtml(d.fete) + "</div>";
      html += "</div>";
      html += '<div class="sitdg-catalogue-side">';
      html += complet
        ? '<span class="sitdg-complet-tag">Complet</span>'
        : '<span class="sitdg-price">à partir de <strong>' + fmtPrice(circuit.prixAPartirDeEUR) + "</strong></span>";
      if (!complet) {
        html += '<a class="btn btn-primary sitdg-catalogue-cta" href="' + ROOT + "circuits/" + circuit.slug + '.html#reservation">Voir cette date</a>';
      }
      html += "</div></div>";
    });
    html += "</div>";
    box.innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-departs-groupe]").forEach(initTripWidget);
    document.querySelectorAll("[data-departs-groupe-catalogue]").forEach(initCatalogue);
  });
})();
