// src/components/Home.jsx
import React from "react";
import { Container } from "react-bootstrap";
import CustomNavbar from "./Navbar";
import '../css/Home.css'; 
import InfoSlider from './InfoSlider'; 

import imgUsuarios from '../images/Usuarios.png'; // La que ya tenías
import imgVeterinarios from '../images/Veterinarios.png'; // Asumiendo que tienes esta imagen
import imgGanado from '../images/Ganado.png'; // Asumiendo que tienes esta imagen
import imgSectores from '../images/Sectores.png'; // Asumiendo que tienes esta imagen
import imgMonitoreos from '../images/Monitoreos.png'; // Asumiendo que tienes esta imagen
import imgAlmacen from '../images/Almacen_de_Alimentos.png'; // Asumiendo que tienes esta imagen
import imgEnfermedades from '../images/Enfermedades.png'; // Asumiendo que tienes esta imagen
import imgReproduccion from '../images/Historial _de_Reproducción.png'; // Asumiendo que tienes esta imagen
import imgLeche from '../images/Leche.png'; // Asumiendo que tienes esta imagen
import imgAbastecimiento from '../images/Abastecimiento_de_Alimento.png'; // Asumiendo que tienes esta imagen
import imgLogo from '../images/fondo_empresa.png'; 
const Home = () => {
  
  const sliderItems = [
    { 
      content: (
        <div>
          <h3>¿Qué es CattleTrack?</h3>
          <img src={imgLogo} alt="Logo" className="slider-image" />
          <p>Es una solución innovadora para el monitoreo y gestión de ganado vacuno, integrando tecnología API para brindar datos en tiempo real.</p>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Beneficios</h3>
          <ul className="slider-list">
            <li>Optimización de recursos</li>
            <li>Mejora en la toma de decisiones</li>
            <li>Reducción de riesgos</li>
            <li>Mayor eficiencia operativa</li>
          </ul>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Usuarios</h3>
          <img src={imgUsuarios} alt="Usuarios" className="slider-image" />
          <p>Gestiona perfiles de administrador, mánager de granja y veterinario, controlando el acceso a módulos específicos y protegiendo la información.</p>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Veterinarios</h3>
          <img src={imgVeterinarios} alt="Veterinarios" className="slider-image" />
          <p>Registra diagnósticos, administra recetas, agenda visitas de seguimiento y consulta el historial clínico completo de cada animal.</p>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Ganado</h3>
          <img src={imgGanado} alt="Ganado" className="slider-image" />
          <p>Crea una ficha individual para cada res, incluyendo su linaje genético, historial de peso, vacunaciones y estado reproductivo actual.</p>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Sectores y Lotes</h3>
          <img src={imgSectores} alt="Sectores" className="slider-image" />
          <p>Mapea tus potreros, monitorea la capacidad de forraje, gestiona la rotación de ganado y registra las fuentes de agua disponibles.</p>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Monitoreos de Salud</h3>
          <img src={imgMonitoreos} alt="Monitoreos" className="slider-image" />
          <p>Registra monitoreos de salud en tiempo real, detecta patrones de comportamiento anómalos y recibe alertas tempranas de posible enfermedad.</p>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Almacén de Alimentos</h3>
          <img src={imgAlmacen} alt="Almacén" className="slider-image" />
          <p>Controla el inventario de granos, suplementos y forraje. Gestiona lotes, fechas de caducidad, proveedores y costos de alimentación.</p>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Gestión de Enfermedades</h3>
          <img src={imgEnfermedades} alt="Enfermedades" className="slider-image" />
          <p>Lleva un registro detallado de enfermedades, aplica protocolos de cuarentena y administra calendarios de vacunación para prevenir brotes.</p>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Historial de Reproducción</h3>
          <img src={imgReproduccion} alt="Reproducción" className="slider-image" />
          <p>Maneja el inventario de semen, registra celos, inseminaciones, diagnósticos de preñez y partos, calculando la eficiencia reproductiva.</p>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Producción de Leche</h3>
          <img src={imgLeche} alt="Leche" className="slider-image" />
          <p>Registra la producción diaria por animal, analiza la calidad (grasa, proteína) y sigue las curvas de lactancia para optimizar la alimentación.</p>
        </div>
      ) 
    },
    { 
      content: (
        <div>
          <h3>Abastecimiento de Alimento</h3>
          <img src={imgAbastecimiento} alt="Abastecimiento" className="slider-image" />
          <p>Genera órdenes de compra automáticamente, pronostica el consumo y analiza los costos para optimizar el abastecimiento de alimento.</p>
        </div>
      ) 
    },
  
  ];

  return (
    <>
      <CustomNavbar />
      <Container className="home-container">
        
        <div className="welcome-card">
          <h1>Bienvenido a CattleTrack</h1>
          <p className="lead">
            Software de seguimiento de ganado vacuno mediante APIs.
          </p>
        </div>

        <InfoSlider items={sliderItems} />

      </Container>
    </>
  );
};

export default Home;
/*import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import CustomNavbar from "./Navbar";
import './Home.css';

const Home = () => {
  return (
    <>
      <CustomNavbar />
      <Container className="mt-5">
        <Card className="text-center bg-light p-5 border-0 shadow-sm mb-4">
          <Card.Body>
            <h1>Bienvenido a CattleTrack</h1>
            <p className="lead">
              Software de seguimiento de ganado vacuno mediante APIs.
            </p>
          </Card.Body>
        </Card>

        <Row className="mt-5">
          <Col md={6}>
            <h2>¿Qué es CattleTrack?</h2>
            <p>
              CattleTrack es una solución innovadora para el monitoreo y gestión
              de ganado vacuno, integrando tecnología API para brindar datos en
              tiempo real.
            </p>
          </Col>
          <Col md={6}>
            <h2>Características</h2>
            <ul>
              <li>Seguimiento individual de animales</li>
              <li>Registro de producción lechera</li>
              <li>Gestión de sectores y lotes</li>
              <li>Dashboard analítico</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
*/