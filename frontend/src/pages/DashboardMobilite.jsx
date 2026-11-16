import { useEffect, useState, useRef } from 'react'
import DashboardHeader from '../components/DashboardHeader'
import BoutonSOS from '../components/BoutonSOS'
import api from '../api/axios'

const FAVORITES = [
  { id: 'fav-1', nom: 'Maison',     icone: '🏠', adresse: 'Mon domicile',         latitude: 33.5900, longitude: -7.6030 },
  { id: 'fav-2', nom: 'Hôpital',    icone: '🏥', adresse: 'Ibn Rochd, Casablanca', latitude: 33.5892, longitude: -7.6031 },
  { id: 'fav-3', nom: 'Pharmacie',  icone: '💊', adresse: 'Pharmacie centrale',    latitude: 33.5753, longitude: -7.5892 },
  { id: 'fav-4', nom: 'Mosquée',    icone: '🕌', adresse: 'Mosquée Hassan II',     latitude: 33.6084, longitude: -7.6325 },
  { id: 'fav-5', nom: 'Gare',       icone: '🚉', adresse: 'Casa-Port',             latitude: 33.6005, longitude: -7.6205 },
  { id: 'fav-6', nom: 'Marché',     icone: '🛒', adresse: 'Marché central',        latitude: 33.5940, longitude: -7.6100 },
]

const css = `
  .mob-root { min-height:100vh; background:linear-gradient(160deg,#0f0c29 0%,#1a1a4e 55%,#24243e 100%); }
  .mob-content { max-width:680px; margin:0 auto; padding:20px 16px 100px; display:flex; flex-direction:column; gap:16px; }

  .mob-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:20px; overflow:hidden; }
  .mob-card-header { padding:16px 18px 12px; display:flex; align-items:center; justify-content:space-between; }
  .mob-section-title { font-size:14px; font-weight:700; color:rgba(255,255,255,0.85); margin:0; display:flex; align-items:center; gap:8px; }

  /* ── MAP ── */
  .mob-map-wrap { position:relative; width:100%; height:320px; background:#1a2744; }
  #mob-map { width:100%; height:100%; }
  .mob-map-badge {
    position:absolute; top:10px; right:10px; z-index:999;
    background:rgba(15,12,41,0.85); border:1px solid rgba(255,255,255,0.12);
    color:rgba(255,255,255,0.6); font-size:11px; font-weight:600;
    padding:5px 10px; border-radius:8px; backdrop-filter:blur(6px);
  }

  /* ── FAVORIS ── */
  .mob-favs { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; padding:0 16px 16px; }
  .mob-fav-btn {
    background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.09);
    border-radius:14px; padding:14px 8px; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:7px;
    transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s, background 0.22s;
    position:relative; overflow:hidden;
  }
  .mob-fav-btn:hover { transform:translateY(-4px) scale(1.04); background:rgba(56,189,248,0.12); box-shadow:0 10px 28px rgba(56,189,248,0.3); }
  .mob-fav-btn::after { content:''; position:absolute; bottom:0; left:15%; width:70%; height:2px; background:linear-gradient(90deg,#38bdf8,#818cf8); border-radius:999px; opacity:0; transition:opacity 0.3s; }
  .mob-fav-btn:hover::after { opacity:1; }
  .mob-fav-icon { font-size:28px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.3)); transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
  .mob-fav-btn:hover .mob-fav-icon { transform:scale(1.2) rotate(-5deg); }
  .mob-fav-label { font-size:11px; font-weight:700; color:rgba(255,255,255,0.7); text-align:center; }

  /* ── LIEUX ── */
  .mob-places { display:flex; flex-direction:column; gap:8px; padding:0 16px 16px; }
  .mob-place-item {
    display:flex; align-items:center; gap:12px; padding:12px 14px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; transition:background 0.2s, border-color 0.2s;
    cursor:pointer;
  }
  .mob-place-item:hover { background:rgba(56,189,248,0.08); border-color:rgba(56,189,248,0.25); }
  .mob-place-dot { width:10px; height:10px; border-radius:50%; background:linear-gradient(135deg,#38bdf8,#818cf8); flex-shrink:0; box-shadow:0 0 8px rgba(56,189,248,0.5); }
  .mob-place-name { font-size:13px; font-weight:600; color:rgba(255,255,255,0.85); }
  .mob-place-addr { font-size:11px; color:rgba(255,255,255,0.4); margin-top:2px; }
  .mob-place-desc { font-size:11px; color:#38bdf8; margin-top:3px; }

  .mob-empty { text-align:center; color:rgba(255,255,255,0.25); font-size:13px; padding:20px 0; }
  .mob-loading { text-align:center; color:rgba(255,255,255,0.35); font-size:13px; padding:20px 0; }
`

