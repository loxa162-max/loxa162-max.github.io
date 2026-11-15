(() => {
 const button=document.querySelector('#copy-link');
 const status=document.querySelector('#copy-status');
 if(button){
  button.hidden=false;
  button.addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText('https://loxa162-max.github.io/links/');status.textContent='網址已複製，可以貼到社群自介了。';}
   catch{status.textContent='請長按下方網址複製：loxa162-max.github.io/links/';}
  });
 }
 const note=document.querySelector('#market-note');
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 if(note&&today>'2026-11-22'){
  note.querySelector('.market-label').lastChild.textContent='市集資訊';
  note.querySelector('strong').textContent='下一次出攤，這裡見';
  note.querySelector('p').textContent='最新出攤日期、地點與時間，請查看官網公告。';
 }
})();