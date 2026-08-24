/* Questionnaire « voyage sur mesure ».
   Compilé depuis le JSX du design system, ne pas éditer à la main :
   modifier la source dans le design system puis régénérer.
   ENDPOINT et AGENDA_URL se règlent en tête de ce fichier. */
// ---- URL du planning Google Agenda à renseigner ----
const AGENDA_URL = "https://calendar.app.google/NsEizZRPr2kRaaeq5";
// ---- Point de terminaison d'envoi, à renseigner avant mise en ligne ----
const ENDPOINT = "https://formsubmit.co/ajax/contact@kirakutravel.com";
function sendLead(payload) {
  if (!ENDPOINT) {
    return Promise.resolve({
      ok: true,
      skipped: true
    });
  }
  const body = Object.assign({}, payload, {
    _subject: "Site SIT, questionnaire voyage sur mesure",
    _template: "table",
    _captcha: "false"
  });
  return fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(body)
  });
}
const MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function nextMonths(n) {
  const out = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const m = (d.getMonth() + i) % 12;
    const y = d.getFullYear() + Math.floor((d.getMonth() + i) / 12);
    out.push(`${MOIS_FR[m]} ${y}`);
  }
  return out;
}
const AEROPORTS = ["Paris, Charles-de-Gaulle", "Paris, Orly", "Lyon, Saint-Exupéry", "Marseille Provence", "Nice Côte d'Azur", "Toulouse Blagnac", "Bordeaux Mérignac", "Nantes Atlantique", "Strasbourg", "Lille", "Genève", "Bruxelles", "Montréal, Trudeau"];
const INDICATIFS = [{
  code: "+33",
  label: "France (+33)",
  digits: 9
}, {
  code: "+32",
  label: "Belgique (+32)",
  digits: 8
}, {
  code: "+41",
  label: "Suisse (+41)",
  digits: 9
}, {
  code: "+352",
  label: "Luxembourg (+352)",
  digits: 8
}, {
  code: "+1",
  label: "Canada (+1)",
  digits: 10
}];
function Field({
  label,
  htmlFor,
  error,
  help,
  children,
  required
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "vsm-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "vsm-label",
    htmlFor: htmlFor
  }, label, required && " *"), children, help && /*#__PURE__*/React.createElement("p", {
    className: "vsm-help"
  }, help), error && /*#__PURE__*/React.createElement("p", {
    className: "vsm-error",
    role: "alert"
  }, error));
}
function RadioCards({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  required,
  help
}) {
  return /*#__PURE__*/React.createElement("fieldset", {
    className: "vsm-field",
    "aria-required": required
  }, /*#__PURE__*/React.createElement("legend", {
    className: "vsm-legend"
  }, legend, required && " *"), /*#__PURE__*/React.createElement("div", {
    className: "vsm-cards"
  }, options.map(opt => /*#__PURE__*/React.createElement("label", {
    className: "vsm-card",
    key: opt
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: opt,
    checked: value === opt,
    onChange: () => onChange(opt)
  }), opt))), help && /*#__PURE__*/React.createElement("p", {
    className: "vsm-help"
  }, help), error && /*#__PURE__*/React.createElement("p", {
    className: "vsm-error",
    role: "alert"
  }, error));
}
function CheckboxCards({
  legend,
  options,
  value,
  onToggle,
  exclusiveOption,
  help
}) {
  return /*#__PURE__*/React.createElement("fieldset", {
    className: "vsm-field"
  }, /*#__PURE__*/React.createElement("legend", {
    className: "vsm-legend"
  }, legend), /*#__PURE__*/React.createElement("div", {
    className: "vsm-cards"
  }, options.map(opt => /*#__PURE__*/React.createElement("label", {
    className: "vsm-card",
    key: opt
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: value.includes(opt),
    onChange: () => onToggle(opt, exclusiveOption)
  }), opt))), help && /*#__PURE__*/React.createElement("p", {
    className: "vsm-help"
  }, help));
}
function Stepper({
  label,
  value,
  min,
  max,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "vsm-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "vsm-stepper"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": `Diminuer, ${label}`,
    onClick: () => onChange(Math.max(min, value - 1))
  }, "−"), /*#__PURE__*/React.createElement("input", {
    className: "vsm-input",
    style: {
      border: "none"
    },
    type: "text",
    inputMode: "numeric",
    readOnly: true,
    value: value,
    "aria-live": "polite"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": `Augmenter, ${label}`,
    onClick: () => onChange(Math.min(max, value + 1))
  }, "+")));
}
function App() {
  const [screen, setScreen] = React.useState(1);
  const [errors, setErrors] = React.useState({});
  const [sendError, setSendError] = React.useState("");
  const [f, setF] = React.useState({
    depart_type: "",
    depart_debut: "",
    depart_fin: "",
    depart_mois: "",
    duree: "",
    adultes: 2,
    enfants: 0,
    enfants_ages: "",
    voyage_avec: "",
    interets: [],
    budget: "",
    budget_vols: false,
    hebergement: "",
    rythme: "",
    solidaire: "",
    vigilance: "",
    prenom: "",
    nom: "",
    email: "",
    indicatif: "+33",
    tel: "",
    ville_depart: "",
    contact_pref: "",
    connu_via: "",
    consentement: false,
    hp: ""
  });
  const set = (k, v) => setF(s => ({
    ...s,
    [k]: v
  }));
  const toggleInteret = (opt, exclusive) => {
    setF(s => {
      let list = s.interets;
      if (opt === exclusive) {
        list = list.includes(opt) ? [] : [opt];
      } else {
        list = list.includes(opt) ? list.filter(x => x !== opt) : [...list.filter(x => x !== exclusive), opt];
      }
      return {
        ...s,
        interets: list
      };
    });
  };
  function validateScreen1() {
    const e = {};
    if (!f.depart_type) e.depart_type = "Merci d'indiquer quand vous souhaitez partir.";
    if (f.depart_type === "Mes dates sont fixées") {
      if (!f.depart_debut || !f.depart_fin) e.depart_dates = "Merci d'indiquer une date de départ et de retour.";else if (f.depart_fin < f.depart_debut) e.depart_dates = "La date de retour ne peut pas précéder la date de départ.";
    }
    if (f.depart_type === "Je vise un mois précis" && !f.depart_mois) e.depart_mois = "Merci de choisir un mois.";
    if (!f.duree) e.duree = "Merci d'indiquer la durée souhaitée.";
    if (!f.voyage_avec) e.voyage_avec = "Merci d'indiquer avec qui vous voyagez.";
    if (f.enfants > 0 && !f.enfants_ages.trim()) e.enfants_ages = "Merci d'indiquer l'âge des enfants.";
    if (!f.budget) e.budget = "Merci d'indiquer votre budget indicatif.";
    if (!f.hebergement) e.hebergement = "Merci d'indiquer le niveau d'hébergement souhaité.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function validateScreen2() {
    const e = {};
    if (f.prenom.trim().length < 2) e.prenom = "Merci d'indiquer votre prénom.";
    if (f.nom.trim().length < 2) e.nom = "Merci d'indiquer votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Merci de vérifier votre adresse e-mail.";
    const ind = INDICATIFS.find(i => i.code === f.indicatif);
    const digits = f.tel.replace(/\D/g, "");
    if (digits.length !== ind.digits) e.tel = "Merci de vérifier votre numéro.";
    if (!f.ville_depart.trim()) e.ville_depart = "Merci d'indiquer votre ville de départ envisagée.";
    if (!f.contact_pref) e.contact_pref = "Merci d'indiquer comment nous pouvons vous appeler.";
    if (!f.consentement) e.consentement = "Merci d'accepter pour que nous puissions vous recontacter.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function goNext() {
    if (validateScreen1()) {
      setErrors({});
      setScreen(2);
    }
  }
  function goBack() {
    setErrors({});
    setScreen(1);
  }
  function submit() {
    if (!validateScreen2()) return;
    if (f.hp) {
      setScreen(3);
      return;
    }
    setSendError("");
    const payload = {
      ...f
    };
    delete payload.hp;
    sendLead(payload).then(res => {
      if (res && res.ok !== false) setScreen(3);else setSendError("Une erreur est survenue à l'envoi, merci de réessayer ou de nous appeler.");
    }).catch(() => setSendError("Une erreur est survenue à l'envoi, merci de réessayer ou de nous appeler."));
  }
  React.useEffect(() => {
    lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "sit-app"
  }, /*#__PURE__*/React.createElement("main", {
    className: "vsm-main"
  }, screen < 3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "vsm-progress",
    role: "progressbar",
    "aria-valuenow": screen,
    "aria-valuemin": "1",
    "aria-valuemax": "2"
  }, /*#__PURE__*/React.createElement("span", {
    className: screen >= 1 ? "done" : ""
  }), /*#__PURE__*/React.createElement("span", {
    className: screen >= 2 ? "done" : ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "vsm-step-label"
  }, "Étape ", screen, " sur 2")), screen === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    className: "vsm-h1"
  }, "Votre projet"), /*#__PURE__*/React.createElement("p", {
    className: "vsm-lead"
  }, "Deux minutes pour nous donner une première idée, nous affinerons ensemble au téléphone."), /*#__PURE__*/React.createElement(Field, {
    label: "Quand souhaitez-vous partir ?",
    htmlFor: "depart_type",
    required: true,
    error: errors.depart_type
  }, /*#__PURE__*/React.createElement("select", {
    id: "depart_type",
    className: "vsm-select",
    value: f.depart_type,
    onChange: e => set("depart_type", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Choisissez une option"), /*#__PURE__*/React.createElement("option", null, "Mes dates sont fixées"), /*#__PURE__*/React.createElement("option", null, "Je vise un mois précis"), /*#__PURE__*/React.createElement("option", null, "Je suis flexible, conseillez-moi"))), f.depart_type === "Mes dates sont fixées" && /*#__PURE__*/React.createElement(Field, {
    label: "",
    error: errors.depart_dates
  }, /*#__PURE__*/React.createElement("div", {
    className: "vsm-row2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "vsm-label",
    htmlFor: "depart_debut"
  }, "Départ"), /*#__PURE__*/React.createElement("input", {
    id: "depart_debut",
    type: "date",
    className: "vsm-input",
    value: f.depart_debut,
    onChange: e => set("depart_debut", e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "vsm-label",
    htmlFor: "depart_fin"
  }, "Retour"), /*#__PURE__*/React.createElement("input", {
    id: "depart_fin",
    type: "date",
    className: "vsm-input",
    value: f.depart_fin,
    onChange: e => set("depart_fin", e.target.value)
  })))), f.depart_type === "Je vise un mois précis" && /*#__PURE__*/React.createElement(Field, {
    label: "Mois envisagé",
    htmlFor: "depart_mois",
    error: errors.depart_mois
  }, /*#__PURE__*/React.createElement("select", {
    id: "depart_mois",
    className: "vsm-select",
    value: f.depart_mois,
    onChange: e => set("depart_mois", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Choisissez un mois"), nextMonths(18).map(m => /*#__PURE__*/React.createElement("option", {
    key: m
  }, m)))), /*#__PURE__*/React.createElement(RadioCards, {
    legend: "Combien de temps sur place ?",
    name: "duree",
    required: true,
    error: errors.duree,
    options: ["8 à 10 jours", "11 à 14 jours", "15 à 18 jours", "19 jours et plus", "À définir ensemble"],
    value: f.duree,
    onChange: v => set("duree", v)
  }), /*#__PURE__*/React.createElement("div", {
    className: "vsm-field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vsm-legend"
  }, "Qui voyage ? *"), /*#__PURE__*/React.createElement("div", {
    className: "vsm-row2"
  }, /*#__PURE__*/React.createElement(Stepper, {
    label: "Adultes, 12 ans et plus",
    value: f.adultes,
    min: 1,
    max: 30,
    onChange: v => set("adultes", v)
  }), /*#__PURE__*/React.createElement(Stepper, {
    label: "Enfants, moins de 12 ans",
    value: f.enfants,
    min: 0,
    max: 15,
    onChange: v => set("enfants", v)
  })), f.enfants > 0 && /*#__PURE__*/React.createElement(Field, {
    label: "Âge des enfants au moment du voyage",
    htmlFor: "enfants_ages",
    help: "Exemple : 7 et 11 ans",
    error: errors.enfants_ages
  }, /*#__PURE__*/React.createElement("input", {
    id: "enfants_ages",
    type: "text",
    className: "vsm-input",
    value: f.enfants_ages,
    onChange: e => set("enfants_ages", e.target.value)
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Vous voyagez...",
    htmlFor: "voyage_avec",
    required: true,
    error: errors.voyage_avec
  }, /*#__PURE__*/React.createElement("select", {
    id: "voyage_avec",
    className: "vsm-select",
    value: f.voyage_avec,
    onChange: e => set("voyage_avec", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Choisissez une option"), /*#__PURE__*/React.createElement("option", null, "En couple"), /*#__PURE__*/React.createElement("option", null, "En famille"), /*#__PURE__*/React.createElement("option", null, "Entre amis"), /*#__PURE__*/React.createElement("option", null, "Seul, seule"), /*#__PURE__*/React.createElement("option", null, "Groupe déjà constitué"), /*#__PURE__*/React.createElement("option", null, "Comité d'entreprise ou CSE"), /*#__PURE__*/React.createElement("option", null, "Association, école ou université"))), /*#__PURE__*/React.createElement(CheckboxCards, {
    legend: "Ce qui vous attire au Pérou",
    options: ["Machu Picchu", "Cusco et la Vallée Sacrée", "Lac Titicaca", "Arequipa et le canyon de Colca", "Amazonie", "Nazca et Paracas", "Nord et Chachapoyas", "Gastronomie péruvienne", "Randonnée et trek", "Rencontres avec les communautés andines", "Spiritualité andine", "Je ne sais pas encore, guidez-moi"],
    value: f.interets,
    onToggle: toggleInteret,
    exclusiveOption: "Je ne sais pas encore, guidez-moi"
  }), /*#__PURE__*/React.createElement(RadioCards, {
    legend: "Votre budget indicatif par personne, hors vol international",
    name: "budget",
    required: true,
    error: errors.budget,
    options: ["Moins de 3 000 €", "3 000 à 4 500 €", "4 500 à 6 000 €", "6 000 à 8 000 €", "Plus de 8 000 €", "Je préfère en parler de vive voix"],
    value: f.budget,
    onChange: v => set("budget", v)
  }), /*#__PURE__*/React.createElement("label", {
    className: "vsm-checkbox-row"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: f.budget_vols,
    onChange: e => set("budget_vols", e.target.checked)
  }), "Vols internationaux à inclure dans ce budget"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 30
    }
  }), /*#__PURE__*/React.createElement(RadioCards, {
    legend: "Niveau d'hébergement souhaité",
    name: "hebergement",
    required: true,
    error: errors.hebergement,
    options: ["Confort 3 étoiles", "Confort supérieur", "Charme 4 étoiles", "Prestige 5 étoiles", "Mélange selon les étapes"],
    value: f.hebergement,
    onChange: v => set("hebergement", v)
  }), /*#__PURE__*/React.createElement(RadioCards, {
    legend: "Votre rythme de voyage",
    name: "rythme",
    options: ["Tranquille, du temps sur place", "Équilibré", "Intensif, voir un maximum"],
    value: f.rythme,
    onChange: v => set("rythme", v)
  }), /*#__PURE__*/React.createElement(RadioCards, {
    legend: "La dimension solidaire, pour vous c'est...",
    name: "solidaire",
    options: ["Essentiel, c'est ma raison de vous contacter", "Important, sans que ce soit le cœur du voyage", "Un plus appréciable", "Je découvre, expliquez-moi"],
    value: f.solidaire,
    onChange: v => set("solidaire", v)
  }), /*#__PURE__*/React.createElement("div", {
    className: "vsm-actions",
    style: {
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary btn-large",
    onClick: goNext
  }, "Continuer, plus que 30 secondes"))), screen === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    className: "vsm-h1"
  }, "Vos coordonnées"), /*#__PURE__*/React.createElement("p", {
    className: "vsm-lead"
  }, "Pour préparer votre appel avec Frédéric."), /*#__PURE__*/React.createElement(Field, {
    label: "Santé, mobilité, altitude, régime alimentaire, quelque chose que nous devons savoir ?",
    htmlFor: "vigilance"
  }, /*#__PURE__*/React.createElement("textarea", {
    id: "vigilance",
    className: "vsm-textarea",
    rows: "2",
    maxLength: "300",
    value: f.vigilance,
    onChange: e => set("vigilance", e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "vsm-char-count"
  }, f.vigilance.length, " / 300")), /*#__PURE__*/React.createElement("div", {
    className: "vsm-row2"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Prénom",
    htmlFor: "prenom",
    required: true,
    error: errors.prenom
  }, /*#__PURE__*/React.createElement("input", {
    id: "prenom",
    type: "text",
    className: "vsm-input",
    value: f.prenom,
    onChange: e => set("prenom", e.target.value)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Nom",
    htmlFor: "nom",
    required: true,
    error: errors.nom
  }, /*#__PURE__*/React.createElement("input", {
    id: "nom",
    type: "text",
    className: "vsm-input",
    value: f.nom,
    onChange: e => set("nom", e.target.value)
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Adresse e-mail",
    htmlFor: "email",
    required: true,
    error: errors.email
  }, /*#__PURE__*/React.createElement("input", {
    id: "email",
    type: "email",
    className: "vsm-input",
    value: f.email,
    onChange: e => set("email", e.target.value)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Téléphone",
    htmlFor: "tel",
    required: true,
    error: errors.tel
  }, /*#__PURE__*/React.createElement("div", {
    className: "vsm-row2"
  }, /*#__PURE__*/React.createElement("select", {
    className: "vsm-select",
    "aria-label": "Indicatif pays",
    value: f.indicatif,
    onChange: e => set("indicatif", e.target.value)
  }, INDICATIFS.map(i => /*#__PURE__*/React.createElement("option", {
    key: i.code,
    value: i.code
  }, i.label))), /*#__PURE__*/React.createElement("input", {
    id: "tel",
    type: "tel",
    className: "vsm-input",
    value: f.tel,
    onChange: e => set("tel", e.target.value)
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Ville de départ envisagée",
    htmlFor: "ville_depart",
    required: true,
    error: errors.ville_depart
  }, /*#__PURE__*/React.createElement("input", {
    id: "ville_depart",
    list: "aeroports",
    type: "text",
    className: "vsm-input",
    value: f.ville_depart,
    onChange: e => set("ville_depart", e.target.value)
  }), /*#__PURE__*/React.createElement("datalist", {
    id: "aeroports"
  }, AEROPORTS.map(a => /*#__PURE__*/React.createElement("option", {
    key: a,
    value: a
  })))), /*#__PURE__*/React.createElement(RadioCards, {
    legend: "Vous préférez que nous vous appelions par...",
    name: "contact_pref",
    required: true,
    error: errors.contact_pref,
    options: ["Téléphone", "Visioconférence", "WhatsApp"],
    value: f.contact_pref,
    onChange: v => set("contact_pref", v)
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Comment nous avez-vous connus ?",
    htmlFor: "connu_via"
  }, /*#__PURE__*/React.createElement("select", {
    id: "connu_via",
    className: "vsm-select",
    value: f.connu_via,
    onChange: e => set("connu_via", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Choisissez une option"), /*#__PURE__*/React.createElement("option", null, "Recherche Google"), /*#__PURE__*/React.createElement("option", null, "Instagram"), /*#__PURE__*/React.createElement("option", null, "Facebook"), /*#__PURE__*/React.createElement("option", null, "Bouche à oreille"), /*#__PURE__*/React.createElement("option", null, "Un ancien voyageur"), /*#__PURE__*/React.createElement("option", null, "Salon ou événement"), /*#__PURE__*/React.createElement("option", null, "Presse ou blog"), /*#__PURE__*/React.createElement("option", null, "Autre"))), /*#__PURE__*/React.createElement("label", {
    className: "vsm-checkbox-row"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: f.consentement,
    onChange: e => set("consentement", e.target.checked)
  }), "J'accepte que Solidaire Inca Tour utilise ces informations pour préparer et me proposer un projet de voyage, conformément à la ", /*#__PURE__*/React.createElement("a", {
    href: "/confidentialite",
    target: "_blank",
    rel: "noopener"
  }, "politique de confidentialité"), "."), errors.consentement && /*#__PURE__*/React.createElement("p", {
    className: "vsm-error",
    role: "alert"
  }, errors.consentement), /*#__PURE__*/React.createElement("input", {
    className: "vsm-hp",
    type: "text",
    tabIndex: "-1",
    autoComplete: "off",
    "aria-hidden": "true",
    value: f.hp,
    onChange: e => set("hp", e.target.value),
    name: "site_web"
  }), sendError && /*#__PURE__*/React.createElement("p", {
    className: "vsm-error",
    role: "alert"
  }, sendError), /*#__PURE__*/React.createElement("div", {
    className: "vsm-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vsm-btn-back",
    onClick: goBack
  }, "← Retour"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary btn-large",
    onClick: submit
  }, "Envoyer ma demande"))), screen === 3 && /*#__PURE__*/React.createElement("div", {
    className: "vsm-confirm"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "vsm-h1"
  }, "Merci ", f.prenom || "", ", votre demande est bien reçue."), /*#__PURE__*/React.createElement("p", {
    className: "vsm-lead",
    style: {
      margin: "0 auto 8px"
    }
  }, "Nous vous rappellerons par ", f.contact_pref ? f.contact_pref.toLowerCase() : "téléphone", " sous 48 heures. En attendant, choisissez vous-même un créneau qui vous convient."), /*#__PURE__*/React.createElement("p", {
    className: "vsm-confirm-cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary btn-large",
    href: AGENDA_URL,
    target: "_blank",
    rel: "noopener"
  }, "Prendre rendez-vous")), /*#__PURE__*/React.createElement("p", {
    className: "vsm-confirm-later"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Je choisirai mon créneau plus tard, rappelez-moi")))));
}
ReactDOM.createRoot(document.getElementById("app")).render(/*#__PURE__*/React.createElement(App, null));