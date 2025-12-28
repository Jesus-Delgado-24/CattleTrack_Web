import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../css/get-ganado.css";

const Ganado = () => {
  const [ganado, setGanado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchGanado = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/g_ganado", {
          params: { id: "1", tipo: 1 },
        });
        setGanado(response.data.data || []);
      } catch (err) {
        setError("Error al cargar los registros");
        setGanado([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGanado();
  }, []);

  const filteredGanado = ganado.filter((item) =>
    item.id_Ganado.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredGanado.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredGanado.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>

      <div className="gan-container">
        <h5 className="title">Consulta de Ganado</h5>
        <input
          type="text"
          placeholder="Buscar ganado por ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="custom-input"
        />
      </div>

      <div className="gan-container">
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID Ganado</th>
                  <th>Sector</th>
                  <th>Género</th>
                  <th>Peso</th>
                  <th>Fecha Nacimiento</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((item) => (
                  <tr key={item.id_Ganado}>
                    <td>{item.id_Ganado}</td>
                    <td>{item.id_Sector}</td>
                    <td>{item.Genero}</td>
                    <td>{item.Peso}</td>
                    <td>{item.Fecha_Nacimiento}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            {ganado.length > recordsPerPage && (
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
export default Ganado;