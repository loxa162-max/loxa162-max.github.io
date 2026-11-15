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

 await page.goto(base + 'links/');
 await page.waitForFunction(() => !document.querySelector('#copy-link').hidden);
 assert.equal(await page.locator('h1').innerText(), '阿諾ʚ ɞ水晶');
 for(const href of ['https://myship.7-11.com.tw/general/detail/GM2401270490131','https://line.me/R/ti/p/@541nqkeb','https://www.instagram.com/loxa162/','https://www.threads.net/@loxa162','https://www.dcard.tw/@loxa1022','https://www.facebook.com/zhen0304/','../market.html#market','../','../about.html']){
  assert.ok(await page.locator('main a[href="'+href+'"]').count()>=1,'Required destination: '+href);
 }
 assert.equal(await page.locator('a[href="#"]').count(), 0);
 for (const width of [320,390,768,1440]) {
  await page.setViewportSize({width,height:900});
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Link hub overflow at '+width);
  assert.ok(await page.locator('.banner').first().evaluate(el => el.getBoundingClientRect().height >= 44));
  if(width===390 || width===1440){await page.screenshot({path:'site-screenshots/links-'+width+'.png',fullPage:true});console.log('HUB_VISUAL_'+width+':'+(await page.screenshot({type:'jpeg',quality:55,fullPage:true})).toString('base64'));}
 }
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.evaluate(()=>Object.defineProperty(navigator,'share',{value:undefined,configurable:true}));
 await page.locator('#copy-link').click();
 await page.waitForFunction(() => document.querySelector('#copy-status').textContent.length > 0);

 // 首頁商品先於指南，進階文章按需求展開；保留所有原文章入口。
 await page.goto(base);
 assert.equal(await page.locator('#featured').evaluate(el=>el.compareDocumentPosition(document.querySelector('#beginner-guide')) & Node.DOCUMENT_POSITION_FOLLOWING),4);
 assert.equal(await page.locator('#beginner-guide > .beginner-grid .beginner-card:visible').count(),3);
 assert.equal(await page.locator('.beginner-more .beginner-card:visible').count(),0);
 await page.locator('.beginner-more > summary').click();
 assert.equal(await page.locator('.beginner-more .beginner-card:visible').count(),3);
 for(const width of [320,390,768,820,1440]){
  await page.setViewportSize({width,height:900});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Expanded guides overflow at '+width);
 }
 for(const [label,path] of [['home',''],['links','links/']]){
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900});await page.goto(base+path);await page.evaluate(()=>document.fonts.ready);
   console.log('LAYOUT_'+label+'_'+width+':'+(await page.screenshot({type:'jpeg',quality:55,fullPage:label==='links'})).toString('base64'));
  }
 }
 await page.goto(base);
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});await page.evaluate(()=>document.fonts.ready);
  for(const selector of ['#featured','#beginner-guide']){
   await page.locator(selector).scrollIntoViewIfNeeded();
   console.log('SECTION_'+selector.slice(1)+'_'+width+':'+(await page.locator(selector).screenshot({type:'jpeg',quality:55})).toString('base64'));
  }
 }
 // 市集到期後顯示一般入口，不保留舊日期。
 await page.clock.install({time:new Date('2026-11-23T00:00:00+08:00')});
 await page.goto(base+'links/');
 assert.equal(await page.locator('#market-note strong').innerText(),'下一次出攤');
 assert.doesNotMatch(await page.locator('#market-note').innerText(),/11\.21|11:00/);
 await page.clock.setFixedTime(new Date('2026-11-22T23:59:00+08:00'));
 await page.reload();
 assert.equal(await page.locator('#market-note strong').innerText(),'11.21 — 11.22');

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
