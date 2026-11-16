import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const css = `
  .gp-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #0f0c29 0%, #1a1a4e 55%, #24243e 100%);
    display: flex; flex-direction: column; align-items: center;
    padding: 24px 16px 48px; position: relative; overflow: hidden;
  }
  .gp-root::before {
    content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(238,9,121,0.13) 0%, transparent 70%);
    top: -150px; right: -150px; pointer-events: none;
  }
  .gp-root::after {
    content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(71,118,230,0.1) 0%, transparent 70%);
    bottom: -100px; left: -100px; pointer-events: none;
  }

  .gp-inner {
    width: 100%; max-width: 480px; position: relative; z-index: 1;
  }

  /* Header */
  .gp-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
  }
  .gp-back {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
    color: #fff; font-size: 18px; width: 40px; height: 40px; border-radius: 12px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .gp-back:hover { background: rgba(255,255,255,0.14); }
  .gp-header-text h1 {
    font-size: 22px; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.02em;
  }
  .gp-header-text h1 span {
    background: linear-gradient(90deg, #ee0979, #ff6a00, #f7971e);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .gp-header-text p { font-size: 13px; color: rgba(255,255,255,0.4); margin: 2px 0 0; }

  /* Tabs */
  .gp-tabs {
    display: flex; gap: 8px; margin-bottom: 20px;
  }
  .gp-tab {
    flex: 1; padding: 12px; border-radius: 14px; font-size: 14px; font-weight: 700;
    cursor: pointer; border: 1.5px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.45);
    transition: all 0.2s;
  }
  .gp-tab:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.7); }
  .gp-tab.active {
    background: linear-gradient(135deg, #ee0979, #ff6a00);
    color: #fff; border-color: transparent;
    box-shadow: 0 4px 16px rgba(238,9,121,0.3);
  }

  /* Card */
  .gp-card {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px; padding: 24px; backdrop-filter: blur(10px);
  }
  .gp-card-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;
  }
  .gp-card-title {
    font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.8);
  }
  .gp-add-btn {
    width: 34px; height: 34px; border-radius: 10px; border: none; cursor: pointer;
    font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #ee0979, #ff6a00);
    color: #fff; transition: transform 0.15s, box-shadow 0.15s;
  }
  .gp-add-btn:hover { box-shadow: 0 4px 14px rgba(238,9,121,0.4); transform: translateY(-1px); }

  /* Add form */
  .gp-form {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 16px; margin-bottom: 16px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .gp-input {
    width: 100%; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 12px; padding: 11px 14px; color: #fff; font-size: 14px; outline: none;
    transition: border-color 0.2s, background 0.2s; box-sizing: border-box;
  }
  .gp-input::placeholder { color: rgba(255,255,255,0.3); }
  .gp-input:focus { border-color: rgba(238,9,121,0.5); background: rgba(255,255,255,0.09); }
  .gp-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .gp-submit {
    width: 100%; border: none; border-radius: 12px; padding: 12px;
    font-size: 14px; font-weight: 700; color: #fff; cursor: pointer;
    background: linear-gradient(135deg, #ee0979, #ff6a00);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .gp-submit:hover { box-shadow: 0 6px 20px rgba(238,9,121,0.4); transform: translateY(-1px); }
  .gp-submit:active { transform: translateY(0); }

  /* Items */
  .gp-list { display: flex; flex-direction: column; gap: 10px; }
  .gp-item {
    display: flex; align-items: center; gap: 14px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 14px 16px;
    transition: background 0.2s;
  }
  .gp-item:hover { background: rgba(255,255,255,0.08); }
  .gp-item-icon { font-size: 28px; flex-shrink: 0; }
  .gp-item-body { flex: 1; min-width: 0; }
  .gp-item-title { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.9); margin: 0 0 2px; }
  .gp-item-sub { font-size: 12px; color: rgba(255,255,255,0.4); margin: 0; }
  .gp-delete {
    background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.2);
    color: #fca5a5; font-size: 16px; width: 34px; height: 34px; border-radius: 10px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .gp-delete:hover { background: rgba(239,68,68,0.25); }

  /* Empty */
  .gp-empty {
    text-align: center; padding: 32px 0;
    color: rgba(255,255,255,0.25); font-size: 14px;
  }
  .gp-empty-icon { font-size: 36px; margin-bottom: 8px; opacity: 0.4; }
`

