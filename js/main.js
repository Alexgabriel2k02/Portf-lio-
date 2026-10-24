const reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Status da interface */
const dataAtualizacao=document.getElementById('data-atualizacao');
if(dataAtualizacao){
  const atualizarData=()=>dataAtualizacao.textContent=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(new Date()).toUpperCase();
  atualizarData();
}

/* Recursos interativos do laboratório */
const tema=document.querySelector('.theme-toggle');
tema?.addEventListener('click',()=>{
  const claro=document.documentElement.getAttribute('data-theme')==='light';
  document.documentElement.setAttribute('data-theme',claro?'dark':'light');
  tema.textContent=claro?'◐':'☼';
  tema.setAttribute('aria-label',claro?'Ativar modo claro':'Ativar modo escuro');
});

const terminalForm=document.getElementById('terminal-form');
const terminalInput=document.getElementById('terminal-input');
const terminalOutput=document.getElementById('terminal-output');
const comandos={
  help:'comandos: about · skills · scan · contact · clear',
  about:'Alex Gabriel Alves dos Santos — analista e desenvolvedor em transição para cibersegurança.',
  skills:'foco: phishing, engenharia social, análise de sistemas e conscientização digital.',
  scan:'[OK] identidade verificada  [OK] superfície protegida  [OK] nenhum risco encontrado',
  contact:'canal disponível: alex@email.com',
};
terminalForm?.addEventListener('submit',event=>{
  event.preventDefault();
  const comando=terminalInput.value.trim().toLowerCase();
  if(!comando)return;
  if(comando==='clear'){terminalOutput.innerHTML='';terminalInput.value='';return}
  const resposta=comandos[comando]||'comando não reconhecido. digite help para ver as opções.';
  terminalOutput.insertAdjacentHTML('beforeend',`<p><b>alex@sec:~$</b> ${comando}</p><p class="terminal-response">${resposta}</p>`);
  terminalOutput.scrollTop=terminalOutput.scrollHeight;
  terminalInput.value='';
});

const descricoes={
  ciber:'Núcleo central: proteção digital, análise de riscos e comportamento seguro.',
  phishing:'Reconhecimento de iscas, remetentes suspeitos e links maliciosos.',
  systems:'Visão estruturada para entender pessoas, processos e tecnologia.',
  dev:'Experiência construindo soluções e pensando em segurança desde a origem.',
  awareness:'Comunicação simples para transformar conhecimento em hábito.',
};
document.querySelectorAll('.skill-node').forEach(node=>node.addEventListener('click',()=>{
  document.querySelectorAll('.skill-node').forEach(item=>item.classList.remove('active'));
  node.classList.add('active');
  const descricao=document.getElementById('skill-description');
  if(descricao)descricao.textContent=descricoes[node.dataset.skill];
}));

document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
  const resultado=document.getElementById('simulation-result');
  const seguro=button.dataset.answer==='safe';
  resultado.textContent=seguro?'✓ Boa decisão: confirme sempre pelo aplicativo ou canal oficial.':'! Risco detectado: links com urgência e domínio estranho são sinais de phishing.';
  resultado.style.color=seguro?'#7dffb2':'#ff8f9b';
}));
const relogio=document.getElementById('dashboard-clock');
if(relogio){const atualizarRelogio=()=>relogio.textContent=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});atualizarRelogio();setInterval(atualizarRelogio,60000)}

