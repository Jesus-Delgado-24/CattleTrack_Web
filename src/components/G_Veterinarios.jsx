import React, { useEffect, useState } from 'react';
import axios from 'axios';
// 1. Cambiamos la importación para que apunte a tu nuevo archivo CSS
import '../css/Diseño_General_tablas.css'; 

const G_Veterinarios = () => {
  const [veterinarios, setVeterinarios] = useState([]);
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

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
    setCurrentPage(1);
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

  if (error) {
    return <p>{error}</p>;
  }

  return (
    // 2. Aplicamos la clase del contenedor principal
    <div className="sector-container">
      <div className="header-actions">
        {/* 3. Aplicamos la clase del título */}
        <h2 className="title">Lista de Veterinarios</h2>
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
              </tr>
            </thead>
            <tbody>
              {paginatedVeterinarios.map(vet => (
                <tr key={vet.id_Veterinario}>
                  <td>{vet.id_Veterinario}</td>
                  <td>{vet.id_Usuario}</td>
                  <td>{vet.id_Sector}</td>
                  <td>{vet.Especialidad}</td>
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
    </div>
  );
};

export default G_Veterinarios;