export default function DashboardMobilite() {
  const [places, setPlaces] = useState([])
  const [loadingPlaces, setLoadingPlaces] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  // Charger les lieux accessibles
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoadingPlaces(true)
      try {
        const { data } = await api.get('/api/places/accessible')
        setPlaces(data?.data || [])
      } catch (err) {
        console.error('Erreur chargement lieux:', err)
      } finally {
        setLoadingPlaces(false)
      }
    }
    fetchPlaces()
  }, [])

  // Initialiser Leaflet
  useEffect(() => {
    if (mapInstanceRef.current) return // déjà initialisée

    const initMap = () => {
      if (!window.L || !mapRef.current) return

      const L = window.L
      const map = L.map(mapRef.current, { zoomControl: true }).setView([33.5731, -7.5898], 13)
      mapInstanceRef.current = map

      // Tuiles OpenStreetMap avec style sombre
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      // Marqueur position utilisateur
      navigator.geolocation?.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords
        const userIcon = L.divIcon({
          html: '<div style="width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#818cf8);border:3px solid white;box-shadow:0 0 10px rgba(56,189,248,0.8)"></div>',
          iconSize: [14, 14], iconAnchor: [7, 7], className: ''
        })
        L.marker([latitude, longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>📍 Vous êtes ici</b>')
        map.setView([latitude, longitude], 14)
      })

      // Marqueurs favoris
      FAVORITES.forEach(fav => {
        const favIcon = L.divIcon({
          html: `<div style="font-size:20px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">${fav.icone}</div>`,
          iconSize: [28, 28], iconAnchor: [14, 14], className: ''
        })
        L.marker([fav.latitude, fav.longitude], { icon: favIcon })
          .addTo(map)
          .bindPopup(`<b>${fav.icone} ${fav.nom}</b><br><small>${fav.adresse}</small>`)
      })
    }

    // Charger Leaflet si pas encore chargé
    if (!window.L) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Ajouter marqueurs lieux API sur la carte
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || places.length === 0) return
    const L = window.L
    places.forEach(place => {
      if (!place.latitude || !place.longitude) return
      const icon = L.divIcon({
        html: '<div style="width:10px;height:10px;border-radius:50%;background:#38bdf8;border:2px solid white;box-shadow:0 0 6px rgba(56,189,248,0.7)"></div>',
        iconSize: [10, 10], iconAnchor: [5, 5], className: ''
      })
      L.marker([place.latitude, place.longitude], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>♿ ${place.nom}</b><br><small>${place.adresse || ''}</small>`)
    })
  }, [places])

  const flyTo = (lat, lng) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 16, { animate: true, duration: 1 })
    }
  }

  return (
    <div className="mob-root">
      <style>{css}</style>
      <DashboardHeader sous_titre="Lieux accessibles près de vous" />

      <div className="mob-content">

        {/* ── CARTE ── */}
        <div className="mob-card">
          <div className="mob-card-header">
            <p className="mob-section-title">🗺️ Carte des lieux accessibles</p>
          </div>
          <div className="mob-map-wrap">
            <div id="mob-map" ref={mapRef} />
            <div className="mob-map-badge">📍 OpenStreetMap</div>
          </div>

          {/* Favoris rapides */}
          <div style={{ padding:'14px 18px 10px' }}>
            <p className="mob-section-title" style={{ marginBottom:'12px' }}>⭐ Accès rapide</p>
          </div>
          <div className="mob-favs">
            {FAVORITES.map(fav => (
              <button key={fav.id} className="mob-fav-btn" onClick={() => flyTo(fav.latitude, fav.longitude)}>
                <span className="mob-fav-icon">{fav.icone}</span>
                <span className="mob-fav-label">{fav.nom}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── LIEUX ACCESSIBLES ── */}
        <div className="mob-card">
          <div className="mob-card-header">
            <p className="mob-section-title">♿ Lieux accessibles</p>
          </div>

          {loadingPlaces ? (
            <p className="mob-loading">⏳ Chargement...</p>
          ) : places.length === 0 ? (
            <p className="mob-empty">Aucun lieu trouvé</p>
          ) : (
            <div className="mob-places">
              {places.map(place => (
                <div
                  key={place.id}
                  className="mob-place-item"
                  onClick={() => place.latitude && flyTo(place.latitude, place.longitude)}
                >
                  <div className="mob-place-dot" />
                  <div>
                    <p className="mob-place-name">{place.nom}</p>
                    {place.adresse && <p className="mob-place-addr">{place.adresse}</p>}
                    {place.description && <p className="mob-place-desc">{place.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <BoutonSOS />
    </div>
  )
}
