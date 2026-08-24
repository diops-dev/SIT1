/* Solidaire Inca Tour, météo en direct du bloc « Quand partir ».
   Source : Open-Meteo, sans clé ni cookie. En cas d'échec le bloc
   affiche un repli lisible, jamais une erreur. */
(function () {
  var host = document.querySelector('[data-weather]');
  if (!host) return;

  var SPOTS = [
    { name: 'Lima',             sub: 'Côte pacifique · 150 m',   lat: -12.05, lon: -77.04 },
    { name: 'Ica',              sub: 'Désert et oasis · 406 m',  lat: -14.07, lon: -75.73 },
    { name: 'Arequipa',         sub: 'Ville blanche · 2 335 m',  lat: -16.41, lon: -71.54 },
    { name: 'Cusco',            sub: 'Vallée sacrée · 3 400 m',  lat: -13.53, lon: -71.97 },
    { name: 'Puno',             sub: 'Lac Titicaca · 3 830 m',   lat: -15.84, lon: -70.02 },
    { name: 'Chiclayo',         sub: 'Côte nord · 27 m',         lat:  -6.77, lon: -79.84 },
    { name: 'Puerto Maldonado', sub: 'Amazonie · 183 m',         lat: -12.60, lon: -69.19 }
  ];

  function icon(code) {
    if (code === 0 || code === 1) return 'sun';
    if (code === 2) return 'cloud-sun';
    if (code === 3) return 'cloud';
    if (code >= 45 && code <= 48) return 'cloud-fog';
    if (code >= 71 && code <= 77) return 'snowflake';
    if (code >= 95) return 'cloud-lightning';
    return 'cloud-rain';
  }

  function card(s, d) {
    var head = '<div class="sit-weather-head"><div>' +
      '<div class="sit-weather-city">' + s.name + '</div>' +
      '<div class="sit-weather-sub">' + s.sub + '</div></div>' +
      (d ? '<i data-lucide="' + icon(d.code) + '"></i>' : '') + '</div>';
    var body = d
      ? '<div class="sit-weather-now">' + d.now + '°</div>' +
        '<div class="sit-weather-meta"><span>max ' + d.max + '°</span><span>min ' + d.min + '°</span><span>pluie ' + d.rain + ' %</span></div>'
      : '<div class="sit-weather-fallback">Relevé indisponible pour le moment</div>';
    return '<div class="sit-weather-card">' + head + body + '</div>';
  }

  function paint(rows) {
    host.innerHTML = SPOTS.map(function (s, i) { return card(s, rows ? rows[i] : null); }).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  var url = 'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' + SPOTS.map(function (s) { return s.lat; }).join(',') +
    '&longitude=' + SPOTS.map(function (s) { return s.lon; }).join(',') +
    '&current=temperature_2m,weather_code' +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    '&forecast_days=1&timezone=America%2FLima';

  fetch(url)
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (j) {
      var list = Array.isArray(j) ? j : [j];
      paint(SPOTS.map(function (s, i) {
        var d = list[i];
        if (!d || !d.current) return null;
        return {
          now:  Math.round(d.current.temperature_2m),
          code: d.current.weather_code,
          max:  Math.round(d.daily.temperature_2m_max[0]),
          min:  Math.round(d.daily.temperature_2m_min[0]),
          rain: d.daily.precipitation_probability_max[0]
        };
      }));
    })
    .catch(function () { paint(null); });
})();
