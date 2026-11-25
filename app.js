const cfg=window.FINORA_CONFIG||{},
valid=cfg.SUPABASE_URL.startsWith("https://")&&
(
cfg.SUPABASE_ANON_KEY.startsWith("ey")||
cfg.SUPABASE_ANON_KEY.startsWith("sb_publishable_")
);
const $=id=>document.getElementById(id);let sb=null,items=[],rateEGPperIDR=null,display="IDR";
$("date").value=new Date().toISOString().slice(0,10);
function status(s){$("status").textContent=s}
function money(idr){let v=display==="EGP"?(rateEGPperIDR?idr*rateEGPperIDR:idr):idr;return new Intl.NumberFormat(display==="EGP"?"ar-EG":"id-ID",{style:"currency",currency:display,maximumFractionDigits:display==="EGP"?2:0}).format(v)}
function convertToIDR(amount,c){return c==="IDR"?amount:(rateEGPperIDR?amount/rateEGPperIDR:null)}
async function getRate(){try{let r=await fetch("https://open.er-api.com/v6/latest/IDR");let j=await r.json();if(j.result==="success"){rateEGPperIDR=j.rates.EGP;$("rate").textContent=`1 IDR ≈ ${rateEGPperIDR.toFixed(7)} EGP · 1 EGP ≈ ${(1/rateEGPperIDR).toLocaleString("id-ID",{maximumFractionDigits:2})} IDR`}}catch(e){$("rate").textContent="Kurs tidak tersedia; coba refresh"}}
async function authView(){const {data:{session}}=await sb.auth.getSession();$("auth").classList.toggle("hidden",!!session);$("dashboard").classList.toggle("hidden",!session);$("logout").classList.toggle("hidden",!session);if(session)await load()}
async function load(){status("Mengambil data…");let {data,error}=await sb.from("transactions").select("*").order("created_at",{ascending:false});if(error){status(error.message);return}items=data||[];render();status("Tersambung · tersimpan di cloud")}
function render(){let sum=t=>items.filter(x=>x.type===t).reduce((a,x)=>a+Number(x.amount_idr),0);let inc=sum("income"),exp=sum("expense"),sav=sum("savings"),em=sum("emergency");$("balance").textContent=money(inc-exp);$("income").textContent=money(inc);$("expense").textContent=money(exp);$("reserve").textContent=money(sav+em);$("transactions").innerHTML=items.length?items.map(x=>`<div class="item"><div><strong>${esc(x.title)}</strong><small>${esc(x.category||x.type)} · ${x.date||""} · ${x.currency}</small></div><div class="amt"><b>${money(Number(x.amount_idr))}</b><button class="secondary" onclick="del('${x.id}')">Hapus</button></div></div>`).join(""):'<p class="hint">Belum ada transaksi.</p>'}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
window.del=async id=>{if(!confirm("Hapus transaksi ini?"))return;let {error}=await sb.from("transactions").delete().eq("id",id);if(error)alert(error.message);else load()}
$("signin").onclick=async()=>{let {error}=await sb.auth.signInWithPassword({email:$("email").value,password:$("password").value});if(error)alert(error.message);else authView()};
$("signup").onclick=async()=>{let {error}=await sb.auth.signUp({email:$("email").value,password:$("password").value});if(error)alert(error.message);else alert("Pendaftaran berhasil. Jika diminta, cek email untuk verifikasi, lalu masuk.")};
$("logout").onclick=async()=>{await sb.auth.signOut();authView()};$("refresh").onclick=load;$("displayCurrency").onchange=e=>{display=e.target.value;render()};
$("transactionForm").onsubmit=async e=>{e.preventDefault();let amount=Number($("amount").value),currency=$("currency").value,idr=convertToIDR(amount,currency);if(idr===null){alert("Kurs belum tersedia. Refresh halaman dan coba lagi.");return}let {data:{user}}=await sb.auth.getUser();let payload={user_id:user.id,type:$("type").value,title:$("title").value,category:$("category").value||$("type").value,amount,currency,amount_idr:idr,date:$("date").value};let {error}=await sb.from("transactions").insert(payload);if(error){alert(error.message);return}e.target.reset();$("date").value=new Date().toISOString().slice(0,10);load()};
(async()=>{await getRate();if(!valid||!window.supabase){status("Konfigurasi belum diisi");alert("Isi URL dan anon key Supabase di file config.js terlebih dahulu.");return}sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);sb.auth.onAuthStateChange(()=>authView());await authView()})();