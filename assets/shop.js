(() => {
  const gallery = document.querySelector('#gallery');
  const picker = gallery?.querySelector('.color-picker');
  if (picker) {
    picker.hidden = false;
    const cards = [...gallery.querySelectorAll('.product-card')];
    const more = document.querySelector('#gallery-more');
    let selected = 'all';
    let expanded = false;
    function render() {
      const matches = cards.filter(card => selected === 'all' || card.dataset.colors.split(' ').includes(selected));
      const limit = selected === 'all' && !expanded ? 6 : matches.length;
      cards.forEach(card => { card.hidden = !matches.includes(card) || matches.indexOf(card) >= limit; });
      more.hidden = selected !== 'all' || matches.length <= 6;
      more.textContent = expanded ? '收合更多款式' : '顯示更多款式（還有 ' + (matches.length - 6) + ' 款）';
      more.setAttribute('aria-expanded', String(expanded));
      const label = picker.querySelector('[data-color-filter="' + selected + '"]').textContent.trim();
      picker.querySelector('.color-result').textContent = selected === 'all'
        ? '共 ' + matches.length + ' 款選物，目前顯示 ' + Math.min(limit, matches.length) + ' 款。'
        : label + ' · ' + matches.length + ' 款選物；現貨與規格以賣場為準。';
    }
    picker.querySelectorAll('[data-color-filter]').forEach(button => button.addEventListener('click', () => {
      selected = button.dataset.colorFilter;
      picker.querySelectorAll('[data-color-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      render();
    }));
    more.addEventListener('click', () => {
      expanded = !expanded;
      render();
      if (!expanded) picker.scrollIntoView({block:'start', behavior:'smooth'});
    });
    render();
  }

  const topLink = document.querySelector('.back-to-top');
  if (topLink) {
    const updateTopLink = () => { topLink.hidden = window.scrollY < 300; };
    window.addEventListener('scroll', updateTopLink, { passive: true });
    updateTopLink();
  }
  function revealHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const topic = target.matches('section[data-topic]') ? target.querySelector('.topic-fold') : target.closest('.topic-fold');
    if (topic) topic.open = true;
    for (let node = target; node; node = node.parentElement) {
      if (node.tagName === 'DETAILS') node.open = true;
    }
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
  }
  window.addEventListener('hashchange', revealHash);
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    if (link.hash === location.hash) revealHash();
  }));
  revealHash();
  const dialog = document.querySelector('#product-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  let opener;
  document.querySelectorAll('.product-open').forEach(link => {
    link.addEventListener('click', event => {
      // Keep ordinary new-tab and modified-click behavior available.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button) return;
      event.preventDefault();
      opener = link;
      const img = document.querySelector('#product-dialog-image');
      img.src = link.dataset.image;
      img.alt = link.dataset.description;
      document.querySelector('#product-dialog-title').textContent = link.dataset.name;
      document.querySelector('#product-dialog-style').textContent = link.dataset.style;
      document.querySelector('#product-dialog-description').textContent = link.dataset.description;
      document.querySelector('#product-dialog-shop').href = link.href;
      document.querySelector('#product-dialog-shop').textContent = '到賣貨便選購';
      dialog.showModal();
      document.body.classList.add('dialog-open');
      dialog.querySelector('.dialog-close').focus();
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    opener?.focus({ preventScroll: true });
  });
})();

// Category color entries reuse the gallery filter and its product count.
document.querySelectorAll('[data-browse-color]').forEach(link => link.addEventListener('click', () => {
 const gallery=document.querySelector('#gallery');
 gallery.querySelector('.topic-fold').open=true;
 gallery.querySelector('[data-color-filter="'+link.dataset.browseColor+'"]').click();
}));
