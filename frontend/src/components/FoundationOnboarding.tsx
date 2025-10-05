import { User } from '../App'
import logoImage from '../assets/images.png'

interface FoundationOnboardingProps {
  user: User;
}

export default function FoundationOnboarding({ user }: FoundationOnboardingProps) {
  return (
    <div>
      <div className="fundacion-header">
        <div className="fundacion-logo-section">
          <img 
            src={logoImage} 
            alt="Fundación Favorita" 
            className="fundacion-logo"
          />
          <div>
            <h2 className="fundacion-title">Bienvenido a Fundación Favorita</h2>
            <p className="fundacion-subtitle">Portal de Configuración para Fundaciones</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Paso 1: Selecciona tu Eje Principal</h3>
        </div>
        
        <p className="mb-4">
          Como {user.foundation?.name}, debes seleccionar un eje principal para enfocar tus programas.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="card cursor-pointer hover:shadow-lg border-red-200">
            <h4 className="font-bold text-red-600">🍎 Nutrición</h4>
            <p className="text-sm text-gray">
              Programas enfocados en seguridad alimentaria y nutrición
            </p>
          </div>

          <div className="card cursor-pointer hover:shadow-lg">
            <h4 className="font-bold text-red-600">📚 Educación</h4>
            <p className="text-sm text-gray">
              Iniciativas educativas y formación
            </p>
          </div>

          <div className="card cursor-pointer hover:shadow-lg">
            <h4 className="font-bold text-red-600">💼 Emprendimiento</h4>
            <p className="text-sm text-gray">
              Apoyo a emprendedores y desarrollo económico
            </p>
          </div>

          <div className="card cursor-pointer hover:shadow-lg">
            <h4 className="font-bold text-red-600">🌱 Ambiente</h4>
            <p className="text-sm text-gray">
              Conservación ambiental y sostenibilidad
            </p>
          </div>

          <div className="card cursor-pointer hover:shadow-lg">
            <h4 className="font-bold text-red-600">⚖️ Equidad de Género</h4>
            <p className="text-sm text-gray">
              Promoción de igualdad y equidad de género
            </p>
          </div>

          <div className="card cursor-pointer hover:shadow-lg">
            <h4 className="font-bold text-red-600">🚨 Emergencias</h4>
            <p className="text-sm text-gray">
              Respuesta y atención en situaciones de emergencia
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button className="btn btn-primary">
            Confirmar Selección y Continuar
          </button>
        </div>
      </div>
    </div>
  )
}