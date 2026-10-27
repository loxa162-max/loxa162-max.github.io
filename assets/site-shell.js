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
