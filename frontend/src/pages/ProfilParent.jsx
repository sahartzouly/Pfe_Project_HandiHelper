import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const handicapInfo = {
  AUTISME:           { emoji: '🧩', label: { fr: 'Autisme (TSA)',      en: 'Autism (ASD)' },        grad: 'linear-gradient(135deg,#667eea,#764ba2)', glow: 'rgba(102,126,234,0.4)' },
  MOBILITE_REDUITE:  { emoji: '♿', label: { fr: 'Mobilité réduite',    en: 'Reduced mobility' },     grad: 'linear-gradient(135deg,#11998e,#38ef7d)', glow: 'rgba(17,153,142,0.4)' },
  MALVOYANT:         { emoji: '👁️', label: { fr: 'Malvoyant',          en: 'Visually impaired' },    grad: 'linear-gradient(135deg,#f7971e,#ffd200)', glow: 'rgba(247,151,30,0.4)' },
  SOURD:             { emoji: '👂', label: { fr: 'Sourd',              en: 'Deaf' },                 grad: 'linear-gradient(135deg,#ee0979,#ff6a00)', glow: 'rgba(238,9,121,0.4)' },
  COGNITIF:          { emoji: '🧠', label: { fr: 'Cognitif',           en: 'Cognitive' },            grad: 'linear-gradient(135deg,#4776e6,#8e54e9)', glow: 'rgba(71,118,230,0.4)' },
}

const TEXTS = {
  fr: {
    subtitle: 'Choisissez un profil à gérer',
    myParentSpace: 'Mon espace parent',
    manageLoved: 'Gérer mes proches',
    empty: 'Aucun proche lié — allez dans votre espace parent pour en ajouter',
  },
  en: {
    subtitle: 'Choose a profile to manage',
    myParentSpace: 'My parent space',
    manageLoved: 'Manage my loved ones',
    empty: 'No one linked yet — go to your parent space to add someone',
  }
}

const css = `
  .pp-root {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 48px 24px; position: relative; overflow: hidden;
  }
  .pp-root::before {
    content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(247,151,30,0.12) 0%, transparent 70%);
    top: -150px; left: -150px; pointer-events: none;
  }
  .pp-root::after {
    content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%);
    bottom: -100px; right: -100px; pointer-events: none;
  }

  .pp-lang { position: absolute; top: 20px; right: 20px; display: flex; gap: 6px; z-index: 2; }
  .pp-lang-btn {
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.55); font-size: 12px; font-weight: 700;
    padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s, color 0.2s;
  }
  .pp-lang-btn:hover { background: rgba(255,255,255,0.13); color: rgba(255,255,255,0.85); }
  .pp-lang-btn.active { background: linear-gradient(135deg,#f7971e,#ffd200); color: #1a1a1a; border-color: transparent; }

  .pp-header { text-align: center; margin-bottom: 40px; position: relative; z-index: 1; }
  .pp-title { font-size: clamp(24px, 5vw, 34px); font-weight: 800; color: #fff; margin: 0 0 10px; letter-spacing: -0.02em; }
  .pp-subtitle { font-size: 14px; color: rgba(255,255,255,0.45); margin: 0; }

  .pp-list { width: 100%; max-width: 460px; display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1; }

  .pp-card {
    width: 100%; border: 1px solid rgba(255,255,255,0.08); border-radius: 18px;
    padding: 18px 20px; display: flex; align-items: center; gap: 16px;
    cursor: pointer; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px);
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, background 0.22s ease;
    position: relative; overflow: hidden;
  }
  .pp-card::after {
    content: ''; position: absolute; bottom: 0; left: 10%; width: 80%; height: 2px;
    border-radius: 999px; opacity: 0; transition: opacity 0.3s;
  }
  .pp-card:hover::after { opacity: 1; }
  .pp-card:hover { transform: translateY(-4px) scale(1.015); }

  .pp-emoji { font-size: 38px; line-height: 1; flex-shrink: 0; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3)); transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
  .pp-card:hover .pp-emoji { transform: scale(1.15) rotate(-5deg); }

  .pp-name { font-size: 16px; font-weight: 700; color: #fff; margin: 0; text-align: left; }
  .pp-label { font-size: 12px; color: rgba(255,255,255,0.45); margin: 2px 0 0; text-align: left; }
  .pp-arrow { margin-left: auto; color: rgba(255,255,255,0.3); font-size: 18px; }

  .pp-empty {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px; padding: 24px; text-align: center; color: rgba(255,255,255,0.35); font-size: 13px;
  }
`

export default function ProfilParent() {
  const { userId, nom } = useSelector((state) => state.user)
  const [proches, setProches] = useState([])
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

  return (
    <div className="pp-root">
      <style>{css}</style>

      <div className="pp-lang">
        <button className={`pp-lang-btn${lang === 'fr' ? ' active' : ''}`} onClick={() => changeLang('fr')}>🇫🇷 FR</button>
        <button className={`pp-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => changeLang('en')}>🇬🇧 EN</button>
      </div>

      <div className="pp-header">
        <h1 className="pp-title">{lang === 'fr' ? `Bonjour ${nom}` : `Hello ${nom}`} 👋</h1>
        <p className="pp-subtitle">{t.subtitle}</p>
      </div>

      <div className="pp-list">

        {/* Espace parent */}
        <button
          onClick={() => navigate('/dashboard/parent_aidant')}
          className="pp-card"
          style={{ '--accent': '#f7971e' }}
        >
          <span className="pp-emoji">👨‍👧</span>
          <div>
            <p className="pp-name">{t.myParentSpace}</p>
            <p className="pp-label">{t.manageLoved}</p>
          </div>
          <span className="pp-arrow">→</span>
          <style>{`.pp-card[style*="--accent: #f7971e"]:hover { box-shadow: 0 14px 36px rgba(247,151,30,0.35); } .pp-card[style*="--accent: #f7971e"]::after { background: linear-gradient(90deg,#f7971e,#ffd200); }`}</style>
        </button>

        {/* Proches */}
        {proches.map((p) => {
          const info = handicapInfo[p.handicapType] || { emoji: '👤', label: { fr: p.handicapType, en: p.handicapType }, grad: 'linear-gradient(135deg,#6b7280,#9ca3af)', glow: 'rgba(107,114,128,0.4)' }
          return (
            <button
              key={p.id}
              onClick={() => navigate(`/parent/gerer/${p.id}`)}
              className="pp-card"
              style={{ boxShadow: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 14px 36px ${info.glow}` }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
            >
              <span className="pp-emoji">{info.emoji}</span>
              <div>
                <p className="pp-name">{p.nom} {p.prenom}</p>
                <p className="pp-label">{info.label[lang]}</p>
              </div>
              <span className="pp-arrow">→</span>
              <div style={{ position:'absolute', bottom:0, left:'10%', width:'80%', height:'2px', background: info.grad, borderRadius:'999px', opacity: 0 }} />
            </button>
          )
        })}

        {proches.length === 0 && (
          <div className="pp-empty">{t.empty}</div>
        )}

      </div>
    </div>
  )
}
