import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// 1. Cambiamos la importación para que apunte a tu nuevo archivo CSS
import "../css/Diseño_General_tablas.css"; 
import api from "../lib/api";

// Componente de spinner para cargas
const Spinner = () => <div className="spinner"></div>;

const AC_Almacen = () => {
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de agregar
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Estado para el modal de actualizar
    const [isClosing, setIsClosing] = useState(false); // Estado para la animación de cierre
    const [currentAlmacen, setCurrentAlmacen] = useState(null); // Almacén seleccionado para actualizar
    const [almacenes, setAlmacenes] = useState([]); // Lista de almacenes desde la API
    const [isLoading, setIsLoading] = useState(true); // Estado para la carga de datos
    const [error, setError] = useState(null); // Estado para manejar errores

    const [newAlmacen, setNewAlmacen] = useState({
        Nombre: "",
        Tipo: "",
        Cantidad: "",
    }); // Estado para el nuevo almacén

    // Función para obtener los datos de la API
    const fetchAlmacenes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get("/api/g_almacenes"); 
            console.log("Respuesta de la API:", response.data); 
            setAlmacenes(Array.isArray(response.data.data) ? response.data.data : []); 
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

    // Manejar el cierre del modal de agregar con animación
    const handleCloseModal = () => {
        setIsClosing(true); 
        setTimeout(() => {
            setIsModalOpen(false); 
            setIsClosing(false); 
        }, 300); 
    };

    // Manejar el cierre del modal de actualizar con animación
    const handleCloseUpdateModal = () => {
        setIsClosing(true); 
        setTimeout(() => {
            setIsUpdateModalOpen(false); 
            setIsClosing(false); 
        }, 300); 
    };

    // Manejar el cambio en los campos del formulario de agregar
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAlmacen((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Manejar el cambio en los campos del formulario de actualizar
    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentAlmacen((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Manejar el envío del formulario de agregar
    const handleAddAlmacen = async (e) => {
        e.preventDefault(); 
        const formattedAlmacen = {
            ...newAlmacen,
            Cantidad: Number(newAlmacen.Cantidad), 
        };
        console.log("Datos enviados al agregar:", formattedAlmacen); 
        try {
            const response = await api.post("/api/r_alimento", formattedAlmacen); 
            console.log("Respuesta de la API al agregar:", response.data);
            fetchAlmacenes(); 
            setNewAlmacen({ Nombre: "", Tipo: "", Cantidad: "" }); 
            handleCloseModal(); 
        } catch (err) {
            console.error("Error al agregar el almacén:", err.response?.data || err.message || err);
            setError("No se pudo agregar el almacén.");
        }
    };

    // Manejar el envío del formulario de actualizar
    const handleUpdateAlmacen = async (e) => {
        e.preventDefault(); 
        const formattedAlmacen = {
            nombre: currentAlmacen.Nombre, 
            tipo: currentAlmacen.Tipo,
            cantidad: Number(currentAlmacen.Cantidad), 
        };
        console.log("Datos enviados al actualizar:", formattedAlmacen); 
        try {
            const response = await api.put(`/api/a_food/${currentAlmacen.id_Alimento}`, formattedAlmacen); 
            console.log("Respuesta de la API al actualizar:", response.data);
            fetchAlmacenes(); 
            handleCloseUpdateModal(); 
        } catch (err) {
            console.error("Error al actualizar el almacén:", err.response?.data || err.message || err);
            setError("No se pudo actualizar el almacén.");
        }
    };

    // Manejar la apertura del modal de actualizar
    const handleUpdate = (almacen) => {
        setCurrentAlmacen(almacen); 
        setIsUpdateModalOpen(true); 
    };

    return (
        // 2. Aplicamos la clase del contenedor principal
        <div className="sector-container">
            {/* 3. Aplicamos 'header-actions' */}
            <div className="header-actions">
                {/* 4. Aplicamos la clase del título */}
                <h2 className="title">Lista de Almacenes</h2>
                <input
                    type="text"
                    placeholder="Buscar almacén..."
                    className="search-input" // Esta clase no está en tu CSS, usará estilos por defecto
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </div>

            {/* 5. El botón "add-button" ya coincide con tu CSS */}
            <div className="table-header" style={{ textAlign: 'left', marginBottom: '20px' }}> {/* Alineado a la izquierda */}
                <button
                    className="add-button"
                    onClick={() => setIsModalOpen(true)} 
                >
                    Agregar Almacén
                </button>
            </div>

            {isLoading ? (
                <div className="loading-container">
                    <Spinner />
                    <p>Cargando datos...</p>
                </div>
            ) : error ? (
                <div className="error-message">⚠️ {error}</div>
            ) : (
                // 6. Añadimos el contenedor para el scroll
                <div className="tabla-scroll-container">
                    {/* 7. Aplicamos la clase de la tabla personalizada */}
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlmacenes.map((almacen) => (
                                <tr key={almacen.id_Alimento}>
                                    <td>{almacen.id_Alimento}</td>
                                    <td>{almacen.Nombre}</td>
                                    <td>{almacen.Tipo}</td>
                                    <td>{almacen.Cantidad}</td>
                                    <td>
                                        {/* 8. Aplicamos la clase 'edit-button' (botón amarillo) */}
                                        <button
                                            className="edit-button"
                                            onClick={() => handleUpdate(almacen)} 
                                        >
                                            Actualizar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de agregar */}
            {isModalOpen && (
                // 9. Cambiamos 'modal-overlay' por 'modal'
                <div className={`modal ${isClosing ? "closing" : "opening"}`}>
                    {/* 10. 'modal-content' ya coincide */}
                    <div className="modal-content">
                        {/* 11. Cambiamos h3 por h2 */}
                        <h2>Agregar Almacén</h2>
                        <form onSubmit={handleAddAlmacen}>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="Nombre"
                                    value={newAlmacen.Nombre}
                                    onChange={handleInputChange}
                                    placeholder="Nombre del almacén"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipo">Tipo</label>
                                <select
                                    id="tipo"
                                    name="Tipo"
                                    value={newAlmacen.Tipo}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Selecciona un tipo</option>
                                    <option value="Forraje">Forraje</option>
                                    <option value="Grano">Grano</option>
                                    <option value="Suplemento">Suplemento</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="cantidad">Cantidad</label>
                                <input
                                    type="number"
                                    id="cantidad"
                                    name="Cantidad"
                                    value={newAlmacen.Cantidad}
                                    onChange={handleInputChange}
                                    placeholder="Cantidad"
                                    required
                                />
                            </div>
                            {/* 12. Cambiamos 'modal-buttons' por 'modal-actions' */}
                            <div className="modal-actions">
                                {/* 13. 'cancel-button' y 'save-button' ya coinciden */}
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleCloseModal} 
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="save-button">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de actualizar */}
            {isUpdateModalOpen && (
                // 9. Cambiamos 'modal-overlay' por 'modal'
                <div className={`modal ${isClosing ? "closing" : "opening"}`}>
                    {/* 10. 'modal-content' ya coincide */}
                    <div className="modal-content">
                        {/* 11. Cambiamos h3 por h2 */}
                        <h2>Actualizar Almacén</h2>
                        <form onSubmit={handleUpdateAlmacen}>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="Nombre"
                                    value={currentAlmacen?.Nombre || ""}
                                    onChange={handleUpdateInputChange}
                                    placeholder="Nombre del almacén"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipo">Tipo</label>
                                <select
                                    id="tipo"
                                    name="Tipo"
                                    value={currentAlmacen?.Tipo || ""}
                                    onChange={handleUpdateInputChange}
                                    required
                                >
                                    <option value="">Selecciona un tipo</option>
                                    <option value="Forraje">Forraje</option>
                                    <option value="Grano">Grano</option>
                                    <option value="Suplemento">Suplemento</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="cantidad">Cantidad</label>
                                <input
                                    type="number"
                                    id="cantidad"
                                    name="Cantidad"
                                    value={currentAlmacen?.Cantidad || ""}
                                    onChange={handleUpdateInputChange}
                                    placeholder="Cantidad"
                                    required
                                />
                            </div>
                            {/* 12. Cambiamos 'modal-buttons' por 'modal-actions' */}
                            <div className="modal-actions">
                                {/* 13. 'cancel-button' y 'save-button' ya coinciden */}
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleCloseUpdateModal} 
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="save-button">
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AC_Almacen;