import React, { useState, useEffect } from "react";
// 1. Cambiamos la importación para que apunte a tu nuevo archivo CSS
import "../css/Diseño_General_tablas.css";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../lib/api";

// Componente de spinner para cargas
const Spinner = () => <div className="spinner"></div>;

const Get_Enfermedades = () => {
    const [enfermedades, setEnfermedades] = useState([]); // Lista de enfermedades
    const [isLoading, setIsLoading] = useState(true); // Estado para la carga de datos
    const [error, setError] = useState(null); // Estado para manejar errores
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const recordsPerPage = 10; // Registros por página

    // Función para obtener los datos de la API
    const fetchEnfermedades = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get("/api/g_enfermedades"); // Cambia la URL según tu API
            console.log("Respuesta de la API:", response.data); // Verifica qué devuelve la API
            setEnfermedades(Array.isArray(response.data.data) ? response.data.data : []); // Accede a response.data.data
        } catch (err) {
            console.error("Error al obtener los datos:", err);
            setError("No se pudieron cargar los datos.");
            setEnfermedades([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnfermedades();
    }, []);

    // Filtrar las enfermedades según el término de búsqueda
    const filteredEnfermedades = enfermedades.filter(
        (enfermedad) =>
            enfermedad.Nombre &&
            enfermedad.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredEnfermedades.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredEnfermedades.length / recordsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        // 2. Aplicamos la clase del contenedor principal
        <div className="sector-container">

            {/* 3. Aplicamos 'header-actions' */}
            <div className="header-actions">
                {/* 4. Aplicamos la clase del título */}
                <h2 className="title">Lista de Enfermedades</h2>
                <input
                    type="text"
                    placeholder="Buscar enfermedad..."
                    className="search-input" // Esta clase no está en tu CSS
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </div>

            {/* 5. Aplicamos la clase del contenedor de la tabla (para el scroll) */}
            <div className="tabla-scroll-container">
                {isLoading ? (
                    <div className="loading-container">
                        <Spinner />
                        <p>Cargando datos...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">⚠️ {error}</div>
                ) : currentRecords.length > 0 ? (
                    <>
                        {/* 6. Aplicamos la clase de la tabla personalizada */}
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Tratamiento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map((enfermedad) => (
                                    <tr key={enfermedad.id_Enfermedad}>
                                        <td>{enfermedad.id_Enfermedad}</td>
                                        <td>{enfermedad.Nombre}</td>
                                        <td>{enfermedad.Tratamiento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* 7. La paginación no tiene estilos en tu CSS */}
                        {filteredEnfermedades.length > recordsPerPage && (
                            <div className="pagination" style={{ marginTop: '20px' }}>
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </button>
                                <span style={{ margin: '0 10px' }}>
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
                ) : (
                    <p>No se encontraron enfermedades.</p>
                )}
            </div>
        </div>
    );
};

export default Get_Enfermedades;