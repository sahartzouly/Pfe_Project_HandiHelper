import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardHeader from '../components/DashboardHeader'
import BoutonSOS from '../components/BoutonSOS'
import api from '../api/axios'

const EMOTIONS = [
  { key: 'HEUREUX',   emoji: '😊', label: 'Heureux',   grad: 'linear-gradient(135deg,#f7971e,#ffd200)', glow: 'rgba(247,151,30,0.4)',  soft: 'rgba(247,151,30,0.12)' },
  { key: 'CALME',     emoji: '😌', label: 'Calme',     grad: 'linear-gradient(135deg,#11998e,#38ef7d)', glow: 'rgba(17,153,142,0.4)',  soft: 'rgba(17,153,142,0.12)' },
  { key: 'TRISTE',    emoji: '😢', label: 'Triste',    grad: 'linear-gradient(135deg,#4776e6,#8e54e9)', glow: 'rgba(71,118,230,0.4)',  soft: 'rgba(71,118,230,0.12)' },
  { key: 'ANXIEUX',   emoji: '😰', label: 'Anxieux',   grad: 'linear-gradient(135deg,#ee0979,#ff6a00)', glow: 'rgba(238,9,121,0.4)',   soft: 'rgba(238,9,121,0.12)'  },
  { key: 'EN_COLERE', emoji: '😠', label: 'En colère', grad: 'linear-gradient(135deg,#e53935,#e35d5b)', glow: 'rgba(229,57,53,0.4)',   soft: 'rgba(229,57,53,0.12)'  },
  { key: 'FATIGUE',   emoji: '😴', label: 'Fatigué',   grad: 'linear-gradient(135deg,#667eea,#764ba2)', glow: 'rgba(102,126,234,0.4)', soft: 'rgba(102,126,234,0.12)'},
]

const css = `
  .tsa-root { min-height:100vh; background:linear-gradient(160deg,#0f0c29 0%,#1a1a4e 55%,#24243e 100%); }

  .tsa-content { max-width:520px; margin:0 auto; padding:20px 16px 100px; display:flex; flex-direction:column; gap:16px; }

  .tsa-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:20px; padding:20px; }

  .tsa-section-title { font-size:15px; font-weight:700; color:rgba(255,255,255,0.85); margin:0 0 16px; display:flex; align-items:center; gap:8px; }

  .tsa-emotions-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }

  .tsa-emotion-btn {
    background:rgba(255,255,255,0.05);
    border:1.5px solid rgba(255,255,255,0.1);
    border-radius:16px;
    padding:16px 8px;
    cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:8px;
    transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, background 0.22s ease;
    position:relative; overflow:hidden;
  }
  .tsa-emotion-btn:hover { transform:translateY(-4px) scale(1.04); }
  .tsa-emotion-btn.active { border-color:transparent; }

  .tsa-emotion-btn::after {
    content:''; position:absolute; bottom:0; left:15%; width:70%; height:2px;
    border-radius:999px; opacity:0; transition:opacity 0.3s;
  }
  .tsa-emotion-btn.active::after, .tsa-emotion-btn:hover::after { opacity:1; }

  .tsa-emoji { font-size:36px; line-height:1; transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1); filter:drop-shadow(0 3px 6px rgba(0,0,0,0.3)); }
  .tsa-emotion-btn:hover .tsa-emoji, .tsa-emotion-btn.active .tsa-emoji { transform:scale(1.2) rotate(-6deg); }

  .tsa-emotion-label { font-size:11px; font-weight:700; color:rgba(255,255,255,0.7); text-align:center; }
  .tsa-emotion-btn.active .tsa-emotion-label { color:#fff; }

  .tsa-save-area { margin-top:14px; display:flex; flex-direction:column; gap:10px; animation:fadeIn 0.3s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }

  .tsa-textarea {
    width:100%; border:1.5px solid rgba(255,255,255,0.12); border-radius:12px;
    background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.85);
    padding:10px 12px; font-size:13px; resize:none; outline:none; box-sizing:border-box;
    transition:border-color 0.2s;
  }
  .tsa-textarea::placeholder { color:rgba(255,255,255,0.3); }
  .tsa-textarea:focus { border-color:rgba(255,255,255,0.35); }

  .tsa-save-btn {
    width:100%; border:none; border-radius:12px; padding:12px;
    font-size:14px; font-weight:700; color:#fff; cursor:pointer;
    transition:transform 0.15s, opacity 0.15s;
  }
  .tsa-save-btn:hover { opacity:0.9; transform:scale(0.99); }
  .tsa-save-btn:active { transform:scale(0.97); }

  .tsa-routine-item {
    display:flex; align-items:center; gap:12px; padding:12px 14px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    border-radius:12px; transition:background 0.2s;
  }
  .tsa-routine-item:hover { background:rgba(255,255,255,0.08); }
  .tsa-routine-icon { font-size:22px; }
  .tsa-routine-title { font-size:13px; font-weight:600; color:rgba(255,255,255,0.85); }
  .tsa-routine-time { font-size:11px; color:rgba(255,255,255,0.4); margin-top:2px; }

  .tsa-history-item {
    display:flex; align-items:center; gap:12px; padding:10px 12px;
    border-radius:10px; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.06);
  }
  .tsa-history-emoji { font-size:22px; }
  .tsa-history-label { font-size:13px; color:rgba(255,255,255,0.75); font-weight:500; }
  .tsa-history-date { font-size:11px; color:rgba(255,255,255,0.3); margin-left:auto; }

  .tsa-empty { text-align:center; color:rgba(255,255,255,0.25); font-size:13px; padding:20px 0; }
`

