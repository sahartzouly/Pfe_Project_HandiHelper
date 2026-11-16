import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import DashboardHeader from '../components/DashboardHeader'
import BoutonSOS from '../components/BoutonSOS'

const HUMEURS = [
  { key: 'super',     emoji: '😄', label: 'Super',   soft: 'rgba(247,151,30,0.15)',   glow: '#f7971e' },
  { key: 'bien',      emoji: '🙂', label: 'Bien',    soft: 'rgba(17,153,142,0.15)',   glow: '#11998e' },
  { key: 'moyen',     emoji: '😐', label: 'Moyen',   soft: 'rgba(102,126,234,0.15)',  glow: '#667eea' },
  { key: 'fatigue',   emoji: '😴', label: 'Fatigué', soft: 'rgba(118,75,162,0.2)',    glow: '#764ba2' },
  { key: 'difficile', emoji: '😟', label: 'Dur',     soft: 'rgba(238,9,121,0.12)',    glow: '#ee0979' },
]

const ENERGIES = [
  { key: 1, emoji: '🔋', label: 'Vide',    soft: 'rgba(229,57,53,0.15)'   },
  { key: 2, emoji: '🔋', label: 'Peu',     soft: 'rgba(238,120,9,0.15)'   },
  { key: 3, emoji: '⚡',  label: 'Correct', soft: 'rgba(247,151,30,0.15)'  },
  { key: 4, emoji: '⚡',  label: 'Bien',    soft: 'rgba(17,153,142,0.15)'  },
  { key: 5, emoji: '🚀', label: 'Top !',   soft: 'rgba(56,239,125,0.15)'  },
]

const PROG_MSGS = ['', 'Super début ! 💪', 'Continuez ! 🌟', 'À mi-chemin, bravo ! ⭐', 'Presque fini ! 🎉', 'Encore un effort ! 🚀']

