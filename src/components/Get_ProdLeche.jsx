import React, { useState, useEffect } from "react";
import "../css/get-prodleche.css"; // Archivo CSS personalizado
import api from "../lib/api";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Spinner = () => <div className="spinner"></div>;
const usuarioId = "1"; // Sustituir por el ID del usuario real.
const tipoUsuario = 1; // Sustituir por el tipo de usuario real.

const ProduccionLeche = () => {
  const [produccion, setProduccion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Función para obtener todos los registros
  const fetchProduccion = async () => {
    setLoading(true);
    setError(null);
    setSearchTerm("");
    try {
      const response = await api.get("/api/g_proleche", {
        params: {
          id: usuarioId,
          tipo: tipoUsuario,
        },
      });
      if (response.data.success && response.data.data) {
        setProduccion(response.data.data);
      } else {
        setProduccion([]);
        setError(response.data.error || "No hay registros disponibles");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar los registros");
      setProduccion([]);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    fetchProduccion();
  }, []);

  // Filtrar los registros según el término de búsqueda
  const filteredprodleche = produccion.filter((produccionl) =>
    produccionl.id_L.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredprodleche.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(produccion.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="gan-container">

      {/* Título y buscador */}
      <div className="title">Registro Producción de Leche</div>
      <input
        type="text"
        className="custom-input"
        placeholder="Buscar producción por ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Tabla de producción */}
      <div className="table-container">
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
                  <th>ID Producción</th>
                  <th>Sector</th>
                  <th>Cantidad (Litros)</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((item) => (
                    <tr key={item.id_L}>
                      <td>{item.id_L}</td>
                      <td>{item.id_Sector}</td>
                      <td>{item.Cantidad}</td>
                      <td>{item.Fecha}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-records">
                      {error ? error : "No se encontraron registros"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            {produccion.length > recordsPerPage && (
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
    </div>
  );
  };

export default ProduccionLeche;