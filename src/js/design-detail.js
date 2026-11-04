(function () {
  var slides = typeof DESIGN_SLIDES !== 'undefined' ? DESIGN_SLIDES : [];
  var total = slides.length;
  if (!total) return;

  var track     = document.getElementById('carousel-track');
  var btnPrev   = document.getElementById('carousel-prev');
  var btnNext   = document.getElementById('carousel-next');
  var currentEl = document.getElementById('carousel-current');
  var els       = Array.from(track.querySelectorAll('.carousel-slide'));

  var current = 0;

  function goTo(index) {
    els[current].classList.remove('is-active');
    current = (index + total) % total;
    els[current].classList.add('is-active');
    currentEl.textContent = current + 1;
  }

  btnPrev.addEventListener('click', function () { goTo(current - 1); });
  btnNext.addEventListener('click', function () { goTo(current + 1); });

  document.addEventListener('keydown', function (e) {
    if (lightbox.open) return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Click carousel to open lightbox
  track.addEventListener('click', function () { openLightbox(current); });

  // Lightbox
  var lightbox  = document.getElementById('lightbox');
  var lbImg     = document.getElementById('lightbox-img');
  var lbCounter = document.getElementById('lightbox-counter');
  var lbClose   = document.getElementById('lightbox-close');
  var lbPrev    = document.getElementById('lightbox-prev');
  var lbNext    = document.getElementById('lightbox-next');
  var lbCurrent = 0;

  function openLightbox(index) {
    lbCurrent = index;
    showLightboxSlide(lbCurrent);
    lightbox.showModal();
  }

  function showLightboxSlide(index) {
    lbCurrent = (index + total) % total;
    var s = slides[lbCurrent];
    lbImg.src = s.src || s.fallback;
    lbImg.alt = s.label || '';
    lbCounter.textContent = (lbCurrent + 1) + ' / ' + total;
  }

  function closeLightbox() {
    lightbox.close();
    lbImg.src = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  function () { showLightboxSlide(lbCurrent - 1); });
  lbNext.addEventListener('click',  function () { showLightboxSlide(lbCurrent + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.open) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showLightboxSlide(lbCurrent - 1);
    if (e.key === 'ArrowRight')  showLightboxSlide(lbCurrent + 1);
  });
})();
