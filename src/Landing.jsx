// Página estática exibida em colezzare.com (domínio raiz) enquanto o app
// não está finalizado. Apenas a logo — sem botões, links ou ação.
export default function Landing() {
  return (
    <div style={{
      position:"fixed", inset:0,
      background:"radial-gradient(ellipse at center, #10101f 0%, #06060f 70%)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:24, padding:24,
    }}>
      <img
        src="https://res.cloudinary.com/dr3sxytes/image/upload/app/icone_novo.png"
        alt="Colezzare"
        style={{ width:140, height:140, objectFit:"contain", opacity:0.98 }}
      />
      <h1 style={{
        margin:0, fontSize:34, fontWeight:900, letterSpacing:4,
        fontFamily:"'Cinzel', serif",
        background:"linear-gradient(90deg, #ffd700, #ff8c00)",
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        backgroundClip:"text",
      }}>COLEZZARE</h1>
    </div>
  );
}
