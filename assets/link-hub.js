(() => {
 const url='https://loxa162-max.github.io/links/';
 const button=document.querySelector('#copy-link');
 const status=document.querySelector('#copy-status');
 if(button){
  button.hidden=false;
  button.addEventListener('click',async()=>{
   if(navigator.share){
    try{await navigator.share({title:document.title,url});return;}catch(e){if(e&&e.name==='AbortError')return;}
   }
   try{await navigator.clipboard.writeText(url);status.textContent='網址已複製，可以貼到社群自介了。';}
   catch{status.textContent='請長按複製：loxa162-max.github.io/links/';}
  });
 }
 const note=document.querySelector('#market-note');
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 if(note&&today>'2026-11-22'){
  note.querySelector('.label').textContent='擺攤時間・高雄';
  note.querySelector('strong').textContent='下一次出攤';
  note.querySelector('small').textContent='最新日期、地點與時間，請看官網公告。';
 }
})();
