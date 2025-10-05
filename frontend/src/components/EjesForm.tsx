import { useState } from 'react';
import { ejesService } from '../services/ejesService';
import { useNavigate } from 'react-router-dom';

export default function EjesForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    EJES_NOMBRE: '',
    EJES_DESCRIPCION: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.EJES_NOMBRE.trim()) {
      setError('El nombre del eje es requerido');
      return;
    }
    
    if (!formData.EJES_DESCRIPCION.trim()) {
      setError('La descripción del eje es requerida');
      return;
    }

    if (formData.EJES_NOMBRE.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (formData.EJES_DESCRIPCION.length < 10) {
      setError('La descripción debe tener al menos 10 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ejesService.createEje(formData);
      setSuccess(true);
      
      // Limpiar formulario
      setFormData({
        EJES_NOMBRE: '',
        EJES_DESCRIPCION: ''
      });

      // Recargar la lista de ejes en segundo plano
      try {
        await ejesService.getAllEjes();
      } catch (err) {
        console.error('Error al actualizar la lista de ejes:', err);
      }

      // Mensaje y redirección
      setTimeout(() => {
        setSuccess(false);
        navigate('/admin/ejes'); // Redirigir a la lista después del éxito
      }, 2000);

    } catch (err: any) {
      if (err.message.includes('expirado')) {
        setError('Su sesión ha expirado. Será redirigido al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      setError(err.message || 'Error al crear el eje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Crear Nuevo Eje</h2>
        <button
          onClick={() => navigate('/admin')}
          className="btn btn-outline"
        >
          ← Volver
        </button>
      </div>

      {success && (
        <div className="animate-fadeIn bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 shadow-sm">
          <p className="font-medium">Eje creado exitosamente</p>
          <p className="text-sm text-green-600">Los cambios han sido guardados</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Nombre del Eje <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="EJES_NOMBRE"
              value={formData.EJES_NOMBRE}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: Educación, Salud, Medio Ambiente"
              disabled={loading}
              maxLength={124}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.EJES_NOMBRE.length}/124 caracteres
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="EJES_DESCRIPCION"
              value={formData.EJES_DESCRIPCION}
              onChange={handleChange}
              className="form-input"
              placeholder="Describe el objetivo y alcance de este eje temático"
              rows={4}
              disabled={loading}
              maxLength={124}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.EJES_DESCRIPCION.length}/124 caracteres
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Eje'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/admin/ejes')}
              className="btn btn-outline"
              disabled={loading}
            >
              Ver Todos los Ejes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
