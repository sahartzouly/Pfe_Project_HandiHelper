import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    emoji: '🤝',
    title: 'HandiHelper',
    description: 'Votre assistant du quotidien, conçu pour vous et adapté à vos besoins spécifiques.',
    bg: 'from-blue-500 to-purple-600',
  },
  {
    emoji: '🧩',
    title: 'Adapté à chaque profil',
    description: 'Que vous soyez TSA, malvoyant, sourd ou à mobilité réduite, HandiHelper s\'adapte à vous avec une interface personnalisée.',
    bg: 'from-purple-500 to-pink-500',
  },
  {
    emoji: '🚨',
    title: 'Toujours là pour vous',
    description: 'Bouton SOS, routines quotidiennes, gestion des médicaments et lieux accessibles — tout en un seul endroit.',
    bg: 'from-pink-500 to-orange-400',
  },
]

export default function Intro() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slides[current].bg} flex flex-col items-center justify-between py-16 px-6 transition-all duration-500`}>

      {/* Skip button */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => navigate('/login')}
          className="text-white/70 hover:text-white text-sm font-medium"
        >
          Skip →
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-9xl mb-8">{slides[current].emoji}</div>
        <h1 className="text-4xl font-bold text-white mb-4">{slides[current].title}</h1>
        <p className="text-lg text-white/80 max-w-md leading-relaxed">{slides[current].description}</p>
      </div>

      {/* Dots */}
      <div className="flex space-x-3 mb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-white' : 'w-3 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="w-full max-w-sm flex gap-3">
        {current > 0 && (
          <button
            onClick={() => setCurrent(current - 1)}
            className="flex-1 bg-white/20 text-white font-bold py-4 rounded-2xl text-lg hover:bg-white/30 transition-all duration-200"
          >
            ← Retour
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 bg-white text-gray-800 font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          {current < slides.length - 1 ? 'Suivant →' : 'Commencer 🚀'}
        </button>
      </div>

    </div>
  )
}