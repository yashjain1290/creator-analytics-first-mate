import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import YouTube from './pages/YouTube'
import Twitter from './pages/Twitter'
import Discord from './pages/Discord'
import Insights from './pages/Insights'
import Connect from './pages/Connect'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/youtube" element={
            <ProtectedRoute><YouTube /></ProtectedRoute>
          } />
          <Route path="/twitter" element={
            <ProtectedRoute><Twitter /></ProtectedRoute>
          } />
          <Route path="/discord" element={
            <ProtectedRoute><Discord /></ProtectedRoute>
          } />
          <Route path="/insights" element={
            <ProtectedRoute><Insights /></ProtectedRoute>
          } />
          <Route path="/connect" element={
            <ProtectedRoute><Connect /></ProtectedRoute>
          } />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}