import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../css/get-sctor.css";
const Spinner = () => <div className="spinner"></div>;
const usuarioId = "1"; // Sustituir por el ID del usuario real.
const tipoUsuario = 1; // Sustituir por el tipo de usuario real.

const Sector = () => {
  const [sectores, setSectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchSectores = async () => {
    setLoading(true);
    setError(null);
    setSearchTerm("");
    try {
      const response = await api.get("/api/g_sectores", {
        params: { id: usuarioId, tipo: tipoUsuario },
      });
      if (response.data.success && response.data.data) {
        setSectores(response.data.data);
      } else {
        setSectores([]);
        setError(response.data.error || "No hay registros disponibles");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar los registros");
      setSectores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectores();
  }, []);

  const filteredSectores = sectores.filter((sector) =>
    sector.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSectores.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSectores.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="gan-container">

      <h5 className="title">Consulta de Sectores</h5>

      <input
        type="text"
        placeholder="Buscar sector por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      className="custom-input"
          style={{ width: "350px", fontSize: "15px", padding: "4px" }}
      />

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
                  <th>ID Sector</th>
                  <th>Nombre</th>
                  <th>Ubicación</th>
                  <th>Capacidad (m²)</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((item) => (
                    <tr key={item.id_Sector}>
                      <td>{item.id_Sector}</td>
                      <td>{item.Nombre}</td>
                      <td>{item.Ubicacion}</td>
                      <td>{item.Capacidad}</td>
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

            {filteredSectores.length > recordsPerPage && (
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

export default Sector;
