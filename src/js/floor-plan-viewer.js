(function () {
  var expandBtn = document.getElementById('floor-plan-expand');
  var dialog    = document.getElementById('fp-dialog');
  var stage     = document.getElementById('fp-stage');
  var img       = document.getElementById('fp-img');
  var zoomIn    = document.getElementById('fp-zoom-in');
  var zoomOut   = document.getElementById('fp-zoom-out');
  var zoomReset = document.getElementById('fp-zoom-reset');
  var zoomLevel = document.getElementById('fp-zoom-level');
  var closeBtn  = document.getElementById('fp-close');

  if (!expandBtn || !dialog || !stage || !img) return;

  var scale      = 1;
  var translateX = 0;
  var translateY = 0;
  var isDragging = false;
  var dragStartX = 0;
  var dragStartY = 0;
  var lastTouchDist = 0;

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function updateTransform() {
    img.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scale + ')';
    zoomLevel.textContent = Math.round(scale * 100) + '%';
    img.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default';
  }

  function zoomTo(factor, pivotX, pivotY) {
    var prevScale = scale;
    scale = clamp(scale * factor, 1, 6);

    if (scale === 1) {
      translateX = 0;
      translateY = 0;
    } else {
      var ratio = scale / prevScale;
      translateX = pivotX * (1 - ratio) + translateX * ratio;
      translateY = pivotY * (1 - ratio) + translateY * ratio;
    }

    updateTransform();
  }

  function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  function openDialog() {
    resetView();
    dialog.showModal();
  }

  function closeDialog() {
    dialog.close();
    resetView();
  }

  expandBtn.addEventListener('click', openDialog);
  closeBtn.addEventListener('click', closeDialog);

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', function (e) {
    if (!dialog.open) return;
    if (e.key === 'Escape') closeDialog();
    if (e.key === '+' || e.key === '=') zoomTo(1.25, 0, 0);
    if (e.key === '-') zoomTo(1 / 1.25, 0, 0);
    if (e.key === '0') resetView();
  });

  zoomIn.addEventListener('click',    function () { zoomTo(1.25, 0, 0); });
  zoomOut.addEventListener('click',   function () { zoomTo(1 / 1.25, 0, 0); });
  zoomReset.addEventListener('click', resetView);

  // Scroll-wheel zoom toward cursor
  stage.addEventListener('wheel', function (e) {
    e.preventDefault();
    var rect   = stage.getBoundingClientRect();
    var pivotX = e.clientX - rect.left - rect.width  / 2;
    var pivotY = e.clientY - rect.top  - rect.height / 2;
    var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    zoomTo(factor, pivotX, pivotY);
  }, { passive: false });

  // Mouse drag to pan
  img.addEventListener('mousedown', function (e) {
    if (scale <= 1) return;
    e.preventDefault();
    isDragging = true;
    dragStartX = e.clientX - translateX;
    dragStartY = e.clientY - translateY;
    updateTransform();
  });

  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    translateX = e.clientX - dragStartX;
    translateY = e.clientY - dragStartY;
    updateTransform();
  });

  window.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    updateTransform();
  });

  // Touch: pinch to zoom
  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      lastTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });

  stage.addEventListener('touchmove', function (e) {
    if (e.touches.length !== 2) return;
    e.preventDefault();

    var dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );

    if (lastTouchDist > 0) {
      var rect   = stage.getBoundingClientRect();
      var midX   = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      var midY   = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      var pivotX = midX - rect.left - rect.width  / 2;
      var pivotY = midY - rect.top  - rect.height / 2;
      zoomTo(dist / lastTouchDist, pivotX, pivotY);
    }

    lastTouchDist = dist;
  }, { passive: false });

  stage.addEventListener('touchend', function () {
    lastTouchDist = 0;
  });
})();
