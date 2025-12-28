import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import '../css/C_HistorialReproduccion.css';

const EditarHistorialReproduccion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [originalData, setOriginalData] = useState(null);

  // Obtener los datos del registro a editar
  useEffect(() => {
    const fetchBreedingData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/b_h_reproduccion/${id}`);
        if (response.data) {
          const data = response.data;
          setFormData({
            id_Vaca: data.id_Vaca,
            id_Toro: data.id_Toro,
            Fecha_Gestion: data.Fecha_Gestion.split('T')[0],
            Fecha_Nacimiento: data.Fecha_Nacimiento?.split('T')[0] || '',
            Crias_Hembras: data.Crias_Hembras || 0,
            Crias_Macho: data.Crias_Macho || 0
          });
          setOriginalData(data);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('No se pudo cargar el registro para editar');
        navigate('/historial-reproduccion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreedingData();
  }, [id, navigate]);

  // Manejador de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.startsWith('Crias_') ? Math.max(0, parseInt(value) || 0) : value
    }));
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id_Vaca) newErrors.id_Vaca = 'ID Vaca requerido';
    if (!formData.id_Toro) newErrors.id_Toro = 'ID Toro requerido';
    if (!formData.Fecha_Gestion) newErrors.Fecha_Gestion = 'Fecha de gestión requerida';
    
    if (formData.Fecha_Gestion && formData.Fecha_Nacimiento) {
      const diffTime = new Date(formData.Fecha_Nacimiento) - new Date(formData.Fecha_Gestion);
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if (diffDays < 279) newErrors.Fecha_Nacimiento = 'La gestación debe durar al menos 280 días';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar los datos actualizados
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Confirmar antes de actualizar (porque se eliminarán y recrearán las crías)
    const confirmUpdate = window.confirm(
      '¿Está seguro que desea actualizar este registro? ' +
      'Todas las crías asociadas serán eliminadas y recreadas con los nuevos valores.'
    );
    if (!confirmUpdate) return;

    setIsLoading(true);
    try {
      const payload = {
        id_Vaca: parseInt(formData.id_Vaca),
        id_Toro: parseInt(formData.id_Toro),
        Fecha_Gestion: formData.Fecha_Gestion,
        Fecha_Nacimiento: formData.Fecha_Nacimiento || null,
        Crias_Hembras: formData.Crias_Hembras,
        Crias_Macho: formData.Crias_Macho
      };

      const response = await api.put(`/api/a_breeding/${id}`, payload);
      
      if (response.data.success) {
        alert('Registro actualizado correctamente');
        navigate('/historial-reproduccion');
      } else {
        throw new Error(response.data.error || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert(error.response?.data?.error || 'Error al actualizar el registro');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular diferencia de días entre fechas
  const calculateDaysDifference = () => {
    if (formData.Fecha_Gestion && formData.Fecha_Nacimiento) {
      const diffTime = new Date(formData.Fecha_Nacimiento) - new Date(formData.Fecha_Gestion);
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
    return null;
  };

  const daysDifference = calculateDaysDifference();

  if (isLoading && !originalData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando datos del registro...</p>
      </div>
    );
  }

  return (
    <div className="editar-historial-container">
      <h2>Editar Historial de Reproducción</h2>
      <p className="document-id">ID del documento: {id}</p>

      <form onSubmit={handleSubmit}>
        {/* ID Vaca */}
        <div className="form-group">
          <label>ID Vaca *</label>
          <input
            type="number"
            name="id_Vaca"
            value={formData.id_Vaca}
            onChange={handleChange}
            min="1"
            className={errors.id_Vaca ? 'error' : ''}
          />
          {errors.id_Vaca && <span className="error-message">{errors.id_Vaca}</span>}
        </div>

        {/* ID Toro */}
        <div className="form-group">
          <label>ID Toro *</label>
          <input
            type="number"
            name="id_Toro"
            value={formData.id_Toro}
            onChange={handleChange}
            min="1"
            className={errors.id_Toro ? 'error' : ''}
          />
          {errors.id_Toro && <span className="error-message">{errors.id_Toro}</span>}
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
            <label>Fecha Nacimiento</label>
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
            {daysDifference !== null && (
              <span className="days-difference">
                Días de gestación: {daysDifference} días
                {daysDifference < 279 && ' (Mínimo recomendado: 280 días)'}
              </span>
            )}
          </div>
        </div>

        {/* Crías */}
        <div className="form-row">
          <div className="form-group">
            <label>Crías Hembras</label>
            <input
              type="number"
              name="Crias_Hembras"
              value={formData.Crias_Hembras}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Crías Macho</label>
            <input
              type="number"
              name="Crias_Macho"
              value={formData.Crias_Macho}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Resumen de cambios */}
        {originalData && (
          <div className="changes-summary">
            <h3>Resumen de cambios:</h3>
            <ul>
              {originalData.id_Vaca !== formData.id_Vaca && (
                <li>ID Vaca: {originalData.id_Vaca} → {formData.id_Vaca}</li>
              )}
              {originalData.id_Toro !== formData.id_Toro && (
                <li>ID Toro: {originalData.id_Toro} → {formData.id_Toro}</li>
              )}
              {originalData.Fecha_Gestion !== formData.Fecha_Gestion && (
                <li>Fecha Gestación: {originalData.Fecha_Gestion.split('T')[0]} → {formData.Fecha_Gestion}</li>
              )}
              {originalData.Fecha_Nacimiento !== formData.Fecha_Nacimiento && (
                <li>Fecha Nacimiento: {originalData.Fecha_Nacimiento?.split('T')[0] || 'N/A'} → {formData.Fecha_Nacimiento || 'N/A'}</li>
              )}
              {originalData.Crias_Hembras !== formData.Crias_Hembras && (
                <li>Crías Hembras: {originalData.Crias_Hembras} → {formData.Crias_Hembras}</li>
              )}
              {originalData.Crias_Macho !== formData.Crias_Macho && (
                <li>Crías Macho: {originalData.Crias_Macho} → {formData.Crias_Macho}</li>
              )}
            </ul>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/historial-reproduccion')}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="save-button"
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarHistorialReproduccion;