import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { clearUser } from '../store/userSlice'

export default function DashboardHeader({ titre, sous_titre }) {
  const { nom } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearUser())
    navigate('/login')
  }

  return (
    <>
      <style>{`
        .dh-root {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 20px 24px 16px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 40;
        }
        .dh-center {
          text-align: center;
        }
        .dh-title {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .dh-subtitle {
          font-size: 13px;
          font-weight: 500;
          margin: 5px 0 0;
          background: linear-gradient(90deg, #667eea, #ee0979, #f7971e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.01em;
        }
        .dh-logout {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          justify-self: end;
        }
        .dh-logout:hover {
          background: rgba(255,255,255,0.13);
          color: rgba(255,255,255,0.85);
        }
      `}</style>
      <div className="dh-root">
        <div />
        <div className="dh-center">
          <h1 className="dh-title">{titre || `Bonjour ${nom} 👋`}</h1>
          {sous_titre && <p className="dh-subtitle">{sous_titre}</p>}
        </div>
        <button onClick={handleLogout} className="dh-logout">
          🚪 Quitter
        </button>
      </div>
    </>
  )
}
