import { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axios'

export default function BoutonSOS() {
  const { userId } = useSelector((state) => state.user)
  const [sent, setSent] = useState(false)

  const sendSOS = async () => {
    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await api.post(`/api/sos/alert/${userId}`, {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            message: "Alerte SOS — besoin d'aide immédiat"
          })
          setSent(true)
          setTimeout(() => setSent(false), 3000)
        },
        async () => {
          // Si géolocalisation refusée
          await api.post(`/api/sos/alert/${userId}`, {
            latitude: 0,
            longitude: 0,
            message: "Alerte SOS — besoin d'aide immédiat"
          })
          setSent(true)
          setTimeout(() => setSent(false), 3000)
        }
      )
    } catch (e) {
      console.error('Error sending SOS:', e)
    }
  }

  return (
    <button
      onClick={sendSOS}
      className={`fixed bottom-6 right-6 text-white font-bold text-xl w-20 h-20 rounded-full shadow-2xl flex flex-col items-center justify-center transition-all ${
        sent ? 'bg-green-500 scale-110' : 'bg-red-500 hover:bg-red-600 animate-pulse'
      }`}
    >
      {sent ? '✅' : '🆘'}
      <span className="text-xs mt-1">{sent ? 'Envoyé!' : 'SOS'}</span>
    </button>
  )
}