(() => {
 const url='https://loxa162-max.github.io/links/';
 const button=document.querySelector('#copy-link');
 const status=document.querySelector('#copy-status');
 if(button){
  button.hidden=false;
  button.addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText(url);status.textContent='網址已複製，可以貼到社群自介了。';}
   catch{status.textContent='請長按複製：loxa162-max.github.io/links/';}
  });
 }
 const note=document.querySelector('#market-note');
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const part=type=>parts.find(p=>p.type===type).value;
 const today=part('year')+'-'+part('month')+'-'+part('day');
 if(note&&today>'2026-11-22'){
  note.querySelector('.label').textContent='市集資訊・高雄';
  note.querySelector('strong').textContent='下一次出攤';
  note.querySelector('.market-details').textContent='最新日期、地點與時間，請看官網公告。';
 }
})();
