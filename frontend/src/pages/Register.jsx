import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

const TEXTS = {
  fr: {
    title: 'Créer un compte',
    nom: 'Nom',
    prenom: 'Prénom',
    email: 'Email',
    password: 'Mot de passe',
    submit: "S'inscrire",
    success: '✅ Compte créé ! Redirection en cours...',
    error: 'Email déjà utilisé ou erreur serveur',
    hasAccount: 'Déjà un compte ?',
    login: 'Se connecter',
    types: {
      AUTISME: 'Autisme (TSA)',
      MOBILITE_REDUITE: 'Mobilité réduite',
      MALVOYANT: 'Malvoyant',
      SOURD: 'Sourd',
      COGNITIF: 'Cognitif',
      PARENT_AIDANT: 'Parent aidant',
    }
  },
  en: {
    title: 'Create an account',
    nom: 'Last name',
    prenom: 'First name',
    email: 'Email',
    password: 'Password',
    submit: 'Sign up',
    success: '✅ Account created! Redirecting...',
    error: 'Email already used or server error',
    hasAccount: 'Already have an account?',
    login: 'Sign in',
    types: {
      AUTISME: 'Autism (ASD)',
      MOBILITE_REDUITE: 'Reduced mobility',
      MALVOYANT: 'Visually impaired',
      SOURD: 'Deaf',
      COGNITIF: 'Cognitive',
      PARENT_AIDANT: 'Caregiver',
    }
  }
}

const css = `
  .reg-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #0f0c29 0%, #1a1a4e 55%, #24243e 100%);
    display: flex; align-items: center; justify-content: center;
    padding: 24px; position: relative; overflow: hidden;
  }
  .reg-root::before {
    content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(238,9,121,0.13) 0%, transparent 70%);
    top: -150px; right: -150px; pointer-events: none;
  }
  .reg-root::after {
    content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(71,118,230,0.1) 0%, transparent 70%);
    bottom: -100px; left: -100px; pointer-events: none;
  }

  .reg-lang { position: absolute; top: 20px; right: 20px; display: flex; gap: 6px; z-index: 2; }
  .reg-lang-btn {
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.55); font-size: 12px; font-weight: 700;
    padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s, color 0.2s;
  }
  .reg-lang-btn:hover { background: rgba(255,255,255,0.13); color: rgba(255,255,255,0.85); }
  .reg-lang-btn.active { background: linear-gradient(135deg,#ee0979,#ff6a00); color: #fff; border-color: transparent; }

  .reg-card {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px; padding: 36px 32px; width: 100%; max-width: 440px;
    backdrop-filter: blur(10px); position: relative; z-index: 1;
  }

  .reg-title {
    font-size: 26px; font-weight: 800; text-align: center; color: #fff;
    margin: 0 0 24px; letter-spacing: -0.02em;
  }
  .reg-title span {
    background: linear-gradient(90deg, #ee0979, #ff6a00, #f7971e);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .reg-error {
    background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.35);
    color: #fca5a5; font-size: 13px; padding: 10px 14px; border-radius: 10px; margin-bottom: 16px;
  }
  .reg-success {
    background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.35);
    color: #86efac; font-size: 13px; padding: 10px 14px; border-radius: 10px;
    margin-top: 16px; text-align: center;
  }

  .reg-form { display: flex; flex-direction: column; gap: 12px; }

  .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .reg-input, .reg-select {
    width: 100%; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 12px; padding: 13px 15px; color: #fff; font-size: 14px; outline: none;
    transition: border-color 0.2s, background 0.2s; box-sizing: border-box;
  }
  .reg-input::placeholder { color: rgba(255,255,255,0.35); }
  .reg-input:focus, .reg-select:focus { border-color: rgba(238,9,121,0.5); background: rgba(255,255,255,0.09); }

  .reg-select { cursor: pointer; }
  .reg-select option { background: #1a1a4e; color: #fff; }

  .reg-submit {
    width: 100%; border: none; border-radius: 12px; padding: 14px;
    font-size: 15px; font-weight: 700; color: #fff; cursor: pointer;
    background: linear-gradient(135deg, #ee0979, #ff6a00);
    transition: transform 0.15s, box-shadow 0.15s; margin-top: 6px;
  }
  .reg-submit:hover { box-shadow: 0 8px 24px rgba(238,9,121,0.4); transform: translateY(-1px); }
  .reg-submit:active { transform: translateY(0); }

  .reg-footer {
    text-align: center; margin-top: 18px; font-size: 13px; color: rgba(255,255,255,0.4);
  }
  .reg-footer a { color: #fb7185; font-weight: 700; text-decoration: none; }
  .reg-footer a:hover { text-decoration: underline; }
`

export default function Register() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', password: '', handicapType: 'AUTISME'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr')
  const navigate = useNavigate()

  const t = TEXTS[lang]

  const changeLang = (lng) => {
    setLang(lng)
    localStorage.setItem('lang', lng)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/auth/register', form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError(t.error)
    }
  }

  return (
    <div className="reg-root">
      <style>{css}</style>

      <div className="reg-lang">
        <button className={`reg-lang-btn${lang === 'fr' ? ' active' : ''}`} onClick={() => changeLang('fr')}>🇫🇷 FR</button>
        <button className={`reg-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => changeLang('en')}>🇬🇧 EN</button>
      </div>

      <div className="reg-card">
        <h1 className="reg-title"><span>{t.title}</span></h1>

        {error && <div className="reg-error">{error}</div>}

        <form onSubmit={handleSubmit} className="reg-form">
          <div className="reg-row">
            <input
              placeholder={t.nom}
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="reg-input"
            />
            <input
              placeholder={t.prenom}
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              className="reg-input"
            />
          </div>
          <input
            type="email"
            placeholder={t.email}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="reg-input"
          />
          <input
            type="password"
            placeholder={t.password}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="reg-input"
          />
          <select
            value={form.handicapType}
            onChange={(e) => setForm({ ...form, handicapType: e.target.value })}
            className="reg-select"
          >
            {Object.entries(t.types).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button type="submit" className="reg-submit">{t.submit}</button>
        </form>

        {success && <div className="reg-success">{t.success}</div>}

        <p className="reg-footer">
          {t.hasAccount}{' '}
          <Link to="/login">{t.login}</Link>
        </p>
      </div>
    </div>
  )
}
