import { useState, useCallback, useEffect, useRef } from "react";

// ─── ADMIN ────────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "ulissescury@hotmail.com";
const API_URL = "https://cdz-collector-backend.onrender.com";

const api = {
  _token: () => { try { return JSON.parse(localStorage.getItem("ssv8_token")); } catch { return null; } },
  _headers: () => ({
    "Content-Type": "application/json",
    ...(api._token() ? { Authorization: `Bearer ${api._token()}` } : {})
  }),
  post: async (path, body) => {
    const r = await fetch(`${API_URL}${path}`, { method: "POST", headers: api._headers(), body: JSON.stringify(body) });
    return r.json();
  },
  put: async (path, body) => {
    const r = await fetch(`${API_URL}${path}`, { method: "PUT", headers: api._headers(), body: JSON.stringify(body) });
    return r.json();
  },
  get: async (path) => {
    const r = await fetch(`${API_URL}${path}`, { headers: api._headers() });
    return r.json();
  },
  delete: async (path) => {
    const r = await fetch(`${API_URL}${path}`, { method: "DELETE", headers: api._headers() });
    return r.json();
  },
};

// ─── PLANOS ──────────────────────────────────────────────────────────────────
const PLANS = {
  free:     { id:"free",     label:"Free",       color:"#888",    price:"Grátis",       icon:"🆓", tenhoLimit:3  },
  verified: { id:"verified", label:"Verificado", color:"#22c55e", price:"Grátis + docs", icon:"✓",  tenhoLimit:20 },
  basic:    { id:"basic",    label:"Basic",      color:"#38bdf8", price:"U$0,99/mês",   icon:"⭐", tenhoLimit:999 },
  plus:     { id:"plus",     label:"Plus",       color:"#ffd700", price:"U$5,99/mês",   icon:"🏆", tenhoLimit:999 },
};

const DEMO_USERS = [];

function LoginScreen({ onLogin, onGoRegister, onForgotPassword }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const handle=async ()=>{
    setErr("");setLoading(true);
    try {
      const data = await api.post("/auth/login", { login: email, password: pass });
      if (data.token && data.user) {
        localStorage.setItem("ssv8_token", JSON.stringify(data.token));
        onLogin(data.user);
      } else {
        setErr(data.error || "Email/usuário ou senha incorretos");
        setLoading(false);
      }
    } catch(e) {
      setErr("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  };
  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 20% 0%,#0d0a1e,#06060f 60%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:24,fontFamily:"'Rajdhani',sans-serif",color:"#dde"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Rajdhani:wght@500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{textAlign:"center",marginBottom:36}}>
        <img src="https://res.cloudinary.com/dr3sxytes/image/upload/app/icone_novo.png"
          alt="Colezzare"
          style={{width:160,height:160,borderRadius:"50%",objectFit:"cover",
            margin:"0 auto 14px",display:"block",
            boxShadow:"0 0 40px #ff8c0066"}}
          onError={e=>{e.target.style.display="none";}}/>
        <h1 style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:900,
          background:"linear-gradient(90deg,#ffd700,#ff8c00)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2}}>COLEZZARE</h1>
        <p style={{fontSize:10,color:"#555",letterSpacing:3,marginTop:4}}>COLLECTOR & MARKETPLACE</p>
      </div>
      <div style={{width:"100%",maxWidth:380,background:"#0d0d1e",
        border:"1px solid #ffffff0f",borderRadius:16,padding:26}}>
        <h2 style={{fontFamily:"'Cinzel',serif",fontSize:15,color:"#dde",marginBottom:22}}>Entrar na conta</h2>
        {err&&<div style={{background:"#ff444420",border:"1px solid #ff444455",borderRadius:8,
          padding:"9px 12px",marginBottom:14,fontSize:12,color:"#ff8888"}}>⚠️ {err}</div>}
        {[{l:"EMAIL OU USUÁRIO",v:email,s:setEmail,p:"seu usuario ou email",t:"text"}].map(f=>(
          <div key={f.l} style={{marginBottom:14}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>{f.l}</div>
            <input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} type={f.t}
              onKeyDown={e=>e.key==="Enter"&&handle()}
              style={{width:"100%",padding:"10px 13px",borderRadius:8,background:"#ffffff0a",
                border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none",
                fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box"}}/>
          </div>
        ))}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>SENHA</div>
          <div style={{position:"relative"}}>
            <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
              type={showPass?"text":"password"} onKeyDown={e=>e.key==="Enter"&&handle()}
              style={{width:"100%",padding:"10px 40px 10px 13px",borderRadius:8,background:"#ffffff0a",
                border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none",
                fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box"}}/>
            <button onClick={()=>setShowPass(p=>!p)} type="button"
              style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:14,padding:0}}>
              {showPass?"🙈":"👁"}
            </button>
          </div>
        </div>
        <button onClick={handle} disabled={loading} style={{width:"100%",padding:"12px",borderRadius:10,
          border:"none",cursor:"pointer",marginTop:6,
          background:"linear-gradient(90deg,#ffd700,#ff8c00)",
          color:"#000",fontSize:13,fontWeight:800,opacity:loading?0.7:1}}>
          {loading?"Entrando...":"Entrar"}
        </button>
        <div style={{textAlign:"center",marginTop:18,fontSize:12,color:"#555"}}>
          Não tem conta?{" "}
          <button onClick={onGoRegister} style={{background:"none",border:"none",
            color:"#ffd700",cursor:"pointer",fontSize:12,fontWeight:700}}>Criar conta grátis</button>
        </div>
        <div style={{textAlign:"center",marginTop:10,fontSize:11}}>
          <button onClick={onForgotPassword} style={{background:"none",border:"none",
            color:"#555",cursor:"pointer",fontSize:11,textDecoration:"underline"}}>
            Esqueci minha senha
          </button>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordScreen({ onBack }) {
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);
  const [err,   setErr]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!email) { setErr("Digite seu email"); return; }
    setErr(""); setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch(e) {
      setErr("Erro ao enviar. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 20% 0%,#0d0a1e,#06060f 60%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:24,fontFamily:"'Rajdhani',sans-serif",color:"#dde"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Rajdhani:wght@500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{textAlign:"center",marginBottom:36}}>
        <img src="https://res.cloudinary.com/dr3sxytes/image/upload/app/icone_novo.png"
          alt="Colezzare"
          style={{width:160,height:160,borderRadius:"50%",objectFit:"cover",
            margin:"0 auto 14px",display:"block",boxShadow:"0 0 40px #ff8c0066"}}
          onError={e=>{e.target.style.display="none";}}/>
        <h1 style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:900,
          background:"linear-gradient(90deg,#ffd700,#ff8c00)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2}}>COLEZZARE</h1>
        <p style={{fontSize:10,color:"#555",letterSpacing:3,marginTop:4}}>COLLECTOR & MARKETPLACE</p>
      </div>
      <div style={{width:"100%",maxWidth:380,background:"#0d0d1e",
        border:"1px solid #ffffff0f",borderRadius:16,padding:26}}>
        <h2 style={{fontFamily:"'Cinzel',serif",fontSize:15,color:"#dde",marginBottom:4}}>Recuperar senha</h2>
        <p style={{fontSize:11,color:"#555",marginBottom:20}}>Enviaremos um link para seu email</p>
        {sent ? (
          <div style={{textAlign:"center",padding:24,background:"#22c55e11",
            border:"1px solid #22c55e33",borderRadius:12}}>
            <div style={{fontSize:28,marginBottom:10}}>📧</div>
            <div style={{color:"#22c55e",fontWeight:700,fontSize:14}}>Email enviado!</div>
            <div style={{color:"#555",fontSize:12,marginTop:6}}>
              Verifique sua caixa de entrada e siga as instruções.
            </div>
            <button onClick={onBack} style={{marginTop:16,padding:"8px 20px",
              borderRadius:20,border:"1px solid #ffffff20",background:"transparent",
              color:"#aaa",fontSize:12,cursor:"pointer"}}>
              ← Voltar ao login
            </button>
          </div>
        ) : (
          <>
            {err && <div style={{background:"#ff444420",border:"1px solid #ff444455",borderRadius:8,
              padding:"9px 12px",marginBottom:14,fontSize:12,color:"#ff8888"}}>⚠️ {err}</div>}
            <div style={{marginBottom:13}}>
              <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>EMAIL</div>
              <input value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="seu@email.com" type="email"
                style={{width:"100%",padding:"11px 13px",borderRadius:9,
                  background:"#ffffff06",border:"1px solid #ffffff12",
                  color:"#dde",fontSize:13,outline:"none"}}/>
            </div>
            <button onClick={handle} disabled={loading}
              style={{width:"100%",padding:"13px",borderRadius:10,border:"none",
                cursor:"pointer",background:"linear-gradient(90deg,#ffd700,#ff8c00)",
                color:"#000",fontSize:13,fontWeight:800,opacity:loading?0.7:1,marginBottom:16}}>
              {loading?"Enviando...":"Enviar link de recuperação"}
            </button>
            <div style={{textAlign:"center"}}>
              <button onClick={onBack} style={{background:"none",border:"none",
                color:"#ffd700",cursor:"pointer",fontSize:12,fontWeight:700}}>
                ← Voltar ao login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RegisterScreen({ onRegister, onGoLogin }) {
  const [step,setStep]=useState(1);
  const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [username,setUsername]=useState("");
  const [usernameStatus,setUsernameStatus]=useState(null); // null | "checking" | "available" | "taken" | "invalid"
  const [pass,setPass]=useState(""); const [confirm,setConfirm]=useState("");
  const [showPass,setShowPass]=useState(false); const [showConfirm,setShowConfirm]=useState(false);
  const [plan,setPlan]=useState("free");
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);

  // Verificação de username em tempo real
  useEffect(()=>{
    if (!username) { setUsernameStatus(null); return; }
    if (username.length < 3) { setUsernameStatus("invalid"); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { setUsernameStatus("invalid"); return; }
    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const data = await api.get(`/auth/check-username/${username}`);
        setUsernameStatus(data.available ? "available" : "taken");
      } catch(e) { setUsernameStatus(null); }
    }, 600);
    return () => clearTimeout(timer);
  }, [username]);

  const next=async ()=>{
    if(step===1){
      if(!name||!email||!pass||!username){setErr("Preencha todos os campos");return;}
      if(pass.length<6){setErr("Senha deve ter ao menos 6 caracteres");return;}
      if(pass!==confirm){setErr("As senhas não coincidem");return;}
      if(usernameStatus!=="available"){setErr("Escolha um nome de usuário válido e disponível");return;}
      setErr("");setStep(2);
    } else if(step===2){
      setErr("");setLoading(true);
      try {
        const refCode = localStorage.getItem("ssv8_ref_code") || null;
        const data = await api.post("/auth/register", { name, email, username: username.toLowerCase(), password: pass, plan, verified: false, referred_by_code: refCode });
        if (data && !data.error) localStorage.removeItem("ssv8_ref_code");
        if (data.token && data.user) {
          localStorage.setItem("ssv8_token", JSON.stringify(data.token));
          onRegister(data.user);
        } else {
          setErr(data.error || "Erro ao criar conta");
        }
      } catch(e) { setErr("Erro de conexão. Tente novamente."); }
      setLoading(false);
    }
  };
  const planData=[
    {id:"free",  icon:"🆓",label:"Free",  price:"Grátis",    feats:["Ver catálogo","3 Tenho","Foto de capa","Ver ofertas/procura"]},
    {id:"basic", icon:"⭐",label:"Basic", price:"U$0,99/mês",feats:["Todas as fotos","Tenho/Quero ilimitado","Ver contatos","Anunciar venda","Match"]},
    {id:"plus",  icon:"🏆",label:"Plus",  price:"U$5,99/mês",feats:["Tudo do Basic","Anúncios em destaque","Mais visibilidade","Aparece primeiro"]},
  ];
  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 20% 0%,#0d0a1e,#06060f 60%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:24,fontFamily:"'Rajdhani',sans-serif",color:"#dde"}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <img src="https://res.cloudinary.com/dr3sxytes/image/upload/app/icone_novo.png"
            alt="Colezzare"
            style={{width:160,height:160,borderRadius:"50%",objectFit:"cover",
              margin:"0 auto 14px",display:"block",boxShadow:"0 0 40px #ff8c0066"}}
            onError={e=>{e.target.style.display="none";}}/>
          <h1 style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:900,
            background:"linear-gradient(90deg,#ffd700,#ff8c00)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2}}>COLEZZARE</h1>
          <p style={{fontSize:10,color:"#555",letterSpacing:3,marginTop:4}}>COLLECTOR & MARKETPLACE</p>
        </div>
        <div style={{display:"flex",gap:5,marginBottom:20}}>
          {["Dados","Plano","Verificação"].map((s,i)=>(
            <div key={s} style={{flex:1,height:3,borderRadius:3,
              background:step>i?"#ffd700":step===i+1?"#ffd70055":"#ffffff10"}}/>
          ))}
        </div>
        <div style={{background:"#0d0d1e",border:"1px solid #ffffff0f",borderRadius:16,padding:26}}>
          {step===1&&(
            <>
              <h2 style={{fontFamily:"'Cinzel',serif",fontSize:15,color:"#dde",marginBottom:4}}>Criar conta</h2>
              <p style={{fontSize:11,color:"#555",marginBottom:20}}>É grátis para começar</p>
              {err&&<div style={{background:"#ff444420",border:"1px solid #ff444455",borderRadius:8,
                padding:"9px 12px",marginBottom:14,fontSize:12,color:"#ff8888"}}>⚠️ {err}</div>}
              {[{l:"NOME COMPLETO",v:name,s:setName,p:"Seu nome completo",t:"text"},
                {l:"EMAIL",v:email,s:setEmail,p:"seu@email.com",t:"email"}].map(f=>(
                <div key={f.l} style={{marginBottom:13}}>
                  <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>{f.l}</div>
                  <input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} type={f.t}
                    autoComplete="off"
                    style={{width:"100%",padding:"10px 13px",borderRadius:8,background:"#ffffff0a",
                      border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none",
                      fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box"}}/>
                </div>
              ))}
              {/* USERNAME com verificação */}
              <div style={{marginBottom:13}}>
                <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>
                  NOME DE USUÁRIO
                </div>
                <div style={{position:"relative"}}>
                  <input value={username} onChange={e=>setUsername(e.target.value.replace(/\s/g,""))}
                    placeholder="ex: seiya_bronze" type="text" autoComplete="off"
                    style={{width:"100%",padding:"10px 36px 10px 13px",borderRadius:8,
                      background:"#ffffff0a",color:"#dde",fontSize:12,outline:"none",
                      fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box",
                      border:`1px solid ${usernameStatus==="available"?"#22c55e":usernameStatus==="taken"?"#f87171":"#ffffff15"}`}}/>
                  <div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:14}}>
                    {usernameStatus==="checking" && <span style={{color:"#555"}}>⏳</span>}
                    {usernameStatus==="available" && <span style={{color:"#22c55e"}}>✓</span>}
                    {usernameStatus==="taken"     && <span style={{color:"#f87171"}}>✗</span>}
                    {usernameStatus==="invalid"   && <span style={{color:"#f87171"}}>✗</span>}
                  </div>
                </div>
                {usernameStatus==="available" && <div style={{fontSize:10,color:"#22c55e",marginTop:3}}>✓ Disponível!</div>}
                {usernameStatus==="taken"     && <div style={{fontSize:10,color:"#f87171",marginTop:3}}>✗ Usuário já existe</div>}
                {usernameStatus==="invalid"   && <div style={{fontSize:10,color:"#f87171",marginTop:3}}>✗ Mín. 3 caracteres, apenas letras, números e _</div>}
              </div>
              {[{l:"SENHA",v:pass,s:setPass,show:showPass,toggle:()=>setShowPass(p=>!p)},
                {l:"CONFIRMAR SENHA",v:confirm,s:setConfirm,show:showConfirm,toggle:()=>setShowConfirm(p=>!p)}].map(f=>(
                <div key={f.l} style={{marginBottom:13}}>
                  <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>{f.l}</div>
                  <div style={{position:"relative"}}>
                    <input value={f.v} onChange={e=>f.s(e.target.value)}
                      placeholder={f.l==="SENHA"?"Mínimo 6 caracteres":"Repita a senha"}
                      type={f.show?"text":"password"}
                      autoComplete="new-password"
                      style={{width:"100%",padding:"10px 40px 10px 13px",borderRadius:8,background:"#ffffff0a",
                        border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none",
                        fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box"}}/>
                    <button onClick={f.toggle} type="button"
                      style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                        background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:14,padding:0}}>
                      {f.show?"🙈":"👁"}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
          {step===2&&(
            <>
              <h2 style={{fontFamily:"'Cinzel',serif",fontSize:15,color:"#dde",marginBottom:4}}>Escolha seu plano</h2>
              <p style={{fontSize:11,color:"#555",marginBottom:16}}>Pode mudar depois quando quiser</p>
              {planData.map(p=>(
                <div key={p.id} onClick={()=>setPlan(p.id)}
                  style={{border:`2px solid ${plan===p.id?PLANS[p.id].color:"#ffffff10"}`,
                    borderRadius:11,padding:"11px 13px",marginBottom:8,cursor:"pointer",
                    background:plan===p.id?`${PLANS[p.id].color}11`:"transparent",transition:"all 0.15s"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <span style={{fontSize:16}}>{p.icon}</span>
                      <span style={{fontSize:13,fontWeight:800,color:plan===p.id?PLANS[p.id].color:"#dde"}}>{p.label}</span>
                    </div>
                    <span style={{fontSize:11,color:plan===p.id?PLANS[p.id].color:"#888",fontWeight:700}}>{p.price}</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                    {p.feats.map(f=>(
                      <span key={f} style={{fontSize:9,background:"#ffffff08",borderRadius:4,
                        padding:"1px 5px",color:"#666"}}>✓ {f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
          {step===3&&(
            <>
              <h2 style={{fontFamily:"'Cinzel',serif",fontSize:15,color:"#22c55e",marginBottom:4}}>Verificação de identidade</h2>
              <p style={{fontSize:11,color:"#555",marginBottom:16}}>Necessário para acessar o marketplace</p>
              <div style={{background:"#22c55e11",border:"1px solid #22c55e33",borderRadius:10,
                padding:"14px",marginBottom:16,fontSize:12,color:"#4ade80",lineHeight:1.8}}>
                🪪 Foto do documento (RG, CNH ou Passaporte)<br/>🤳 Selfie segurando o documento<br/>
                <span style={{fontSize:10,color:"#166534"}}>⏱ Aprovação em até 24h úteis</span>
              </div>
              <div style={{background:"#ffffff06",borderRadius:8,padding:"10px 12px",
                fontSize:10,color:"#555",lineHeight:1.6}}>
                No app completo você fará o upload aqui. Nesta demo, sua conta será criada como <strong style={{color:"#22c55e"}}>Verificado (pendente)</strong>.
              </div>
            </>
          )}
          <button onClick={next} style={{width:"100%",padding:"12px",borderRadius:10,border:"none",
            cursor:"pointer",marginTop:16,background:"linear-gradient(90deg,#ffd700,#ff8c00)",
            color:"#000",fontSize:13,fontWeight:800}}>
            {step===1?"Continuar →":step===2&&plan!=="verified"?"Criar conta":step===2?"Continuar →":"Criar conta"}
          </button>
          <div style={{textAlign:"center",marginTop:14,fontSize:12,color:"#555"}}>
            Já tem conta?{" "}
            <button onClick={onGoLogin} style={{background:"none",border:"none",
              color:"#ffd700",cursor:"pointer",fontSize:12,fontWeight:700}}>Entrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpgradeModal({ requiredPlan, onClose, onUpgrade }) {
  const isVerifyCase = requiredPlan === "verify";
  const [selected, setSelected] = useState(requiredPlan === "verify" ? "verify" : requiredPlan || "basic");

  const PLAN_DATA = {
    verify: {
      color:"#22c55e", icon:"✓", label:"Verificado", price:"Grátis",
      sub:"Só precisa de documento + selfie",
      badge:null,
      benefits:[
        {ic:"🆓", t:"Totalmente grátis"},
        {ic:"🔢", t:"Limite de Tenho sobe de 3 para 20"},
        {ic:"✓",  t:"Badge verificado no perfil"},
        {ic:"🤝", t:"Mais credibilidade no marketplace"},
        {ic:"⏱️", t:"Aprovação em até 24h úteis"},
      ]
    },
    basic: {
      color:"#38bdf8", icon:"⭐", label:"Basic", price:"R$ 9,90/mês",
      sub:"Acesso completo ao marketplace",
      badge:"MAIS POPULAR",
      benefits:[
        {ic:"♾️", t:"Tenho e Quero ilimitados"},
        {ic:"📸", t:"Todas as fotos desbloqueadas"},
        {ic:"👀", t:"Ver contatos de compradores e vendedores"},
        {ic:"🏷️", t:"Anunciar peças para venda"},
        {ic:"🎯", t:"Sistema de match automático"},
        {ic:"📤", t:"Exportar coleção (galeria + planilha)"},
      ]
    },
    plus: {
      color:"#ffd700", icon:"🏆", label:"Plus", price:"R$ 19,90/mês",
      sub:"Para colecionadores sérios",
      badge:"PREMIUM",
      benefits:[
        {ic:"✅", t:"Tudo do Basic incluído"},
        {ic:"🔝", t:"Anúncios em destaque no topo"},
        {ic:"👁️", t:"Aparece primeiro nas buscas"},
        {ic:"🎯", t:"Mais visibilidade nos matches"},
        {ic:"📊", t:"Estatísticas avançadas da coleção"},
        {ic:"🏅", t:"Badge Plus exclusivo no perfil"},
      ]
    }
  };

  const plans = isVerifyCase ? ["verify"] : ["basic","plus"];
  const p = PLAN_DATA[selected];

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:3000,
      background:"#000000dd",backdropFilter:"blur(12px)",
      display:"flex",alignItems:"flex-end",justifyContent:"center",
      animation:"fadeIn 0.2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:480,
        background:"linear-gradient(180deg,#0d0d20,#080812)",
        borderRadius:"24px 24px 0 0",
        maxHeight:"92dvh",display:"flex",flexDirection:"column",
        animation:"slideUp 0.3s ease"}}>

        {/* Handle */}
        <div style={{flexShrink:0,display:"flex",justifyContent:"center",padding:"10px 0 4px"}}>
          <div style={{width:36,height:4,background:"#ffffff20",borderRadius:4}}/>
        </div>

        <div style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",
          touchAction:"pan-y",padding:"0 16px 32px"}}>

          {/* Header */}
          <div style={{textAlign:"center",marginBottom:20,paddingTop:4}}>
            <div style={{fontSize:36,marginBottom:6}}>{p.icon}</div>
            <h2 style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:900,
              color:p.color,marginBottom:4}}>
              {isVerifyCase?"Verificar Conta":`Planos Colezzare`}
            </h2>
            <p style={{fontSize:11,color:"#555"}}>
              {isVerifyCase?"Aumente seus limites gratuitamente":"Escolha o melhor plano para você"}
            </p>
          </div>

          {/* Seletor de plano — só se não for verify */}
          {!isVerifyCase && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {plans.map(planId=>{
                const pd = PLAN_DATA[planId];
                const isSel = selected===planId;
                return (
                  <button key={planId} onClick={()=>setSelected(planId)}
                    style={{padding:"12px 10px",borderRadius:14,cursor:"pointer",
                      textAlign:"center",position:"relative",
                      background:isSel?`${pd.color}18`:"#ffffff05",
                      outline:`2px solid ${isSel?pd.color:"#ffffff10"}`,
                      transition:"all 0.2s"}}>
                    {pd.badge && (
                      <div style={{position:"absolute",top:-8,left:"50%",
                        transform:"translateX(-50%)",
                        background:pd.color,color:planId==="basic"?"#000":"#000",
                        fontSize:8,fontWeight:900,padding:"2px 8px",
                        borderRadius:20,whiteSpace:"nowrap",letterSpacing:0.5}}>
                        {pd.badge}
                      </div>
                    )}
                    <div style={{fontSize:22,marginBottom:4}}>{pd.icon}</div>
                    <div style={{fontSize:13,fontWeight:900,color:isSel?pd.color:"#888",marginBottom:2}}>{pd.label}</div>
                    <div style={{fontSize:11,fontWeight:800,color:isSel?pd.color:"#555"}}>{pd.price}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Card do plano selecionado */}
          <div style={{background:`${p.color}0a`,border:`1px solid ${p.color}33`,
            borderRadius:16,padding:16,marginBottom:16}}>

            {/* Preço */}
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:26,fontWeight:900,color:p.color}}>{p.price}</div>
              <div style={{fontSize:11,color:"#555",marginTop:2}}>{p.sub}</div>
            </div>

            {/* Benefits */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {p.benefits.map((b,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"center",
                  padding:"8px 10px",background:"#ffffff05",borderRadius:10,
                  border:"1px solid #ffffff08"}}>
                  <span style={{fontSize:18,flexShrink:0}}>{b.ic}</span>
                  <span style={{fontSize:12,color:"#ccc",fontWeight:600,lineHeight:1.3}}>{b.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info verificação */}
          {isVerifyCase && (
            <div style={{background:"#22c55e0a",border:"1px solid #22c55e22",
              borderRadius:12,padding:12,marginBottom:16}}>
              <div style={{fontSize:11,color:"#22c55e",fontWeight:700,marginBottom:8}}>
                📋 O que você vai precisar enviar:
              </div>
              <div style={{display:"flex",gap:8}}>
                {[{ic:"🪪",t:"Documento\n(RG ou CNH)"},{ic:"🤳",t:"Selfie com\no documento"}].map(i=>(
                  <div key={i.ic} style={{flex:1,background:"#ffffff05",borderRadius:10,
                    padding:"10px 8px",textAlign:"center",border:"1px solid #22c55e22"}}>
                    <div style={{fontSize:24,marginBottom:4}}>{i.ic}</div>
                    <div style={{fontSize:10,color:"#4ade80",lineHeight:1.4,whiteSpace:"pre-line"}}>{i.t}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aviso pagamento */}
          {!isVerifyCase && (
            <div style={{fontSize:10,color:"#444",textAlign:"center",marginBottom:12,lineHeight:1.6}}>
              💳 O pagamento será processado manualmente por enquanto.<br/>
              Entre em contato pelo WhatsApp após clicar em contratar.
            </div>
          )}

          {/* Botões */}
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose}
              style={{flex:1,padding:"12px",borderRadius:12,
                border:"1px solid #ffffff15",background:"transparent",
                color:"#555",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              Agora não
            </button>
            <button onClick={()=>onUpgrade(selected)}
              style={{flex:2,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                fontSize:13,fontWeight:900,
                background:`linear-gradient(90deg,${p.color},${p.color}bb)`,
                color:"#000",
                boxShadow:`0 4px 20px ${p.color}44`}}>
              {isVerifyCase?"Verificar conta grátis →":selected==="basic"?"Contratar Basic →":"Contratar Plus →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── DADOS DAS FIGURAS ───────────────────────────────────────────────────────
const ALL_FIGURES = [

  // ══════════════════════════════════════════════════════════
  // CLOTH MYTH EX — Linha principal articulada com metal
  // ══════════════════════════════════════════════════════════

  // ── Cavaleiros de Ouro ──
  { id:"ex_mu", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736821/figures/ex_mu.jpg",         name:"Mu de Áries EX",              line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Nov 2012" },
  { id:"ex_aldebaran", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736827/figures/ex_aldebaran.jpg",  name:"Aldebaran de Touro EX",       line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Fev 2013" },
  { id:"ex_saga", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736834/figures/ex_saga.jpg",       name:"Saga de Gêmeos EX",           line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Mar 2013" },
  { id:"ex_deathmask", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736837/figures/ex_deathmask.jpg",  name:"Deathmask de Câncer EX",      line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Abr 2013" },
  { id:"ex_aiolia", img:"https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/1.jpg",     name:"Aiolia de Leão EX",           line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Jun 2013", gallery:["https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/1.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/2.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/3.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/4.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/5.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/6.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/7.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/8.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/9.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aiolia/10.jpg"] },
  { id:"ex_shaka", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736847/figures/ex_shaka.jpg",      name:"Shaka de Virgem EX",          line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Ago 2013" },
  { id:"ex_dohko", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736853/figures/ex_dohko.jpg",      name:"Dohko de Libra EX",           line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Out 2013" },
  { id:"ex_milo", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736857/figures/ex_milo.jpg",       name:"Milo de Escorpião EX",        line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Dez 2013" },
  { id:"ex_aiolos", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736862/figures/ex_aiolos.jpg",     name:"Aiolos de Sagitário EX",      line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Fev 2014" },
  { id:"ex_shura", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736866/figures/ex_shura.jpg",      name:"Shura de Capricórnio EX",     line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Abr 2014" },
  { id:"ex_camus", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736870/figures/ex_camus.jpg",      name:"Camus de Aquário EX",         line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Nov 2012" },
  { id:"ex_aphrodite", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736873/figures/ex_aphrodite.jpg",  name:"Afrodite de Peixes EX",       line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"EX",      lancamento:"Jan 2013" },
  { id:"ex_milo_oce",           name:"Milo de Escorpião EX OCE",    line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"OCE",     lancamento:"2022" },
  { id:"ex_aphrodite_oce_30th", name:"Afrodite EX OCE 30th",        line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"OCE",     lancamento:"2023" },
  { id:"ex_ofiuco_oce",         name:"Ofiuco EX OCE",               line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"OCE",     lancamento:"2024" },
  { id:"ex_odin_seiya",         name:"Seiya God Cloth Odin",        line:"Cloth Myth EX", saga:"Asgard",     tipo:"God Cloth",          ver:"EX",     lancamento:"2024" },
  { id:"cm_seiya_sagittarius",  name:"Seiya Sagitário Cloth Myth",  line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",    lancamento:"2023" },
  // Revivals
  { id:"ex_saga_rev", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736925/figures/ex_saga_rev.jpg",   name:"Saga de Gêmeos EX Revival",   line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2017" },
  { id:"ex_aiolia_rev", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736931/figures/ex_aiolia_rev.jpg", name:"Aiolia de Leão EX Revival",   line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2019" },
  { id:"ex_shaka_rev",  name:"Shaka EX Revival",            line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2020" },
  { id:"ex_mu_rev",     name:"Mu EX Revival",               line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2021" },
  { id:"ex_dohko_rev",  img:"https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_dohko_rev/1.jpg",  name:"Dohko EX Revival",            line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2021", gallery:["https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_dohko_rev/1.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_dohko_rev/2.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_dohko_rev/3.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_dohko_rev/4.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_dohko_rev/5.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_dohko_rev/6.jpg"] },
  { id:"ex_aiolos_rev", name:"Aiolos EX Revival",           line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2021" },
  { id:"ex_aldebaran_rev", img:"https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/1.jpg", name:"Aldebaran EX Revival",        line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2022", gallery:["https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/1.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/2.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/3.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/4.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/5.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/6.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/7.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/8.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/9.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/10.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/11.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/12.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_aldebaran_rev/13.jpg"] },
  { id:"ex_deathmask_rev",name:"Deathmask EX Revival",      line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2022" },
  { id:"ex_milo_rev",   img:"https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/1.jpg",   name:"Milo EX Revival",             line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2023", gallery:["https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/1.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/2.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/3.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/4.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/5.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/6.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/7.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/8.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/9.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/10.jpg","https://res.cloudinary.com/dr3sxytes/image/upload/figures/ex_milo_rev/11.jpg"] },
  { id:"ex_shura_rev",  name:"Shura EX Revival",            line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2023" },
  { id:"ex_camus_rev",  name:"Camus EX Revival",            line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2024" },
  { id:"ex_aphro_rev",  name:"Afrodite EX Revival",         line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"Revival", lancamento:"2024" },
  // OCE
  { id:"ex_saga_oce",   name:"Saga de Gêmeos EX OCE",       line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"OCE",     lancamento:"2018" },
  { id:"ex_shaka_oce",  name:"Shaka EX OCE",                line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"OCE",     lancamento:"2019" },
  { id:"ex_aiolia_oce", name:"Aiolia EX OCE",               line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Ouro", ver:"OCE",     lancamento:"2020" },
  // Soul of Gold
  { id:"ex_mu_sog",     name:"Mu EX Soul of Gold",          line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2015" },
  { id:"ex_aldeb_sog",  name:"Aldebaran EX Soul of Gold",   line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2015" },
  { id:"ex_saga_sog",   name:"Saga EX Soul of Gold",        line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2015" },
  { id:"ex_deathmask_sog",name:"Deathmask EX Soul of Gold", line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2015" },
  { id:"ex_aiolia_sog", name:"Aiolia EX Soul of Gold",      line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2015" },
  { id:"ex_shaka_sog",  name:"Shaka EX Soul of Gold",       line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2015" },
  { id:"ex_dohko_sog",  name:"Dohko EX Soul of Gold",       line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2015" },
  { id:"ex_milo_sog",   name:"Milo EX Soul of Gold",        line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2016" },
  { id:"ex_aiolos_sog", name:"Aiolos EX Soul of Gold",      line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2016" },
  { id:"ex_shura_sog",  name:"Shura EX Soul of Gold",       line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2016" },
  { id:"ex_camus_sog",  name:"Camus EX Soul of Gold",       line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2016" },
  { id:"ex_aphro_sog",  name:"Afrodite EX Soul of Gold",    line:"Cloth Myth EX", saga:"Soul of Gold",tipo:"Cavaleiros de Ouro",ver:"SoG",     lancamento:"2016" },

  // ── Cavaleiros de Bronze ──
  { id:"ex_seiya_v1", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736795/figures/ex_seiya_v1.jpg",   name:"Seiya de Pégaso EX V1",       line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",     lancamento:"Nov 2012" },
  { id:"ex_shiryu_v1", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736800/figures/ex_shiryu_v1.jpg",  name:"Shiryu de Dragão EX V1",      line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",     lancamento:"Jan 2013" },
  { id:"ex_hyoga_v1", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736805/figures/ex_hyoga_v1.jpg",   name:"Hyoga de Cisne EX V1",        line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",     lancamento:"Mar 2013" },
  { id:"ex_shun_v1", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736809/figures/ex_shun_v1.jpg",    name:"Shun de Andrômeda EX V1",     line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",     lancamento:"Mai 2013" },
  { id:"ex_ikki_v1", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736815/figures/ex_ikki_v1.jpg",    name:"Ikki de Fênix EX V1",         line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",     lancamento:"Jul 2013" },
  { id:"ex_seiya_v2",   name:"Seiya de Pégaso EX V2",       line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V2",     lancamento:"2014" },
  { id:"ex_shiryu_v2",  name:"Shiryu de Dragão EX V2",      line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V2",     lancamento:"2014" },
  { id:"ex_hyoga_v2",   name:"Hyoga de Cisne EX V2",        line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V2",     lancamento:"2015" },
  { id:"ex_shun_v2",    name:"Shun de Andrômeda EX V2",     line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V2",     lancamento:"2015" },
  { id:"ex_ikki_v2",    name:"Ikki de Fênix EX V2",         line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V2",     lancamento:"2016" },
  { id:"ex_seiya_v3",   name:"Seiya de Pégaso EX Final Bronze", line:"Cloth Myth EX",saga:"Santuário",tipo:"Cavaleiros de Bronze",ver:"V3",    lancamento:"2023" },
  { id:"ex_shiryu_v3",  name:"Shiryu de Dragão EX Final Bronze",line:"Cloth Myth EX",saga:"Santuário",tipo:"Cavaleiros de Bronze",ver:"V3",    lancamento:"2023" },
  { id:"ex_hyoga_v3",   name:"Hyoga de Cisne EX Final Bronze",  line:"Cloth Myth EX",saga:"Santuário",tipo:"Cavaleiros de Bronze",ver:"V3",    lancamento:"2024" },
  { id:"ex_shun_v3",    name:"Shun de Andrômeda EX Final Bronze",line:"Cloth Myth EX",saga:"Santuário",tipo:"Cavaleiros de Bronze",ver:"V3",   lancamento:"2024" },
  { id:"ex_ikki_v3",    name:"Ikki de Fênix EX Final Bronze",   line:"Cloth Myth EX",saga:"Santuário",tipo:"Cavaleiros de Bronze",ver:"V3",    lancamento:"2025" },

  // ── God Cloth ──
  { id:"ex_seiya_god", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736879/figures/ex_seiya_god.jpg",  name:"Seiya God Cloth EX",          line:"Cloth Myth EX", saga:"Hades",      tipo:"God Cloth",          ver:"EX",     lancamento:"2013" },
  { id:"cm_shiryu_god", name:"Shiryu God Cloth EX",         line:"Cloth Myth EX", saga:"Hades",      tipo:"God Cloth",          ver:"EX",     lancamento:"2013" },
  { id:"ex_hyoga_god",  name:"Hyoga God Cloth EX",          line:"Cloth Myth EX", saga:"Hades",      tipo:"God Cloth",          ver:"EX",     lancamento:"2014" },
  { id:"ex_shun_god", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736935/figures/ex_shun_god.jpg",   name:"Shun God Cloth EX",           line:"Cloth Myth EX", saga:"Hades",      tipo:"God Cloth",          ver:"EX",     lancamento:"2025" },
  { id:"ex_ikki_god",   name:"Ikki God Cloth EX",           line:"Cloth Myth EX", saga:"Hades",      tipo:"God Cloth",          ver:"EX",     lancamento:"2014" },

  // ── Divinos / Deuses ──
  { id:"ex_athena", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736885/figures/ex_athena.jpg",     name:"Atena EX",                    line:"Cloth Myth EX", saga:"Santuário",  tipo:"Divinos",            ver:"EX",     lancamento:"2013" },
  { id:"ex_poseidon", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736893/figures/ex_poseidon.jpg",   name:"Poseidon Imperador EX",       line:"Cloth Myth EX", saga:"Poseidon",   tipo:"Divinos",            ver:"EX",     lancamento:"2014" },
  { id:"ex_poseidon_oce", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736943/figures/ex_poseidon_oce.jpg",name:"Poseidon Imperador EX OCE",  line:"Cloth Myth EX", saga:"Poseidon",   tipo:"Divinos",            ver:"OCE",    lancamento:"2025" },
  { id:"ex_hades", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736889/figures/ex_hades.jpg",      name:"Hades EX",                    line:"Cloth Myth EX", saga:"Hades",      tipo:"Divinos",            ver:"EX",     lancamento:"2015" },
  { id:"ex_hades_oce",  name:"Hades EX OCE",                line:"Cloth Myth EX", saga:"Hades",      tipo:"Divinos",            ver:"OCE",    lancamento:"2021" },

  // ── Espectrais / Hades ──
  { id:"ex_radam", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736900/figures/ex_radam.jpg",      name:"Radamanthys de Wyvern EX",    line:"Cloth Myth EX", saga:"Hades",      tipo:"Espectrais",         ver:"EX",     lancamento:"2014" },
  { id:"ex_minos",      name:"Minos de Griffon EX",         line:"Cloth Myth EX", saga:"Hades",      tipo:"Espectrais",         ver:"EX",     lancamento:"2015" },
  { id:"ex_aiacos",     name:"Aiacos de Garuda EX",         line:"Cloth Myth EX", saga:"Hades",      tipo:"Espectrais",         ver:"EX",     lancamento:"2016" },
  { id:"ex_lune",       name:"Pandora EX",                  line:"Cloth Myth EX", saga:"Hades",      tipo:"Espectrais",         ver:"EX",     lancamento:"2017" },
  { id:"ex_thanatos",   name:"Thanatos EX",                 line:"Cloth Myth EX", saga:"Hades",      tipo:"Espectrais",         ver:"EX",     lancamento:"2018" },
  { id:"ex_hypnos",     name:"Hypnos EX",                   line:"Cloth Myth EX", saga:"Hades",      tipo:"Espectrais",         ver:"EX",     lancamento:"2019" },

  // ── Marinas / Poseidon ──
  { id:"ex_sorrento", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736904/figures/ex_sorrento.jpg",   name:"Sorrento de Sirene EX",       line:"Cloth Myth EX", saga:"Poseidon",   tipo:"Marinas",            ver:"EX",     lancamento:"2015" },
  { id:"ex_kanon",      name:"Kanon de Sea Dragon EX",      line:"Cloth Myth EX", saga:"Poseidon",   tipo:"Marinas",            ver:"EX",     lancamento:"2016" },
  { id:"ex_isaak",      name:"Isaak de Kraken EX",          line:"Cloth Myth EX", saga:"Poseidon",   tipo:"Marinas",            ver:"EX",     lancamento:"2017" },

  // ── God Warriors / Asgard ──
  { id:"ex_siegfried", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736910/figures/ex_siegfried.jpg",  name:"Siegfried de Dubhe Alpha EX", line:"Cloth Myth EX", saga:"Asgard",     tipo:"God Warriors",       ver:"EX",     lancamento:"2014" },
  { id:"ex_hagen",      name:"Hagen de Merak Beta EX",      line:"Cloth Myth EX", saga:"Asgard",     tipo:"God Warriors",       ver:"EX",     lancamento:"2015" },
  { id:"cm_epsilion_fenrir", name:"Fenrir de Alioth Epsilon EX", line:"Cloth Myth EX", saga:"Asgard",     tipo:"God Warriors",       ver:"EX",     lancamento:"2026" },
  { id:"ex_mime",       name:"Mime de Benetnasch Eta EX",   line:"Cloth Myth EX", saga:"Asgard",     tipo:"God Warriors",       ver:"EX",     lancamento:"2016" },

  // ── Cavaleiros de Prata ──
  { id:"ex_marin", img:"https://res.cloudinary.com/dr3sxytes/image/upload/v1779736919/figures/ex_marin.jpg",      name:"Marin de Águia EX",           line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Prata",ver:"EX",     lancamento:"2016" },
  { id:"ex_shaina",     name:"Shaina de Ofiúco EX",         line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Prata",ver:"EX",     lancamento:"2017" },
  { id:"ex_misty",      name:"Misty de Lácerta EX",         line:"Cloth Myth EX", saga:"Santuário",  tipo:"Cavaleiros de Prata",ver:"EX",     lancamento:"2018" },

  // ══════════════════════════════════════════════════════════
  // CLOTH MYTH (Original 2003–2014) — versão não-EX
  // ══════════════════════════════════════════════════════════
  { id:"cm_seiya_v1",   name:"Seiya de Pégaso V1",          line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",    lancamento:"2003" },
  { id:"cm_shiryu_v1",  name:"Shiryu de Dragão V1",         line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",    lancamento:"2003" },
  { id:"cm_hyoga_v1",   name:"Hyoga de Cisne V1",           line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",    lancamento:"2003" },
  { id:"cm_shun_v1",    name:"Shun de Andrômeda V1",        line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",    lancamento:"2003" },
  { id:"cm_ikki_v1",    name:"Ikki de Fênix V1",            line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V1",    lancamento:"2003" },
  { id:"cm_seiya_v2",   name:"Seiya de Pégaso V2",          line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"V2",    lancamento:"2007" },
  { id:"cm_seiya_god",  name:"Seiya God Cloth",             line:"Cloth Myth",    saga:"Hades",      tipo:"God Cloth",           ver:"EX",    lancamento:"2009" },
  { id:"cm_mu",         name:"Mu de Áries",                 line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2005" },
  { id:"cm_aldebaran",  name:"Aldebaran de Touro",          line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2005" },
  { id:"cm_saga",       name:"Saga de Gêmeos",              line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2005" },
  { id:"cm_deathmask",  name:"Deathmask de Câncer",         line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2005" },
  { id:"cm_aiolia",     name:"Aiolia de Leão",              line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2005" },
  { id:"cm_shaka",      name:"Shaka de Virgem",             line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2004" },
  { id:"cm_dohko",      name:"Dohko de Libra",              line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2006" },
  { id:"cm_milo",       name:"Milo de Escorpião",           line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2006" },
  { id:"cm_aiolos",     name:"Aiolos de Sagitário",         line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2006" },
  { id:"cm_shura",      name:"Shura de Capricórnio",        line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2006" },
  { id:"cm_camus",      name:"Camus de Aquário",            line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2006" },
  { id:"cm_aphrodite",  name:"Afrodite de Peixes",          line:"Cloth Myth",    saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"V1",    lancamento:"2006" },
  { id:"cm_radam",      name:"Radamanthys de Wyvern",       line:"Cloth Myth",    saga:"Hades",      tipo:"Espectrais",          ver:"V1",    lancamento:"2005" },
  { id:"cm_myu",        name:"Myu do Papillon",             line:"Cloth Myth",    saga:"Hades",      tipo:"Espectrais",          ver:"V1",    lancamento:"2005" },
  { id:"cm_gigant",     name:"Gigant do Ciclope",           line:"Cloth Myth",    saga:"Hades",      tipo:"Espectrais",          ver:"V1",    lancamento:"2006" },
  { id:"cm_sorrento",   name:"Sorrento de Sirene",          line:"Cloth Myth",    saga:"Poseidon",   tipo:"Marinas",             ver:"V1",    lancamento:"2007" },
  { id:"cm_kanon",      name:"Kanon de Sea Dragon",         line:"Cloth Myth",    saga:"Poseidon",   tipo:"Marinas",             ver:"V1",    lancamento:"2008" },
  { id:"cm_poseidon",   name:"Poseidon",                    line:"Cloth Myth",    saga:"Poseidon",   tipo:"Divinos",             ver:"V1",    lancamento:"2007" },
  { id:"cm_hades",      name:"Hades",                       line:"Cloth Myth",    saga:"Hades",      tipo:"Divinos",             ver:"V1",    lancamento:"2008" },
  { id:"cm_athena",     name:"Atena",                       line:"Cloth Myth",    saga:"Santuário",  tipo:"Divinos",             ver:"V1",    lancamento:"2004" },
  { id:"cm_siegfried",  name:"Siegfried de Dubhe Alpha",    line:"Cloth Myth",    saga:"Asgard",     tipo:"God Warriors",        ver:"V1",    lancamento:"2007" },

  // ══════════════════════════════════════════════════════════
  // CLOTH MYTH APPENDIX (2007–2014) — meio-corpo / Pandora Box
  // ══════════════════════════════════════════════════════════
  { id:"app_seiya",     name:"Seiya Appendix",              line:"Cloth Myth Appendix", saga:"Santuário", tipo:"Cavaleiros de Bronze",ver:"—", lancamento:"2007" },
  { id:"app_shiryu",    name:"Shiryu Appendix",             line:"Cloth Myth Appendix", saga:"Santuário", tipo:"Cavaleiros de Bronze",ver:"—", lancamento:"2007" },
  { id:"app_hyoga",     name:"Hyoga Appendix",              line:"Cloth Myth Appendix", saga:"Santuário", tipo:"Cavaleiros de Bronze",ver:"—", lancamento:"2007" },
  { id:"app_shun",      name:"Shun Appendix",               line:"Cloth Myth Appendix", saga:"Santuário", tipo:"Cavaleiros de Bronze",ver:"—", lancamento:"2007" },
  { id:"app_ikki",      name:"Ikki Appendix",               line:"Cloth Myth Appendix", saga:"Santuário", tipo:"Cavaleiros de Bronze",ver:"—", lancamento:"2008" },
  { id:"app_saga",      name:"Saga Appendix",               line:"Cloth Myth Appendix", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"—", lancamento:"2008" },
  { id:"app_shaka",     name:"Shaka Appendix",              line:"Cloth Myth Appendix", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"—", lancamento:"2008" },
  { id:"app_aiolia",    name:"Aiolia Appendix",             line:"Cloth Myth Appendix", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"—", lancamento:"2009" },
  { id:"app_milo",      name:"Milo Appendix",               line:"Cloth Myth Appendix", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"—", lancamento:"2009" },
  { id:"app_radam",     name:"Radamanthys Appendix",        line:"Cloth Myth Appendix", saga:"Hades",     tipo:"Espectrais",          ver:"—", lancamento:"2010" },
  { id:"app_ikki_hades",name:"Ikki Surplice Appendix",      line:"Cloth Myth Appendix", saga:"Hades",     tipo:"Surplice",            ver:"—", lancamento:"2011" },
  { id:"app_seiya_god", name:"Seiya God Cloth Appendix",    line:"Cloth Myth Appendix", saga:"Hades",     tipo:"God Cloth",           ver:"—", lancamento:"2012" },

  // ══════════════════════════════════════════════════════════
  // CLOTH CROWN (2011–2013) — escala maior 30cm
  // ══════════════════════════════════════════════════════════
  { id:"crown_seiya",   name:"Seiya Cloth Crown",           line:"Cloth Crown",   saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"—",     lancamento:"2011" },
  { id:"crown_shiryu",  name:"Shiryu Cloth Crown",          line:"Cloth Crown",   saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"—",     lancamento:"2011" },
  { id:"crown_saga",    name:"Saga de Gêmeos Cloth Crown",  line:"Cloth Crown",   saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"—",     lancamento:"2012" },
  { id:"crown_aiolia",  name:"Aiolia de Leão Cloth Crown",  line:"Cloth Crown",   saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"—",     lancamento:"2012" },
  { id:"crown_shaka",   name:"Shaka de Virgem Cloth Crown", line:"Cloth Crown",   saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"—",     lancamento:"2013" },

  // ══════════════════════════════════════════════════════════
  // SAINT CLOTH LEGEND (2014–2017) — Legend of Sanctuary / Next Dimension
  // ══════════════════════════════════════════════════════════
  { id:"leg_saga",      name:"Saga Saint Cloth Legend",     line:"Saint Cloth Legend", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"—",  lancamento:"2014" },
  { id:"leg_aiolia",    name:"Aiolia Saint Cloth Legend",   line:"Saint Cloth Legend", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"—",  lancamento:"2014" },
  { id:"leg_shaka",     name:"Shaka Saint Cloth Legend",    line:"Saint Cloth Legend", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"—",  lancamento:"2014" },
  { id:"leg_seiya",     name:"Seiya Saint Cloth Legend",    line:"Saint Cloth Legend", saga:"Santuário", tipo:"Cavaleiros de Bronze",ver:"—",  lancamento:"2014" },
  { id:"leg_dohko_nd",  name:"Dohko Next Dimension Legend", line:"Saint Cloth Legend", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"—",  lancamento:"2017" },

  // ══════════════════════════════════════════════════════════
  // FIGUARTS ZERO (2013–) — estátua PVC sem articulação
  // ══════════════════════════════════════════════════════════
  { id:"fz_seiya",      name:"Seiya Figuarts Zero",         line:"Figuarts Zero", saga:"Santuário",  tipo:"Cavaleiros de Bronze",ver:"—",     lancamento:"2013" },
  { id:"fz_saga",       name:"Saga Figuarts Zero",          line:"Figuarts Zero", saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"—",     lancamento:"2014" },
  { id:"fz_shaka",      name:"Shaka Figuarts Zero",         line:"Figuarts Zero", saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"—",     lancamento:"2014" },
  { id:"fz_aiolia",     name:"Aiolia Figuarts Zero",        line:"Figuarts Zero", saga:"Santuário",  tipo:"Cavaleiros de Ouro",  ver:"—",     lancamento:"2015" },
  { id:"fz_seiya_tm",   name:"Seiya Figuarts Zero Touche Métallique", line:"Figuarts Zero", saga:"Santuário", tipo:"Cavaleiros de Bronze",ver:"TM", lancamento:"2020" },
  { id:"fz_saga_tm",    name:"Saga Figuarts Zero Touche Métallique",  line:"Figuarts Zero", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"TM", lancamento:"2021" },

  // ══════════════════════════════════════════════════════════
  // DIE-CAST VINTAGE (1987–2006)
  // ══════════════════════════════════════════════════════════
  // Cavaleiros de Ouro
  { id:"dc_mu_de_aries",                      name:"Mu de Áries",                       line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_aldebaran_de_touro",               name:"Aldebaran de Touro",                line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_saga_de_gemeos",                   name:"Saga de Gêmeos",                    line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_mascara_da_morte_de_cancer",       name:"Máscara da Morte de Câncer",        line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_aiolia_de_leao",                   name:"Aiolia de Leão",                    line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_shaka_de_virgem",                  name:"Shaka de Virgem",                   line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_dohko_de_libra",                   name:"Dohko de Libra",                    line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_milo_de_escorpiao",                name:"Milo de Escorpião",                 line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_aiolos_de_sagitario",              name:"Aiolos de Sagitário",               line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_shura_de_capricornio",             name:"Shura de Capricórnio",              line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_camus_de_aquario",                 name:"Camus de Aquário",                  line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_afrodite_de_peixes",               name:"Afrodite de Peixes",                line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Ouro",  ver:"Vintage", lancamento:"1987" },
  // Cavaleiros de Bronze
  { id:"dc_seiya_de_sagitario",               name:"Seiya de Sagitário",                line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Bronze", ver:"Vintage", lancamento:"1988" },
  { id:"dc_shiryu_de_dragao",                 name:"Shiryu de Dragão",                  line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Bronze", ver:"Vintage", lancamento:"1988" },
  { id:"dc_hyoga_de_cisne",                   name:"Hyoga de Cisne",                    line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Bronze", ver:"Vintage", lancamento:"1988" },
  { id:"dc_shun_de_andromeda",                name:"Shun de Andrômeda",                 line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Bronze", ver:"Vintage", lancamento:"1988" },
  { id:"dc_ikki_de_fenix",                    name:"Ikki de Fênix",                     line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Bronze", ver:"Vintage", lancamento:"1988" },
  { id:"dc_pegaso_negro",                     name:"Pégaso Negro",                      line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Black Saints",         ver:"Vintage", lancamento:"1987" },
  { id:"dc_dragao_negro",                     name:"Dragão Negro",                      line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Black Saints",         ver:"Vintage", lancamento:"1987" },
  { id:"dc_cisne_negro",                      name:"Cisne Negro",                       line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Black Saints",         ver:"Vintage", lancamento:"1987" },
  { id:"dc_andromeda_negro",                  name:"Andromeda Negro",                   line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Black Saints",         ver:"Vintage", lancamento:"1987" },
  { id:"dc_fenix_negro",                      name:"Fênix Negro",                       line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Black Saints",         ver:"Vintage", lancamento:"1987" },
  // Cavaleiros de Prata
  { id:"dc_marin_de_aguia",                   name:"Marin de Águia",                    line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Prata",  ver:"Vintage", lancamento:"1987" },
  { id:"dc_shaina_de_ofiuco",                 name:"Shaina de Ofiúco",                  line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Prata",  ver:"Vintage", lancamento:"2006" },
  { id:"dc_misty_de_lagarto",                 name:"Misty de Lagarto",                  line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Prata",  ver:"Vintage", lancamento:"2006" },
  { id:"dc_angol_de_perseu",                  name:"Angol de Perseu",                   line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Prata",  ver:"Vintage", lancamento:"2006" },
  // Asgard
  { id:"dc_alpha_siegfried_de_dubhe",         name:"Alpha Siegfried de Dubhe",          line:"Vintage (Die-Cast)", saga:"Asgard",    tipo:"God Warriors",         ver:"Vintage", lancamento:"1987" },
  { id:"dc_beta_hagen_de_merak",              name:"Beta Hagen de Merak",               line:"Vintage (Die-Cast)", saga:"Asgard",    tipo:"God Warriors",         ver:"Vintage", lancamento:"1987" },
  { id:"dc_delta_alberich_de_megrez",         name:"Delta Alberich de Megrez",          line:"Vintage (Die-Cast)", saga:"Asgard",    tipo:"God Warriors",         ver:"Vintage", lancamento:"1988" },
  { id:"dc_epsilon_fenrir_de_alioth",         name:"Epsilon Fenrir de Alioth",          line:"Vintage (Die-Cast)", saga:"Asgard",    tipo:"God Warriors",         ver:"Vintage", lancamento:"1987" },
  { id:"dc_eta_mime_de_benetnash",            name:"Eta Mime de Benetnash",             line:"Vintage (Die-Cast)", saga:"Asgard",    tipo:"God Warriors",         ver:"Vintage", lancamento:"1988" },
  { id:"dc_gamma_thor_de_phecda",             name:"Gamma Thor de Phecda",              line:"Vintage (Die-Cast)", saga:"Asgard",    tipo:"God Warriors",         ver:"Vintage", lancamento:"1988" },
  { id:"dc_zeta_shido_de_mizar",              name:"Zeta Shido de Mizar",               line:"Vintage (Die-Cast)", saga:"Asgard",    tipo:"God Warriors",         ver:"Vintage", lancamento:"1987" },
  { id:"dc_zeta_bado_de_alcor",               name:"Zeta Bado de Alcor",                line:"Vintage (Die-Cast)", saga:"Asgard",    tipo:"God Warriors",         ver:"Vintage", lancamento:"1988" },
  { id:"dc_armadura_de_odim",                 name:"Armadura de Odim",                  line:"Vintage (Die-Cast)", saga:"Asgard",    tipo:"Deuses",               ver:"Vintage", lancamento:"1987" },
  // Poseidon
  { id:"dc_bian_de_cavalo_marinho",           name:"Bian de Cavalo Marinho",            line:"Vintage (Die-Cast)", saga:"Poseidon",  tipo:"Marinas",              ver:"Vintage", lancamento:"1987" },
  { id:"dc_kasa_de_lymnades",                 name:"Kasa de Lymnades",                  line:"Vintage (Die-Cast)", saga:"Poseidon",  tipo:"Marinas",              ver:"Vintage", lancamento:"1987" },
  { id:"dc_isaak_de_kraken",                  name:"Isaak de Kraken",                   line:"Vintage (Die-Cast)", saga:"Poseidon",  tipo:"Marinas",              ver:"Vintage", lancamento:"1987" },
  { id:"dc_kanon_de_dragao_marinho",          name:"Kanon de Dragão Marinho",           line:"Vintage (Die-Cast)", saga:"Poseidon",  tipo:"Marinas",              ver:"Vintage", lancamento:"1987" },
  { id:"dc_sorento_de_sirene",                name:"Sorento de Sirene",                 line:"Vintage (Die-Cast)", saga:"Poseidon",  tipo:"Marinas",              ver:"Vintage", lancamento:"1987" },
  { id:"dc_io_de_scylla",                     name:"Io de Scylla",                      line:"Vintage (Die-Cast)", saga:"Poseidon",  tipo:"Marinas",              ver:"Vintage", lancamento:"1987" },
  { id:"dc_krishna_de_chrysaor",              name:"Krishna de Chrysaor",               line:"Vintage (Die-Cast)", saga:"Poseidon",  tipo:"Marinas",              ver:"Vintage", lancamento:"1987" },
  { id:"dc_thatis_de_sereia",                 name:"Thatis de Sereia",                  line:"Vintage (Die-Cast)", saga:"Poseidon",  tipo:"Marinas",              ver:"Vintage", lancamento:"1987" },
  { id:"dc_julian_de_poseidon",               name:"Julian de Poseidon",                line:"Vintage (Die-Cast)", saga:"Poseidon",  tipo:"Deuses",               ver:"Vintage", lancamento:"1987" },
  { id:"dc_ushio_do_mar",                     name:"Ushio do Mar",                      line:"Vintage (Die-Cast)", saga:"Poseidon",  tipo:"Cavaleiros de Aço",               ver:"Vintage", lancamento:"1987" },
  // Outros
  { id:"dc_sho_do_ceu",                       name:"Shô do Céu",                        line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Aço",               ver:"Vintage", lancamento:"1987" },
  { id:"dc_dalchi_da_terra",                  name:"Dalchi da Terra",                   line:"Vintage (Die-Cast)", saga:"Santuário", tipo:"Cavaleiros de Aço",               ver:"Vintage", lancamento:"1987" },
  // Hades Espectrais Die-Cast
  { id:"dc_rhadamanthys_de_wyvern",           name:"Rhadamanthys de Wyvern",            line:"Vintage (Die-Cast)", saga:"Hades",     tipo:"Espectrais",           ver:"Vintage", lancamento:"2003" },
  { id:"dc_myu_de_papyllon",                  name:"Myu de Papyllon",                   line:"Vintage (Die-Cast)", saga:"Hades",     tipo:"Espectrais",           ver:"Vintage", lancamento:"2003" },
  { id:"dc_gigante_de_cyclope",               name:"Gigante de Cyclope",                line:"Vintage (Die-Cast)", saga:"Hades",     tipo:"Espectrais",           ver:"Vintage", lancamento:"2003" },
  { id:"dc_afrodite_de_peixes_renegado",      name:"Afrodite de Peixes Renegado",       line:"Vintage (Die-Cast)", saga:"Hades",     tipo:"Surplice",             ver:"Vintage", lancamento:"2003" },
  { id:"dc_camus_de_aquario_renegado",        name:"Camus de Aquário Renegado",         line:"Vintage (Die-Cast)", saga:"Hades",     tipo:"Surplice",             ver:"Vintage", lancamento:"2003" },
  { id:"dc_mascara_da_morte_de_cancer_renegado", name:"Máscara da Morte de Câncer Renegado", line:"Vintage (Die-Cast)", saga:"Hades", tipo:"Surplice",            ver:"Vintage", lancamento:"2003" },
  { id:"dc_saga_de_gemeos_renegado",          name:"Saga de Gêmeos Renegado",           line:"Vintage (Die-Cast)", saga:"Hades",     tipo:"Surplice",             ver:"Vintage", lancamento:"2003" },
  { id:"dc_shion_de_aries_renegado",          name:"Shion de Aries Renegado",           line:"Vintage (Die-Cast)", saga:"Hades",     tipo:"Surplice",             ver:"Vintage", lancamento:"2003" },
  { id:"dc_shura_de_capricornio_renegado",    name:"Shura de Capricórnio Renegado",     line:"Vintage (Die-Cast)", saga:"Hades",     tipo:"Surplice",             ver:"Vintage", lancamento:"2003" },

];

// ─── ESTILOS ─────────────────────────────────────────────────────────────────
const TS = {
  "Cavaleiros de Bronze": {c:"#cd7f32",ic:"⚔️"},
  "Cavaleiros de Prata":  {c:"#b0b8c8",ic:"🌙"},
  "Cavaleiros de Ouro":   {c:"#ffd700",ic:"⭐"},
  "Black Saints":         {c:"#a78bfa",ic:"🖤"},
  "Cavaleiros de Aço":    {c:"#94a3b8",ic:"🤖"},
  "Surplice":             {c:"#c084fc",ic:"💀"},
  "Espectrais":           {c:"#818cf8",ic:"👻"},
  "God Warriors":         {c:"#60a5fa",ic:"🪬"},
  "Marinas":              {c:"#38bdf8",ic:"🌊"},
  "God Cloth":            {c:"#f87171",ic:"✨"},
  "Divinos":              {c:"#a78bfa",ic:"🌟"},
  "Spin-off":             {c:"#34d399",ic:"🎬"},
  "Edição Especial":      {c:"#f59e0b",ic:"🏆"},
};
const SC = {
  "Santuário":"#ffd700","Poseidon":"#38bdf8","Asgard":"#60a5fa",
  "Hades":"#a78bfa","Soul of Gold":"#f59e0b","Filmes":"#34d399","Especial":"#f87171",
};
const SAGAS_EX = ["Santuário","Poseidon","Asgard","Hades","Soul of Gold","Especial"];
const SAGAS_CM = ["Santuário","Poseidon","Asgard","Hades","Filmes","Especial"];
const TIPOS_PRINC = ["Cavaleiros de Bronze","Cavaleiros de Prata","Cavaleiros de Ouro"];
const TIPOS_OUTROS = ["Black Saints","Cavaleiros de Aço","Surplice","Espectrais","God Warriors","Marinas","God Cloth","Divinos","Spin-off","Edição Especial"];

// ─── SIMULAÇÃO DE OUTROS USUÁRIOS (demo) ────────────────────────────────────
// ─── LISTING DETAIL MODAL ────────────────────────────────────────────────────
function ListingDetailModal({ seller, fig, canMarket, onUpgrade, onClose }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = seller.photos || [];

  const ESTADO_COLOR = { "Novo":"#22c55e", "Seminovo":"#ffd700", "Usado":"#f87171" };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1200,
      background:"#000000cc",backdropFilter:"blur(8px)",
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:520,
        background:"linear-gradient(180deg,#0d0d1e,#080812)",
        borderRadius:"20px 20px 0 0",border:"1px solid #ffffff0f",
        maxHeight:"88vh",overflowY:"scroll",WebkitOverflowScrolling:"touch",touchAction:"pan-y"}}>

        {/* Foto principal */}
        <div style={{position:"relative",width:"100%",aspectRatio:"4/3",
          background:"#06060e",borderRadius:"20px 20px 0 0",overflow:"hidden"}}>
          {photos.length > 0 ? (
            <img src={photos[activePhoto]} alt=""
              style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          ) : (
            <div style={{width:"100%",height:"100%",display:"flex",
              alignItems:"center",justifyContent:"center",
              fontSize:48,color:"#333"}}>📦</div>
          )}

          {/* Fechar */}
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,
            background:"#000000aa",border:"none",borderRadius:"50%",
            width:32,height:32,cursor:"pointer",color:"#fff",fontSize:14,
            display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>

          {/* Badge estado */}
          <div style={{position:"absolute",top:12,left:12,display:"flex",gap:6}}>
            <div style={{
              background:ESTADO_COLOR[seller.estado]+"22",
              border:`1px solid ${ESTADO_COLOR[seller.estado]}55`,
              borderRadius:20,padding:"3px 10px",
              fontSize:10,fontWeight:800,color:ESTADO_COLOR[seller.estado]}}>
              {seller.estado}
            </div>
            {seller.isBandai && (
              <div style={{background:"#cc0000",borderRadius:20,padding:"3px 10px",
                fontSize:9,fontWeight:900,color:"#fff",fontFamily:"Arial,sans-serif",
                letterSpacing:0.5,display:"flex",alignItems:"center"}}>
                BANDAI
              </div>
            )}
          </div>

          {/* Nav fotos */}
          {photos.length > 1 && (
            <>
              <button onClick={e=>{e.stopPropagation();setActivePhoto(p=>Math.max(0,p-1));}}
                disabled={activePhoto===0}
                style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",
                  background:"#000000aa",border:"none",borderRadius:"50%",
                  width:32,height:32,cursor:"pointer",color:activePhoto===0?"#333":"#fff",
                  fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
              <button onClick={e=>{e.stopPropagation();setActivePhoto(p=>Math.min(photos.length-1,p+1));}}
                disabled={activePhoto===photos.length-1}
                style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                  background:"#000000aa",border:"none",borderRadius:"50%",
                  width:32,height:32,cursor:"pointer",
                  color:activePhoto===photos.length-1?"#333":"#fff",
                  fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>→</button>
            </>
          )}

          {/* Counter */}
          {photos.length > 1 && (
            <div style={{position:"absolute",bottom:10,right:12,
              background:"#000000aa",borderRadius:10,padding:"2px 8px",
              fontSize:9,color:"#aaa",fontWeight:700}}>
              {activePhoto+1}/{photos.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div style={{display:"flex",gap:5,padding:"8px 14px 0",overflowX:"auto"}}>
            {photos.map((url,i)=>(
              <img key={i} src={url} alt="" onClick={()=>setActivePhoto(i)}
                style={{width:48,height:48,borderRadius:7,objectFit:"cover",
                  cursor:"pointer",flexShrink:0,
                  border:`2px solid ${activePhoto===i?"#ffd700":"transparent"}`,
                  opacity:activePhoto===i?1:0.5,transition:"all 0.15s"}}/>
            ))}
          </div>
        )}

        {/* Info */}
        <div style={{padding:"14px 16px 32px"}}>
          <div style={{fontSize:14,fontFamily:"'Cinzel',serif",fontWeight:900,
            color:"#dde",marginBottom:4}}>{fig.name}</div>

          <div style={{display:"flex",alignItems:"center",
            justifyContent:"space-between",marginBottom:12}}>
            <div>
              <div style={{fontSize:20,fontWeight:900,color:"#22c55e"}}>{seller.preco}</div>
              <div style={{fontSize:10,color:"#555",marginTop:1,display:"flex",alignItems:"center",gap:6}}>
                <span>Vendido por <span style={{color:"#aaa"}}>{seller.nome}</span></span>
                {seller.isBandai && (
                  <span style={{background:"#cc0000",borderRadius:4,padding:"1px 5px",
                    fontSize:7,fontWeight:900,color:"#fff",fontFamily:"Arial,sans-serif",letterSpacing:0.5}}>
                    BANDAI
                  </span>
                )}
              </div>
            </div>
            <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,
              background:ESTADO_COLOR[seller.estado]+"18",
              border:`1px solid ${ESTADO_COLOR[seller.estado]}33`,
              color:ESTADO_COLOR[seller.estado]}}>
              {seller.estado}
            </span>
          </div>

          {/* Descrição */}
          {seller.desc && (
            <div style={{background:"#ffffff06",borderRadius:10,padding:"12px 14px",marginBottom:14,
              border:"1px solid #ffffff0a"}}>
              <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:6}}>
                DESCRIÇÃO DO VENDEDOR
              </div>
              <p style={{fontSize:12,color:"#999",lineHeight:1.7}}>{seller.desc}</p>
            </div>
          )}

          {/* Botão contato */}
          {canMarket ? (
            <a href={`https://wa.me/55${seller.whats?.replace(/\D/g,"")}`}
              target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:"pointer",
                background:"linear-gradient(90deg,#22c55e,#16a34a)",
                color:"#fff",fontSize:14,fontWeight:800,textDecoration:"none",
                boxShadow:"0 4px 20px #22c55e44"}}>
              📱 Entrar em contato no WhatsApp
            </a>
          ) : (
            <button onClick={()=>{onClose();onUpgrade("basic");}}
              style={{width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:"pointer",
                background:"linear-gradient(90deg,#ffd700,#f59e0b)",
                color:"#000",fontSize:13,fontWeight:800}}>
              ⭐ Assinar Basic para ver o contato
            </button>
          )}

          <div style={{marginTop:10,fontSize:10,color:"#333",textAlign:"center",lineHeight:1.6}}>
            ⚠️ O Colezzare não se responsabiliza pelas transações entre usuários.
          </div>
          {canMarket && (
            <div style={{marginTop:8,textAlign:"center"}}>
              <button onClick={()=>seller.onReport&&seller.onReport()}
                style={{background:"none",border:"none",cursor:"pointer",
                  color:"#333",fontSize:10,textDecoration:"underline"}}>
                🚩 Denunciar este anúncio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MODAL DETALHE ───────────────────────────────────────────────────────────
// ─── PHOTO STRIP + LIGHTBOX ──────────────────────────────────────────────────
function PhotoStrip({ photos }) {
  const [lightbox, setLightbox] = useState(null); // index of open photo

  if (!photos?.length) return null;

  return (
    <>
      <div style={{marginTop:6,marginBottom:4}}>
        {/* Thumbnail strip */}
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          {photos.slice(0,4).map((url,i)=>(
            <div key={i} onClick={()=>setLightbox(i)}
              style={{position:"relative",width:52,height:52,flexShrink:0,
                borderRadius:7,overflow:"hidden",cursor:"pointer",
                border:"1px solid #ffffff15",
                boxShadow:"0 2px 8px #00000044",
                transition:"transform 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              <img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              {/* Overlay on last thumb if more photos */}
              {i===3 && photos.length>4 && (
                <div style={{position:"absolute",inset:0,background:"#000000bb",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:13,fontWeight:800,color:"#fff"}}>
                  +{photos.length-4}
                </div>
              )}
            </div>
          ))}
          {photos.length > 0 && (
            <button onClick={()=>setLightbox(0)}
              style={{marginLeft:4,padding:"4px 10px",borderRadius:20,border:"1px solid #ffffff15",
                background:"#ffffff0a",color:"#aaa",fontSize:9,fontWeight:700,cursor:"pointer",
                display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
              🔍 Ver fotos
            </button>
          )}
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div onClick={()=>setLightbox(null)}
          style={{position:"fixed",inset:0,zIndex:3000,background:"#000000ee",
            backdropFilter:"blur(10px)",display:"flex",flexDirection:"column",
            alignItems:"center",justifyContent:"center"}}>

          {/* Close */}
          <button onClick={()=>setLightbox(null)}
            style={{position:"absolute",top:16,right:16,background:"#ffffff15",
              border:"none",borderRadius:"50%",width:36,height:36,cursor:"pointer",
              color:"#fff",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
            ✕
          </button>

          {/* Counter */}
          <div style={{position:"absolute",top:18,left:"50%",transform:"translateX(-50%)",
            fontSize:11,color:"#888",fontWeight:700}}>
            {lightbox+1} / {photos.length}
          </div>

          {/* Main image */}
          <div onClick={e=>e.stopPropagation()}
            style={{maxWidth:"90vw",maxHeight:"70vh",display:"flex",
              alignItems:"center",justifyContent:"center"}}>
            <img src={photos[lightbox]} alt=""
              style={{maxWidth:"90vw",maxHeight:"70vh",borderRadius:12,
                objectFit:"contain",boxShadow:"0 8px 40px #000000cc"}}/>
          </div>

          {/* Prev / Next */}
          <div style={{display:"flex",gap:12,marginTop:16}}>
            <button onClick={e=>{e.stopPropagation();setLightbox(p=>Math.max(0,p-1));}}
              disabled={lightbox===0}
              style={{width:40,height:40,borderRadius:"50%",border:"1px solid #ffffff22",
                background:"#ffffff0d",cursor:lightbox===0?"not-allowed":"pointer",
                color:lightbox===0?"#333":"#fff",fontSize:16,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
              ←
            </button>
            <button onClick={e=>{e.stopPropagation();setLightbox(p=>Math.min(photos.length-1,p+1));}}
              disabled={lightbox===photos.length-1}
              style={{width:40,height:40,borderRadius:"50%",border:"1px solid #ffffff22",
                background:"#ffffff0d",cursor:lightbox===photos.length-1?"not-allowed":"pointer",
                color:lightbox===photos.length-1?"#333":"#fff",fontSize:16,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
              →
            </button>
          </div>

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div onClick={e=>e.stopPropagation()}
              style={{display:"flex",gap:6,marginTop:12,padding:"8px",
                background:"#ffffff08",borderRadius:12,border:"1px solid #ffffff0a"}}>
              {photos.map((url,i)=>(
                <img key={i} src={url} alt="" onClick={()=>setLightbox(i)}
                  style={{width:44,height:44,borderRadius:6,objectFit:"cover",cursor:"pointer",
                    border:`2px solid ${lightbox===i?"#ffd700":"transparent"}`,
                    opacity:lightbox===i?1:0.5,transition:"all 0.15s"}}/>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─── BUG REPORT BUTTON (inline no modal de cada figura) ──────────────────────
function BugReportButton({ fig }) {
  const [open,       setOpen]       = useState(false);
  const [tipo,       setTipo]       = useState("");
  const [detalhe,    setDetalhe]    = useState("");
  const [foto,       setFoto]       = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);

  const TIPOS = [
    { v:"foto_errada",   l:"📷 Foto errada",          d:"A imagem não corresponde à figura" },
    { v:"info_errada",   l:"✏️ Informação errada",    d:"Nome, saga, tipo ou versão incorretos" },
    { v:"duplicado",     l:"🔁 Figura duplicada",     d:"Esta figura já existe no catálogo" },
    { v:"outro",         l:"🐛 Outro erro",            d:"Qualquer outro problema" },
  ];

  const handleFoto = (e) => {
    const f = e.target.files[0];
    if (f) setFoto({ file:f, preview: URL.createObjectURL(f) });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    setDone(true);
    setTimeout(() => { setDone(false); setOpen(false); setTipo(""); setDetalhe(""); setFoto(null); }, 2500);
  };

  if (!open) return (
    <button onClick={()=>setOpen(true)}
      style={{width:"100%",marginTop:14,padding:"8px",borderRadius:10,
        border:"1px solid #ffffff0a",background:"transparent",cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",gap:6,
        color:"#444",fontSize:10,fontWeight:600}}>
      🐛 Encontrou um erro nessa figura? Reporte aqui
    </button>
  );

  if (done) return (
    <div style={{marginTop:14,padding:"14px",borderRadius:10,
      background:"#22c55e12",border:"1px solid #22c55e33",
      textAlign:"center",fontSize:12,color:"#22c55e",fontWeight:700}}>
      ✓ Reporte enviado! Obrigado 🙏
    </div>
  );

  return (
    <div style={{marginTop:14,background:"#ff444408",border:"1px solid #ff444422",
      borderRadius:12,padding:"14px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:800,color:"#f87171"}}>🐛 Reportar erro</div>
        <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",
          color:"#555",cursor:"pointer",fontSize:14}}>✕</button>
      </div>

      <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:6}}>
        FIGURA: <span style={{color:"#888",fontWeight:400}}>{fig.name}</span>
      </div>

      {/* Tipo de erro */}
      <div style={{marginBottom:10}}>
        <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:6}}>TIPO DO ERRO</div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {TIPOS.map(t=>(
            <button key={t.v} onClick={()=>setTipo(t.v)} style={{
              padding:"8px 10px",borderRadius:8,cursor:"pointer",textAlign:"left",
              border:`1px solid ${tipo===t.v?"#f87171":"#ffffff10"}`,
              background:tipo===t.v?"#f8717112":"#ffffff05"}}>
              <span style={{fontSize:11,fontWeight:700,color:tipo===t.v?"#f87171":"#aaa"}}>{t.l}</span>
              <span style={{fontSize:9,color:"#555",marginLeft:6}}>{t.d}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Descrição */}
      <div style={{marginBottom:10}}>
        <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:5}}>
          DESCREVA O ERRO *
        </div>
        <textarea value={detalhe} onChange={e=>setDetalhe(e.target.value)} rows={2}
          placeholder="Ex: A foto está mostrando Seiya mas o nome diz Shiryu..."
          style={{width:"100%",padding:"8px 10px",borderRadius:8,background:"#ffffff08",
            border:"1px solid #ff444422",color:"#dde",fontSize:11,outline:"none",
            fontFamily:"'Rajdhani',sans-serif",resize:"none",lineHeight:1.5}}/>
      </div>

      {/* Foto opcional */}
      <div style={{marginBottom:12}}>
        {foto ? (
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <img src={foto.preview} alt="" style={{width:44,height:44,borderRadius:6,
              objectFit:"cover",border:"1px solid #ff444433"}}/>
            <div style={{flex:1,fontSize:10,color:"#888"}}>{foto.file.name}</div>
            <button onClick={()=>setFoto(null)} style={{background:"none",border:"none",
              color:"#666",cursor:"pointer",fontSize:12}}>✕</button>
          </div>
        ) : (
          <label style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 12px",
            borderRadius:8,border:"1px dashed #ff444422",cursor:"pointer",
            background:"#ff444408",color:"#666",fontSize:10}}>
            📎 Anexar print <span style={{color:"#444"}}>(opcional)</span>
            <input type="file" accept="image/*" onChange={handleFoto} style={{display:"none"}}/>
          </label>
        )}
      </div>

      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>setOpen(false)} style={{flex:1,padding:"9px",borderRadius:8,
          border:"1px solid #ffffff10",background:"transparent",
          color:"#555",fontSize:11,fontWeight:700,cursor:"pointer"}}>
          Cancelar
        </button>
        <button onClick={handleSubmit}
          disabled={!tipo||!detalhe||submitting}
          style={{flex:2,padding:"9px",borderRadius:8,border:"none",
            cursor:tipo&&detalhe?"pointer":"not-allowed",
            background:tipo&&detalhe?"linear-gradient(90deg,#f87171,#ef4444)":"#ffffff0d",
            color:tipo&&detalhe?"#fff":"#444",fontSize:11,fontWeight:800,
            opacity:tipo&&detalhe?1:0.5}}>
          {submitting?"⏳ Enviando...":"🐛 Enviar reporte"}
        </button>
      </div>
    </div>
  );
}

function Modal({ fig, owned, wished, myListing, myWanted, myCollection, onOwned, onWish, onToggleSell, onToggleWant, onClose, onOpenSellForm, onOpenBuyForm, onOpenEditCollection, canMarket=false, onUpgrade, onReport, onFilter }) {
  const [listingDetail, setListingDetail] = useState(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [activeSection, setActiveSection] = useState("info");
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(null);
  const [realSellers, setRealSellers] = useState([]);
  const [realBuyers,  setRealBuyers]  = useState([]);
  const [loadingMkt,  setLoadingMkt]  = useState(false);

  const s = TS[fig.tipo] || {c:"#888",ic:"🎯"};
  const sc = SC[fig.saga] || "#888";
  const isEX = fig.line === "EX";

  // Busca listings reais do backend
  useEffect(() => {
    setLoadingMkt(true);
    Promise.all([
      fetch(`${API_URL}/marketplace/listings?figure_id=${fig.id}`).then(r=>r.json()).catch(()=>[]),
      fetch(`${API_URL}/marketplace/wanted?figure_id=${fig.id}`).then(r=>r.json()).catch(()=>[]),
    ]).then(([listings, wanteds]) => {
      setRealSellers((listings||[]).map(l=>({
        nome: l.users?.name || "Usuário",
        whats: l.users?.whatsapp || "",
        preco: `${l.currency} ${l.price}`,
        estado: l.condition,
        desc: l.description,
        verified: l.users?.verified,
        id: l.id,
        user_id: l.user_id,
      })));
      setRealBuyers((wanteds||[]).map(w=>({
        nome: w.users?.name || "Usuário",
        whats: w.users?.whatsapp || "",
        verified: w.users?.verified,
        id: w.id,
        user_id: w.user_id,
      })));
      setLoadingMkt(false);
    });
  }, [fig.id]);

  const sellers = realSellers.filter(s=>s.user_id !== myListing?.userId);
  const buyers  = realBuyers.filter(b=>b.user_id  !== myWanted?.userId);
  const hasMatch = (myListing && buyers.length > 0) || (myWanted && sellers.length > 0);

  const cloudBase = `https://res.cloudinary.com/dr3sxytes/image/upload/figures/${fig.id}`;
  const gallery = fig.gallery || Array.from({length:15},(_,i)=>`${cloudBase}/${i+1}.jpg`);

  // Imagem encolhe de 260px até 0px nos primeiros 200px de scroll
  const IMG_MAX = 260;
  const IMG_MIN = 0;
  const imgHeight = Math.max(IMG_MIN, IMG_MAX - scrollY * 1.3);
  const imgOpacity = Math.max(0, 1 - scrollY / 150);

  const handleScroll = (e) => {
    setScrollY(e.target.scrollTop);
  };

  return (
    <>
    {listingDetail && (
      <ListingDetailModal
        seller={{...listingDetail, onReport:()=>{setListingDetail(null);onReport&&onReport(listingDetail,fig);}}}
        fig={fig} canMarket={canMarket} onUpgrade={onUpgrade}
        onClose={()=>setListingDetail(null)}/>
    )}
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1000,background:"#000000bb"}}>
      <div onClick={e=>e.stopPropagation()} style={{
        position:"fixed",bottom:0,left:0,right:0,
        background:"#0d0d20",
        borderRadius:"20px 20px 0 0",
        height:"92dvh",
        display:"flex",flexDirection:"column"}}>

        {/* Barra de arraste */}
        <div style={{flexShrink:0,display:"flex",justifyContent:"center",padding:"8px 0 2px",
          position:"relative",zIndex:10}}>
          <div style={{width:36,height:4,borderRadius:2,background:"#ffffff20"}}/>
        </div>

        {/* Botão fechar fixo */}
        <button onClick={onClose} style={{position:"absolute",top:16,right:12,zIndex:20,
          width:32,height:32,borderRadius:"50%",background:"#000000aa",
          border:"none",cursor:"pointer",color:"#aaa",fontSize:16,
          display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>

        {/* Badge linha fixo */}
        <div style={{position:"absolute",top:16,left:12,zIndex:20,
          background:isEX?"#ffd70022":"#ffffff12",
          border:`1px solid ${isEX?"#ffd70055":"#ffffff22"}`,
          borderRadius:20,padding:"3px 10px",
          fontSize:10,fontWeight:800,color:isEX?"#ffd700":"#aaa",letterSpacing:1}}>
          {fig.line||"CM"}
        </div>

        {/* SCROLL CONTAINER */}
        <div ref={scrollRef} onScroll={handleScroll}
          style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",
            touchAction:"pan-y",overflowX:"hidden"}}>

          {/* Imagem fixa */}
          <div style={{height:220,background:"#0a0a18",flexShrink:0,
            position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <img src={gallery[galleryIdx]} alt={fig.name}
              style={{width:"100%",height:"100%",objectFit:"contain",padding:8}}
              onError={e=>{e.target.style.display="none";}}/>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
              justifyContent:"center",pointerEvents:"none",zIndex:0}}>
              <span style={{fontSize:48,opacity:0.1}}>{s.ic}</span>
            </div>
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:40,
              background:"linear-gradient(transparent,#0d0d20)",zIndex:1,pointerEvents:"none"}}/>
            {hasMatch && (
              <div style={{position:"absolute",bottom:8,left:12,zIndex:5,
                background:"#22c55ecc",borderRadius:20,padding:"4px 10px",
                fontSize:10,fontWeight:800,color:"#fff"}}>
                🎯 Match!
              </div>
            )}
          </div>

          {/* Galeria thumbnails — fica sticky quando imagem some */}
          <div style={{
            position: imgHeight <= 10 ? "sticky" : "relative",
            top: imgHeight <= 10 ? 0 : "auto",
            zIndex:8,
            display:"flex",gap:6,padding:"8px 12px",
            overflowX:"auto",WebkitOverflowScrolling:"touch",
            background:"#0a0a18",borderBottom:"1px solid #ffffff08"}}>
            {gallery.map((url,i)=>(
              <img key={i} src={url} alt={`${i+1}`}
                onClick={()=>setGalleryIdx(i)}
                style={{width:48,height:48,objectFit:"contain",borderRadius:8,flexShrink:0,
                  cursor:"pointer",background:"#111",padding:3,
                  border:`2px solid ${i===galleryIdx?"#ffd700":"#ffffff15"}`,
                  opacity:i===galleryIdx?1:0.5,transition:"all 0.15s"}}
                onError={e=>{e.target.style.display="none";}}/>
            ))}
          </div>

          {/* Nome e tags */}
          <div style={{padding:"12px 16px 8px"}}>
            <h2 style={{fontFamily:"'Cinzel',serif",fontSize:17,fontWeight:900,
              color:"#f0f0ff",marginBottom:6,lineHeight:1.2}}>{fig.name}</h2>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {[
                {l:fig.tipo, c:s.c,  action:()=>onFilter&&onFilter("tipo",fig.tipo)},
                {l:fig.saga, c:sc,   action:()=>onFilter&&onFilter("saga",fig.saga)},
                {l:fig.line, c:"#ffd70088", action:()=>onFilter&&onFilter("line",fig.line)},
                {l:fig.ver,  c:"#888", action:null},
              ].filter(t=>t.l&&t.l!=="—").map(t=>(
                <span key={t.l} onClick={t.action||undefined}
                  style={{fontSize:10,padding:"2px 8px",borderRadius:20,
                  background:`${t.c}18`,color:t.c,border:`1px solid ${t.c}33`,fontWeight:600,
                  cursor:t.action?"pointer":"default",
                  transition:"all 0.15s"}}
                  title={t.action?"Filtrar por "+t.l:undefined}>
                  {t.l}{t.action?" 🔍":""}
                </span>
              ))}
            </div>
          </div>

          {/* Botões Tenho / Quero */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"4px 16px 10px"}}>
            <button onClick={()=>onOwned(fig.id)} style={{padding:"11px",borderRadius:12,border:"none",
              cursor:"pointer",fontSize:13,fontWeight:800,
              background:owned?"#22c55e":"#22c55e18",
              color:owned?"#000":"#22c55e",
              outline:`1px solid ${owned?"transparent":"#22c55e33"}`,transition:"all 0.2s"}}>
              {owned?"✓ Tenho":"+ Tenho"}
            </button>
            <button onClick={()=>onWish(fig.id)} style={{padding:"11px",borderRadius:12,border:"none",
              cursor:"pointer",fontSize:13,fontWeight:800,
              background:wished?"#a855f7":"#a855f718",
              color:wished?"#fff":"#a855f7",
              outline:`1px solid ${wished?"transparent":"#a855f733"}`,transition:"all 0.2s"}}>
              {wished?"♡ Quero":"♡ Quero"}
            </button>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",borderBottom:"1px solid #ffffff08",padding:"0 16px"}}>
            {[{k:"info",l:"📋 Informações"},{k:"market",l:`🛒 Marketplace (${sellers.length+buyers.length})`}].map(t=>(
              <button key={t.k} onClick={()=>setActiveSection(t.k)} style={{
                padding:"8px 14px",border:"none",background:"transparent",cursor:"pointer",
                fontSize:11,fontWeight:800,
                color:activeSection===t.k?"#ffd700":"#444",
                borderBottom:activeSection===t.k?"2px solid #ffd700":"2px solid transparent",
                transition:"all 0.15s",whiteSpace:"nowrap"}}>
                {t.l}
              </button>
            ))}
          </div>

          {/* Conteúdo das tabs */}
          <div style={{padding:"12px 16px 40px"}}>
            {activeSection==="info" && (
              <>
                {owned && (
                  <div style={{background:"#22c55e0a",border:"1px solid #22c55e22",
                    borderRadius:12,padding:"12px",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{fontSize:11,color:"#22c55e",fontWeight:800,letterSpacing:1}}>📦 MINHA COLEÇÃO</div>
                      <button onClick={()=>onOpenEditCollection(fig)}
                        style={{background:"#22c55e22",border:"1px solid #22c55e44",borderRadius:8,
                          padding:"4px 10px",fontSize:10,fontWeight:700,color:"#22c55e",cursor:"pointer"}}>
                        ✏️ Editar
                      </button>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <div>
                        <div style={{fontSize:9,color:"#555",marginBottom:3}}>VALOR PAGO</div>
                        <div style={{fontSize:13,color:"#ccc",fontWeight:600}}>{myCollection?.pago||"—"}</div>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:"#555",marginBottom:3}}>DATA</div>
                        <div style={{fontSize:13,color:"#ccc",fontWeight:600}}>{myCollection?.data||"—"}</div>
                      </div>
                      <div style={{gridColumn:"1/-1"}}>
                        <BrandBadge brandId={myCollection?.brand||(myCollection?.bandai?"bandai":"nao_sei")}
                          short={LICENSED_BRANDS.find(b=>b.id===(myCollection?.brand||(myCollection?.bandai?"bandai":"nao_sei")))?.short}/>
                      </div>
                    </div>
                  </div>
                )}
                {fig.desc && (
                  <div style={{background:"#ffffff06",borderRadius:10,padding:"12px",
                    border:"1px solid #ffffff0a",marginBottom:12}}>
                    <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:6}}>DESCRIÇÃO</div>
                    <p style={{fontSize:12,color:"#999",lineHeight:1.7}}>{fig.desc}</p>
                  </div>
                )}
                {fig.lancamento && fig.lancamento!=="—" && (
                  <div style={{fontSize:11,color:"#555",marginBottom:8}}>
                    📅 Lançamento: <span style={{color:"#888"}}>{fig.lancamento}</span>
                  </div>
                )}
                <BugReportButton fig={fig}/>
              </>
            )}

            {activeSection==="market" && (
              <>
                {hasMatch && (
                  <div style={{background:"linear-gradient(135deg,#1a3a1a,#0d2e0d)",
                    border:"1px solid #22c55e55",borderRadius:12,padding:"12px",marginBottom:12,
                    display:"flex",gap:10,alignItems:"flex-start"}}>
                    <div style={{fontSize:22}}>🎯</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:800,color:"#22c55e",marginBottom:2}}>Match encontrado!</div>
                      <div style={{fontSize:11,color:"#4ade80"}}>
                        {myListing && buyers.length>0 ? `${buyers.length} comprador(es) para sua peça` : ""}
                        {myWanted && sellers.length>0 ? `${sellers.length} vendedor(es) encontrado(s)` : ""}
                      </div>
                    </div>
                  </div>
                )}
                <div style={{fontSize:10,color:"#666",fontWeight:700,letterSpacing:1,marginBottom:8}}>VENDENDO ({sellers.length})</div>
                {sellers.length===0 ? (
                  <div style={{fontSize:11,color:"#444",fontStyle:"italic",marginBottom:12}}>Nenhum vendedor no momento</div>
                ) : sellers.map((s,i)=>(
                  <div key={i} onClick={()=>setListingDetail(s)}
                    style={{background:"#ffffff08",borderRadius:12,padding:"12px",marginBottom:8,cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div>
                        <div style={{fontSize:13,color:"#dde",fontWeight:700,marginBottom:2}}>{s.nome}</div>
                        <div style={{fontSize:11,color:"#888"}}>{s.estado} · <span style={{color:"#ffd700",fontWeight:800}}>{s.preco}</span></div>
                      </div>
                      {canMarket ? (
                        <a href={`https://wa.me/55${s.whats?.replace(/\D/g,"")}`} target="_blank"
                          rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                          style={{background:"#22c55e",borderRadius:10,padding:"8px 12px",
                            textDecoration:"none",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0}}>
                          📱
                        </a>
                      ) : (
                        <button onClick={e=>{e.stopPropagation();onUpgrade("basic");}}
                          style={{background:"#ffffff10",border:"1px solid #ffd70033",borderRadius:10,
                            padding:"8px 12px",fontSize:11,fontWeight:800,color:"#ffd700",cursor:"pointer"}}>
                          🔒
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {myListing?.vendendo && (
                  <div onClick={()=>onOpenSellForm(fig)}
                    style={{background:"#22c55e18",border:"1px solid #22c55e33",borderRadius:12,
                      padding:"12px",marginBottom:8,cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:11,color:"#22c55e",fontWeight:700}}>✓ Seu anúncio ativo</div>
                        <div style={{fontSize:11,color:"#4ade80"}}>{myListing.estado} · {myListing.precoVenda}</div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();onToggleSell(fig.id);}}
                        style={{background:"#ff444422",border:"1px solid #ff444444",
                          borderRadius:8,padding:"5px 9px",color:"#ff6666",fontSize:10,cursor:"pointer"}}>
                        Remover
                      </button>
                    </div>
                  </div>
                )}
                <div style={{fontSize:10,color:"#666",fontWeight:700,letterSpacing:1,margin:"12px 0 8px"}}>QUERENDO COMPRAR ({buyers.length})</div>
                {buyers.length===0 ? (
                  <div style={{fontSize:11,color:"#444",fontStyle:"italic",marginBottom:12}}>Nenhum comprador no momento</div>
                ) : buyers.map((b,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                    background:"#ffffff08",borderRadius:12,padding:"12px",marginBottom:8}}>
                    <div style={{fontSize:13,color:"#dde",fontWeight:700}}>{b.nome}</div>
                    {canMarket ? (
                      <a href={`https://wa.me/55${b.whats.replace(/\D/g,"")}`} target="_blank"
                        rel="noopener noreferrer"
                        style={{background:"#a855f7",borderRadius:10,padding:"8px 12px",
                          textDecoration:"none",fontSize:11,fontWeight:800,color:"#fff"}}>
                        📱
                      </a>
                    ) : (
                      <button onClick={()=>onUpgrade("basic")}
                        style={{background:"#ffffff10",border:"1px solid #ffd70033",borderRadius:10,
                          padding:"8px 12px",fontSize:11,fontWeight:800,color:"#ffd700",cursor:"pointer"}}>
                        🔒
                      </button>
                    )}
                  </div>
                ))}
                {myWanted?.ativo && (
                  <div style={{background:"#a855f718",border:"1px solid #a855f733",borderRadius:12,
                    padding:"12px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:11,color:"#a855f7",fontWeight:700}}>✓ Você está buscando essa peça</div>
                    <button onClick={()=>onToggleWant(fig.id)} style={{background:"#ff444422",border:"1px solid #ff444444",
                      borderRadius:8,padding:"5px 9px",color:"#ff6666",fontSize:10,cursor:"pointer"}}>
                      Remover
                    </button>
                  </div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
                  {owned && !myListing?.vendendo && (
                    <button onClick={()=>canMarket?onOpenSellForm(fig):onUpgrade("basic")}
                      style={{padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                        fontSize:12,fontWeight:800,
                        background:canMarket?"#ffd70018":"#ffffff08",
                        color:canMarket?"#ffd700":"#555",
                        outline:`1px solid ${canMarket?"#ffd70044":"#ffffff10"}`}}>
                      {canMarket?"🏷️ Vender":"🔒 Vender"}
                    </button>
                  )}
                  {wished && !myWanted?.ativo && (
                    <button onClick={()=>canMarket?onOpenBuyForm(fig):onUpgrade("basic")}
                      style={{padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                        fontSize:12,fontWeight:800,
                        background:canMarket?"#a855f718":"#ffffff08",
                        color:canMarket?"#a855f7":"#555",
                        outline:`1px solid ${canMarket?"#a855f744":"#ffffff10"}`}}>
                      {canMarket?"🔍 Buscar":"🔒 Buscar"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// ─── FORM EDITAR COLEÇÃO ─────────────────────────────────────────────────────
function EditCollectionForm({ fig, current, onConfirm, onClose }) {
  const [pago,    setPago]    = useState(current?.pago    || "");
  const [data,    setData]    = useState(current?.data    || "");
  const [bandai,    setBandai]    = useState(current?.bandai    || false);
  const [brand,     setBrand]     = useState(current?.brand     || (current?.bandai?"bandai":"nao_sei"));
  const [otherBrand,setOtherBrand]= useState(current?.otherBrand|| "");

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1100,background:"#000000cc",
      backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:520,
        background:"linear-gradient(180deg,#0d1a0d,#080f08)",
        borderRadius:"20px 20px 0 0",border:"1px solid #22c55e33",padding:"24px 18px 32px"}}>
        <div style={{fontSize:16,fontFamily:"'Cinzel',serif",fontWeight:900,color:"#22c55e",
          marginBottom:4}}>📦 Minha Coleção</div>
        <div style={{fontSize:11,color:"#555",marginBottom:20}}>{fig.name}</div>

        {[
          {label:"Valor pago",val:pago,set:setPago,ph:"Ex: R$ 280"},
          {label:"Data de compra",val:data,set:setData,ph:"Ex: Jan 2023"},
        ].map(f=>(
          <div key={f.label} style={{marginBottom:14}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:6}}>{f.label.toUpperCase()}</div>
            <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
              style={{width:"100%",padding:"10px 12px",borderRadius:8,background:"#ffffff0a",
                border:"1px solid #22c55e22",color:"#dde",fontSize:13,outline:"none",
                fontFamily:"'Rajdhani',sans-serif"}}/>
          </div>
        ))}

        {/* MARCA */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:8}}>MARCA / FABRICANTE</div>
          <BrandSelector value={brand} onChange={v=>{setBrand(v);setBandai(v==="bandai");}}
            otherBrand={otherBrand} onOtherChange={setOtherBrand}/>
        </div>

        <div style={{display:"flex",gap:8,marginTop:4}}>
          <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:10,
            border:"1px solid #ffffff15",background:"transparent",
            color:"#666",fontSize:12,fontWeight:700,cursor:"pointer"}}>
            Cancelar
          </button>
          <button onClick={()=>onConfirm({pago,data,bandai:brand==="bandai",brand,otherBrand})}
            style={{flex:2,padding:"12px",borderRadius:10,border:"none",
              background:"linear-gradient(90deg,#22c55e,#16a34a)",
              color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer"}}>
            ✓ Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FORM DE VENDA ───────────────────────────────────────────────────────────
function SellForm({ fig, existing, onConfirm, onClose }) {
  const isEdit = !!(existing?.vendendo);
  const [preco,    setPreco]    = useState(existing?.precoVenda||"");
  const [estado,   setEstado]   = useState(existing?.estado||"Seminovo");
  const [desc,     setDesc]     = useState(existing?.desc||"");
  const [extraDesc,setExtraDesc]= useState("");
  const [photos,   setPhotos]   = useState(existing?.photos?.map(url=>({preview:url,file:null}))||[]);
  const [dias,     setDias]     = useState(existing?.dias||30);
  const [notifPref,setNotifPref]= useState(existing?.notifPref||"ambos");
  const [brand,    setBrand]    = useState(existing?.brand||"bandai");
  const [otherBrand,setOtherBrand]= useState(existing?.otherBrand||"");
  const [termAccepted,setTermAccepted] = useState(isEdit);
  const [showTerm, setShowTerm] = useState(false);

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - photos.length);
    setPhotos(p => [...p, ...files.map(file=>({file,preview:URL.createObjectURL(file)}))].slice(0,5));
  };
  const removePhoto = (idx) => {
    if(photos[idx].file) URL.revokeObjectURL(photos[idx].preview);
    setPhotos(p=>p.filter((_,i)=>i!==idx));
  };

  const canPublish = preco.trim()!=="" && termAccepted;

  const handlePublish = () => {
    if(!canPublish) return;
    const expiresAt = isEdit ? existing?.expiresAt : new Date(Date.now()+dias*86400000).toISOString();
    // No modo edição, concatena descrição extra com data
    const finalDesc = isEdit && extraDesc.trim()
      ? `${desc}\n\n[${new Date().toLocaleDateString("pt-BR")}] ${extraDesc.trim()}`
      : desc;
    const termData = {acceptedAt:new Date().toISOString(),userAgent:navigator.userAgent,platform:navigator.platform};
    onConfirm({precoVenda:preco, estado, desc:finalDesc, vendendo:true, inativo:false,
      isBandai:brand==="bandai", brand, otherBrand,
      photos:photos.map(p=>p.preview), expiresAt, dias, notifPref, termData});
  };

  // Calcula dias restantes se editando
  const diasRestantes = isEdit && existing?.expiresAt
    ? Math.max(0, Math.ceil((new Date(existing.expiresAt) - new Date()) / 86400000))
    : null;

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1100,background:"#000000cc",
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:520,
        background:"linear-gradient(180deg,#1a1400,#0f0e08)",
        borderRadius:"20px 20px 0 0",border:"1px solid #ffd70033",
        padding:"20px 18px 36px",maxHeight:"92vh",overflowY:"scroll",WebkitOverflowScrolling:"touch",touchAction:"pan-y"}}>

        <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
          <div style={{width:36,height:4,background:"#ffffff20",borderRadius:4}}/>
        </div>
        <div style={{fontSize:16,fontFamily:"'Cinzel',serif",fontWeight:900,color:"#ffd700",marginBottom:2}}>
          {isEdit?"✏️ Editar Anúncio":"🏷️ Quero Vender"}
        </div>
        <div style={{fontSize:11,color:"#555",marginBottom:16}}>{fig.name}</div>

        {/* FOTOS — só no novo anúncio */}
        {!isEdit && (
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:8}}>
              FOTOS <span style={{color:"#333",fontWeight:400}}>(até 5 · 1ª é a capa)</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5}}>
              {photos.map((p,i)=>(
                <div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:8,
                  overflow:"hidden",border:`2px solid ${i===0?"#ffd700":"#ffffff15"}`}}>
                  <img src={p.preview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <button onClick={()=>removePhoto(i)} style={{position:"absolute",top:2,right:2,
                    background:"#000000bb",border:"none",borderRadius:"50%",width:16,height:16,
                    cursor:"pointer",color:"#fff",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  {i===0&&<div style={{position:"absolute",bottom:0,left:0,right:0,background:"#ffd700cc",
                    fontSize:6,fontWeight:900,color:"#000",textAlign:"center",padding:"1px 0"}}>CAPA</div>}
                </div>
              ))}
              {photos.length<5&&(
                <label style={{aspectRatio:"1",borderRadius:8,border:"2px dashed #ffd70033",
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  cursor:"pointer",background:"#ffffff05",gap:2}}>
                  <span style={{fontSize:20,color:"#ffd70066"}}>📷</span>
                  <span style={{fontSize:7,color:"#555"}}>Foto</span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{display:"none"}}/>
                </label>
              )}
              {Array.from({length:Math.max(0,4-photos.length)}).map((_,i)=>(
                <div key={i} style={{aspectRatio:"1",borderRadius:8,border:"1px dashed #ffffff08",background:"#ffffff03"}}/>
              ))}
            </div>
          </div>
        )}

        {/* PREÇO — sempre editável */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:5}}>
            PREÇO DE VENDA <span style={{color:"#f87171"}}>*</span>
          </div>
          <input value={preco} onChange={e=>setPreco(e.target.value)} placeholder="Ex: R$ 350"
            style={{width:"100%",padding:"9px 12px",borderRadius:8,
              background:preco?"#ffffff0a":"#ff444408",
              border:`1px solid ${preco?"#ffd70022":"#f8717144"}`,
              color:"#dde",fontSize:12,outline:"none",fontFamily:"'Rajdhani',sans-serif"}}/>
          {!preco&&<div style={{fontSize:9,color:"#f87171",marginTop:3}}>⚠️ Preço é obrigatório</div>}
        </div>

        {/* ESTADO — bloqueado na edição */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:6}}>
            ESTADO {isEdit&&<span style={{color:"#444",fontWeight:400,fontSize:8}}>(não editável)</span>}
          </div>
          <div style={{display:"flex",gap:6}}>
            {["Novo","Seminovo","Usado"].map(e=>(
              <button key={e} onClick={()=>!isEdit&&setEstado(e)}
                style={{flex:1,padding:"8px",borderRadius:8,
                  border:`1px solid ${estado===e?"#ffd700":"#ffffff15"}`,
                  background:estado===e?"#ffd70022":"transparent",
                  color:estado===e?"#ffd700":isEdit?"#333":"#666",
                  fontSize:11,fontWeight:700,cursor:isEdit?"not-allowed":"pointer",
                  opacity:isEdit&&estado!==e?0.3:1}}>{e}</button>
            ))}
          </div>
        </div>

        {/* MARCA — bloqueado na edição */}
        {!isEdit && (
          <div style={{marginBottom:10}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:6}}>MARCA / FABRICANTE</div>
            <BrandSelector value={brand} onChange={setBrand} otherBrand={otherBrand} onOtherChange={setOtherBrand}/>
          </div>
        )}

        {/* DESCRIÇÃO — bloqueada na edição, só adicionar extra */}
        {!isEdit ? (
          <div style={{marginBottom:10}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:5}}>
              DESCRIÇÃO <span style={{color:"#333",fontWeight:400}}>(opcional)</span>
            </div>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3}
              placeholder="Ex: Com caixa original, sem marcas de uso. Todos os acessórios inclusos..."
              style={{width:"100%",padding:"9px 12px",borderRadius:8,background:"#ffffff0a",
                border:"1px solid #ffd70022",color:"#dde",fontSize:12,outline:"none",
                fontFamily:"'Rajdhani',sans-serif",resize:"vertical",lineHeight:1.5}}/>
          </div>
        ) : (
          <div style={{marginBottom:10}}>
            {desc && (
              <div style={{background:"#ffffff06",borderRadius:8,padding:"9px 12px",marginBottom:8,
                border:"1px solid #ffffff10"}}>
                <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:4}}>
                  DESCRIÇÃO ATUAL <span style={{color:"#444",fontWeight:400}}>(não editável)</span>
                </div>
                <div style={{fontSize:11,color:"#666",lineHeight:1.5}}>{desc}</div>
              </div>
            )}
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:5}}>
              ADICIONAR INFORMAÇÃO EXTRA <span style={{color:"#333",fontWeight:400}}>(opcional)</span>
            </div>
            <textarea value={extraDesc} onChange={e=>setExtraDesc(e.target.value)} rows={2}
              placeholder="Ex: Preço negociável, aceito troca..."
              style={{width:"100%",padding:"9px 12px",borderRadius:8,background:"#ffffff0a",
                border:"1px solid #ffd70022",color:"#dde",fontSize:12,outline:"none",
                fontFamily:"'Rajdhani',sans-serif",resize:"vertical",lineHeight:1.5}}/>
            <div style={{fontSize:9,color:"#444",marginTop:3}}>Será adicionada com a data de hoje</div>
          </div>
        )}

        {/* PERÍODO — bloqueado na edição */}
        {!isEdit ? (
          <div style={{marginBottom:10}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:6}}>PERÍODO DO ANÚNCIO</div>
            <div style={{display:"flex",gap:6}}>
              {[15,30,60].map(d=>(
                <button key={d} onClick={()=>setDias(d)} style={{flex:1,padding:"8px",borderRadius:8,
                  border:`1px solid ${dias===d?"#ffd700":"#ffffff15"}`,
                  background:dias===d?"#ffd70022":"transparent",
                  color:dias===d?"#ffd700":"#666",fontSize:11,fontWeight:700,cursor:"pointer"}}>{d} dias</button>
              ))}
            </div>
            <div style={{fontSize:9,color:"#444",marginTop:3}}>Expira em {dias} dias. Você será notificado ao expirar.</div>
          </div>
        ) : diasRestantes !== null && (
          <div style={{background:"#ffffff06",borderRadius:8,padding:"9px 12px",marginBottom:10,
            border:"1px solid #ffffff10"}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:2}}>PERÍODO DO ANÚNCIO</div>
            <div style={{fontSize:12,color:"#ffd700",fontWeight:700}}>
              ⏱ {diasRestantes} dias restantes
            </div>
            <div style={{fontSize:9,color:"#444",marginTop:2}}>
              Expira em {new Date(existing.expiresAt).toLocaleDateString("pt-BR")}
            </div>
          </div>
        )}

        {/* NOTIFICAÇÃO — só no novo */}
        {!isEdit && (
          <div style={{marginBottom:12}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:6}}>NOTIFICAÇÕES DE MATCH</div>
            <div style={{display:"flex",gap:6}}>
              {[{v:"push",l:"📱 Push"},{v:"email",l:"📧 Email"},{v:"ambos",l:"📱+📧 Ambos"}].map(n=>(
                <button key={n.v} onClick={()=>setNotifPref(n.v)} style={{flex:1,padding:"7px 4px",borderRadius:8,
                  border:`1px solid ${notifPref===n.v?"#38bdf8":"#ffffff15"}`,
                  background:notifPref===n.v?"#38bdf818":"transparent",
                  color:notifPref===n.v?"#38bdf8":"#666",fontSize:10,fontWeight:700,cursor:"pointer"}}>{n.l}</button>
              ))}
            </div>
          </div>
        )}

        {/* TERMO LGPD — só no novo anúncio */}
        {!isEdit&&(
          <div style={{marginBottom:14}}>
            <button onClick={()=>setShowTerm(p=>!p)} style={{width:"100%",padding:"10px 12px",borderRadius:8,
              cursor:"pointer",background:termAccepted?"#22c55e12":"#ffffff06",
              border:`1px solid ${termAccepted?"#22c55e33":"#ffffff10"}`,
              display:"flex",alignItems:"center",gap:8,textAlign:"left"}}>
              <div style={{width:18,height:18,borderRadius:4,flexShrink:0,
                background:termAccepted?"#22c55e":"#ffffff10",
                border:`2px solid ${termAccepted?"#22c55e":"#ffffff20"}`,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                {termAccepted&&<span style={{color:"#fff",fontSize:11}}>✓</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:termAccepted?"#22c55e":"#888"}}>
                  Li e aceito os termos de divulgação
                </div>
                <div style={{fontSize:9,color:"#555",marginTop:1}}>
                  Ao anunciar, seu número será exibido para compradores verificados
                </div>
              </div>
              <span style={{fontSize:10,color:"#555"}}>{showTerm?"▲":"▼"}</span>
            </button>
            {showTerm&&(
              <div style={{background:"#000000aa",borderRadius:8,padding:"12px",marginTop:6,
                fontSize:10,color:"#666",lineHeight:1.8,border:"1px solid #ffffff08"}}>
                <div style={{fontWeight:700,color:"#aaa",marginBottom:6,fontSize:11}}>
                  📋 TERMO DE DIVULGAÇÃO DE CONTATO — COLEZZARE
                </div>
                Ao publicar um anúncio de venda nesta plataforma, você declara que:
                <br/><br/>
                <b style={{color:"#888"}}>1.</b> Está ciente de que seu número de telefone cadastrado será exibido para usuários com plano Basic ou Plus, devidamente verificados.
                <br/><br/>
                <b style={{color:"#888"}}>2.</b> Autoriza o Colezzare a exibir seu número para fins de intermediação entre colecionadores.
                <br/><br/>
                <b style={{color:"#888"}}>3.</b> Compreende que o Colezzare não é responsável pela negociação, pagamento, envio ou qualquer transação entre as partes.
                <br/><br/>
                <b style={{color:"#888"}}>4.</b> Este aceite é registrado com data, hora, sistema operacional e navegador, conforme a LGPD (Lei nº 13.709/2018).
                <br/><br/>
                <div style={{color:"#444",fontSize:9}}>
                  Aceite em: {new Date().toLocaleString("pt-BR")} · {navigator.platform}
                </div>
                <button onClick={()=>{setTermAccepted(true);setShowTerm(false);}}
                  style={{width:"100%",marginTop:10,padding:"9px",borderRadius:8,border:"none",
                    cursor:"pointer",background:"linear-gradient(90deg,#22c55e,#16a34a)",
                    color:"#fff",fontSize:11,fontWeight:800}}>
                  ✓ Li e aceito os termos
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:10,
            border:"1px solid #ffffff15",background:"transparent",
            color:"#666",fontSize:12,fontWeight:700,cursor:"pointer"}}>Cancelar</button>
          <button onClick={handlePublish} disabled={!canPublish} style={{flex:2,padding:"12px",
            borderRadius:10,border:"none",cursor:canPublish?"pointer":"not-allowed",
            background:canPublish?"linear-gradient(90deg,#ffd700,#f59e0b)":"#ffffff0d",
            color:canPublish?"#000":"#444",fontSize:12,fontWeight:800,opacity:canPublish?1:0.6}}>
            {isEdit?"✓ Salvar alterações":"✓ Publicar Anúncio"}
          </button>
        </div>
      </div>
    </div>
  );
}
// ─── FORM DE BUSCA (quero comprar) ──────────────────────────────────────────
function BuyForm({ fig, onConfirm, onClose }) {
  const [whats, setWhats] = useState("");

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1100,background:"#000000cc",
      backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:520,
        background:"linear-gradient(180deg,#100420,#080812)",
        borderRadius:"20px 20px 0 0",border:"1px solid #a855f733",padding:"24px 18px 32px"}}>
        <div style={{fontSize:16,fontFamily:"'Cinzel',serif",fontWeight:900,color:"#a855f7",
          marginBottom:4}}>🔍 Buscar Vendedor</div>
        <div style={{fontSize:11,color:"#555",marginBottom:16}}>{fig.name}</div>

        <div style={{background:"#a855f711",border:"1px solid #a855f722",borderRadius:10,
          padding:"12px 14px",marginBottom:16,fontSize:11,color:"#c084fc",lineHeight:1.6}}>
          Ao confirmar, você será notificado quando aparecer um vendedor para esta figura. Deixe seu WhatsApp para que possam entrar em contato!
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:5}}>SEU WHATSAPP</div>
          <input value={whats} onChange={e=>setWhats(e.target.value)} placeholder="Ex: 11999990000"
            style={{width:"100%",padding:"9px 12px",borderRadius:8,background:"#ffffff0a",
              border:"1px solid #a855f722",color:"#dde",fontSize:12,outline:"none",
              fontFamily:"'Rajdhani',sans-serif"}}/>
        </div>

        <div style={{background:"#ffffff06",borderRadius:8,padding:"10px 12px",marginBottom:16,
          fontSize:10,color:"#555",lineHeight:1.6}}>
          ⚠️ O Colezzare apenas conecta compradores e vendedores. A negociação e transação são de responsabilidade exclusiva das partes envolvidas.
        </div>

        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid #ffffff15",
            background:"transparent",color:"#666",fontSize:12,fontWeight:700,cursor:"pointer"}}>
            Cancelar
          </button>
          <button onClick={()=>onConfirm({ativo:true,whats})}
            style={{flex:2,padding:"12px",borderRadius:10,border:"none",
              background:"linear-gradient(90deg,#a855f7,#7c3aed)",
              color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer"}}>
            🔍 Quero ser notificado
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FIGURE CARD ─────────────────────────────────────────────────────────────
function FigureCard({ fig, owned, wished, listing, wanted, collection, onOwned, onWish, onOpen, canSeePhotos=true, sellerCount=0, buyerCount=0 }) {
  const s = TS[fig.tipo] || {c:"#888",ic:"🎯"};
  const sc = SC[fig.saga] || "#888";
  const hasMatch = (listing?.vendendo && buyerCount>0) || (wanted?.ativo && sellerCount>0);
  const isBandai = owned && collection?.bandai;

  return (
    <div onClick={()=>onOpen(fig)}
      style={{background: owned?"linear-gradient(160deg,#041a0a,#072e14)":
        wished?"linear-gradient(160deg,#100420,#1c0835)":
        "linear-gradient(160deg,#08080f,#0e0e1c)",
        border:`1px solid ${owned?"#22c55e":wished?"#c084fc":s.c+"25"}`,
        borderRadius:12,overflow:"hidden",position:"relative",cursor:"pointer",
        display:"flex",flexDirection:"column",
        boxShadow:hasMatch?"0 0 20px #22c55e44":owned?"0 0 10px #22c55e18":wished?"0 0 10px #c084fc18":"none"}}>

      {/* Badges */}
      {hasMatch && (
        <div style={{flexShrink:0,background:"linear-gradient(90deg,#22c55e,#16a34a)",
          padding:"3px 0",textAlign:"center",fontSize:9,fontWeight:800,color:"#fff",letterSpacing:1}}>
          🎯 MATCH!
        </div>
      )}

      {/* Imagem — altura fixa */}
      <div style={{height:130,flexShrink:0,background:"linear-gradient(135deg,#06060e,#0d0d1c)",
        position:"relative",overflow:"hidden",
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        {!hasMatch && (owned||wished) && (
          <div style={{position:"absolute",top:6,right:6,zIndex:20,
            background:owned?"#22c55e":"#a855f7",
            borderRadius:20,padding:"2px 8px",fontSize:9,fontWeight:800,color:"#fff"}}>
            {owned?"✓ TENHO":"♡ QUERO"}
          </div>
        )}
        {/* Sempre tenta Cloudinary primeiro, fallback para fig.img, fallback para ícone */}
        <img src={`https://res.cloudinary.com/dr3sxytes/image/upload/figures/${fig.id}/1.jpg`}
          alt={fig.name}
          style={{width:"100%",height:"100%",objectFit:"contain",padding:6}}
          onError={e=>{
            if (fig.img && e.target.src !== fig.img) { e.target.src = fig.img; }
            else { e.target.style.display="none"; }
          }}/>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
          justifyContent:"center",zIndex:-1}}>
          <div style={{fontSize:30,filter:`drop-shadow(0 0 10px ${s.c}88)`}}>{s.ic}</div>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,
          background:`linear-gradient(90deg,transparent,${s.c}99,transparent)`}}/>
      </div>

      {/* Info — altura fixa */}
      <div style={{padding:"8px 10px 10px",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:11,color:"#e0e0ee",fontWeight:700,lineHeight:1.3,marginBottom:5,
          height:28,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
          {fig.name}
        </div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:8}}>
          <span style={{fontSize:8,padding:"1px 6px",borderRadius:4,fontWeight:800,
            background:fig.line==="EX"?"#ffd70022":"#ffffff10",
            color:fig.line==="EX"?"#ffd700":"#888",
            border:`1px solid ${fig.line==="EX"?"#ffd70040":"#ffffff10"}`}}>
            {fig.line}
          </span>
          <span style={{fontSize:8,padding:"1px 6px",borderRadius:4,
            background:`${sc}18`,color:sc,border:`1px solid ${sc}35`}}>{fig.saga}</span>
        </div>
        {/* Marketplace mini info */}
        {(sellerCount>0||buyerCount>0) && (
          <div style={{display:"flex",gap:4,marginBottom:8}}>
            {sellerCount>0&&<span style={{fontSize:8,background:"#22c55e18",color:"#22c55e",
              border:"1px solid #22c55e33",borderRadius:4,padding:"1px 5px"}}>
              🏷️ {sellerCount} vendendo
            </span>}
            {buyerCount>0&&<span style={{fontSize:8,background:"#a855f718",color:"#a855f7",
              border:"1px solid #a855f733",borderRadius:4,padding:"1px 5px"}}>
              🔍 {buyerCount} buscando
            </span>}
          </div>
        )}
        <div style={{display:"flex",gap:5}}>
          <button onClick={e=>{e.stopPropagation();onOwned(fig.id);}} style={{
            flex:1,padding:"5px 0",borderRadius:7,border:"none",cursor:"pointer",
            fontSize:10,fontWeight:800,transition:"all 0.15s",
            background:owned?"#22c55e":"#ffffff0d",color:owned?"#fff":"#555"}}>
            {owned?"✓ Tenho":"+ Tenho"}
          </button>
          <button onClick={e=>{e.stopPropagation();onWish(fig.id);}} style={{
            flex:1,padding:"5px 0",borderRadius:7,border:"none",cursor:"pointer",
            fontSize:10,fontWeight:800,transition:"all 0.15s",
            background:wished?"#a855f7":"#ffffff0d",color:wished?"#fff":"#555"}}>
            ♡ Quero
          </button>
        </div>
      </div>
    </div>
  );
}

function Chip({label,active,color,onClick}){
  return <button onClick={onClick} style={{padding:"4px 12px",borderRadius:20,border:"none",cursor:"pointer",
    fontSize:11,fontWeight:700,whiteSpace:"nowrap",transition:"all 0.15s",
    background:active?(color||"#ffd700"):"#ffffff0d",color:active?(color?"#fff":"#000"):"#555",
    boxShadow:active?`0 2px 10px ${(color||"#ffd700")}44`:"none"}}>{label}</button>;
}
function FilterSection({title,children}){
  return <div style={{marginBottom:8}}>
    <div style={{fontSize:9,color:"#444",fontWeight:800,letterSpacing:2,marginBottom:5}}>{title}</div>
    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{children}</div>
  </div>;
}

// ─── APP PRINCIPAL ───────────────────────────────────────────────────────────
// ─── EXPORT MODAL ─────────────────────────────────────────────────────────────
function ExportModal({ owned, wished, listings, collections, onClose }) {
  const [mode,    setMode]    = useState("gallery"); // gallery | list
  const [sort,    setSort]    = useState("edicao");
  const [showName, setShowName] = useState(true);
  const [source,  setSource]  = useState({tenho:true, quero:false});
  const [preview, setPreview] = useState(null);
  const [cols, setCols] = useState({
    nome:true, linha:true, tipo:true, saga:true, versao:true,
    lancamento:false, status:true, marca:true, pago:false,
    data:false, condicao:false, venda:false, notas:false
  });

  const ownedFigs  = ALL_FIGURES.filter(f => owned[f.id]);
  const wishedFigs = ALL_FIGURES.filter(f => wished[f.id]);
  const toggleCol  = k => setCols(p => ({...p,[k]:!p[k]}));

  const SORT_VER   = {"—":1,"V1":2,"V2":3,"V3":4,"V4":5,"EX":6,"Revival":7,"SoG":8,"Soul of Gold":8,"OCE":9,"Gold":9};
  const SORT_TIPO  = {"Cavaleiros de Bronze":1,"Cavaleiros de Prata":2,"Cavaleiros de Ouro":3,"Black Saints":4,"Cavaleiros de Aço":5,"God Warriors":6,"Marinas":7,"Surplice":8,"Espectrais":9,"God Cloth":10,"Divinos":11,"Spin-off":12,"Edição Especial":13};
  const SORT_SAGA  = {"Santuário":1,"Poseidon":2,"Asgard":3,"Hades":4,"Soul of Gold":5,"Filmes":6,"Especial":7};
  const SORT_EDICAO= {"—":1,"V1":2,"V2":3,"Cloth Myth":3,"Cloth Myth EX":4,"EX":4,"Revival":5,"SoG":6,"Soul of Gold":6};

  const getFigs = () => {
    const base = [
      ...(source.tenho ? ownedFigs  : []),
      ...(source.quero ? wishedFigs.filter(f=>!owned[f.id]) : []),
    ];
    const u = [...new Map(base.map(f=>[f.id,f])).values()];
    if (sort==="nome")       return u.sort((a,b)=>a.name.localeCompare(b.name));
    if (sort==="cronologico")return u.sort((a,b)=>(SORT_VER[a.ver]||9)-(SORT_VER[b.ver]||9));
    if (sort==="armadura")   return u.sort((a,b)=>(SORT_TIPO[a.tipo]||99)-(SORT_TIPO[b.tipo]||99));
    if (sort==="edicao")     return u.sort((a,b)=>(SORT_EDICAO[a.ver]||9)-(SORT_EDICAO[b.ver]||9) || (SORT_SAGA[a.saga]||9)-(SORT_SAGA[b.saga]||9));
    return u;
  };

  const figs = getFigs();
  const total = figs.length;

  const TC = {"Cavaleiros de Bronze":"#cd7f32","Cavaleiros de Ouro":"#ffd700","Cavaleiros de Prata":"#b0b8c8","God Cloth":"#f87171","God Warriors":"#60a5fa","Marinas":"#38bdf8","Espectrais":"#818cf8","Surplice":"#c084fc","Divinos":"#a78bfa","Black Saints":"#777","Spin-off":"#34d399","Edição Especial":"#f59e0b","Cavaleiros de Aço":"#94a3b8"};

  const generateGallery = () => {
    const cards = figs.map(f => {
      const imgUrl = `https://res.cloudinary.com/dr3sxytes/image/upload/figures/${f.id}/1.jpg`;
      const isOwned = !!owned[f.id];
      const tc = TC[f.tipo]||"#888";
      return `<div style="background:#09090f;border:1px solid ${isOwned?"#22c55e33":"#a855f733"};border-radius:8px;overflow:hidden;break-inside:avoid">
        <div style="position:relative;background:#06060e;aspect-ratio:1">
          <img src="${imgUrl}" style="width:100%;height:100%;object-fit:contain;padding:4px" onerror="this.style.display='none'"/>
          <div style="position:absolute;top:3px;right:3px;background:${isOwned?"#22c55e":"#a855f7"};color:#fff;font-size:6px;padding:1px 5px;border-radius:8px;font-weight:800">${isOwned?"✓":"♡"}</div>
        </div>
        ${showName?`<div style="padding:4px 5px;font-size:7px;color:#dde;font-weight:700;line-height:1.3;text-align:center;border-top:1px solid ${tc}22">${f.name}</div>`:""}
      </div>`;
    }).join("");

    const sortLabel = {nome:"Alfabética",cronologico:"Cronológica",armadura:"Por Armadura",edicao:"Por Edição"}[sort];
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Rajdhani:wght@600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#06060f;color:#dde;font-family:'Rajdhani',Arial,sans-serif;padding:16px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.no-print{display:none}}
</style></head><body>
<div class="no-print" style="position:sticky;top:0;background:#0d0d1e;border-bottom:1px solid #ffd70033;padding:8px 14px;display:flex;align-items:center;gap:10px;margin:-16px -16px 16px;z-index:100">
  <span style="flex:1;font-size:11px;color:#888">${total} figuras · ${sortLabel}</span>
  <button onclick="window.print()" style="background:linear-gradient(90deg,#ffd700,#ff8c00);border:none;border-radius:8px;padding:6px 14px;color:#000;font-size:11px;font-weight:800;cursor:pointer">🖨️ Salvar PDF</button>
</div>
<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
  <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ffd700,#ff6b00);display:flex;align-items:center;justify-content:center;font-size:18px">⭐</div>
  <div>
    <div style="font-family:'Cinzel',serif;font-size:15px;font-weight:900;background:linear-gradient(90deg,#ffd700,#ff8c00);-webkit-background-clip:text;-webkit-text-fill-color:transparent">COLEZZARE</div>
    <div style="font-size:7px;color:#555;letter-spacing:2px">GALERIA · ${sortLabel.toUpperCase()} · ${new Date().toLocaleDateString("pt-BR")}</div>
  </div>
</div>
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px">${cards}</div>
<div style="margin-top:14px;padding-top:8px;border-top:1px solid #ffffff08;font-size:7px;color:#333;text-align:center">Colezzare · ${total} figuras · ${new Date().toLocaleDateString("pt-BR")}</div>
</body></html>`;
    setPreview({type:"gallery", html});
  };

  const generateList = () => {
    // Gera CSV para Excel
    const headers = [];
    if (cols.nome)       headers.push("Nome");
    if (cols.linha)      headers.push("Linha");
    if (cols.tipo)       headers.push("Tipo");
    if (cols.saga)       headers.push("Saga");
    if (cols.versao)     headers.push("Versão");
    if (cols.lancamento) headers.push("Lançamento");
    if (cols.status)     headers.push("Status");
    if (cols.marca)      headers.push("Marca");
    if (cols.pago)       headers.push("Valor Pago");
    if (cols.data)       headers.push("Data Compra");
    if (cols.condicao)   headers.push("Condição");
    if (cols.venda)      headers.push("Anúncio Venda");
    if (cols.notas)      headers.push("Notas");

    const rows = figs.map(f => {
      const c = collections[f.id]||{};
      const l = listings[f.id]||{};
      const isOwned = !!owned[f.id];
      const brand = LICENSED_BRANDS.find(b=>b.id===(c.brand||(c.bandai?"bandai":"nao_sei")));
      const row = [];
      if (cols.nome)       row.push(`"${f.name}"`);
      if (cols.linha)      row.push(`"${f.line||"—"}"`);
      if (cols.tipo)       row.push(`"${f.tipo||"—"}"`);
      if (cols.saga)       row.push(`"${f.saga||"—"}"`);
      if (cols.versao)     row.push(`"${f.ver||"—"}"`);
      if (cols.lancamento) row.push(`"${f.lancamento||"—"}"`);
      if (cols.status)     row.push(`"${isOwned?"Tenho":"Quero"}"`);
      if (cols.marca)      row.push(`"${brand?.label||"—"}"`);
      if (cols.pago)       row.push(`"${c.pago||"—"}"`);
      if (cols.data)       row.push(`"${c.data||"—"}"`);
      if (cols.condicao)   row.push(`"${c.condition||"—"}"`);
      if (cols.venda)      row.push(`"${l.vendendo?(l.precoVenda||"—"):"—"}"`);
      if (cols.notas)      row.push(`"${c.notas||"—"}"`);
      return row.join(";");
    });

    const csv = "\uFEFF" + [headers.join(";"), ...rows].join("\n");
    setPreview({type:"list", csv, headers, figs});
  };

  const downloadCSV = () => {
    if (!preview?.csv) return;
    const blob = new Blob([preview.csv], {type:"text/csv;charset=utf-8"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `colecao-colezzare-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const downloadHTML = () => {
    if (!preview?.html) return;
    const blob = new Blob([preview.html], {type:"text/html"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `galeria-colezzare-${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  // Tela de preview
  if (preview) return (
    <div style={{position:"fixed",inset:0,zIndex:2000,background:"#06060f",display:"flex",flexDirection:"column"}}>
      <div style={{background:"#0d0d1e",padding:"10px 14px",display:"flex",alignItems:"center",
        gap:10,borderBottom:"1px solid #ffd70022",flexShrink:0}}>
        <button onClick={()=>setPreview(null)} style={{background:"#ffffff12",border:"none",
          borderRadius:8,padding:"6px 12px",color:"#dde",fontSize:12,fontWeight:700,cursor:"pointer"}}>
          ← Voltar
        </button>
        <span style={{flex:1,fontSize:11,color:"#888"}}>
          {total} figuras · {preview.type==="gallery"?"🖼️ Galeria":"📊 Lista CSV"}
        </span>
        <button onClick={preview.type==="gallery"?downloadHTML:downloadCSV}
          style={{background:"linear-gradient(90deg,#ffd700,#ff8c00)",border:"none",
            borderRadius:8,padding:"7px 14px",color:"#000",fontSize:11,fontWeight:800,cursor:"pointer"}}>
          {preview.type==="gallery"?"💾 Baixar HTML":"📥 Baixar CSV"}
        </button>
      </div>
      {preview.type==="gallery" ? (
        <iframe srcDoc={preview.html} style={{flex:1,border:"none",width:"100%"}} title="Galeria"/>
      ) : (
        <div style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",touchAction:"pan-y",padding:16}}>
          <div style={{fontSize:12,color:"#22c55e",fontWeight:700,marginBottom:12}}>
            ✓ CSV pronto! {total} figuras, {Object.values(cols).filter(Boolean).length} colunas.
          </div>
          <div style={{background:"#0d0d1e",borderRadius:10,padding:12,overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
              <thead>
                <tr>{preview.headers.map(h=>(
                  <th key={h} style={{padding:"6px 8px",color:"#ffd700",fontWeight:800,
                    textAlign:"left",borderBottom:"1px solid #ffffff15",whiteSpace:"nowrap"}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {preview.figs.slice(0,10).map((f,i)=>{
                  const c=collections[f.id]||{}, l=listings[f.id]||{};
                  const isOwned=!!owned[f.id];
                  const brand=LICENSED_BRANDS.find(b=>b.id===(c.brand||(c.bandai?"bandai":"nao_sei")));
                  return (
                    <tr key={f.id} style={{background:i%2===0?"#09090f":"#0d0d1c"}}>
                      {cols.nome       && <td style={{padding:"5px 8px",color:"#dde",whiteSpace:"nowrap"}}>{f.name}</td>}
                      {cols.linha      && <td style={{padding:"5px 8px",color:"#ffd700"}}>{f.line}</td>}
                      {cols.tipo       && <td style={{padding:"5px 8px",color:"#888",whiteSpace:"nowrap"}}>{f.tipo?.replace("Cavaleiros de ","")}</td>}
                      {cols.saga       && <td style={{padding:"5px 8px",color:"#888"}}>{f.saga}</td>}
                      {cols.versao     && <td style={{padding:"5px 8px",color:"#888"}}>{f.ver}</td>}
                      {cols.lancamento && <td style={{padding:"5px 8px",color:"#888"}}>{f.lancamento||"—"}</td>}
                      {cols.status     && <td style={{padding:"5px 8px",color:isOwned?"#22c55e":"#a855f7",fontWeight:700}}>{isOwned?"✓ Tenho":"♡ Quero"}</td>}
                      {cols.marca      && <td style={{padding:"5px 8px",color:"#888"}}>{brand?.label||"—"}</td>}
                      {cols.pago       && <td style={{padding:"5px 8px",color:"#22c55e"}}>{c.pago||"—"}</td>}
                      {cols.data       && <td style={{padding:"5px 8px",color:"#888"}}>{c.data||"—"}</td>}
                      {cols.condicao   && <td style={{padding:"5px 8px",color:"#888"}}>{c.condition||"—"}</td>}
                      {cols.venda      && <td style={{padding:"5px 8px",color:"#ffd700"}}>{l.vendendo?(l.precoVenda||"—"):"—"}</td>}
                      {cols.notas      && <td style={{padding:"5px 8px",color:"#888"}}>{c.notas||"—"}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {total>10 && <div style={{fontSize:10,color:"#555",marginTop:8,textAlign:"center"}}>+ {total-10} figuras no arquivo CSV</div>}
          </div>
          <div style={{marginTop:12,fontSize:11,color:"#555",lineHeight:1.6}}>
            💡 Abra o CSV no Excel ou Google Sheets. Importe como UTF-8 com separador ponto-e-vírgula.
          </div>
        </div>
      )}
    </div>
  );

  // Tela de configuração
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,
      background:"#000000cc",backdropFilter:"blur(8px)",
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:500,
        background:"linear-gradient(180deg,#0d0d20,#080812)",
        borderRadius:"20px 20px 0 0",maxHeight:"88dvh",
        display:"flex",flexDirection:"column"}}>

        {/* Handle */}
        <div style={{flexShrink:0,display:"flex",justifyContent:"center",padding:"10px 0 4px"}}>
          <div style={{width:36,height:4,background:"#ffffff20",borderRadius:4}}/>
        </div>

        <div style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",
          touchAction:"pan-y",padding:"0 16px 24px"}}>

          <h2 style={{fontFamily:"'Cinzel',serif",fontSize:16,fontWeight:900,
            color:"#dde",marginBottom:4}}>📤 Exportar Coleção</h2>
          <p style={{fontSize:11,color:"#555",marginBottom:16}}>
            {total} figura{total!==1?"s":""} selecionadas
          </p>

          {/* Fonte */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>EXPORTAR</div>
            <div style={{display:"flex",gap:6}}>
              {[{k:"tenho",l:`✓ Tenho (${ownedFigs.length})`},{k:"quero",l:`♡ Quero (${wishedFigs.length})`}].map(o=>(
                <button key={o.k} onClick={()=>setSource(p=>({...p,[o.k]:!p[o.k]}))}
                  style={{flex:1,padding:"8px",borderRadius:10,border:"none",cursor:"pointer",
                    background:source[o.k]?"#ffd70018":"#ffffff0a",
                    color:source[o.k]?"#ffd700":"#555",
                    outline:`1px solid ${source[o.k]?"#ffd70044":"#ffffff10"}`,
                    fontSize:12,fontWeight:800}}>
                  {source[o.k]?"✓ ":""}{o.l}
                </button>
              ))}
            </div>
          </div>

          {/* Formato */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>FORMATO</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {v:"gallery",l:"🖼️ Galeria",d:"Imagens lado a lado • PDF/HTML"},
                {v:"list",   l:"📊 Planilha",d:"Colunas detalhadas • CSV/Excel"},
              ].map(m=>(
                <button key={m.v} onClick={()=>setMode(m.v)}
                  style={{padding:"10px",borderRadius:10,cursor:"pointer",textAlign:"left",
                    outline:`2px solid ${mode===m.v?"#ffd700":"#ffffff10"}`,
                    background:mode===m.v?"#ffd70012":"transparent"}}>
                  <div style={{fontSize:13,fontWeight:800,color:mode===m.v?"#ffd700":"#888",marginBottom:2}}>{m.l}</div>
                  <div style={{fontSize:9,color:"#555"}}>{m.d}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Ordenação */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>ORDENAR POR</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {[
                {v:"edicao",     l:"📅 Edições"},
                {v:"nome",       l:"🔤 Alfabética"},
                {v:"cronologico",l:"🕐 Cronológica"},
                {v:"armadura",   l:"⚔️ Armadura"},
              ].map(s=>(
                <button key={s.v} onClick={()=>setSort(s.v)}
                  style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",
                    fontSize:11,fontWeight:700,
                    background:sort===s.v?"#ffd700":"#ffffff0d",
                    color:sort===s.v?"#000":"#666"}}>
                  {s.l}
                </button>
              ))}
            </div>
          </div>

          {/* Opções específicas por modo */}
          {mode==="gallery" && (
            <div style={{marginBottom:14}}>
              <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>OPÇÕES DA GALERIA</div>
              <button onClick={()=>setShowName(p=>!p)}
                style={{padding:"8px 14px",borderRadius:20,border:"none",cursor:"pointer",
                  fontSize:11,fontWeight:700,
                  background:showName?"#ffd70022":"#ffffff0d",
                  color:showName?"#ffd700":"#666",
                  outline:`1px solid ${showName?"#ffd70044":"#ffffff10"}`}}>
                {showName?"✓ ":""}Mostrar nome abaixo da imagem
              </button>
            </div>
          )}

          {mode==="list" && (
            <div style={{marginBottom:14}}>
              <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>COLUNAS DA PLANILHA</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {[
                  {k:"nome",       l:"Nome"},
                  {k:"linha",      l:"Linha"},
                  {k:"tipo",       l:"Tipo"},
                  {k:"saga",       l:"Saga"},
                  {k:"versao",     l:"Versão"},
                  {k:"lancamento", l:"Lançamento"},
                  {k:"status",     l:"Tenho/Quero"},
                  {k:"marca",      l:"Marca"},
                  {k:"pago",       l:"Valor Pago"},
                  {k:"data",       l:"Data Compra"},
                  {k:"condicao",   l:"Condição"},
                  {k:"venda",      l:"Anúncio"},
                  {k:"notas",      l:"Notas"},
                ].map(c=>(
                  <button key={c.k} onClick={()=>toggleCol(c.k)}
                    style={{padding:"5px 10px",borderRadius:20,border:"none",cursor:"pointer",
                      fontSize:11,fontWeight:cols[c.k]?700:400,
                      background:cols[c.k]?"#ffd70022":"#ffffff0d",
                      color:cols[c.k]?"#ffd700":"#555",
                      outline:`1px solid ${cols[c.k]?"#ffd70044":"#ffffff10"}`}}>
                    {cols[c.k]?"✓ ":""}{c.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose}
              style={{flex:1,padding:"12px",borderRadius:10,
                border:"1px solid #ffffff15",background:"transparent",
                color:"#666",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              Cancelar
            </button>
            <button onClick={mode==="gallery"?generateGallery:generateList}
              disabled={total===0}
              style={{flex:2,padding:"12px",borderRadius:10,border:"none",cursor:"pointer",
                background:total===0?"#ffffff10":"linear-gradient(90deg,#ffd700,#ff8c00)",
                color:total===0?"#555":"#000",fontSize:13,fontWeight:800}}>
              {total===0?"Selecione figuras":mode==="gallery"?`🖼️ Gerar Galeria (${total})`:`📊 Gerar Planilha (${total})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MARCAS ───────────────────────────────────────────────────────────────────
const LICENSED_BRANDS = [
  { id:"bandai",  label:"Bandai Original",    short:"BANDAI", color:"#cc0000", bg:"#cc0000", textColor:"#fff",    oficial:true,  logo:"https://res.cloudinary.com/dr3sxytes/image/upload/brands/bandai-logo.png", desc:"Figura oficial Bandai / Tamashii Nations" },
  { id:"custom",  label:"Fabricação Própria", short:"FAB",    color:"#6366f1", bg:"#312e81", textColor:"#a5b4fc", oficial:null,  desc:"Peça artesanal ou produção independente" },
  { id:"replica", label:"Réplica / Bootleg",  short:"REP",    color:"#f59e0b", bg:"#451a03", textColor:"#fcd34d", oficial:false, desc:"Cópia não oficial sem licença" },
  { id:"nao_sei", label:"Não identificada",   short:"?",      color:"#444",    bg:"#222",    textColor:"#666",    oficial:null,  desc:"" },
];

function BrandBadge({ brandId, short, size="sm" }) {
  const b = LICENSED_BRANDS.find(x=>x.id===brandId);
  if (!b || brandId==="nao_sei") return null;
  const h = size==="lg" ? 18 : 13;
  if (b.logo && size==="lg") return (
    <div style={{background:b.color,borderRadius:4,padding:"2px 6px",display:"inline-flex",alignItems:"center"}}>
      <img src={b.logo} alt={b.label}
        style={{height:h,width:"auto",flexShrink:0,objectFit:"contain"}}
        onError={e=>{e.target.style.display="none";}}/>
    </div>
  );
  const st = size==="lg" ? {fontSize:9,padding:"2px 7px",borderRadius:5} : {fontSize:7,padding:"1px 4px",borderRadius:3};
  return (
    <span style={{background:b.color,color:"#fff",fontWeight:900,
      fontFamily:"Arial,sans-serif",letterSpacing:0.5,...st,flexShrink:0}}>
      {b.short||b.label}
    </span>
  );
}

function BrandSelector({ value, onChange, otherBrand, onOtherChange }) {
  const [open, setOpen] = useState(false);
  const sel = LICENSED_BRANDS.find(b=>b.id===value) || LICENSED_BRANDS[LICENSED_BRANDS.length-1];

  const oficiais    = LICENSED_BRANDS.filter(b=>b.oficial===true);
  const naoOficiais = LICENSED_BRANDS.filter(b=>b.oficial===false);
  const outros      = LICENSED_BRANDS.filter(b=>b.oficial===null);

  return (
    <div>
      <button onClick={()=>setOpen(p=>!p)} style={{
        width:"100%",padding:"10px 12px",borderRadius:10,cursor:"pointer",
        border:`2px solid ${sel.color}44`,background:`${sel.color}10`,
        display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
        <div style={{width:48,height:32,borderRadius:6,flexShrink:0,
          background:sel.bg,display:"flex",alignItems:"center",justifyContent:"center",
          border: sel.oficial===false ? "1px solid #475569" : "none"}}>
          <span style={{fontSize:sel.short.length>4?6:7,fontWeight:900,color:sel.textColor,
            letterSpacing:0.5,fontFamily:"Arial,sans-serif",textAlign:"center",
            padding:"0 3px",lineHeight:1}}>{sel.short}</span>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:12,fontWeight:800,color:sel.color}}>{sel.label}</span>
            {sel.oficial===true&&<span style={{fontSize:8,background:"#22c55e22",color:"#22c55e",
              border:"1px solid #22c55e33",borderRadius:10,padding:"1px 5px",fontWeight:700}}>OFICIAL</span>}
            {sel.oficial===false&&<span style={{fontSize:8,background:"#f8717122",color:"#f87171",
              border:"1px solid #f8717133",borderRadius:10,padding:"1px 5px",fontWeight:700}}>NÃO OFICIAL</span>}
          </div>
          {sel.desc&&<div style={{fontSize:9,color:"#555",marginTop:1}}>{sel.desc}</div>}
        </div>
        <span style={{fontSize:11,color:"#555"}}>{open?"▲":"▼"}</span>
      </button>

      {open && (
        <div style={{background:"#0d0d1e",border:"1px solid #ffffff10",borderRadius:10,
          marginTop:6,overflow:"hidden",maxHeight:300,overflowY:"scroll",WebkitOverflowScrolling:"touch",touchAction:"pan-y"}}>

          {/* Oficiais */}
          <div style={{padding:"6px 12px 3px",fontSize:8,color:"#22c55e",
            fontWeight:700,letterSpacing:1,background:"#22c55e08"}}>
            ✓ MARCAS OFICIAIS / LICENCIADAS
          </div>
          {oficiais.map(b=><BrandOption key={b.id} b={b} value={value} onChange={v=>{onChange(v);setOpen(false);}}/>)}

          {/* Não oficiais */}
          <div style={{padding:"6px 12px 3px",fontSize:8,color:"#f87171",
            fontWeight:700,letterSpacing:1,background:"#f8717108",borderTop:"1px solid #ffffff08"}}>
            ⚠️ NÃO OFICIAIS (clones chineses)
          </div>
          {naoOficiais.map(b=><BrandOption key={b.id} b={b} value={value} onChange={v=>{onChange(v);setOpen(false);}}/>)}

          {/* Outros */}
          <div style={{borderTop:"1px solid #ffffff08"}}>
            {outros.map(b=><BrandOption key={b.id} b={b} value={value} onChange={v=>{onChange(v);setOpen(false);}}/>)}
          </div>
        </div>
      )}

      {value==="outro" && (
        <input value={otherBrand||""} onChange={e=>onOtherChange(e.target.value)}
          placeholder="Digite o nome da marca..."
          style={{width:"100%",marginTop:6,padding:"8px 12px",borderRadius:8,
            background:"#ffffff0a",border:"1px solid #ffffff15",
            color:"#dde",fontSize:12,outline:"none",fontFamily:"'Rajdhani',sans-serif"}}/>
      )}
    </div>
  );
}

function BrandOption({ b, value, onChange }) {
  return (
    <button onClick={()=>onChange(b.id)}
      style={{width:"100%",padding:"8px 12px",border:"none",cursor:"pointer",
        background:value===b.id?`${b.color}22`:"transparent",textAlign:"left",
        display:"flex",alignItems:"center",gap:10,
        borderBottom:"1px solid #ffffff06",
        borderLeft:value===b.id?`3px solid ${b.color}`:"3px solid transparent"}}>
      <div style={{width:36,height:24,borderRadius:4,flexShrink:0,
        background:b.bg,display:"flex",alignItems:"center",justifyContent:"center",
        border: b.oficial===false ? "1px solid #475569" : "none"}}>
        <span style={{fontSize:b.short.length>4?5:6,fontWeight:900,color:b.textColor,
          fontFamily:"Arial,sans-serif",letterSpacing:0.5,padding:"0 3px",
          textAlign:"center",lineHeight:1}}>{b.short}</span>
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:11,fontWeight:700,color:value===b.id?b.color:"#aaa"}}>{b.label}</div>
        {b.desc&&<div style={{fontSize:9,color:"#555"}}>{b.desc}</div>}
      </div>
      {value===b.id&&<span style={{color:b.color,fontSize:12,flexShrink:0}}>✓</span>}
    </button>
  );
}


// ─── REPORT MODAL — Figura Faltando ──────────────────────────────────────────
function ReportModal({ onClose }) {
  const [categoria, setCategoria] = useState(""); // "problema" | "ideia" | "sugestao" | "catalogo"
  const [detalhe,   setDetalhe]   = useState("");
  const [submitting,setSubmitting]= useState(false);
  const [enviado,   setEnviado]   = useState(false);

  const CATEGORIAS = [
    { v:"problema",  ic:"🐛", l:"Problema/Bug",    d:"Algo não está funcionando corretamente",  cor:"#f87171" },
    { v:"ideia",     ic:"💡", l:"Ideia",            d:"Tenho uma ideia para melhorar o app",     cor:"#ffd700" },
    { v:"sugestao",  ic:"✨", l:"Sugestão",         d:"Quero sugerir uma melhoria ou recurso",   cor:"#a855f7" },
    { v:"catalogo",  ic:"📦", l:"Catálogo",         d:"Figura faltando, erro de dados, novo lançamento", cor:"#22c55e" },
  ];

  const handleSubmit = async () => {
    if (!categoria || !detalhe.trim()) return;
    setSubmitting(true);
    await api.post("/figures/suggestions", {
      name: `[${categoria.toUpperCase()}] ${detalhe.substring(0,60)}`,
      notes: detalhe,
      line: categoria,
      status: "pending",
    }).catch(()=>{});
    setSubmitting(false);
    setEnviado(true);
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,
      background:"#000000cc",backdropFilter:"blur(8px)",
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:500,
        background:"linear-gradient(180deg,#0f0a1e,#080812)",
        borderRadius:"20px 20px 0 0",border:"1px solid #ffffff15",
        padding:"20px 18px 36px",maxHeight:"90vh",overflowY:"scroll",
        WebkitOverflowScrolling:"touch",touchAction:"pan-y"}}>

        <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
          <div style={{width:36,height:4,background:"#ffffff20",borderRadius:4}}/>
        </div>

        {enviado ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:52,marginBottom:16}}>🙏</div>
            <h2 style={{fontFamily:"'Cinzel',serif",fontSize:16,color:"#22c55e",marginBottom:8}}>
              Obrigado!
            </h2>
            <p style={{fontSize:12,color:"#888",lineHeight:1.7,marginBottom:20}}>
              Seu feedback foi enviado! Nossa equipe vai analisar em breve.
            </p>
            <button onClick={onClose} style={{padding:"12px 32px",borderRadius:20,border:"none",
              cursor:"pointer",background:"linear-gradient(90deg,#22c55e,#16a34a)",
              color:"#fff",fontSize:13,fontWeight:800}}>
              Fechar
            </button>
          </div>
        ) : (
          <>
            <h2 style={{fontFamily:"'Cinzel',serif",fontSize:15,color:"#ffd700",marginBottom:4}}>
              💬 Feedback
            </h2>
            <p style={{fontSize:12,color:"#555",marginBottom:16}}>
              Problemas, ideias ou sugestões — queremos ouvir você!
            </p>

            {/* Categorias */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {CATEGORIAS.map(c=>(
                <button key={c.v} onClick={()=>setCategoria(c.v)}
                  style={{padding:"12px 10px",borderRadius:12,border:"none",cursor:"pointer",
                    textAlign:"left",
                    background:categoria===c.v?`${c.cor}22`:"#ffffff08",
                    outline:categoria===c.v?`2px solid ${c.cor}66`:"none"}}>
                  <div style={{fontSize:22,marginBottom:4}}>{c.ic}</div>
                  <div style={{fontSize:12,fontWeight:800,color:categoria===c.v?c.cor:"#dde"}}>{c.l}</div>
                  <div style={{fontSize:10,color:"#555",marginTop:2,lineHeight:1.3}}>{c.d}</div>
                </button>
              ))}
            </div>

            {/* Texto */}
            {categoria && (
              <>
                <textarea
                  value={detalhe}
                  onChange={e=>setDetalhe(e.target.value)}
                  placeholder={
                    categoria==="problema" ? "Descreva o problema com detalhes..." :
                    categoria==="ideia"    ? "Conta sua ideia..." :
                    categoria==="sugestao" ? "Qual melhoria você sugere?" :
                    "Nome da figura, erro ou lançamento..."
                  }
                  rows={4}
                  style={{width:"100%",padding:"12px",borderRadius:10,
                    background:"#ffffff08",border:"1px solid #ffffff15",
                    color:"#dde",fontSize:12,resize:"none",outline:"none",
                    marginBottom:14,fontFamily:"'Rajdhani',sans-serif"}}/>

                <button onClick={handleSubmit} disabled={submitting||!detalhe.trim()}
                  style={{width:"100%",padding:"13px",borderRadius:12,border:"none",
                    cursor:"pointer",fontSize:13,fontWeight:800,
                    background:detalhe.trim()?"linear-gradient(90deg,#ffd700,#ff8c00)":"#ffffff10",
                    color:detalhe.trim()?"#000":"#555",
                    opacity:submitting?0.7:1}}>
                  {submitting?"Enviando...":"📤 Enviar feedback"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function UserSettingsScreen({ user, onClose, onSave, onAdmin, pendingCount=0 }) {
  const loadPref = (k, d) => { try { return JSON.parse(localStorage.getItem(k)||d); } catch { return JSON.parse(d); }};
  const [defaultBrand,    setDefaultBrand]    = useState(()=>loadPref("ssv8_pref_brand",   '"nao_sei"'));
  const [defaultCurrency, setDefaultCurrency] = useState(()=>loadPref("ssv8_pref_currency",'"BRL"'));
  const [defaultCondition,setDefaultCondition]= useState(()=>loadPref("ssv8_pref_condition",'"like_new"'));
  const [saved, setSaved] = useState(false);
  const [openDrop, setOpenDrop] = useState(null); // qual dropdown está aberto

  const save = () => {
    localStorage.setItem("ssv8_pref_brand",    JSON.stringify(defaultBrand));
    localStorage.setItem("ssv8_pref_currency", JSON.stringify(defaultCurrency));
    localStorage.setItem("ssv8_pref_condition",JSON.stringify(defaultCondition));
    setSaved(true);
    setTimeout(()=>{ setSaved(false); onSave && onSave(); }, 1000);
  };

  const Dropdown = ({id, label, options, value, onChange}) => {
    const sel = options.find(o=>o.v===value);
    const isOpen = openDrop===id;
    return (
      <div style={{padding:"12px 0",borderBottom:"1px solid #ffffff08",position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          cursor:"pointer"}} onClick={()=>setOpenDrop(isOpen?null:id)}>
          <span style={{fontSize:12,color:"#aaa"}}>{label}</span>
          <div style={{display:"flex",alignItems:"center",gap:8,
            background:"#ffffff0a",borderRadius:8,padding:"7px 12px",
            border:`1px solid ${isOpen?"#ffd70044":"#ffffff10"}`,minWidth:120}}>
            <span style={{fontSize:12,fontWeight:700,color:"#ffd700",flex:1}}>{sel?.l||"—"}</span>
            <span style={{fontSize:10,color:"#555",transition:"transform 0.2s",
              transform:isOpen?"rotate(180deg)":"none"}}>▼</span>
          </div>
        </div>
        {isOpen && (
          <div style={{position:"absolute",right:0,top:"100%",zIndex:100,
            background:"#0d0d1e",border:"1px solid #ffd70033",borderRadius:10,
            overflow:"hidden",minWidth:160,boxShadow:"0 8px 24px #00000088"}}>
            {options.map(o=>(
              <button key={o.v} onClick={()=>{onChange(o.v);setOpenDrop(null);}}
                style={{width:"100%",padding:"11px 14px",border:"none",cursor:"pointer",
                  textAlign:"left",fontSize:12,fontWeight:o.v===value?800:400,
                  background:o.v===value?"#ffd70018":"transparent",
                  color:o.v===value?"#ffd700":"#aaa",display:"flex",alignItems:"center",gap:8,
                  borderBottom:"1px solid #ffffff08"}}>
                {o.v===value && <span style={{color:"#ffd700",fontSize:10}}>✓</span>}
                {o.l}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:2000,background:"#06060f",
      display:"flex",flexDirection:"column",fontFamily:"'Rajdhani',sans-serif"}}
      onClick={()=>setOpenDrop(null)}>

      {/* Header */}
      <div style={{flexShrink:0,padding:"14px 16px",borderBottom:"1px solid #ffffff08",
        display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onClose} style={{background:"#ffffff10",border:"none",borderRadius:8,
          padding:"6px 12px",color:"#aaa",cursor:"pointer",fontSize:12}}>← Voltar</button>
        <div style={{fontSize:16,fontWeight:900,color:"#fff"}}>⚙️ Configurações</div>
      </div>

      {/* Perfil compacto */}
      <div style={{flexShrink:0,padding:"12px 16px",borderBottom:"1px solid #ffffff08",
        display:"flex",alignItems:"center",gap:12,background:"#ffffff05"}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:"#ffd70022",color:"#ffd700",
          display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:18,flexShrink:0}}>
          {user?.name?.[0]?.toUpperCase()||"?"}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>{user?.name}</div>
          <div style={{fontSize:10,color:"#555"}}>@{user?.username||"—"} · <span style={{color:"#ffd700"}}>{user?.plan==="free"?"Free":user?.plan==="basic"?"Basic":"Plus"}</span>
            {user?.verified&&<span style={{color:"#22c55e",marginLeft:6}}>✓ Verificado</span>}
          </div>
        </div>
      </div>

      {/* Preferências com dropdowns */}
      <div style={{flex:1,padding:"0 16px"}} onClick={e=>e.stopPropagation()}>
        <Dropdown
          id="brand"
          label="🏷️ Marca padrão"
          value={defaultBrand}
          onChange={setDefaultBrand}
          options={[
            {v:"bandai",  l:"🔴 Bandai Original"},
            {v:"custom",  l:"🔵 Fabricação Própria"},
            {v:"replica", l:"⚠️ Réplica / Bootleg"},
            {v:"nao_sei", l:"❓ Não identificada"},
          ]}
        />
        <Dropdown
          id="currency"
          label="💰 Moeda"
          value={defaultCurrency}
          onChange={setDefaultCurrency}
          options={[
            {v:"BRL",l:"🇧🇷 Real (BRL)"},
            {v:"USD",l:"🇺🇸 Dólar (USD)"},
            {v:"EUR",l:"🇪🇺 Euro (EUR)"},
            {v:"JPY",l:"🇯🇵 Iene (JPY)"},
          ]}
        />
        <Dropdown
          id="condition"
          label="📦 Condição padrão"
          value={defaultCondition}
          onChange={setDefaultCondition}
          options={[
            {v:"new",       l:"🌟 Novo"},
            {v:"like_new",  l:"✨ Seminovo"},
            {v:"used",      l:"📦 Usado"},
            {v:"incomplete",l:"⚠️ Incompleto"},
          ]}
        />
      </div>

      {/* Botões fixos no rodapé */}
      <div style={{flexShrink:0,padding:"12px 16px 32px",display:"flex",flexDirection:"column",gap:8,
        borderTop:"1px solid #ffffff08"}}>
        <button onClick={save} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",
          cursor:"pointer",fontSize:14,fontWeight:800,
          background:saved?"#22c55e":"linear-gradient(90deg,#ffd700,#ff8c00)",
          color:saved?"#fff":"#000",transition:"all 0.3s"}}>
          {saved?"✓ Salvo!":"Salvar preferências"}
        </button>
        {onAdmin && (
          <button onClick={()=>{onClose&&onClose();onAdmin();}}
            style={{width:"100%",padding:"11px",borderRadius:12,
              border:"1px solid #ffd70033",cursor:"pointer",
              fontSize:13,fontWeight:700,background:"#ffd70011",color:"#ffd700",
              position:"relative"}}>
            ⚙️ Painel Admin
            {pendingCount>0 && (
              <span style={{position:"absolute",top:8,right:12,
                background:"#f87171",borderRadius:20,padding:"1px 6px",
                fontSize:10,color:"#fff",fontWeight:900}}>{pendingCount}</span>
            )}
          </button>
        )}
        <button onClick={()=>{ onClose&&onClose(); window.__colezzareLogout&&window.__colezzareLogout(); }}
          style={{width:"100%",padding:"11px",borderRadius:12,border:"1px solid #ff444433",
            cursor:"pointer",fontSize:13,fontWeight:700,background:"#ff444411",color:"#ff6666"}}>
          🚪 Sair da conta
        </button>
      </div>
    </div>
  );
}

// ─── ONLINE COUNTER ──────────────────────────────────────────────────────────
// ─── VERIFICATION TICKER ─────────────────────────────────────────────────────
function VerificationTicker({ onOpen }) {
  const [xp,      setXp]      = useState(200);
  const [credits, setCredits] = useState(20);

  useEffect(()=>{
    api.get("/gamification/config").then(data=>{
      if (!Array.isArray(data)) return;
      const v = data.find(c=>c.action==="verify_account");
      if (v) { setXp(v.xp||0); setCredits(v.credits||0); }
    }).catch(()=>{});
  },[]);

  const msg = [
    xp>0 && credits>0 ? `✅ Verifique sua conta e ganhe +${xp} XP e +${credits} créditos` :
    xp>0 ? `✅ Verifique sua conta e ganhe +${xp} XP` :
    credits>0 ? `✅ Verifique sua conta e ganhe +${credits} créditos` :
    `✅ Verifique sua conta`,
    `Mais credibilidade no marketplace`,
    `Selo de verificado`,
    `Clique para verificar agora →`,
  ].filter(Boolean).join(" \u00A0·\u00A0 ");

  return (
    <button onClick={onOpen}
      style={{flexShrink:0,width:"100%",background:"#0d0d1e",
        border:"none",borderBottom:"1px solid #ffd70022",cursor:"pointer",
        padding:"5px 0",overflow:"hidden",position:"relative",height:26}}>
      <div style={{
        display:"inline-block",
        whiteSpace:"nowrap",fontSize:10,color:"#ffd700",fontWeight:700,
        animation:"tickerMove 20s linear infinite",position:"absolute",top:"50%",transform:"translateY(-50%)"}}>
        <style>{`@keyframes tickerMove{0%{left:100%}100%{left:-100%}}`}</style>
        {msg}
      </div>
    </button>
  );
}

function OnlineCounter() {
  const [count, setCount] = useState(null);

  useEffect(()=>{
    const load = async () => {
      const data = await api.get("/auth/online-count").catch(()=>null);
      if (data?.count !== undefined) setCount(data.count);
    };
    load();
    const interval = setInterval(load, 60*1000); // atualiza a cada 1 min
    return () => clearInterval(interval);
  },[]);

  if (count === null) return null;

  return (
    <div style={{display:"flex",alignItems:"center",gap:4,
      fontSize:10,color:"#22c55e",fontWeight:700,flexShrink:0}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>
      {count} online
    </div>
  );
}

// ─── GAMIFICATION WIDGET (Perfil) — só créditos e indicação ──────────────────
const LEVELS_CONFIG = [
  { level:1, name:"Recruta",             xp:0,     color:"#888",    icon:"🥋" },
  { level:2, name:"Cavaleiro de Bronze", xp:500,   color:"#cd7f32", icon:"🛡️" },
  { level:3, name:"Cavaleiro de Prata",  xp:1500,  color:"#aaa",    icon:"⚔️" },
  { level:4, name:"Cavaleiro de Ouro",   xp:5000,  color:"#ffd700", icon:"👑" },
  { level:5, name:"Deus",                xp:15000, color:"#a855f7", icon:"⚡" },
];

function getLevelInfo(xp=0) {
  let cur = LEVELS_CONFIG[0];
  for (const l of LEVELS_CONFIG) { if (xp >= l.xp) cur = l; else break; }
  const nextIdx = LEVELS_CONFIG.findIndex(l=>l.level===cur.level)+1;
  const next = LEVELS_CONFIG[nextIdx]||null;
  const pct  = next ? Math.round(((xp-cur.xp)/(next.xp-cur.xp))*100) : 100;
  return { ...cur, next, xpToNext: next?next.xp-xp:0, pct };
}

function GamificationWidget({ user }) {
  const [status,    setStatus]    = useState(null);
  const [refCode,   setRefCode]   = useState(null);
  const [showInfo,  setShowInfo]  = useState(false);
  const [gamConfig, setGamConfig] = useState([]);

  useEffect(()=>{
    api.get("/gamification/status").then(d=>{ if(!d?.error) setStatus(d); });
  },[user?.id]);

  const loadRefCode = async () => {
    if (refCode) { setRefCode(null); return; }
    const d = await api.get("/gamification/referral-code");
    if (!d?.error) setRefCode(d);
  };

  const loadInfo = async () => {
    if (showInfo) { setShowInfo(false); return; }
    const d = await api.get("/gamification/config").catch(()=>null);
    if (d && !d.error) setGamConfig(d);
    setShowInfo(true);
  };

  if (!status) return null;

  return (
    <div style={{background:"#0d0d1e",borderRadius:16,padding:16,marginBottom:16,
      border:"1px solid #ffd70022"}}>

      {/* Créditos */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <div style={{flex:1,background:"#ffd70011",borderRadius:10,padding:"10px 12px",
          border:"1px solid #ffd70033",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:24}}>💰</span>
          <div>
            <div style={{fontSize:22,fontWeight:900,color:"#ffd700"}}>{status.credits||0}</div>
            <div style={{fontSize:9,color:"#555",letterSpacing:1}}>CRÉDITOS</div>
          </div>
        </div>
        <div style={{flex:1,background:"#ff8c0011",borderRadius:10,padding:"10px 12px",
          border:"1px solid #ff8c0033",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:24}}>🔥</span>
          <div>
            <div style={{fontSize:22,fontWeight:900,color:"#ff8c00"}}>{status.login_streak||0}</div>
            <div style={{fontSize:9,color:"#555",letterSpacing:1}}>STREAK</div>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        <button onClick={loadRefCode}
          style={{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
            background:refCode?"#22c55e22":"#22c55e15",color:"#22c55e",fontSize:10,fontWeight:700}}>
          🎁 Indicar amigo {refCode?"▲":"▼"}
        </button>
        <button onClick={loadInfo}
          style={{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
            background:"#ffffff08",color:"#888",fontSize:10,fontWeight:700}}>
          💡 Como acumular {showInfo?"▲":"▼"}
        </button>
      </div>

      {/* Link de indicação */}
      {refCode && (
        <div style={{background:"#22c55e11",border:"1px solid #22c55e33",borderRadius:10,padding:10,marginBottom:8}}>
          <div style={{fontSize:11,color:"#22c55e",fontWeight:700,marginBottom:6}}>
            🎁 Seu link de indicação
          </div>
          <div style={{fontSize:10,color:"#aaa",marginBottom:6,wordBreak:"break-all"}}>
            {refCode.link}
          </div>
          <div style={{fontSize:10,color:"#555",marginBottom:8}}>
            Ganhe <strong style={{color:"#ffd700"}}>50 créditos</strong> por cada amigo cadastrado!
          </div>
          <button onClick={()=>navigator.clipboard?.writeText(refCode.link).then(()=>alert("Link copiado!"))}
            style={{width:"100%",padding:"7px",borderRadius:8,border:"none",cursor:"pointer",
              background:"#22c55e",color:"#000",fontSize:11,fontWeight:800}}>
            📋 Copiar link
          </button>
        </div>
      )}

      {/* Como acumular créditos */}
      {showInfo && (
        <div style={{background:"#ffffff05",borderRadius:10,padding:12,border:"1px solid #ffffff08"}}>
          <div style={{fontSize:10,color:"#ffd700",fontWeight:800,marginBottom:8}}>💰 Como ganhar créditos</div>
          {gamConfig.filter(c=>c.credits>0&&c.active).length > 0
            ? gamConfig.filter(c=>c.credits>0&&c.active).map(c=>(
              <div key={c.action} style={{display:"flex",justifyContent:"space-between",
                padding:"4px 0",borderBottom:"1px solid #ffffff06",fontSize:10}}>
                <span style={{color:"#888"}}>{c.label}</span>
                <span style={{color:"#ffd700",fontWeight:700}}>+{c.credits} CR</span>
              </div>
            ))
            : [{l:"Indicar amigo",v:50},{l:"Streak 7 dias",v:10},{l:"Streak 30 dias",v:50},
               {l:"Verificar conta",v:20}].map(c=>(
              <div key={c.l} style={{display:"flex",justifyContent:"space-between",
                padding:"4px 0",borderBottom:"1px solid #ffffff06",fontSize:10}}>
                <span style={{color:"#888"}}>{c.l}</span>
                <span style={{color:"#ffd700",fontWeight:700}}>+{c.v} CR</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

// ─── WARRIOR XP WIDGET (aba Guerreiro) ────────────────────────────────────────
function WarriorXPWidget({ user }) {
  const [status,   setStatus]   = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [gamConfig,setGamConfig]= useState([]);

  useEffect(()=>{
    api.get("/gamification/status").then(d=>{ if(!d?.error) setStatus(d); });
  },[user?.id]);

  const loadInfo = async () => {
    if (showInfo) { setShowInfo(false); return; }
    const d = await api.get("/gamification/config").catch(()=>null);
    if (d && !d.error) setGamConfig(d);
    setShowInfo(true);
  };

  if (!status) return null;
  const lvl = getLevelInfo(status.xp||0);

  return (
    <div style={{background:"#0d0d1e",borderRadius:16,padding:14,marginBottom:14,
      border:`1px solid ${lvl.color}33`}}>
      {/* Nível e XP */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <span style={{fontSize:26}}>{lvl.icon}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:800,color:lvl.color}}>{lvl.name} <span style={{fontSize:10,color:"#555",fontWeight:400}}>Nível {lvl.level}</span></div>
          <div style={{background:"#ffffff10",borderRadius:20,height:5,overflow:"hidden",margin:"4px 0"}}>
            <div style={{width:`${lvl.pct}%`,height:"100%",
              background:`linear-gradient(90deg,${lvl.color},${lvl.next?.color||lvl.color})`,
              borderRadius:20}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#555"}}>
            <span>{status.xp||0} XP</span>
            {lvl.next && <span>faltam {lvl.xpToNext} XP → {lvl.next.name}</span>}
          </div>
        </div>
      </div>

      <button onClick={loadInfo}
        style={{width:"100%",padding:"7px",borderRadius:8,border:"none",cursor:"pointer",
          background:"#ffffff08",color:"#888",fontSize:10,fontWeight:700}}>
        💡 Como acumular XP {showInfo?"▲":"▼"}
      </button>

      {showInfo && (
        <div style={{marginTop:8,background:"#ffffff05",borderRadius:10,padding:10,border:"1px solid #ffffff08"}}>
          <div style={{fontSize:10,color:"#a855f7",fontWeight:800,marginBottom:8}}>⭐ Como ganhar XP</div>
          {gamConfig.filter(c=>c.xp>0&&c.active).length > 0
            ? gamConfig.filter(c=>c.xp>0&&c.active).map(c=>(
              <div key={c.action} style={{display:"flex",justifyContent:"space-between",
                padding:"4px 0",borderBottom:"1px solid #ffffff06",fontSize:10}}>
                <span style={{color:"#888"}}>{c.label}</span>
                <span style={{color:"#a855f7",fontWeight:700}}>+{c.xp} XP</span>
              </div>
            ))
            : [{l:"Login diário",v:10},{l:"Streak 7 dias",v:50},{l:"Streak 30 dias",v:200},
               {l:"Indicar amigo",v:100},{l:"Verificar conta",v:200}].map(c=>(
              <div key={c.l} style={{display:"flex",justifyContent:"space-between",
                padding:"4px 0",borderBottom:"1px solid #ffffff06",fontSize:10}}>
                <span style={{color:"#888"}}>{c.l}</span>
                <span style={{color:"#a855f7",fontWeight:700}}>+{c.v} XP</span>
              </div>
            ))
          }
          <div style={{marginTop:8,fontSize:10,color:"#555",fontWeight:700,letterSpacing:1}}>NÍVEIS</div>
          {LEVELS_CONFIG.map(l=>(
            <div key={l.level} style={{display:"flex",alignItems:"center",gap:8,
              padding:"3px 0",fontSize:10}}>
              <span>{l.icon}</span>
              <span style={{flex:1,color:l.color,fontWeight:700}}>{l.name}</span>
              <span style={{color:"#555"}}>{l.xp===0?"início":`${l.xp.toLocaleString()} XP`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── WARRIOR TAB ─────────────────────────────────────────────────────────────
function WarriorTab({ user }) {
  const lvl = getLevelInfo(user?.xp||0);

  const SLOTS = [
    {id:"helmet",  label:"Elmo/Capacete",    icon:"⛑️",  pos:"left",  equipped:null},
    {id:"hair",    label:"Cabelo",            icon:"💇",  pos:"left",  equipped:null},
    {id:"face",    label:"Rosto",             icon:"😶",  pos:"left",  equipped:null},
    {id:"chest",   label:"Peito/Costas",      icon:"🛡️",  pos:"left",  equipped:"Armadura Pégaso"},
    {id:"shoulder",label:"Ombreiras",         icon:"🦺",  pos:"left",  equipped:null},
    {id:"belt",    label:"Cinto",             icon:"📿",  pos:"left",  equipped:null},
    {id:"cape",    label:"Capa/Asas",         icon:"🦸",  pos:"left",  equipped:null},
    {id:"bicepL",  label:"Bíceps Esq",        icon:"💪",  pos:"right", equipped:null},
    {id:"bicepR",  label:"Bíceps Dir",        icon:"💪",  pos:"right", equipped:null},
    {id:"forearm", label:"Antebraço",         icon:"🤜",  pos:"right", equipped:null},
    {id:"hands",   label:"Mãos",              icon:"🧤",  pos:"right", equipped:null},
    {id:"thigh",   label:"Protetor Coxa",     icon:"🦵",  pos:"right", equipped:null},
    {id:"knee",    label:"Joelheira",         icon:"🦿",  pos:"right", equipped:null},
    {id:"shin",    label:"Caneleira",         icon:"🦶",  pos:"right", equipped:null},
    {id:"foot",    label:"Calçado/Grevas",    icon:"👟",  pos:"right", equipped:null},
  ];

  const leftSlots  = SLOTS.filter(s=>s.pos==="left");
  const rightSlots = SLOTS.filter(s=>s.pos==="right");

  const Slot = ({slot}) => (
    <div style={{background:slot.equipped?"#ffd70010":"#0d0d1e",
      border:`1px solid ${slot.equipped?"#ffd70044":"#ffffff10"}`,
      borderRadius:8,padding:"6px 8px",display:"flex",alignItems:"center",
      gap:6,cursor:"pointer",marginBottom:5}}>
      <span style={{fontSize:16}}>{slot.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:0.5}}>{slot.label.toUpperCase()}</div>
        {slot.equipped
          ? <div style={{fontSize:10,color:"#ffd700",fontWeight:700}}>{slot.equipped}</div>
          : <div style={{fontSize:10,color:"#333"}}>— vazio —</div>}
      </div>
    </div>
  );

  return (
    <div>
      {/* Widget de XP do Guerreiro */}
      <WarriorXPWidget user={user}/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 80px 1fr",gap:8,alignItems:"start"}}>
        {/* Esquerda */}
        <div>{leftSlots.map(s=><Slot key={s.id} slot={s}/>)}</div>

        {/* Centro — silhueta */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <svg width="70" height="160" viewBox="0 0 70 160">
            <ellipse cx="35" cy="18" rx="12" ry="14" fill="#1a1a2e" stroke="#ffd70033" strokeWidth="1"/>
            <rect x="20" y="30" width="30" height="40" rx="4" fill="#0d0d2e" stroke="#ffd70033" strokeWidth="1"/>
            <rect x="8"  y="32" width="11" height="32" rx="4" fill="#0d0d2e" stroke="#ffd70033" strokeWidth="1"/>
            <rect x="51" y="32" width="11" height="32" rx="4" fill="#0d0d2e" stroke="#ffd70033" strokeWidth="1"/>
            <rect x="18" y="68" width="34" height="10" rx="3" fill="#1a1a2e" stroke="#ffd70033" strokeWidth="1"/>
            <rect x="18" y="76" width="15" height="45" rx="4" fill="#0d0d2e" stroke="#ffd70033" strokeWidth="1"/>
            <rect x="37" y="76" width="15" height="45" rx="4" fill="#0d0d2e" stroke="#ffd70033" strokeWidth="1"/>
            <ellipse cx="25" cy="124" rx="9" ry="5" fill="#1a1a2e" stroke="#ffd70033" strokeWidth="1"/>
            <ellipse cx="45" cy="124" rx="9" ry="5" fill="#1a1a2e" stroke="#ffd70033" strokeWidth="1"/>
            {/* Peito equipado */}
            <rect x="20" y="30" width="30" height="40" rx="4" fill="#ffd70011" stroke="#ffd70066" strokeWidth="1"/>
            <text x="35" y="55" textAnchor="middle" fontSize="14">🛡️</text>
          </svg>

          {/* Stats */}
          {[
            {ic:"⚔️",l:"ATK",v:10+(user?.level||1)*5},
            {ic:"🛡️",l:"DEF",v:8+(user?.level||1)*4},
            {ic:"⚡",l:"VEL",v:12+(user?.level||1)*3},
            {ic:"💫",l:"KI", v:5+(user?.level||1)*8},
          ].map(s=>(
            <div key={s.l} style={{textAlign:"center",background:"#ffffff06",
              borderRadius:6,padding:"4px 6px",width:"100%"}}>
              <div style={{fontSize:12}}>{s.ic}</div>
              <div style={{fontSize:12,fontWeight:900,color:"#dde"}}>{s.v}</div>
              <div style={{fontSize:8,color:"#555"}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Direita */}
        <div>{rightSlots.map(s=><Slot key={s.id} slot={s}/>)}</div>
      </div>

      <div style={{textAlign:"center",marginTop:16,fontSize:11,color:"#444",
        background:"#ffffff06",borderRadius:10,padding:12}}>
        🔒 Desbloqueie itens com créditos para equipar seu guerreiro!
        <br/>
        <span style={{color:"#ffd700",fontWeight:700}}>{user?.credits||0} créditos disponíveis</span>
      </div>
    </div>
  );
}

// ─── PREFS TAB ───────────────────────────────────────────────────────────────
function PrefsTab({ user, onSave }) {
  const loadPref = (k,d) => { try { return JSON.parse(localStorage.getItem(k)||d); } catch { return JSON.parse(d); }};
  const [defaultBrand,    setDefaultBrand]    = useState(()=>loadPref("ssv8_pref_brand",   '"nao_sei"'));
  const [defaultCurrency, setDefaultCurrency] = useState(()=>loadPref("ssv8_pref_currency",'"BRL"'));
  const [defaultCondition,setDefaultCondition]= useState(()=>loadPref("ssv8_pref_condition",'"used"'));

  useEffect(()=>{
    localStorage.setItem("ssv8_pref_brand",    JSON.stringify(defaultBrand));
    localStorage.setItem("ssv8_pref_currency", JSON.stringify(defaultCurrency));
    localStorage.setItem("ssv8_pref_condition",JSON.stringify(defaultCondition));
  },[defaultBrand,defaultCurrency,defaultCondition]);

  const Dropdown = ({label,value,onChange,options})=>(
    <div style={{marginBottom:14}}>
      <div style={{fontSize:10,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:6}}>{label}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {options.map(o=>(
          <button key={o.v} onClick={()=>onChange(o.v)}
            style={{padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",
              fontSize:11,fontWeight:700,
              background:value===o.v?"#ffd700":"#ffffff08",
              color:value===o.v?"#000":"#888"}}>
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{fontSize:13,fontWeight:800,color:"#dde",marginBottom:16}}>⚙️ Preferências</div>
      <Dropdown label="MARCA PADRÃO" value={defaultBrand} onChange={setDefaultBrand}
        options={[
          {v:"bandai",  l:"🏷️ Bandai"},
          {v:"replica", l:"🔄 Réplica"},
          {v:"propria", l:"🛠️ Própria"},
          {v:"nao_sei", l:"❓ Não sei"},
        ]}/>
      <Dropdown label="MOEDA PADRÃO" value={defaultCurrency} onChange={setDefaultCurrency}
        options={[
          {v:"BRL", l:"🇧🇷 BRL"},
          {v:"USD", l:"🇺🇸 USD"},
          {v:"JPY", l:"🇯🇵 JPY"},
          {v:"EUR", l:"🇪🇺 EUR"},
        ]}/>
      <Dropdown label="CONDIÇÃO PADRÃO" value={defaultCondition} onChange={setDefaultCondition}
        options={[
          {v:"new",  l:"✨ Novo"},
          {v:"used", l:"📦 Usado"},
          {v:"open", l:"🔓 Aberto"},
        ]}/>
      <div style={{fontSize:10,color:"#22c55e",marginTop:4}}>✅ Preferências salvas automaticamente</div>
    </div>
  );
}

function EditProfileScreen({ user, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("profile"); // profile | warrior | prefs
  const [name,  setName]  = useState(user?.name  || "");
  const [phone, setPhone] = useState(user?.phone  || "");
  const [ddi,   setDdi]   = useState(user?.phone_ddi || "+55");
  const [saving, setSaving] = useState(false);
  const [msg,   setMsg]   = useState(null);

  // Verificação de telefone
  const [phoneStep, setPhoneStep] = useState("idle"); // idle | sending | code | done
  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const API = "https://cdz-collector-backend.onrender.com";

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("ssv8_token")}`
  });

  const saveName = async () => {
    setSaving(true); setMsg(null);
    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ name, phone_ddi: ddi })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({t:"ok", m:"Nome atualizado!"});
        onSave && onSave({ ...user, name, phone_ddi: ddi });
      } else setMsg({t:"err", m: data.error || "Erro ao salvar"});
    } catch(e) { setMsg({t:"err", m:"Erro de conexão"}); }
    setSaving(false);
  };

  const sendToken = async () => {
    if (!phone || phone.replace(/\D/g,"").length < 8)
      return setMsg({t:"err", m:"Digite um número válido"});
    setPhoneStep("sending"); setMsg(null);
    try {
      const res = await fetch(`${API}/auth/phone/send-token`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ phone: phone.replace(/\D/g,""), phone_ddi: ddi })
      });
      const data = await res.json();
      if (res.ok) {
        setPhoneStep("code");
        setMsg({t:"ok", m:"Código enviado via WhatsApp!"});
        // Em dev mostra o token
        if (data.debug_token) setMsg({t:"ok", m:`Dev: código ${data.debug_token}`});
      } else {
        setPhoneStep("idle");
        setMsg({t:"err", m: data.error || "Erro ao enviar"});
      }
    } catch(e) {
      setPhoneStep("idle");
      setMsg({t:"err", m:"Erro de conexão"});
    }
  };

  const verifyToken = async () => {
    if (token.length !== 6) return setMsg({t:"err", m:"Digite os 6 dígitos"});
    setVerifying(true); setMsg(null);
    try {
      const res = await fetch(`${API}/auth/phone/verify-token`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (res.ok) {
        setPhoneStep("done");
        setMsg({t:"ok", m:"Telefone verificado! ✓"});
        onSave && onSave({ ...user, phone: phone.replace(/\D/g,""), phone_ddi: ddi, phone_verified: true });
      } else setMsg({t:"err", m: data.error || "Código incorreto"});
    } catch(e) { setMsg({t:"err", m:"Erro de conexão"}); }
    setVerifying(false);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:2001,background:"#06060f",
      display:"flex",flexDirection:"column",fontFamily:"'Rajdhani',sans-serif"}}>
      {/* Header */}
      <div style={{flexShrink:0,padding:"14px 16px 0",borderBottom:"1px solid #ffffff08"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={onClose} style={{background:"#ffffff10",border:"none",borderRadius:8,
            padding:"6px 12px",color:"#aaa",cursor:"pointer",fontSize:12}}>← Voltar</button>
          <div style={{fontSize:16,fontWeight:900,color:"#fff"}}>Meu Perfil</div>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",gap:0}}>
          {[
            {k:"profile",  l:"👤 Perfil"},
            ...(user?.is_admin ? [{k:"warrior", l:"⚔️ Guerreiro"}] : []),
            {k:"prefs",    l:"⚙️ Preferências"},
          ].map(t=>(
            <button key={t.k} onClick={()=>setActiveTab(t.k)}
              style={{flex:1,padding:"8px 4px",border:"none",cursor:"pointer",
                background:"transparent",fontSize:11,fontWeight:700,
                color:activeTab===t.k?"#ffd700":"#555",
                borderBottom:activeTab===t.k?"2px solid #ffd700":"2px solid transparent"}}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",
        touchAction:"pan-y",padding:"20px 16px 40px"}}>

        {/* ABA GUERREIRO */}
        {activeTab==="warrior" && <WarriorTab user={user}/>}

        {/* ABA PREFERÊNCIAS */}
        {activeTab==="prefs" && <PrefsTab user={user} onSave={onSave}/>}

        {/* ABA PERFIL */}
        {activeTab==="profile" && (<>

        {/* Gamification Widget */}
        <GamificationWidget user={user}/>

        {/* Avatar */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <div style={{width:64,height:64,borderRadius:"50%",
            background:"#ffd70022",color:"#ffd700",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontWeight:900,fontSize:26,border:"3px solid #ffd70044"}}>
            {name?.[0]?.toUpperCase()||"?"}
          </div>
        </div>

        {/* Nome */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:"#666",fontWeight:700,letterSpacing:1,marginBottom:6}}>NOME</div>
          <input value={name} onChange={e=>setName(e.target.value)}
            placeholder="Seu nome"
            style={{width:"100%",padding:"11px 14px",borderRadius:10,
              background:"#ffffff08",border:"1px solid #ffffff15",
              color:"#fff",fontSize:14,outline:"none",fontFamily:"'Rajdhani',sans-serif"}}/>
        </div>

        {/* Email só leitura */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:"#666",fontWeight:700,letterSpacing:1,marginBottom:6}}>EMAIL</div>
          <div style={{padding:"11px 14px",borderRadius:10,background:"#ffffff05",
            border:"1px solid #ffffff08",color:"#555",fontSize:13}}>
            {user?.email} <span style={{fontSize:10,color:"#333"}}>(não editável)</span>
          </div>
        </div>

        {/* Botão salvar nome */}
        <button onClick={saveName} disabled={saving}
          style={{width:"100%",padding:"12px",borderRadius:12,border:"none",
            cursor:saving?"not-allowed":"pointer",fontSize:13,fontWeight:800,
            background:"linear-gradient(90deg,#ffd700,#ff8c00)",
            color:"#000",opacity:saving?0.6:1,marginBottom:20}}>
          {saving?"Salvando...":"Salvar nome"}
        </button>

        {/* Divisória */}
        <div style={{height:1,background:"#ffffff08",marginBottom:20}}/>

        {/* Telefone */}
        <div style={{marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <div style={{fontSize:10,color:"#666",fontWeight:700,letterSpacing:1}}>TELEFONE / WHATSAPP</div>
            {user?.phone_verified && user?.phone && (
              <span style={{fontSize:9,color:"#22c55e",background:"#22c55e18",
                border:"1px solid #22c55e33",borderRadius:20,padding:"1px 6px"}}>✓ verificado</span>
            )}
          </div>
          {user?.phone && (
            <div style={{fontSize:11,color:"#555",marginBottom:8}}>
              Atual: <span style={{color:"#888"}}>{user.phone_ddi} {user.phone}</span>
            </div>
          )}
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <select value={ddi} onChange={e=>setDdi(e.target.value)}
              disabled={phoneStep==="code"}
              style={{padding:"11px 8px",borderRadius:10,background:"#ffffff08",
                border:"1px solid #ffffff15",color:"#fff",fontSize:13,
                fontFamily:"'Rajdhani',sans-serif",outline:"none",flexShrink:0}}>
              {["+55","+1","+44","+351","+54","+56","+57","+598","+595","+591"].map(d=>(
                <option key={d} value={d} style={{background:"#0d0d1e"}}>{d}</option>
              ))}
            </select>
            <input value={phone} onChange={e=>setPhone(e.target.value)}
              placeholder="(11) 99999-9999" type="tel"
              disabled={phoneStep==="code"}
              style={{flex:1,padding:"11px 14px",borderRadius:10,
                background:"#ffffff08",border:"1px solid #ffffff15",
                color:"#fff",fontSize:14,outline:"none",fontFamily:"'Rajdhani',sans-serif"}}/>
          </div>

          {/* Botão enviar código */}
          {phoneStep==="idle" && (
            <button onClick={sendToken}
              style={{width:"100%",padding:"11px",borderRadius:10,border:"none",cursor:"pointer",
                fontSize:13,fontWeight:800,background:"#25d36618",color:"#25d366",
                outline:"1px solid #25d36633"}}>
              📱 Enviar código via WhatsApp
            </button>
          )}

          {phoneStep==="sending" && (
            <div style={{textAlign:"center",padding:"10px",fontSize:12,color:"#888"}}>
              Enviando código...
            </div>
          )}

          {/* Campo de código */}
          {phoneStep==="code" && (
            <div>
              <div style={{fontSize:10,color:"#666",fontWeight:700,letterSpacing:1,marginBottom:6,marginTop:12}}>
                CÓDIGO RECEBIDO (6 dígitos)
              </div>
              <div style={{display:"flex",gap:8}}>
                <input value={token} onChange={e=>setToken(e.target.value.replace(/\D/g,"").slice(0,6))}
                  placeholder="000000" type="tel" maxLength={6}
                  style={{flex:1,padding:"11px 14px",borderRadius:10,
                    background:"#ffffff08",border:"1px solid #ffd70033",
                    color:"#ffd700",fontSize:18,fontWeight:900,letterSpacing:6,
                    textAlign:"center",outline:"none",fontFamily:"monospace"}}/>
                <button onClick={verifyToken} disabled={verifying||token.length!==6}
                  style={{padding:"11px 16px",borderRadius:10,border:"none",cursor:"pointer",
                    fontSize:13,fontWeight:800,flexShrink:0,
                    background:token.length===6?"#22c55e":"#ffffff10",
                    color:token.length===6?"#000":"#555",
                    opacity:verifying?0.6:1}}>
                  {verifying?"...":"✓"}
                </button>
              </div>
              <button onClick={()=>{setPhoneStep("idle");setToken("");setMsg(null);}}
                style={{background:"transparent",border:"none",cursor:"pointer",
                  fontSize:11,color:"#555",marginTop:8,padding:0}}>
                ← Trocar número
              </button>
            </div>
          )}

          {phoneStep==="done" && (
            <div style={{textAlign:"center",padding:"12px",background:"#22c55e18",
              borderRadius:10,border:"1px solid #22c55e33"}}>
              <div style={{fontSize:20,marginBottom:4}}>✅</div>
              <div style={{fontSize:13,color:"#22c55e",fontWeight:700}}>Telefone verificado!</div>
            </div>
          )}
        </div>

        {msg && (
          <div style={{padding:"10px 14px",borderRadius:10,marginTop:12,
            background:msg.t==="ok"?"#22c55e18":"#f8717118",
            border:`1px solid ${msg.t==="ok"?"#22c55e33":"#f8717133"}`,
            color:msg.t==="ok"?"#22c55e":"#f87171",fontSize:13,fontWeight:700}}>
            {msg.m}
          </div>
        )}

        {/* Admin + Sair */}
        <div style={{marginTop:24,display:"flex",flexDirection:"column",gap:8}}>
          {user?.is_admin && (
            <button
              style={{width:"100%",padding:"11px",borderRadius:12,border:"1px solid #ffd70033",
                cursor:"pointer",fontSize:13,fontWeight:700,background:"#ffd70011",color:"#ffd700"}}
              onClick={()=>{ onClose(); window.__openAdmin&&window.__openAdmin(); }}>
              👑 Painel Admin
            </button>
          )}
          <button onClick={()=>{ onClose(); setTimeout(()=>window.__openFeedback&&window.__openFeedback(), 100); }}
            style={{width:"100%",padding:"11px",borderRadius:12,border:"1px solid #a855f733",
              cursor:"pointer",fontSize:13,fontWeight:700,background:"#a855f711",color:"#a855f7"}}>
            💬 Feedback / Sugestões
          </button>
          <button onClick={()=>{ onClose(); window.__colezzareLogout&&window.__colezzareLogout(); }}
            style={{width:"100%",padding:"11px",borderRadius:12,border:"1px solid #ff444433",
              cursor:"pointer",fontSize:13,fontWeight:700,background:"#ff444411",color:"#ff6666"}}>
            🚪 Sair da conta
          </button>
        </div>
        </>)}
      </div>
    </div>
  );
}

function PrivacyScreen({ onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"#06060f",zIndex:3000,overflowY:"scroll",WebkitOverflowScrolling:"touch",touchAction:"pan-y"}}>
      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px 60px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,paddingTop:10}}>
          <button onClick={onClose} style={{background:"#ffffff10",border:"none",borderRadius:8,
            padding:"6px 12px",color:"#aaa",cursor:"pointer",fontSize:12}}>← Voltar</button>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:900,color:"#fff"}}>🔒 Política de Privacidade</div>
            <div style={{fontSize:10,color:"#555"}}>Colezzare · Última atualização: Mai/2026</div>
          </div>
        </div>

        {[
          {
            title:"1. Quem somos",
            text:"O Colezzare é uma plataforma para colecionadores de figuras de ação, especialmente da linha Saint Seiya Myth Cloth. O responsável pelo tratamento dos seus dados é o Colezzare, conforme a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)."
          },
          {
            title:"2. Dados que coletamos",
            text:"Coletamos apenas os dados necessários para o funcionamento da plataforma:\n\n• Nome completo e e-mail (cadastro)\n• Nome de usuário escolhido por você\n• Dados de verificação de identidade: documento (CPF ou equivalente), foto do documento frente e verso, selfie com documento e telefone — coletados apenas quando você solicita verificação voluntariamente\n• Informações da sua coleção de figuras\n• Anúncios de venda e listas de procura no marketplace\n• Registros de acesso (data, hora e dispositivo) para segurança"
          },
          {
            title:"3. Como usamos seus dados",
            text:"• Cadastro e autenticação na plataforma\n• Verificação de identidade para aumentar a confiança entre usuários do marketplace\n• Exibição do seu perfil e coleção para outros usuários\n• Facilitar contato entre compradores e vendedores\n• Prevenção de fraudes e cumprimento das nossas políticas\n• Melhorias na plataforma"
          },
          {
            title:"4. Armazenamento e segurança",
            text:"Seus dados são armazenados em servidores seguros com infraestrutura baseada no Brasil. Documentos de verificação são armazenados em área privada com acesso restrito apenas à equipe de moderação. Utilizamos criptografia em trânsito (HTTPS) e em repouso. Senhas nunca são armazenadas em texto puro."
          },
          {
            title:"5. Compartilhamento de dados",
            text:"Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais. Seus dados podem ser compartilhados apenas:\n\n• Com outros usuários: nome, usuário e informações do anúncio (nunca CPF ou documentos)\n• Com autoridades: quando exigido por lei ou ordem judicial\n• Com prestadores de serviço técnico essenciais ao funcionamento da plataforma, sob sigilo"
          },
          {
            title:"6. Seus direitos",
            text:"Conforme a LGPD, você tem direito a:\n\n• Confirmar a existência do tratamento dos seus dados\n• Acessar seus dados a qualquer momento\n• Corrigir dados incompletos ou incorretos\n• Solicitar anonimização, bloqueio ou exclusão de dados desnecessários\n• Portabilidade dos dados\n• Revogar o consentimento a qualquer momento\n\nPara exercer seus direitos, entre em contato pelo e-mail: privacidade@colezzare.com"
          },
          {
            title:"7. Retenção de dados",
            text:"Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão da conta, os dados são removidos em até 30 dias, exceto quando exigido por lei. Dados de verificação de identidade são mantidos por até 5 anos para fins de auditoria e segurança."
          },
          {
            title:"8. Cookies e rastreamento",
            text:"O Colezzare utiliza armazenamento local (localStorage) apenas para manter sua sessão ativa. Não utilizamos cookies de rastreamento ou publicidade."
          },
          {
            title:"9. Menores de idade",
            text:"O Colezzare não é destinado a menores de 18 anos. Não coletamos conscientemente dados de menores. Se identificarmos uma conta de menor, ela será removida."
          },
          {
            title:"10. Alterações nesta política",
            text:"Podemos atualizar esta política periodicamente. Você será notificado sobre mudanças significativas pelo e-mail cadastrado ou por aviso no aplicativo."
          },
          {
            title:"11. Contato",
            text:"Em caso de dúvidas sobre privacidade ou para exercer seus direitos:\n\nE-mail: privacidade@colezzare.com\nResponsável pelo Tratamento: Colezzare\nLei aplicável: LGPD — Lei nº 13.709/2018 (Brasil)"
          },
        ].map(s=>(
          <div key={s.title} style={{marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:800,color:"#ffd700",marginBottom:8}}>{s.title}</div>
            <div style={{fontSize:12,color:"#888",lineHeight:1.8,whiteSpace:"pre-line"}}>{s.text}</div>
          </div>
        ))}

        <div style={{marginTop:32,padding:"14px 16px",background:"#ffffff06",borderRadius:12,
          border:"1px solid #ffffff10",fontSize:11,color:"#555",textAlign:"center",lineHeight:1.7}}>
          Esta política foi elaborada em conformidade com a{" "}
          <span style={{color:"#38bdf8",fontWeight:700}}>LGPD (Lei nº 13.709/2018)</span>
          {" "}e aplica-se a todos os usuários do Colezzare.
        </div>
      </div>
    </div>
  );
}

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [err, setErr] = useState("");
  const [captured, setCaptured] = useState(null);

  useEffect(() => {
    let currentStream;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then(s => {
        currentStream = s;
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setErr("Não foi possível acessar a câmera. Verifique as permissões."));
    return () => { if (currentStream) currentStream.getTracks().forEach(t => t.stop()); };
  }, []);

  const capture = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCaptured(dataUrl);
    if (stream) stream.getTracks().forEach(t => t.stop());
  };

  const confirm = () => {
    fetch(captured).then(r=>r.blob()).then(blob => {
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
      onCapture(file, captured);
      onClose();
    });
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#000",zIndex:3000,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:480,padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{color:"#fff",fontWeight:700,fontSize:14}}>🤳 Selfie com documento</div>
          <button onClick={onClose} style={{background:"#ffffff20",border:"none",borderRadius:8,
            padding:"6px 12px",color:"#fff",cursor:"pointer",fontSize:12}}>✕ Fechar</button>
        </div>

        {err ? (
          <div style={{background:"#f8717120",border:"1px solid #f87171",borderRadius:12,
            padding:20,textAlign:"center",color:"#f87171",fontSize:13}}>
            ⚠️ {err}
          </div>
        ) : captured ? (
          <>
            <img src={captured} alt="selfie" style={{width:"100%",borderRadius:12,marginBottom:12}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setCaptured(null);
                navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false})
                  .then(s=>{setStream(s);if(videoRef.current)videoRef.current.srcObject=s;});
              }} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid #ffffff20",
                background:"transparent",color:"#aaa",fontSize:13,cursor:"pointer"}}>
                🔄 Tirar novamente
              </button>
              <button onClick={confirm} style={{flex:2,padding:"12px",borderRadius:10,border:"none",
                background:"linear-gradient(90deg,#22c55e,#16a34a)",
                color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>
                ✓ Usar esta foto
              </button>
            </div>
          </>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted
              style={{width:"100%",borderRadius:12,marginBottom:12,background:"#111"}}/>
            <canvas ref={canvasRef} style={{display:"none"}}/>
            <div style={{fontSize:11,color:"#555",textAlign:"center",marginBottom:12}}>
              Segure o documento ao lado do rosto e clique em capturar
            </div>
            <button onClick={capture} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",
              background:"linear-gradient(90deg,#22c55e,#16a34a)",
              color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer"}}>
              📸 Capturar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function VerificationScreen({ user, onClose, onSubmitted, onPrivacy }) {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("BR");
  const [docType, setDocType] = useState("cpf");
  const [docNumber, setDocNumber] = useState("");
  const [docNumberErr, setDocNumberErr] = useState("");
  const [cpfChecking, setCpfChecking] = useState(false);
  const [cpfAvailable, setCpfAvailable] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const formatCPF = (v) => {
    const n = v.replace(/\D/g,"").slice(0,11);
    return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,"$1.$2.$3-$4")
            .replace(/(\d{3})(\d{3})(\d{3})/,"$1.$2.$3")
            .replace(/(\d{3})(\d{3})/,"$1.$2")
            .replace(/(\d{3})/,"$1");
  };

  const validateCPF = (cpf) => {
    const n = cpf.replace(/\D/g,"");
    if (n.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(n)) return false;
    let sum = 0;
    for (let i=0; i<9; i++) sum += parseInt(n[i]) * (10-i);
    let r = (sum*10) % 11;
    if (r===10||r===11) r=0;
    if (r !== parseInt(n[9])) return false;
    sum = 0;
    for (let i=0; i<10; i++) sum += parseInt(n[i]) * (11-i);
    r = (sum*10) % 11;
    if (r===10||r===11) r=0;
    return r === parseInt(n[10]);
  };
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneDdi, setPhoneDdi] = useState("+55");
  const [phoneType, setPhoneType] = useState("whatsapp");
  const [address, setAddress] = useState("");
  const [cep, setCep] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepErr, setCepErr] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");

  const fetchCEP = async (value) => {
    const clean = value.replace(/\D/g,"");
    if (clean.length !== 8) return;
    setCepLoading(true); setCepErr("");
    try {
      const r = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await r.json();
      if (data.erro) { setCepErr("CEP não encontrado"); setCepLoading(false); return; }
      setStreet(data.logradouro||"");
      setNeighborhood(data.bairro||"");
      setCity(data.localidade||"");
      setState(data.uf||"");
      setAddress(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
    } catch(e) { setCepErr("Erro ao buscar CEP"); }
    setCepLoading(false);
  };

  const formatCEP = (v) => {
    const n = v.replace(/\D/g,"").slice(0,8);
    return n.length > 5 ? n.replace(/(\d{5})(\d{0,3})/,"$1-$2") : n;
  };
  const [docFront, setDocFront] = useState(null);
  const [docBack, setDocBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [docFrontPreview, setDocFrontPreview] = useState(null);
  const [docBackPreview, setDocBackPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  const DOC_TYPES = {
    BR: [{v:"cpf", l:"CPF"}, {v:"rg", l:"RG"}, {v:"passport", l:"Passaporte"}],
    PT: [{v:"bi", l:"Bilhete de Identidade"}, {v:"passport", l:"Passaporte"}],
    US: [{v:"driver_license", l:"Driver's License"}, {v:"passport", l:"Passport"}],
    OTHER: [{v:"passport", l:"Passaporte / Passport"}],
  };

  const handleFile = (e, setter, previewSetter) => {
    const file = e.target.files[0];
    if (!file) return;
    setter(file);
    const reader = new FileReader();
    reader.onload = (ev) => previewSetter(ev.target.result);
    reader.readAsDataURL(file);
  };

  const toBase64 = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const submit = async () => {
    if (!docFront || !selfie) { setErr("Envie foto do documento e selfie"); return; }
    setErr(""); setLoading(true);
    try {
      const fullAddress = "";
      const frontB64  = await toBase64(docFront);
      const backB64   = docBack ? await toBase64(docBack) : null;
      const selfieB64 = await toBase64(selfie);

      await api.post("/verification/request", {
        doc_type:   docType,
        doc_number: docNumber,
        birthdate,
        phone,
        phone_ddi:  phoneDdi,
        phone_type: phoneType,
        address:    fullAddress,
        country,
        doc_front:  frontB64,
        doc_back:   backB64,
        selfie:     selfieB64,
      });
      setSent(true);
      onSubmitted && onSubmitted();
    } catch(e) {
      setErr("Erro ao enviar. Tente novamente.");
    }
    setLoading(false);
  };

  const UploadBox = ({ label, preview, onChange, required=true, cameraOnly=false }) => (
    <div style={{marginBottom:14}}>
      <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:6}}>{label}{required?" *":""}</div>
      <label style={{display:"block",cursor:"pointer"}}>
        <input type="file" accept="image/*"
          capture={cameraOnly ? "user" : undefined}
          onChange={onChange} style={{display:"none"}}/>
        <div style={{border:`2px dashed ${preview?"#22c55e":"#ffffff20"}`,borderRadius:12,
          height:120,display:"flex",alignItems:"center",justifyContent:"center",
          overflow:"hidden",background:"#ffffff05",position:"relative"}}>
          {preview ? (
            <img src={preview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          ) : (
            <div style={{textAlign:"center",color:"#555"}}>
              <div style={{fontSize:28,marginBottom:4}}>{cameraOnly?"🤳":"📷"}</div>
              <div style={{fontSize:11}}>{cameraOnly?"Abrir câmera":"Clique para enviar"}</div>
            </div>
          )}
          {preview && (
            <div style={{position:"absolute",top:6,right:6,background:"#22c55e",
              borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:11,color:"#fff"}}>✓</div>
          )}
        </div>
      </label>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"#06060f",zIndex:2000,overflowY:"scroll",WebkitOverflowScrolling:"touch",touchAction:"pan-y"}}>
      <div style={{maxWidth:480,margin:"0 auto",padding:"20px 16px 40px"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,paddingTop:10}}>
          <button onClick={onClose} style={{background:"#ffffff10",border:"none",borderRadius:8,
            padding:"6px 12px",color:"#aaa",cursor:"pointer",fontSize:12}}>← Voltar</button>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:900,color:"#22c55e"}}>✓ Verificação de Conta</div>
            <div style={{fontSize:10,color:"#555"}}>Grátis · Aprovação em até 24h úteis</div>
          </div>
        </div>

        {sent ? (
          <div style={{textAlign:"center",padding:40,background:"#22c55e11",
            border:"1px solid #22c55e33",borderRadius:16}}>
            <div style={{fontSize:48,marginBottom:12}}>🎉</div>
            <div style={{fontSize:18,fontWeight:900,color:"#22c55e",marginBottom:8}}>
              Solicitação enviada!
            </div>
            <div style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:20}}>
              Analisaremos seus documentos em até 24h úteis.<br/>
              Você receberá uma notificação quando aprovado.
            </div>
            <button onClick={onClose} style={{padding:"10px 24px",borderRadius:20,
              border:"1px solid #22c55e44",background:"transparent",
              color:"#22c55e",fontSize:13,cursor:"pointer",fontWeight:700}}>
              Fechar
            </button>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div style={{display:"flex",gap:4,marginBottom:24}}>
              {[1,2,3].map(s=>(
                <div key={s} style={{flex:1,height:3,borderRadius:2,
                  background:step>=s?"#22c55e":"#ffffff15",transition:"all 0.3s"}}/>
              ))}
            </div>

            {/* STEP 1 — Dados pessoais */}
            {step===1 && (
              <div>
                <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:4}}>Dados pessoais</div>
                <div style={{fontSize:11,color:"#555",marginBottom:20}}>
                  Suas informações são protegidas pela LGPD.{" "}
                  <button onClick={()=>onPrivacy&&onPrivacy()} style={{background:"none",border:"none",
                    color:"#38bdf8",cursor:"pointer",fontSize:11,padding:0,textDecoration:"underline"}}>
                    Saiba mais →
                  </button>
                </div>

                <div style={{marginBottom:13}}>
                  <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>PAÍS</div>
                  <select value={country} onChange={e=>{setCountry(e.target.value);setDocType(DOC_TYPES[e.target.value]?.[0]?.v||"passport");}}
                    style={{width:"100%",padding:"10px 13px",borderRadius:8,background:"#ffffff0a",
                      border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none"}}>
                    <option value="BR">🇧🇷 Brasil</option>
                    <option value="PT">🇵🇹 Portugal</option>
                    <option value="US">🇺🇸 Estados Unidos</option>
                    <option value="OTHER">🌍 Outro país</option>
                  </select>
                </div>

                <div style={{marginBottom:13}}>
                  <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>TIPO DE DOCUMENTO *</div>
                  <select value={docType} onChange={e=>setDocType(e.target.value)}
                    style={{width:"100%",padding:"10px 13px",borderRadius:8,background:"#ffffff0a",
                      border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none"}}>
                    {(DOC_TYPES[country]||DOC_TYPES.OTHER).map(d=>(
                      <option key={d.v} value={d.v}>{d.l}</option>
                    ))}
                  </select>
                </div>

                {/* Número do documento com formatação CPF */}
                <div style={{marginBottom:13}}>
                  <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>
                    NÚMERO DO DOCUMENTO *
                  </div>
                  <input
                    value={docNumber}
                    onChange={e=>{
                      const val = country==="BR"&&docType==="cpf" ? formatCPF(e.target.value) : e.target.value;
                      setDocNumber(val);
                      setCpfAvailable(null);
                      if(country==="BR"&&docType==="cpf") {
                        const err = val.replace(/\D/g,"").length===11 && !validateCPF(val) ? "CPF inválido" : "";
                        setDocNumberErr(err);
                        if(!err && val.replace(/\D/g,"").length===11) {
                          setCpfChecking(true);
                          setTimeout(async () => {
                            try {
                              const r = await api.get(`/auth/check-cpf/${val.replace(/\D/g,"")}`);
                              setCpfAvailable(r.available);
                              if(!r.available) setDocNumberErr("CPF já está sendo utilizado");
                            } catch(e) {}
                            setCpfChecking(false);
                          }, 500);
                        }
                      }
                    }}
                    placeholder={country==="BR"&&docType==="cpf"?"000.000.000-00":"Número do documento"}
                    style={{width:"100%",padding:"10px 13px",borderRadius:8,background:"#ffffff0a",
                      border:`1px solid ${docNumberErr?"#f87171":"#ffffff15"}`,
                      color:"#dde",fontSize:12,outline:"none",boxSizing:"border-box"}}/>
                  {docNumberErr && <div style={{fontSize:10,color:"#f87171",marginTop:3}}>⚠️ {docNumberErr}</div>}
                  {cpfChecking && <div style={{fontSize:10,color:"#555",marginTop:3}}>⏳ Verificando CPF...</div>}
                  {!docNumberErr && !cpfChecking && cpfAvailable===true &&
                    <div style={{fontSize:10,color:"#22c55e",marginTop:3}}>✓ CPF válido e disponível</div>}
                  {!docNumberErr && !cpfChecking && cpfAvailable===false &&
                    <div style={{fontSize:10,color:"#f87171",marginTop:3}}>✗ CPF já está sendo utilizado</div>}
                </div>
                  {[
                    {l:"DATA DE NASCIMENTO *",v:birthdate,s:setBirthdate,p:"",t:"date"},
                  ].map(f=>(
                    <div key={f.l} style={{marginBottom:13}}>
                      <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>{f.l}</div>
                      <input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} type={f.t||"text"}
                        style={{width:"100%",padding:"10px 13px",borderRadius:8,background:"#ffffff0a",
                          border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none",boxSizing:"border-box"}}/>
                    </div>
                  ))}

                <div style={{marginBottom:13}}>
                  <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>TELEFONE *</div>
                  <div style={{display:"flex",gap:6}}>
                    <input value={phoneDdi} onChange={e=>setPhoneDdi(e.target.value)}
                      style={{width:70,padding:"10px 8px",borderRadius:8,background:"#ffffff0a",
                        border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none",textAlign:"center"}}/>
                    <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(11) 99999-9999"
                      style={{flex:1,padding:"10px 13px",borderRadius:8,background:"#ffffff0a",
                        border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none"}}/>
                  </div>
                  <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,margin:"10px 0 6px"}}>
                    COMO DESEJA VERIFICAR SEU NÚMERO
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    {["whatsapp","sms"].map(t=>(
                      <div key={t} onClick={()=>setPhoneType(t)}
                        style={{flex:1,padding:"8px",borderRadius:8,cursor:"pointer",textAlign:"center",
                          background:phoneType===t?"#25d36622":"#ffffff06",
                          border:`1px solid ${phoneType===t?"#25d366":"#ffffff10"}`,
                          color:phoneType===t?"#25d366":"#555",fontSize:11,fontWeight:700}}>
                        {t==="whatsapp"?"💬 WhatsApp":"📱 SMS"}
                      </div>
                    ))}
                  </div>
                </div>

                {err && <div style={{color:"#f87171",fontSize:11,marginBottom:8}}>⚠️ {err}</div>}
                <button onClick={()=>{
                  if(!docNumber||!birthdate||!phone){setErr("Preencha os campos obrigatórios");return;}
                  if(country==="BR"&&docType==="cpf"&&!validateCPF(docNumber)){setErr("CPF inválido");return;}
                  if(country==="BR"&&docType==="cpf"&&cpfAvailable===false){setErr("CPF já está sendo utilizado");return;}
                  setErr("");setStep(2);
                }} style={{width:"100%",padding:"13px",borderRadius:10,border:"none",cursor:"pointer",
                  background:"linear-gradient(90deg,#22c55e,#16a34a)",
                  color:"#fff",fontSize:13,fontWeight:800}}>
                  Continuar →
                </button>
              </div>
            )}

            {/* STEP 2 — Documentos */}
            {step===2 && (
              <div>
                <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:4}}>Foto do documento</div>
                <div style={{fontSize:11,color:"#555",marginBottom:20}}>
                  Envie fotos nítidas do seu documento
                </div>

                <UploadBox label="FRENTE DO DOCUMENTO" preview={docFrontPreview}
                  onChange={e=>handleFile(e,setDocFront,setDocFrontPreview)}/>
                <UploadBox label="VERSO DO DOCUMENTO" preview={docBackPreview} required={false}
                  onChange={e=>handleFile(e,setDocBack,setDocBackPreview)}/>

                <div style={{background:"#ffffff06",borderRadius:10,padding:"10px 12px",
                  marginBottom:16,fontSize:10,color:"#555",lineHeight:1.7}}>
                  📋 O documento deve estar legível, sem reflexos ou cortes.<br/>
                  Formatos aceitos: JPG, PNG · Máx. 10MB por arquivo
                </div>

                {err && <div style={{color:"#f87171",fontSize:11,marginBottom:8}}>⚠️ {err}</div>}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setStep(1)} style={{flex:1,padding:"13px",borderRadius:10,
                    border:"1px solid #ffffff15",background:"transparent",
                    color:"#666",fontSize:12,cursor:"pointer"}}>← Voltar</button>
                  <button onClick={()=>{
                    if(!docFront){setErr("Envie a frente do documento");return;}
                    setErr("");setStep(3);
                  }} style={{flex:2,padding:"13px",borderRadius:10,border:"none",cursor:"pointer",
                    background:"linear-gradient(90deg,#22c55e,#16a34a)",
                    color:"#fff",fontSize:13,fontWeight:800}}>
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Selfie */}
            {step===3 && (
              <div>
                <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:4}}>Selfie com documento</div>
                <div style={{fontSize:11,color:"#555",marginBottom:20}}>
                  Tire uma foto segurando o documento ao lado do rosto
                </div>

                {showCamera && (
                  <CameraCapture
                    onCapture={(file, preview) => { setSelfie(file); setSelfiePreview(preview); }}
                    onClose={() => setShowCamera(false)}
                  />
                )}

                <div style={{marginBottom:14}}>
                  <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:6}}>SELFIE COM DOCUMENTO *</div>
                  <div onClick={()=>setShowCamera(true)}
                    style={{border:`2px dashed ${selfiePreview?"#22c55e":"#ffffff20"}`,borderRadius:12,
                      height:120,display:"flex",alignItems:"center",justifyContent:"center",
                      overflow:"hidden",background:"#ffffff05",position:"relative",cursor:"pointer"}}>
                    {selfiePreview ? (
                      <>
                        <img src={selfiePreview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        <div style={{position:"absolute",top:6,right:6,background:"#22c55e",
                          borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",
                          justifyContent:"center",fontSize:11,color:"#fff"}}>✓</div>
                        <div style={{position:"absolute",bottom:6,left:0,right:0,textAlign:"center",
                          fontSize:10,color:"#fff",background:"#00000088",padding:"2px 0"}}>
                          Clique para tirar novamente
                        </div>
                      </>
                    ) : (
                      <div style={{textAlign:"center",color:"#555"}}>
                        <div style={{fontSize:28,marginBottom:4}}>🤳</div>
                        <div style={{fontSize:11}}>Clique para abrir a câmera</div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{background:"#ffffff06",borderRadius:10,padding:"10px 12px",
                  marginBottom:8,fontSize:10,color:"#555",lineHeight:1.7}}>
                  🤳 Segure o documento ao lado do rosto<br/>
                  👁️ Rosto e documento devem estar visíveis e nítidos<br/>
                  💡 Ambiente bem iluminado
                </div>

                <div style={{background:"#38bdf810",border:"1px solid #38bdf833",borderRadius:8,
                  padding:"10px 12px",marginBottom:16,fontSize:10,color:"#38bdf8",lineHeight:1.6}}>
                  🔒 Seus dados são protegidos pela{" "}
                  <button onClick={()=>onPrivacy&&onPrivacy()} style={{background:"none",border:"none",
                    color:"#38bdf8",cursor:"pointer",fontSize:10,padding:0,fontWeight:700,textDecoration:"underline"}}>
                    LGPD
                  </button>
                  {" "}e usados apenas para verificação de identidade.
                  Nunca compartilhamos seus documentos com terceiros.
                </div>

                {err && <div style={{color:"#f87171",fontSize:11,marginBottom:8}}>⚠️ {err}</div>}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setStep(2)} style={{flex:1,padding:"13px",borderRadius:10,
                    border:"1px solid #ffffff15",background:"transparent",
                    color:"#666",fontSize:12,cursor:"pointer"}}>← Voltar</button>
                  <button onClick={submit} disabled={loading} style={{flex:2,padding:"13px",borderRadius:10,
                    border:"none",cursor:"pointer",
                    background:"linear-gradient(90deg,#22c55e,#16a34a)",
                    color:"#fff",fontSize:13,fontWeight:800,opacity:loading?0.7:1}}>
                    {loading?"Enviando...":"✓ Enviar para verificação"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ReportListingModal({ seller, fig, user, onClose }) {
  const REASONS = [
    "Preço abusivo",
    "Produto falso / réplica",
    "Foto enganosa",
    "Não entregou o produto",
    "Comportamento ofensivo",
    "Outro",
  ];
  const [reason,   setReason]   = useState("");
  const [details,  setDetails]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [err,      setErr]      = useState("");

  const submit = async () => {
    if (!reason) { setErr("Selecione um motivo"); return; }
    setErr(""); setLoading(true);
    try {
      await api.post("/marketplace/reports", {
        reported_user_id:   seller.userId || seller.id || null,
        reported_user_name: seller.nome || seller.name,
        reason,
        details,
        listing_id:  seller.listingId || seller.id || null,
        figure_name: fig?.name,
      });
      setSent(true);
    } catch(e) { setErr("Erro ao enviar. Tente novamente."); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#000000dd",zIndex:1300,
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:380,background:"#0d0d1a",borderRadius:16,
        border:"1px solid #ffffff15",padding:20}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:16}}>
          <div style={{flex:1,fontSize:15,fontWeight:900,color:"#f87171"}}>🚩 Denunciar anúncio</div>
          <button onClick={onClose} style={{background:"none",border:"none",
            color:"#555",cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        {sent ? (
          <div style={{textAlign:"center",padding:24}}>
            <div style={{fontSize:28,marginBottom:8}}>✅</div>
            <div style={{color:"#22c55e",fontWeight:700}}>Denúncia enviada!</div>
            <div style={{color:"#555",fontSize:12,marginTop:6}}>
              Nossa equipe vai analisar em breve.
            </div>
            <button onClick={onClose} style={{marginTop:16,padding:"8px 20px",
              borderRadius:20,border:"1px solid #ffffff20",background:"transparent",
              color:"#aaa",fontSize:12,cursor:"pointer"}}>Fechar</button>
          </div>
        ) : (
          <>
            <div style={{fontSize:11,color:"#555",marginBottom:12}}>
              Vendedor: <span style={{color:"#aaa"}}>{seller.nome}</span> —{" "}
              Figura: <span style={{color:"#aaa"}}>{fig?.name}</span>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>MOTIVO *</div>
              {REASONS.map(r => (
                <div key={r} onClick={()=>setReason(r)}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",
                    borderRadius:8,cursor:"pointer",marginBottom:4,
                    background: reason===r ? "#f8717120" : "#ffffff06",
                    border: `1px solid ${reason===r?"#f87171":"#ffffff10"}`}}>
                  <div style={{width:14,height:14,borderRadius:"50%",flexShrink:0,
                    border:`2px solid ${reason===r?"#f87171":"#444"}`,
                    background: reason===r?"#f87171":"transparent"}}/>
                  <span style={{fontSize:12,color: reason===r?"#f87171":"#888"}}>{r}</span>
                </div>
              ))}
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>
                DETALHES (opcional)
              </div>
              <textarea value={details} onChange={e=>setDetails(e.target.value)}
                placeholder="Descreva o problema..."
                style={{width:"100%",padding:"9px 12px",borderRadius:8,background:"#ffffff08",
                  border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none",
                  resize:"vertical",minHeight:70,boxSizing:"border-box"}}/>
            </div>
            {err && <div style={{color:"#f87171",fontSize:11,marginBottom:8}}>⚠️ {err}</div>}
            <button onClick={submit} disabled={loading} style={{
              width:"100%",padding:"11px",borderRadius:10,border:"none",cursor:"pointer",
              background:"linear-gradient(90deg,#f87171,#ef4444)",
              color:"#fff",fontSize:13,fontWeight:800,opacity:loading?0.7:1}}>
              {loading?"Enviando...":"Enviar denúncia"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function UserDashboardModal({ user: u, reports, onClose, onAction }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [col, ver] = await Promise.all([
          api.get(`/collection/${u.id}`).catch(()=>null),
          api.get(`/verification/status`).catch(()=>null),
        ]);
        setData({ col, ver });
      } catch(e) {}
      setLoading(false);
    };
    load();
  }, [u.id]);

  const userReports = reports.filter(r => 
    r.reported_user_id === u.id || r.reported_user_name === u.name
  );

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:2000,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{width:"100%",maxWidth:480,background:"#0d0d1a",borderRadius:16,
        border:"1px solid #ffffff15",maxHeight:"90vh",overflowY:"scroll",WebkitOverflowScrolling:"touch",touchAction:"pan-y"}}>

        {/* Header */}
        <div style={{padding:"16px 16px 0",display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:"#ffd70022",color:"#ffd700",
            display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:20,flexShrink:0}}>
            {u.name?.[0]?.toUpperCase()||"?"}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:900,color:"#fff"}}>{u.name}</div>
            <div style={{fontSize:11,color:"#555"}}>@{u.username||"—"} · {u.email}</div>
          </div>
          <button onClick={onClose} style={{background:"#ffffff10",border:"none",borderRadius:8,
            padding:"6px 10px",color:"#aaa",cursor:"pointer",fontSize:12}}>✕</button>
        </div>

        <div style={{padding:"0 16px 20px"}}>
          {/* Badges */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
            <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,
              background:"#ffd70022",color:"#ffd700",fontWeight:700}}>
              {u.plan==="free"?"🆓 Free":u.plan==="basic"?"⭐ Basic":"🏆 Plus"}
            </span>
            {u.verified && <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,
              background:"#22c55e22",color:"#22c55e",fontWeight:700}}>✓ Verificado</span>}
            {u.suspended_at && new Date(u.suspended_at) > new Date() && (
              <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,
                background:"#f8717122",color:"#f87171",fontWeight:700}}>
                ⏸️ Suspenso até {new Date(u.suspended_at).toLocaleDateString("pt-BR")}
              </span>
            )}
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {[
              {l:"Cadastro",v: u.created_at ? new Date(u.created_at).toLocaleDateString("pt-BR") : "—"},
              {l:"País",v: u.country_code||"BR"},
              {l:"Denúncias recebidas",v: userReports.length},
              {l:"Denúncias pendentes",v: userReports.filter(r=>r.status==="pending").length},
            ].map(s=>(
              <div key={s.l} style={{background:"#ffffff06",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:4}}>{s.l.toUpperCase()}</div>
                <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Coleção */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:8}}>COLEÇÃO</div>
            {loading ? (
              <div style={{textAlign:"center",padding:12,color:"#555",fontSize:11}}>Carregando...</div>
            ) : data?.col && !data.col.error ? (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                <div style={{background:"#ffffff06",borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:900,color:"#ffd700"}}>{Object.keys(data.col.owned||{}).length}</div>
                  <div style={{fontSize:10,color:"#555"}}>Tenho</div>
                </div>
                <div style={{background:"#ffffff06",borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:900,color:"#38bdf8"}}>{Object.keys(data.col.wished||{}).length}</div>
                  <div style={{fontSize:10,color:"#555"}}>Quero</div>
                </div>
                <div style={{background:"#ffffff06",borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:900,color:"#22c55e"}}>{Object.keys(data.col.listings||{}).length}</div>
                  <div style={{fontSize:10,color:"#555"}}>Vendendo</div>
                </div>
              </div>
            ) : (
              <div style={{background:"#ffffff06",borderRadius:8,padding:"12px",textAlign:"center",
                fontSize:11,color:"#444"}}>
                📦 Dados de coleção disponíveis quando o marketplace for implementado
              </div>
            )}
          </div>

          {/* Denúncias recebidas */}
          {userReports.length > 0 && (
            <div style={{marginBottom:16}}>
              <div style={{fontSize:10,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:8}}>DENÚNCIAS RECEBIDAS</div>
              {userReports.slice(0,3).map(r=>(
                <div key={r.id} style={{background:"#f8717110",borderRadius:8,padding:"8px 10px",marginBottom:6,
                  border:"1px solid #f8717120",fontSize:11,color:"#f87171"}}>
                  🚩 {r.reason} — {new Date(r.created_at).toLocaleDateString("pt-BR")}
                  <span style={{marginLeft:8,fontSize:9,color:r.status==="pending"?"#f87171":"#22c55e"}}>
                    {r.status==="pending"?"Pendente":"Resolvida"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* XP / Gamificação */}
          <div style={{marginBottom:16,background:"#0d0d1e",borderRadius:12,padding:12,
            border:"1px solid #ffd70022"}}>
            <div style={{fontSize:10,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:8}}>GAMIFICAÇÃO</div>
            {(()=>{
              const lvl = getLevelInfo(u.xp||0);
              return (
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <span style={{fontSize:22}}>{lvl.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:800,color:lvl.color}}>{lvl.name} (Nível {lvl.level})</div>
                      <div style={{background:"#ffffff10",borderRadius:20,height:5,overflow:"hidden",marginTop:4}}>
                        <div style={{width:`${lvl.pct}%`,height:"100%",background:lvl.color,borderRadius:20}}/>
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    {[{ic:"⭐",v:u.xp||0,l:"XP",c:"#a855f7"},{ic:"💰",v:u.credits||0,l:"Créditos",c:"#ffd700"},{ic:"🔥",v:u.login_streak||0,l:"Streak",c:"#ff8c00"}].map(s=>(
                      <div key={s.l} style={{flex:1,background:"#ffffff06",borderRadius:8,padding:"6px",textAlign:"center"}}>
                        <div style={{fontSize:13,fontWeight:900,color:s.c}}>{s.ic} {s.v}</div>
                        <div style={{fontSize:9,color:"#555"}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Ações — Reset Senha + Punição */}
          <div style={{borderTop:"1px solid #ffffff10",paddingTop:14}}>
            <UserAdminCard u={{...u, is_admin: false}}
              onProfile={null}
              onSuspend={(days)=>onAction("suspend",u.id,days)}
              onBan={()=>onAction("ban",u.id)}
              onDelete={()=>onAction("delete",u.id)}
              onChangePlan={(plan)=>onAction("plan",u.id,plan)}
              onResetPassword={async(pass)=>{
                await api.post(`/auth/admin-reset-password`,{userId:u.id,password:pass});
              }}
              hideProfile={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RANKING SCREEN ───────────────────────────────────────────────────────────
// ─── MARKETPLACE SCREEN ──────────────────────────────────────────────────────
function MarketplaceScreen({ user, onOpenFigure }) {
  const isBasic = user?.plan === "basic" || user?.plan === "pro" || user?.is_admin;
  const [listings, setListings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all"); // all | selling | wanted

  useEffect(()=>{ load(); },[]);

  const load = async () => {
    setLoading(true);
    try {
      const [sell, want] = await Promise.all([
        fetch(`${API_URL}/marketplace/listings`).then(r=>r.json()).catch(()=>[]),
        fetch(`${API_URL}/marketplace/wanted`).then(r=>r.json()).catch(()=>[]),
      ]);
      const items = [
        ...(sell||[]).map(l=>({...l, kind:"selling"})),
        ...(want||[]).map(w=>({...w, kind:"wanted"})),
      ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
      setListings(items);
    } catch(e) {}
    setLoading(false);
  };

  const filtered = filter==="all" ? listings
    : listings.filter(l=>l.kind===filter);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header */}
      <div style={{flexShrink:0,padding:"14px 16px 10px",
        background:"#07070fdd",borderBottom:"1px solid #ffd70018"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:900,
          color:"#ffd700",marginBottom:10}}>🛒 Marketplace</div>

        {/* Filtros */}
        <div style={{display:"flex",gap:6}}>
          {[
            {k:"all",     l:"Todos"},
            {k:"selling", l:"🏷️ À Venda"},
            {k:"wanted",  l:"🔍 Procurando"},
          ].map(f=>(
            <button key={f.k} onClick={()=>setFilter(f.k)}
              style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",
                fontSize:10,fontWeight:700,
                background:filter===f.k?"#ffd700":"#ffffff08",
                color:filter===f.k?"#000":"#555"}}>
              {f.l}
            </button>
          ))}
        </div>

        {/* Banner free */}
        {!isBasic && (
          <div style={{marginTop:10,background:"#ffd70011",border:"1px solid #ffd70033",
            borderRadius:10,padding:"8px 12px",fontSize:11,color:"#ffd700"}}>
            🔒 <strong>Plano Basic</strong> — veja preços, contatos e anuncie suas figuras
          </div>
        )}
      </div>

      <div style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",
        touchAction:"pan-y",padding:16}}>

        {loading && (
          <div style={{textAlign:"center",padding:"40px 0",color:"#555"}}>
            <div style={{fontSize:32,marginBottom:12}}>⏳</div>
            Carregando anúncios...
          </div>
        )}

        {!loading && filtered.length===0 && (
          <div style={{textAlign:"center",padding:"40px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>🛒</div>
            <div style={{fontSize:14,color:"#555"}}>Nenhum anúncio ainda</div>
            {isBasic && <div style={{fontSize:11,color:"#444",marginTop:8}}>
              Seja o primeiro a anunciar!
            </div>}
          </div>
        )}

        {!loading && filtered.map((item,i)=>{
          const fig = ALL_FIGURES.find(f=>f.id===item.figure_id);
          const imgUrl = `https://res.cloudinary.com/dr3sxytes/image/upload/figures/${item.figure_id}/1.jpg`;
          const isSelling = item.kind==="selling";

          return (
            <div key={i} onClick={()=>fig&&onOpenFigure(fig)}
              style={{background:"#0d0d1e",borderRadius:12,padding:12,marginBottom:8,
                border:`1px solid ${isSelling?"#ffd70022":"#a855f722"}`,
                cursor:fig?"pointer":"default",display:"flex",gap:10,alignItems:"center"}}>

              {/* Imagem */}
              <img src={imgUrl} alt=""
                style={{width:48,height:48,borderRadius:8,objectFit:"cover",
                  background:"#ffffff08",flexShrink:0}}
                onError={e=>{e.target.style.display="none";}}/>

              {/* Info */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:800,color:"#dde",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {fig?.name || item.figure_id}
                </div>
                <div style={{fontSize:10,color:"#555",marginTop:2}}>
                  {fig?.line || ""} · {isSelling?"À venda":"Procurando"}
                </div>
                {item.description && (
                  <div style={{fontSize:10,color:"#666",marginTop:2,
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {item.description}
                  </div>
                )}
              </div>

              {/* Preço / Badge */}
              <div style={{textAlign:"right",flexShrink:0}}>
                {isSelling ? (
                  isBasic ? (
                    <div style={{fontSize:14,fontWeight:900,color:"#ffd700"}}>
                      {item.currency} {item.price}
                    </div>
                  ) : (
                    <div style={{fontSize:16,color:"#555",letterSpacing:2}}>●●●</div>
                  )
                ) : (
                  <div style={{fontSize:10,color:"#a855f7",fontWeight:700,
                    background:"#a855f711",borderRadius:6,padding:"3px 8px"}}>
                    🔍 Busca
                  </div>
                )}
                {isSelling && item.condition && (
                  <div style={{fontSize:9,color:"#555",marginTop:2}}>{item.condition}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RankingScreen({ user }) {
  const [line,    setLine]    = useState("ex");
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [catLines, setCatLines] = useState([]);

  const currency = (() => {
    try { return JSON.parse(localStorage.getItem("ssv8_pref_currency")||'"BRL"'); } catch { return "BRL"; }
  })();

  const formatPrice = (price) => {
    if (!price) return "—";
    if (currency==="BRL") return `R$ ${Number(price).toFixed(2).replace('.',',')}`;
    if (currency==="USD") return `$ ${Number(price).toFixed(2)}`;
    if (currency==="JPY") return `¥ ${Math.round(price).toLocaleString()}`;
    if (currency==="EUR") return `€ ${Number(price).toFixed(2)}`;
    return `R$ ${Number(price).toFixed(2).replace('.',',')}`;
  };

  useEffect(()=>{
    api.get("/catalog/lines").then(d=>{ if(Array.isArray(d)) setCatLines(d.filter(l=>l.active)); });
  },[]);

  useEffect(()=>{ load(); },[line]);

  const load = async () => {
    setLoading(true);
    const data = await api.get(`/figures/ranking?line=${line}&currency=${currency}`).catch(()=>null);
    if (data?.ranking) setRanking(data.ranking);
    else setRanking([]);
    setLoading(false);
  };

  const LINES = [
    {k:"all",     l:"Todos"},
    {k:"ex",      l:"Cloth Myth EX"},
    {k:"cm",      l:"Cloth Myth"},
    {k:"vintage", l:"Vintage"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header */}
      <div style={{flexShrink:0,padding:"14px 16px 10px",
        background:"#07070fdd",borderBottom:"1px solid #ffd70018"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:900,
          color:"#ffd700",marginBottom:10}}>🏆 Ranking de Preços</div>
        <div style={{display:"flex",gap:5,overflowX:"auto"}}>
          {LINES.map(l=>(
            <button key={l.k} onClick={()=>setLine(l.k)}
              style={{padding:"5px 10px",borderRadius:20,border:"none",cursor:"pointer",
                whiteSpace:"nowrap",flexShrink:0,fontSize:10,fontWeight:700,
                background:line===l.k?"#ffd700":"#ffffff08",
                color:line===l.k?"#000":"#555"}}>
              {l.l}
            </button>
          ))}
        </div>
        <div style={{fontSize:9,color:"#444",marginTop:8}}>
          Baseado em preços informados pelos colecionadores · Moeda: {currency}
        </div>
      </div>

      <div style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",
        touchAction:"pan-y",padding:16}}>
        {loading && (
          <div style={{textAlign:"center",padding:"40px 0",color:"#555"}}>
            <div style={{fontSize:32,marginBottom:12}}>⏳</div>
            Carregando ranking...
          </div>
        )}
        {!loading && ranking.length === 0 && (
          <div style={{textAlign:"center",padding:"40px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>🏆</div>
            <div style={{fontSize:14,color:"#555",marginBottom:8}}>
              Nenhum dado disponível ainda
            </div>
            <div style={{fontSize:11,color:"#444"}}>
              O ranking é baseado nos preços que os colecionadores informam ao adicionar figuras à coleção.
            </div>
          </div>
        )}
        {!loading && ranking.map((item,i)=>{
          const fig = ALL_FIGURES.find(f=>f.id===item.figure_id);
          const imgUrl = `https://res.cloudinary.com/dr3sxytes/image/upload/figures/${item.figure_id}/1.jpg`;
          return (
            <div key={item.figure_id} style={{background:"#0d0d1e",borderRadius:12,
              padding:"10px 12px",marginBottom:8,border:"1px solid #ffffff0a",
              display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:16,fontWeight:900,color:"#ffd70066",
                width:24,textAlign:"center",flexShrink:0}}>#{i+1}</div>
              <img src={imgUrl} alt=""
                style={{width:40,height:40,borderRadius:6,objectFit:"cover",flexShrink:0,
                  background:"#ffffff08"}}
                onError={e=>{e.target.style.display="none";}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,color:"#dde",fontWeight:700,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {item.name||fig?.name||item.figure_id}
                </div>
                <div style={{fontSize:10,color:"#555"}}>
                  {item.count} {item.count===1?"registro":"registros"} · {fig?.line||""}
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:15,fontWeight:900,color:"#ffd700"}}>
                  {formatPrice(item.avg_price)}
                </div>
                {item.ref_price && (
                  <div style={{fontSize:9,color:"#555"}}>ref: {formatPrice(item.ref_price)}</div>
                )}
              </div>
            </div>
          );
        })}
        {!loading && ranking.length > 0 && (
          <div style={{fontSize:10,color:"#333",textAlign:"center",padding:"16px 0"}}>
            {ranking.length} figuras · Preços em {currency} · Dados dos colecionadores
          </div>
        )}
      </div>
    </div>
  );
}

// ─── USER ADMIN CARD ─────────────────────────────────────────────────────────
function UserAdminCard({ u, onProfile, onSuspend, onBan, onDelete, onResetPassword, onChangePlan, hideProfile=false }) {
  const [punOpen,      setPunOpen]      = useState(false);
  const [resetOpen,    setResetOpen]    = useState(false);
  const [punAction,    setPunAction]    = useState(null);
  const [suspDays,     setSuspDays]     = useState(null);
  const [customDays,   setCustomDays]   = useState("");
  const [confirmCount, setConfirmCount] = useState(0);
  const [newPass,      setNewPass]      = useState("");

  const reset = () => { setPunOpen(false); setResetOpen(false); setPunAction(null); setSuspDays(null); setCustomDays(""); setConfirmCount(0); setNewPass(""); };

  const execSuspend = () => {
    const days = suspDays === "custom" ? parseInt(customDays) : suspDays;
    if (!days || days < 1) return;
    onSuspend(days); reset();
  };

  // Calcula status de suspensão
  const isSuspended = u.suspended_until && new Date(u.suspended_until) > new Date();
  const suspDaysLeft = isSuspended ? Math.ceil((new Date(u.suspended_until) - new Date()) / 86400000) : 0;
  const isBanned = u.is_banned;

  return (
    <div style={{background: hideProfile?"transparent":"#ffffff08",borderRadius:12,padding: hideProfile?"0":14,marginBottom: hideProfile?0:10,border: hideProfile?"none":"1px solid #ffffff10"}}>
      {/* Header — só na lista de usuários */}
      {!hideProfile && (
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:"#ffd70022",color:"#ffd700",
            display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,flexShrink:0}}>
            {u.name?.[0]?.toUpperCase()||"?"}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",gap:6}}>
              {u.name}
              {u.is_admin && <span style={{fontSize:9,color:"#ffd700"}}>👑</span>}
            </div>
            <div style={{fontSize:10,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              @{u.username||"—"} · {new Date(u.created_at).toLocaleDateString("pt-BR")}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
            {u.verified && <span style={{fontSize:8,padding:"1px 6px",borderRadius:20,background:"#22c55e22",color:"#22c55e",fontWeight:700}}>✓ Verificado</span>}
            <span style={{fontSize:8,padding:"1px 6px",borderRadius:20,background:"#ffd70022",color:"#ffd700",fontWeight:700}}>{u.plan?.toUpperCase()}</span>
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10,fontSize:10}}>
        {(()=>{
          const isOnline = u.last_seen && (Date.now() - new Date(u.last_seen).getTime()) < 3*60*1000;
          return (
            <>
              {isOnline
                ? <span style={{color:"#22c55e",fontWeight:700}}>🟢 Online agora</span>
                : <span style={{color:"#444"}}>🕐 {u.last_login ? `Último acesso: ${new Date(u.last_login).toLocaleDateString("pt-BR")}` : "Nunca acessou"}</span>
              }
              {isBanned && <span style={{color:"#f87171",fontWeight:700}}>🔨 Banido</span>}
              {isSuspended && <span style={{color:"#ffd700",fontWeight:700}}>⏸️ Suspenso: {suspDaysLeft}d restantes</span>}
              {!isBanned && !isSuspended && !isOnline && <span style={{color:"#22c55e"}}>✅ Ativo</span>}
            </>
          );
        })()}
      </div>

      {/* Plano */}
      {!u.is_admin && onChangePlan && (
        <div style={{marginBottom:10}}>
          <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:5}}>PLANO</div>
          <div style={{display:"flex",gap:5}}>
            {["free","basic","plus"].map(p=>(
              <button key={p} onClick={()=>{
                if(u.plan===p) return;
                if(!window.confirm(`Alterar plano de ${u.plan?.toUpperCase()} para ${p.toUpperCase()}?`)) return;
                onChangePlan(p);
              }}
                style={{flex:1,padding:"5px 4px",borderRadius:7,border:"none",cursor:"pointer",
                  fontSize:10,fontWeight:700,
                  background:u.plan===p?"#ffd70033":"#ffffff08",
                  color:u.plan===p?"#ffd700":"#555",
                  outline:u.plan===p?"1px solid #ffd70055":"none"}}>
                {p==="free"?"🔓 Free":p==="basic"?"⭐ Basic":"💎 Plus"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botões — 3 colunas */}
      {!u.is_admin && (
        <div style={{display:"flex",gap:6}}>
          {!hideProfile && (
            <button onClick={onProfile}
              style={{flex:1,padding:"7px 4px",borderRadius:8,border:"none",cursor:"pointer",
                background:"#ffffff0d",color:"#aaa",fontSize:10,fontWeight:700}}>
              👤 Ver Perfil
            </button>
          )}
          <button onClick={()=>{setResetOpen(p=>!p); setPunOpen(false);}}
            style={{flex:1,padding:"7px 4px",borderRadius:8,border:"none",cursor:"pointer",
              background:resetOpen?"#38bdf822":"#ffffff0d",
              color:resetOpen?"#38bdf8":"#888",fontSize:10,fontWeight:700}}>
            🔑 Reset Senha
          </button>
          <button onClick={()=>{setPunOpen(p=>!p); setResetOpen(false); setPunAction(null); setConfirmCount(0);}}
            style={{flex:1,padding:"7px 4px",borderRadius:8,border:"none",cursor:"pointer",
              background:punOpen?"#ffd70022":"#ffffff0d",
              color:punOpen?"#ffd700":"#888",fontSize:10,fontWeight:700}}>
            ⚠️ Punição
          </button>
        </div>
      )}

      {/* Reset Senha */}
      {resetOpen && (
        <div style={{marginTop:10,background:"#0d0d1e",borderRadius:10,padding:12,border:"1px solid #38bdf822"}}>
          <div style={{fontSize:10,color:"#555",marginBottom:8}}>
            Senha temporária de uso único — usuário precisará alterar no próximo acesso.
          </div>
          <input value={newPass} onChange={e=>setNewPass(e.target.value)}
            placeholder="Nova senha temporária (mín. 6 caracteres)"
            style={{width:"100%",padding:"7px 10px",borderRadius:8,background:"#ffffff08",
              border:"1px solid #ffffff15",color:"#dde",fontSize:11,outline:"none",marginBottom:8}}/>
          <div style={{display:"flex",gap:6}}>
            <button onClick={reset}
              style={{flex:1,padding:"7px",borderRadius:8,border:"1px solid #ffffff15",
                background:"transparent",color:"#555",fontSize:10,cursor:"pointer"}}>
              Cancelar
            </button>
            <button onClick={()=>{ if(newPass.length>=6){ onResetPassword(newPass); reset(); }}}
              disabled={newPass.length<6}
              style={{flex:2,padding:"7px",borderRadius:8,border:"none",cursor:"pointer",
                background:newPass.length>=6?"#38bdf8":"#ffffff10",
                color:newPass.length>=6?"#000":"#555",fontSize:10,fontWeight:800}}>
              {newPass.length<6?`${newPass.length}/6 chars`:"🔑 Confirmar Reset"}
            </button>
          </div>
        </div>
      )}

      {/* Punição */}
      {punOpen && (
        <div style={{marginTop:10,background:"#0d0d1e",borderRadius:10,padding:12,border:"1px solid #ffffff0a"}}>

          {/* Suspender */}
          <button onClick={()=>setPunAction(punAction==="suspend"?null:"suspend")}
            style={{width:"100%",padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
              background:punAction==="suspend"?"#ffd70022":"#ffffff08",
              color:punAction==="suspend"?"#ffd700":"#888",fontSize:11,fontWeight:700,
              textAlign:"left",marginBottom:6}}>
            ⏸️ Suspender {punAction==="suspend"?"▲":"▼"}
          </button>
          {punAction==="suspend" && (
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                {[1,7,15,30,"custom"].map(d=>(
                  <button key={d} onClick={()=>setSuspDays(d)}
                    style={{padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,
                      background:suspDays===d?"#ffd700":"#ffffff10",color:suspDays===d?"#000":"#888"}}>
                    {d==="custom"?"Outro":d+"d"}
                  </button>
                ))}
              </div>
              {suspDays==="custom" && (
                <input value={customDays} onChange={e=>setCustomDays(e.target.value)}
                  placeholder="Dias (ex: 45)" type="number" min="1"
                  style={{width:"100%",padding:"6px 10px",borderRadius:8,background:"#ffffff08",
                    border:"1px solid #ffffff15",color:"#dde",fontSize:11,outline:"none",marginBottom:8}}/>
              )}
              {suspDays && (
                <button onClick={execSuspend}
                  style={{width:"100%",padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
                    background:"#ffd700",color:"#000",fontSize:11,fontWeight:800}}>
                  Confirmar suspensão de {suspDays==="custom"?customDays:suspDays} dia(s)
                </button>
              )}
            </div>
          )}

          {/* Banir */}
          <button onClick={()=>{setPunAction(punAction==="ban"?null:"ban"); setConfirmCount(0);}}
            style={{width:"100%",padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
              background:punAction==="ban"?"#f8717122":"#ffffff08",
              color:punAction==="ban"?"#f87171":"#888",fontSize:11,fontWeight:700,
              textAlign:"left",marginBottom:6}}>
            🔨 Banir {punAction==="ban"?"▲":"▼"}
          </button>
          {punAction==="ban" && (
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:"#f87171",marginBottom:8}}>⚠️ Banimento permanente.</div>
              <button onClick={()=>{ if(confirmCount>=1){ onBan(); reset(); } else setConfirmCount(1); }}
                style={{width:"100%",padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
                  background:confirmCount>=1?"#f87171":"#f8717122",
                  color:confirmCount>=1?"#fff":"#f87171",fontSize:11,fontWeight:800}}>
                {confirmCount===0?"⚠️ Confirmar banimento":"🔴 Clique novamente para confirmar"}
              </button>
            </div>
          )}

          {/* Excluir */}
          <button onClick={()=>{setPunAction(punAction==="delete"?null:"delete"); setConfirmCount(0);}}
            style={{width:"100%",padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
              background:punAction==="delete"?"#ff444422":"#ffffff08",
              color:punAction==="delete"?"#ff4444":"#888",fontSize:11,fontWeight:700,
              textAlign:"left",marginBottom:6}}>
            🗑️ Excluir conta {punAction==="delete"?"▲":"▼"}
          </button>
          {punAction==="delete" && (
            <div style={{marginBottom:6}}>
              <div style={{fontSize:11,color:"#ff4444",marginBottom:8}}>⚠️ Exclui conta e todos os dados permanentemente.</div>
              <button onClick={()=>{ if(confirmCount>=1){ onDelete(); reset(); } else setConfirmCount(1); }}
                style={{width:"100%",padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
                  background:confirmCount>=1?"#ff4444":"#ff444422",
                  color:confirmCount>=1?"#fff":"#ff4444",fontSize:11,fontWeight:800}}>
                {confirmCount===0?"⚠️ Confirmar exclusão":"🔴 Clique novamente para confirmar definitivamente"}
              </button>
            </div>
          )}

          <button onClick={reset}
            style={{width:"100%",padding:"6px",borderRadius:8,border:"none",cursor:"pointer",
              background:"transparent",color:"#444",fontSize:10,marginTop:4}}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

// ─── FIGURES ADMIN TAB ───────────────────────────────────────────────────────
function FiguresAdminTab({ onSave, onDelete }) {
  const [search,    setSearch]    = useState("");
  const [selected,  setSelected]  = useState(null); // figura selecionada
  const [form,      setForm]      = useState({});
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState("");
  const [overrides, setOverrides] = useState({});

  useEffect(()=>{
    api.get("/figures/overrides").then(data=>{
      if(Array.isArray(data)){
        const map = {};
        data.forEach(o=>{ map[o.figure_id]=o; });
        setOverrides(map);
      }
    });
  },[]);

  const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const filtered = ALL_FIGURES.filter(f => !search || norm(f.name).includes(norm(search)));

  const selectFig = (fig) => {
    const ov = overrides[fig.id] || {};
    setSelected(fig);
    setForm({
      name:       ov.name       || fig.name,
      line:       ov.line       || fig.line,
      saga:       ov.saga       || fig.saga,
      tipo:       ov.tipo       || fig.tipo,
      ver:        ov.ver        || fig.ver,
      lancamento: ov.lancamento || fig.lancamento || "",
    });
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    await onSave(selected.id, form);
    setOverrides(p=>({...p, [selected.id]: {...form, figure_id: selected.id}}));
    setMsg("✅ Salvo!");
    setSaving(false);
    setTimeout(()=>setMsg(""),2000);
  };

  const remove = async () => {
    if (!selected) return;
    await onDelete(selected.id);
    setOverrides(p=>{ const n={...p}; delete n[selected.id]; return n; });
    setSelected(null);
    setMsg("🗑️ Override removido!");
    setTimeout(()=>setMsg(""),2000);
  };

  const LINHAS  = ["Cloth Myth EX","Cloth Myth","Cloth Myth Appendix","Vintage (Die-Cast)","Saint Cloth Legend","Figuarts Zero"];
  const SAGAS   = ["Santuário","Asgard","Poseidon","Hades","Soul of Gold","Saintia Sho","Filmes","Omega"];
  const TIPOS   = ["Cavaleiros de Bronze","Cavaleiros de Prata","Cavaleiros de Ouro","God Warriors","Marinas","Espectrais","Deuses","God Cloth","Soul of Gold","Surplice","Cavaleiros de Aço","Black Saints","Outros"];
  const VERSOES = ["V1","V2","V3","V4","EX","OCE","ROE","Revival","Gold","Broken","Vintage","Standard","Especial","10th","15th"];

  return (
    <div style={{display:"flex",gap:12,height:"60vh"}}>
      {/* Lista de figuras */}
      <div style={{width:160,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍 Buscar..."
          style={{padding:"6px 8px",borderRadius:8,background:"#ffffff08",
            border:"1px solid #ffffff15",color:"#dde",fontSize:11,outline:"none",width:"100%"}}/>
        <div style={{flex:1,overflowY:"scroll",display:"flex",flexDirection:"column",gap:3}}>
          {filtered.map(fig=>{
            const hasOv = !!overrides[fig.id];
            const isSelected = selected?.id===fig.id;
            return (
              <button key={fig.id} onClick={()=>selectFig(fig)}
                style={{padding:"5px 8px",borderRadius:6,border:"none",cursor:"pointer",
                  textAlign:"left",fontSize:10,
                  background:isSelected?"#ffd70022":hasOv?"#22c55e11":"#ffffff08",
                  color:isSelected?"#ffd700":hasOv?"#22c55e":"#888",
                  borderLeft:hasOv?"2px solid #22c55e":"2px solid transparent"}}>
                {fig.name}
                {hasOv && <span style={{fontSize:8,marginLeft:4}}>✏️</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulário */}
      <div style={{flex:1,overflowY:"scroll"}}>
        {!selected ? (
          <div style={{textAlign:"center",padding:40,color:"#555",fontSize:13}}>
            Selecione uma figura para editar
          </div>
        ) : (
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"#ffd700",marginBottom:12}}>
              ✏️ {selected.name}
              <span style={{fontSize:10,color:"#555",marginLeft:8,fontWeight:400}}>({selected.id})</span>
            </div>

            {msg && <div style={{fontSize:12,color:"#22c55e",marginBottom:10,fontWeight:700}}>{msg}</div>}

            {[
              {l:"Nome",       k:"name",       type:"text",    ph:selected.name},
              {l:"Lançamento", k:"lancamento", type:"text",    ph:selected.lancamento||"ex: 2013-11"},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:8}}>
                <div style={{fontSize:9,color:"#555",marginBottom:3}}>{f.l.toUpperCase()}</div>
                <input value={form[f.k]||""} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}
                  placeholder={f.ph}
                  style={{width:"100%",padding:"7px 10px",borderRadius:8,
                    background:"#ffffff08",border:"1px solid #ffffff15",
                    color:"#dde",fontSize:11,outline:"none"}}/>
              </div>
            ))}

            {[
              {l:"Linha",      k:"line",  opts:LINHAS},
              {l:"Saga",       k:"saga",  opts:SAGAS},
              {l:"Cavaleiros", k:"tipo",  opts:TIPOS},
              {l:"Versão",     k:"ver",   opts:VERSOES},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:8}}>
                <div style={{fontSize:9,color:"#555",marginBottom:3}}>{f.l.toUpperCase()}</div>
                <select value={form[f.k]||""} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}
                  style={{width:"100%",padding:"7px 10px",borderRadius:8,
                    background:"#0d0d1e",border:"1px solid #ffffff15",
                    color:"#dde",fontSize:11,outline:"none"}}>
                  <option value="">— padrão ({selected[f.k]}) —</option>
                  {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div style={{display:"flex",gap:8,marginTop:14}}>
              {overrides[selected.id] && (
                <button onClick={remove}
                  style={{padding:"8px 12px",borderRadius:8,border:"1px solid #f8717133",
                    background:"#f8717111",color:"#f87171",fontSize:11,cursor:"pointer",fontWeight:700}}>
                  🗑️ Remover
                </button>
              )}
              <button onClick={save} disabled={saving}
                style={{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
                  background:"linear-gradient(90deg,#ffd700,#ff8c00)",
                  color:"#000",fontSize:11,fontWeight:800}}>
                {saving?"Salvando...":"💾 Salvar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GAMIFICATION ADMIN TAB ──────────────────────────────────────────────────
function GamificationAdminTab() {
  const [config,   setConfig]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(null);
  const [msg,      setMsg]      = useState("");

  useEffect(()=>{ load(); },[]);

  const load = async () => {
    setLoading(true);
    const d = await api.get("/gamification/config").catch(()=>null);
    if (d && !d.error) setConfig(d);
    setLoading(false);
  };

  const save = async (item) => {
    setSaving(item.action);
    const d = await api.put(`/gamification/config/${item.action}`, {
      xp: Number(item.xp)||0,
      credits: Number(item.credits)||0,
      active: item.active,
      label: item.label,
    }).catch(()=>null);
    setSaving(null);
    if (d && !d.error) {
      setMsg("Salvo!");
      setTimeout(()=>setMsg(""),2000);
    }
  };

  const update = (action, field, value) => {
    setConfig(prev=>prev.map(c=>c.action===action?{...c,[field]:value}:c));
  };

  if (loading) return <div style={{padding:20,color:"#555",textAlign:"center"}}>Carregando...</div>;

  return (
    <div style={{padding:"16px 0"}}>
      <div style={{fontSize:14,fontWeight:800,color:"#ffd700",marginBottom:4}}>⚙️ Configuração de Gamificação</div>
      <div style={{fontSize:11,color:"#555",marginBottom:16}}>
        Defina quantos XP e Créditos cada ação concede. Os valores são espelhados no app.
      </div>

      {msg && <div style={{background:"#22c55e22",border:"1px solid #22c55e44",borderRadius:8,
        padding:"8px 12px",marginBottom:12,fontSize:12,color:"#22c55e"}}>{msg}</div>}

      {config.map(item=>(
        <div key={item.action} style={{background:"#0d0d1e",borderRadius:12,padding:12,
          marginBottom:8,border:`1px solid ${item.active?"#ffffff10":"#ff444422"}`,
          opacity:item.active?1:0.6}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:"#dde"}}>{item.label}</div>
              <div style={{fontSize:9,color:"#555",letterSpacing:1}}>{item.action}</div>
            </div>
            <button onClick={()=>{ update(item.action,"active",!item.active); }}
              style={{padding:"4px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,
                background:item.active?"#22c55e22":"#ff444422",
                color:item.active?"#22c55e":"#f87171",fontWeight:700}}>
              {item.active?"ATIVO":"INATIVO"}
            </button>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:9,color:"#a855f7",fontWeight:700,marginBottom:4}}>⭐ XP</div>
              <input type="number" min="0" value={item.xp}
                onChange={e=>update(item.action,"xp",e.target.value)}
                style={{width:"100%",padding:"6px 8px",borderRadius:6,
                  background:"#ffffff08",border:"1px solid #a855f733",
                  color:"#a855f7",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:9,color:"#ffd700",fontWeight:700,marginBottom:4}}>💰 Créditos</div>
              <input type="number" min="0" value={item.credits}
                onChange={e=>update(item.action,"credits",e.target.value)}
                style={{width:"100%",padding:"6px 8px",borderRadius:6,
                  background:"#ffffff08",border:"1px solid #ffd70033",
                  color:"#ffd700",fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}/>
            </div>
            <button onClick={()=>save(item)}
              disabled={saving===item.action}
              style={{padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",
                background:"#ffd700",color:"#000",fontSize:11,fontWeight:800,
                marginTop:16,opacity:saving===item.action?0.5:1}}>
              {saving===item.action?"...":"💾"}
            </button>
          </div>
        </div>
      ))}

      {config.length===0 && (
        <div style={{textAlign:"center",padding:20,color:"#555",fontSize:12}}>
          Nenhuma configuração encontrada. Verifique a tabela gamification_config no Supabase.
        </div>
      )}
    </div>
  );
}

function AdminScreen({ user, onClose }) {
  const [tab, setTab] = useState("pending");
  const [suggestions,    setSuggestions]    = useState([]);
  const [reports,        setReports]        = useState([]);
  const [users,          setUsers]          = useState([]);
  const [verifications,  setVerifications]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [repFilter, setRepFilter] = useState("pending");
  const [userDashboard, setUserDashboard] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sug, rep, usr, ver] = await Promise.all([
          api.get("/figures/suggestions"),
          api.get("/marketplace/reports"),
          api.get("/admin/users"),
          api.get("/verification/pending"),
        ]);
        if (sug && !sug.error) setSuggestions(sug);
        if (rep && !rep.error) setReports(rep);
        if (usr && !usr.error) setUsers(usr);
        if (ver && !ver.error) setVerifications(Array.isArray(ver) ? ver : []);
      } catch(e) {}
      setLoading(false);
    };
    load();

    // Auto-refresh a cada 60 segundos
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const approveSuggestion = async (id) => {
    await api.put(`/figures/suggestions/${id}/approve`);
    setSuggestions(p => p.map(s => s.id===id ? {...s, status:"approved"} : s));
    setActionMsg("✅ Aprovado!"); setTimeout(()=>setActionMsg(""),2000);
  };
  const rejectSuggestion = async (id) => {
    await api.put(`/figures/suggestions/${id}/reject`);
    setSuggestions(p => p.map(s => s.id===id ? {...s, status:"rejected"} : s));
    setActionMsg("❌ Rejeitado!"); setTimeout(()=>setActionMsg(""),2000);
  };
  const resolveReport = async (id) => {
    await api.put(`/marketplace/reports/${id}`, { status:"resolved" });
    setReports(p => p.map(r => r.id===id ? {...r, status:"resolved"} : r));
    setActionMsg("✅ Resolvido!"); setTimeout(()=>setActionMsg(""),2000);
  };
  const suspendUser = async (userId, days) => {
    await api.put(`/admin/users/${userId}/suspend`, { days });
    setUsers(p => p.map(u => u.id===userId ? {...u, suspended:true} : u));
    setActionMsg(`⏸️ Suspenso por ${days} dias!`); setTimeout(()=>setActionMsg(""),2000);
  };
  const changePlan = async (userId, plan) => {
    await api.put(`/admin/users/${userId}/plan`, { plan });
    setUsers(p => p.map(u => u.id===userId ? {...u, plan} : u));
    setActionMsg(`✅ Plano alterado para ${plan}!`); setTimeout(()=>setActionMsg(""),2000);
  };
  const banUser = async (userId) => {
    if (!window.confirm("Banir permanentemente?")) return;
    await api.put(`/admin/users/${userId}/ban`);
    setUsers(p => p.filter(u => u.id!==userId));
    setActionMsg("🔨 Banido!"); setTimeout(()=>setActionMsg(""),2000);
  };
  const deleteUser = async (userId) => {
    if (!window.confirm("Excluir usuário permanentemente?")) return;
    await api.delete(`/admin/users/${userId}`);
    setUsers(p => p.filter(u => u.id!==userId));
    setActionMsg("🗑️ Excluído!"); setTimeout(()=>setActionMsg(""),2000);
  };

  const approveVerification = async (id, userId) => {
    await api.post(`/verification/${id}/approve`, { notes: "" });
    setVerifications(p => p.filter(v => v.id !== id));
    setUsers(p => p.map(u => u.id===userId ? {...u, verified:true} : u));
    setActionMsg("✅ Verificação aprovada!"); setTimeout(()=>setActionMsg(""),2000);
  };
  const rejectVerification = async (id, reason) => {
    await api.post(`/verification/${id}/reject`, { notes: reason });
    setVerifications(p => p.filter(v => v.id !== id));
    setActionMsg("❌ Verificação rejeitada!"); setTimeout(()=>setActionMsg(""),2000);
  };

  const pendingSug = suggestions.filter(s=>s.status==="pending");
  const pendingRep = reports.filter(r=>r.status==="pending");
  const pendingVer = verifications.filter(v=>v.status==="pending");

  const TABS = [
    {k:"verifications", l:`🪪 Verificações (${pendingVer.length})`},
    {k:"pending",       l:`⏳ Sugestões (${pendingSug.length})`},
    {k:"reports",       l:`🚩 Denúncias (${pendingRep.length})`},
    {k:"users",         l:`👥 Usuários (${users.length})`},
    {k:"approved",      l:"✅ Aprovadas"},
    {k:"figures",       l:"🎭 Figuras"},
    {k:"catalog",       l:"📂 Catálogo"},
    {k:"gamification",  l:"⚙️ Gamificação"},
  ];

  // ── Estados do Catálogo ──
  const CAT_TYPES = [
    {k:"lines",        l:"📦 Linhas"},
    {k:"sagas",        l:"⚔️ Sagas"},
    {k:"knight_types", l:"🛡️ Cavaleiros"},
    {k:"versions",     l:"✨ Versões"},
  ];
  const [catType,    setCatType]    = useState("lines");
  const [catItems,   setCatItems]   = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catForm,    setCatForm]    = useState(null);
  const [catMsg,     setCatMsg]     = useState("");

  const loadCatalog = async (type) => {
    setCatLoading(true);
    const data = await api.get(`/catalog/${type||catType}`);
    if (data && !data.error) setCatItems(data);
    setCatLoading(false);
  };

  useEffect(()=>{ if(tab==="catalog") loadCatalog(catType); },[tab,catType]);

  const saveCatItem = async () => {
    if (!catForm?.name || !catForm?.slug) return;
    const payload = {name:catForm.name,slug:catForm.slug,order_num:catForm.order_num||0,active:catForm.active??true};
    if (catForm.id) await api.put(`/catalog/${catType}/${catForm.id}`, payload);
    else await api.post(`/catalog/${catType}`, payload);
    setCatMsg(catForm.id?"✅ Atualizado!":"✅ Criado!");
    setCatForm(null); loadCatalog(catType);
    setTimeout(()=>setCatMsg(""),2000);
  };

  const deleteCatItem = async (id) => {
    if (!window.confirm("Deletar este item?")) return;
    await api.delete(`/catalog/${catType}/${id}`);
    setCatMsg("🗑️ Deletado!"); loadCatalog(catType);
    setTimeout(()=>setCatMsg(""),2000);
  };

  const toggleCatActive = async (item) => {
    await api.put(`/catalog/${catType}/${item.id}`, {...item, active:!item.active});
    loadCatalog(catType);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#06060f",zIndex:1000,overflowY:"scroll",WebkitOverflowScrolling:"touch",touchAction:"pan-y"}}>
      <div style={{maxWidth:600,margin:"0 auto",padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,paddingTop:10}}>
          <button onClick={onClose} style={{background:"#ffffff10",border:"none",borderRadius:8,
            padding:"6px 12px",color:"#aaa",cursor:"pointer",fontSize:12}}>← Voltar</button>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:900,color:"#ffd700"}}>⚙️ Painel Admin</div>
          </div>
          {actionMsg && <div style={{fontSize:12,color:"#22c55e",fontWeight:700}}>{actionMsg}</div>}
        </div>

        <div style={{display:"flex",gap:4,marginBottom:20,overflowX:"auto"}}>
          {TABS.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{
              flexShrink:0,padding:"8px 12px",border:"none",borderRadius:8,cursor:"pointer",
              fontSize:10,fontWeight:800,whiteSpace:"nowrap",
              background:tab===t.k?"#ffd700":"#ffffff08",
              color:tab===t.k?"#000":"#555"}}>
              {t.l}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{textAlign:"center",padding:40,color:"#555"}}>Carregando...</div>
        ) : (
          <>
            {(tab==="pending"||tab==="approved") && (() => {
              const list = tab==="pending" ? pendingSug : suggestions.filter(s=>s.status==="approved");
              return list.length===0 ? (
                <div style={{textAlign:"center",padding:40,color:"#555"}}>Nenhuma sugestão</div>
              ) : list.map(s=>(
                <div key={s.id} style={{background:"#ffffff08",borderRadius:12,padding:16,marginBottom:12,border:"1px solid #ffffff10"}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:4}}>{s.name}</div>
                  <div style={{fontSize:11,color:"#555",marginBottom:2}}>Linha: <span style={{color:"#aaa"}}>{s.line||"—"}</span></div>
                  <div style={{fontSize:11,color:"#555",marginBottom:2}}>Lançamento: <span style={{color:"#aaa"}}>{s.release_date||"—"}</span></div>
                  <div style={{fontSize:11,color:"#555",marginBottom:2}}>Por: <span style={{color:"#aaa"}}>{s.suggested_by_name||"Sistema"}</span></div>
                  {s.amiami_url&&<a href={s.amiami_url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#38bdf8"}}>Ver no AmiAmi →</a>}
                  {s.notes&&<div style={{fontSize:11,color:"#888",marginTop:6,background:"#ffffff05",borderRadius:6,padding:"6px 8px"}}>💬 {s.notes}</div>}
                  {tab==="pending"&&(
                    <div style={{display:"flex",gap:8,marginTop:12}}>
                      <button onClick={()=>approveSuggestion(s.id)} style={{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",background:"#22c55e22",color:"#22c55e",fontWeight:800,fontSize:12}}>✅ Aprovar</button>
                      <button onClick={()=>rejectSuggestion(s.id)} style={{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",background:"#ff444420",color:"#f87171",fontWeight:800,fontSize:12}}>❌ Rejeitar</button>
                    </div>
                  )}
                </div>
              ));
            })()}

            {/* VERIFICAÇÕES */}
            {tab==="verifications" && (
              pendingVer.length===0 ? (
                <div style={{textAlign:"center",padding:40,color:"#555"}}>Nenhuma verificação pendente</div>
              ) : pendingVer.map(v=>(
                <div key={v.id} style={{background:"#ffffff08",borderRadius:12,padding:16,
                  marginBottom:12,border:"1px solid #22c55e33"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>{v.users?.name || "—"}</div>
                      <div style={{fontSize:10,color:"#555"}}>{v.users?.email}</div>
                    </div>
                    <span style={{fontSize:9,padding:"2px 8px",borderRadius:20,
                      background:"#ffd70022",color:"#ffd700",fontWeight:700,alignSelf:"flex-start"}}>
                      {v.doc_type?.toUpperCase()}
                    </span>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                    <div style={{fontSize:10,color:"#555"}}>Doc: <span style={{color:"#aaa"}}>{v.doc_number}</span></div>
                    <div style={{fontSize:10,color:"#555"}}>País: <span style={{color:"#aaa"}}>{v.country||"BR"}</span></div>
                    <div style={{fontSize:10,color:"#555"}}>Tel: <span style={{color:"#aaa"}}>{v.phone_ddi} {v.phone}</span></div>
                  </div>
                  {/* Fotos */}
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    {v.doc_front_url && (
                      <a href={v.doc_front_url} target="_blank" rel="noreferrer"
                        style={{flex:1,height:80,borderRadius:8,overflow:"hidden",display:"block"}}>
                        <img src={v.doc_front_url} alt="Frente"
                          style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        <div style={{fontSize:9,color:"#555",textAlign:"center",marginTop:2}}>Frente</div>
                      </a>
                    )}
                    {v.doc_back_url && (
                      <a href={v.doc_back_url} target="_blank" rel="noreferrer"
                        style={{flex:1,height:80,borderRadius:8,overflow:"hidden",display:"block"}}>
                        <img src={v.doc_back_url} alt="Verso"
                          style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        <div style={{fontSize:9,color:"#555",textAlign:"center",marginTop:2}}>Verso</div>
                      </a>
                    )}
                    {v.selfie_url && (
                      <a href={v.selfie_url} target="_blank" rel="noreferrer"
                        style={{flex:1,height:80,borderRadius:8,overflow:"hidden",display:"block"}}>
                        <img src={v.selfie_url} alt="Selfie"
                          style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        <div style={{fontSize:9,color:"#555",textAlign:"center",marginTop:2}}>Selfie</div>
                      </a>
                    )}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>approveVerification(v.id, v.user_id)} style={{
                      flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
                      background:"#22c55e22",color:"#22c55e",fontWeight:800,fontSize:12}}>
                      ✅ Aprovar
                    </button>
                    <button onClick={()=>{
                      const reason = window.prompt("Motivo da rejeição:");
                      if(reason!==null) rejectVerification(v.id, reason);
                    }} style={{
                      flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
                      background:"#ff444420",color:"#f87171",fontWeight:800,fontSize:12}}>
                      ❌ Rejeitar
                    </button>
                  </div>
                </div>
              ))
            )}

            {tab==="reports" && (() => {
              const pending  = reports.filter(r=>r.status==="pending");
              const resolved = reports.filter(r=>r.status!=="pending");
              const shown = repFilter==="pending" ? pending : resolved;
              return (
                <>
                  <div style={{display:"flex",gap:4,marginBottom:16}}>
                    {[{k:"pending",l:`⏳ Pendentes (${pending.length})`},{k:"resolved",l:`✅ Resolvidas (${resolved.length})`}].map(t=>(
                      <button key={t.k} onClick={()=>setRepFilter(t.k)}
                        style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",
                          fontSize:10,fontWeight:700,
                          background:repFilter===t.k?"#ffd700":"#ffffff08",
                          color:repFilter===t.k?"#000":"#aaa"}}>{t.l}</button>
                    ))}
                  </div>
                  {shown.length===0 ? (
                    <div style={{textAlign:"center",padding:40,color:"#555"}}>Nenhuma denúncia</div>
                  ) : shown.map(r=>(
                <div key={r.id} style={{background:"#ffffff08",borderRadius:12,padding:16,marginBottom:12,border:`1px solid ${r.status==="pending"?"#f8717133":"#ffffff10"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{fontSize:13,fontWeight:800,color:"#f87171"}}>🚩 {r.reason}</div>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:r.status==="pending"?"#f8717122":"#22c55e22",color:r.status==="pending"?"#f87171":"#22c55e",fontWeight:700}}>
                      {r.status==="pending"?"Pendente":"Resolvida"}
                    </span>
                  </div>
                  <div style={{fontSize:11,color:"#555",marginBottom:2}}>Denunciado:{" "}
                    <span style={{color:"#aaa"}}>{r.reported_user_name||"—"}</span>
                    {(r.reported_user_id || r.reported_user_name) && (
                      <button onClick={()=>{
                        const u = users.find(x=>x.id===r.reported_user_id || x.name===r.reported_user_name);
                        if(u) setUserDashboard(u);
                        else setActionMsg("Usuário não encontrado (pode ter sido banido)");
                        setTimeout(()=>setActionMsg(""),3000);
                      }} style={{background:"none",border:"none",cursor:"pointer",
                        color:"#38bdf8",fontSize:10,marginLeft:6,textDecoration:"underline"}}>
                        👤 Ver perfil
                      </button>
                    )}
                  </div>
                  <div style={{fontSize:11,color:"#555",marginBottom:2}}>Figura: <span style={{color:"#aaa"}}>{r.figure_name||"—"}</span></div>
                  <div style={{fontSize:11,color:"#555",marginBottom:2}}>Por: <span style={{color:"#aaa"}}>{r.reporter_name}</span></div>
                  <div style={{fontSize:11,color:"#555",marginBottom:2}}>Data: <span style={{color:"#aaa"}}>{new Date(r.created_at).toLocaleDateString("pt-BR")}</span></div>
                  {r.details&&<div style={{fontSize:11,color:"#888",marginTop:6,background:"#ffffff05",borderRadius:6,padding:"6px 8px"}}>💬 {r.details}</div>}
                  {r.status!=="pending"&&r.admin_notes&&(
                    <div style={{fontSize:11,color:"#22c55e",marginTop:6,background:"#22c55e11",borderRadius:6,padding:"6px 8px"}}>
                      ✅ Ação tomada: {r.admin_notes}
                    </div>
                  )}
                  {r.status!=="pending"&&!r.admin_notes&&(
                    <div style={{fontSize:11,color:"#555",marginTop:6,background:"#ffffff05",borderRadius:6,padding:"6px 8px"}}>
                      — Nenhuma ação tomada
                    </div>
                  )}

                  {r.status==="pending"&&(
                    <div style={{marginTop:12}}>
                      <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:8}}>AÇÕES SOBRE O ANÚNCIO</div>
                      <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                        <button onClick={async()=>{
                          await api.put(`/marketplace/reports/${r.id}`,{status:"resolved",admin_notes:"Anúncio suspenso"});
                          setReports(p=>p.map(x=>x.id===r.id?{...x,status:"resolved"}:x));
                          setActionMsg("⏸️ Anúncio suspenso!"); setTimeout(()=>setActionMsg(""),2000);
                        }} style={{padding:"6px 10px",borderRadius:8,border:"none",cursor:"pointer",background:"#ffd70020",color:"#ffd700",fontSize:10,fontWeight:700}}>
                          ⏸️ Suspender anúncio
                        </button>
                        <button onClick={async()=>{
                          if(!window.confirm("Excluir este anúncio permanentemente?")) return;
                          if(r.listing_id) await api.delete(`/marketplace/listings/${r.listing_id}`);
                          await api.put(`/marketplace/reports/${r.id}`,{status:"resolved",admin_notes:"Anúncio excluído"});
                          setReports(p=>p.map(x=>x.id===r.id?{...x,status:"resolved"}:x));
                          setActionMsg("🗑️ Anúncio excluído!"); setTimeout(()=>setActionMsg(""),2000);
                        }} style={{padding:"6px 10px",borderRadius:8,border:"none",cursor:"pointer",background:"#ff444420",color:"#ff4444",fontSize:10,fontWeight:700}}>
                          🗑️ Excluir anúncio
                        </button>
                      </div>

                      <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1,marginBottom:8}}>AÇÕES SOBRE O USUÁRIO</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                        {[1,7,30].map(d=>(
                          <button key={d} onClick={async()=>{
                            if(r.reported_user_id) await suspendUser(r.reported_user_id,d);
                            await api.put(`/marketplace/reports/${r.id}`,{status:"resolved",admin_notes:`Usuário suspenso ${d}d`});
                            setReports(p=>p.map(x=>x.id===r.id?{...x,status:"resolved"}:x));
                          }} style={{padding:"6px 10px",borderRadius:8,border:"none",cursor:"pointer",background:"#ffd70020",color:"#ffd700",fontSize:10,fontWeight:700}}>
                            ⏸️ Suspender {d}d
                          </button>
                        ))}
                        <button onClick={async()=>{
                          if(r.reported_user_id) await banUser(r.reported_user_id);
                          await api.put(`/marketplace/reports/${r.id}`,{status:"resolved",admin_notes:"Usuário banido"});
                          setReports(p=>p.map(x=>x.id===r.id?{...x,status:"resolved"}:x));
                        }} style={{padding:"6px 10px",borderRadius:8,border:"none",cursor:"pointer",background:"#f8717120",color:"#f87171",fontSize:10,fontWeight:700}}>
                          🔨 Banir usuário
                        </button>
                      </div>

                      <button onClick={()=>resolveReport(r.id)} style={{width:"100%",padding:"8px",borderRadius:8,border:"none",cursor:"pointer",background:"#22c55e22",color:"#22c55e",fontWeight:800,fontSize:12}}>
                        ✅ Marcar como resolvida (sem ação)
                      </button>
                    </div>
                  )}
                </div>
              ))}
                </>
              );
            })()}

            {tab==="users" && (
              users.length===0 ? (
                <div style={{textAlign:"center",padding:40,color:"#555"}}>Nenhum usuário</div>
              ) : users.map(u=>(
                <UserAdminCard key={u.id} u={u}
                  onProfile={()=>setUserDashboard(u)}
                  onSuspend={(days)=>suspendUser(u.id,days)}
                  onBan={()=>banUser(u.id)}
                  onDelete={()=>deleteUser(u.id)}
                  onChangePlan={(plan)=>changePlan(u.id,plan)}
                  onResetPassword={async(newPass)=>{
                    const r = await api.post(`/auth/admin-reset-password`,{userId:u.id,password:newPass});
                    if(r?.message) setActionMsg("✅ Senha resetada!");
                    setTimeout(()=>setActionMsg(""),3000);
                  }}
                />
              ))
            )}

            {/* ABA FIGURAS — editar categorias */}
            {tab==="figures" && (
              <FiguresAdminTab
                onSave={async(figId, data)=>{
                  await api.put(`/figures/overrides/${figId}`, data);
                }}
                onDelete={async(figId)=>{
                  await api.delete(`/figures/overrides/${figId}`);
                }}
              />
            )}

            {tab==="catalog" && (
              <div>
                {/* Seletor de tipo */}
                <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto"}}>
                  {CAT_TYPES.map(t=>(
                    <button key={t.k} onClick={()=>setCatType(t.k)}
                      style={{padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",
                        whiteSpace:"nowrap",fontSize:11,fontWeight:700,flexShrink:0,
                        background:catType===t.k?"#ffd700":"#ffffff10",
                        color:catType===t.k?"#000":"#888"}}>
                      {t.l}
                    </button>
                  ))}
                </div>

                {catMsg && <div style={{fontSize:12,color:"#22c55e",marginBottom:10,fontWeight:700}}>{catMsg}</div>}

                <button onClick={()=>setCatForm({name:"",slug:"",order_num:0,active:true})}
                  style={{width:"100%",padding:"10px",borderRadius:10,border:"1px dashed #ffd70044",
                    background:"#ffd70008",color:"#ffd700",fontSize:12,fontWeight:700,
                    cursor:"pointer",marginBottom:12}}>
                  + Adicionar novo
                </button>

                {catForm && (
                  <div style={{background:"#0d0d1e",border:"1px solid #ffd70033",borderRadius:12,padding:14,marginBottom:14}}>
                    <div style={{fontSize:12,fontWeight:800,color:"#ffd700",marginBottom:10}}>
                      {catForm.id?"✏️ Editar":"➕ Novo"}
                    </div>
                    {[
                      {l:"Nome", v:catForm.name, s:(v)=>setCatForm(p=>({...p,name:v})), ph:"Ex: Cloth Myth EX"},
                      {l:"Slug", v:catForm.slug, s:(v)=>setCatForm(p=>({...p,slug:v.toLowerCase().replace(/\s+/g,'_')})), ph:"ex: cloth_myth_ex"},
                      {l:"Ordem", v:String(catForm.order_num||0), s:(v)=>setCatForm(p=>({...p,order_num:parseInt(v)||0})), ph:"0"},
                    ].map(f=>(
                      <div key={f.l} style={{marginBottom:8}}>
                        <div style={{fontSize:9,color:"#555",marginBottom:3}}>{f.l.toUpperCase()}</div>
                        <input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.ph}
                          style={{width:"100%",padding:"8px 10px",borderRadius:8,background:"#ffffff08",
                            border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none"}}/>
                      </div>
                    ))}
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <button onClick={()=>setCatForm(p=>({...p,active:!p.active}))}
                        style={{padding:"5px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,
                          background:catForm.active?"#22c55e22":"#ffffff10",
                          color:catForm.active?"#22c55e":"#555"}}>
                        {catForm.active?"✓ Ativo":"○ Inativo"}
                      </button>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>setCatForm(null)}
                        style={{flex:1,padding:"8px",borderRadius:8,border:"1px solid #ffffff15",
                          background:"transparent",color:"#555",fontSize:11,cursor:"pointer"}}>
                        Cancelar
                      </button>
                      <button onClick={saveCatItem}
                        style={{flex:2,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
                          background:"linear-gradient(90deg,#ffd700,#ff8c00)",
                          color:"#000",fontSize:11,fontWeight:800}}>
                        Salvar
                      </button>
                    </div>
                  </div>
                )}

                {catLoading ? (
                  <div style={{textAlign:"center",padding:20,color:"#555"}}>Carregando...</div>
                ) : catItems.map(item=>(
                  <div key={item.id} style={{background:"#0d0d1e",borderRadius:10,padding:"10px 12px",
                    marginBottom:8,display:"flex",alignItems:"center",gap:10,
                    border:`1px solid ${item.active?"#ffffff10":"#ff444422"}`,opacity:item.active?1:0.5}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#dde"}}>{item.name}</div>
                      <div style={{fontSize:10,color:"#555"}}>slug: {item.slug} · ordem: {item.order_num}</div>
                    </div>
                    <button onClick={()=>toggleCatActive(item)}
                      style={{padding:"4px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,
                        background:item.active?"#22c55e22":"#ff444422",
                        color:item.active?"#22c55e":"#f87171",fontWeight:700}}>
                      {item.active?"ON":"OFF"}
                    </button>
                    <button onClick={()=>setCatForm({...item})}
                      style={{padding:"4px 8px",borderRadius:6,border:"none",cursor:"pointer",
                        background:"#ffffff10",color:"#aaa",fontSize:11}}>✏️</button>
                    <button onClick={()=>deleteCatItem(item.id)}
                      style={{padding:"4px 8px",borderRadius:6,border:"none",cursor:"pointer",
                        background:"#ff444420",color:"#f87171",fontSize:11}}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ABA GAMIFICAÇÃO */}
        {tab==="gamification" && <GamificationAdminTab/>}

      {userDashboard && (
        <UserDashboardModal
          user={userDashboard}
          reports={reports}
          onClose={()=>setUserDashboard(null)}
          onAction={(action, userId, val) => {
            if(action==="suspend") suspendUser(userId, val);
            if(action==="ban") banUser(userId);
            if(action==="delete") deleteUser(userId);
            if(action==="plan") changePlan(userId, val);
            setUserDashboard(null);
          }}
        />
      )}
      </div>
    </div>
  );
}

function SuggestFigureModal({ user, onClose }) {
  const [name,     setName]     = useState("");
  const [line,     setLine]     = useState("Cloth Myth EX");
  const [release,  setRelease]  = useState("");
  const [url,      setUrl]      = useState("");
  const [notes,    setNotes]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [err,      setErr]      = useState("");

  const submit = async () => {
    if (!name) { setErr("Digite o nome da figura"); return; }
    setErr(""); setLoading(true);
    try {
      await api.post("/figures/suggestions", {
        name, line, release_date: release,
        amiami_url: url, notes,
        suggested_by: user?.id,
        suggested_by_name: user?.name,
      });
      setSent(true);
    } catch(e) { setErr("Erro ao enviar. Tente novamente."); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:500,
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:400,background:"#0d0d1a",borderRadius:16,
        border:"1px solid #ffffff15",padding:20}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:16}}>
          <div style={{flex:1,fontSize:15,fontWeight:900,color:"#ffd700"}}>💡 Sugerir figura</div>
          <button onClick={onClose} style={{background:"none",border:"none",
            color:"#555",cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        {sent ? (
          <div style={{textAlign:"center",padding:24}}>
            <div style={{fontSize:28,marginBottom:8}}>🎉</div>
            <div style={{color:"#22c55e",fontWeight:700}}>Sugestão enviada!</div>
            <div style={{color:"#555",fontSize:12,marginTop:6}}>
              O admin vai analisar em breve.
            </div>
            <button onClick={onClose} style={{marginTop:16,padding:"8px 20px",
              borderRadius:20,border:"1px solid #ffffff20",background:"transparent",
              color:"#aaa",fontSize:12,cursor:"pointer"}}>Fechar</button>
          </div>
        ) : (
          <>
            {[
              {l:"NOME DA FIGURA *",v:name,s:setName,p:"Ex: Scorpio Milo EX Revival"},
              {l:"LINHA",v:line,s:setLine,p:"Ex: Cloth Myth EX"},
              {l:"LANÇAMENTO PREVISTO",v:release,s:setRelease,p:"Ex: 2025 / Jan 2025"},
              {l:"LINK AMIAMI (opcional)",v:url,s:setUrl,p:"https://amiami.com/..."},
            ].map(f=>(
              <div key={f.l} style={{marginBottom:12}}>
                <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>{f.l}</div>
                <input value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p}
                  style={{width:"100%",padding:"9px 12px",borderRadius:8,background:"#ffffff08",
                    border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none",
                    boxSizing:"border-box"}}/>
              </div>
            ))}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:9,color:"#555",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>OBSERVAÇÕES</div>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)}
                placeholder="Informações adicionais..."
                style={{width:"100%",padding:"9px 12px",borderRadius:8,background:"#ffffff08",
                  border:"1px solid #ffffff15",color:"#dde",fontSize:12,outline:"none",
                  resize:"vertical",minHeight:70,boxSizing:"border-box"}}/>
            </div>
            {err && <div style={{color:"#f87171",fontSize:11,marginBottom:8}}>⚠️ {err}</div>}
            <button onClick={submit} disabled={loading} style={{
              width:"100%",padding:"11px",borderRadius:10,border:"none",cursor:"pointer",
              background:"linear-gradient(90deg,#ffd700,#ff8c00)",
              color:"#000",fontSize:13,fontWeight:800,opacity:loading?0.7:1}}>
              {loading?"Enviando...":"Enviar sugestão"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||d);}catch{return JSON.parse(d);}};

  // ── CAPTURA REF de indicação ──
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("ssv8_ref_code", ref);
      // Limpa o ref da URL sem recarregar
      window.history.replaceState({}, "", window.location.pathname);
    }
  },[]);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // ── AUTH STATE ──
  const [user,    setUser]    = useState(()=>load("ssv8_user","null"));
  const [authScreen, setAuthScreen] = useState("login"); // "login" | "register"
  const [upgradeModal, setUpgradeModal] = useState(null);
  const isAdmin = () => user?.email === ADMIN_EMAIL; // plan id needed

  const handleLogin  = (u) => {
    const enriched = {...u, avatar: u.avatar || u.name?.[0]?.toUpperCase() || "?"};
    setUser(enriched); save("ssv8_user", enriched);
    // Carrega dados do usuário específico
    const uid = enriched.id;
    setOwned(     ()=>load(`ssv8_owned_${uid}`,     "{}"));
    setWished(    ()=>load(`ssv8_wished_${uid}`,    "{}"));
    setListings(  ()=>load(`ssv8_listings_${uid}`,  "{}"));
    setWanteds(   ()=>load(`ssv8_wanteds_${uid}`,   "{}"));
    setCollections(()=>load(`ssv8_collections_${uid}`,"{}"));
    // Carrega dados do backend
    const token = localStorage.getItem("ssv8_token");
    if (token) {
      // Carrega coleção do backend
      fetch(`${API_URL}/collection`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r=>r.json()).then(data=>{
          if (!data || data.error) return;
          const owned = {}, wished = {}, colls = {};
          data.forEach(item => {
            if (item.status==='owned')  owned[item.figure_id]  = true;
            if (item.status==='wished') wished[item.figure_id] = true;
            if (item.brand || item.paid_price || item.purchase_date) {
              colls[item.figure_id] = {
                brand: item.brand, pago: item.paid_price,
                data: item.purchase_date, condition: item.condition
              };
            }
          });
          if (Object.keys(owned).length)  { setOwned(owned);   save(`ssv8_owned_${uid}`, owned); }
          if (Object.keys(wished).length) { setWished(wished);  save(`ssv8_wished_${uid}`, wished); }
          if (Object.keys(colls).length)  { setCollections(colls); save(`ssv8_collections_${uid}`, colls); }
        }).catch(()=>{});

      // Carrega marketplace do backend
      fetch(`${API_URL}/marketplace/listings`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r=>r.json()).then(data=>{
          if (!data || data.error) return;
          const myListings = {};
          data.filter(l=>l.user_id===uid).forEach(l=>{
            myListings[l.figure_id] = {
              vendendo: true, precoVenda: `${l.currency} ${l.price}`,
              estado: l.condition, desc: l.description, id: l.id
            };
          });
          if (Object.keys(myListings).length) {
            setListings(myListings);
            save(`ssv8_listings_${uid}`, myListings);
          }
        }).catch(()=>{});
    }
  };

  const handleLogout = ()  => {
    setUser(null);
    setAuthScreen("login");
    // Limpa dados da sessão
    setOwned({});
    setWished({});
    setListings({});
    setWanteds({});
    setCollections({});
    localStorage.removeItem("ssv8_user");
    localStorage.removeItem("ssv8_token");
    window.__colezzareLogout = null;
  };

  useEffect(() => { 
    window.__colezzareLogout = handleLogout;
    window.__openAdmin = () => setAdminScreen(true);
    window.__openFeedback = () => setReportModal(true); 
    return () => { window.__colezzareLogout = null; };
  });

  // Login diário — registra XP e streak
  const [loginRewards, setLoginRewards] = useState([]);
  useEffect(()=>{
    if (!user?.id) return;
    api.post("/gamification/login").then(data=>{
      if (data?.rewards?.length > 0) {
        setLoginRewards(data.rewards);
        setTimeout(()=>setLoginRewards([]), 5000);
      }
    }).catch(()=>{});

    // Ping last_seen a cada 2 minutos enquanto app aberto
    const ping = () => api.post("/auth/ping").catch(()=>{});
    ping();
    const interval = setInterval(ping, 2 * 60 * 1000);
    return () => clearInterval(interval);
  },[user?.id]);

  const handleRegister = (u) => {
    const enriched = {...u, avatar: u.avatar || u.name?.[0]?.toUpperCase() || "?"};
    setUser(enriched); save("ssv8_user", enriched);
    // Novo usuário começa com dados zerados
    setOwned({});
    setWished({});
    setListings({});
    setWanteds({});
    setCollections({});
  };
  const handleUpgrade = async (planId) => {
    if (!user) return;
    if (planId === "verify") {
      setUpgradeModal(null);
      setVerificationScreen(true);
      return;
    }
    const upgraded = {...user, plan: planId, verified: true};
    setUser(upgraded); save("ssv8_user", upgraded);
    try { await api.put("/auth/plan", { plan: upgraded.plan, verified: upgraded.verified }); } catch(e) {}
    setUpgradeModal(null);
  };

  // ── SYNC: carrega coleção do backend ao fazer login ──
  useEffect(() => {
    if (!user) return;
    const syncFromBackend = async () => {
      try {
        const col = await api.get(`/collection`);
        if (col && !col.error && Array.isArray(col)) {
          const owned = {};
          const wished = {};
          col.forEach(item => {
            if (item.status === 'owned') owned[item.figure_id] = true;
            if (item.status === 'wished') wished[item.figure_id] = true;
          });
          if (Object.keys(owned).length)  { setOwned(owned);  save(`ssv8_owned_${user?.id}`,  owned);  }
          if (Object.keys(wished).length) { setWished(wished); save(`ssv8_wished_${user?.id}`, wished); }
        }
        const mkt = await api.get(`/marketplace/user/${user.id}`);
        if (mkt && !mkt.error) {
          if (mkt.listings) { setListings(mkt.listings); save(`ssv8_listings_${user?.id}`, mkt.listings); }
          if (mkt.wanteds)  { setWanteds(mkt.wanteds);   save(`ssv8_wanteds_${user?.id}`,  mkt.wanteds);  }
        }
      } catch(e) { /* usa localStorage como fallback */ }
    };
    syncFromBackend();
  }, [user?.id]);

  // ── SYNC: verifica status de verificação periodicamente ──
  useEffect(() => {
    if (!user) return;
    if (user.verified) return; // já verificado, não precisa checar

    const checkVerification = async () => {
      try {
        const data = await api.get("/verification/status");
        if (data?.verified && !user.verified) {
          const updated = {...user, verified: true};
          setUser(updated);
          save("ssv8_user", updated);
          setVerifNotif(true); // mostra notificação
        }
      } catch(e) {}
    };

    // Verifica ao focar a janela
    const onFocus = () => checkVerification();
    window.addEventListener("focus", onFocus);

    // Verifica a cada 30 segundos enquanto pendente
    const interval = setInterval(checkVerification, 30000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [user?.id, user?.verified]);

  // ── ADMIN: verifica pendentes periodicamente ──
  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;

    const checkPending = async () => {
      try {
        const [sug, rep, ver] = await Promise.all([
          api.get("/figures/suggestions"),
          api.get("/marketplace/reports"),
          api.get("/verification/pending"),
        ]);
        setAdminPending({
          suggestions: Array.isArray(sug) ? sug.filter(s=>s.status==="pending").length : 0,
          reports:     Array.isArray(rep) ? rep.filter(r=>r.status==="pending").length : 0,
          verifications: Array.isArray(ver) ? ver.length : 0,
        });
      } catch(e) {}
    };

    checkPending();
    const interval = setInterval(checkPending, 60000);
    return () => clearInterval(interval);
  }, [user?.email]);
  const planOrder = ["free","basic","plus"];
  const isPlan = (p) => isAdmin() || planOrder.indexOf(user?.plan||"free") >= planOrder.indexOf(p);
  const isVerified = () => user?.verified === true;

  // Tenho limit: free=3, free+verified=20, basic+=unlimited
  const tenhoLimit = () => {
    if (isPlan("basic")) return 999;
    if (isVerified()) return 20;
    return 3;
  };
  const canSeePhotos = () => isPlan("basic");
  const canMarket    = () => isPlan("basic");
  const canHighlight = () => isPlan("plus");

  // Auth gates
  const requirePlan = (planId, action) => {
    if (isPlan(planId)) { action(); return; }
    setUpgradeModal(planId);
  };

  const [owned,  setOwned]    = useState(()=>{
    const u = load("ssv8_user","null");
    return u?.id ? load(`ssv8_owned_${u.id}`,"{}") : {};
  });
  const [wished, setWished]   = useState(()=>{
    const u = load("ssv8_user","null");
    return u?.id ? load(`ssv8_wished_${u.id}`,"{}") : {};
  });
  const [listings,    setListings]    = useState(()=>{
    const u = load("ssv8_user","null");
    return u?.id ? load(`ssv8_listings_${u.id}`,"{}") : {};
  });
  const [wanteds,     setWanteds]     = useState(()=>{
    const u = load("ssv8_user","null");
    return u?.id ? load(`ssv8_wanteds_${u.id}`,"{}") : {};
  });
  const [collections, setCollections] = useState(()=>{
    const u = load("ssv8_user","null");
    return u?.id ? load(`ssv8_collections_${u.id}`,"{}") : {};
  });
  const [modal,      setModal]      = useState(null);
  const [sellForm,   setSellForm]   = useState(null);
  const [buyForm,    setBuyForm]    = useState(null);
  const [editForm,   setEditForm]   = useState(null);
  const [notifs,   setNotifs]   = useState([]);
  const [fLine,setFLine]=useState("Todas");
  const [fSaga,setFSaga]=useState("Todas");
  const [fTipo,setFTipo]=useState("Todos");
  const [fVer,setFVer]=useState("Todas");
  const [fStatus,setFStatus]=useState("Todos");
  const [fMarket,setFMarket]=useState("Todos");
  const [fCatMode,setFCatMode]=useState("saga");
  const [search,setSearch]=useState("");
  const [tab,setTab]=useState("catalog");

  // Dados dinâmicos do catálogo
  const [catLines,    setCatLines]    = useState([]);
  const [catSagas,    setCatSagas]    = useState([]);
  const [catKnights,  setCatKnights]  = useState([]);
  const [catVersions, setCatVersions] = useState([]);
  const [figOverrides, setFigOverrides] = useState({});

  useEffect(()=>{
    Promise.all([
      api.get("/catalog/lines"),
      api.get("/catalog/sagas"),
      api.get("/catalog/knight_types"),
      api.get("/catalog/versions"),
      api.get("/figures/overrides"),
    ]).then(([lines, sagas, knights, versions, overrides])=>{
      if(lines    && !lines.error)    setCatLines(lines.filter(l=>l.active));
      if(sagas    && !sagas.error)    setCatSagas(sagas.filter(s=>s.active));
      if(knights  && !knights.error)  setCatKnights(knights.filter(k=>k.active));
      if(versions && !versions.error) setCatVersions(versions.filter(v=>v.active));
      if(overrides && !overrides.error && Array.isArray(overrides)) {
        const map = {};
        overrides.forEach(o => { map[o.figure_id] = o; });
        setFigOverrides(map);
      }
    }).catch(()=>{});
  },[]);
  const [exportModal, setExportModal]=useState(false);
  const [reportModal, setReportModal]=useState(false);
  const [reportListing, setReportListing]=useState(null);
  const [verifNotif, setVerifNotif]=useState(false); // {seller, fig}
  const [adminScreen, setAdminScreen]=useState(false);
  const [suggestModal,setSuggestModal]=useState(false);
  const [verificationScreen, setVerificationScreen]=useState(false);
  const [privacyScreen, setPrivacyScreen]=useState(false);
  const [settingsScreen, setSettingsScreen]=useState(false);
  const [profileScreen,  setProfileScreen] =useState(false);
  const [adminPending, setAdminPending]=useState({suggestions:0,reports:0,verifications:0});
  const [filtersOpen,setFiltersOpen]=useState(false);

  const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};

  const toggleOwned=useCallback(id=>{
    setOwned(p=>{
      const n={...p};
      if(n[id]){
        delete n[id];
        api.delete(`/collection/${id}`).catch(()=>{});
        // Limpa dados de coleção ao desmarcar
        setCollections(c=>{const nc={...c};delete nc[id];save(`ssv8_collections_${user?.id}`,nc);return nc;});
      } else {
        const count=Object.keys(p).length;
        const limit=tenhoLimit();
        if(count>=limit){
          if(!isVerified()&&!isPlan("basic")){setUpgradeModal("verify");}
          else if(!isPlan("basic")){setUpgradeModal("basic");}
          return p;
        }
        n[id]=true;
        // Aplica preferências padrão do usuário
        const prefBrand = (() => { try { return JSON.parse(localStorage.getItem("ssv8_pref_brand")||'"nao_sei"'); } catch { return "nao_sei"; }})();
        setCollections(c=>{
          const nc={...c};
          if(!nc[id]) nc[id]={ bandai: prefBrand==="bandai", brand: prefBrand };
          save(`ssv8_collections_${user?.id}`,nc);
          return nc;
        });
        api.post(`/collection`, { figure_id: id, status: 'owned' }).catch(()=>{});
      }
      save(`ssv8_owned_${user?.id}`,n);return n;
    });
    setWished(p=>{const n={...p};delete n[id];save(`ssv8_wished_${user?.id}`,n);return n;});
  },[user]);

  const toggleWish=useCallback(id=>{
    setWished(p=>{
      const n={...p};
      if(n[id]) {
        delete n[id];
        api.delete(`/collection/${id}`).catch(()=>{});
      } else {
        n[id]=true;
        api.post(`/collection`, { figure_id: id, status: 'wished' }).catch(()=>{});
      }
      save(`ssv8_wished_${user?.id}`,n);return n;
    });
    setOwned(p=>{const n={...p};delete n[id];save(`ssv8_owned_${user?.id}`,n);return n;});
  },[user]);

  const toggleSell=useCallback(id=>{
    setListings(p=>{
      const n={...p};
      const listingId = n[id]?.id;
      delete n[id];
      save(`ssv8_listings_${user?.id}`,n);
      if (listingId) api.delete(`/marketplace/listings/${listingId}`).catch(()=>{});
      return n;
    });
  },[user]);

  const toggleWant=useCallback(id=>{
    setWanteds(p=>{
      const n={...p};delete n[id];save(`ssv8_wanteds_${user?.id}`,n);
      api.delete(`/marketplace/wanted/${user?.id}/${id}`).catch(()=>{});
      return n;
    });
  },[user]);

  const confirmEditCollection=(fig,data)=>{
    const n={...collections,[fig.id]:data};
    setCollections(n);save(`ssv8_collections_${user?.id}`,n);
    api.put(`/collection/${fig.id}`, data).catch(()=>{});
    setEditForm(null);
  };

  const confirmSell=(fig,data)=>{
    const listing = {
      vendendo: true,
      precoVenda: data.precoVenda,
      estado: data.estado,
      desc: data.desc,
      brand: data.brand,
      dias: data.dias,
      expiresAt: data.expiresAt,
    };
    const n={...listings,[fig.id]:listing};
    setListings(n);save(`ssv8_listings_${user?.id}`,n);
    api.post(`/marketplace/listings`, {
      figure_id: fig.id,
      price: data.precoVenda,
      currency: "BRL",
      condition: data.estado,
      description: data.desc,
    }).then(res=>{
      if (res?.id) {
        const updated = {...n,[fig.id]:{...listing, id: res.id}};
        setListings(updated);
        save(`ssv8_listings_${user?.id}`, updated);
      }
    }).catch(()=>{});
    setSellForm(null);
    setModal(fig);
  };

  const confirmWant=(fig,data)=>{
    const wanted = { ativo: true, maxPreco: data.maxPreco, currency: data.currency||"BRL" };
    const n={...wanteds,[fig.id]:wanted};
    setWanteds(n);save(`ssv8_wanteds_${user?.id}`,n);
    api.post(`/marketplace/wanted`, {
      figure_id: fig.id,
      max_price: data.maxPreco,
      currency: data.currency||"BRL",
    }).catch(()=>{});
    setBuyForm(null);
    setModal(fig);
  };

  // Aplica overrides do banco nas figuras
  const FIGURES = ALL_FIGURES.map(f => {
    const ov = figOverrides[f.id];
    if (!ov) return f;
    return {
      ...f,
      ...(ov.name       && {name:       ov.name}),
      ...(ov.line       && {line:       ov.line}),
      ...(ov.saga       && {saga:       ov.saga}),
      ...(ov.tipo       && {tipo:       ov.tipo}),
      ...(ov.ver        && {ver:        ov.ver}),
      ...(ov.lancamento && {lancamento: ov.lancamento}),
    };
  });

  // Figuras filtradas pela linha atual (para calcular opções disponíveis)
  const figsByLine = FIGURES.filter(f => fLine==="Todas" || f.line===fLine);
  const figsBySaga = figsByLine.filter(f => fSaga==="Todas" || f.saga===fSaga);

  const sagasDisp = [...new Set(figsByLine.map(f=>f.saga))].sort();
  const tiposDisp = [...new Set(figsBySaga.map(f=>f.tipo))].sort();
  const versoes   = ["Todas",...new Set(figsByLine.filter(f=>f.ver!=="—").map(f=>f.ver))].sort();

  const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const [catSort, setCatSort] = useState("default");

  const filtered=FIGURES.filter(f=>{
    if(fLine!=="Todas"&&f.line!==fLine)return false;
    if(fSaga!=="Todas"&&f.saga!==fSaga)return false;
    if(fTipo!=="Todos"&&f.tipo!==fTipo)return false;
    if(fVer!=="Todas"&&f.ver!==fVer)return false;
    if(fStatus==="Tenho"&&!owned[f.id])return false;
    if(fStatus==="Quero"&&!wished[f.id])return false;
    if(fStatus==="Falta"&&(owned[f.id]||wished[f.id]))return false;
    if(fMarket==="Vendendo"&&!listings[f.id]?.vendendo)return false;
    if(fMarket==="Buscando"&&!wanteds[f.id]?.ativo)return false;
    if(fMarket==="À Venda"&&!listings[f.id]?.vendendo)return false;
    if(search&&!norm(f.name).includes(norm(search)))return false;
    if(tab==="owned"&&!owned[f.id])return false;
    if(tab==="wish"&&!wished[f.id])return false;
    if(tab==="market"&&!listings[f.id]?.vendendo&&!wanteds[f.id]?.ativo)return false;
    return true;
  }).sort((a,b)=>{
    if(catSort==="nome") return norm(a.name).localeCompare(norm(b.name));
    if(catSort==="lancamento"||catSort==="lancamento_desc"){
      const parseDate = (s) => {
        if (!s || s==="—") return 0;
        // Formato "Jan 2014", "Fev 2013" etc
        const months = {jan:1,fev:2,mar:3,abr:4,mai:5,jun:6,jul:7,ago:8,set:9,out:10,nov:11,dez:12};
        const m = s.toLowerCase().match(/([a-z]+)\s+(\d{4})/);
        if (m) return parseInt(m[2])*100 + (months[m[1]]||0);
        // Só ano
        const y = s.match(/\d{4}/);
        if (y) return parseInt(y[0])*100;
        return 0;
      };
      const da = parseDate(a.lancamento);
      const db = parseDate(b.lancamento);
      return catSort==="lancamento" ? da-db : db-da;
    }
    return 0;
  });

  const nOwned=Object.keys(owned).length,nWished=Object.keys(wished).length;
  const nListings=Object.keys(listings).filter(k=>listings[k]?.ativo||listings[k]?.id||listings[k]?.listing_id).length;
  const pct=Math.round(nOwned/FIGURES.length*100);
  const hasFilter=fLine!=="Todas"||fSaga!=="Todas"||fTipo!=="Todos"||fVer!=="Todas"||fStatus!=="Todos"||fMarket!=="Todos";
  const clearFilters=()=>{setFLine("Todas");setFSaga("Todas");setFTipo("Todos");setFVer("Todas");setFStatus("Todos");setFMarket("Todos");setFCatMode("saga");};

  // ── SPLASH SCREEN ──
  if (showSplash) {
    return (
      <div style={{height:"100dvh",background:"#000",display:"flex",
        alignItems:"center",justifyContent:"center",flexDirection:"column",
        overflow:"hidden",position:"relative"}}>
        <style>{`
          @keyframes sphereIn{0%{opacity:0;transform:scale(0.4)}70%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
          @keyframes spinContour{0%{transform:rotate(0deg);opacity:0}5%{opacity:1}100%{transform:rotate(360deg);opacity:0}}
          @keyframes ringPulse{0%{box-shadow:0 0 0 0 #ff8c0088;transform:scale(0.9)}50%{box-shadow:0 0 24px 10px #ff8c0044;transform:scale(1.06)}100%{box-shadow:0 0 8px 2px #ff8c0011;transform:scale(1)}}
          @keyframes traceDot{0%{opacity:0;transform:rotate(0deg)}5%{opacity:1}90%{opacity:0.8}100%{opacity:0;transform:rotate(360deg)}}
          @keyframes nameIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
          .splash-sphere{width:240px;height:240px;border-radius:50%;position:relative;z-index:2;animation:sphereIn 0.8s cubic-bezier(0.34,1.3,0.64,1) 0.15s both}
          .splash-sphere img{width:100%;height:100%;object-fit:cover;display:block;border-radius:50%}
          .splash-ring{position:absolute;width:254px;height:254px;border-radius:50%;border:2px solid transparent;z-index:1;animation:ringPulse 0.7s ease 0.7s both}
          .splash-contour{position:absolute;width:254px;height:254px;border-radius:50%;border:3px solid transparent;border-top-color:#ffd700;border-right-color:#ff8c0066;z-index:3;animation:spinContour 2s ease-out 0.5s both}
          .splash-tracer{position:absolute;width:10px;height:10px;border-radius:50%;background:radial-gradient(ellipse,#fff 0%,#ffd700 50%,transparent 100%);top:calc(50% - 127px);left:calc(50% - 5px);transform-origin:5px 127px;z-index:4;animation:traceDot 2s ease-out 0.5s both;opacity:0}
          .splash-name{font-size:24px;font-weight:900;letter-spacing:6px;background:linear-gradient(90deg,#ffd700,#ff8c00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-top:18px;font-family:'Cinzel',serif;animation:nameIn 0.5s ease 1s both}
          .splash-sub{font-size:10px;color:#ff8c0066;letter-spacing:3px;margin-top:5px;font-family:sans-serif;animation:nameIn 0.4s ease 1.2s both}
        `}</style>
        <div style={{position:"relative",width:254,height:254,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div className="splash-ring"/>
          <div className="splash-contour"/>
          <div className="splash-tracer"/>
          <div className="splash-sphere">
            <img src="./splash_logo.png" alt="Colezzare"/>
          </div>
        </div>
        <div className="splash-name">COLEZZARE</div>
        <div className="splash-sub">COLLECTOR & MARKETPLACE</div>
      </div>
    );
  }

  // ── AUTH SCREENS ──
  if (!user) {
    if (authScreen === "register") return <RegisterScreen onRegister={handleRegister} onGoLogin={()=>setAuthScreen("login")}/>;
    if (authScreen === "forgot") return <ForgotPasswordScreen onBack={()=>setAuthScreen("login")}/>;
    return <LoginScreen onLogin={handleLogin} onGoRegister={()=>setAuthScreen("register")} onForgotPassword={()=>setAuthScreen("forgot")}/>;
  }

  return (
    <div style={{height:"100dvh",background:"radial-gradient(ellipse at 20% 0%,#0d0a1e,#06060f 60%)",
      color:"#dde",fontFamily:"'Rajdhani',sans-serif",display:"flex",flexDirection:"column",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Rajdhani:wght@500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        html,body,#root{overflow:hidden;height:100%;touch-action:pan-y;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{transform:translateY(80px);opacity:0}to{transform:none;opacity:1}}
        @keyframes slideDown{from{transform:translateY(-40px);opacity:0}to{transform:none;opacity:1}}
      `}</style>

      {exportModal && (
        <ExportModal owned={owned} wished={wished}
          listings={listings} collections={collections}
          onClose={()=>setExportModal(false)}/>
      )}

      {reportModal && <ReportModal onClose={()=>setReportModal(false)}/>}
      {reportListing && <ReportListingModal seller={reportListing.seller} fig={reportListing.fig} user={user} onClose={()=>setReportListing(null)}/>}
      {adminScreen && <AdminScreen user={user} onClose={()=>setAdminScreen(false)}/>}
      {suggestModal && <SuggestFigureModal user={user} onClose={()=>setSuggestModal(false)}/>}
      {verificationScreen && <VerificationScreen user={user} onClose={()=>setVerificationScreen(false)} onSubmitted={()=>setVerificationScreen(false)} onPrivacy={()=>setPrivacyScreen(true)}/>}
      {privacyScreen && <PrivacyScreen onClose={()=>setPrivacyScreen(false)}/>}
      {settingsScreen && <UserSettingsScreen user={user} onClose={()=>setSettingsScreen(false)} onSave={()=>setSettingsScreen(false)} onAdmin={isAdmin()?()=>{setSettingsScreen(false);setAdminScreen(true);}:null} pendingCount={adminPending.suggestions+adminPending.reports+adminPending.verifications}/>}

      {/* Notificação de verificação aprovada */}
      {verifNotif && (
        <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",
          zIndex:9999,background:"linear-gradient(90deg,#22c55e,#16a34a)",
          borderRadius:12,padding:"14px 20px",boxShadow:"0 4px 20px #22c55e44",
          display:"flex",alignItems:"center",gap:12,maxWidth:340,width:"90%"}}>
          <div style={{fontSize:24}}>🎉</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:900,color:"#fff"}}>Conta verificada!</div>
            <div style={{fontSize:11,color:"#ffffff99"}}>Sua identidade foi confirmada com sucesso.</div>
          </div>
          <button onClick={()=>setVerifNotif(false)}
            style={{background:"#ffffff20",border:"none",borderRadius:6,
              padding:"4px 8px",color:"#fff",cursor:"pointer",fontSize:12}}>✕</button>
        </div>
      )}

      {/* UPGRADE MODAL */}
      {upgradeModal && <UpgradeModal requiredPlan={upgradeModal} onClose={()=>setUpgradeModal(null)} onUpgrade={handleUpgrade}/>}

      {/* NOTIFICAÇÕES DE MATCH */}
      {notifs.map(n=>(
        <div key={n.id} onClick={()=>setNotifs(p=>p.filter(x=>x.id!==n.id))}
          style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",
            zIndex:2000,width:"90%",maxWidth:440,cursor:"pointer",
            background:"linear-gradient(135deg,#0d2e0d,#1a3a1a)",
            border:"2px solid #22c55e",borderRadius:14,padding:"14px 16px",
            boxShadow:"0 8px 32px #22c55e44",animation:"slideDown 0.4s ease",
            display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{fontSize:28,flexShrink:0}}>🎯</div>
          <div>
            <div style={{fontSize:14,fontWeight:900,color:"#22c55e",marginBottom:3,fontFamily:"'Cinzel',serif"}}>
              MATCH ENCONTRADO!
            </div>
            <div style={{fontSize:12,color:"#4ade80",marginBottom:4}}>
              {n.type==="buy_match"
                ? `${n.sellers.length} vendedor(es) para "${n.fig.name}"`
                : `${n.buyers.length} comprador(es) para "${n.fig.name}"`}
            </div>
            <div style={{fontSize:10,color:"#166534"}}>Toque para ver os detalhes</div>
          </div>
          <div style={{marginLeft:"auto",fontSize:16,color:"#22c55e",opacity:0.6}}>✕</div>
        </div>
      ))}

      {/* MODAIS */}
      {modal && !sellForm && !buyForm && !editForm && (
        <Modal fig={modal}
          owned={!!owned[modal.id]} wished={!!wished[modal.id]}
          myListing={listings[modal.id]} myWanted={wanteds[modal.id]}
          myCollection={collections[modal.id]}
          canMarket={canMarket()}
          onUpgrade={(plan)=>setUpgradeModal(plan)}
          onOwned={toggleOwned} onWish={toggleWish}
          onToggleSell={toggleSell} onToggleWant={toggleWant}
          onOpenSellForm={f=>{setSellForm(f);}}
          onOpenBuyForm={f=>{setBuyForm(f);}}
          onOpenEditCollection={f=>{setEditForm(f);}}
          onReport={(seller,fig)=>setReportListing({seller,fig})}
          onFilter={(type,value)=>{
            if(type==="tipo"){setFTipo(value);setFCatMode("knight");}
            if(type==="saga"){setFSaga(value);setFCatMode("saga");}
            if(type==="line"){setFLine(value);}
            setModal(null);
            setTab("catalog");
            setFiltersOpen(false);
          }}
          onClose={()=>setModal(null)}/>
      )}
      {editForm  && <EditCollectionForm fig={editForm} current={collections[editForm.id]} onConfirm={(d)=>confirmEditCollection(editForm,d)} onClose={()=>setEditForm(null)}/>}
      {sellForm  && !editForm && <SellForm fig={sellForm} existing={listings[sellForm.id]} onConfirm={(d)=>confirmSell(sellForm,d)} onClose={()=>setSellForm(null)}/>}
      {buyForm  && <BuyForm  fig={buyForm}  onConfirm={(d)=>confirmWant(buyForm,d)}  onClose={()=>setBuyForm(null)}/>}

      {/* HEADER — só no catálogo */}
      {tab==="catalog" && (
      <div style={{flexShrink:0,background:"#07070fdd",backdropFilter:"blur(16px)",
        borderBottom:"1px solid #ffd70018",padding:"8px 12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setProfileScreen(true)}
            style={{background:"transparent",border:"none",cursor:"pointer",
              display:"flex",alignItems:"center",gap:8,padding:0,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:"50%",
              background:PLANS[user.plan]?.color+"33",color:PLANS[user.plan]?.color,
              border:`2px solid ${PLANS[user.plan]?.color}55`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:15,fontWeight:800}}>
              {user.avatar}
            </div>
            <div>
              <div style={{fontSize:13,color:"#dde",fontWeight:700,lineHeight:1,
                display:"flex",alignItems:"center",gap:4}}>
                {user.name?.split(" ")[0]}
                {user.verified && <span style={{fontSize:9,color:"#22c55e"}}>✓</span>}
              </div>
              <div style={{fontSize:9,color:isAdmin()?"#ffd700":PLANS[user.plan]?.color,marginTop:2,lineHeight:1}}>
                {isAdmin()?"👑 ADMIN":PLANS[user.plan]?.label}
              </div>
            </div>
          </button>
          <div style={{flex:1}}/>
          {/* Badge admin de pendências */}
          {isAdmin() && (adminPending.suggestions+adminPending.reports+adminPending.verifications) > 0 && (
            <button onClick={()=>setAdminScreen(true)}
              style={{background:"#f8717122",border:"1px solid #f8717144",borderRadius:8,
                padding:"4px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:11}}>⚠️</span>
              <span style={{fontSize:10,fontWeight:800,color:"#f87171"}}>
                {adminPending.suggestions+adminPending.reports+adminPending.verifications}
              </span>
            </button>
          )}
          {/* Botão upgrade para free */}
          {!isAdmin() && !isPlan("basic") && (
            <button onClick={()=>setUpgradeModal("basic")}
              style={{background:"#ffd70022",border:"1px solid #ffd70044",borderRadius:8,
                padding:"4px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:11}}>⭐</span>
              <span style={{fontSize:10,fontWeight:800,color:"#ffd700"}}>Basic</span>
            </button>
          )}
          {notifs.length > 0 && (
            <button onClick={()=>setNotifs([])}
              style={{background:"transparent",border:"none",cursor:"pointer",
                position:"relative",padding:"4px 6px"}}>
              <span style={{fontSize:20}}>🔔</span>
              <span style={{position:"absolute",top:0,right:2,background:"#f87171",
                borderRadius:"50%",width:14,height:14,fontSize:8,fontWeight:900,
                color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {notifs.length}
              </span>
            </button>
          )}
          <OnlineCounter/>
        </div>
      </div>
      )}

      {/* TICKER VERIFICAÇÃO — só para não verificados */}
      {user && !user.verified && (
        <VerificationTicker onOpen={()=>setVerificationScreen(true)}/>
      )}

      {/* SEARCH + FILTER TOGGLE — só no catálogo */}
      {tab==="catalog" && (
      <div style={{flexShrink:0,background:"#08081488",borderBottom:"1px solid #ffffff08",padding:"8px 10px"}}>
        <div style={{display:"flex",gap:6,alignItems:"center",width:"100%"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Buscar figura..."
            style={{flex:1,minWidth:0,padding:"8px 10px",borderRadius:8,background:"#ffffff0a",
              border:"1px solid #ffffff15",color:"#dde",fontSize:12,
              fontFamily:"'Rajdhani',sans-serif",outline:"none"}}/>
          <button onClick={()=>setFiltersOpen(p=>!p)} style={{
            display:"flex",alignItems:"center",gap:4,flexShrink:0,
            padding:"8px 10px",borderRadius:8,cursor:"pointer",
            background:hasFilter?"#ffd70022":"#ffffff0d",
            color:hasFilter?"#ffd700":"#888",
            fontSize:11,fontWeight:800,
            border:hasFilter?"1px solid #ffd70044":"1px solid #ffffff12"}}>
            🔧
            {hasFilter && (
              <span style={{background:"#ffd700",color:"#000",borderRadius:20,
                padding:"1px 5px",fontSize:9,fontWeight:900}}>
                {[fLine!=="Todas",fSaga!=="Todas",fTipo!=="Todos",fVer!=="Todas",fStatus!=="Todos",fMarket!=="Todos"].filter(Boolean).length}
              </span>
            )}
            <span style={{fontSize:10,opacity:0.6}}>{filtersOpen?"▲":"▼"}</span>
          </button>
          {hasFilter && (
            <button onClick={clearFilters}
              style={{padding:"8px 8px",borderRadius:8,border:"1px solid #ff444444",flexShrink:0,
                background:"#ff444411",color:"#ff6666",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              ✕
            </button>
          )}
        </div>
      </div>
      )}

      {/* HEADER TENHO/QUERO — com exportar */}
      {(tab==="owned"||tab==="wish") && (
      <div style={{flexShrink:0,background:"#07070fdd",borderBottom:"1px solid #ffffff08",
        padding:"8px 12px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{fontSize:13,fontWeight:800,color:tab==="owned"?"#22c55e":"#a855f7"}}>
          {tab==="owned"?`✓ Tenho (${nOwned})`:`♡ Quero (${nWished})`}
        </div>
        <div style={{flex:1}}/>
        <button onClick={()=>setExportModal(true)} style={{
          display:"flex",alignItems:"center",gap:5,
          padding:"6px 12px",borderRadius:8,cursor:"pointer",flexShrink:0,
          background:"#ffffff0d",border:"1px solid #ffffff12",
          color:"#888",fontSize:11,fontWeight:700}}>
          📤 Exportar
        </button>
      </div>
      )}

      {/* HEADER MARKET */}
      {tab==="market" && (
      <div style={{flexShrink:0,background:"#07070fdd",borderBottom:"1px solid #ffffff08",
        padding:"8px 12px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{fontSize:13,fontWeight:800,color:"#ffd700"}}>🛒 Marketplace</div>
      </div>
      )}
      {/* FILTER PANEL — colapsável */}
      {tab==="catalog" && filtersOpen && (
        <div style={{background:"#07070eee",borderBottom:"1px solid #ffd70018",
          padding:"14px 16px",animation:"fadeIn 0.2s ease"}}>
          <div style={{maxWidth:1360,margin:"0 auto"}}>

            {/* Futura seção de COLEÇÃO/MARCA — já estruturada */}
            <FilterSection title="🗂️ COLEÇÃO">
              {[
                {v:"Todas",l:"Todas"},
                {v:"saint_seiya",l:"⭐ Cavaleiros do Zodíaco"},
                // Futuras coleções:
                // {v:"dragonball",l:"🐉 Dragon Ball"},
                // {v:"evangelion",l:"🤖 Evangelion"},
                // {v:"gundam",l:"🦾 Gundam"},
              ].map(c=>(
                <Chip key={c.v} label={c.l} active={c.v==="Todas"||c.v==="saint_seiya"} onClick={()=>{}}/>
              ))}
            </FilterSection>

            <div style={{height:1,background:"#ffffff08",margin:"10px 0"}}/>

            <FilterSection title="COLEÇÃO / LINHA">
              <Chip label={`Todas (${FIGURES.length})`} active={fLine==="Todas"} onClick={()=>{setFLine("Todas");setFSaga("Todas");setFTipo("Todos");}}/>
              {catLines.length > 0 ? catLines.map(l=>{
                const count = FIGURES.filter(f=>f.line===l.name).length;
                return <Chip key={l.id} label={`${l.name} (${count})`} active={fLine===l.name} onClick={()=>{setFLine(l.name);setFSaga("Todas");setFTipo("Todos");}}/>;
              }) : [
                "Cloth Myth EX","Cloth Myth","Cloth Myth Appendix","Cloth Crown",
                "Saint Cloth Legend","Figuarts Zero","Vintage (Die-Cast)"
              ].map(l=>{
                const count = FIGURES.filter(f=>f.line===l).length;
                return <Chip key={l} label={`${l} (${count})`} active={fLine===l} onClick={()=>{setFLine(l);setFSaga("Todas");}}/>;
              })}
            </FilterSection>

            <FilterSection title="SAGA">
              <Chip label="Todas" active={fSaga==="Todas"} onClick={()=>setFSaga("Todas")}/>
              {catSagas.length > 0 ? catSagas.filter(s=>sagasDisp.includes(s.name)).map(s=>(
                <Chip key={s.id} label={s.name} active={fSaga===s.name} color={SC[s.name]} onClick={()=>setFSaga(s.name)}/>
              )) : sagasDisp.map(s=>(
                <Chip key={s} label={s} active={fSaga===s} color={SC[s]} onClick={()=>setFSaga(s)}/>
              ))}
            </FilterSection>

            <FilterSection title="CAVALEIROS">
              <Chip label="Todos" active={fTipo==="Todos"} onClick={()=>setFTipo("Todos")}/>
              {catKnights.length > 0 ? catKnights.filter(k=>tiposDisp.includes(k.name)).map(k=>(
                <Chip key={k.id} label={k.name} active={fTipo===k.name} color={TS[k.name]?.c} onClick={()=>setFTipo(k.name)}/>
              )) : tiposDisp.map(t=>(
                <Chip key={t} label={t} active={fTipo===t} color={TS[t]?.c} onClick={()=>setFTipo(t)}/>
              ))}
            </FilterSection>

            <FilterSection title="VERSÃO">
              {versoes.filter(v => {
                if(v==="Todas") return true;
                return figsByLine.some(f=>f.ver===v);
              }).map(v=><Chip key={v} label={v} active={fVer===v} onClick={()=>setFVer(v)}/>)}
            </FilterSection>

            <div style={{height:1,background:"#ffffff08",margin:"10px 0"}}/>

            <FilterSection title="STATUS DA COLEÇÃO">
              {[{v:"Todos",l:"Todos"},{v:"Tenho",l:"✓ Tenho",c:"#22c55e"},{v:"Quero",l:"♡ Quero",c:"#a855f7"},{v:"Falta",l:"○ Falta"}].map(s=>(
                <Chip key={s.v} label={s.l} active={fStatus===s.v} color={s.c} onClick={()=>setFStatus(s.v)}/>
              ))}
            </FilterSection>

            <FilterSection title="MARKETPLACE">
              {[{v:"Todos",l:"Todos"},{v:"À Venda",l:"🏷️ À Venda",c:"#22c55e"},{v:"Vendendo",l:"📦 Meus Anúncios",c:"#ffd700"},{v:"Buscando",l:"🔍 Buscando",c:"#a855f7"}].map(s=>(
                <Chip key={s.v} label={s.l} active={fMarket===s.v} color={s.c} onClick={()=>setFMarket(s.v)}/>
              ))}
            </FilterSection>

            <div style={{height:1,background:"#ffffff08",margin:"10px 0"}}/>

            <FilterSection title="📅 ORDENAR POR">
              {[
                {v:"default",         l:"Padrão"},
                {v:"nome",            l:"🔤 A→Z"},
                {v:"lancamento",      l:"📅 Mais antigo"},
                {v:"lancamento_desc", l:"📅 Mais recente"},
              ].map(s=>(
                <Chip key={s.v} label={s.l} active={catSort===s.v} onClick={()=>setCatSort(s.v)}/>
              ))}
            </FilterSection>

            <button onClick={()=>setFiltersOpen(false)}
              style={{width:"100%",marginTop:10,padding:"8px",borderRadius:8,
                border:"1px solid #ffffff10",background:"transparent",
                color:"#555",fontSize:11,fontWeight:700,cursor:"pointer"}}>
              Fechar filtros ▲
            </button>
          </div>
        </div>
      )}

      {/* ÁREA DE CONTEÚDO COM SCROLL */}
      <div style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",touchAction:"pan-y",overflowX:"hidden",position:"relative",display:tab==="ranking"||tab==="market"?"none":"flex",flexDirection:"column"}}>

        {/* BARRAS DE PROGRESSO POR LINHA — só em Tenho e Quero */}
        {(tab==="owned"||tab==="wish") && (() => {
          const lines = ["Cloth Myth EX","Cloth Myth","Cloth Myth Appendix","Cloth Crown","Saint Cloth Legend","Figuarts Zero","Saint Cloth Series"];
          return (
            <div style={{padding:"10px 12px 4px"}}>
              <div style={{fontSize:10,color:"#666",fontWeight:700,letterSpacing:1,marginBottom:8}}>
                {tab==="owned"?"PROGRESSO DA COLEÇÃO":"LISTA DE DESEJOS"}
              </div>
              {lines.map(line=>{
                const total = FIGURES.filter(f=>f.line===line).length;
                if(total===0) return null;
                const have = tab==="owned"
                  ? FIGURES.filter(f=>f.line===line&&owned[f.id]).length
                  : FIGURES.filter(f=>f.line===line&&wished[f.id]).length;
                if(have===0) return null;
                const pctLine = Math.round(have/total*100);
                const color = tab==="owned"?"#22c55e":"#a855f7";
                return (
                  <div key={line} style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:10,color:"#888",fontWeight:600}}>{line}</span>
                      <span style={{fontSize:10,color,fontWeight:800}}>{have}/{total} · {pctLine}%</span>
                    </div>
                    <div style={{height:5,background:"#ffffff0a",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pctLine}%`,
                        background:`linear-gradient(90deg,${color},${color}aa)`,
                        borderRadius:3,transition:"width 0.6s ease"}}/>
                    </div>
                  </div>
                );
              })}
              <div style={{height:1,background:"#ffffff08",margin:"8px 0"}}/>
            </div>
          );
        })()}

        <div style={{padding:"2px 12px 4px"}}>
          <span style={{fontSize:10,color:"#444"}}>{filtered.length} figura{filtered.length!==1?"s":""}</span>
        </div>

        {/* GRID */}
        <div style={{padding:"4px 12px 80px"}}>
          {filtered.length===0?(
            <div style={{textAlign:"center",padding:"80px 20px",color:"#333"}}>
              <div style={{fontSize:48,marginBottom:16}}>🔍</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:16,letterSpacing:2}}>Nenhuma figura encontrada</div>
            </div>
          ):(tab==="owned"||tab==="wish")?(
            /* Grid só imagens para Tenho e Quero */
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
              {filtered.map(fig=>{
                const img   = `https://res.cloudinary.com/dr3sxytes/image/upload/figures/${fig.id}/1.jpg`;
                const color = tab==="owned"?"#22c55e":"#a855f7";
                const coll  = collections[fig.id];
                const brand = LICENSED_BRANDS.find(b=>b.id===(coll?.brand||(coll?.bandai?"bandai":null)));
                return (
                  <div key={fig.id} onClick={()=>setModal(fig)}
                    style={{width:"100%",paddingBottom:"100%",position:"relative",
                      borderRadius:10,overflow:"hidden",cursor:"pointer",
                      background:"#0d0d1e",
                      border:`2px solid ${color}22`}}>
                    <img src={img} alt={fig.name}
                      style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}
                      onError={e=>{e.target.style.display="none";}}/>
                    {/* Marca no canto inferior direito */}
                    {brand && tab==="owned" && brand.id!=="nao_sei" && (
                      <div style={{position:"absolute",bottom:4,right:4,
                        background:"#00000088",borderRadius:4,padding:"2px 5px"}}>
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.label}
                            style={{height:10,width:"auto",display:"block"}}
                            onError={e=>{e.target.style.display="none";}}/>
                        ) : (
                          <span style={{fontSize:7,fontWeight:900,color:"#fff",
                            fontFamily:"Arial,sans-serif",letterSpacing:0.5}}>
                            {brand.short||brand.label}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ):(
            /* Grid normal para Catálogo e Marketplace */
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
              {filtered.map(fig=>(
                <FigureCard key={fig.id} fig={fig}
                  owned={!!owned[fig.id]} wished={!!wished[fig.id]}
                  listing={listings[fig.id]} wanted={wanteds[fig.id]}
                  collection={collections[fig.id]}
                  onOwned={(id)=>toggleOwned(id)}
                  onWish={toggleWish}
                  canSeePhotos={canSeePhotos()}
                  onOpen={setModal}/>
              ))}
            </div>
          )}
        </div>
      </div>

      {profileScreen && <EditProfileScreen user={user} onClose={()=>setProfileScreen(false)} onSave={(u)=>{handleLogin(u);setProfileScreen(false);}}/> }

      {/* Toast de recompensas de login */}
      {loginRewards.length > 0 && (
        <div style={{position:"fixed",top:70,left:16,right:16,zIndex:200,
          display:"flex",flexDirection:"column",gap:6,pointerEvents:"none"}}>
          {loginRewards.map((r,i)=>(
            <div key={i} style={{background:"#0d0d1e",border:"1px solid #ffd70044",
              borderRadius:12,padding:"10px 14px",fontSize:12,color:"#ffd700",
              fontWeight:700,boxShadow:"0 4px 20px #00000088",
              animation:"slideIn 0.3s ease"}}>
              {r.message}
            </div>
          ))}
        </div>
      )}

      {/* TELA RANKING */}
      {tab==="ranking" && (
        <div style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",
          touchAction:"pan-y",background:"#06060f",display:"flex",flexDirection:"column"}}>
          <RankingScreen user={user}/>
        </div>
      )}

      {tab==="market" && (
        <div style={{flex:1,overflowY:"scroll",WebkitOverflowScrolling:"touch",
          touchAction:"pan-y",background:"#06060f",display:"flex",flexDirection:"column"}}>
          <MarketplaceScreen user={user} onOpenFigure={f=>{setModal(f);}}/>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <div style={{flexShrink:0,background:"#07070fee",borderTop:"1px solid #ffffff10",
        display:"flex",paddingBottom:"env(safe-area-inset-bottom,0px)",
        position:"relative",zIndex:10}}>
        {[
          {k:"catalog", ic:"🗂️", l:"Catálogo"},
          {k:"owned",   ic:"✓",  l:"Tenho",   n:nOwned,    c:"#22c55e"},
          {k:"wish",    ic:"♡",  l:"Quero",   n:nWished,   c:"#a855f7"},
          {k:"market",  ic:"🛒", l:"Market",  n:nListings, c:"#ffd700"},
          {k:"ranking", ic:"🏆", l:"Ranking"},
        ].map(item=>{
          const isActive = tab===item.k;
          const color = item.c||"#ffd700";
          return (
            <button key={item.k} onClick={()=>setTab(item.k)}
              style={{flex:1,padding:"8px 2px 6px",border:"none",cursor:"pointer",
                background:"transparent",display:"flex",flexDirection:"column",
                alignItems:"center",gap:2,position:"relative"}}>
              <div style={{fontSize:item.k==="owned"||item.k==="wish"?15:18,lineHeight:1,
                color:isActive?color:"#444",fontWeight:900,
                filter:isActive?`drop-shadow(0 0 6px ${color}88)`:"none"}}>
                {item.ic}
              </div>
              <div style={{fontSize:8,fontWeight:700,letterSpacing:0.5,
                color:isActive?color:"#333"}}>{item.l}</div>
              {item.n > 0 && (
                <div style={{position:"absolute",top:4,right:"50%",transform:"translateX(10px)",
                  background:item.c,color:"#000",borderRadius:10,
                  padding:"0 4px",fontSize:7,fontWeight:900,minWidth:14,
                  height:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {item.n}
                </div>
              )}
              {isActive && (
                <div style={{position:"absolute",bottom:0,left:"20%",right:"20%",
                  height:2,background:color,borderRadius:"2px 2px 0 0"}}/>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function ActionBtn({label,icon,active,color,onClick}){
  return <button onClick={onClick} style={{flex:1,padding:"12px 8px",borderRadius:12,border:"none",cursor:"pointer",
    display:"flex",flexDirection:"column",alignItems:"center",gap:4,
    background:active?color:"#ffffff0d",transition:"all 0.2s",
    boxShadow:active?`0 4px 20px ${color}44`:"none"}}>
    <span style={{fontSize:18}}>{icon}</span>
    <span style={{fontSize:11,fontWeight:800,color:active?"#fff":"#555"}}>{label}</span>
  </button>;
}
