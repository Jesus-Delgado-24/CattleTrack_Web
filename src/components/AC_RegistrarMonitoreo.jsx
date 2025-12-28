import React, { useState } from 'react';
import api from '../lib/api';
import '../css/A_HistorialReproduccion.css'; // Reutilizamos los mismos estilos

const AC_RegistrarMonitoreo = ({ onSuccess }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    id_Ganado: '',
    id_Veterinario: '',
    Temperatura: '',
    Frecuencia_Cardiaca: '',
    Nivel_Deshidratacion: '',
    Desglose: '',
    Historial_Enfermedades: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [desgloseItems, setDesgloseItems] = useState([]);
  const [currentDesglose, setCurrentDesglose] = useState('');

  // Manejador de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Agregar item al desglose
  const addDesgloseItem = () => {
    if (currentDesglose.trim()) {
      setDesgloseItems([...desgloseItems, currentDesglose]);
      setFormData(prev => ({
        ...prev,
        Desglose: [...desgloseItems, currentDesglose]
      }));
      setCurrentDesglose('');
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.id_Ganado) newErrors.id_Ganado = 'ID de Ganado requerido';
    if (!formData.id_Veterinario) newErrors.id_Veterinario = 'ID de Veterinario requerido';
    if (formData.Temperatura && (formData.Temperatura < 35 || formData.Temperatura > 42)) {
      newErrors.Temperatura = 'La temperatura debe estar entre 35°C y 42°C';
    }
    if (formData.Frecuencia_Cardiaca && (formData.Frecuencia_Cardiaca < 40 || formData.Frecuencia_Cardiaca > 120)) {
      newErrors.Frecuencia_Cardiaca = 'La frecuencia cardíaca debe estar entre 40 y 120 lpm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        id_Ganado: parseInt(formData.id_Ganado),
        id_Veterinario: parseInt(formData.id_Veterinario),
        Temperatura: formData.Temperatura ? parseFloat(formData.Temperatura) : undefined,
        Frecuencia_Cardiaca: formData.Frecuencia_Cardiaca ? parseInt(formData.Frecuencia_Cardiaca) : undefined,
        Fecha_Hora: new Date().toISOString()
      };

      const response = await api.post('/api/r_monitoreo', payload);

      if (response.status === 201) {
        alert(response.data.message);
        if (onSuccess) onSuccess();
        // Resetear formulario
        setFormData({
          id_Ganado: '',
          id_Veterinario: '',
          Temperatura: '',
          Frecuencia_Cardiaca: '',
          Nivel_Deshidratacion: '',
          Desglose: []
        });
        setDesgloseItems([]);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      const backendError = error.response?.data?.error || error.message || 'Error al registrar';
      alert(`Error del servidor: ${backendError}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ac-historial-container">
      <h2>Registro de Monitoreo</h2>
      <form onSubmit={handleSubmit}>
        {/* ID Ganado */}
        <div className="form-group">
          <label>ID Ganado *</label>
          <input
            type="number"
            name="id_Ganado"
            value={formData.id_Ganado}
            onChange={handleChange}
            placeholder="Ej: 123"
            min="1"
            className={errors.id_Ganado ? 'error' : ''}
          />
          {errors.id_Ganado && <span className="error-message">{errors.id_Ganado}</span>}
        </div>

        {/* ID Veterinario */}
        <div className="form-group">
          <label>ID Veterinario *</label>
          <input
            type="number"
            name="id_Veterinario"
            value={formData.id_Veterinario}
            onChange={handleChange}
            placeholder="Ej: 456"
            min="1"
            className={errors.id_Veterinario ? 'error' : ''}
          />
          {errors.id_Veterinario && <span className="error-message">{errors.id_Veterinario}</span>}
        </div>

        {/* Temperatura */}
        <div className="form-group">
          <label>Temperatura (°C)</label>
          <input
            type="number"
            name="Temperatura"
            value={formData.Temperatura}
            onChange={handleChange}
            placeholder="Ej: 38.5"
            step="0.1"
            min="35"
            max="42"
            className={errors.Temperatura ? 'error' : ''}
          />
          {errors.Temperatura && <span className="error-message">{errors.Temperatura}</span>}
        </div>

        {/* Frecuencia Cardíaca */}
        <div className="form-group">
          <label>Frecuencia Cardíaca (lpm)</label>
          <input
            type="number"
            name="Frecuencia_Cardiaca"
            value={formData.Frecuencia_Cardiaca}
            onChange={handleChange}
            placeholder="Ej: 80"
            min="40"
            max="120"
            className={errors.Frecuencia_Cardiaca ? 'error' : ''}
          />
          {errors.Frecuencia_Cardiaca && <span className="error-message">{errors.Frecuencia_Cardiaca}</span>}
        </div>

        {/* Nivel de Deshidratación */}
        <div className="form-group">
          <label>Nivel de Deshidratación</label>
          <select
            name="Nivel_Deshidratacion"
            value={formData.Nivel_Deshidratacion}
            onChange={handleChange}
          >
            <option value="">Seleccionar...</option>
            <option value="Leve">Leve</option>
            <option value="Moderado">Moderado</option>
            <option value="Severo">Severo</option>
          </select>
        </div>

        {/* Desglose */}
        <div className="form-group">
          <label>Desglose (Observaciones)</label>
          <div className="desglose-container">
            <input
              type="text"
              value={currentDesglose}
              onChange={(e) => setCurrentDesglose(e.target.value)}
              placeholder="Agregar observación"
            />
            <button type="button" onClick={addDesgloseItem} className="small-button">
              Agregar
            </button>
          </div>
          {desgloseItems.length > 0 && (
            <ul className="desglose-list">
              {desgloseItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Guardar Monitoreo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AC_RegistrarMonitoreo;