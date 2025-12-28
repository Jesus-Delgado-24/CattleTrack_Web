import React, { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
// Se corrige la importación de CSS para usar el archivo correcto
import '../css/Diseño_General_tablas.css'; 
import { useLocation } from "react-router-dom";

const Get_Monitoreo = () => {
  const [monitoreos, setMonitoreos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ id: '', tipo: '' }); // 2 = veterinario

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const location = useLocation();
  const { id, tipo } = location.state || {};

  // Esta es tu lógica original de fetch
  const fetchMonitoreos = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/api/g_monitoreo', {
        params: {
          id: id,
          tipo: tipo
        }
      });

      if (data.success) {
        setMonitoreos(data.data);
        setCurrentPage(1); // Reiniciar página al aplicar filtro
      } else {
        throw new Error(data.error || 'Error al cargar los datos.');
      }
    } catch (err) {
      setError(err.message);
      setMonitoreos([]);
    } finally {
      setLoading(false);
    }
  }, [filters]); // Tu lógica original depende de 'filters'

  useEffect(() => {
    fetchMonitoreos();
  }, [fetchMonitoreos]);

  // Esta es tu lógica original para manejar filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = monitoreos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(monitoreos.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  // 
  // --- INICIO DEL BLOQUE JSX CORREGIDO ---
  //
  return (
    // CAMBIO: Clase del contenedor principal
    <div className="sector-container">
      
      {/* CAMBIO: Clase del título */}
      <h2 className="title">Monitoreos Registrados</h2>

      {/* Filtros */}
      <div className="form-group">
        <label>Filtrar por ID de Veterinario</label>
        <input
          type="text"
          name="id"
          value={filters.id}
          onChange={handleFilterChange}
          placeholder="Ej: 123"
        />
        <button
          onClick={fetchMonitoreos}
          
          // CAMBIO: Clase del botón "Buscar"
          className="add-button" 
          
          style={{ marginLeft: '10px' }}
        >
          Buscar
        </button>
      </div>

      {/* Mensajes de estado */}
      {loading && <div className="loading">Cargando...</div>}
      {error && <div className="error">Error: {error}</div>}

      {/* Tabla */}
      {!loading && !error && monitoreos.length > 0 && (
        <>
          {/* CAMBIO: Contenedor de la tabla para scroll */}
          <div className="tabla-scroll-container">
            
            {/* CAMBIO: Clase de la tabla */}
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID Ganado</th>
                  <th>ID Veterinario</th>
                  <th>Temperatura (°C)</th>
                  <th>Frec. Cardíaca</th>
                  <th>Deshidratación</th>
                  <th>Fecha/Hora</th>
                  <th>Desglose</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(({ _id, id_Ganado, id_Veterinario, Temperatura, Frecuencia_Cardiaca, Nivel_Deshidratacion, Fecha_Hora, Desglose }) => (
                  <tr key={_id}>
                    <td>{id_Ganado}</td>
                    <td>{id_Veterinario}</td>
                    <td>{Temperatura ?? 'N/A'}</td>
                    <td>{Frecuencia_Cardiaca ?? 'N/A'}</td>
                    <td>{Nivel_Deshidratacion ?? 'N/A'}</td>
                    <td>{new Date(Fecha_Hora).toLocaleString()}</td>
                    <td>
                      <ul className="desglose-list">
                        {Desglose?.map((obs, idx) => (
                          <li key={idx}>{obs}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="pagination-controls">
            
            {/* CAMBIO: Clase de botones de paginación */}
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className="bback-button"
            >
              Anterior
            </button>
            
            <span>Página {currentPage} de {totalPages}</span>
            
            {/* CAMBIO: Clase de botones de paginación */}
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className="bback-button"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {!loading && !error && monitoreos.length === 0 && (
        <div className="no-results">No se encontraron monitoreos.</div>
      )}
    </div>
  );
  //
  // --- FIN DEL BLOQUE JSX CORREGIDO ---
  //
};

export default Get_Monitoreo;
