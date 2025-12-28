import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// 1. Cambiamos la importación para que apunte a tu nuevo archivo CSS
import "../css/Diseño_General_tablas.css";
import api from "../lib/api";

const AC_Enfermedades = () => {
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de agregar
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Estado para el modal de actualizar
    const [isClosing, setIsClosing] = useState(false); // Estado para la animación de cierre
    const [currentEnfermedad, setCurrentEnfermedad] = useState(null); // Enfermedad seleccionada para actualizar
    const [enfermedades, setEnfermedades] = useState([]); // Lista de enfermedades desde la API
    const [isLoading, setIsLoading] = useState(true); // Estado para la carga de datos
    const [error, setError] = useState(null); // Estado para manejar errores

    const [newEnfermedad, setNewEnfermedad] = useState({
        Nombre: "",
        Tratamiento: "",
    }); // Estado para la nueva enfermedad

    // Función para obtener los datos de la API
    const fetchEnfermedades = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get("/api/g_enfermedades"); // Cambia la URL según tu API
            console.log("Respuesta de la API:", response.data); // Verifica qué devuelve la API
            setEnfermedades(Array.isArray(response.data.data) ? response.data.data : []);
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
        (enfermedad) => enfermedad.Nombre && enfermedad.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar el cierre del modal de agregar con animación
    const handleCloseModal = () => {
        setIsClosing(true); // Activa la animación de cierre
        setTimeout(() => {
            setIsModalOpen(false); // Cierra el modal después de la animación
            setIsClosing(false); // Resetea el estado de cierre
        }, 300); // Duración de la animación (300ms)
    };

    // Manejar el cierre del modal de actualizar con animación
    const handleCloseUpdateModal = () => {
        setIsClosing(true); // Activa la animación de cierre
        setTimeout(() => {
            setIsUpdateModalOpen(false); // Cierra el modal después de la animación
            setIsClosing(false); // Resetea el estado de cierre
        }, 300); // Duración de la animación (300ms)
    };

    // Manejar el cambio en los campos del formulario de agregar
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEnfermedad((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Manejar el cambio en los campos del formulario de actualizar
    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEnfermedad((prevState) => ({
            ...prevState,
            [name]: value, // Actualiza la clave correspondiente
        }));
    };

    // Manejar el envío del formulario de agregar
    const handleAddEnfermedad = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        const formattedEnfermedad = {
            ...newEnfermedad,
        };
        console.log("Datos enviados al agregar:", formattedEnfermedad); // Verifica los datos enviados
        try {
            const response = await api.post("/api/r_enfermedades", formattedEnfermedad); // Cambia la URL según tu API
            console.log("Respuesta de la API al agregar:", response.data);
            fetchEnfermedades(); // Recarga la lista de enfermedades
            setNewEnfermedad({ Nombre: "", Tratamiento: "" }); // Limpia los campos del formulario
            handleCloseModal(); // Cierra el modal
        } catch (err) {
            console.error("Error al agregar la enfermedad:", err.response?.data || err.message || err);
            setError("No se pudo agregar la enfermedad.");
        }
    };

    // Manejar el envío del formulario de actualizar
    const handleUpdateEnfermedad = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        const formattedEnfermedad = {
            Nombre: currentEnfermedad.Nombre, // Usa la clave correcta
            Tratamiento: currentEnfermedad.Tratamiento, // Usa la clave correcta
        };
        console.log("Datos enviados al actualizar:", formattedEnfermedad); // Verifica los datos enviados
        try {
            const response = await api.put(`/api/a_diseases/${currentEnfermedad.id_Enfermedad}`, formattedEnfermedad); // Cambia la URL según tu API
            console.log("Respuesta de la API al actualizar:", response.data);
            fetchEnfermedades(); // Recarga la lista de enfermedades
            handleCloseUpdateModal(); // Cierra el modal
        } catch (err) {
            console.error("Error al actualizar la enfermedad:", err.response?.data || err.message || err);
            setError("No se pudo actualizar la enfermedad.");
        }
    };

    // Manejar la apertura del modal de actualizar
    const handleUpdate = (enfermedad) => {
        setCurrentEnfermedad(enfermedad); // Establece la enfermedad seleccionada
        setIsUpdateModalOpen(true); // Abre el modal de actualización
    };

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

            {/* 5. 'add-button' ya coincide con tu CSS */}
            <div className="table-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <button
                    className="add-button"
                    onClick={() => setIsModalOpen(true)} // Abre el modal de agregar
                >
                    Agregar Enfermedad
                </button>
            </div>

            {isLoading ? (
                <div className="loading-container">
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
                                <th>Tratamiento</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnfermedades.map((enfermedad) => (
                                <tr key={enfermedad.id_Enfermedad}>
                                    <td>{enfermedad.id_Enfermedad}</td>
                                    <td>{enfermedad.Nombre}</td>
                                    <td>{enfermedad.Tratamiento}</td>
                                    <td>
                                        {/* 8. Aplicamos la clase 'edit-button' (botón amarillo) */}
                                        <button
                                            className="edit-button"
                                            onClick={() => handleUpdate(enfermedad)} // Abre el modal de actualizar
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
                        <h2>Agregar Enfermedad</h2>
                        <form onSubmit={handleAddEnfermedad}>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="Nombre"
                                    value={newEnfermedad.Nombre}
                                    onChange={handleInputChange}
                                    placeholder="Nombre de la enfermedad"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tratamiento">Tratamiento</label>
                                <input
                                    type="text"
                                    id="tratamiento"
                                    name="Tratamiento"
                                    value={newEnfermedad.Tratamiento}
                                    onChange={handleInputChange}
                                    placeholder="Tratamiento"
                                    required
                                />
                            </div>
                            {/* 12. Cambiamos 'modal-buttons' por 'modal-actions' */}
                            <div className="modal-actions">
                                {/* 13. 'cancel-button' y 'save-button' ya coinciden */}
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleCloseModal} // Cierra el modal
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
                        <h2>Actualizar Enfermedad</h2>
                        <form onSubmit={handleUpdateEnfermedad}>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="Nombre"
                                    value={currentEnfermedad?.Nombre || ""} // Usa la clave correcta
                                    onChange={handleUpdateInputChange}
                                    placeholder="Nombre de la enfermedad"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tratamiento">Tratamiento</label>
                                <input
                                    type="text"
                                    id="tratamiento"
                                    name="Tratamiento"
                                    value={currentEnfermedad?.Tratamiento || ""} // Usa la clave correcta
                                    onChange={handleUpdateInputChange}
                                    placeholder="Tratamiento"
                                    required
                                />
                            </div>
                            {/* 12. Cambiamos 'modal-buttons' por 'modal-actions' */}
                            <div className="modal-actions">
                                {/* 13. 'cancel-button' y 'save-button' ya coinciden */}
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleCloseUpdateModal} // Cierra el modal de actualización
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

export default AC_Enfermedades;