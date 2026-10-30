(() => {
 const item=document.querySelector('.shop-nav-item');if(!item)return;
 const toggle=item.querySelector('.shop-nav-toggle'),panel=item.querySelector('.shop-nav-panel');
 toggle.hidden=false;
 function set(open){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',(open?'收合':'展開')+(item.dataset.menuLabel||'全部選物')+'分類');}
 toggle.addEventListener('click',()=>set(panel.hidden));
 document.addEventListener('click',e=>{if(!item.contains(e.target))set(false);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){set(false);toggle.focus();}});
 item.addEventListener('focusout',e=>{if(!item.contains(e.relatedTarget))set(false);});
 panel.addEventListener('click',e=>{if(e.target.closest('a'))set(false);});
})();
