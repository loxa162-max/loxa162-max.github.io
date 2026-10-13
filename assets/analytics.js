(() => {
  'use strict';
  const id = document.currentScript?.dataset.measurementId || '';
  if (!/^G-[A-Z0-9]{6,}$/.test(id) || location.hostname !== 'loxa162-max.github.io') return;
  const privacySignal = navigator.globalPrivacyControl || navigator.doNotTrack === '1';
  const key = 'arno-analytics-consent-v1';
  let enabled = false;
  let started = false;
  const panel = document.createElement('aside');
  panel.setAttribute('aria-label', '網站統計選擇');
  panel.id = 'analytics-choice';
  panel.innerHTML = '<p style="margin:0 0 8px;line-height:1.6">我們使用 Google Analytics 與 Cookie，了解瀏覽來源、商品查看及選購按鈕點擊，協助改善網站。你可以拒絕，仍能正常選購。<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google 隱私權說明</a></p><div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" data-choice="yes">同意統計</button><button type="button" data-choice="no">不要統計</button></div>';
  panel.style.cssText = 'position:fixed;bottom:14px;left:14px;right:14px;margin:auto;max-width:560px;box-sizing:border-box;background:#fff;color:#273f49;padding:16px;border:1px solid #b8cbd0;border-radius:12px;box-shadow:0 4px 24px #0002;font-size:14px;z-index:1200';
  panel.querySelectorAll('button').forEach(button => { button.style.cssText = 'padding:8px 14px;border:1px solid #648590;border-radius:8px;background:#f3f8f9;color:#273f49;font:inherit;cursor:pointer'; });
  document.body.appendChild(panel);
  const settings = document.createElement('button');
  settings.type = 'button';
  settings.textContent = '網站統計設定';
  settings.style.cssText = 'display:block;margin:16px auto;padding:8px 12px;border:1px solid #b8cbd0;border-radius:8px;background:#fff;color:#273f49;font:inherit;cursor:pointer';
  (document.querySelector('footer') || document.body).appendChild(settings);
  settings.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button').focus(); });
  panel.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    enabled = button.dataset.choice === 'yes' && !privacySignal;
    try { localStorage.setItem(key, enabled ? 'yes' : 'no'); } catch {}
    window['ga-disable-' + id] = !enabled;
    if (enabled) start();
    else {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name === '_ga' || name.startsWith('_ga_')) {
          ['', ';domain=' + location.hostname, ';domain=.github.io'].forEach(domain => {
            document.cookie = name + '=;max-age=0;path=/' + domain + ';SameSite=Lax';
          });
        }
      });
    }
    panel.hidden = true;
    settings.textContent = enabled ? '網站統計設定：已同意' : '網站統計設定：未啟用';
  }));
  const page = new URL(location.href);
  const cleanPage = new URL(page.pathname, page.origin);
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
    const value = page.searchParams.get(key);
    if (value && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) cleanPage.searchParams.set(key, value);
  });
  let referrer = '';
  try { referrer = new URL(document.referrer).origin + '/'; } catch {}
  function start() {
  if (started) return;
  started = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, {
    page_location: cleanPage.href,
    page_referrer: referrer,
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(tag);
  track('page_view', { page_title: document.title, page_referrer: referrer });
  }
  function track(name, data) {
    if (!enabled) return;
    window.gtag('event', name, { ...data, page_location: cleanPage.href, transport_type: 'beacon' });
  }
  document.addEventListener('click', event => {
    if (!enabled || !event.isTrusted) return;
    const link = event.target.closest?.('a');
    if (!link) return;
    const card = link.closest('.product-card');
    const product = card?.querySelector('.product-open');
    const inDialog = !!link.closest('#product-dialog');
    const productName = inDialog
      ? document.querySelector('#product-dialog-title')?.textContent.trim()
      : product?.dataset.name;
    const data = {
      section: link.closest('section[id]')?.id || (inDialog ? 'product-dialog' : 'navigation'),
      ...(productName ? { product_name: productName.slice(0, 100) } : {}),
      ...(product?.dataset.product ? { product_id: product.dataset.product } : {})
    };
    if (link.matches('.product-open') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
      track('product_view', data);
      return;
    }
    let url;
    try { url = new URL(link.href); } catch { return; }
    if (url.hostname === 'myship.7-11.com.tw') track('shop_click', data);
    else if (['line.me', 'lin.ee'].includes(url.hostname)) track('line_click', data);
    else if (['www.instagram.com', 'instagram.com'].includes(url.hostname)) track('instagram_click', data);
  });
  let saved;
  try { saved = localStorage.getItem(key); } catch {}
  enabled = saved === 'yes' && !privacySignal;
  panel.hidden = saved === 'yes' || saved === 'no' || privacySignal;
  window['ga-disable-' + id] = !enabled;
  settings.textContent = enabled ? '網站統計設定：已同意' : '網站統計設定：未啟用';
  if (enabled) start();
})();
