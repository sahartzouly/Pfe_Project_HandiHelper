import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import DashboardHeader from '../components/DashboardHeader'

const TEXTS = {
  fr: {
    subtitle: 'Gérez vos proches',
    linkTitle: '➕ Lier un proche',
    emailPlaceholder: 'Email du proche...',
    linkBtn: 'Lier ce proche',
    successMsg: '✅ Proche lié avec succès !',
    errorMsg: '❌ Email introuvable',
    myCloseOnes: '👥 Mes proches',
    noProche: "Aucun proche lié pour l'instant",
    monitoring: '📊 Suivi des proches',
    noProcheShort: 'Aucun proche lié',
    emotions: '😊 Émotions',
    manage: '⚙️ Gérer',
  },
  en: {
    subtitle: 'Manage your loved ones',
    linkTitle: '➕ Link someone',
    emailPlaceholder: "Loved one's email...",
    linkBtn: 'Link this person',
    successMsg: '✅ Successfully linked!',
    errorMsg: '❌ Email not found',
    myCloseOnes: '👥 My loved ones',
    noProche: 'No one linked yet',
    monitoring: '📊 Monitoring',
    noProcheShort: 'No one linked',
    emotions: '😊 Emotions',
    manage: '⚙️ Manage',
  }
}

const css = `
  .dp-root { min-height:100vh; background:linear-gradient(160deg,#0f0c29 0%,#1a1a4e 55%,#24243e 100%); }
  .dp-content { max-width:680px; margin:0 auto; padding:20px 16px 100px; display:flex; flex-direction:column; gap:16px; }

  .dp-lang { display:flex; gap:6px; justify-content:center; margin-bottom:8px; }
  .dp-lang-btn {
    background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12);
    color:rgba(255,255,255,0.55); font-size:11px; font-weight:700;
    padding:5px 12px; border-radius:8px; cursor:pointer; transition:background 0.2s, color 0.2s;
  }
  .dp-lang-btn:hover { background:rgba(255,255,255,0.13); color:rgba(255,255,255,0.85); }
  .dp-lang-btn.active { background:linear-gradient(135deg,#f7971e,#ffd200); color:#1a1a1a; border-color:transparent; }

  .dp-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:20px; padding:20px; }
  .dp-section-title { font-size:14px; font-weight:700; color:rgba(255,255,255,0.85); margin:0 0 16px; }

  .dp-input {
    width:100%; background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.12);
    border-radius:12px; padding:13px 15px; color:#fff; font-size:14px; outline:none;
    transition:border-color 0.2s, background 0.2s; box-sizing:border-box; margin-bottom:10px;
  }
  .dp-input::placeholder { color:rgba(255,255,255,0.35); }
  .dp-input:focus { border-color:rgba(247,151,30,0.6); background:rgba(255,255,255,0.09); }

  .dp-link-btn {
    width:100%; border:none; border-radius:12px; padding:13px; font-size:14px; font-weight:700;
    color:#1a1a1a; cursor:pointer; background:linear-gradient(135deg,#f7971e,#ffd200);
    transition:transform 0.15s, box-shadow 0.15s;
  }
  .dp-link-btn:hover { box-shadow:0 8px 24px rgba(247,151,30,0.35); transform:translateY(-1px); }

  .dp-message { text-align:center; margin-top:12px; font-size:13px; color:rgba(255,255,255,0.7); }

  .dp-proche-btn {
    width:100%; display:flex; align-items:center; gap:14px; padding:14px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; cursor:pointer; transition:background 0.2s, border-color 0.2s, transform 0.2s;
    margin-bottom:10px;
  }
  .dp-proche-btn:hover { background:rgba(247,151,30,0.1); border-color:rgba(247,151,30,0.3); transform:translateX(3px); }

  .dp-avatar {
    width:46px; height:46px; border-radius:50%;
    background:linear-gradient(135deg,#f7971e,#ffd200);
    display:flex; align-items:center; justify-content:center;
    font-size:18px; font-weight:800; color:#1a1a1a; flex-shrink:0;
  }
  .dp-proche-name { font-size:14px; font-weight:700; color:rgba(255,255,255,0.9); margin:0; text-align:left; }
  .dp-proche-email { font-size:12px; color:rgba(255,255,255,0.4); margin:0; text-align:left; }
  .dp-arrow { margin-left:auto; color:rgba(255,255,255,0.3); }

  .dp-empty { text-align:center; color:rgba(255,255,255,0.25); font-size:13px; padding:20px 0; }

  .dp-monitor-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:14px; margin-bottom:10px; }
  .dp-monitor-name { font-size:14px; font-weight:700; color:rgba(255,255,255,0.85); margin:0 0 10px; }
  .dp-monitor-actions { display:flex; gap:8px; }
  .dp-monitor-btn {
    flex:1; border:none; border-radius:10px; padding:9px;
    background:rgba(247,151,30,0.12); color:#fbbf24; font-size:12px; font-weight:600;
    cursor:pointer; transition:background 0.2s;
  }
  .dp-monitor-btn:hover { background:rgba(247,151,30,0.22); }
`

