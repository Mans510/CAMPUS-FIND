const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE_KEY = "campusfind-reports-v1";
const demoReports = [
 {id:"demo1",status:"found",title:"Blue water bottle",category:"Other",description:"Navy blue insulated bottle with a silver cap. Left near the study tables.",location:"Central Library",date:dateOffset(-1),contact:"demo@campus.edu",emoji:"🧴",bg:"bg-blue",created:Date.now()-1000},
 {id:"demo2",status:"lost",title:"Wireless earbuds case",category:"Electronics",description:"White charging case, small scratch on the front. Last seen after class.",location:"Block B, Room 204",date:dateOffset(-2),contact:"demo@campus.edu",emoji:"🎧",bg:"bg-lavender",created:Date.now()-2000},
 {id:"demo3",status:"found",title:"Set of keys",category:"Keys & Cards",description:"Three keys on a green keyring. Handed in after lunch.",location:"Cafeteria entrance",date:dateOffset(-1),contact:"demo@campus.edu",emoji:"🔑",bg:"bg-mint",created:Date.now()-3000},
 {id:"demo4",status:"lost",title:"Black laptop sleeve",category:"Bags",description:"Plain black 14-inch sleeve with a tiny orange tag inside.",location:"Computer Lab 3",date:dateOffset(-3),contact:"demo@campus.edu",emoji:"💼",bg:"bg-peach",created:Date.now()-4000},
 {id:"demo5",status:"found",title:"Notebook with sketches",category:"Books & Notes",description:"Cream notebook with pencil sketches on a few pages. No name on cover.",location:"Arts building lobby",date:dateOffset(-2),contact:"demo@campus.edu",emoji:"📓",bg:"bg-yellow",created:Date.now()-5000},
 {id:"demo6",status:"lost",title:"Silver wristwatch",category:"Other",description:"Simple silver watch with a dark face. May have slipped off during sports.",location:"Sports ground",date:dateOffset(-4),contact:"demo@campus.edu",emoji:"⌚",bg:"bg-pink",created:Date.now()-6000}
];
function dateOffset(days){const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function loadReports(){try{const saved=localStorage.getItem(STORAGE_KEY);return saved?JSON.parse(saved):demoReports}catch{return demoReports}}
let reports=loadReports(), activeFilter="all";
const emojiMap={"Electronics":"🎧","Keys & Cards":"🔑","Bags":"🎒","Clothing":"🧥","Books & Notes":"📓","Other":"🔎"};
const bgMap={"Electronics":"bg-lavender","Keys & Cards":"bg-mint","Bags":"bg-peach","Clothing":"bg-pink","Books & Notes":"bg-yellow","Other":"bg-blue"};
function safeText(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function displayDate(s){if(!s)return "Date not set";const d=new Date(s+"T12:00:00");return d.toLocaleDateString(undefined,{month:"short",day:"numeric"})}
function filteredReports(){const q=$("#search-input").value.trim().toLowerCase(),cat=$("#category-filter").value;return reports.filter(r=>(activeFilter==="all"||r.status===activeFilter)&&(cat==="all"||r.category===cat)&&(!q||[r.title,r.description,r.location,r.category].some(v=>String(v||"").toLowerCase().includes(q)))).sort((a,b)=>(b.created||0)-(a.created||0))}
function render(){
 const all=reports.length,lost=reports.filter(r=>r.status==="lost").length,found=reports.filter(r=>r.status==="found").length;
 $("#stat-total").textContent=all;$("#stat-found").textContent=found;$("#stat-returned").textContent=Math.max(0,12+reports.filter(r=>!String(r.id).startsWith("demo")).length);
 $("#count-all").textContent=all;$("#count-lost").textContent=lost;$("#count-found").textContent=found;
 const items=filteredReports();$("#results-label").textContent=`${items.length} ${items.length===1?"report":"reports"} found`;
 $("#listing-grid").innerHTML=items.map(r=>`<article class="item-card"><div class="item-visual ${safeText(r.bg||bgMap[r.category]||"bg-lavender")}"><span class="emoji">${safeText(r.emoji||emojiMap[r.category]||"🔎")}</span><span class="visual-sticker">${r.status==="lost"?"MISSING ITEM":"FOUND ITEM"} ✦</span></div><div class="item-content"><div class="item-meta"><span class="status-pill ${r.status==="lost"?"status-lost":"status-found"}">${r.status==="lost"?"Lost item":"Found item"}</span><span class="category-label">${safeText(r.category)}</span></div><h3>${safeText(r.title)}</h3><p class="item-description">${safeText(r.description)}</p><div class="item-details"><span class="place">${safeText(r.location)}</span><span class="date">${safeText(displayDate(r.date))}</span></div><button class="card-contact" data-contact="${safeText(r.id)}">${r.status==="lost"?"I may have found this ↗":"Help find the owner ↗"}</button></div></article>`).join("");
 $("#listing-grid").classList.toggle("hidden",items.length===0);$("#empty-state").classList.toggle("hidden",items.length!==0);
 $$(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));
}
function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),3000)}
function openModal(){ $("#report-modal").classList.remove("hidden");document.body.style.overflow="hidden";setTimeout(()=>$('#report-form [name="title"]').focus(),50)}
function closeModal(){ $("#report-modal").classList.add("hidden");document.body.style.overflow=""}
$$("[data-open-report]").forEach(b=>b.addEventListener("click",openModal));
$("#close-modal").addEventListener("click",closeModal);$("#cancel-modal").addEventListener("click",closeModal);
$("#report-modal").addEventListener("click",e=>{if(e.target===$("#report-modal"))closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#search-input").addEventListener("input",render);$("#category-filter").addEventListener("change",render);
$$(".filter-tab").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;render()}));
$("#clear-filters").addEventListener("click",()=>{$("#search-input").value="";$("#category-filter").value="all";activeFilter="all";render()});
$("#listing-grid").addEventListener("click",e=>{const b=e.target.closest("[data-contact]");if(!b)return;const r=reports.find(x=>x.id===b.dataset.contact);if(!r)return;if(String(r.id).startsWith("demo")){showToast("Demo listing: publish a real report to share a contact.");return}const subject=encodeURIComponent(`CampusFind: ${r.title}`),body=encodeURIComponent(`Hi, I'm contacting you about your CampusFind report: "${r.title}".\n\nItem: ${r.title}\nLocation: ${r.location}\n\nLet's arrange a safe handover on campus.`);if(r.contact.includes("@"))window.location.href=`mailto:${encodeURIComponent(r.contact)}?subject=${subject}&body=${body}`;else{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(r.contact).then(()=>showToast("Contact copied. Reach out respectfully!")).catch(()=>showToast(`Contact: ${r.contact}`));else showToast(`Contact: ${r.contact}`)}});
$("#report-date").value=dateOffset(0);
$("#report-form").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);const status=f.get("status"),category=f.get("category");const report={id:"report-"+Date.now(),status,title:f.get("title").trim(),category,description:f.get("description").trim(),location:f.get("location").trim(),date:f.get("date")||dateOffset(0),contact:f.get("contact").trim(),emoji:emojiMap[category]||"🔎",bg:bgMap[category]||"bg-lavender",created:Date.now()};reports.unshift(report);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(reports))}catch{}e.currentTarget.reset();$("#report-date").value=dateOffset(0);closeModal();activeFilter="all";$("#search-input").value="";$("#category-filter").value="all";render();document.querySelector("#browse").scrollIntoView({behavior:"smooth"});showToast("Your report has been published on this device!");});
$("#year").textContent=new Date().getFullYear();render();