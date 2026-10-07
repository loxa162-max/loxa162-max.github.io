(() => {
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
