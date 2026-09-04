/* Solidaire Inca Tour, date du prochain depart sur les vignettes d'itineraire.
   Les vignettes portent une date ecrite dans le HTML : elle vieillit. Ce script
   la recalcule a chaque visite depuis data/departs-groupe.json, pour les seuls
   circuits proposes en petit groupe. Les autres restent sur la mention
   « Depart a la date de votre choix », qui est vraie en permanence.
   En cas d'echec du chargement, le HTML deja en place n'est pas touche. */
(function () {
  var cards = document.querySelectorAll(".sit-trip-card[href]");
  if (!cards.length) return;

  var script = document.currentScript ||
    document.querySelector('script[src*="assets/js/prochains-departs.js"]');
  var ROOT = script.src.replace(/assets\/js\/prochains-departs\.js.*$/, "");

  /* slug de la fiche -> reference du circuit au calendrier de groupe */
  var REFS = {
    "el-inti": "1001",
    "saveurs-du-perou": "1003",
    "essentiel-perou": "1004",
    "essentiel-du-perou": "1004",
    "grand-sud-amazonie": "1005",
    "escapade-andine-solidaire": "1009"
  };

  var MOIS = ["janvier","février","mars","avril","mai","juin",
              "juillet","août","septembre","octobre","novembre","décembre"];

  function slugDe(href) {
    var m = href.split("?")[0].split("#")[0].match(/([^\/]+)\.html$/);
    return m ? m[1] : "";
  }
  function todayISO() {
    var d = new Date(), p = function (n) { return n < 10 ? "0" + n : "" + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }
  function enClair(iso) {
    var t = iso.split("-"), j = +t[2];
    return (j === 1 ? "1er" : j) + " " + MOIS[+t[1] - 1] + " " + t[0];
  }

  fetch(ROOT + "data/departs-groupe.json?t=" + Date.now())
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var today = todayISO();
      var parRef = {};
      data.departs.forEach(function (d) {
        if (d.statut === "annule" || d.statut === "complet") return;
        if (d.depart < today) return;
        (parRef[d.refCircuit] = parRef[d.refCircuit] || []).push(d.depart);
      });
      Object.keys(parRef).forEach(function (k) { parRef[k].sort(); });

      cards.forEach(function (card) {
        var box = card.querySelector(".sit-trip-dates");
        if (!box) return;
        var ref = REFS[slugDe(card.getAttribute("href"))];
        var dates = ref ? parRef[ref] : null;
        if (!dates || !dates.length) return;
        var reste = dates.length - 1;
        box.textContent = "Prochain départ : " + enClair(dates[0]);
        if (reste > 0) {
          var sp = document.createElement("span");
          sp.className = "sit-trip-dates-more";
          sp.textContent = reste + (reste > 1 ? " autres dates" : " autre date");
          box.appendChild(sp);
        }
      });
    })
    .catch(function () { /* on laisse le HTML en place */ });
})();
