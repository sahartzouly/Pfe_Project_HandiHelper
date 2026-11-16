import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import DashboardHeader from '../components/DashboardHeader'
import BoutonSOS from '../components/BoutonSOS'

const MESSAGES_RAPIDES = [
  { emoji: '🆘', text: "J'ai besoin d'aide",   grad: 'linear-gradient(135deg,#e53935,#e35d5b)', glow: 'rgba(229,57,53,0.4)',   soft: 'rgba(229,57,53,0.12)'  },
  { emoji: '✅', text: 'Tout va bien',          grad: 'linear-gradient(135deg,#11998e,#38ef7d)', glow: 'rgba(17,153,142,0.4)',  soft: 'rgba(17,153,142,0.12)' },
  { emoji: '📞', text: 'Appelez le 15',         grad: 'linear-gradient(135deg,#4776e6,#8e54e9)', glow: 'rgba(71,118,230,0.4)',  soft: 'rgba(71,118,230,0.12)' },
  { emoji: '🏠', text: 'Je rentre à la maison', grad: 'linear-gradient(135deg,#667eea,#764ba2)', glow: 'rgba(102,126,234,0.4)', soft: 'rgba(102,126,234,0.12)' },
  { emoji: '🚗', text: 'Je suis en route',      grad: 'linear-gradient(135deg,#f7971e,#ffd200)', glow: 'rgba(247,151,30,0.4)',  soft: 'rgba(247,151,30,0.12)' },
  { emoji: '⏳', text: 'Attendez-moi',          grad: 'linear-gradient(135deg,#ee0979,#ff6a00)', glow: 'rgba(238,9,121,0.4)',   soft: 'rgba(238,9,121,0.12)'  },
]

const ALERTES = [
  { emoji: '🚪', label: 'Sonnette',        type: 'sonnette', grad: 'linear-gradient(135deg,#f7971e,#ffd200)', glow: 'rgba(247,151,30,0.4)',  soft: 'rgba(247,151,30,0.12)' },
  { emoji: '📱', label: 'Appel entrant',   type: 'appel',    grad: 'linear-gradient(135deg,#4776e6,#8e54e9)', glow: 'rgba(71,118,230,0.4)',  soft: 'rgba(71,118,230,0.12)' },
  { emoji: '⏰', label: 'Réveil',          type: 'reveil',   grad: 'linear-gradient(135deg,#11998e,#38ef7d)', glow: 'rgba(17,153,142,0.4)',  soft: 'rgba(17,153,142,0.12)' },
  { emoji: '🍳', label: 'Minuteur cuisine',type: 'cuisine',  grad: 'linear-gradient(135deg,#ee0979,#ff6a00)', glow: 'rgba(238,9,121,0.4)',   soft: 'rgba(238,9,121,0.12)'  },
]

const css = `
  .sd-root { min-height:100vh; background:linear-gradient(160deg,#0f0c29 0%,#1a1a4e 55%,#24243e 100%); }

  .sd-content { max-width:520px; margin:0 auto; padding:20px 16px 100px; display:flex; flex-direction:column; gap:16px; }

  .sd-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:20px; padding:20px; }

  .sd-section-title { font-size:15px; font-weight:700; color:rgba(255,255,255,0.85); margin:0 0 16px; display:flex; align-items:center; gap:8px; }

  /* ── Flash alerte ── */
  .sd-flash {
    position:fixed; inset:0; background:rgba(255,214,0,0.88); z-index:50;
    display:flex; align-items:center; justify-content:center;
    animation:sdPulse 0.5s ease infinite alternate;
  }
  @keyframes sdPulse { from{opacity:0.7} to{opacity:1} }
  .sd-flash-inner { background:#fff; border-radius:24px; padding:36px 40px; text-align:center; }
  .sd-flash-emoji { font-size:56px; display:block; margin-bottom:12px; }
  .sd-flash-label { font-size:22px; font-weight:700; color:#1a1a1a; }

  /* ── Grille boutons ── */
  .sd-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }

  .sd-btn {
    background:rgba(255,255,255,0.05);
    border:1.5px solid rgba(255,255,255,0.1);
    border-radius:16px;
    padding:18px 10px;
    cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:10px;
    transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, background 0.22s ease;
    position:relative; overflow:hidden;
  }
  .sd-btn:hover { transform:translateY(-4px) scale(1.04); }

  .sd-btn-emoji { font-size:36px; line-height:1; filter:drop-shadow(0 3px 6px rgba(0,0,0,0.3)); transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
  .sd-btn:hover .sd-btn-emoji { transform:scale(1.18) rotate(-6deg); }

  .sd-btn-label { font-size:12px; font-weight:700; color:rgba(255,255,255,0.7); text-align:center; line-height:1.3; }

  .sd-btn::after {
    content:''; position:absolute; bottom:0; left:15%; width:70%; height:2px;
    border-radius:999px; opacity:0; transition:opacity 0.3s;
  }
  .sd-btn:hover::after { opacity:1; }

  /* ── Flash feedback ── */
  .sd-sent {
    position:fixed; bottom:100px; left:50%; transform:translateX(-50%);
    background:rgba(17,153,142,0.9); color:#fff;
    padding:10px 22px; border-radius:999px; font-size:14px; font-weight:700;
    animation:fadeIn 0.3s ease;
    z-index:40;
  }

  /* ── Items liste ── */
  .sd-list-item {
    display:flex; align-items:center; gap:12px; padding:12px 14px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    border-radius:12px; transition:background 0.2s;
  }
  .sd-list-item:hover { background:rgba(255,255,255,0.08); }
  .sd-list-icon { font-size:24px; }
  .sd-list-title { font-size:13px; font-weight:600; color:rgba(255,255,255,0.85); }
  .sd-list-sub { font-size:11px; color:rgba(255,255,255,0.4); margin-top:2px; }

  .sd-contact-arrow { margin-left:auto; font-size:16px; color:rgba(255,255,255,0.3); }

  .sd-empty { text-align:center; color:rgba(255,255,255,0.25); font-size:13px; padding:20px 0; }

  @keyframes fadeIn { from{opacity:0;transform:translate(-50%,6px)} to{opacity:1;transform:translate(-50%,0)} }
`

