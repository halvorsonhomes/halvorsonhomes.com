(function () {
  const grid = document.getElementById('design-grid');
  const cards = Array.from(grid.querySelectorAll('.design-card'));
  const sortSelect = document.getElementById('sort-select');
  const filterBtn = document.getElementById('filter-btn');
  const filterPopover = document.getElementById('filter-popover');
  const filterBadge = document.getElementById('filter-badge');
  const filterClear = document.getElementById('filter-clear');
  const countEl = document.getElementById('designs-count');
  const emptyEl = document.getElementById('designs-empty');
  const livingMin = document.getElementById('living-min');
  const livingMax = document.getElementById('living-max');

  function getFilters() {
    return {
      garage: Array.from(document.querySelectorAll('input[name="garage"]:checked')).map(el => +el.value),
      livingMin: livingMin.value ? +livingMin.value : null,
      livingMax: livingMax.value ? +livingMax.value : null,
    };
  }

  function activeCount(f) {
    return f.garage.length + (f.livingMin !== null ? 1 : 0) + (f.livingMax !== null ? 1 : 0);
  }

  function apply() {
    const f = getFilters();
    const n = activeCount(f);

    const visible = cards.filter(card => {
      const garage = +card.dataset.garage;
      const living = +card.dataset.living;
      if (f.garage.length && !f.garage.includes(garage)) return false;
      if (f.livingMin !== null && living < f.livingMin) return false;
      if (f.livingMax !== null && living > f.livingMax) return false;
      return true;
    });

    const sort = sortSelect.value;
    visible.sort((a, b) => {
      switch (sort) {
        case 'name-asc':    return a.dataset.name.localeCompare(b.dataset.name);
        case 'name-desc':   return b.dataset.name.localeCompare(a.dataset.name);
        case 'living-asc':  return +a.dataset.living - +b.dataset.living;
        case 'living-desc': return +b.dataset.living - +a.dataset.living;
        case 'total-asc':   return +a.dataset.total - +b.dataset.total;
        case 'total-desc':  return +b.dataset.total - +a.dataset.total;
      }
    });

    cards.forEach(c => { c.hidden = true; c.style.order = ''; });
    visible.forEach((c, i) => { c.hidden = false; c.style.order = i; });

    filterBadge.textContent = n || '';
    filterBadge.hidden = n === 0;
    countEl.textContent = visible.length < cards.length
      ? `Showing ${visible.length} of ${cards.length} designs`
      : '';
    emptyEl.hidden = visible.length > 0;
    grid.hidden = visible.length === 0;
  }

  filterBtn.addEventListener('click', e => {
    e.stopPropagation();
    const opening = filterPopover.hidden;
    filterPopover.hidden = !opening;
    filterBtn.setAttribute('aria-expanded', String(opening));
  });

  document.addEventListener('click', e => {
    if (!filterPopover.contains(e.target) && e.target !== filterBtn) {
      filterPopover.hidden = true;
      filterBtn.setAttribute('aria-expanded', 'false');
    }
  });

  filterClear.addEventListener('click', () => {
    document.querySelectorAll('input[name="garage"]').forEach(el => el.checked = false);
    livingMin.value = '';
    livingMax.value = '';
    apply();
  });

  sortSelect.addEventListener('change', apply);
  document.querySelectorAll('input[name="garage"]').forEach(el => el.addEventListener('change', apply));
  livingMin.addEventListener('input', apply);
  livingMax.addEventListener('input', apply);

  apply();
})();
