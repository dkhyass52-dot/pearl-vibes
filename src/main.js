import './styles/main.css';
import { SHOP } from './config.js';
import { P, CATS, SUBS } from './data/products.js';
import { BEADS, KIND } from './data/atelier.js';

/* ============ utils ============ */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=n=>n.toLocaleString("fr-FR").replace(/ | /g," ")+" F";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store={get(k,d){try{const v=localStorage.getItem("pv:"+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem("pv:"+k,JSON.stringify(v))}catch(e){}}};
const waLink=txt=>"https://wa.me/"+SHOP.whatsapp+"?text="+encodeURIComponent(txt);
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
let toastT;
function toast(msg){$("#toastTxt").textContent=msg;$("#toast").classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>$("#toast").classList.remove("on"),2600)}
async function copy(text,el){try{await navigator.clipboard.writeText(text);toast("Copié")}catch(e){const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);toast("Texte sélectionné, copiez-le")}}

/* hero : 3 photos qui défilent */
const heroShow=(function(){const slides=$$("#heroSlides .slide"),dots=$$("#heroDots button");if(!slides.length)return{};
  const MS=5500;let i=0,t=null;
  const go=n=>{i=(n+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle("is-active",k===i));dots.forEach((d,k)=>d.setAttribute("aria-pressed",k===i))};
  const play=()=>{if(reduce)return;clearInterval(t);t=setInterval(()=>go(i+1),MS)};
  const stop=()=>clearInterval(t);
  dots.forEach((d,k)=>d.onclick=e=>{e.stopPropagation();go(k);play()});
  $("#heroSlides").addEventListener("click",()=>{const id=slides[i].dataset.id;if(byId(id))openProduct(id)});
  document.addEventListener("visibilitychange",()=>document.hidden?stop():play());
  return{play,stop,start(){go(0);play()}}})();

/* state */
let cart=store.get("cart",[]), wish=store.get("wish",[]);
const save=()=>{store.set("cart",cart);store.set("wish",wish)};
const byId=id=>P.find(p=>p.id===id);
const inCat=k=>P.filter(p=>p.cat===k);
const minPrice=l=>Math.min(...l.map(p=>p.price));
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const badgeCls=b=>b==="Best-seller"||b==="Pièce signature"?"gold":b==="Pièce unique"?"hot":"";

/* carte produit (utilisée partout) */
function card(p,i){return `<article class="card" style="animation-delay:${Math.min(i,8)*50}ms">
    <div class="vitrine" data-open="${p.id}" role="button" tabindex="0" aria-label="Voir ${esc(p.name)}">
      <img src="/img/${p.id}.webp" alt="${esc(p.name)}" loading="lazy">
      <div class="badges">${p.badges.map(b=>`<span class="badge ${badgeCls(b)}">${b}</span>`).join("")}</div>
      <div class="quick"><button class="add" data-add="${p.id}">Ajouter</button><button class="see" data-open="${p.id}" aria-label="Aperçu rapide"><svg><use href="#i-eye"/></svg></button></div>
    </div>
    <button class="heart" data-wish="${p.id}" aria-pressed="${wish.includes(p.id)}" aria-label="Ajouter ${esc(p.name)} aux favoris"><svg><use href="#i-heart"/></svg></button>
    <div class="meta"><h3>${p.name}</h3><span class="price">${fmt(p.price)}</span></div>
    <div class="sub"><span class="swatches">${p.colors.map(c=>`<i style="background:${c}"></i>`).join("")}</span>${p.stock<=3?`<span class="stock">Plus que ${p.stock} en stock</span>`:`<span>${p.mat.split(",")[0]}</span>`}</div>
  </article>`}
function catTile(k){const c=CATS[k],l=inCat(k);return `<a class="tile" href="#${c.slug}"><img src="/img/${c.cover[0]}.webp" alt="" loading="lazy"><span>${c.label}<small>${l.length} pièces · dès ${fmt(minPrice(l))}</small></span></a>`}
/* tuiles de l'accueil : une par famille de bijoux (catégorie + sous-catégorie) */
const TILES=[["baya","prenom","Bayas prénom","baya-rose-poudre"],["baya","trefle","Bayas trèfles","baya-nuit-trefles"],["collier","perle","Colliers de perles","col-perle-coeur"],["collier","rocaille","Colliers & initiales","col-initiale"],["bracelet","pierre","Bracelets en pierres","br-sept-pierres"],["bracelet","homme","Bracelets pour lui","br-duo-tigre-onyx"]];

/* délégation : ajouter / voir / favori, dans toutes les grilles */
document.addEventListener("click",e=>{if(!e.target.closest(".grid"))return;
  const a=e.target.closest("[data-add]"),o=e.target.closest("[data-open]"),w=e.target.closest("[data-wish]");
  if(a){e.stopPropagation();const p=byId(a.dataset.add);addToCart(p,defaults(p),1,a.closest(".card").querySelector("img"));return}
  if(w){toggleWish(w.dataset.wish);return}
  if(o)openProduct(o.dataset.open)});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.matches&&e.target.matches(".vitrine"))openProduct(e.target.dataset.open)});