const css = `
  .cog-root { min-height:100vh; background:linear-gradient(160deg,#0f0c29 0%,#1a1a4e 55%,#24243e 100%); }
  .cog-content { max-width:520px; margin:0 auto; padding:20px 16px 100px; display:flex; flex-direction:column; gap:14px; }
  .cog-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:20px; padding:18px; }
  .cog-sec { font-size:13px; font-weight:700; color:rgba(255,255,255,0.5); letter-spacing:.08em; text-transform:uppercase; margin:0 0 14px; }

  /* Humeur */
  .cog-mood-row { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; }
  .cog-mood-btn { background:rgba(255,255,255,0.04); border:2px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px 4px 10px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:6px; transition:all .2s cubic-bezier(.34,1.56,.64,1); }
  .cog-mood-btn:hover { transform:translateY(-3px) scale(1.07); }
  .cog-mood-btn.active { border-color:transparent; }
  .cog-mood-emoji { font-size:30px; line-height:1; transition:transform .2s cubic-bezier(.34,1.56,.64,1); }
  .cog-mood-btn:hover .cog-mood-emoji, .cog-mood-btn.active .cog-mood-emoji { transform:scale(1.2); }
  .cog-mood-lbl { font-size:10px; font-weight:700; color:rgba(255,255,255,0.45); }
  .cog-mood-btn.active .cog-mood-lbl { color:#fff; }

  /* Énergie */
  .cog-energy-row { display:flex; gap:6px; }
  .cog-energy-btn { flex:1; border:2px solid rgba(255,255,255,0.08); border-radius:12px; padding:10px 4px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px; background:rgba(255,255,255,0.04); transition:all .2s; }
  .cog-energy-btn:hover { transform:scale(1.05); }
  .cog-energy-btn.active { border-color:transparent; }
  .cog-energy-ico { font-size:22px; }
  .cog-energy-lbl { font-size:10px; font-weight:700; color:rgba(255,255,255,0.45); }
  .cog-energy-btn.active .cog-energy-lbl { color:#fff; }

  /* Tâches */
  .cog-task-btn { width:100%; display:flex; align-items:center; gap:14px; padding:16px; border-radius:16px; border:2px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); cursor:pointer; text-align:left; transition:all .22s cubic-bezier(.34,1.56,.64,1); }
  .cog-task-btn:hover { transform:translateY(-2px); background:rgba(255,255,255,0.08); }
  .cog-task-btn.done { background:rgba(17,153,142,0.13); border-color:rgba(17,153,142,0.4); }
  .cog-task-num { width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:rgba(255,255,255,0.4); flex-shrink:0; transition:all .2s; }
  .cog-task-btn.done .cog-task-num { background:rgba(17,153,142,0.3); color:#38ef7d; }
  .cog-task-ico { font-size:28px; flex-shrink:0; transition:transform .2s cubic-bezier(.34,1.56,.64,1); }
  .cog-task-btn:hover .cog-task-ico, .cog-task-btn.done .cog-task-ico { transform:scale(1.15) rotate(-5deg); }
  .cog-task-title { font-size:15px; font-weight:700; color:rgba(255,255,255,0.85); transition:all .2s; }
  .cog-task-btn.done .cog-task-title { text-decoration:line-through; color:rgba(255,255,255,0.3); }
  .cog-task-time { font-size:11px; color:rgba(255,255,255,0.35); margin-top:3px; }
  .cog-task-check { margin-left:auto; font-size:22px; opacity:0; transform:scale(.4) rotate(-20deg); transition:all .3s cubic-bezier(.34,1.56,.64,1); flex-shrink:0; }
  .cog-task-btn.done .cog-task-check { opacity:1; transform:scale(1) rotate(0); }

  /* Progression */
  .cog-prog-wrap { margin-top:14px; }
  .cog-prog-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .cog-prog-label { font-size:12px; color:rgba(255,255,255,0.4); }
  .cog-prog-badge { font-size:12px; font-weight:700; padding:3px 10px; border-radius:999px; background:rgba(17,153,142,0.2); color:#38ef7d; }
  .cog-prog-track { height:8px; background:rgba(255,255,255,0.07); border-radius:999px; overflow:hidden; }
  .cog-prog-bar { height:100%; border-radius:999px; background:linear-gradient(90deg,#11998e,#38ef7d); transition:width .5s cubic-bezier(.4,0,.2,1); }
  .cog-prog-msg { text-align:center; font-size:13px; font-weight:700; color:#38ef7d; margin-top:10px; min-height:20px; }

  /* Médicaments */
  .cog-med { display:flex; align-items:center; gap:12px; padding:13px 14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:14px; transition:all .2s; cursor:pointer; }
  .cog-med:hover { background:rgba(255,255,255,0.08); }
  .cog-med.taken { background:rgba(17,153,142,0.1); border-color:rgba(17,153,142,0.3); }
  .cog-med-dot { width:12px; height:12px; border-radius:50%; flex-shrink:0; }
  .cog-med-name { font-size:13px; font-weight:700; color:rgba(255,255,255,0.85); }
  .cog-med-sub { font-size:11px; color:rgba(255,255,255,0.35); margin-top:2px; }
  .cog-med-badge { margin-left:auto; font-size:10px; font-weight:700; padding:3px 9px; border-radius:999px; background:rgba(17,153,142,0.2); color:#38ef7d; opacity:0; transition:opacity .2s; }
  .cog-med.taken .cog-med-badge { opacity:1; }
  .cog-med-alarm { margin-left:auto; font-size:18px; color:rgba(255,255,255,0.25); }
  .cog-med.taken .cog-med-alarm { display:none; }

  /* Conseil */
  .cog-tip { background:rgba(102,126,234,0.12); border:1px solid rgba(102,126,234,0.25); border-radius:14px; padding:14px 16px; display:flex; align-items:flex-start; gap:12px; }
  .cog-tip-ico { font-size:22px; flex-shrink:0; }
  .cog-tip-text { font-size:13px; color:rgba(255,255,255,0.7); line-height:1.55; }
  .cog-tip-text strong { color:#fff; font-weight:700; }

  /* Contacts */
  .cog-contact { display:flex; align-items:center; gap:12px; padding:13px 14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:14px; text-decoration:none; transition:all .2s; }
  .cog-contact:hover { background:rgba(255,255,255,0.08); transform:translateY(-1px); }
  .cog-contact-av { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; flex-shrink:0; }
  .cog-contact-name { font-size:13px; font-weight:700; color:rgba(255,255,255,0.85); }
  .cog-contact-role { font-size:11px; color:rgba(255,255,255,0.35); margin-top:2px; }
  .cog-call-badge { margin-left:auto; font-size:11px; font-weight:700; padding:5px 12px; border-radius:999px; background:rgba(17,153,142,0.15); color:#38ef7d; border:1px solid rgba(17,153,142,0.3); }

  .cog-empty { text-align:center; color:rgba(255,255,255,0.25); font-size:13px; padding:20px 0; }
  .cog-gap { display:flex; flex-direction:column; gap:8px; }

  @keyframes cogFade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  .cog-fadein { animation:cogFade .3s ease; }
`

