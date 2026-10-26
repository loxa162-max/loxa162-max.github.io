(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  const small = window.matchMedia('(max-width:760px)');
  function syncMenu() {
    menu.hidden = !small.matches;
    nav.hidden = small.matches;
    menu.setAttribute('aria-expanded', String(!nav.hidden));
  }
  syncMenu();
  small.addEventListener('change', syncMenu);
  menu.addEventListener('click', () => {
    nav.hidden = !nav.hidden;
    menu.setAttribute('aria-expanded', String(!nav.hidden));
  });
  nav.addEventListener('click', event => {
    if (small.matches && event.target.closest('a')) {
      nav.hidden = true;
      menu.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && small.matches && !nav.hidden) {
      nav.hidden = true;
      menu.setAttribute('aria-expanded', 'false');
      menu.focus();
    }
  });
  document.querySelectorAll('[data-color]').forEach(link => {
    link.href = 'collection.html?color=' + encodeURIComponent(link.dataset.color) + '#gallery';
  });
  // Existing links from the mineral library and shared product URLs remain valid.
  function legacyAnchor() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (id && !document.getElementById(id)) location.replace('collection.html' + location.hash);
  }
  legacyAnchor();
  window.addEventListener('hashchange', legacyAnchor);
})();