export default function DashboardSourd() {
  const { profileId } = useSelector(state => state.user)
  const [medications, setMedications] = useState([])
  const [routines, setRoutines]       = useState([])
  const [contacts, setContacts]       = useState([])
  const [alerteActive, setAlerteActive] = useState(null)
  const [sentMsg, setSentMsg]         = useState(null)

  useEffect(() => {
    if (!profileId) return
    api.get(`/api/medications/${profileId}`).then(r => setMedications(r.data.data)).catch(() => {})
    api.get(`/api/routines/${profileId}`).then(r => setRoutines(r.data.data)).catch(() => {})
    api.get(`/api/contacts/${profileId}`).then(r => setContacts(r.data.data)).catch(() => {})
  }, [profileId])

  const declencherAlerte = (alerte) => {
    setAlerteActive(alerte)
    if (navigator.vibrate) navigator.vibrate([200, 100, 200])
    setTimeout(() => setAlerteActive(null), 3000)
  }

  const envoyerMessage = (msg) => {
    if (navigator.vibrate) navigator.vibrate(100)
    setSentMsg(msg.text)
    setTimeout(() => setSentMsg(null), 2000)
  }

  return (
    <div className="sd-root">
      <style>{css}</style>

      {/* Flash alerte visuelle */}
      {alerteActive && (
        <div className="sd-flash" onClick={() => setAlerteActive(null)}>
          <div className="sd-flash-inner">
            <span className="sd-flash-emoji">{alerteActive.emoji}</span>
            <p className="sd-flash-label">{alerteActive.label}</p>
          </div>
        </div>
      )}

      {/* Toast message envoyé */}
      {sentMsg && <div className="sd-sent">✅ {sentMsg}</div>}

      <DashboardHeader sous_titre="Communication visuelle" />

      <div className="sd-content">

        {/* ── Messages rapides ── */}
        <div className="sd-card">
          <p className="sd-section-title">💬 Messages rapides</p>
          <div className="sd-grid">
            {MESSAGES_RAPIDES.map(msg => (
              <button
                key={msg.text}
                className="sd-btn"
                onClick={() => envoyerMessage(msg)}
                style={{ background: msg.soft, boxShadow: `0 6px 20px ${msg.glow}`, borderColor: 'transparent' }}
              >
                <span className="sd-btn-emoji">{msg.emoji}</span>
                <span className="sd-btn-label">{msg.text}</span>
                <style>{`.sd-btn[data-msg="${msg.text}"]::after { background: ${msg.grad}; }`}</style>
              </button>
            ))}
          </div>
        </div>

        {/* ── Alertes visuelles ── */}
        <div className="sd-card">
          <p className="sd-section-title">⚡ Alertes visuelles</p>
          <div className="sd-grid">
            {ALERTES.map(a => (
              <button
                key={a.type}
                className="sd-btn"
                onClick={() => declencherAlerte(a)}
                style={{ background: a.soft, borderColor: 'transparent' }}
              >
                <span className="sd-btn-emoji">{a.emoji}</span>
                <span className="sd-btn-label">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Routines ── */}
        <div className="sd-card">
          <p className="sd-section-title">📋 Mes routines</p>
          {routines.length === 0 ? (
            <p className="sd-empty">Aucune routine</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {routines.map(r => (
                <div key={r.id} className="sd-list-item">
                  <span className="sd-list-icon">{r.icone || '📌'}</span>
                  <div>
                    <p className="sd-list-title">{r.titre}</p>
                    {r.heureDebut && (
                      <p className="sd-list-sub">{r.heureDebut.slice(0,5)}{r.dureeMinutes ? ` — ${r.dureeMinutes} min` : ''}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Médicaments ── */}
        <div className="sd-card">
          <p className="sd-section-title">💊 Médicaments</p>
          {medications.length === 0 ? (
            <p className="sd-empty">Aucun médicament</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {medications.map(m => (
                <div key={m.id} className="sd-list-item">
                  <span className="sd-list-icon">💊</span>
                  <div>
                    <p className="sd-list-title">{m.nom}</p>
                    <p className="sd-list-sub">{m.dosage}{m.horaires ? ` — ${m.horaires}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Contacts ── */}
        <div className="sd-card">
          <p className="sd-section-title">📞 Contacts urgence</p>
          {contacts.length === 0 ? (
            <p className="sd-empty">Aucun contact</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {contacts.map(c => (
                <a key={c.id} href={`tel:${c.telephone}`} className="sd-list-item" style={{ textDecoration:'none' }}>
                  <span className="sd-list-icon">📞</span>
                  <div>
                    <p className="sd-list-title">{c.nom}</p>
                    <p className="sd-list-sub">{c.telephone}</p>
                  </div>
                  <span className="sd-contact-arrow">→</span>
                </a>
              ))}
            </div>
          )}
        </div>

      </div>

      <BoutonSOS />
    </div>
  )
}