import { useState, useEffect } from 'react';
import { indicadoresService, Indicador } from '../services/indicadoresService';
import { ejesService, Eje } from '../services/ejesService';
import { useNavigate } from 'react-router-dom';

export default function IndicadoresList() {
  const navigate = useNavigate();
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [ejes, setEjes] = useState<Eje[]>([]);
  const [filtroEje, setFiltroEje] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [indicadoresData, ejesData] = await Promise.all([
        indicadoresService.getAllIndicadores(),
        ejesService.getAllEjes()
      ]);
      setIndicadores(indicadoresData);
      setEjes(ejesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const getEjeNombre = (ejeId: number) => {
    const eje = ejes.find(e => e.EJES_ID === ejeId);
    return eje ? eje.EJES_NOMBRE : 'N/A';
  };

  const indicadoresFiltrados = filtroEje
    ? indicadores.filter(ind => ind.EJES_ID === parseInt(filtroEje))
    : indicadores;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Indicadores</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/indicadores/nuevo')}
            className="btn btn-primary"
          >
            + Crear Indicador
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
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Error al cargar los datos</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => loadData()}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      )}

      {/* Filtro por eje */}
      {!loading && ejes.length > 0 && (
        <div className="card mb-4">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-gray-700">Filtrar por eje:</label>
            <select
              value={filtroEje}
              onChange={(e) => setFiltroEje(e.target.value)}
              className="form-input max-w-xs"
            >
              <option value="">Todos los ejes</option>
              {ejes.map(eje => (
                <option key={eje.EJES_ID} value={eje.EJES_ID}>
                  {eje.EJES_NOMBRE}
                </option>
              ))}
            </select>
            {filtroEje && (
              <button
                onClick={() => setFiltroEje('')}
                className="btn btn-outline btn-sm"
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600 mt-2">Cargando indicadores...</p>
          </div>
        ) : indicadoresFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {filtroEje ? 'No hay indicadores para este eje' : 'No hay indicadores registrados'}
            </p>
            <button
              onClick={() => navigate('/admin/indicadores/nuevo')}
              className="btn btn-primary"
            >
              Crear Primer Indicador
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Eje</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Valor/Unidad</th>
                </tr>
              </thead>
              <tbody>
                {indicadoresFiltrados.map((indicador, index) => (
                  <tr key={`indicador-${indicador.INDICADORES_ID}-${index}`}>
                    <td className="font-mono text-sm" style={{ color: '#000', backgroundColor: 'white' }}>{indicador.INDICADORES_ID}</td>
                    <td style={{ backgroundColor: 'white' }}>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {getEjeNombre(indicador.EJES_ID)}
                      </span>
                    </td>
                    <td className="font-semibold" style={{ color: '#000', backgroundColor: 'white' }}>{indicador.INDICADORES_NOMBRE}</td>
                    <td style={{ color: '#424242', backgroundColor: 'white' }} className="max-w-md">
                      {indicador.INDICADORES_DESCRIPCION}
                    </td>
                    <td className="font-mono text-sm" style={{ color: '#000', backgroundColor: 'white' }}>{indicador.INDICADORES_VALOR}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && indicadoresFiltrados.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {filtroEje ? (
                <>
                  Mostrando <span className="font-semibold">{indicadoresFiltrados.length}</span> indicadores
                  del eje <span className="font-semibold">{getEjeNombre(parseInt(filtroEje))}</span>
                </>
              ) : (
                <>
                  Total de indicadores: <span className="font-semibold">{indicadores.length}</span>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
