(() => {
 const menu=document.querySelector('.ano-menu');
 const nav=document.querySelector('.ano-links');
 if(!menu||!nav)return;
 const mobile=matchMedia('(max-width:760px)');
 function sync(){menu.hidden=!mobile.matches;nav.hidden=mobile.matches;menu.setAttribute('aria-expanded',String(!nav.hidden));}
 sync();mobile.addEventListener('change',sync);
 menu.addEventListener('click',()=>{nav.hidden=!nav.hidden;menu.setAttribute('aria-expanded',String(!nav.hidden));});
 nav.addEventListener('click',e=>{if(mobile.matches&&e.target.closest('a')){nav.hidden=true;menu.setAttribute('aria-expanded','false');}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobile.matches&&!nav.hidden){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.focus();}});
})();

// Former all-in-one links still lead to the same content on its focused page.
(() => {
 const destinations={activities:'weekly-specials.html',blindbox:'crystal-blindbox.html','other-activity':'jewelry.html',market:'market.html',about:'about.html',why:'about.html',guide:'shopping-help.html',start:'shopping-help.html',find:'shopping-help.html'};
 function reveal(){
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  if(!id)return;
  const target=document.getElementById(id);
  if(!target&&location.pathname.endsWith('/collection.html')){
   const page=destinations[id]||(id.startsWith('product-flash-')?'weekly-specials.html':/^product-(event|ring)/.test(id)?'jewelry.html':id.startsWith('product-blindbox')?'crystal-blindbox.html':null);
   if(page){location.replace(page+location.search+'#'+encodeURIComponent(id));return;}
  }
  if(!target)return;
  let opened=false;
  for(let n=target;n;n=n.parentElement){if(n.tagName==='DETAILS'&&!n.open){n.open=true;opened=true;}}
  if(opened)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
 }
 reveal();window.addEventListener('hashchange',reveal);
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{if(a.hash===location.hash)reveal();}));
})();
