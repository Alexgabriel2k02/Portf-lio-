var scs=[].slice.call(document.querySelectorAll('.sc')),tm=[],bar=document.getElementById('bar');
function say(t){try{speechSynthesis.cancel();if(!document.getElementById('voz').checked)return;var u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';u.rate=1.05;speechSynthesis.speak(u)}catch(e){}}
function show(i){scs.forEach(function(s,k){s.classList.toggle('on',k===i)});say(scs[i].dataset.v)}
function play(){tm.forEach(clearTimeout);tm=[];document.getElementById('start').style.display='none';
 var total=0;scs.forEach(function(s){total+=+s.dataset.t});
 bar.style.transition='none';bar.style.width='0';void bar.offsetWidth;bar.style.transition='width '+total+'s linear';bar.style.width='100%';
 var at=0;scs.forEach(function(s,i){tm.push(setTimeout(function(){show(i)},at*1000));at+=+s.dataset.t});
 tm.push(setTimeout(function(){document.getElementById('start').style.display='flex'},total*1000));}