const TIPS = [
  "Si une tâche vous semble difficile, faites une pause de 5 minutes. Respirez lentement.",
  "Vous avancez à votre rythme, et c'est parfait. Chaque petite étape compte.",
  "N'oubliez pas de boire de l'eau régulièrement tout au long de la journée.",
  "Une tâche à la fois. Vous n'avez pas besoin de tout faire en même temps.",
]

export default function DashboardCognitif() {
  const { profileId } = useSelector(state => state.user)
  const [medications, setMedications]   = useState([])
  const [routines, setRoutines]         = useState([])
  const [contacts, setContacts]         = useState([])
  const [tachesDone, setTachesDone]     = useState([])
  const [medsTaken, setMedsTaken]       = useState([])
  const [humeur, setHumeur]             = useState(null)
  const [energie, setEnergie]           = useState(null)
  const tip = TIPS[new Date().getDay() % TIPS.length]

  useEffect(() => {
    if (!profileId) return
    api.get(`/api/medications/${profileId}`).then(r => setMedications(r.data.data)).catch(() => {})
    api.get(`/api/routines/${profileId}`).then(r => setRoutines(r.data.data)).catch(() => {})
    api.get(`/api/contacts/${profileId}`).then(r => setContacts(r.data.data)).catch(() => {})
  }, [profileId])

  const toggleTache = id =>
    setTachesDone(p => p.includes(id) ? p.filter(t => t !== id) : [...p, id])

  const toggleMed = id =>
    setMedsTaken(p => p.includes(id) ? p.filter(m => m !== id) : [...p, id])

  const total = routines.length
  const done  = tachesDone.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0
  const progMsg = done === 0 ? '' : done === total
    ? '🎊 Journée complète ! Vous avez tout réussi !'
    : PROG_MSGS[Math.min(done, PROG_MSGS.length - 1)]

  return (
    <div className="cog-root">
      <style>{css}</style>
      <DashboardHeader sous_titre="Votre journée simplifiée" />

      <div className="cog-content">

        {/* ── Humeur ── */}
        <div className="cog-card">
          <p className="cog-sec">Mon humeur</p>
          <div className="cog-mood-row">
            {HUMEURS.map(h => (
              <button
                key={h.key}
                className={`cog-mood-btn${humeur?.key === h.key ? ' active' : ''}`}
                onClick={() => setHumeur(h)}
                style={humeur?.key === h.key
                  ? { background: h.soft, borderColor: 'transparent', boxShadow: `0 6px 20px ${h.glow}44` }
                  : {}}
              >
                <span className="cog-mood-emoji">{h.emoji}</span>
                <span className="cog-mood-lbl">{h.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Énergie ── */}
        <div className="cog-card">
          <p className="cog-sec">Mon énergie</p>
          <div className="cog-energy-row">
            {ENERGIES.map(e => (
              <button
                key={e.key}
                className={`cog-energy-btn${energie?.key === e.key ? ' active' : ''}`}
                onClick={() => setEnergie(e)}
                style={energie?.key === e.key ? { background: e.soft, borderColor: 'transparent' } : {}}
              >
                <span className="cog-energy-ico">{e.emoji}</span>
                <span className="cog-energy-lbl">{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tâches ── */}
        <div className="cog-card">
          <p className="cog-sec">Mes tâches du jour</p>
          {routines.length === 0 ? (
            <p className="cog-empty">Aucune tâche pour l'instant</p>
          ) : (
            <div className="cog-gap">
              {routines
                .sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
                .map((r, i) => {
                  const isDone = tachesDone.includes(r.id)
                  return (
                    <button
                      key={r.id}
                      className={`cog-task-btn${isDone ? ' done' : ''}`}
                      onClick={() => toggleTache(r.id)}
                    >
                      <span className="cog-task-num">{i + 1}</span>
                      <span className="cog-task-ico">{r.icone || '📌'}</span>
                      <div style={{ flex: 1 }}>
                        <p className="cog-task-title">{r.titre}</p>
                        {r.heureDebut && (
                          <p className="cog-task-time">
                            ⏰ {r.heureDebut.slice(0, 5)}{r.dureeMinutes ? ` — ${r.dureeMinutes} min` : ''}
                          </p>
                        )}
                      </div>
                      <span className="cog-task-check">✅</span>
                    </button>
                  )
                })}
            </div>
          )}

          {total > 0 && (
            <div className="cog-prog-wrap cog-fadein">
              <div className="cog-prog-row">
                <span className="cog-prog-label">Progression du jour</span>
                <span className="cog-prog-badge">{done} / {total}</span>
              </div>
              <div className="cog-prog-track">
                <div className="cog-prog-bar" style={{ width: `${pct}%` }} />
              </div>
              {progMsg && <p className="cog-prog-msg">{progMsg}</p>}
            </div>
          )}
        </div>

        {/* ── Médicaments ── */}
        <div className="cog-card">
          <p className="cog-sec">Mes médicaments</p>
          {medications.length === 0 ? (
            <p className="cog-empty">Aucun médicament</p>
          ) : (
            <div className="cog-gap">
              {medications.map((m, i) => {
                const colors = ['#667eea', '#ee0979', '#11998e', '#f7971e']
                const taken  = medsTaken.includes(m.id)
                return (
                  <div
                    key={m.id}
                    className={`cog-med${taken ? ' taken' : ''}`}
                    onClick={() => toggleMed(m.id)}
                  >
                    <div className="cog-med-dot" style={{ background: colors[i % colors.length] }} />
                    <div style={{ flex: 1 }}>
                      <p className="cog-med-name">{m.nom}</p>
                      <p className="cog-med-sub">{m.dosage}{m.horaires ? ` — ${m.horaires}` : ''}</p>
                    </div>
                    {!taken && <span className="cog-med-alarm">🔔</span>}
                    <span className="cog-med-badge">Pris ✓</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Conseil du jour ── */}
        <div className="cog-tip">
          <span className="cog-tip-ico">💡</span>
          <p className="cog-tip-text"><strong>Conseil du jour :</strong> {tip}</p>
        </div>

        {/* ── Contacts ── */}
        {contacts.length > 0 && (
          <div className="cog-card">
            <p className="cog-sec">Contacts importants</p>
            <div className="cog-gap">
              {contacts.map((c, i) => {
                const avColors = [
                  { bg: 'rgba(71,118,230,0.2)', txt: '#8e54e9' },
                  { bg: 'rgba(17,153,142,0.2)', txt: '#38ef7d' },
                  { bg: 'rgba(229,57,53,0.2)',  txt: '#ff6b6b' },
                ]
                const av = avColors[i % avColors.length]
                const initials = c.nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <a key={c.id} href={`tel:${c.telephone}`} className="cog-contact">
                    <div className="cog-contact-av" style={{ background: av.bg, color: av.txt }}>{initials}</div>
                    <div style={{ flex: 1 }}>
                      <p className="cog-contact-name">{c.nom}</p>
                      <p className="cog-contact-role">{c.telephone}</p>
                    </div>
                    <span className="cog-call-badge">📞 Appeler</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}

      </div>

      <BoutonSOS />
    </div>
  )
}