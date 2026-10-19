const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const villages = [
 {name:"Aldeia do Pinheiro",rarity:"COMUM",element:"Vento",clan:"Clã Kaze",desc:"Uma aldeia discreta entre florestas e montanhas. Seus ninjas são conhecidos por disciplina e velocidade.",power:"Passo do Vento",seal:"松"},
 {name:"Aldeia da Cinza",rarity:"COMUM",element:"Fogo",clan:"Clã Enka",desc:"Construída perto de antigas forjas, sua gente transforma determinação em calor e aço.",power:"Brasa Crescente",seal:"灰"},
 {name:"Aldeia da Maré",rarity:"INCOMUM",element:"Água",clan:"Clã Suiren",desc:"Casas erguidas sobre canais escondem guerreiros que aprendem a ceder antes de contra-atacar.",power:"Corte Fluido",seal:"潮"},
 {name:"Aldeia da Rocha",rarity:"INCOMUM",element:"Terra",clan:"Clã Gan",desc:"Uma fortaleza escavada na montanha. Seus guardiões são pacientes, resistentes e difíceis de derrubar.",power:"Punho de Pedra",seal:"岩"},
 {name:"Aldeia do Trovão",rarity:"RARA",element:"Raio",clan:"Clã Raiden",desc:"Uma aldeia isolada por tempestades. Seus aprendizes treinam até o corpo reagir antes do pensamento.",power:"Impulso Relâmpago",seal:"雷"},
 {name:"Aldeia do Eclipse",rarity:"LENDÁRIA",element:"Sombra",clan:"Clã Kurai",desc:"Mapas antigos marcam este lugar como abandonado. A aldeia ainda existe, escondida entre dobras de sombra.",power:"Véu Negro",seal:"蝕"},
 {name:"Aldeia do Dragão Celeste",rarity:"MÍTICA",element:"Canalizador",clan:"Clã Tenryu",desc:"Uma aldeia que quase ninguém acredita existir. Seus registros falam de guerreiros que comandam os quatro elementos principais.",power:"Coroa dos Quatro",seal:"龍"},
 {name:"Santuário das Estrelas",rarity:"MÍTICA",element:"Luz",clan:"Clã Hoshino",desc:"Um santuário oculto onde os poucos escolhidos aprendem técnicas que distorcem percepção e distância.",power:"Lança Astral",seal:"星"},
 {name:"Aldeia do Lótus Carmesim",rarity:"LENDÁRIA",element:"Sangue",clan:"Clã Benika",desc:"Um território selado por pactos antigos. Seus shinobi convertem o próprio risco em poder.",power:"Lótus Carmesim",seal:"蓮"}
];
const elements = ["Fogo","Água","Terra","Ar","Raio","Gelo","Madeira","Metal","Luz","Sombra","Vento","Lava","Vapor","Cristal","Som","Gravidade","Planta","Veneno","Areia","Sangue","Espaço","Tempo","Espírito","Vácuo","Canalizador"];
const state = {
 started:false, name:"Akio", skin:"#e5e7eb", outfit:"#202a3a", style:"Errante",
 village:null, age:8, level:1, xp:0, xpNext:100, hp:100, maxHp:100, chakra:40, maxChakra:40,
 strength:8,speed:8,control:8,instinct:8,money:120,trainCount:0,missionsDone:0,days:0,
 inventory:[{name:"Kunai gasto",desc:"Uma ferramenta simples para treino e defesa.",tag:"COMUM"},{name:"Faixa da aldeia",desc:"Marca que você ainda pertence a algum lugar.",tag:"HISTÓRIA"}],
 skills:[{name:"Golpe básico",desc:"Um ataque confiável, sem custo de chakra.",unlocked:true},{name:"Passo lateral",desc:"Uma esquiva rápida. Melhora com treino de velocidade.",unlocked:true}],
 storyPhase:"childhood", choice:null, immortal:false, sound:true, combatCount:0, explored:0
};
const random = arr => arr[Math.floor(Math.random()*arr.length)];
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function setScreen(id){$$(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");$("#bottomNav").style.display=id==="game"?"":"none";window.scrollTo({top:0,behavior:"smooth"})}
function updatePreview(){state.name=$("#nameInput").value.trim()||"Novo Shinobi";$("#previewName").textContent=state.name.toUpperCase();$(".stickman").style.setProperty("--skin",state.skin);$(".stickman").style.setProperty("--outfit",state.outfit)}
function selectSwatches(container,prop){$$(container+" .swatch").forEach(btn=>btn.addEventListener("click",()=>{$$(container+" .swatch").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");state[prop]=btn.dataset.color;updatePreview()}))}
selectSwatches("#skinSwatches","skin");selectSwatches("#outfitSwatches","outfit");
$("#nameInput").addEventListener("input",updatePreview);$("#styleSelect").addEventListener("change",e=>state.style=e.target.value);
$("#soundBtn").addEventListener("click",()=>{state.sound=!state.sound;$("#soundBtn").textContent=state.sound?"♫":"♪";toast(state.sound?"Sons ativados":"Sons desativados")});
function createOrigin(){
 let roll=Math.random(), v;
 if(roll<.008)v=villages[6];else if(roll<.018)v=villages[7];else if(roll<.055)v=villages[5];else if(roll<.09)v=villages[8];else v=random(villages.slice(0,5));
 state.village={...v}; if(![6,7].includes(villages.indexOf(v)) && Math.random()<.4)state.village.element=random(elements.slice(0,24));
 state.village.potential="Prodígio";
 $("#villageName").textContent=state.village.name;$("#villageDesc").textContent=state.village.desc;$("#villageRarity").textContent="ALDEIA "+state.village.rarity;$("#villageSeal").textContent=state.village.seal;$("#clanName").textContent=state.village.clan;$("#elementName").textContent=state.village.element;$("#potentialName").textContent="Prodígio";
 $("#phaseTag").textContent="DESTINO REVELADO";setScreen("reveal");
}
$("#beginBtn").addEventListener("click",()=>{state.name=$("#nameInput").value.trim()||"Akio";state.style=$("#styleSelect").value;createOrigin()});
$("#enterVillageBtn").addEventListener("click",()=>{state.started=true;$("#phaseTag").textContent="JORNADA ATIVA";$("#locationLabel").textContent=state.village.name.toUpperCase();$("#profileName").textContent=state.name;$("#styleText").textContent=state.style;$("#miniAvatar").style.color=state.skin;$("#miniAvatar").textContent=state.village.seal;$("#gameStick").style.setProperty("--hero-skin",state.skin);$("#gameStick").style.setProperty("--hero-outfit",state.outfit);render();setScreen("game")});
function render(){
 $("#profileName").textContent=state.name;$("#profileTitle").textContent=(state.age<15?"Aprendiz":state.storyPhase==="revenge"?"Ninja errante":"Shinobi") +" • Nível "+state.level;
 $("#ageText").textContent=state.age+" anos";$("#levelText").textContent=state.level;$("#moneyText").textContent=state.money.toLocaleString("pt-BR");$("#styleText").textContent=state.style;
 $("#hpText").textContent=state.hp+" / "+state.maxHp;$("#chakraText").textContent=state.chakra+" / "+state.maxChakra;$("#xpText").textContent=state.xp+" / "+state.xpNext;
 $("#hpBar").style.width=(state.hp/state.maxHp*100)+"%";$("#chakraBar").style.width=(state.chakra/state.maxChakra*100)+"%";$("#xpBar").style.width=(state.xp/state.xpNext*100)+"%";
 [["strength",state.strength],["speed",state.speed],["control",state.control],["instinct",state.instinct]].forEach(([key,val])=>{$("#"+key+"Text").textContent=val;$("#"+key+"Bar").style.width=Math.min(100,val*2)+"%"});
 $("#objectiveTitle").textContent=state.age<15?"Prove seu potencial":state.storyPhase==="revenge"?"Descubra quem destruiu sua aldeia":"Escolha seu próximo caminho";
 $("#objectiveText").textContent=state.age<15?"Treine, conclua missões e prepare-se para o exame de graduação.":"Explore as terras devastadas, reúna recursos e decida seu destino.";
 $("#objectiveBar").style.width=Math.min(100,state.trainCount/3*100)+"%";$("#objectiveCount").textContent=state.trainCount+" / 3 treinos";
 if(state.age>=15 && state.storyPhase==="childhood") triggerTragedy();
}
function setStory(kicker,text,icon="✦"){ $("#storyKicker").textContent=kicker;$("#storyText").textContent=text;$("#storyIcon").textContent=icon}
function openModal(eyebrow,title,content,buttons=[]){
 $("#modalEyebrow").textContent=eyebrow;$("#modalTitle").textContent=title;$("#modalContent").innerHTML=content;$("#modalActions").innerHTML="";
 buttons.forEach(b=>{let btn=document.createElement("button");btn.textContent=b.label;if(b.kind)btn.className=b.kind;btn.addEventListener("click",()=>{if(b.action)b.action();});$("#modalActions").appendChild(btn)});
 $("#modal").classList.remove("hidden");
}
function closeModal(){$("#modal").classList.add("hidden")}
$$("[data-close='true']").forEach(x=>x.addEventListener("click",closeModal));
function train(){
 if(state.age>=15 && state.storyPhase!=="childhood"){toast("Você precisa se preparar para sobreviver. Procure treino ou recursos.");}
 const drills=[
  {name:"Treino de reflexos",desc:"Leia o movimento do alvo. Escolha o momento certo para esquivar.",stat:"speed"},
  {name:"Controle de chakra",desc:"Respire, concentre a energia e evite desperdiçar chakra.",stat:"control"},
  {name:"Treino de força",desc:"Execute a sequência de golpes mantendo o equilíbrio.",stat:"strength"},
  {name:"Percepção",desc:"Observe os sinais ao redor e reaja antes que seja tarde.",stat:"instinct"}
 ];
 const drill=random(drills);
 openModal("TREINAMENTO MANUAL",""+drill.name,`<p class="modal-copy">${drill.desc} O resultado depende da sua escolha; não existe ganho automático.</p><div class="training-prompt"><b>O instrutor inicia a sequência.</b><p>Qual é a sua resposta?</p><div class="timing-buttons"><button data-timing="early">Cedo demais</button><button data-timing="perfect">No momento certo</button><button data-timing="late">Tarde demais</button></div></div><p class="modal-copy">Dica: controle e instinto melhoram com prática. Um acerto perfeito dá mais experiência.</p>`,[]);
 $$(".timing-buttons button").forEach(btn=>btn.addEventListener("click",()=>{
   const result=btn.dataset.timing;closeModal();state.trainCount++;
   if(result==="perfect"){state[drill.stat]+=2;state.xp+=35;state.chakra=Math.min(state.maxChakra,state.chakra+8);state.money+=12;setStory("TREINO CONCLUÍDO","Você acertou o tempo do exercício. Seu controle melhora e o instrutor finalmente reconhece seu potencial.","✧");toast("Execução perfeita! +2 "+drill.stat+" • +35 XP");}
   else {state[drill.stat]+=1;state.xp+=15;state.hp=Math.max(1,state.hp-(result==="late"?5:2));setStory("TREINO CONCLUÍDO","Você errou o tempo, mas aprendeu com o erro. Amanhã será melhor.","⌁");toast("Treino concluído. +1 atributo • +15 XP");}
   levelCheck();render();
 }));
}
function levelCheck(){while(state.xp>=state.xpNext){state.xp-=state.xpNext;state.level++;state.xpNext=Math.floor(state.xpNext*1.32);state.maxHp+=8;state.maxChakra+=5;state.hp=state.maxHp;state.chakra=state.maxChakra;toast("NÍVEL "+state.level+" ALCANÇADO!");}}
function explore(){
 state.explored++;
 if(state.age<15){
  const event=random(["Você encontra um pergaminho de treino escondido entre as raízes.","Você ajuda um comerciante e recebe uma pequena recompensa.","Um instrutor misterioso observa seus movimentos e deixa uma dica.","Você encontra ervas medicinais perto do riacho."]);
  state.money+=random([8,12,18]);state.xp+=12;levelCheck();setStory("DESCOBERTA NA ALDEIA",event,"⌖");render();toast("Exploração concluída • +12 XP");return;
 }
 const roll=Math.random();
 if(roll<.035&&!state.immortal){state.inventory.push({name:"Elixir da Vida",desc:"Um artefato quase impossível de encontrar. Concede imortalidade nesta jornada.",tag:"MÍTICO"});state.immortal=true;setStory("ARTEFATO MÍTICO","Você encontra o Elixir da Vida, escondido em um relicário esquecido. Seu corpo não poderá mais morrer.","◇");render();openModal("ITEM MÍTICO","Elixir da Vida",'<p class="modal-copy">O líquido brilha como uma estrela antiga. Ao bebê-lo, você sente o tempo parar de reivindicar seu corpo. <b>Imortalidade desbloqueada nesta jornada.</b></p>',[{label:"Guardar o segredo",kind:"good",action:closeModal}]);return;}
 if(roll<.30){let loot=random([{name:"Minério lunar",tag:"RARO"},{name:"Pergaminho de técnica",tag:"INCOMUM"},{name:"Fragmento elemental",tag:"RARO"}]);state.inventory.push({...loot,desc:"Um achado valioso encontrado durante a exploração."});state.money+=25;state.xp+=25;levelCheck();setStory("TESOURO ENCONTRADO","Entre ruínas e poeira, você encontrou "+loot.name+". Alguém pagaria caro por isso.","◇");toast("Tesouro encontrado!");}
 else if(roll<.68){const monster=random(["Lobo de Cinzas","Aranha de Pedra","Espírito Faminto","Javali de Chifres Negros"]);startCombat(monster);return;}
 else {state.hp=Math.max(1,state.hp-8);state.money+=10;setStory("EMBOSCADA","Uma criatura ataca das sombras. Você escapa, mas sofre um ferimento e perde parte dos suprimentos.","!");toast("Você foi ferido durante a exploração.");}
 render();
}
function startCombat(monster){
 const power=Math.floor(25+state.level*4+state.strength*1.5);const monsterHp=70+Math.floor(Math.random()*35);
 openModal("ENCONTRO HOSTIL",monster,`<p class="modal-copy">Uma criatura bloqueia seu caminho. <b>Vida estimada: ${monsterHp}</b>. Escolha como agir.</p><div class="training-prompt"><b>Você tem uma abertura.</b><p>O uso de técnicas especiais consome chakra. A esquiva pode evitar dano, mas exige instinto.</p></div>`,[
 {label:"Ataque rápido",kind:"primary",action:()=>{let dmg=power+Math.floor(Math.random()*12);state.hp=Math.max(1,state.hp- Math.max(0,Math.floor(monsterHp*.15)-state.speed));state.xp+=28;state.money+=18;state.combatCount++;levelCheck();setStory("VITÓRIA NO COMBATE",`Você derrota ${monster} com um ataque preciso. O caminho fica livre.`,`⚔`);closeModal();render();toast("Golpe certeiro! Dano "+dmg+" • +28 XP");}},
 {label:"Técnica elemental",action:()=>{if(state.chakra<12){toast("Chakra insuficiente.");return;}state.chakra-=12;state.hp=Math.max(1,state.hp-5);state.xp+=40;state.money+=25;state.combatCount++;levelCheck();closeModal();setStory("TÉCNICA ESPECIAL",`Seu ${state.village.element} explode em um arco de energia. ${monster} cai antes de conseguir reagir.`,"✧");render();toast("Técnica especial! +40 XP • +25 Ryo");}},
 {label:"Esquivar e recuar",kind:"good",action:()=>{closeModal();if(Math.random()<.55+state.instinct/100){state.speed++;state.xp+=12;setStory("ESQUIVA PERFEITA","Você lê o ataque e sai do alcance por pouco. Recuar também é uma forma de sobreviver.","⌁");toast("Esquiva bem-sucedida!");}else{state.hp=Math.max(1,state.hp-12);setStory("RECUO FORÇADO","A criatura alcança você antes da fuga. Você escapa, mas sai ferido.","!");toast("Você sofreu 12 de dano.");}levelCheck();render();}}
 ]);
}
function missions(){
 const content=`<div class="mission-item"><div><b>Rotina de aprendiz</b><small>Complete 3 treinos manuais.</small></div><span class="item-tag">${Math.min(state.trainCount,3)}/3</span></div>
 <div class="mission-item"><div><b>Conheça seu território</b><small>Explore a região 2 vezes.</small></div><span class="item-tag">${Math.min(state.explored,2)}/2</span></div>
 <div class="mission-item"><div><b>Prove sua coragem</b><small>Vença um encontro hostil.</small></div><span class="item-tag">${Math.min(state.combatCount,1)}/1</span></div>`;
 openModal("QUADRO DE MISSÕES","Contratos disponíveis",content,[{label:"Resgatar recompensa",kind:"primary",action:()=>{let reward=0;if(state.trainCount>=3){reward+=80;state.trainCount-=3;}if(state.explored>=2){reward+=55;state.explored-=2;}if(state.combatCount>=1){reward+=100;state.combatCount=0;}if(reward===0){toast("Ainda não há recompensas concluídas.");return;}state.money+=reward;state.missionsDone++;closeModal();render();toast("Recompensas recebidas: "+reward+" Ryo");}}]);
}
function inventory(){
 let items=state.inventory.map(it=>`<div class="inventory-item"><div><b>${it.name}</b><small>${it.desc}</small></div><span class="item-tag">${it.tag}</span></div>`).join("");
 if(!items)items='<p class="modal-copy">Seu inventário está vazio.</p>';
 openModal("EQUIPAMENTO E RELÍQUIAS","Inventário",`<p class="modal-copy">Itens encontrados durante a jornada. Alguns podem mudar completamente seu destino.</p>${items}`,[{label:"Fechar",kind:"primary",action:closeModal}]);
}
function skills(){
 let list=state.skills.map(s=>`<div class="skill-item"><div><b>${s.name}</b><small>${s.desc}</small></div><span class="item-tag">${s.unlocked?"DESBLOQUEADA":"BLOQUEADA"}</span></div>`).join("");
 list+=`<div class="skill-item"><div><b>${state.village.power}</b><small>Técnica característica do seu território: ${state.village.element}.</small></div><span class="item-tag">CLÃ</span></div>`;
 openModal("ARSENAL SHINOBI","Técnicas",`<p class="modal-copy">As técnicas especiais ficam mais fortes conforme seus atributos e nível aumentam. O sistema elemental terá 25 afinidades distintas.</p>${list}`,[{label:"Voltar à jornada",kind:"primary",action:closeModal}]);
}
function mapView(){
 openModal("MAPA REGIONAL","Territórios conhecidos",`<p class="modal-copy">Você conhece apenas as terras ao redor de ${state.village.name}. Ruínas, bases e aldeias rivais serão reveladas à medida que explorar.</p><div class="training-prompt"><b>REGIÃO DESCOBERTA: FRONTEIRA ${state.age<15?"NORTE":"DAS CINZAS"}</b><p>• Aldeia natal — conhecida<br>• Floresta dos Ecos — explorável<br>• Ruínas antigas — localização incerta<br>• Base dos espadachins — desconhecida</p></div>`,[{label:"Explorar região",kind:"primary",action:()=>{closeModal();explore();}}]);
}
function profileView(){
 openModal("REGISTRO PESSOAL","Ficha do shinobi",`<div class="mission-item"><div><b>${state.name}</b><small>${state.village.name} • ${state.village.clan}</small></div><span class="item-tag">PRODÍGIO</span></div><div class="mission-item"><div><b>Elemento</b><small>${state.village.element}</small></div><span class="item-tag">AFINIDADE</span></div><div class="mission-item"><div><b>Estado</b><small>${state.immortal?"Imortal — efeito do Elixir da Vida":state.hp<30?"Ferido": "Em condições de continuar"}</small></div><span class="item-tag">ATUAL</span></div><p class="modal-copy">Sua evolução extrema é uma característica de prodígio, mas domínio real exige treino e experiência.</p>`,[{label:"Fechar ficha",kind:"primary",action:closeModal}]);
}
function triggerTragedy(){
 state.storyPhase="aftermath";$("#phaseTag").textContent="O DIA DA QUEDA";$("#sceneArt").className="scene-art battle-scene";$("#sceneCaption").textContent="A aldeia arde sob o céu vermelho.";$("#weatherLabel").textContent="FUMAÇA • NOITE";$("#objectiveTitle").textContent="Sobreviva";$("#objectiveText").textContent="A aldeia caiu. Encontre abrigo, descubra a verdade e decida o que fazer com sua dor.";
 setStory("15 ANOS • A QUEDA","O ataque começa antes do amanhecer. Os espadachins avançam pelas ruas. Seu melhor amigo, Ren, empurra você para fora do alcance de um golpe fatal — e cai em seu lugar.","!");
 openModal("EVENTO DE HISTÓRIA","A última promessa",`<p class="modal-copy">O fogo toma os telhados. Ren segura seu braço, ferido, e força um sorriso que você nunca vai esquecer.</p><div class="training-prompt"><b>“Não deixa eles decidirem quem você vai ser.”</b><p>Ele entrega a você a faixa da aldeia. Atrás dele, a última linha de defesa desaparece na fumaça. Você precisa fugir.</p></div><p class="modal-copy">A aldeia que caiu era a mais poderosa entre os ninjas e protegia os espadachins de uma ameaça maior. Agora, nada é simples.</p>`,[
 {label:"Jurar vingança",kind:"primary",action:()=>{state.storyPhase="revenge";state.choice="revenge";closeModal();aftermath("Você jura encontrar os responsáveis. A vingança se torna seu norte — mas a verdade pode ser diferente do que imagina.");}},
 {label:"Descobrir a verdade",kind:"good",action:()=>{state.storyPhase="truth";state.choice="truth";closeModal();aftermath("Você promete descobrir por que a aldeia foi traída antes de decidir quem merece sua lâmina.");}}
 ]);
}
function aftermath(text){
 $("#sceneArt").className="scene-art wilderness-scene";$("#sceneCaption").textContent="Um sobrevivente entre as cinzas.";$("#locationLabel").textContent="TERRAS DEVASTADAS";$("#weatherLabel").textContent="CINZAS • AMANHECER";state.hp=Math.max(35,state.hp);state.money+=40;
 setStory("NOVO CAPÍTULO",text,"影");render();toast("Novo capítulo desbloqueado.");
}
$("#advanceBtn").addEventListener("click",()=>{
 if(state.storyPhase==="aftermath"){toast("Escolha seu caminho no evento de história.");return;}
 state.days++;
 if(state.age<15){state.age++;state.hp=state.maxHp;state.chakra=state.maxChakra;setStory("TEMPO AVANÇOU",`Mais um ano passa em ${state.village.name}. Você tem ${state.age} anos. O mundo parece maior a cada treino.`,"◷");if(state.age===14){setStory("14 ANOS • ÚLTIMO ANO DE PAZ","O exame de graduação se aproxima. Há rumores de movimento nas fronteiras. Aproveite o tempo que resta.","!");}}
 else {state.hp=Math.min(state.maxHp,state.hp+10);state.chakra=Math.min(state.maxChakra,state.chakra+10);setStory("ACAMPAMENTO","Você descansa, recupera parte das forças e planeja seu próximo movimento.","◷");}
 render();
});
$("#saveBtn").addEventListener("click",()=>{try{localStorage.setItem("shinobiRequiemSave",JSON.stringify(state));toast("Jornada salva neste dispositivo.");}catch(e){toast("Não foi possível salvar neste navegador.");}});
$$(".action-card").forEach(btn=>btn.addEventListener("click",()=>({train,explore,missions,inventory}[btn.dataset.action])()));
$$(".nav-item").forEach(btn=>btn.addEventListener("click",()=>{$$(".nav-item").forEach(b=>b.classList.remove("active"));btn.classList.add("active");({home:()=>{closeModal();},skills,map:mapView,profile:profileView}[btn.dataset.tab]||(()=>{}))();}));
updatePreview();