export default function DashboardParent() {
  const { userId } = useSelector((state) => state.user)
  const [proches, setProches] = useState([])
  const [emailProche, setEmailProche] = useState('')
  const [message, setMessage] = useState('')
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr')
  const navigate = useNavigate()

  const t = TEXTS[lang]

  const changeLang = (lng) => {
    setLang(lng)
    localStorage.setItem('lang', lng)
  }

  useEffect(() => {
    if (userId) {
      api.get(`/api/parent/${userId}/proches`)
        .then(res => setProches(res.data.data))
        .catch(() => {})
    }
  }, [userId])

  const lierProche = async () => {
    try {
      await api.post(`/api/parent/${userId}/lier?emailProche=${emailProche}`)
      setMessage(t.successMsg)
      setEmailProche('')
      const res = await api.get(`/api/parent/${userId}/proches`)
      setProches(res.data.data)
    } catch {
      setMessage(t.errorMsg)
    }
  }

  return (
    <div className="dp-root">
      <style>{css}</style>
      <DashboardHeader sous_titre={t.subtitle} />

      <div className="dp-content">

        {/* Sélecteur de langue */}
        <div className="dp-lang">
          <button className={`dp-lang-btn${lang === 'fr' ? ' active' : ''}`} onClick={() => changeLang('fr')}>🇫🇷 FR</button>
          <button className={`dp-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => changeLang('en')}>🇬🇧 EN</button>
        </div>

        {/* Lier un proche */}
        <div className="dp-card">
          <p className="dp-section-title">{t.linkTitle}</p>
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            value={emailProche}
            onChange={(e) => setEmailProche(e.target.value)}
            className="dp-input"
          />
          <button onClick={lierProche} className="dp-link-btn">{t.linkBtn}</button>
          {message && <p className="dp-message">{message}</p>}
        </div>

        {/* Liste des proches */}
        <div className="dp-card">
          <p className="dp-section-title">{t.myCloseOnes}</p>
          {proches.length === 0 ? (
            <p className="dp-empty">{t.noProche}</p>
          ) : (
            proches.map((p) => (
              <button key={p.id} onClick={() => navigate(`/parent/gerer/${p.id}`)} className="dp-proche-btn">
                <div className="dp-avatar">{p.nom[0]}</div>
                <div>
                  <p className="dp-proche-name">{p.nom} {p.prenom}</p>
                  <p className="dp-proche-email">{p.email}</p>
                </div>
                <span className="dp-arrow">→</span>
              </button>
            ))
          )}
        </div>

        {/* Suivi émotions */}
        <div className="dp-card">
          <p className="dp-section-title">{t.monitoring}</p>
          {proches.length === 0 ? (
            <p className="dp-empty">{t.noProcheShort}</p>
          ) : (
            proches.map((p) => (
              <div key={p.id} className="dp-monitor-card">
                <p className="dp-monitor-name">{p.nom} {p.prenom}</p>
                <div className="dp-monitor-actions">
                  <button onClick={() => navigate(`/parent/emotions/${p.id}`)} className="dp-monitor-btn">{t.emotions}</button>
                  <button onClick={() => navigate(`/parent/gerer/${p.id}`)} className="dp-monitor-btn">{t.manage}</button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