const quizData=[
  {question:'Qual é a atitude mais segura ao receber uma mensagem urgente do banco?',answers:['Abrir o aplicativo oficial e conferir','Clicar no link para evitar o bloqueio','Responder enviando meus dados'],correct:0},
  {question:'Qual sinal costuma indicar uma tentativa de phishing?',answers:['Mensagem personalizada e esperada','Domínio oficial conferido','Pressão, ameaça e link estranho'],correct:2},
  {question:'O que fazer antes de compartilhar um código recebido por SMS?',answers:['Nunca compartilhar sem confirmar a origem','Enviar se a mensagem parecer profissional','Publicar para pedir ajuda'],correct:0},
];
let quizIndex=0,quizScore=0;
const quizQuestion=document.getElementById('quiz-question'),quizOptions=document.getElementById('quiz-options'),quizStep=document.getElementById('quiz-step'),quizFeedback=document.getElementById('quiz-feedback'),scoreOutput=document.getElementById('quiz-score'),progressBar=document.getElementById('quiz-progress');
function renderQuiz(){
  if(!quizQuestion)return;
  const item=quizData[quizIndex];
  quizQuestion.textContent=item.question;quizStep.textContent=`PERGUNTA ${String(quizIndex+1).padStart(2,'0')} / ${quizData.length}`;quizFeedback.textContent='';
  quizOptions.innerHTML=item.answers.map((answer,index)=>`<button type="button" data-index="${index}">${answer}</button>`).join('');
  progressBar.style.width=`${quizIndex/quizData.length*100}%`;
  quizOptions.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
    const chosen=Number(button.dataset.index),correct=chosen===item.correct;
    quizOptions.querySelectorAll('button').forEach((option,index)=>{option.disabled=true;if(index===item.correct)option.classList.add('correct');if(index===chosen&&!correct)option.classList.add('wrong')});
    if(correct){quizScore++;scoreOutput.textContent=quizScore;quizFeedback.textContent='✓ Resposta segura. Boa leitura de risco.'}else quizFeedback.textContent='! Reveja os sinais: urgência e manipulação pedem verificação.';
    setTimeout(()=>{if(quizIndex<quizData.length-1){quizIndex++;renderQuiz()}else{quizStep.textContent='ANÁLISE CONCLUÍDA';quizQuestion.textContent=`Nível de conscientização: ${Math.round(quizScore/quizData.length*100)}%`;quizFeedback.textContent='Obrigado por testar seu olhar digital.';progressBar.style.width='100%'}},850);
  }));
}
renderQuiz();

const passwordOutput=document.getElementById('password-output'),passwordLength=document.getElementById('password-length'),passwordLengthValue=document.getElementById('password-length-value'),includeSymbols=document.getElementById('include-symbols'),includeNumbers=document.getElementById('include-numbers'),strength=document.getElementById('password-strength');
function gerarSenha(){
  if(!passwordOutput)return;
  let chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  if(includeNumbers.checked)chars+='23456789';
  if(includeSymbols.checked)chars+='!@#$%&*+-=?';
  const values=new Uint32Array(Number(passwordLength.value));crypto.getRandomValues(values);
  passwordOutput.textContent=Array.from(values,value=>chars[value%chars.length]).join('');
  strength.textContent=`força: ${passwordLength.value>=20?'muito forte':passwordLength.value>=14?'forte':'boa'} · gerada localmente`;
}
passwordLength?.addEventListener('input',()=>{passwordLengthValue.textContent=passwordLength.value});
document.getElementById('generate-password')?.addEventListener('click',gerarSenha);
document.getElementById('copy-password')?.addEventListener('click',async()=>{if(passwordOutput.textContent!=='Clique em gerar')await navigator.clipboard.writeText(passwordOutput.textContent)});

/* Menu mobile */
const burger=document.querySelector('.burger'),menu=document.querySelector('.menu');
burger.addEventListener('click',()=>{const a=menu.classList.toggle('aberto');burger.setAttribute('aria-expanded',a)});
menu.addEventListener('click',e=>{if(e.target.tagName==='A'){menu.classList.remove('aberto');burger.setAttribute('aria-expanded','false')}});

/* Entrada suave na rolagem */
const obs=new IntersectionObserver(l=>l.forEach(i=>{if(i.isIntersecting){i.target.classList.add('visivel');obs.unobserve(i.target)}}),{threshold:.15});
document.querySelectorAll('.revelar').forEach(el=>obs.observe(el));

