import React, { useEffect, useState } from 'react';
import axios from 'axios';

// 1. CAMBIO: Importamos el nuevo archivo CSS
import '../css/Diseño_General_tablas.css'; 

const G_Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... (La lógica de React se mantiene igual) ...
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/g_users', {
      params: { param: '' } 
    })
      .then(response => {
        if (response.data && response.data.success) {
          setUsuarios(response.data.data);
        } else {
          setError('No se pudieron obtener los usuarios');
        }
      })
      .catch(error => {
        console.error('Error al obtener usuarios:', error);
        setError('Hubo un error al cargar los datos.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.id_Usuario.toString().includes(searchId)
  );

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    // 2. CAMBIO: Usamos 'sector-container' como el div principal
    <div className="sector-container">

      {/* 3. CAMBIO: Aplicamos la clase 'title' al H2 */}
      <h2 className="title">Lista de Usuarios</h2>
      
      {/* El CSS no especificaba un estilo para 'header-actions'
        o el input, así que los dejamos así. El input 
        estará centrado gracias a 'sector-container'.
      */}
      <input
        type="text"
        placeholder="Buscar por ID"
        value={searchId}
        onChange={handleSearchChange}
        // Opcional: Añadir un poco de estilo si el input se ve mal
        style={{ marginBottom: '20px', padding: '8px', fontSize: '14px' }}
      />

      {/* 4. MANTENEMOS: El 'div' para el scroll que ya funcionaba */}
      <div className="tabla-scroll-container">
        {filteredUsuarios.length > 0 ? (
          
          // 5. CAMBIO: Usamos 'custom-table' para la tabla
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID Usuario</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Contraseña</th>
                <th>Tipo_U</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map(usuario => (
                <tr key={usuario.id_Usuario}>
                  <td>{usuario.id_Usuario}</td>
                  <td>{usuario.Nombre}</td>
                  <td>{usuario.Apellido_P}</td>
                  <td>{usuario.Apellido_M}</td>
                  <td>{usuario.Email}</td>
                  <td>{usuario.Telefono}</td>
                  <td>{usuario.Contraseña}</td>
                  <td>{usuario.Tipo_U}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron usuarios con ese ID.</p>
        )}
      </div> 
      {/* Fin del 'tabla-scroll-container' */}

    </div>
  );
};

export default G_Usuarios;