export default function GererProche() {
  const { procheId } = useParams()
  const navigate = useNavigate()
  const [routines, setRoutines] = useState([])
  const [medications, setMedications] = useState([])
  const [profileId, setProfileId] = useState(null)
  const [activeTab, setActiveTab] = useState('routines')
  const [showAddRoutine, setShowAddRoutine] = useState(false)
  const [showAddMed, setShowAddMed] = useState(false)

  const [newRoutine, setNewRoutine] = useState({
    titre: '', description: '', icone: '⭐',
    heureDebut: '08:00:00', dureeMinutes: 5, ordre: 1, active: true,
  })
  const [newMed, setNewMed] = useState({
    nom: '', dosage: '', horaires: '', instructions: '',
  })

  useEffect(() => {
    api.get(`/api/profile/user/${procheId}`)
      .then(res => {
        const pid = res.data.data.id
        setProfileId(pid)
        api.get(`/api/routines/${pid}`).then(r => setRoutines(r.data.data)).catch(() => {})
        api.get(`/api/medications/${pid}`).then(r => setMedications(r.data.data)).catch(() => {})
      })
      .catch(() => {})
  }, [procheId])

  const loadData = (pid) => {
    const id = pid || profileId
    if (!id) return
    api.get(`/api/routines/${id}`).then(r => setRoutines(r.data.data)).catch(() => {})
    api.get(`/api/medications/${id}`).then(r => setMedications(r.data.data)).catch(() => {})
  }

  const addRoutine = async () => {
    try {
      await api.post(`/api/routines/${profileId}`, newRoutine)
      setShowAddRoutine(false)
      setNewRoutine({ titre: '', description: '', icone: '⭐', heureDebut: '08:00:00', dureeMinutes: 5, ordre: 1, active: true })
      loadData()
    } catch (e) { console.error(e) }
  }

  const deleteRoutine = async (id) => {
    try { await api.delete(`/api/routines/${id}`); loadData() } catch (e) { console.error(e) }
  }

  const addMedication = async () => {
    try {
      await api.post(`/api/medications/${profileId}`, newMed)
      setShowAddMed(false)
      setNewMed({ nom: '', dosage: '', horaires: '', instructions: '' })
      loadData()
    } catch (e) { console.error(e) }
  }

  const deleteMedication = async (id) => {
    try { await api.delete(`/api/medications/${id}`); loadData() } catch (e) { console.error(e) }
  }

  return (
    <div className="gp-root">
      <style>{css}</style>

      <div className="gp-inner">

        {/* Header */}
        <div className="gp-header">
          <button className="gp-back" onClick={() => navigate(-1)}>←</button>
          <div className="gp-header-text">
            <h1>Gestion du <span>proche</span></h1>
            <p>Routines et médicaments</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="gp-tabs">
          <button
            className={`gp-tab${activeTab === 'routines' ? ' active' : ''}`}
            onClick={() => setActiveTab('routines')}
          >
            🧩 Routines
          </button>
          <button
            className={`gp-tab${activeTab === 'medications' ? ' active' : ''}`}
            onClick={() => setActiveTab('medications')}
          >
            💊 Médicaments
          </button>
        </div>

        {/* ── Routines ── */}
        {activeTab === 'routines' && (
          <div className="gp-card">
            <div className="gp-card-header">
              <span className="gp-card-title">Routines</span>
              <button className="gp-add-btn" onClick={() => setShowAddRoutine(!showAddRoutine)}>
                {showAddRoutine ? '✕' : '+'}
              </button>
            </div>

            {showAddRoutine && (
              <div className="gp-form">
                <input
                  className="gp-input" placeholder="Titre"
                  value={newRoutine.titre}
                  onChange={e => setNewRoutine({ ...newRoutine, titre: e.target.value })}
                />
                <input
                  className="gp-input" placeholder="Description"
                  value={newRoutine.description}
                  onChange={e => setNewRoutine({ ...newRoutine, description: e.target.value })}
                />
                <div className="gp-row">
                  <input
                    className="gp-input" placeholder="Icône"
                    value={newRoutine.icone}
                    onChange={e => setNewRoutine({ ...newRoutine, icone: e.target.value })}
                  />
                  <input
                    type="time" className="gp-input"
                    value={newRoutine.heureDebut.slice(0, 5)}
                    onChange={e => setNewRoutine({ ...newRoutine, heureDebut: e.target.value + ':00' })}
                  />
                  <input
                    type="number" className="gp-input" placeholder="Min"
                    value={newRoutine.dureeMinutes}
                    onChange={e => setNewRoutine({ ...newRoutine, dureeMinutes: parseInt(e.target.value) })}
                  />
                </div>
                <button className="gp-submit" onClick={addRoutine}>➕ Ajouter la routine</button>
              </div>
            )}

            {routines.length === 0 ? (
              <div className="gp-empty">
                <div className="gp-empty-icon">🧩</div>
                <p>Aucune routine pour ce proche</p>
              </div>
            ) : (
              <div className="gp-list">
                {routines.map(r => (
                  <div key={r.id} className="gp-item">
                    <span className="gp-item-icon">{r.icone}</span>
                    <div className="gp-item-body">
                      <p className="gp-item-title">{r.titre}</p>
                      <p className="gp-item-sub">{r.heureDebut} — {r.dureeMinutes} min</p>
                    </div>
                    <button className="gp-delete" onClick={() => deleteRoutine(r.id)}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Médicaments ── */}
        {activeTab === 'medications' && (
          <div className="gp-card">
            <div className="gp-card-header">
              <span className="gp-card-title">Médicaments</span>
              <button className="gp-add-btn" onClick={() => setShowAddMed(!showAddMed)}>
                {showAddMed ? '✕' : '+'}
              </button>
            </div>

            {showAddMed && (
              <div className="gp-form">
                <input
                  className="gp-input" placeholder="Nom du médicament"
                  value={newMed.nom}
                  onChange={e => setNewMed({ ...newMed, nom: e.target.value })}
                />
                <input
                  className="gp-input" placeholder="Dosage (ex: 500mg)"
                  value={newMed.dosage}
                  onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                />
                <input
                  className="gp-input" placeholder="Horaires (ex: 08:00, 20:00)"
                  value={newMed.horaires}
                  onChange={e => setNewMed({ ...newMed, horaires: e.target.value })}
                />
                <input
                  className="gp-input" placeholder="Instructions"
                  value={newMed.instructions}
                  onChange={e => setNewMed({ ...newMed, instructions: e.target.value })}
                />
                <button className="gp-submit" onClick={addMedication}>➕ Ajouter le médicament</button>
              </div>
            )}

            {medications.length === 0 ? (
              <div className="gp-empty">
                <div className="gp-empty-icon">💊</div>
                <p>Aucun médicament pour ce proche</p>
              </div>
            ) : (
              <div className="gp-list">
                {medications.map(m => (
                  <div key={m.id} className="gp-item">
                    <span className="gp-item-icon">💊</span>
                    <div className="gp-item-body">
                      <p className="gp-item-title">{m.nom}</p>
                      <p className="gp-item-sub">{m.dosage} — {m.horaires}</p>
                    </div>
                    <button className="gp-delete" onClick={() => deleteMedication(m.id)}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
