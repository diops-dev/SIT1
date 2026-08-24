/* Solidaire Inca Tour, galerie photo des fiches circuit. */
(function () {
  document.querySelectorAll('[data-gallery]').forEach(function (gal) {
    var frame  = gal.querySelector('.sit-gallery-frame');
    var cap    = gal.querySelector('.sit-gallery-caption');
    var count  = gal.querySelector('.sit-gallery-count');
    var thumbs = Array.prototype.slice.call(gal.querySelectorAll('.sit-gallery-thumb'));
    var photos = JSON.parse(gal.getAttribute('data-gallery'));
    var i = 0;

    function render() {
      frame.style.backgroundImage = "url('" + photos[i].src + "')";
      frame.setAttribute('role', 'img');
      frame.setAttribute('aria-label', photos[i].caption || 'Photo ' + (i + 1));
      if (cap) { cap.textContent = photos[i].caption || ''; cap.hidden = !photos[i].caption; }
      if (count) count.textContent = (i + 1) + ' / ' + photos.length;
      thumbs.forEach(function (t, n) {
        t.classList.toggle('sit-gallery-thumb-active', n === i);
        t.setAttribute('aria-current', n === i ? 'true' : 'false');
      });
    }
    function go(d) { i = (i + d + photos.length) % photos.length; render(); }

    var prev = gal.querySelector('.sit-gallery-prev');
    var next = gal.querySelector('.sit-gallery-next');
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    thumbs.forEach(function (t, n) { t.addEventListener('click', function () { i = n; render(); }); });
    gal.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });
    render();
  });
})();
