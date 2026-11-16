import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Intro from './pages/Intro'
import ProfileSelection from './pages/ProfileSelection'
import DashboardTSA from './pages/DashboardTSA'
import DashboardMobilite from './pages/DashboardMobilite'
import DashboardMalvoyant from './pages/DashboardMalvoyant'
import DashboardSourd from './pages/DashboardSourd'
import DashboardCognitif from './pages/DashboardCognitif'
import DashboardParent from './pages/DashboardParent'
import PrivateRoute from './components/PrivateRoute'
import ProfilParent from './pages/ProfilParent'
import GererProche from './pages/GererProche'
import ParentEmotions from './pages/ParentEmotions'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profil" element={<PrivateRoute><ProfileSelection /></PrivateRoute>} />
        <Route path="/dashboard/autisme" element={<PrivateRoute><DashboardTSA /></PrivateRoute>} />
        <Route path="/dashboard/mobilite_reduite" element={<PrivateRoute><DashboardMobilite /></PrivateRoute>} />
        <Route path="/dashboard/malvoyant" element={<PrivateRoute><DashboardMalvoyant /></PrivateRoute>} />
        <Route path="/dashboard/sourd" element={<PrivateRoute><DashboardSourd /></PrivateRoute>} />
        <Route path="/dashboard/cognitif" element={<PrivateRoute><DashboardCognitif /></PrivateRoute>} />
        <Route path="/dashboard/parent_aidant" element={<PrivateRoute><DashboardParent /></PrivateRoute>} />
        <Route path="/profil-parent" element={<PrivateRoute><ProfilParent /></PrivateRoute>} />
        <Route path="/parent/gerer/:procheId" element={<PrivateRoute><GererProche /></PrivateRoute>} />
        <Route path="/parent/emotions/:procheId" element={<PrivateRoute><ParentEmotions /></PrivateRoute>} />
      </Routes>
    
    </BrowserRouter>
  )
}