import React, { useState } from "react";
import "../css/Inicio_O.css"; // Asegúrate que la ruta al CSS sea correcta
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";

const Inicio_O = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id, tipo } = location.state || {};

    // Estado para el sidebar principal (¡esto ya lo tenías bien!)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // --- ¡NUEVO! ---
    // Estado para controlar QUÉ submenú está abierto.
    // 'null' significa que ninguno está abierto.
    const [openSubmenu, setOpenSubmenu] = useState(null);

    // Función para abrir/cerrar el sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        // Opcional: Cierra cualquier submenú que esté abierto si colapsas la barra
        if (isSidebarOpen) {
            setOpenSubmenu(null);
        }
    };

    // --- ¡NUEVO! ---
    // Función para manejar el clic en un submenú
    const handleSubmenuClick = (menuId) => {
        // Si haces clic en el que ya está abierto, se cierra (set a null)
        // Si haces clic en uno nuevo, se abre (set al menuId)
        setOpenSubmenu(prevOpenSubmenu => (prevOpenSubmenu === menuId ? null : menuId));
    };


    // --- Tu lógica de permisos (Se queda igual) ---
    const canShowCard = (cardId) => {
        if (tipo === 1) return true;
        if (tipo === 2) return true;
        if (tipo === 4 && cardId !== "card-1" && cardId !== "card-2") return true;
        if (tipo === 3 && cardId !== "card-1" && cardId !== "card-2" && cardId !== "card-5" && cardId !== "card-7" && cardId !== "card-8") return true;
        return false;
    };

    const canShowButton = (buttonId) => {
        if (tipo === 1) return true;
        if (tipo === 2 && (buttonId === "btn-1-1" || buttonId === "btn-1-3" || buttonId === "btn-5-1" || buttonId === "btn-5-3" || buttonId === "btn-8-1" || buttonId === "btn-8-3" || buttonId === "btn-2-1" || buttonId === "btn-4-1" || buttonId === "btn-6-1" || buttonId === "btn-7-1" || buttonId === "btn-9-1" || buttonId === "btn-10-1")) return false;
        if (tipo === 4 && (buttonId === "btn-9-1" || buttonId === "btn-10-1" || buttonId === "btn-4-1" || buttonId === "btn-6-1")) return false;
        if (tipo === 3 && (buttonId === "btn-4-1")) return false;
        return true;
    };

    return (
        <div className="layout-container">
            <div className="top-bar">
                <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                    ☰
                </button>
                <div className="top-bar-right">
                    <span className="welcome-text">Usuario tipo: {tipo}</span>
                    <button
                        className="boton"
                        onClick={() => navigate("/")}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
            <nav className={`sidebar-container ${!isSidebarOpen ? 'collapsed' : ''}`}>
                <ul className="sidebar-list">
                    
                    {/* Inicio (simple) - Este no necesita acordeón */}
                    <li className="sidebar-item">
                        <Link to="/inicio2" state={{ id, tipo }}>Inicio</Link>
                    </li>

                    {/* Menú Usuarios (¡MODIFICADO!) */}
                    {canShowCard("card-1") && (
                        // 1. Añade la clase 'open' si el estado 'openSubmenu' coincide con 'usuarios'
                        <li className={`sidebar-dropdown ${openSubmenu === 'usuarios' ? 'open' : ''}`}>
                            
                            {/* 2. Cambia <a> por <div> y añade el onClick */}
                            <div className="sidebar-dropdown-toggle" onClick={() => handleSubmenuClick('usuarios')}>
                                Usuarios ▼
                            </div>
                            
                            {/* 3. El <ul> ahora es un acordeón controlado por CSS y la clase .open */}
                            <ul className="sidebar-submenu">
                                {canShowButton("btn-1-1") && <li><Link to="/usuario/nuevo" state={{ id, tipo }}>Alta</Link></li>}
                                {canShowButton("btn-1-3") && <li><Link to="/usuario/editar" state={{ id, tipo }}>Administrar</Link></li>}
                                {canShowButton("btn-1-2") && <li><Link to="/usuario" state={{ id, tipo }}>Ver</Link></li>}
                            </ul>
                        </li>
                    )}

                    {/* Menú Veterinarios (¡MODIFICADO!) */}
                    {canShowCard("card-2") && (
                        <li className={`sidebar-dropdown ${openSubmenu === 'veterinarios' ? 'open' : ''}`}>
                            <div className="sidebar-dropdown-toggle" onClick={() => handleSubmenuClick('veterinarios')}>
                                Veterinarios ▼
                            </div>
                            <ul className="sidebar-submenu">
                                {canShowButton("btn-2-1") && <li><Link to="/veterinarios/editar" state={{ id, tipo }}>Administrar</Link></li>}
                                {canShowButton("btn-2-2") && <li><Link to="/veterinarios" state={{ id, tipo }}>Ver</Link></li>}
                            </ul>
                        </li>
                    )}

                    {/* Menú Ganado (simple) */}
                    {canShowCard("card-3") && (
                        <li className="sidebar-item">
                            <Link to="/Get_Ganado" state={{ id, tipo }}>Ganado</Link>
                        </li>
                    )}

                    {/* Menú Sectores (¡MODIFICADO!) */}
                    {canShowCard("card-4") && (
                        <li className={`sidebar-dropdown ${openSubmenu === 'sectores' ? 'open' : ''}`}>
                            <div className="sidebar-dropdown-toggle" onClick={() => handleSubmenuClick('sectores')}>
                                Sectores ▼
                            </div>
                            <ul className="sidebar-submenu">
                                {canShowButton("btn-4-1") && <li><Link to="/AC_Sector" state={{ id, tipo }}>Administrar</Link></li>}
                                {canShowButton("btn-4-2") && <li><Link to="/Get_Sector" state={{ id, tipo }}>Ver</Link></li>}
                            </ul>
                        </li>
                    )}

                    {/* Menú Monitoreos (¡MODIFICADO!) */}
                    {canShowCard("card-5") && (
                        <li className={`sidebar-dropdown ${openSubmenu === 'monitoreos' ? 'open' : ''}`}>
                            <div className="sidebar-dropdown-toggle" onClick={() => handleSubmenuClick('monitoreos')}>
                                Monitoreos ▼
                            </div>
                            <ul className="sidebar-submenu">
                                {canShowButton("btn-5-1") && <li><Link to="/monitoreo/nuevo" state={{ id, tipo }}>Alta</Link></li>}
                                {canShowButton("btn-5-3") && <li><Link to="/monitoreo/editar/:id" state={{ id, tipo }}>Administrar</Link></li>}
                                {canShowButton("btn-5-2") && <li><Link to="/monitoreo" state={{ id, tipo }}>Ver</Link></li>}
                            </ul>
                        </li>
                    )}

                    {/* Menú Almacén (¡MODIFICADO!) */}
                    {canShowCard("card-6") && (
                        <li className={`sidebar-dropdown ${openSubmenu === 'almacen' ? 'open' : ''}`}>
                            <div className="sidebar-dropdown-toggle" onClick={() => handleSubmenuClick('almacen')}>
                                Almacén ▼
                            </div>
                            <ul className="sidebar-submenu">
                                {canShowButton("btn-6-1") && <li><Link to="/AC_Almacen" state={{ id, tipo }}>Administrar</Link></li>}
                                {canShowButton("btn-6-2") && <li><Link to="/almacen" state={{ id, tipo }}>Ver</Link></li>}
                            </ul>
                        </li>
                    )}

                    {/* Menú Enfermedades (¡MODIFICADO!) */}
                    {canShowCard("card-7") && (
                        <li className={`sidebar-dropdown ${openSubmenu === 'enfermedades' ? 'open' : ''}`}>
                            <div className="sidebar-dropdown-toggle" onClick={() => handleSubmenuClick('enfermedades')}>
                                Enfermedades ▼
                            </div>
                            <ul className="sidebar-submenu">
                                {canShowButton("btn-7-1") && <li><Link to="/AC_Enfermedades" state={{ id, tipo }}>Administrar</Link></li>}
                                {canShowButton("btn-7-2") && <li><Link to="/enfermedades" state={{ id, tipo }}>Ver</Link></li>}
                            </ul>
                        </li>
                    )}

                    {/* Menú Reproducción (¡MODIFICADO!) */}
                    {canShowCard("card-8") && (
                        <li className={`sidebar-dropdown ${openSubmenu === 'reproduccion' ? 'open' : ''}`}>
                            <div className="sidebar-dropdown-toggle" onClick={() => handleSubmenuClick('reproduccion')}>
                                Reproducción ▼
                            </div>
                            <ul className="sidebar-submenu">
                                {canShowButton("btn-8-1") && <li><Link to="/historial/nuevo" state={{ id, tipo }}>Alta</Link></li>}
                                {canShowButton("btn-8-3") && <li><Link to="/historial-reproduccion" state={{ id, tipo }}>Administrar</Link></li>}
                                {canShowButton("btn-8-2") && <li><Link to="/historial-reproduccion-G" state={{ id, tipo }}>Ver</Link></li>}
                            </ul>
                        </li>
                    )}

                    {/* Menú Leche (¡MODIFICADO!) */}
                    {canShowCard("card-9") && (
                        <li className={`sidebar-dropdown ${openSubmenu === 'leche' ? 'open' : ''}`}>
                            <div className="sidebar-dropdown-toggle" onClick={() => handleSubmenuClick('leche')}>
                                Leche ▼
                            </div>
                            {/* Corregí 'navbar-submenu' por 'sidebar-submenu' */}
                            <ul className="sidebar-submenu">
                                {canShowButton("btn-9-1") && <li><Link to="/Alta_ProdLeche" state={{ id, tipo }}>Administrar</Link></li>}
                                {canShowButton("btn-9-2") && <li><Link to="/Get_ProdLeche" state={{ id, tipo }}>Ver</Link></li>}
                            </ul>
                        </li>
                    )}

                    {/* Menú Abastecimiento (¡MODIFICADO!) */}
                    {canShowCard("card-10") && (
                        <li className={`sidebar-dropdown ${openSubmenu === 'abastecimiento' ? 'open' : ''}`}>
                            <div className="sidebar-dropdown-toggle" onClick={() => handleSubmenuClick('abastecimiento')}>
                                Abastecimiento ▼
                            </div>
                            {/* Corregí 'navbar-submenu' por 'sidebar-submenu' */}
                            <ul className="sidebar-submenu">
                                {canShowButton("btn-10-1") && <li><Link to="/abastecimiento/nuevo" state={{ id, tipo }}>Alta</Link></li>}
                                {canShowButton("btn-10-2") && <li><Link to="/abastecimiento" state={{ id, tipo }}>Ver</Link></li>}
                            </ul>
                        </li>
                    )}
                </ul>
            </nav>

            {/* --- 3. CONTENEDOR PRINCIPAL DEL CONTENIDO --- */}
            <main className={`main-content ${!isSidebarOpen ? 'collapsed' : ''}`}>
                <Outlet context={{ id, tipo }} />
            </main>
        </div>
    );
};

export default Inicio_O;