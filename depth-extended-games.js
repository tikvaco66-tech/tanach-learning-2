(function(){
"use strict";
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function add(panel,id){
 const qs=(window.tanachQuizData&&window.tanachQuizData[id])||[];if(!qs.length||panel.querySelector(".depth-extra-games"))return;
 const wrap=document.createElement("div");wrap.className="depth-extra-games";
 wrap.innerHTML='<div class="depth-game"><b>משחק 3 · נכון או לא נכון</b><p>בדקו היגדים מתוך תוכן היחידה וקבלו משוב מיידי.</p><button type="button" class="depth-play" data-extra="tf">הפעלת המשחק ←</button><div class="depth-game-stage" data-extra-stage="tf" hidden></div></div><div class="depth-game"><b>משחק 4 · התאמת שאלה לתשובה</b><p>מצאו את זוגות השאלות והתשובות המתאימים.</p><button type="button" class="depth-play" data-extra="match">הפעלת המשחק ←</button><div class="depth-game-stage" data-extra-stage="match" hidden></div></div>';
 panel.querySelector(".depth-games").appendChild(wrap);
 wrap.querySelectorAll("[data-extra]").forEach(btn=>btn.addEventListener("click",()=>{
  const mode=btn.dataset.extra,stage=wrap.querySelector('[data-extra-stage="'+mode+'"]');stage.hidden=false;btn.hidden=true;
  if(mode==="tf"){
   let deck=[];qs.forEach(q=>{deck.push({t:q[0]+" — "+q[1][q[2]],ok:true,ex:q[3]});let wrong=q[1].findIndex((x,i)=>i!==q[2]);if(wrong>=0)deck.push({t:q[0]+" — "+q[1][wrong],ok:false,ex:"התשובה הנכונה: "+q[1][q[2]]+". "+q[3]});});
   deck=shuffle(deck).slice(0,Math.min(8,deck.length));let n=0,score=0;
   function draw(){const x=deck[n];stage.innerHTML='<p class="depth-game-progress">היגד '+(n+1)+' מתוך '+deck.length+'</p><h5>האם ההיגד נכון?</h5><p>'+x.t+'</p><div class="depth-game-options"><button type="button" data-v="1">נכון</button><button type="button" data-v="0">לא נכון</button></div><p class="depth-game-feedback"></p><button type="button" class="depth-game-next" hidden>המשך ←</button>';stage.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{const ok=(b.dataset.v==="1")===x.ok;if(ok)score++;stage.querySelectorAll("[data-v]").forEach(y=>y.disabled=true);stage.querySelector(".depth-game-feedback").textContent=(ok?"נכון! ":"לא מדויק. ")+x.ex;stage.querySelector(".depth-game-next").hidden=false;});stage.querySelector(".depth-game-next").onclick=()=>{if(++n<deck.length)draw();else{stage.innerHTML='<h5>סיימתם!</h5><p class="depth-game-result">'+score+' מתוך '+deck.length+' נקודות</p><button type="button" class="depth-game-restart">משחק חוזר</button>';stage.querySelector(".depth-game-restart").onclick=()=>{n=0;score=0;draw();};}};}
   draw();
  }else{
   const pairs=shuffle(qs.map((q,i)=>({id:i,a:q[0],b:q[1][q[2]]})));const cards=shuffle(pairs.flatMap(x=>[{id:x.id,side:0,t:x.a},{id:x.id,side:1,t:x.b}]));let first=null,found=0,tries=0,locked=false;
   stage.innerHTML='<p>לחצו על שאלה ואז על התשובה המתאימה.</p><p>ניסיונות: <b data-tries>0</b></p><div class="depth-game-options">'+cards.map((x,i)=>'<button type="button" data-card="'+i+'">'+x.t+'</button>').join("")+'</div><p class="depth-game-feedback" data-feedback></p>';
   stage.querySelectorAll("[data-card]").forEach(b=>b.onclick=()=>{if(locked||b.disabled)return;const x=cards[+b.dataset.card];b.classList.add("is-correct");if(!first){first={b,x};return;}tries++;stage.querySelector("[data-tries]").textContent=tries;locked=true;if(first.x.id===x.id&&first.x.side!==x.side){first.b.disabled=true;b.disabled=true;found++;stage.querySelector("[data-feedback]").textContent="התאמה נכונה!";first=null;locked=false;if(found===pairs.length)stage.querySelector("[data-feedback]").textContent="ניצחתם! השלמתם את כל הזוגות ב־"+tries+" ניסיונות.";}else{const old=first;first=null;stage.querySelector("[data-feedback]").textContent="לא תואם, נסו שוב.";setTimeout(()=>{old.b.classList.remove("is-correct");b.classList.remove("is-correct");locked=false;},650);}});
  }
 }));
}
function init(){document.querySelectorAll("article.unit[id]").forEach(a=>{const p=a.querySelector(".depth-panel");if(p)add(p,a.id);});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();