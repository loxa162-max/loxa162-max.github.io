(() => {
  const color = new URLSearchParams(location.search).get('color');
  const allowed = ['blue', 'green', 'pink', 'purple'];
  if (allowed.includes(color)) {
    document.querySelector('[data-color-filter="' + color + '"]')?.click();
  }
})();
