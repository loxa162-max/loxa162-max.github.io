(() => {
 if(!document.body.classList.contains('catalog-browser'))return;
 const grid=document.querySelector('#gallery-items');
 const cards=[...grid.querySelectorAll('.product-card')];
 cards.forEach(card=>{const a=card.querySelector('.product-open');a.setAttribute('aria-label','查看'+a.dataset.name+'照片與規格');const p=document.createElement('p');p.className='catalog-card-price';p.textContent=a.dataset.price||'款式與價格請詢問';card.querySelector('figcaption').append(p);});
 const params=new URLSearchParams(location.search);
 const state={color:params.get('color')||'all',view:params.get('view')==='new'?'new':'all',mineral:'all',query:'',sort:'default',size:12,page:1};
 const colorButtons=[...document.querySelectorAll('[data-color-filter]')];
 if(!colorButtons.some(b=>b.dataset.colorFilter===state.color))state.color='all';
 const pager=document.querySelector('.catalog-pagination'),status=document.querySelector('.color-result'),empty=document.querySelector('.catalog-empty');
 const query=document.querySelector('#catalog-query'),mineral=document.querySelector('#mineral-filter'),sort=document.querySelector('#catalog-sort'),size=document.querySelector('#catalog-page-size');
 function price(card){return Number(card.querySelector('.product-open').dataset.price?.replace(/,/g,'').match(/[\d.]+/)?.[0])||null;}
 function syncURL(){const u=new URL(location.href);if(state.color==='all')u.searchParams.delete('color');else u.searchParams.set('color',state.color);if(state.view==='all')u.searchParams.delete('view');else u.searchParams.set('view',state.view);history.replaceState(null,'',u);}
 function render(scroll=false){
  const matches=cards.filter(c=>{
   const a=c.querySelector('.product-open');
   return (state.view==='all'||a.dataset.product.startsWith('new-'))&&(state.color==='all'||(c.dataset.colors||'').split(' ').includes(state.color))&&(state.mineral==='all'||a.dataset.intro===state.mineral)&&(!state.query||(a.dataset.name+' '+a.dataset.description).toLocaleLowerCase().includes(state.query));
  });
  if(state.sort!=='default')matches.sort((a,b)=>{const pa=price(a),pb=price(b);if(pa===null)return pb===null?0:1;if(pb===null)return -1;return state.sort==='price-asc'?pa-pb:pb-pa;});
  const count=Math.max(1,Math.ceil(matches.length/state.size));state.page=Math.min(state.page,count);
  const shown=matches.slice((state.page-1)*state.size,state.page*state.size);
  cards.forEach(c=>c.hidden=!shown.includes(c));
  // Reorder the existing cards, preserving their product links and dialog listeners.
  [...matches,...cards.filter(c=>!matches.includes(c))].forEach(c=>grid.append(c));
  document.querySelector('#catalog-title').textContent=state.view==='new'?'新品上市':'全部選物';
  status.textContent=matches.length?'共 '+matches.length+' 款 · 第 '+state.page+' / '+count+' 頁':'共 0 款';
  empty.hidden=matches.length>0;
  colorButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.colorFilter===state.color)));
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===state.view)));
  pager.replaceChildren();
  function pageButton(label,page,disabled=false,current=false){const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;if(current)b.setAttribute('aria-current','page');b.addEventListener('click',()=>{state.page=page;render(true);});pager.append(b);}
  if(count>1){pageButton('上一頁',state.page-1,state.page===1);for(let i=1;i<=count;i++)pageButton(String(i),i,false,i===state.page);pageButton('下一頁',state.page+1,state.page===count);}
  syncURL();
  if(scroll)document.querySelector('.catalog-toolbar').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 }
 colorButtons.forEach(b=>b.addEventListener('click',()=>{state.color=b.dataset.colorFilter;state.page=1;render();}));
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;state.page=1;render();}));
 mineral.addEventListener('change',()=>{state.mineral=mineral.value;state.page=1;render();});
 sort.addEventListener('change',()=>{state.sort=sort.value;state.page=1;render();});
 size.addEventListener('change',()=>{state.size=Number(size.value);state.page=1;render();});
 function search(){state.query=query.value.trim().toLocaleLowerCase();state.page=1;render();}
 document.querySelector('.catalog-search').addEventListener('submit',e=>{e.preventDefault();search();});
 query.addEventListener('input',search);
 window.anoCatalog={reveal(id){const card=cards.find(c=>c.id===id);if(!card)return;state.color='all';state.view='all';state.mineral='all';state.query='';state.sort='default';mineral.value='all';query.value='';sort.value='default';state.page=Math.floor(cards.indexOf(card)/state.size)+1;render();}};
 const filters=document.querySelector('.catalog-filters'),mobile=matchMedia('(max-width:760px)');
 function filterMode(){filters.open=!mobile.matches;}filterMode();mobile.addEventListener('change',filterMode);
 render();
})();
