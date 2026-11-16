import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { setToken } from '../store/authSlice'
import { setUser } from '../store/userSlice'
import api from '../api/axios'

const TEXTS = {
  fr: {
    email: 'Email',
    password: 'Mot de passe',
    submit: 'Se connecter',
    noAccount: 'Pas de compte ?',
    signup: "S'inscrire",
    error: 'Email ou mot de passe incorrect',
  },
  en: {
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
    noAccount: "Don't have an account?",
    signup: 'Sign up',
    error: 'Incorrect email or password',
  }
}

const css = `
  .login-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #0f0c29 0%, #1a1a4e 55%, #24243e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }
  .login-root::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%);
    top: -150px; left: -150px; pointer-events: none;
  }
  .login-root::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(238,9,121,0.1) 0%, transparent 70%);
    bottom: -100px; right: -100px; pointer-events: none;
  }

  .login-lang {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    gap: 6px;
    z-index: 2;
  }
  .login-lang-btn {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.55);
    font-size: 12px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .login-lang-btn:hover { background: rgba(255,255,255,0.13); color: rgba(255,255,255,0.85); }
  .login-lang-btn.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #fff;
    border-color: transparent;
  }

  .login-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    padding: 40px 36px;
    width: 100%;
    max-width: 420px;
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 1;
  }

  .login-title {
    font-size: 28px;
    font-weight: 800;
    text-align: center;
    color: #fff;
    margin: 0 0 28px;
    letter-spacing: -0.02em;
  }
  .login-title span {
    background: linear-gradient(90deg, #667eea, #ee0979, #f7971e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .login-error {
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.35);
    color: #fca5a5;
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 10px;
    margin-bottom: 16px;
  }

  .login-form { display: flex; flex-direction: column; gap: 14px; }

  .login-input {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 14px 16px;
    color: #fff;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .login-input::placeholder { color: rgba(255,255,255,0.35); }
  .login-input:focus { border-color: rgba(102,126,234,0.6); background: rgba(255,255,255,0.09); }

  .login-submit {
    width: 100%;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    background: linear-gradient(135deg, #667eea, #764ba2);
    transition: transform 0.15s, box-shadow 0.15s;
    margin-top: 6px;
  }
  .login-submit:hover { box-shadow: 0 8px 24px rgba(102,126,234,0.4); transform: translateY(-1px); }
  .login-submit:active { transform: translateY(0); }

  .login-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: rgba(255,255,255,0.4);
  }
  .login-footer a {
    color: #818cf8;
    font-weight: 700;
    text-decoration: none;
  }
  .login-footer a:hover { text-decoration: underline; }
`

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const t = TEXTS[lang]

  const changeLang = (lng) => {
    setLang(lng)
    localStorage.setItem('lang', lng)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const data = res.data.data
      dispatch(setToken(data.accessToken))
      dispatch(setUser({
        userId: data.userId,
        profileId: data.profileId,
        nom: data.nom,
        handicapType: data.handicapType,
        role: data.role,
      }))
      if (data.role === 'ROLE_PARENT') {
        navigate('/profil-parent')
      } else {
        navigate('/profil')
      }
    } catch {
      setError(t.error)
    }
  }

  return (
    <div className="login-root">
      <style>{css}</style>

      {/* Sélecteur de langue */}
      <div className="login-lang">
        <button
          className={`login-lang-btn${lang === 'fr' ? ' active' : ''}`}
          onClick={() => changeLang('fr')}
        >
          🇫🇷 FR
        </button>
        <button
          className={`login-lang-btn${lang === 'en' ? ' active' : ''}`}
          onClick={() => changeLang('en')}
        >
          🇬🇧 EN
        </button>
      </div>

      <div className="login-card">
        <h1 className="login-title">
          <span>HandiHelper</span> 👋
        </h1>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-submit">
            {t.submit}
          </button>
        </form>

        <p className="login-footer">
          {t.noAccount}{' '}
          <Link to="/register">{t.signup}</Link>
        </p>
      </div>
    </div>
  )
}
