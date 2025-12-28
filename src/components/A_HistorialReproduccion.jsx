import React, { useState } from 'react';
import api from '../lib/api'; // Cambia axios por tu instancia configurada
import '../css/A_HistorialReproduccion.css';

const AC_HistorialReproduccion = ({ onSuccess }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    id_Vaca: '',
    id_Toro: '',
    Fecha_Gestion: '',
    Fecha_Nacimiento: '',
    Crias_Hembras: 0,
    Crias_Macho: 0
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Manejador de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.startsWith('Crias_') ? Math.max(0, parseInt(value) || 0) : value
    }));
  };

  // Validación local antes de enviar
  const validateForm = () => {
    const newErrors = {};
    if (!formData.id_Vaca) newErrors.id_Vaca = 'ID Vaca requerido';
    if (!formData.id_Toro) newErrors.id_Toro = 'ID Toro requerido';
    if (!formData.Fecha_Gestion) newErrors.Fecha_Gestion = 'Fecha de gestión requerida';
    if (!formData.Fecha_Nacimiento) newErrors.Fecha_Nacimiento = 'Fecha de nacimiento requerida';
    
    // Validación de fechas
    if (formData.Fecha_Gestion && formData.Fecha_Nacimiento) {
      const diffTime = new Date(formData.Fecha_Nacimiento) - new Date(formData.Fecha_Gestion);
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if (diffDays < 279) newErrors.Fecha_Nacimiento = 'La gestación debe durar al menos 280 días';
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
        id_Vaca: parseInt(formData.id_Vaca),
        id_Toro: parseInt(formData.id_Toro),
        Fecha_Gestion: new Date(formData.Fecha_Gestion).toISOString(),
        Fecha_Nacimiento: new Date(formData.Fecha_Nacimiento).toISOString(),
        Crias_Hembras: formData.Crias_Hembras,
        Crias_Macho: formData.Crias_Macho
      };

      const response = await api.post('/api/r_reproduccion', payload);

      // Solo mostrar alerta si el status es 200 o 201
      if (response.status === 200 || response.status === 201) {
        alert(response.data.mensaje);
        if (onSuccess) onSuccess(); // Recargar lista o limpiar formulario
      } else {
        alert(`Error inesperado: ${response.statusText}`);
      }
    } catch (error) {
      // Mostrar el error solo si realmente hay un error de red o del backend
      console.error('Error en el registro:', error);
      const backendError = error.response?.data?.error || error.message || 'Error al registrar';
      alert(`Error del servidor: ${backendError}`);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="ac-historial-container">
      <h2>Registro de Reproducción</h2>
      <form onSubmit={handleSubmit}>
        {/* ID Vaca */}
        <div className="form-group">
          <label>ID Vaca *</label>
          <input
            type="number"
            name="id_Vaca"
            value={formData.id_Vaca}
            onChange={handleChange}
            placeholder="Ej: 5"
            min="1"
            className={errors.id_Vaca ? 'error' : ''}
          />
          {errors.id_Vaca && <span className="error-message">{errors.id_Vaca}</span>}
          <small className="hint">Debe ser una hembra registrada</small>
        </div>

        {/* ID Toro */}
        <div className="form-group">
          <label>ID Toro *</label>
          <input
            type="number"
            name="id_Toro"
            value={formData.id_Toro}
            onChange={handleChange}
            placeholder="Ej: 3"
            min="1"
            className={errors.id_Toro ? 'error' : ''}
          />
          {errors.id_Toro && <span className="error-message">{errors.id_Toro}</span>}
          <small className="hint">Debe ser un macho registrado</small>
        </div>

        {/* Fechas */}
        <div className="form-row">
          <div className="form-group">
            <label>Fecha Gestación *</label>
            <input
              type="date"
              name="Fecha_Gestion"
              value={formData.Fecha_Gestion}
              onChange={handleChange}
              className={errors.Fecha_Gestion ? 'error' : ''}
            />
            {errors.Fecha_Gestion && <span className="error-message">{errors.Fecha_Gestion}</span>}
          </div>
          <div className="form-group">
            <label>Fecha Nacimiento *</label>
            <input
              type="date"
              name="Fecha_Nacimiento"
              value={formData.Fecha_Nacimiento}
              onChange={handleChange}
              min={formData.Fecha_Gestion}
              className={errors.Fecha_Nacimiento ? 'error' : ''}
            />
            {errors.Fecha_Nacimiento && (
              <span className="error-message">{errors.Fecha_Nacimiento}</span>
            )}
          </div>
        </div>

        {/* Crías Hembras */}
        <div className="form-group">
          <label>Crías Hembras</label>
          <input
            type="number"
            name="Crias_Hembras"
            value={formData.Crias_Hembras === 0 ? '' : formData.Crias_Hembras}
            onChange={handleChange}
            min="0"
            placeholder="0"
          />
        </div>

        {/* Crías Macho */}
        <div className="form-group">
          <label>Crías Macho</label>
          <input
            type="number"
            name="Crias_Macho"
            value={formData.Crias_Macho === 0 ? '' : formData.Crias_Macho}
            onChange={handleChange}
            min="0"
            placeholder="0"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Guardar Historial'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AC_HistorialReproduccion;