import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import '../css/A_Abastecimiento.css';

const RegistrarAbastecimiento = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_Sector: '',
    id_Alimento: '',
    Cantidad: ''
  });
  const [alimentos, setAlimentos] = useState([]);
  const [stockDisponible, setStockDisponible] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar lista de alimentos al iniciar
  useEffect(() => {
    const fetchAlimentos = async () => {
      try {
        const response = await api.get('/api/g_almacenes');
        setAlimentos(response.data.data || []);
      } catch (error) {
        console.error('Error al cargar alimentos:', error);
        alert('Error al cargar la lista de alimentos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlimentos();
  }, []);

  // Actualizar stock disponible cuando cambia el alimento seleccionado
  useEffect(() => {
    if (formData.id_Alimento) {
      const alimentoSeleccionado = alimentos.find(a => a.id_Alimento == formData.id_Alimento);
      if (alimentoSeleccionado) {
        setStockDisponible(alimentoSeleccionado.cantidad);
      } else {
        setStockDisponible(0);
      }
    } else {
      setStockDisponible(0);
    }
  }, [formData.id_Alimento, alimentos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id_Sector) newErrors.id_Sector = 'Seleccione un sector';
    if (!formData.id_Alimento) newErrors.id_Alimento = 'Seleccione un alimento';
    
    const cantidad = parseFloat(formData.Cantidad);
    if (isNaN(cantidad)) {
      newErrors.Cantidad = 'Ingrese una cantidad válida';
    } else if (cantidad <= 0) {
      newErrors.Cantidad = 'La cantidad debe ser mayor a 0';
    } else if (cantidad > stockDisponible) {
      newErrors.Cantidad = `Stock insuficiente. Disponible: ${stockDisponible}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const confirmacion = window.confirm(
      `¿Registrar abastecimiento de ${formData.Cantidad} kg al sector ${formData.id_Sector}?\n` +
      `Se descontarán ${formData.Cantidad} kg del alimento seleccionado.`
    );
    if (!confirmacion) return;

    setIsSubmitting(true);
    try {
      const payload = {
        id_Sector: parseInt(formData.id_Sector),
        id_Alimento: parseInt(formData.id_Alimento),
        Cantidad: parseFloat(formData.Cantidad)
      };

      const response = await api.post('/api/r_abastecimiento', payload);
      
      if (response.data.mensaje) {
        alert(response.data.mensaje);
        navigate('/abastecimiento');
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert(error.response?.data?.mensaje || 'Error al registrar el abastecimiento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="registrar-abastecimiento-container">
      <h2>Registrar Nuevo Abastecimiento</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Sector */}
        <div className="form-group">
          <label>ID Sector *</label>
          <input
            type="number"
            name="id_Sector"
            value={formData.id_Sector}
            onChange={handleChange}
            min="1"
            className={errors.id_Sector ? 'error' : ''}
            placeholder="Ingrese el ID del sector"
          />
          {errors.id_Sector && <span className="error-message">{errors.id_Sector}</span>}
        </div>

        {/* Alimento */}
        <div className="form-group">
          <label>Alimento *</label>
          <select
            name="id_Alimento"
            value={formData.id_Alimento}
            onChange={handleChange}
            className={errors.id_Alimento ? 'error' : ''}
          >
            <option value="">Seleccione un alimento</option>
            {alimentos.map(alimento => (
              <option key={alimento.id_Alimento} value={alimento.id_Alimento}>
                {alimento.Nombre} ({alimento.Tipo}) - Stock: {alimento.Cantidad} kg
              </option>
            ))}
          </select>
          {errors.id_Alimento && <span className="error-message">{errors.id_Alimento}</span>}
        </div>

        {/* Cantidad */}
        <div className="form-group">
          <label>Cantidad (kg) *</label>
          <input
            type="number"
            name="Cantidad"
            value={formData.Cantidad}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            className={errors.Cantidad ? 'error' : ''}
            placeholder="Ingrese la cantidad"
          />
          {errors.Cantidad && <span className="error-message">{errors.Cantidad}</span>}
          {formData.id_Alimento && (
            <div className="stock-info">
              Stock disponible: <strong>{stockDisponible} kg</strong>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/abastecimiento')}
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="save-button"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Abastecimiento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarAbastecimiento;