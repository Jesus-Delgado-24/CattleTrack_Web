import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import '../css/Diseño_General_tablas.css'; 
import { useLocation } from "react-router-dom";

const Spinner = () => <div className="spinner"></div>;

const formatDateTime = (dateString) => {
 const options = { 
  year: 'numeric', 
  month: '2-digit', 
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
 };
 return new Date(dateString).toLocaleDateString('es-ES', options);
};

const Get_Abastecimiento = () => {
 const [abastecimientos, setAbastecimientos] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [searchId, setSearchId] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
 const [registroEditar, setRegistroEditar] = useState(null);

 const recordsPerPage = 10;

 const location = useLocation();
 const { id, tipo } = location.state || {};

 const fetchAllRecords = async () => {
  setLoading(true);
  setSearchId('');
  setError(null);
  try {
   const response = await api.get('/api/g_abastecer', {
    params: { id, tipo }
   });

   if (response.data.success && response.data.data) {
    setAbastecimientos(response.data.data);
   } else {
    setAbastecimientos([]);
    setError(response.data.error || 'No hay registros disponibles');
   }

  } catch (err) {
   setError(err.response?.data?.message || 'Error al cargar los registros');
   setAbastecimientos([]);
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
   const response = await api.get(`/api/b_abastecer/${searchId}`);
   if (response.data) {
    setAbastecimientos([response.data]);
    setError(null);
    setCurrentPage(1);
   } else {
    setError('No se encontró ningún registro con ese ID');
    setAbastecimientos([]);
   }
  } catch (err) {
   setError(err.response?.data?.error || 'Error en la búsqueda');
   setAbastecimientos([]);
  } finally {
   setLoading(false);
  }
 };

 const handleKeyPress = (e) => {
  if (e.key === 'Enter') handleSearch();
 };

 // PAGINACIÓN
 const indexOfLastRecord = currentPage * recordsPerPage;
 const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
 const currentRecords = abastecimientos.slice(indexOfFirstRecord, indexOfLastRecord);
 const totalPages = Math.ceil(abastecimientos.length / recordsPerPage);

 const paginate = (pageNumber) => setCurrentPage(pageNumber);

 // GUARDAR EDICIÓN
 const handleGuardarEdicion = async () => {
  try {
   const response = await api.put(`/api/u_abastecer/${registroEditar._id}`, {
    id_Sector: registroEditar.id_Sector,
    id_Alimento: registroEditar.id_Alimento,
    Cantidad: registroEditar.Cantidad
   });

   alert("Registro actualizado correctamente ✔");

   setRegistroEditar(null); // cerrar formulario
   fetchAllRecords(); // refrescar tabla
  } catch (err) {
   alert("Error al actualizar");
  }
 };

 return (
  <div className="sector-container"> 
   <h1 className="title">Registros de Abastecimiento</h1>

   <div className="search-container">
    <input
     type="text"
     value={searchId}
     onChange={(e) => setSearchId(e.target.value)}
     onKeyPress={handleKeyPress}
     placeholder="Ingrese ID de documento"
    />

    <button 
     onClick={handleSearch} 
     disabled={!searchId.trim() || loading} 
     className="add-button"
    >
     {loading ? <Spinner /> : 'Buscar'}
    </button>

    <button 
     onClick={fetchAllRecords}
     disabled={loading}
     className="bback-button"
    >
     {loading ? <Spinner /> : 'Mostrar Todos'}
    </button>
   </div>

   {error && <div className="error-message">⚠️ {error}</div>}

   {/* TABLA */}
   <div className="tabla-scroll-container"> 
    {loading ? (
     <div className="loading-container">
      <Spinner />
      <p>Cargando datos...</p>
     </div>
    ) : (
     <>
      <table className="custom-table"> 
       <thead>
        <tr>
         <th>ID Documento</th>
         <th>ID Sector</th>
         <th>ID Alimento</th>
         <th>Fecha y Hora</th>
         <th>Cantidad (kg)</th>
         <th>Acciones</th>
        </tr>
       </thead>

       <tbody>
        {currentRecords.length > 0 ? (
         currentRecords.map((item) => (
          <tr key={item._id}>
           <td className="monospace">{item._id}</td>
           <td>{item.id_Sector}</td>
           <td>{item.id_Alimento}</td>
           <td>{formatDateTime(item.Fecha_hora)}</td>
           <td>{item.Cantidad}</td>

           <td>
            {/* BOTON EDITAR SIN NAVEGAR */}
            <button
             className="edit-button"
             onClick={() => setRegistroEditar(item)}
            >
             Editar
            </button>
           </td>
          </tr>
         ))
        ) : (
         <tr>
          <td colSpan="6" className="no-records">
           {error ? error : 'No se encontraron registros'}
          </td>
         </tr>
        )}
       </tbody>
      </table>

      {abastecimientos.length > recordsPerPage && (
       <div className="pagination"> 
        <button
         onClick={() => paginate(currentPage - 1)}
         disabled={currentPage === 1}
        >
         Anterior
        </button>
        <span>
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

   {/* FORMULARIO DE EDICIÓN */}
   {registroEditar && (
    <div className="edit-form-container">
     <h2>Editar Abastecimiento</h2>

     <label>ID Documento:</label>
     <input type="text" value={registroEditar._id} disabled />

     <label>ID Sector:</label>
     <input
      type="number"
      value={registroEditar.id_Sector}
      onChange={(e) =>
       setRegistroEditar({ ...registroEditar, id_Sector: e.target.value })
      }
     />

     <label>ID Alimento:</label>
     <input
      type="number"
      value={registroEditar.id_Alimento}
      onChange={(e) =>
       setRegistroEditar({ ...registroEditar, id_Alimento: e.target.value })
      }
     />

     <label>Cantidad (kg):</label>
     <input
      type="number"
      value={registroEditar.Cantidad}
      onChange={(e) =>
       setRegistroEditar({ ...registroEditar, Cantidad: e.target.value })
      }
     />

     <button className="add-button" onClick={handleGuardarEdicion}>
      Guardar Cambios
     </button>

     <button 
      className="bback-button" 
      onClick={() => setRegistroEditar(null)}
     >
      Cancelar
     </button>
    </div>
   )}

  </div>
 );
};

export default Get_Abastecimiento;
