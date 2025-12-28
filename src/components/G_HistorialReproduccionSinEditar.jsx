import React, { useState, useEffect } from 'react';
import api from '../lib/api';
// 1. Cambiamos la importación para que apunte a tu nuevo archivo CSS
import '../css/Diseño_General_tablas.css';

// Componente de spinner para cargas
const Spinner = () => <div className="spinner"></div>;

// Formateador de fechas
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'; // Evita errores si la fecha es nula
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const Get_HistorialReproduccionSinEditar = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Función para obtener todos los registros
  const fetchAllRecords = async () => {
    setLoading(true);
    setSearchId('');
    setError(null);
    try {
      const response = await api.get('/api/g_historialpro');
      if (response.data.success && response.data.data) {
        setHistorial(response.data.data);
      } else {
        setHistorial([]);
        setError(response.data.error || 'No hay registros disponibles');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los registros');
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRecords();
  }, []);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Por favor ingrese un ID de documento');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/api/b_h_reproduccion/${searchId}`);
      if (response.data) {
        setHistorial([response.data]);
        setError(null);
        setCurrentPage(1);
      } else {
        setError('No se encontró ningún registro con ese ID');
        setHistorial([]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error en la búsqueda');
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Paginación
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = historial.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(historial.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    // 2. Aplicamos la clase del contenedor principal
    <div className="sector-container">
      
      {/* 3. Agrupamos el título y la búsqueda en 'header-actions' */}
      <div className="header-actions">
        {/* 4. Aplicamos la clase del título */}
        <h2 className="title">Historial de Reproducción</h2>

        <div className="search-container" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ingrese ID de documento"
            style={{ marginRight: '10px' }}
          />
          {/* 5. Aplicamos la clase 'add-button' (verde) */}
          <button 
            onClick={handleSearch} 
            disabled={!searchId.trim() || loading}
            className="add-button"
            style={{ marginRight: '10px' }}
          >
            {loading ? <Spinner /> : 'Buscar'}
          </button>
          {/* 6. Aplicamos la clase 'back-button' (gris) */}
          <button 
            onClick={fetchAllRecords} 
            disabled={loading}
            className="back-button"
          >
            {loading ? <Spinner /> : 'Mostrar Todos'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {/* 7. Aplicamos la clase del contenedor de la tabla (para el scroll) */}
      <div className="tabla-scroll-container">
        {loading ? (
          <div className="loading-container">
            <Spinner />
            <p>Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* 8. Aplicamos la clase de la tabla personalizada */}
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID Documento</th>
                  <th>ID Vaca</th>
                  <th>ID Toro</th>
                  <th>Fecha Gestación</th>
                  <th>Fecha Nacimiento</th>
                  <th>Crías Hembras</th>
                  <th>Crías Machos</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((item) => (
                    <tr key={item._id}>
                      <td className="monospace">{item._id}</td>
                      <td>{item.id_Vaca}</td>
                      <td>{item.id_Toro}</td>
                      <td>{formatDate(item.Fecha_Gestion)}</td>
                      <td>{formatDate(item.Fecha_Nacimiento)}</td>
                      <td>{item.Crias_Hembras}</td>
                      <td>{item.Crias_Macho}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-records">
                      {error ? error : 'No se encontraron registros'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 9. La paginación no tiene estilos en tu CSS */}
            {historial.length > recordsPerPage && (
              <div className="pagination" style={{ marginTop: '20px' }}>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span style={{ margin: '0 10px' }}>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Get_HistorialReproduccionSinEditar;