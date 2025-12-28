import React, { useState, useEffect } from "react";
// 1. Cambiamos la importación para que apunte a tu nuevo archivo CSS
import "../css/Diseño_General_tablas.css"; 
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../lib/api";

// Componente de spinner para cargas
const Spinner = () => <div className="spinner"></div>;

const Get_Almacen = () => {
    const [almacenes, setAlmacenes] = useState([]); // Lista de almacenes
    const [isLoading, setIsLoading] = useState(true); // Estado para la carga de datos
    const [error, setError] = useState(null); // Estado para manejar errores
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const recordsPerPage = 10; // Registros por página

    // Función para obtener los datos de la API
    const fetchAlmacenes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get("/api/g_almacenes"); // Cambia la URL según tu API
            console.log("Respuesta de la API:", response.data); // Verifica qué devuelve la API
            setAlmacenes(Array.isArray(response.data.data) ? response.data.data : []); // Accede a response.data.data
        } catch (err) {
            console.error("Error al obtener los datos:", err);
            setError("No se pudieron cargar los datos.");
            setAlmacenes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAlmacenes();
    }, []);

    // Filtrar los almacenes según el término de búsqueda
    const filteredAlmacenes = almacenes.filter((almacen) =>
        almacen.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredAlmacenes.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredAlmacenes.length / recordsPerPage);

    console.log("Contenido de almacenes:", almacenes);
    console.log("Índice inicial:", indexOfFirstRecord);
    console.log("Índice final:", indexOfLastRecord);
    console.log("Registros actuales:", currentRecords);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        // 2. Aplicamos la clase del contenedor principal
        <div className="sector-container">

            {/* 3. Aplicamos la clase 'header-actions' (asumiendo que existe en tu CSS) */}
            <div className="header-actions"> 
                {/* 4. Aplicamos la clase del título */}
                <h2 className="title">Lista de Almacenes</h2>
                <input
                    type="text"
                    placeholder="Buscar almacén..."
                    className="search-input" // Tu CSS no define 'search-input', se quedará con el estilo por defecto
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
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map((almacen) => (
                                    <tr key={almacen.id_Alimento}>
                                        <td>{almacen.id_Alimento}</td>
                                        <td>{almacen.Nombre}</td>
                                        <td>{almacen.Tipo}</td>
                                        <td>{almacen.Cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* 7. La paginación no tiene estilos en tu CSS, se quedará por defecto */}
                        {filteredAlmacenes.length > recordsPerPage && (
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
                    <p>No se encontraron almacenes.</p>
                )}
            </div>
        </div>
    );
};

export default Get_Almacen;