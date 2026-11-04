(function () {
  var btn    = document.getElementById('model-btn');
  var dialog = document.getElementById('model-dialog');
  var viewer = document.getElementById('model-viewer');
  var close  = document.getElementById('model-dialog-close');

  if (!btn || !dialog || !viewer) return;

  btn.addEventListener('click', function () {
    viewer.setAttribute('src', btn.dataset.src);
    dialog.showModal();
  });

  function closeDialog() {
    dialog.close();
    viewer.removeAttribute('src'); // stop rendering / release memory
  }

  close.addEventListener('click', closeDialog);

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && dialog.open) closeDialog();
  });
})();
