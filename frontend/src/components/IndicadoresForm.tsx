import { useState, useEffect } from 'react';
import { indicadoresService } from '../services/indicadoresService';
import { ejesService, Eje } from '../services/ejesService';
import { useNavigate } from 'react-router-dom';

export default function IndicadoresForm() {
  const navigate = useNavigate();
  const [ejes, setEjes] = useState<Eje[]>([]);
  const [formData, setFormData] = useState({
    EJES_ID: '',
    INDICADORES_NOMBRE: '',
    INDICADORES_DESCRIPCION: '',
    INDICADORES_VALOR: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingEjes, setLoadingEjes] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadEjes();
  }, []);

  const loadEjes = async () => {
    try {
      setLoadingEjes(true);
      setError('');
      const data = await ejesService.getAllEjes();
      
      // Validar que los datos sean válidos
      if (!data || !Array.isArray(data)) {
        throw new Error('Formato de datos inválido');
      }
      
      // Filtrar solo los ejes válidos
      const ejesValidos = data.filter(eje => 
        eje && 
        typeof eje.EJES_ID === 'number' && 
        typeof eje.EJES_NOMBRE === 'string'
      );
      
      if (ejesValidos.length === 0) {
        setError('No hay ejes disponibles. Por favor, crea un eje primero.');
        setEjes([]);
      } else {
        console.log(`✅ ${ejesValidos.length} ejes cargados correctamente`);
        setEjes(ejesValidos);
      }
    } catch (err: any) {
      console.error('Error al cargar ejes:', err);
      setError('Error al cargar los ejes. ' + err.message);
      setEjes([]);
    } finally {
      setLoadingEjes(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!formData.EJES_ID) {
      setError('Debes seleccionar un eje');
      return;
    }
    
    if (!formData.INDICADORES_NOMBRE.trim()) {
      setError('El nombre del indicador es requerido');
      return;
    }
    
    if (!formData.INDICADORES_DESCRIPCION.trim()) {
      setError('La descripción del indicador es requerida');
      return;
    }

    if (!formData.INDICADORES_VALOR.trim()) {
      setError('El valor del indicador es requerido');
      return;
    }

    if (formData.INDICADORES_NOMBRE.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (formData.INDICADORES_DESCRIPCION.length < 10) {
      setError('La descripción debe tener al menos 10 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verificar que el eje seleccionado existe
      const ejeSeleccionado = ejes.find(e => e.EJES_ID === parseInt(formData.EJES_ID));
      if (!ejeSeleccionado) {
        throw new Error('El eje seleccionado no es válido');
      }

      const resultado = await indicadoresService.createIndicador({
        EJES_ID: parseInt(formData.EJES_ID),
        INDICADORES_NOMBRE: formData.INDICADORES_NOMBRE.trim(),
        INDICADORES_DESCRIPCION: formData.INDICADORES_DESCRIPCION.trim(),
        INDICADORES_VALOR: formData.INDICADORES_VALOR.trim()
      });
      
      console.log('✅ Indicador creado:', resultado);
      setSuccess(true);
      
      // Limpiar formulario
      setFormData({
        EJES_ID: '',
        INDICADORES_NOMBRE: '',
        INDICADORES_DESCRIPCION: '',
        INDICADORES_VALOR: ''
      });

      // Recargar la lista de indicadores en segundo plano
      try {
        await indicadoresService.getAllIndicadores();
      } catch (err) {
        console.error('Error al actualizar la lista de indicadores:', err);
      }

      // Mensaje y redirección
      setTimeout(() => {
        setSuccess(false);
        navigate('/admin/indicadores'); // Redirigir a la lista después del éxito
      }, 2000);

    } catch (err: any) {
      if (err.message.includes('expirado')) {
        setError('Su sesión ha expirado. Será redirigido al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      setError(err.message || 'Error al crear el indicador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Crear Nuevo Indicador</h2>
        <button
          onClick={() => navigate('/admin')}
          className="btn btn-outline"
        >
          ← Volver
        </button>
      </div>

      {success && (
        <div className="animate-fadeIn bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-center shadow-sm">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">¡Indicador creado exitosamente!</p>
            <p className="text-sm text-green-600">Los cambios han sido guardados en la base de datos.</p>
          </div>
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
              Eje Temático <span className="text-red-500">*</span>
            </label>
            {loadingEjes ? (
              <div className="text-gray-500 p-4 bg-gray-50 rounded">
                <p>⏳ Cargando ejes...</p>
              </div>
            ) : ejes.length === 0 ? (
              <div className="text-orange-600 p-4 bg-orange-50 rounded">
                <p>⚠️ No hay ejes disponibles.</p>
                <button
                  type="button"
                  onClick={() => navigate('/admin/ejes/nuevo')}
                  className="btn btn-primary mt-2"
                >
                  Crear Primer Eje
                </button>
              </div>
            ) : (
              <>
                <select
                  name="EJES_ID"
                  value={formData.EJES_ID}
                  onChange={handleChange}
                  className="form-select w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Selecciona un eje</option>
                  {ejes.map(eje => (
                    <option 
                      key={eje.EJES_ID} 
                      value={eje.EJES_ID}
                      className="py-1"
                    >
                      {eje.EJES_NOMBRE} (ID: {eje.EJES_ID})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {ejes.length} eje{ejes.length !== 1 ? 's' : ''} disponible{ejes.length !== 1 ? 's' : ''}
                </p>
                {formData.EJES_ID && (
                  <p className="text-sm text-green-600 mt-1 font-semibold">
                    ✓ Eje seleccionado: {ejes.find(e => e.EJES_ID === parseInt(formData.EJES_ID))?.EJES_NOMBRE}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Nombre del Indicador <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="INDICADORES_NOMBRE"
              value={formData.INDICADORES_NOMBRE}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: Escuelas apoyadas (#)"
              disabled={loading}
              maxLength={124}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.INDICADORES_NOMBRE.length}/124 caracteres
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="INDICADORES_DESCRIPCION"
              value={formData.INDICADORES_DESCRIPCION}
              onChange={handleChange}
              className="form-input"
              placeholder="Describe qué mide este indicador y cómo se calcula"
              rows={4}
              disabled={loading}
              maxLength={124}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.INDICADORES_DESCRIPCION.length}/124 caracteres
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Valor/Unidad de Medida <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="INDICADORES_VALOR"
              value={formData.INDICADORES_VALOR}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: personas, kg, %, unidades"
              disabled={loading}
              maxLength={124}
            />
            <p className="text-sm text-gray-500 mt-1">
              Especifica la unidad de medida o valor inicial
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || loadingEjes}
            >
              {loading ? 'Guardando...' : 'Guardar Indicador'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/admin/indicadores')}
              className="btn btn-outline"
              disabled={loading}
            >
              Ver Todos los Indicadores
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
