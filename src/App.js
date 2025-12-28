import React from 'react';
// 1. Quita 'Link' si no se usa aquí, no es necesario.
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

// --- Tus componentes de página (se quedan igual) ---
import Home from "./components/Home";
import Login from './components/Login';
import Enfermedades from './components/Get_Enfermedades';
import Almacen from './components/Get_Almacen';
import AC_Enfermedades from "./components/AC_Enfermedades";
import AC_Almacen from './components/AC_Almacen';
import A_HistorialReproduccion from './components/A_HistorialReproduccion';
import Get_HistorialReproduccion from './components/Get_HistorialReproduccion';
import C_HistorialReproduccion from './components/C_HistorialReproduccion';
import Get_Abastecimiento from './components/Get_Abastecimiento';
import C_Abastecimiento from './components/C_Abastecimiento';
import A_Abastecimiento from './components/A_Abastecimiento';
import AC_RegistrarMonitoreo from './components/AC_RegistrarMonitoreo';
import Get_Monitoreo from './components/Get_Monitoreo';
import Edit_Monitoreo from './components/Edit_MonitoreoTabla';
import Alta_ProdLeche from './components/Alta_ProdLeche';
import Get_Sector from './components/Get_Sector';
import Get_Ganado from './components/Get_Ganado';
import Get_ProdLeche from './components/Get_ProdLeche';
import AC_Sector from './components/AC_Sector';
import G_Veterinarios from './components/G_Veterinarios';
import GU_Veterinarios from './components/GU_Veterinarios';
import AgregarUsuario from './components/AgregarUsuario';
import GU_Usuario from './components/GU_Usuario';
import G_Usuarios from './components/G_Usuarios';
import G_HistorialReproduccion from './components/G_HistorialReproduccionSinEditar';
import miLogo from './images/fondo_empresa.png';
import './css/fondo.css';
// --- 2. TU PLANTILLA DE MENÚ ---
import Inicio2 from './components/Inicio_O';

// --- 3. PÁGINA DE BIENVENIDA (para /inicio2) ---
// Creamos un componente simple para la página de inicio en blanco
const Bienvenido = () => {
    return (
        <img 
        src="miLogo" 
        alt="Fondo" 
        className="imagen-fondo" 
      />
    );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- RUTAS PÚBLICAS (Sin menú) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dev" element={ <>{/* Tu ruta dev se queda igual */}</> } />

        {/* --- RUTAS PRIVADAS (CON MENÚ) --- */}
        {/* Usamos Inicio2 (Inicio_O.jsx) como el ELEMENTO "padre".
          Todas las rutas anidadas se renderizarán dentro de su <Outlet />
        */}
        <Route element={<Inicio2 />}>
            
            {/* Esta es la página de bienvenida que se muestra en /inicio2 */}
            <Route path="/inicio2" element={<Bienvenido />} />

            {/* Todas las demás páginas ahora son "hijas" */}
            <Route path="/enfermedades" element={<Enfermedades />} />
            <Route path="/almacen" element={<Almacen />} />
            <Route path="/AC_Enfermedades" element={<AC_Enfermedades />} />
            <Route path="/AC_Almacen" element={<AC_Almacen />} />
            <Route path="/historial/nuevo" element={<A_HistorialReproduccion />} />
            <Route path="/historial-reproduccion" element={<Get_HistorialReproduccion />} />
            <Route path="/historial/editar/:id" element={<C_HistorialReproduccion />} />
            <Route path="/historial-reproduccion-G" element={<G_HistorialReproduccion />} />
            <Route path="/abastecimiento" element={<Get_Abastecimiento />} />
            <Route path="/abastecimiento/editar/:id" element={<C_Abastecimiento />} />
            <Route path="/abastecimiento/nuevo" element={<A_Abastecimiento />} />
            <Route path="/monitoreo/nuevo" element={<AC_RegistrarMonitoreo />} />
            <Route path="/monitoreo" element={<Get_Monitoreo />} />
            <Route path="/monitoreo/editar/:id" element={<Edit_Monitoreo />} />
            <Route path="/veterinarios" element={<G_Veterinarios />} />
            <Route path="/veterinarios/editar" element={<GU_Veterinarios />} />
            <Route path="/usuario/nuevo" element={<AgregarUsuario />} />
            <Route path="/usuario" element={<G_Usuarios />} />
            <Route path="/usuario/editar" element={<GU_Usuario />} />
            <Route path="/Alta_ProdLeche" element={<Alta_ProdLeche />} />
            <Route path="/Get_Sector" element={<Get_Sector />} />
            <Route path="/Get_Ganado" element={<Get_Ganado />} />
            <Route path="/Get_ProdLeche" element={<Get_ProdLeche />} />
            <Route path="/AC_Sector" element={<AC_Sector />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;

