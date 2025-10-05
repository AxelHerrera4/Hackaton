import { useState, useEffect } from 'react';
import { ejesService, Eje } from '../services/ejesService';
import { useNavigate } from 'react-router-dom';

export default function EjesList() {
  const navigate = useNavigate();
  const [ejes, setEjes] = useState<Eje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEjes();
  }, []);

  const loadEjes = async () => {
    try {
      setLoading(true);
      const data = await ejesService.getAllEjes();
      setEjes(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los ejes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el eje "${nombre}"?`)) {
      return;
    }

    try {
      await ejesService.deleteEje(id);
      setEjes(ejes.filter(eje => eje.EJES_ID !== id));
    } catch (err: any) {
      alert('Error al eliminar el eje: ' + err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Ejes Temáticos</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/ejes/nuevo')}
            className="btn btn-primary"
          >
            + Crear Eje
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="btn btn-outline"
          >
            ← Volver
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600 mt-2">Cargando ejes...</p>
          </div>
        ) : ejes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No hay ejes registrados</p>
            <button
              onClick={() => navigate('/admin/ejes/nuevo')}
              className="btn btn-primary"
            >
              Crear Primer Eje
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ejes.map((eje, index) => (
                  <tr key={`eje-${eje.EJES_ID}-${index}`}>
                    <td className="font-mono text-sm" style={{ color: '#000', backgroundColor: 'white' }}>{eje.EJES_ID}</td>
                    <td className="font-semibold" style={{ color: '#000', backgroundColor: 'white' }}>{eje.EJES_NOMBRE}</td>
                    <td style={{ color: '#424242', backgroundColor: 'white' }}>{eje.EJES_DESCRIPCION}</td>
                    <td style={{ backgroundColor: 'white' }}>
                      <button
                        onClick={() => handleDelete(eje.EJES_ID, eje.EJES_NOMBRE)}
                        className="btn btn-secondary btn-sm"
                        title="Eliminar eje"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && ejes.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Total de ejes: <span className="font-semibold">{ejes.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
