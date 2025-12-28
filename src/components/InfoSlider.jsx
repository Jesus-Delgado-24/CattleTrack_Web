// src/components/InfoSlider.jsx
import React, { useState, useEffect, useRef } from 'react'; // <-- 1. Importa useEffect y useRef
import '../css/InfoSlider.css'; 

const InfoSlider = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null); // <-- 2. Crea una referencia para el temporizador

  // Función para calcular la transformación de cada tarjeta
  const getTransform = (index) => {
    const diff = index - currentIndex;
    const absDiff = Math.abs(diff);

    if (absDiff === 0) return 'translateX(0%) scale(1.1)'; 
    if (absDiff === 1) return `translateX(${diff > 0 ? '100%' : '-100%'}) scale(0.9)`;
    if (absDiff === 2) return `translateX(${diff > 0 ? '200%' : '-200%'}) scale(0.8)`; 
    
    if (absDiff > 2) {
      if (diff > 0) return `translateX(300%) scale(0.7)`;
      return `translateX(-300%) scale(0.7)`;
    }

    return 'translateX(0%) scale(0.7)';
  };

  // --- 3. ¡AQUÍ ESTÁ LA LÓGICA DEL TEMPORIZADOR! ---
  useEffect(() => {
    // Si ya existe un temporizador, límpialo primero
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Inicia un nuevo temporizador que avanza al siguiente slide
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000); // 10000 milisegundos = 10 segundos

    // Función de limpieza: Se ejecuta si el componente se desmonta
    // o si 'currentIndex' cambia (reiniciando el temporizador)
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, items.length]); // <-- 4. Vuelve a ejecutar esto CADA vez que 'currentIndex' cambie

  return (
    <div className="info-slider-container">
      <div className="slider-track">
        {items.map((item, index) => (
          <div
            key={index}
            className={`slider-item ${index === currentIndex ? 'active' : ''}`}
            style={{ transform: getTransform(index) }}
            onClick={() => setCurrentIndex(index)} 
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSlider;
