(() => {
  const gallery = document.querySelector('#gallery');
  const picker = gallery?.querySelector('.color-picker');
  if (picker) {
    picker.hidden = false;
    const cards = [...gallery.querySelectorAll('.product-card')];
    const groups = [...gallery.querySelectorAll('.more-products')];
    let savedOpen;
    picker.querySelectorAll('[data-color-filter]').forEach(button => button.addEventListener('click', () => {
      const color = button.dataset.colorFilter;
      if (color !== 'all' && !savedOpen) savedOpen = groups.map(group => group.open);
      picker.querySelectorAll('[data-color-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      cards.forEach(card => { card.hidden = color !== 'all' && !card.dataset.colors.split(' ').includes(color); });
      groups.forEach((group, i) => {
        group.hidden = ![...group.querySelectorAll('.product-card')].some(card => !card.hidden);
        if (color !== 'all') group.open = !group.hidden;
        else if (savedOpen) group.open = savedOpen[i];
      });
      if (color === 'all') savedOpen = undefined;
      gallery.querySelectorAll('.grid').forEach(grid => { grid.hidden = ![...grid.querySelectorAll('.product-card')].some(card => !card.hidden); });
      const count = cards.filter(card => !card.hidden).length;
      picker.querySelector('.color-result').textContent = color === 'all' ? '共 ' + count + ' 款選物，點照片看細節。' : button.textContent.trim() + ' · ' + count + ' 款選物；現貨與規格以賣場為準。';
    }));
    picker.querySelector('.color-result').textContent = '共 ' + cards.length + ' 款選物，點照片看細節。';
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