/* accueil */
$("#cats").innerHTML=TILES.map(([k,s,label,img])=>`<a class="tile" href="#${CATS[k].slug}" data-sub="${s}"><img src="/img/${img}.webp" alt="" loading="lazy"><span>${label}</span></a>`).join("");
$("#featGrid").innerHTML=P.filter(p=>p.feat).slice(0,8).map(card).join("");
function sorted(l,s){l=[...l];if(s==="asc")l.sort((a,b)=>a.price-b.price);else if(s==="desc")l.sort((a,b)=>b.price-a.price);else if(s==="new")l.sort((a,b)=>b.isNew-a.isNew||a.rank-b.rank);else l.sort((a,b)=>(!!b.feat-!!a.feat)||a.rank-b.rank);return l}

/* liens vers une sous-catégorie (tuiles, blocs « perles et pierres ») */
let pendingSub=null,pendingQ=null;
document.addEventListener("click",e=>{const a=e.target.closest("a[data-sub]");if(!a)return;pendingSub=a.dataset.sub;
  if(location.hash===a.getAttribute("href")){e.preventDefault();route()}});

/* recherche du bandeau */
$("#topSearch").addEventListener("submit",e=>{e.preventDefault();pendingQ=$("#topQ").value.trim();pendingSub="all";
  if(location.hash==="#boutique")route();else location.hash="boutique"});

/* page catégorie */
const cs={cat:null,sub:"all",q:"",price:"all",sort:"feat"};
const ALL={slug:"boutique",label:"Tous nos bijoux",single:"bijou",intro:"Bayas, colliers et bracelets : toute la collection Pearl Vibes, montée à la main à Cotonou."};
const catInfo=k=>k==="all"?ALL:CATS[k];
const inView=k=>k==="all"?P:inCat(k);
function renderCatView(){const k=cs.cat,c=catInfo(k);
  $("#cvCrumb").textContent=c.label;$("#cvTitle").textContent=c.label;$("#cvIntro").textContent=c.intro;
  const others=Object.keys(CATS).filter(x=>x!==k);$("#cvNext").innerHTML=others.map(x=>catTile(x)).join("");$("#cvNext").className="tiles tiles-3"+(others.length===2?" tiles-2":"");
  renderSubs();renderCatGrid()}
function renderSubs(){const k=cs.cat,l=inView(k);
  const subs=k==="all"?Object.entries(CATS).map(([key,c])=>[key,c.label]):SUBS[k];const subMatch=(p,s)=>k==="all"?p.cat===s:p.sub===s;
  const items=[["all","Tout",l.length],...subs.map(([s,lab])=>[s,lab,l.filter(p=>subMatch(p,s)).length]),["rare","Séries limitées",l.filter(p=>p.stock<=3).length]].filter(x=>x[2]>0);
  $("#cvSubs").innerHTML=items.map(([s,lab,n])=>`<button class="chip" data-sub="${s}" aria-pressed="${cs.sub===s}">${lab}<i>${n}</i></button>`).join("")}
function catList(){let l=inView(cs.cat);
  if(cs.sub==="rare")l=l.filter(p=>p.stock<=3);else if(cs.sub!=="all")l=l.filter(p=>cs.cat==="all"?p.cat===cs.sub:p.sub===cs.sub);
  if(cs.price!=="all"){const[a,b]=cs.price.split("-").map(Number);l=l.filter(p=>p.price>=a&&p.price<b)}
  if(cs.q){const q=norm(cs.q);l=l.filter(p=>norm(p.name+" "+p.mat+" "+p.desc+" "+catInfo(p.cat).label).includes(q))}
  return sorted(l,cs.sort)}
function renderCatGrid(){const l=catList(),c=catInfo(cs.cat);const filtered=cs.sub!=="all"||cs.q||cs.price!=="all";
  $("#cvCount").textContent=`${l.length} ${l.length>1?"pièces":"pièce"}${filtered?" sur "+inView(cs.cat).length:""}${cs.q?" pour « "+esc(cs.q)+" »":""}`;$("#cvReset").hidden=!filtered;
  $("#cvGrid").innerHTML=l.length?l.map(card).join(""):`<div class="empty">Aucun ${c.single.toLowerCase()} ne correspond à ces filtres.<br><br><button class="mini" data-reset>Tout afficher</button></div>`}
