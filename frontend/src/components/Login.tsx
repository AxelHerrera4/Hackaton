import { useState } from 'react'
import { authService, LoginResponse } from '../services/authService'
import { User } from '../App'

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response: LoginResponse = await authService.login(email, password)
      onLogin(response.user as User, response.access_token)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">La Corporación Favorita</h1>
        <p className="text-center text-gray mb-4">Sistema de Gestión de ONGs</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@corporacionfavorita.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password"
            />
          </div>

          {error && (
            <div className="text-red text-center mb-4">{error}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray">
          <p><strong>Credenciales de demo:</strong></p>
          <p>Admin: admin@corporacionfavorita.com / password</p>
          <p>Líder: lider@fundacionesperanza.org / password</p>
        </div>
      </div>
    </div>
  )
}