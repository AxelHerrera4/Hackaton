
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'
import FoundationOnboarding from './components/FoundationOnboarding'
import EjesForm from './components/EjesForm'
import EjesList from './components/EjesList'
import IndicadoresForm from './components/IndicadoresForm'
import IndicadoresList from './components/IndicadoresList'
import { authService } from './services/authService'
import { cleanAuthStorage } from './utils/authCleanup'
import logoImage from './assets/images.png'

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'lider' | 'revisor' | 'tesoreria';
  foundationId?: number;
  foundation?: {
    id: number;
    name: string;
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Limpiar tokens inválidos al inicio
    cleanAuthStorage();
    
    const token = localStorage.getItem('token')
    if (token) {
      authService.getProfile()
        .then(userData => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = (userData: User, token: string) => {
    localStorage.setItem('token', token)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-header">
              <img 
                src={logoImage} 
                alt="Fundación Favorita" 
                className="header-logo"
              />
              <span className="logo-text">Fundación Favorita</span>
            </div>
            <div className="user-info">
              <span>{user.fullName}</span>
              <span className="text-sm opacity-75">({user.role})</span>
              <button onClick={handleLogout} className="btn btn-outline">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          {user.role === 'admin' && (
            <>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/ejes" element={<EjesList />} />
              <Route path="/admin/ejes/nuevo" element={<EjesForm />} />
              <Route path="/admin/indicadores" element={<IndicadoresList />} />
              <Route path="/admin/indicadores/nuevo" element={<IndicadoresForm />} />
            </>
          )}
          {user.role === 'lider' && (
            <Route path="/onboarding" element={<FoundationOnboarding user={user} />} />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App