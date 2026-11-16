import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../store/userSlice'

const profiles = [
  {
    type: 'AUTISME',
    label: 'Autisme (TSA)',
    emoji: '🧩',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadow: 'rgba(102, 126, 234, 0.5)',
    glow: '#667eea',
  },
  {
    type: 'MOBILITE_REDUITE',
    label: 'Mobilité réduite',
    emoji: '♿',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    shadow: 'rgba(17, 153, 142, 0.5)',
    glow: '#11998e',
  },
  {
    type: 'MALVOYANT',
    label: 'Malvoyant',
    emoji: '👁️',
    gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    shadow: 'rgba(247, 151, 30, 0.5)',
    glow: '#f7971e',
  },
  {
    type: 'SOURD',
    label: 'Sourd',
    emoji: '👂',
    gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
    shadow: 'rgba(238, 9, 121, 0.5)',
    glow: '#ee0979',
  },
  {
    type: 'COGNITIF',
    label: 'Cognitif',
    emoji: '🧠',
    gradient: 'linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)',
    shadow: 'rgba(71, 118, 230, 0.5)',
    glow: '#4776e6',
  },
]

export default function ProfileSelection() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSelect = (type) => {
    dispatch(setUser({
      ...JSON.parse(localStorage.getItem('user') || '{}'),
      handicapType: type,
    }))
    navigate(`/dashboard/${type.toLowerCase()}`)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        .ps-root {
          min-height: 100vh;
          background: #0f0c29;
          background: linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Orbes d'ambiance */
        .ps-root::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%);
          top: -150px;
          left: -150px;
          pointer-events: none;
        }
        .ps-root::after {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(238,9,121,0.1) 0%, transparent 70%);
          bottom: -100px;
          right: -100px;
          pointer-events: none;
        }

        .ps-header {
          text-align: center;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }

        .ps-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .ps-title {
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }

        .ps-title span {
          background: linear-gradient(90deg, #667eea, #ee0979, #f7971e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ps-subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.45);
          font-weight: 400;
          margin: 0;
        }

        .ps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 1;
        }

        .ps-card {
          position: relative;
          border: none;
          border-radius: 20px;
          padding: 28px 16px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
        }

        /* Overlay gradient au hover */
        .ps-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 20px;
        }

        .ps-card:hover::before {
          opacity: 1;
        }

        .ps-card:hover {
          transform: translateY(-6px) scale(1.03);
        }

        /* Ligne lumineuse en bas de la carte */
        .ps-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 15%;
          width: 70%;
          height: 2px;
          border-radius: 999px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .ps-card:hover::after {
          opacity: 1;
        }

        /* Styles par carte */
        .ps-card[data-type="AUTISME"]::before { background: linear-gradient(135deg, rgba(102,126,234,0.25), rgba(118,75,162,0.25)); }
        .ps-card[data-type="AUTISME"]::after  { background: linear-gradient(90deg, #667eea, #764ba2); }
        .ps-card[data-type="AUTISME"]:hover   { box-shadow: 0 16px 40px rgba(102,126,234,0.4), 0 0 0 1px rgba(102,126,234,0.3); }

        .ps-card[data-type="MOBILITE_REDUITE"]::before { background: linear-gradient(135deg, rgba(17,153,142,0.25), rgba(56,239,125,0.2)); }
        .ps-card[data-type="MOBILITE_REDUITE"]::after  { background: linear-gradient(90deg, #11998e, #38ef7d); }
        .ps-card[data-type="MOBILITE_REDUITE"]:hover   { box-shadow: 0 16px 40px rgba(17,153,142,0.4), 0 0 0 1px rgba(17,153,142,0.3); }

        .ps-card[data-type="MALVOYANT"]::before { background: linear-gradient(135deg, rgba(247,151,30,0.25), rgba(255,210,0,0.2)); }
        .ps-card[data-type="MALVOYANT"]::after  { background: linear-gradient(90deg, #f7971e, #ffd200); }
        .ps-card[data-type="MALVOYANT"]:hover   { box-shadow: 0 16px 40px rgba(247,151,30,0.4), 0 0 0 1px rgba(247,151,30,0.3); }

        .ps-card[data-type="SOURD"]::before { background: linear-gradient(135deg, rgba(238,9,121,0.25), rgba(255,106,0,0.2)); }
        .ps-card[data-type="SOURD"]::after  { background: linear-gradient(90deg, #ee0979, #ff6a00); }
        .ps-card[data-type="SOURD"]:hover   { box-shadow: 0 16px 40px rgba(238,9,121,0.4), 0 0 0 1px rgba(238,9,121,0.3); }

        .ps-card[data-type="COGNITIF"]::before { background: linear-gradient(135deg, rgba(71,118,230,0.25), rgba(142,84,233,0.25)); }
        .ps-card[data-type="COGNITIF"]::after  { background: linear-gradient(90deg, #4776e6, #8e54e9); }
        .ps-card[data-type="COGNITIF"]:hover   { box-shadow: 0 16px 40px rgba(71,118,230,0.4), 0 0 0 1px rgba(71,118,230,0.3); }

        /* Cognitif — pleine largeur */
        .ps-card--last {
          grid-column: 1 / -1;
          flex-direction: row;
          padding: 22px 32px;
          max-width: 100%;
        }

        .ps-card--last .ps-emoji {
          font-size: 40px;
        }

        .ps-emoji {
          font-size: 48px;
          line-height: 1;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
        }

        .ps-card:hover .ps-emoji {
          transform: scale(1.2) rotate(-5deg);
        }

        .ps-label {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          text-align: center;
          letter-spacing: 0.01em;
          position: relative;
          z-index: 1;
        }

        .ps-card--last .ps-label {
          font-size: 15px;
        }

        @media (max-width: 400px) {
          .ps-grid { grid-template-columns: 1fr; }
          .ps-card--last { grid-column: 1; flex-direction: column; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ps-card, .ps-emoji { transition: none; }
        }
      `}</style>

      <div className="ps-root">
        <div className="ps-header">
          <div className="ps-badge">✦ HandiHelper</div>
          <h1 className="ps-title">
            Quel est votre <span>profil ?</span>
          </h1>
          <p className="ps-subtitle">Choisissez pour personnaliser votre expérience</p>
        </div>

        <div className="ps-grid">
          {profiles.map((p, i) => (
            <button
              key={p.type}
              data-type={p.type}
              onClick={() => handleSelect(p.type)}
              className={`ps-card${i === profiles.length - 1 ? ' ps-card--last' : ''}`}
              aria-label={p.label}
            >
              <span className="ps-emoji" role="img" aria-hidden="true">{p.emoji}</span>
              <span className="ps-label">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