export default function DashboardTSA() {
  const { profileId } = useSelector(state => state.user)

  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [note, setNote] = useState('')
  const [routines, setRoutines] = useState([])
  const [emotionHistory, setEmotionHistory] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!profileId) return
    api.get(`/api/routines/${profileId}`)
      .then(({ data }) => setRoutines(data?.data || []))
      .catch(err => console.error(err))
  }, [profileId])

  useEffect(() => {
    if (!profileId) return
    api.get(`/api/emotions/${profileId}`)
      .then(({ data }) => setEmotionHistory(data?.data || []))
      .catch(err => console.error(err))
  }, [profileId])

  const handleSaveEmotion = async () => {
    if (!selectedEmotion) return
    try {
      await api.post(`/api/emotions/${profileId}`, { emotion: selectedEmotion.key, note })
      setSaved(true)
      setTimeout(() => { setSaved(false); setSelectedEmotion(null); setNote('') }, 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="tsa-root">
      <style>{css}</style>
      <DashboardHeader sous_titre="Comment tu te sens aujourd'hui ?" />

      <div className="tsa-content">

        {/* ── Émotions ── */}
        <div className="tsa-card">
          <p className="tsa-section-title">💜 Sélectionne ton émotion</p>
          <div className="tsa-emotions-grid">
            {EMOTIONS.map(e => (
              <button
                key={e.key}
                onClick={() => { setSelectedEmotion(e); setSaved(false) }}
                className={`tsa-emotion-btn${selectedEmotion?.key === e.key ? ' active' : ''}`}
                style={selectedEmotion?.key === e.key
                  ? { background: e.soft, boxShadow: `0 8px 24px ${e.glow}`, borderColor: 'transparent' }
                  : {}}
              >
                <span
                  className="tsa-emoji"
                  style={{ '--after-bg': e.grad }}
                >
                  {e.emoji}
                </span>
                <span className="tsa-emotion-label">{e.label}</span>
                <style>{`.tsa-emotion-btn[data-k="${e.key}"]::after { background: ${e.grad}; }`}</style>
              </button>
            ))}
          </div>

          {selectedEmotion && (
            <div className="tsa-save-area">
              <textarea
                className="tsa-textarea"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ajoute une note (optionnel)..."
                rows={2}
              />
              <button
                className="tsa-save-btn"
                onClick={handleSaveEmotion}
                style={{ background: saved ? 'linear-gradient(135deg,#11998e,#38ef7d)' : selectedEmotion.grad }}
              >
                {saved ? '✅ Enregistré !' : 'Enregistrer mon émotion'}
              </button>
            </div>
          )}
        </div>

        {/* ── Routines ── */}
        <div className="tsa-card">
          <p className="tsa-section-title">📋 Mes routines</p>
          {routines.filter(r => r.active !== false).length === 0 ? (
            <p className="tsa-empty">Aucune routine pour l'instant</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {routines
                .filter(r => r.active !== false)
                .sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
                .map(r => (
                  <div key={r.id} className="tsa-routine-item">
                    <span className="tsa-routine-icon">{r.icone || '📌'}</span>
                    <div>
                      <p className="tsa-routine-title">{r.titre}</p>
                      {r.heureDebut && <p className="tsa-routine-time">{r.heureDebut.slice(0,5)}</p>}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ── Historique ── */}
        <div className="tsa-card">
          <p className="tsa-section-title">📊 Historique</p>
          {emotionHistory.length === 0 ? (
            <p className="tsa-empty">Aucun historique</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              {emotionHistory.map((log, i) => {
                const em = EMOTIONS.find(e => e.key === log.emotion)
                const date = log.dateHeure
                  ? new Date(log.dateHeure).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
                  : ''
                return (
                  <div key={i} className="tsa-history-item">
                    <span className="tsa-history-emoji">{em?.emoji || '❓'}</span>
                    <span className="tsa-history-label">{em?.label || log.emotion}</span>
                    {date && <span className="tsa-history-date">{date}</span>}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      <BoutonSOS />
    </div>
  )
}