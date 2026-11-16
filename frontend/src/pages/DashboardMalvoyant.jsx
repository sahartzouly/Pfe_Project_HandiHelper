import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import DashboardHeader from '../components/DashboardHeader'
import BoutonSOS from '../components/BoutonSOS'

// ─────────────────────────────────────────
// Synthèse vocale
// ─────────────────────────────────────────
const speak = (text, rate = 0.9) => {
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  utterance.rate = rate
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

// Tailles de police disponibles (multiplicateur)
const FONT_SIZES = [
  { key: 'normal', label: 'A', scale: 1 },
  { key: 'grand',  label: 'A+', scale: 1.25 },
  { key: 'xgrand', label: 'A++', scale: 1.55 },
]

export default function DashboardMalvoyant() {
  const { profileId, nom } = useSelector((state) => state.user)
  const [medications, setMedications] = useState([])
  const [routines, setRoutines] = useState([])
  const [contacts, setContacts] = useState([])
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [reponse, setReponse] = useState('')
  const [fontSize, setFontSize] = useState('normal')
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    if (profileId) {
      api.get(`/api/medications/${profileId}`).then(res => setMedications(res.data.data)).catch(() => {})
      api.get(`/api/routines/${profileId}`).then(res => setRoutines(res.data.data)).catch(() => {})
      api.get(`/api/contacts/${profileId}`).then(res => setContacts(res.data.data)).catch(() => {})
    }
    setTimeout(() => {
      speak(`Bonjour ${nom}. Bienvenue sur HandiHelper. Appuyez sur le bouton microphone pour parler, ou appuyez sur un élément pour l'entendre.`)
    }, 1000)
  }, [profileId, nom])

  // ── Reconnaissance vocale ──
  const handleVoiceCommand = useCallback((text) => {
    if (text.includes('routine') || text.includes('tâche')) {
      const msg = routines.length === 0
        ? "Vous n'avez aucune routine pour aujourd'hui."
        : `Vous avez ${routines.length} routines : ${routines.map(r => r.titre).join(', ')}`
      setReponse(msg); speak(msg)
    } else if (text.includes('médicament') || text.includes('medicament')) {
      const msg = medications.length === 0
        ? "Vous n'avez aucun médicament."
        : `Vos médicaments sont : ${medications.map(m => `${m.nom}, ${m.dosage}`).join('. ')}`
      setReponse(msg); speak(msg)
    } else if (text.includes('contact') || text.includes('appel') || text.includes('urgence')) {
      const msg = contacts.length === 0
        ? "Vous n'avez aucun contact d'urgence."
        : `Vos contacts sont : ${contacts.map(c => c.nom).join(', ')}`
      setReponse(msg); speak(msg)
    } else if (text.includes('heure')) {
      const msg = `Il est ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
      setReponse(msg); speak(msg)
    } else if (text.includes('date') || text.includes('jour')) {
      const msg = `Nous sommes le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`
      setReponse(msg); speak(msg)
    } else if (text.includes('agrandir') || text.includes('plus grand') || text.includes('police')) {
      setFontSize(prev => {
        const idx = FONT_SIZES.findIndex(f => f.key === prev)
        const next = FONT_SIZES[Math.min(idx + 1, FONT_SIZES.length - 1)]
        speak(`Taille de texte : ${next.key === 'xgrand' ? 'très grande' : next.key === 'grand' ? 'grande' : 'normale'}`)
        return next.key
      })
    } else if (text.includes('contraste')) {
      setHighContrast(prev => {
        speak(prev ? 'Contraste normal activé' : 'Contraste élevé activé')
        return !prev
      })
    } else if (text.includes('bonjour') || text.includes('salut')) {
      const msg = `Bonjour ${nom}, comment puis-je vous aider ?`
      setReponse(msg); speak(msg)
    } else if (text.includes('sos') || text.includes('secours')) {
      const msg = 'Activation du bouton SOS !'
      setReponse(msg); speak(msg)
      document.getElementById('btn-sos-malvoyant')?.click()
    } else {
      const msg = "Je n'ai pas compris. Vous pouvez demander vos routines, médicaments, contacts, l'heure ou la date."
      setReponse(msg); speak(msg)
    }
  }, [routines, medications, contacts, nom])

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      speak("La reconnaissance vocale n'est pas disponible sur ce navigateur.")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.continuous = false
    setListening(true)
    speak('Je vous écoute...')
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase()
      setTranscript(text)
      handleVoiceCommand(text)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => { setListening(false); speak("Je n'ai pas compris, veuillez réessayer.") }
    recognition.start()
  }

  const scale = FONT_SIZES.find(f => f.key === fontSize)?.scale || 1

  // Palette selon contraste
  const palette = highContrast
    ? { bg: '#000000', card: '#0a0a0a', cardBorder: '#ffeb3b', text: '#ffffff', accent: '#ffeb3b', accentSoft: '#1a1a00', muted: '#cccccc' }
    : { bg: 'linear-gradient(135deg,#fffbea,#fef3c7)', card: '#ffffff', cardBorder: '#fde68a', text: '#374151', accent: '#f59e0b', accentSoft: '#fef3c7', muted: '#9ca3af' }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: palette.bg,
        padding: '24px 16px',
        fontSize: `${scale}rem`,
        transition: 'background 0.3s, font-size 0.2s',
      }}
    >
      <DashboardHeader sous_titre="Votre espace adapté" />

      {/* ── Barre d'accessibilité ── */}
      <div
        style={{
          background: palette.card,
          border: `2px solid ${palette.cardBorder}`,
          borderRadius: '20px',
          padding: '16px 20px',
          marginTop: '20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2em', fontWeight: 700, color: palette.text }}>Taille du texte</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {FONT_SIZES.map(f => (
              <button
                key={f.key}
                onClick={() => { setFontSize(f.key); speak(`Taille ${f.label}`) }}
                style={{
                  border: `2px solid ${fontSize === f.key ? palette.accent : palette.cardBorder}`,
                  background: fontSize === f.key ? palette.accent : 'transparent',
                  color: fontSize === f.key ? '#000' : palette.text,
                  fontWeight: 800,
                  borderRadius: '10px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontSize: '1em',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setHighContrast(p => !p); speak(highContrast ? 'Contraste normal' : 'Contraste élevé activé') }}
          style={{
            border: `2px solid ${palette.accent}`,
            background: highContrast ? palette.accent : 'transparent',
            color: highContrast ? '#000' : palette.text,
            fontWeight: 800,
            borderRadius: '10px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '1em',
          }}
        >
          {highContrast ? '☀️ Contraste normal' : '🌓 Contraste élevé'}
        </button>
      </div>

      {/* ── Microphone principal ── */}
      <div
        style={{
          background: palette.card,
          border: `2px solid ${palette.cardBorder}`,
          borderRadius: '28px',
          padding: '28px 20px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '1.3em', color: palette.text, marginBottom: '20px', fontWeight: 600 }}>
          Appuyez pour parler
        </p>
        <button
          onClick={startListening}
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            fontSize: '3.2em',
            border: 'none',
            cursor: 'pointer',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: listening ? '#ef4444' : palette.accent,
            boxShadow: listening
              ? '0 0 0 12px rgba(239,68,68,0.25)'
              : `0 8px 24px ${highContrast ? 'rgba(255,235,59,0.4)' : 'rgba(245,158,11,0.4)'}`,
            transform: listening ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.25s ease',
          }}
        >
          🎤
        </button>

        {transcript && (
          <p style={{ marginTop: '18px', fontSize: '1.15em', color: palette.muted }}>
            Vous : <span style={{ fontWeight: 700, color: palette.text }}>"{transcript}"</span>
          </p>
        )}
        {reponse && (
          <div style={{ marginTop: '14px', background: palette.accentSoft, borderRadius: '16px', padding: '16px' }}>
            <p style={{ fontSize: '1.2em', color: palette.text, margin: 0 }}>🔊 {reponse}</p>
          </div>
        )}

        {/* Astuce commandes vocales */}
        <p style={{ marginTop: '16px', fontSize: '0.85em', color: palette.muted }}>
          💡 Essayez : "mes routines", "mes médicaments", "quelle heure est-il", "agrandir le texte", "contraste"
        </p>
      </div>

      {/* ── Routines ── */}
      <Section title="🌅 Routines" palette={palette}>
        {routines.length === 0 ? (
          <Empty palette={palette} text="Aucune routine" />
        ) : (
          routines.map((r) => (
            <ActionRow
              key={r.id}
              icon={r.icone || '📌'}
              title={r.titre}
              subtitle={`${r.heureDebut} — ${r.dureeMinutes} min`}
              palette={palette}
              onClick={() => speak(`${r.titre}. Heure : ${r.heureDebut}. Durée : ${r.dureeMinutes} minutes.`)}
            />
          ))
        )}
      </Section>

      {/* ── Médicaments ── */}
      <Section title="💊 Médicaments" palette={palette}>
        {medications.length === 0 ? (
          <Empty palette={palette} text="Aucun médicament" />
        ) : (
          medications.map((m) => (
            <ActionRow
              key={m.id}
              icon="💊"
              title={m.nom}
              subtitle={`${m.dosage} — ${m.horaires}`}
              palette={palette}
              onClick={() => speak(`${m.nom}. Dosage : ${m.dosage}. Horaires : ${m.horaires}. Instructions : ${m.instructions}`)}
            />
          ))
        )}
      </Section>

      {/* ── Contacts ── */}
      <Section title="📞 Contacts urgence" palette={palette} last>
        {contacts.length === 0 ? (
          <Empty palette={palette} text="Aucun contact" />
        ) : (
          contacts.map((c) => (
            <a
              key={c.id}
              href={`tel:${c.telephone}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: palette.accentSoft,
                borderRadius: '18px',
                padding: '18px',
                marginBottom: '10px',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '2em' }}>📞</span>
              <div>
                <p style={{ fontSize: '1.15em', fontWeight: 700, color: palette.text, margin: 0 }}>{c.nom}</p>
                <p style={{ fontSize: '1em', color: palette.muted, margin: 0 }}>{c.telephone}</p>
              </div>
              <span style={{ marginLeft: 'auto', color: palette.accent, fontSize: '1.5em' }}>→</span>
            </a>
          ))
        )}
      </Section>

      <div id="btn-sos-malvoyant">
        <BoutonSOS />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Sous-composants
// ─────────────────────────────────────────
function Section({ title, palette, children, last }) {
  return (
    <div
      style={{
        background: palette.card,
        border: `2px solid ${palette.cardBorder}`,
        borderRadius: '24px',
        padding: '22px 20px',
        marginBottom: last ? '90px' : '20px',
      }}
    >
      <h2 style={{ fontSize: '1.4em', fontWeight: 700, color: palette.text, marginBottom: '16px', marginTop: 0 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function Empty({ palette, text }) {
  return <p style={{ fontSize: '1.1em', color: palette.muted, textAlign: 'center', padding: '16px 0' }}>{text}</p>
}

function ActionRow({ icon, title, subtitle, palette, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: palette.accentSoft,
        border: 'none',
        borderRadius: '18px',
        padding: '18px',
        marginBottom: '10px',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: '2em' }}>{icon}</span>
      <div>
        <p style={{ fontSize: '1.15em', fontWeight: 700, color: palette.text, margin: 0 }}>{title}</p>
        <p style={{ fontSize: '1em', color: palette.muted, margin: 0 }}>{subtitle}</p>
      </div>
      <span style={{ marginLeft: 'auto', fontSize: '1.5em' }}>🔊</span>
    </button>
  )
}
