import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const emotionsList = [
  { value: 'HEUREUX', emoji: '😊' },
  { value: 'TRISTE', emoji: '😢' },
  { value: 'ANXIEUX', emoji: '😰' },
  { value: 'CALME', emoji: '😌' },
  { value: 'EN_COLERE', emoji: '😠' },
  { value: 'FATIGUE', emoji: '😴' },
]

export default function ParentEmotions() {
  const { procheId } = useParams()
  const navigate = useNavigate()
  const [emotions, setEmotions] = useState([])
  const [ setProfileId] = useState(null)
  const [ setProche] = useState(null)

  useEffect(() => {
    api.get(`/api/profile/user/${procheId}`)
      .then(res => {
        const pid = res.data.data.id
        setProfileId(pid)
        setProche(res.data.data)
        api.get(`/api/emotions/${pid}`)
          .then(r => setEmotions(r.data.data))
          .catch(() => {})
      })
      .catch(() => {})
  }, [procheId])

  // Compter les émotions
  const emotionStats = emotionsList.map(e => ({
    ...e,
    count: emotions.filter(em => em.emotion === e.value).length
  })).filter(e => e.count > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 px-4 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Suivi émotions</h1>
          <p className="text-gray-500 text-sm">Historique de votre proche</p>
        </div>
      </div>

      {/* Stats émotions */}
      {emotionStats.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">📊 Résumé</h2>
          <div className="grid grid-cols-3 gap-3">
            {emotionStats.map((e) => (
              <div key={e.value}
                className="bg-orange-50 rounded-2xl p-3 flex flex-col items-center gap-1">
                <span className="text-3xl">{e.emoji}</span>
                <span className="text-2xl font-bold text-orange-500">{e.count}</span>
                <span className="text-xs text-gray-500 text-center">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">📅 Historique</h2>
        {emotions.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Aucune émotion enregistrée</p>
        ) : (
          <div className="space-y-2">
            {emotions.map((e) => {
              const found = emotionsList.find(el => el.value === e.emotion)
              return (
                <div key={e.id}
                  className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                  <span className="text-2xl">{found?.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{e.emotion}</p>
                    {e.note && <p className="text-xs text-gray-400">"{e.note}"</p>}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(e.dateHeure).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'short',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}