/* Link ativo no menu */
const links=[...document.querySelectorAll('.menu a')];
const obsMenu=new IntersectionObserver(l=>l.forEach(i=>{if(i.isIntersecting)links.forEach(a=>a.classList.toggle('ativo',a.getAttribute('href')==='#'+i.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
links.forEach(a=>{const s=document.querySelector(a.getAttribute('href'));s&&obsMenu.observe(s)});

/* Barra de progresso e brilho do mouse */
const prog=document.getElementById('progresso'),luz=document.getElementById('luz');
addEventListener('scroll',()=>{prog.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%'},{passive:true});
addEventListener('pointermove',e=>{luz.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'});

/* Faixa rolante (edite as palavras aqui) */
const palavras=['PHISHING','ENGENHARIA SOCIAL','CIBERSEGURANÇA','CONSCIENTIZAÇÃO','DESENVOLVIMENTO','ANÁLISE DE SISTEMAS'];
const fx=document.getElementById('faixa'),bloco=palavras.map(p=>'<span>'+p+'</span>').join('');
fx.innerHTML=bloco+bloco+bloco+bloco;

/* Terminal no hero (edite as linhas aqui) */
(function(){
  const t=document.getElementById('term');
  const linhas=['<b>$</b> analisar --mensagem "urgente!"','<em>! alerta:</em> pressão por urgência','<em>! alerta:</em> link suspeito','<b>✓</b> não clique. verifique na fonte.'];
  linhas.forEach(()=>t.appendChild(document.createElement('p')));
  if(reduz){t.querySelectorAll('p').forEach((p,i)=>p.innerHTML=linhas[i]);return}
  let i=0;
  (function proxima(){
    if(i>=linhas.length){setTimeout(()=>{t.querySelectorAll('p').forEach(p=>p.innerHTML='');i=0;proxima()},4500);return}
    t.children[i].innerHTML=linhas[i];
    t.children[i].animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:700,easing:'steps(24)'});
    i++;setTimeout(proxima,1100);
  })();
})();

/* Rede de nós no hero: reage ao mouse */
(function(){
  if(reduz)return;
  const c=document.getElementById('rede'),x=c.getContext('2d');
  let w,h,nos=[],m={x:-999,y:-999};
  function ajustar(){w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;
    nos=Array.from({length:Math.min(80,Math.floor(w*h/15000))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}))}
  addEventListener('resize',ajustar);ajustar();
  const pai=c.parentElement;
  pai.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
  pai.addEventListener('pointerleave',()=>{m.x=m.y=-999});
  (function quadro(){
    x.clearRect(0,0,w,h);
    nos.forEach(a=>{a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>w)a.vx*=-1;if(a.y<0||a.y>h)a.vy*=-1});
    for(let i=0;i<nos.length;i++){
      const a=nos[i];
      for(let j=i+1;j<nos.length;j++){const b=nos[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<130){x.strokeStyle='rgba(119,136,153,'+(.35*(1-d/130))+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
      const dm=Math.hypot(a.x-m.x,a.y-m.y);
      if(dm<180){x.strokeStyle='rgba(99,102,255,'+(.9*(1-dm/180))+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(m.x,m.y);x.stroke()}
      x.fillStyle=dm<180?'#a9b8ff':'#778899';x.beginPath();x.arc(a.x,a.y,dm<180?3:2,0,6.3);x.fill();
    }
    requestAnimationFrame(quadro);
  })();
})();

/* Foto de perfil inclina conforme o mouse */
(function(){
  const f=document.getElementById('foto'),p=f.parentElement;
  p.style.perspective='800px';
  p.addEventListener('pointermove',e=>{const r=p.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;
    f.style.transform='rotateY('+dx*14+'deg) rotateX('+(-dy*14)+'deg)'});
  p.addEventListener('pointerleave',()=>{f.style.transform=''});
})();

/* Música: disco gira e ondas animam enquanto toca */
const pl=document.getElementById('player'),dc=document.getElementById('disco'),on=document.getElementById('ondas');
const tocar=v=>{dc.classList.toggle('tocando',v);on.classList.toggle('tocando',v)};
pl.addEventListener('play',()=>tocar(true));
['pause','ended'].forEach(ev=>pl.addEventListener(ev,()=>tocar(false)));

document.querySelectorAll('audio').forEach(audio => {
  const localAudio = audio.querySelector('source[src*="digital-alert"]');
  if (!localAudio) return;

  const fallbackUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const trocarFallback = () => {
    if (!audio.currentSrc || !audio.currentSrc.includes('soundhelix.com')) {
      audio.src = fallbackUrl;
      audio.load();
    }
  };

  audio.addEventListener('error', trocarFallback, { once: true });
  audio.addEventListener('abort', trocarFallback, { once: true });
  setTimeout(() => {
    if (audio.networkState === 3 && (!audio.currentSrc || audio.currentSrc.startsWith('file://'))) {
      trocarFallback();
    }
  }, 1200);
});

document.getElementById('ano').textContent=new Date().getFullYear();
