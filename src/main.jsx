import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Landing from './Landing.jsx'

// Gate por hostname: o domínio raiz (colezzare.com) mostra só a logo estática
// enquanto o app não está finalizado. O subdomínio actionfigure.colezzare.com,
// localhost e previews rodam o app normal.
// Override manual p/ preview: adicione ?landing=1 ou ?app=1 na URL.
const host = window.location.hostname;
const params = new URLSearchParams(window.location.search);
const isRootDomain = host === 'colezzare.com' || host === 'www.colezzare.com';
const showLanding = params.has('app') ? false
                  : params.has('landing') ? true
                  : isRootDomain;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {showLanding ? <Landing /> : <App />}
  </StrictMode>,
)
