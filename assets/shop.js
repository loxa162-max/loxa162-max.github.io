(() => {
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
      document.querySelector('#product-dialog-shop').textContent = link.href.includes('instagram.com') ? '到 Instagram 問這款' : '到賣貨便看款式';
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
