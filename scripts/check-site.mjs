import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const base = process.env.SITE_BASE || 'http://127.0.0.1:8080/';
const visibleCards = () => page.locator('.product-card:visible');
try {
 await page.goto(base + 'collection.html');
 await page.waitForFunction(() => window.anoCatalog);
 assert.equal(await visibleCards().count(), 12);
 await page.getByRole('link', { name: '下一頁', exact: true }).click();
 await page.waitForURL('**/collection-page-2.html#gallery');
 assert.equal(await visibleCards().count(), 12);
 assert.equal(await page.locator('.catalog-pagination [aria-current="page"]').innerText(), '2');
 await page.goBack();
 await page.waitForURL('**/collection.html');
 assert.equal(await page.locator('.catalog-pagination [aria-current="page"]').innerText(), '1');
 await page.locator('[data-color-filter="blue"]').click();
 assert.match(page.url(), /color=blue/);
 assert.ok(await visibleCards().count() > 0);
 assert.equal(await visibleCards().evaluateAll(cards => cards.every(card => card.dataset.colors.split(' ').includes('blue'))), true);
 await page.locator('#catalog-query').fill('zzzz-no-such-crystal');
 await page.waitForFunction(() => document.querySelector('.catalog-empty').hidden === false);
 assert.equal(await visibleCards().count(), 0);
 await page.getByRole('button', { name: '清除篩選，查看全部' }).click();
 assert.equal(await visibleCards().count(), 12);
 assert.equal(await page.locator('#catalog-query').inputValue(), '');
 await page.locator('#catalog-sort').selectOption('price-asc');
 await page.locator('#catalog-page-size').selectOption('24');
 await page.reload();
 await page.waitForFunction(() => window.anoCatalog);
 assert.equal(await page.locator('#catalog-sort').inputValue(), 'price-asc');
 assert.equal(await page.locator('#catalog-page-size').inputValue(), '24');
 assert.equal(await visibleCards().count(), 24);
 await page.goto(base + 'collection-page-4.html');
 await page.waitForFunction(() => window.anoCatalog);
 assert.equal(await visibleCards().count(), 2);
 assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), base + 'collection-page-4.html');
 await page.goto(base + 'collection.html#product-8');
 await page.waitForFunction(() => window.anoCatalog);
 await page.locator('#product-8 .product-open').click();
 await page.locator('#product-dialog').waitFor({ state: 'visible' });
 assert.match(await page.locator('#product-dialog-title').innerText(), /海藍寶/);
 await page.getByRole('button', { name: '關閉商品資訊' }).click();
 await fs.mkdir('site-screenshots', { recursive: true });
 for (const width of [320, 390, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const path of ['', 'collection.html', 'collection-page-4.html', 'crystal-aquamarine.html']) {
   await page.goto(base + path);
   if (path.startsWith('collection')) await page.waitForFunction(() => window.anoCatalog);
   const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
   assert.ok(dimensions.content <= dimensions.viewport, path + ' overflows at ' + width + ': ' + JSON.stringify(dimensions));
   if (width === 390 && path === 'collection.html') {
    assert.ok(await page.locator('#catalog-query').evaluate(el => parseFloat(getComputedStyle(el).fontSize)) >= 16);
   }
   if ((width === 390 || width === 1440) && (!path || path === 'collection.html')) {
    await page.screenshot({ path: 'site-screenshots/' + (path ? 'collection' : 'home') + '-' + width + '.png', fullPage: false });
   }
  }
 }
 const noJS = await browser.newContext({ javaScriptEnabled: false });
 const raw = await noJS.newPage();
 for (let n = 1; n <= 4; n++) {
  const path = n === 1 ? 'collection.html' : 'collection-page-' + n + '.html';
  await raw.goto(base + path);
  assert.equal(await raw.locator('.product-card:visible').count(), n === 4 ? 2 : 12);
  assert.ok(await raw.locator('.catalog-pagination a[href]').count() >= 4);
 }
 await noJS.close();
 if(process.env.SITE_BASE){
  await page.setViewportSize({width:390,height:844});
  for(const [label,path] of [['home',''],['collection','collection.html']]){
   await page.goto(base+path);await page.evaluate(()=>document.fonts.ready);await page.locator('img').first().waitFor({state:'visible'});
   console.log('VISUAL_'+label+':'+(await page.screenshot({type:'jpeg',quality:60})).toString('base64'));
  }
 }

 assert.deepEqual(errors, []);
 console.log('PASS: pagination, back, filtering, empty/reset, reload, product dialog, 320/390/768/1440 widths, no-JS pagination.');
} finally { await browser.close(); }