function resetCat(){cs.sub="all";cs.q="";cs.price="all";$("#cvQ").value="";$("#topQ").value="";$("#cvPrice").value="all";renderSubs();renderCatGrid()}
$("#cvSubs").addEventListener("click",e=>{const b=e.target.closest("[data-sub]");if(!b)return;cs.sub=b.dataset.sub;renderSubs();renderCatGrid()});
$("#cvQ").addEventListener("input",e=>{cs.q=e.target.value.trim();renderCatGrid()});
$("#cvPrice").addEventListener("change",e=>{cs.price=e.target.value;renderCatGrid()});
$("#cvSort").addEventListener("change",e=>{cs.sort=e.target.value;renderCatGrid()});
$("#cvReset").onclick=resetCat;
$("#cvGrid").addEventListener("click",e=>{if(e.target.closest("[data-reset]"))resetCat()});

/* routeur : #bayas, #colliers, #bracelets, #boutique = pages catalogue ; le reste = accueil */
const SLUGS={...Object.fromEntries(Object.entries(CATS).map(([k,c])=>[c.slug,k])),boutique:"all"};
function route(){const h=decodeURIComponent(location.hash.slice(1));const k=SLUGS[h];
  const home=$("#home"),view=$("#catView");
  closeAll(true);
  $$("[data-nav]").forEach(a=>{if(a.dataset.nav===h)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  if(k){if(cs.cat!==k||pendingSub||pendingQ!==null){cs.cat=k;cs.sub=pendingSub&&pendingSub!=="all"?pendingSub:"all";cs.q=pendingQ||"";cs.price="all";cs.sort="feat";$("#cvQ").value=cs.q;$("#cvPrice").value="all";$("#cvSort").value="feat"}
    pendingSub=null;pendingQ=null;$("#topQ").value=k==="all"?cs.q:"";
    home.hidden=true;view.hidden=false;view.style.animation="none";void view.offsetWidth;view.style.animation="";renderCatView();window.scrollTo(0,0);
    document.title=catInfo(k).label+" · Pearl Vibes";heroShow.stop&&heroShow.stop();return}
  pendingSub=null;pendingQ=null;$("#topQ").value="";
  const wasHidden=home.hidden;home.hidden=false;view.hidden=true;document.title="Pearl Vibes · Accessoires en perles à Cotonou";
  if(wasHidden&&heroShow.play)heroShow.play();
  if(!h||h==="accueil"){window.scrollTo(0,0);return}
  const el=document.getElementById(h);if(el)requestAnimationFrame(()=>el.scrollIntoView({behavior:wasHidden?"auto":"smooth"}))}
addEventListener("hashchange",route);
addEventListener("scroll",()=>$(".nav").classList.toggle("scrolled",scrollY>60),{passive:true});

function defaults(p){const o={};for(const k in p.opts)o[k]=p.opts[k][0];return o}

/* wishlist */
function toggleWish(id){const on=!wish.includes(id);wish=on?[...wish,id]:wish.filter(x=>x!==id);save();$$(`[data-wish="${id}"]`).forEach(b=>b.setAttribute("aria-pressed",on));updateCounts();renderWish();toast(on?"Ajouté à vos favoris":"Retiré des favoris")}
function renderWish(){const b=$("#wishBody");const items=wish.map(id=>P.find(p=>p.id===id)).filter(Boolean);
  b.innerHTML=items.length?items.map(p=>`<div class="line-item"><div class="li-img"><img src="/img/${p.id}.webp" alt=""></div><div><div class="li-name">${p.name}</div><div class="li-opt price">${fmt(p.price)}</div><button class="mini" style="margin-top:10px" data-wadd="${p.id}">Ajouter au panier</button></div><div class="li-right"><button class="remove" data-wrm="${p.id}">Retirer</button></div></div>`).join(""):`<div class="d-empty"><img src="/img/monogramme.webp" alt=""><p>Touchez le cœur d'une pièce pour la garder ici.</p></div>`;
  $$("[data-wadd]",b).forEach(x=>x.onclick=()=>{const p=P.find(q=>q.id===x.dataset.wadd);addToCart(p,defaults(p),1)});
  $$("[data-wrm]",b).forEach(x=>x.onclick=()=>toggleWish(x.dataset.wrm))}

/* cart */
function addToCart(p,opts,qty=1,fromImg){const k=p.id+"|"+JSON.stringify(opts);const ex=cart.find(i=>i.key===k);
  if(ex)ex.qty+=qty;else cart.push({key:k,id:p.id,name:p.name,price:p.price,img:p.custom?p.img:"/img/"+p.id+".webp",custom:!!p.custom,opts,qty,detail:p.detail||""});
  save();updateCounts(true);renderCart();
  if(fromImg&&!reduce)flyTo(fromImg);
  toast(p.name+" ajouté au panier")}
function flyTo(img){const r=img.getBoundingClientRect(),t=$("#cartBtn").getBoundingClientRect();const f=document.createElement("img");f.src=img.src;f.className="fly";f.style.left=(r.left+r.width/2-32)+"px";f.style.top=(r.top+r.height/2-40)+"px";document.body.appendChild(f);requestAnimationFrame(()=>{f.style.transform=`translate(${t.left+t.width/2-(r.left+r.width/2)}px,${t.top+t.height/2-(r.top+r.height/2)}px) scale(.25)`;f.style.opacity=".2"});setTimeout(()=>f.remove(),900)}
function updateCounts(bump){const n=cart.reduce((s,i)=>s+i.qty,0);const c=$("#cartCount");c.textContent=n;c.classList.toggle("on",n>0);if(bump){c.classList.remove("bump");void c.offsetWidth;c.classList.add("bump")}
  const w=$("#wishCount");w.textContent=wish.length;w.classList.toggle("on",wish.length>0)}
let co=store.get("checkout",{zone:"cotonou",gift:false,name:"",place:"",note:""});
function totals(){const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);const z=SHOP.zones.find(z=>z.id===co.zone)||SHOP.zones[0];
  const free=sub>=SHOP.freeShipping&&z.fee>0;const ship=z.fee===null?null:free?0:z.fee;const gift=co.gift?SHOP.giftWrap:0;
  return{sub,z,ship,gift,total:sub+(ship||0)+gift}}
const optStr=o=>Object.values(o||{}).join(" · ");
function orderRef(){let r=store.get("ref",null);if(!r){r="PV-"+Math.floor(1000+Math.random()*9000);store.set("ref",r)}return r}
function message(){const T=totals();const L=[];
  L.push(`Bonjour ${SHOP.name} ✨`,`Je souhaite commander :`,``,`Commande ${orderRef()}`);
  cart.forEach((i,n)=>{L.push(`${n+1}. ${i.name}${optStr(i.opts)?" ("+optStr(i.opts)+")":""} × ${i.qty} = ${fmt(i.price*i.qty)}`);if(i.detail)L.push(`   ↳ ${i.detail}`)});
  L.push(``,`Sous-total : ${fmt(T.sub)}`);
  if(co.gift)L.push(`Écrin cadeau : ${fmt(SHOP.giftWrap)}`);
  L.push(`Livraison (${T.z.label}) : ${T.ship===null?"sur devis":T.ship===0?(T.z.id==="retrait"?"retrait":"offerte"):fmt(T.ship)}`);
  L.push(`Total : ${fmt(T.total)}${T.ship===null?" + livraison":""}`,``);
  if(co.name)L.push(`Nom : ${co.name}`);if(co.place)L.push(`Adresse / quartier : ${co.place}`);if(co.gift&&co.note)L.push(`Mot pour la carte : ${co.note}`);
  L.push(``,`Merci de me confirmer la disponibilité 🙏`);return L.join("\n")}
function renderCart(){const b=$("#cartBody"),f=$("#cartFoot");
  if(!cart.length){b.innerHTML=`<div class="d-empty"><img src="/img/monogramme.webp" alt=""><p>Votre panier est vide.</p><button class="btn btn-ghost" data-close-go>Voir la collection</button></div>`;f.hidden=true;$("[data-close-go]",b).onclick=()=>{closeAll();location.hash="boutique"};return}
  f.hidden=false;const T=totals();const left=SHOP.freeShipping-T.sub;
  b.innerHTML=`<div class="freebar">${left>0?`Plus que <b class="price">${fmt(left)}</b> pour la livraison offerte`:`<b>Livraison offerte</b> sur votre commande`}<div class="bar"><i style="width:${Math.min(100,T.sub/SHOP.freeShipping*100)}%"></i></div></div>
  ${cart.map((i,n)=>`<div class="line-item"><div class="li-img ${i.custom?"custom":""}"><img src="${i.img}" alt=""></div>
    <div style="min-width:0"><div class="li-name">${esc(i.name)}</div><div class="li-opt">${esc(optStr(i.opts))}${i.detail?"<br>"+esc(i.detail):""}</div>
    <div class="qty"><button data-q="${n}" data-d="-1" aria-label="Retirer un">−</button><span>${i.qty}</span><button data-q="${n}" data-d="1" aria-label="Ajouter un">+</button></div></div>
    <div class="li-right"><span class="price">${fmt(i.price*i.qty)}</span><button class="remove" data-rm="${n}">Retirer</button></div></div>`).join("")}
  <label class="opt-card"><input type="checkbox" id="gift" ${co.gift?"checked":""}><div>Écrin cadeau Pearl Vibes<small>Boîte rigide dorée, ruban et mot manuscrit</small></div><span class="price">+${fmt(SHOP.giftWrap)}</span></label>
  <div><label class="lbl" for="zone">Livraison</label><select class="inp" id="zone">${SHOP.zones.map(z=>`<option value="${z.id}" ${z.id===co.zone?"selected":""}>${z.label} — ${z.fee===null?"sur devis":z.fee===0?"gratuit":fmt(z.fee)}</option>`).join("")}</select></div>
  <div class="two"><div><label class="lbl" for="cName">Votre nom</label><input class="inp" id="cName" value="${esc(co.name)}" placeholder="Ex. Afiwa D." autocomplete="name"></div><div><label class="lbl" for="cPlace">Quartier / ville</label><input class="inp" id="cPlace" value="${esc(co.place)}" placeholder="Ex. Fidjrossè"></div></div>
  ${co.gift?`<div><label class="lbl" for="cNote">Mot pour la carte</label><textarea class="inp" id="cNote" maxlength="160" placeholder="Joyeux anniversaire ma reine…">${esc(co.note)}</textarea></div>`:""}
  <details><summary style="font-size:13px;padding:8px 0">Aperçu du message WhatsApp</summary><div class="preview" id="preview"></div><button class="mini" id="copyMsg" style="margin-top:10px">Copier le message</button></details>`;
  f.innerHTML=`<div class="sum"><div><span class="muted">Sous-total</span><span class="price" id="sSub"></span></div><div><span class="muted">Livraison</span><span class="price" id="sShip"></span></div><div id="sGiftRow"><span class="muted">Écrin cadeau</span><span class="price">${fmt(SHOP.giftWrap)}</span></div><div class="grand"><span>Total</span><span class="price" id="sTot"></span></div></div>
    <p class="err" id="coErr" hidden>Indiquez votre nom et votre quartier pour que nous puissions vous livrer.</p>
    <a class="btn btn-wa" id="waGo" href="#" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg>Commander sur WhatsApp</a>
    <p class="muted" style="font-size:12px;margin:0;text-align:center">Votre panier s'écrit dans WhatsApp. Si rien ne s'ouvre, copiez le message et envoyez-le au <span style="user-select:all">${SHOP.whatsappDisplay}</span>.</p>`;
  $$("[data-q]",b).forEach(x=>x.onclick=()=>{const i=cart[+x.dataset.q];i.qty+=+x.dataset.d;if(i.qty<1)cart.splice(+x.dataset.q,1);save();updateCounts();renderCart()});
  $$("[data-rm]",b).forEach(x=>x.onclick=()=>{cart.splice(+x.dataset.rm,1);save();updateCounts();renderCart()});
  $("#gift").onchange=e=>{co.gift=e.target.checked;store.set("checkout",co);renderCart()};
  $("#zone").onchange=e=>{co.zone=e.target.value;store.set("checkout",co);renderCart()};
  ["cName:name","cPlace:place","cNote:note"].forEach(s=>{const[id,k]=s.split(":");const el=$("#"+id);if(el)el.oninput=e=>{co[k]=e.target.value;store.set("checkout",co);refreshSummary()}});
  $("#copyMsg").onclick=()=>copy(message(),$("#preview"));
  $("#waGo").onclick=e=>{if(!co.name.trim()||!co.place.trim()){e.preventDefault();$("#coErr").hidden=false;(co.name.trim()?$("#cPlace"):$("#cName")).focus();return}$("#coErr").hidden=true;toast("Ouverture de WhatsApp…")};
  refreshSummary()}
function refreshSummary(){const T=totals();$("#sSub").textContent=fmt(T.sub);$("#sShip").textContent=T.ship===null?"Sur devis":T.ship===0?(T.z.id==="retrait"?"Retrait":"Offerte"):fmt(T.ship);$("#sGiftRow").hidden=!co.gift;$("#sTot").textContent=fmt(T.total);const m=message();$("#preview").textContent=m;$("#waGo").href=waLink(m)}

/* overlays */
let lastFocus=null;
function openLayer(el){lastFocus=document.activeElement;closeAll(true);el.inert=false;el.classList.add("on");el.setAttribute("aria-hidden","false");$("#scrim").classList.add("on");document.body.classList.add("locked");setTimeout(()=>{const f=el.querySelector("button,[href],input,select");f&&f.focus()},60)}
function closeAll(silent){$$(".drawer.on,.modal.on").forEach(e=>{e.classList.remove("on");e.setAttribute("aria-hidden","true");e.inert=true});$("#scrim").classList.remove("on");document.body.classList.remove("locked");if(!silent&&lastFocus)lastFocus.focus()}
$("#scrim").onclick=()=>closeAll();
document.addEventListener("click",e=>{if(e.target.closest("[data-close]"))closeAll()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});
$("#cartBtn").onclick=()=>{renderCart();openLayer($("#cart"))};
$("#wishBtn").onclick=()=>{renderWish();openLayer($("#wish"))};

/* product modal */
function related(p){const r=P.filter(x=>x.cat===p.cat&&x.id!==p.id).sort((a,b)=>(b.sub===p.sub)-(a.sub===p.sub)||a.rank-b.rank).slice(0,4);
  return `<div class="related"><h4>Vous aimerez aussi</h4><div class="related-row">${r.map(x=>`<button data-rel="${x.id}"><img src="/img/${x.id}.webp" alt="" loading="lazy">${esc(x.name)}<span class="price">${fmt(x.price)}</span></button>`).join("")}</div></div>`}
function openProduct(id){const p=P.find(x=>x.id===id);const sel=defaults(p);let qty=1;const s=$("#sheet");
  s.innerHTML=`<button class="close" data-close aria-label="Fermer"><svg><use href="#i-x"/></svg></button>
  <div class="m-gal" id="gal"><img src="/img/${p.id}.webp" alt="${esc(p.name)}"><span class="hint">Survolez pour zoomer</span></div>
  <div class="m-info">
    <div class="eyebrow">${CATS[p.cat].single} · monté main</div>
    <h2 id="mTitle">${p.name}</h2>
    <div class="price">${fmt(p.price)}</div>
    <p>${p.desc}</p>
    ${Object.entries(p.opts).map(([k,v])=>`<div><div class="step-label"><b>${k}</b>${k==="taille"&&p.cat==="baya"?`<a href="#tailles" class="muted" data-close style="font-size:13px">Mesurer mon tour</a>`:""}</div><div class="opts" data-opt="${k}">${v.map((x,i)=>`<button class="opt" aria-pressed="${i===0}" data-v="${esc(x)}">${x}</button>`).join("")}</div></div>`).join("")}
    ${p.perso?`<div><label class="lbl" for="mPerso">Prénom ou message en lettres (facultatif)</label><input class="inp" id="mPerso" maxlength="24" placeholder="Ex. Chioma, I choose me…"></div>`:""}
    ${p.cat==="baya"?`<div><label class="lbl" for="mWaist">Votre tour (cm)</label><input class="inp" id="mWaist" type="number" inputmode="decimal" placeholder="Ex. 82"></div>`:""}
    <div class="m-row"><div class="qty" style="margin:0"><button id="mMinus" aria-label="Moins">−</button><span id="mQty">1</span><button id="mPlus" aria-label="Plus">+</button></div>
      <button class="btn btn-gold" id="mAdd"><svg><use href="#i-bag"/></svg>Ajouter · <span class="price" id="mPrice">${fmt(p.price)}</span></button>
      <button class="icon-btn" data-wish="${p.id}" aria-pressed="${wish.includes(p.id)}" aria-label="Favori" style="border:1px solid var(--line)"><svg><use href="#i-heart"/></svg></button></div>
    <a class="ask" id="mAsk" href="#" target="_blank" rel="noopener">Demander une photo portée sur WhatsApp</a>
    ${related(p)}<dl class="specs"><dt>Matières</dt><dd>${p.mat}</dd><dt>Disponibilité</dt><dd>${p.stock<=3?`<span class="stock">${p.stock} en stock</span>, puis 3 jours sur commande`:"En stock, expédié sous 24 h"}</dd><dt>Entretien</dt><dd>Parfum avant les bijoux, jamais après</dd></dl>
  </div>`;
  $$("[data-opt]",s).forEach(g=>g.onclick=e=>{const b=e.target.closest(".opt");if(!b)return;$$(".opt",g).forEach(x=>x.setAttribute("aria-pressed",x===b));sel[g.dataset.opt]=b.dataset.v});
  const upd=()=>{$("#mQty").textContent=qty;$("#mPrice").textContent=fmt(p.price*qty)};
  $("#mMinus").onclick=()=>{qty=Math.max(1,qty-1);upd()};$("#mPlus").onclick=()=>{qty++;upd()};
  $("#mAdd").onclick=()=>{const o={...sel};const w=$("#mWaist");if(w&&w.value)o.taille=w.value+" cm";const pe=$("#mPerso");if(pe&&pe.value.trim())o.message="« "+pe.value.trim()+" »";addToCart(p,o,qty,$("#gal img"));closeAll()};
  $("[data-wish]",s).onclick=()=>toggleWish(p.id);
  $$("[data-rel]",s).forEach(b=>b.onclick=()=>{openProduct(b.dataset.rel);$("#sheet").scrollTop=0});
  $("#mAsk").href=waLink(`Bonjour ${SHOP.name}, pourriez-vous m'envoyer une photo portée de « ${p.name} » (${fmt(p.price)}) ? Merci !`);
  const g=$("#gal"),gi=$("img",g);g.onmousemove=e=>{const r=g.getBoundingClientRect();gi.style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`;gi.style.transform="scale(1.9)"};g.onmouseleave=()=>{gi.style.transform=""};
  openLayer($("#modal"))}
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeAll()});

/* atelier */
let at={kind:"bracelet",len:17,beads:[]};
const cv=$("#cv"),cx=cv.getContext("2d");
const beadMm=b=>b.type==="metal"?5:8;
const capacity=()=>at.len*10;
const used=()=>at.beads.reduce((s,id)=>s+beadMm(BEADS.find(b=>b.id===id)),0);
function shade(hex,amt){const n=parseInt(hex.slice(1),16);const f=v=>Math.max(0,Math.min(255,Math.round(v+(amt<0?v*amt:(255-v)*amt))));return"#"+[n>>16,n>>8&255,n&255].map(f).map(v=>v.toString(16).padStart(2,"0")).join("")}
function drawBead(ctx,x,y,r,b){ctx.save();ctx.translate(x,y);
  const g=ctx.createRadialGradient(-r*.35,-r*.4,r*.05,0,0,r);g.addColorStop(0,b.hi);g.addColorStop(.5,b.c);g.addColorStop(1,shade(b.c,b.type==="nacre"?-.3:-.5));ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
  if(b.type==="nacre"){const g2=ctx.createLinearGradient(-r,-r,r,r);g2.addColorStop(0,"rgba(255,190,230,.22)");g2.addColorStop(.5,"rgba(170,225,255,.18)");g2.addColorStop(1,"rgba(255,235,190,.25)");ctx.fillStyle=g2;ctx.fill()}
  if(b.type==="metal"){ctx.strokeStyle="rgba(120,85,20,.6)";ctx.lineWidth=r*.12;ctx.stroke()}
  ctx.fillStyle="rgba(255,255,255,.8)";ctx.beginPath();ctx.ellipse(-r*.36,-r*.4,r*.22,r*.13,-.6,0,Math.PI*2);ctx.fill();ctx.restore()}
let hitPts=[];
function isLight(){return getComputedStyle(document.documentElement).colorScheme.trim()==="light"}
function drawStage(){const W=cv.width,C=W/2;cx.clearRect(0,0,W,W);const light=isLight();
  const ink="33,28,23",gold="165,124,44";
  const R=W*.34;const col=at.kind==="collier";const cy=col?C-40:C;
  cx.save();cx.strokeStyle=`rgba(${gold},.35)`;cx.setLineDash([3,9]);cx.lineWidth=2;cx.beginPath();
  if(col)cx.ellipse(C,cy,R*.95,R*1.08,0,Math.PI*.1,Math.PI*.9);else cx.arc(C,cy,R,0,Math.PI*2);cx.stroke();cx.restore();
  const cap=capacity();let acc=0;hitPts=[];
  const pxmm=(col?Math.PI*.8*R*1.01:2*Math.PI*R)/cap;
  at.beads.forEach((id,i)=>{const b=BEADS.find(x=>x.id===id);const mm=beadMm(b);const mid=(acc+mm/2)/cap;acc+=mm;let x,y;
    if(col){const a=Math.PI*.1+Math.PI*.8*mid;x=C+Math.cos(a)*R*.95;y=cy+Math.sin(a)*R*1.08}else{const a=-Math.PI/2+mid*Math.PI*2;x=C+Math.cos(a)*R;y=cy+Math.sin(a)*R}
    const rr=Math.max(4,Math.min(mm/2*pxmm*.97,58));cx.save();cx.shadowColor="rgba(0,0,0,.4)";cx.shadowBlur=rr*.7;cx.shadowOffsetY=rr*.3;drawBead(cx,x,y,rr,b);cx.restore();hitPts.push({x,y,r:rr,i})});
  cx.textAlign="center";
  if(!at.beads.length){cx.fillStyle=`rgba(${ink},.6)`;cx.font="54px 'Playball', cursive";cx.fillText("Votre fil est prêt",C,C-6);cx.font="26px 'Arsenal', sans-serif";cx.fillText("Choisissez une perle pour commencer",C,C+40)}
  else{const ty=col?C-150:C;cx.fillStyle=`rgba(${ink},.9)`;cx.font="56px 'Playball', cursive";cx.fillText(KIND[at.kind].label.split(" ")[0],C,ty-4);cx.font="700 26px 'Arsenal', sans-serif";cx.fillStyle=`rgba(${gold},1)`;cx.fillText(at.len+" cm · "+Math.round(used()/cap*100)+" % rempli",C,ty+42)}
  $("#beadCount").textContent=at.beads.length+(at.beads.length>1?" perles":" perle");$("#full").hidden=used()<cap-4;$("#atTotal").textContent=fmt(atPrice())}
const atPrice=()=>at.beads.length?KIND[at.kind].base+at.beads.reduce((s,id)=>s+BEADS.find(b=>b.id===id).p,0):0;
function addBeadQuiet(id){const b=BEADS.find(x=>x.id===id);if(used()+beadMm(b)>capacity())return false;at.beads.push(id);return true}
function addBead(id){if(!addBeadQuiet(id)){toast("Le fil est complet. Allongez-le ou retirez une perle.");return}drawStage()}
$("#palette").innerHTML=BEADS.map(b=>`<button class="bead-btn" data-b="${b.id}" title="${b.name} · ${b.p} F"><canvas width="80" height="80"></canvas>${b.name.replace("Perle ","")}<em>${b.p} F</em></button>`).join("");
$$("#palette .bead-btn").forEach(btn=>{const b=BEADS.find(x=>x.id===btn.dataset.b);const c=btn.querySelector("canvas").getContext("2d");c.shadowColor="rgba(0,0,0,.35)";c.shadowBlur=8;c.shadowOffsetY=3;drawBead(c,40,38,b.type==="metal"?22:28,b);btn.onclick=()=>addBead(b.id)});
$$("#kind button").forEach(btn=>btn.onclick=()=>{at.kind=btn.dataset.k;const K=KIND[at.kind];$$("#kind button").forEach(x=>x.setAttribute("aria-pressed",x===btn));const r=$("#len");r.min=K.min;r.max=K.max;r.step=K.step;r.value=K.def;at.len=K.def;$("#lenOut").textContent=K.def+" cm";$("#lenHint").textContent=K.hint;while(used()>capacity())at.beads.pop();fillPattern();drawStage()});
$("#len").oninput=e=>{at.len=+e.target.value;$("#lenOut").textContent=at.len+" cm";while(used()>capacity())at.beads.pop();drawStage()};
$("#mUndo").onclick=()=>{at.beads.pop();drawStage()};
$("#mClear").onclick=()=>{at.beads=[];drawStage()};
$("#mAlt").onclick=()=>{const last=at.beads.slice(-2);const a=last[0]||"perle",b=last[1]&&last[1]!==a?last[1]:"or";at.beads=[];let k=0;while(addBeadQuiet(k%2?b:a))k++;drawStage()};
$("#mRand").onclick=()=>{const pals=[["perle","or","champagne"],["corail","or","perle"],["jade","or","perle"],["amethyste","rosee","perle"],["lagon","perle","or"],["onyx","or"]];const pal=pals[Math.floor(Math.random()*pals.length)];at.beads=[];let n=0;while(n<600&&addBeadQuiet(pal[Math.floor(Math.random()*pal.length)]))n++;drawStage()};
function fillPattern(){if(!at.beads.length)return;const m=[...at.beads];let i=0;while(i<800&&addBeadQuiet(m[i%m.length]))i++}
$("#mFill").onclick=()=>{if(!at.beads.length){toast("Ajoutez d'abord quelques perles");return}fillPattern();drawStage()};
cv.addEventListener("click",e=>{const r=cv.getBoundingClientRect();const x=(e.clientX-r.left)*cv.width/r.width,y=(e.clientY-r.top)*cv.height/r.height;const h=hitPts.find(p=>Math.hypot(p.x-x,p.y-y)<p.r+4);if(h){at.beads.splice(h.i,1);drawStage()}});
$("#atAdd").onclick=()=>{if(at.beads.length<5){toast("Ajoutez au moins 5 perles à votre création");return}
  const counts={};at.beads.forEach(id=>counts[id]=(counts[id]||0)+1);
  const detail="Composition : "+Object.entries(counts).map(([id,n])=>n+" × "+BEADS.find(b=>b.id===id).name.toLowerCase()).join(", ");
  const t=document.createElement("canvas");t.width=t.height=200;const tc=t.getContext("2d");tc.fillStyle="#f6f2ec";tc.fillRect(0,0,200,200);tc.drawImage(cv,0,0,200,200);
  const K=KIND[at.kind];addToCart({id:"atelier-"+Date.now(),name:K.label,price:atPrice(),img:t.toDataURL("image/jpeg",.8),custom:true,detail},{longueur:at.len+" cm"},1,null);
  $("#cartBtn").click()};
new ResizeObserver(()=>drawStage()).observe($("#stage"));
document.fonts&&document.fonts.ready.then(drawStage);
["perle","perle","or","perle","perle","or","corail","or"].forEach(addBeadQuiet);fillPattern();

/* waist helper */
function waistCalc(){const v=parseFloat($("#waist").value);const r=$("#waistRes");if(!v||v<40||v>160){r.textContent="Entrez un tour entre 40 et 160 cm.";return}
  const len=Math.round(v+3);r.innerHTML=`Longueur conseillée : <b>${len} cm</b> (environ ${Math.round(len*10/3.2)} rocailles). Avec nouage traditionnel, prévoyez 10 cm de plus pour les nœuds.`}
$("#waist").addEventListener("input",waistCalc);waistCalc();

/* contact */
$("#waNum").textContent=SHOP.whatsappDisplay;$("#copyNum").onclick=()=>copy(SHOP.whatsappDisplay,$("#waNum"));
$("#topWaNum").textContent=SHOP.whatsappDisplay;$("#topWa").href=waLink(`Bonjour ${SHOP.name}, j'ai une question sur vos bijoux.`);
$("#fab").href=waLink(`Bonjour ${SHOP.name}, j'ai une question sur vos accessoires en perles.`);

updateCounts();renderCart();renderWish();route();heroShow.start&&heroShow.start();
