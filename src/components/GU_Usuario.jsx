import React, { useEffect, useState } from 'react';
import axios from 'axios';
const GU_Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    // Ya no se resetea la página, porque no hay
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = () => {
    console.log('Enviando usuario actualizado:', selectedUser);
    axios.put(`http://localhost:5000/api/a_users/${selectedUser.id_Usuario}`, selectedUser)
      .then(response => {
        if (response.data && response.data.success) {
          alert('Usuario actualizado correctamente');
          setUsuarios(prev =>
            prev.map(u => (u.id_Usuario === selectedUser.id_Usuario ? selectedUser : u))
          );
          setShowModal(false);
        } else {
          alert(response.data.message || 'No se pudo actualizar el usuario');
        }
      })
      .catch(error => {
        console.error('Error al actualizar usuario:', error);
        alert(error.response?.data?.error || 'Error al actualizar');
      });
  };

  // Solo filtramos, ya no paginamos
  const filteredUsuarios = usuarios.filter(user =>
    user.id_Usuario.toString().includes(searchId)
  );

  // Se eliminaron paginatedUsuarios y totalPages

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="sector-container">
      <div className="header-actions">
        <h2 className="title">Lista de Usuarios</h2>
        <input
          type="text"
          placeholder="Buscar por ID"
          value={searchId}
          onChange={handleSearchChange}
        />
      </div>

      {/* CAMBIO: Usamos filteredUsuarios directamente */}
      {filteredUsuarios.length > 0 ? (
        /*
          CAMBIO: Añadido estilo inline para el scroll.
          Puedes ajustar '60vh' (60% de la altura de la pantalla)
          a un valor fijo si prefieres (ej. '500px').
          Tu CSS en Usuarios.css también podría definir esto para .table-wrapper
        */
        <div className="table-wrapper" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID Usuario</th>
                <th>Nombre</th>
                <th>Apellido_P</th>
                <th>Apellido_M</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Contraseña</th>
                <th>Tipo_U</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* CAMBIO: Mapeamos sobre filteredUsuarios */}
              {filteredUsuarios.map(user => (
                <tr key={user.id_Usuario}>
                  <td>{user.id_Usuario}</td>
                  <td>{user.Nombre}</td>
                  <td>{user.Apellido_P}</td>
                  <td>{user.Apellido_M}</td>
                  <td>{user.Email}</td>
                  <td>{user.Telefono}</td>
                  <td style={{ wordBreak: 'break-word', maxWidth: '200px' }}>{user.Contraseña}</td>
                  <td>{user.Tipo_U}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEditClick(user)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No se encontraron usuarios con ese ID.</p>
      )}
      
      {/* CAMBIO: Se eliminó el div .pagination-controls */}

      {showModal && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Usuario</h2>
            <label>Nombre:</label>
            <input name="Nombre" value={selectedUser.Nombre} onChange={handleInputChange} />
            <label>Apellido_P:</label>
            <input name="Apellido_P" value={selectedUser.Apellido_P} onChange={handleInputChange} />
            <label>Apellido_M:</label>
            <input name="Apellido_M" value={selectedUser.Apellido_M} onChange={handleInputChange} />
            <label>Email:</label>
            <input name="Email" value={selectedUser.Email} onChange={handleInputChange} />
            <label>Telefono:</label>
            <input name="Telefono" value={selectedUser.Telefono} onChange={handleInputChange} />
            <label>Contraseña:</label>
            <input name="Contraseña" value={selectedUser.Contraseña} onChange={handleInputChange} />
            <label>Tipo_U:</label>
            <input name="Tipo_U" value={selectedUser.Tipo_U} onChange={handleInputChange} />
            
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="save-button" onClick={handleUpdateUser}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GU_Usuario;