import React, { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
// 1. Cambiamos la importación para que apunte a tu nuevo archivo CSS
import '../css/Diseño_General_tablas.css'; 
import { useLocation } from "react-router-dom";

const Edit_MonitoreoTabla = () => {
  const [monitoreos, setMonitoreos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonitoreo, setSelectedMonitoreo] = useState(null);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({ id: '', tipo: '' }); // 2 = veterinario

  const location = useLocation();
  const { id, tipo } = location.state || {};

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Número de elementos por página

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
      } else {
        throw new Error(data.error || 'Error al cargar los datos.');
      }
    } catch (err) {
      setError(err.message);
      setMonitoreos([]);
    } finally {
      setLoading(false);
    }
  }, [filters, id, tipo]); // Añadidas 'id' y 'tipo' a las dependencias

  useEffect(() => {
    fetchMonitoreos();
  }, [fetchMonitoreos]);

  // Obtener los datos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMonitoreos = monitoreos.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = (monitoreo) => {
    setSelectedMonitoreo(monitoreo);
    setEditData({
      id_Ganado: monitoreo.id_Ganado ?? '',
      id_Veterinario: monitoreo.id_Veterinario ?? '',
      Temperatura: monitoreo.Temperatura ?? '',
      Frecuencia_Cardiaca: monitoreo.Frecuencia_Cardiaca ?? '',
      Nivel_Deshidratacion: monitoreo.Nivel_Deshidratacion ?? '',
      Fecha_Hora: monitoreo.Fecha_Hora?.slice(0, 16) ?? '',
      Desglose: monitoreo.Desglose?.join(', ') ?? ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMonitoreo(null);
    setEditData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      const payload = {
        ...editData,
        Desglose: editData.Desglose.split(',').map(d => d.trim()),
        Fecha_Hora: new Date(editData.Fecha_Hora).toISOString()
      };

      await api.put(`/api/a_monitoring/${selectedMonitoreo._id}`, payload);
      closeModal();
      fetchMonitoreos();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    }
  };

  // Cambiar página
  const nextPage = () => {
    if (currentPage < Math.ceil(monitoreos.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    // 2. Aplicamos la clase del contenedor principal
    <div className="sector-container">
      {/* 3. Aplicamos la clase del título */}
      <h2 className="title">Monitoreos (Editable)</h2>

      {/* Barra de búsqueda */}
      {/* 4. Tu CSS no tenía "form-group", lo dejamos pero estilizamos el botón */}
      <div className="form-group" style={{ marginBottom: '20px' }}> {/* Añadí un margen para separar */}
        <label>Filtrar por ID de Veterinario: </label>
        <input
          type="text"
          name="id"
          value={filters.id}
          onChange={handleFilterChange}
          placeholder="Ej: 123"
          style={{ marginRight: '10px' }} // Añadí margen
        />
        {/* 5. Usamos la clase "add-button" (verde) para el botón de búsqueda */}
        <button
          onClick={fetchMonitoreos}
          className="add-button" 
        >
          Buscar
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && monitoreos.length > 0 && (
        <>
          {/* 6. Añadimos el contenedor para el scroll de la tabla */}
          <div className="tabla-scroll-container">
            {/* 7. Aplicamos la clase de la tabla personalizada */}
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID Ganado</th>
                  <th>ID Veterinario</th>
                  <th>Temperatura</th>
                  <th>Frecuencia</th>
                  <th>Deshidratación</th>
                  <th>Fecha/Hora</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {currentMonitoreos.map((m) => (
                  <tr key={m._id}>
                    <td>{m.id_Ganado}</td>
                    <td>{m.id_Veterinario}</td>
                    <td>{m.Temperatura ?? 'N/A'}</td>
                    <td>{m.Frecuencia_Cardiaca ?? 'N/A'}</td>
                    <td>{m.Nivel_Deshidratacion ?? 'N/A'}</td>
                    <td>{new Date(m.Fecha_Hora).toLocaleString()}</td>
                    <td>
                      <a 
                        href="#" 
                        className="edit-button" 
                        onClick={(e) => { 
                          e.preventDefault(); // Previene que el enlace recargue la página
                          openModal(m); 
                        }}
                      >
                        Editar   
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación (sin estilos en el CSS) */}
          <div className="pagination" style={{ marginTop: '20px' }}>
            <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
            <span style={{ margin: '0 10px' }}>Página {currentPage}</span>
            <button onClick={nextPage} disabled={currentPage === Math.ceil(monitoreos.length / itemsPerPage)}>Siguiente</button>
          </div>
        </>
      )}

      {/* MODAL */}
      {/* 9. La clase "modal" ya coincidía, se queda igual */}
      {modalOpen && (
        <div className="modal">
          {/* 10. La clase "modal-content" ya coincidía */}
          <div className="modal-content">
            {/* 11. Cambiado a h2 para coincidir con tu selector CSS (.modal-content h2) */}
            <h2>Editar Monitoreo</h2>
            <label>ID Ganado:</label>
            <input
              type="text"
              name="id_Ganado"
              value={editData.id_Ganado}
              onChange={handleEditChange}
            />

            <label>ID Veterinario:</label>
            <input
              type="text"
              name="id_Veterinario"
              value={editData.id_Veterinario}
              onChange={handleEditChange}
            />

            <label>Temperatura:</label>
            <input
              type="number"
              name="Temperatura"
              value={editData.Temperatura}
              onChange={handleEditChange}
            />

            <label>Frecuencia Cardíaca:</label>
            <input
              type="number"
              name="Frecuencia_Cardiaca"
              value={editData.Frecuencia_Cardiaca}
              onChange={handleEditChange}
            />

            <label>Nivel de Deshidratación:</label>
            <select
              name="Nivel_Deshidratacion"
              value={editData.Nivel_Deshidratacion}
              onChange={handleEditChange}
            >
              <option value="">Seleccione una opción</option>
              <option value="Moderado">Moderado</option>
              <option value="Severo">Severo</option>
              <option value="Leve">Leve</option>
            </select>

            <label>Fecha y Hora:</label>
            <input
              type="datetime-local"
              name="Fecha_Hora"
              value={editData.Fecha_Hora}
              onChange={handleEditChange}
            />

            <label>Desglose (separa por comas):</label>
            <input
              type="text"
              name="Desglose"
              value={editData.Desglose}
              onChange={handleEditChange}
            />

            {/* 12. Aplicamos la clase "modal-actions" */}
            <div className="modal-actions">
              {/* 13. Aplicamos las clases "save-button" y "cancel-button" */}
              <button onClick={closeModal} className="cancel-button">Cancelar</button>
              <button onClick={saveChanges} className="save-button">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit_MonitoreoTabla;
