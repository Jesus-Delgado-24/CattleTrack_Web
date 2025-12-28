import React, { useEffect, useState } from 'react';
import axios from 'axios';
// 1. Cambiamos la importación para que apunte a tu nuevo archivo CSS
import '../css/Diseño_General_tablas.css'; 

const GU_Veterinarios = () => {
  const [veterinarios, setVeterinarios] = useState([]);
  const [editing, setEditing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchId, setSearchId] = useState('');
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/g_veterinarios', {
      params: { param: '' } 
    })
      .then(response => {
        if (response.data && response.data.success) {
          setVeterinarios(response.data.data);
        } else {
          setError('No se pudieron obtener los veterinarios');
        }
      })
      .catch(error => {
        console.error('Error al obtener veterinarios:', error);
        setError('Hubo un error al cargar los datos.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEditClick = (vet) => {
    setEditing({ ...vet });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditing(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/api/a_vets/${editing.id_Veterinario}`, editing)
      .then(response => {
        if (response.data.success) {
          setVeterinarios(prev => prev.map(v => v.id_Veterinario === editing.id_Veterinario ? editing : v));
          setEditing(null);
        } else {
          setError('Error al actualizar el veterinario');
        }
      })
      .catch(error => {
        console.error('Error al actualizar veterinario:', error);
        setError('Hubo un error al actualizar el veterinario.');
      });
  };

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
    setCurrentPage(1);
    setError(null); 
  };

  const filteredVeterinarios = veterinarios.filter(vet =>
    vet.id_Veterinario.toString().includes(searchId)
  );

  const paginatedVeterinarios = filteredVeterinarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVeterinarios.length / itemsPerPage);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    // 2. Aplicamos la clase del contenedor principal
    <div className="sector-container"> 
      {error && <div className="error-message">{error}</div>}

      <div className="header-actions">
        {/* 3. Aplicamos la clase del título */}
        <h2 className="title">Editar Veterinarios</h2> 
        <input
          type="text"
          placeholder="Buscar por ID"
          value={searchId}
          onChange={handleSearchChange}
        />
      </div>

      {paginatedVeterinarios.length > 0 ? (
        // 4. Añadimos el contenedor para el scroll de la tabla
        <div className="tabla-scroll-container">
          {/* 5. Aplicamos la clase de la tabla personalizada */}
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID Veterinario</th>
                <th>ID Usuario</th>
                <th>ID Sector</th>
                <th>Especialidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVeterinarios.map(vet => (
                <tr key={vet.id_Veterinario}>
                  <td>{vet.id_Veterinario}</td>
                  <td>{vet.id_Usuario}</td>
                  <td>{vet.id_Sector}</td>
                  <td>{vet.Especialidad}</td>
                  <td>
                    {/* 6. Aplicamos la clase del botón de editar */}
                    <button onClick={() => handleEditClick(vet)} className="edit-button">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No se encontraron veterinarios con ese ID.</p>
      )}

      <div className="pagination-controls">
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Siguiente
        </button>
      </div>

      {editing && (
        // 7. Aplicamos la clase del fondo del modal
        <div className="modal">
          {/* 8. La clase modal-content ya coincidía, así que se queda igual */}
          <div className="modal-content">
            {/* 9. Cambiado a h2 para coincidir con tu selector CSS (.modal-content h2) */}
            <h2>Editar Veterinario</h2>
            <label>ID Veterinario:</label>
            <input
              type="text"
              name="id_Veterinario"
              value={editing.id_Veterinario}
              disabled
            />
            <label>ID Usuario:</label>
            <input
              type="number"
              name="id_Usuario"
              value={editing.id_Usuario}
              onChange={handleInputChange}
            />
            <label>ID Sector:</label>
            <input
              type="number"
              name="id_Sector"
              value={editing.id_Sector}
              onChange={handleInputChange}
            />
            <label>Especialidad:</label>
            <input
              type="text"
              name="Especialidad"
              value={editing.Especialidad}
              onChange={handleInputChange}
            />

            {/* 10. La clase modal-actions también coincidía */}
            <div className="modal-actions">
              {/* 11. Aplicamos las clases save-button y cancel-button */}
              <button onClick={() => setEditing(null)} className="cancel-button">Cancelar</button>
              <button onClick={handleUpdate} className="save-button">Actualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GU_Veterinarios;

