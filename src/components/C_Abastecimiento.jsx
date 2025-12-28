import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import '../css/C_Abastecimiento.css';

const EditarAbastecimiento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_Sector: '',
    id_Alimento: '',
    Cantidad: 0
  });
  const [alimentos, setAlimentos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [stockDisponible, setStockDisponible] = useState(0);


  
  // Cargar datos iniciales y lista de alimentos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Obtener el registro de abastecimiento
        const [supplyResponse, alimentosResponse] = await Promise.all([
          api.get(`/api/b_abastecer/${id}`),
          api.get('/api/g_almacenes')
        ]);

        const supplyData = supplyResponse.data;
        setAlimentos(alimentosResponse.data.data || []);

        setFormData({
          id_Sector: supplyData.id_Sector,
          id_Alimento: supplyData.id_Alimento,
          Cantidad: supplyData.Cantidad
        });

        setOriginalData(supplyData);

        // Obtener stock actual del alimento seleccionado
        if (supplyData.id_Alimento) {
          const alimento = alimentosResponse.data.data.find(
            a => a.id_Alimento === supplyData.id_Alimento
          );
          if (alimento) {
            setStockDisponible(alimento.Cantidad);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('No se pudo cargar el registro para editar');
        navigate('/abastecimiento');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Cantidad' ? parseFloat(value) || 0 : value
    }));

    // Actualizar stock disponible cuando cambia el alimento
    if (name === 'id_Alimento') {
      const alimentoSeleccionado = alimentos.find(a => a.id_Alimento == value);
      if (alimentoSeleccionado) {
        setStockDisponible(alimentoSeleccionado.cantidad);
      }
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id_Sector) newErrors.id_Sector = 'Sector es requerido';
    if (!formData.id_Alimento) newErrors.id_Alimento = 'Alimento es requerido';
    if (formData.Cantidad <= 0) newErrors.Cantidad = 'Cantidad debe ser mayor a 0';
    
    // Validar stock solo si estamos reduciendo la cantidad
    if (originalData && formData.Cantidad > originalData.Cantidad) {
      const diferencia = formData.Cantidad - originalData.Cantidad;
      if (diferencia > stockDisponible) {
        newErrors.Cantidad = `Stock insuficiente. Disponible: ${stockDisponible}, Necesario: ${diferencia}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const confirmUpdate = window.confirm(
      '¿Está seguro que desea actualizar este registro de abastecimiento?\n' +
      'Esta acción actualizará tanto el registro como el inventario de alimentos.'
    );
    if (!confirmUpdate) return;

    setIsSubmitting(true);
    try {
      const response = await api.put(`/api/a_food/supply/${id}`, formData);
      
      if (response.data.success) {
        alert('Registro de abastecimiento actualizado correctamente');
        navigate('/abastecimiento');
      } else {
        throw new Error(response.data.error || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert(error.response?.data?.error || error.message || 'Error al actualizar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular diferencia de cantidad
  const calcularDiferencia = () => {
    if (!originalData) return 0;
    return originalData.Cantidad - formData.Cantidad;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando datos del abastecimiento...</p>
      </div>
    );
  }

  return (
    <div className="editar-abastecimiento-container">
      <h2>Editar Registro de Abastecimiento</h2>
      <p className="document-id">ID del documento: {id}</p>

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
          />
          {errors.Cantidad && <span className="error-message">{errors.Cantidad}</span>}
        </div>

        {/* Información de cambios */}
        {originalData && (
          <div className="changes-info">
            <h3>Resumen de cambios:</h3>
            <div className="info-grid">
              <div>
                <strong>Cantidad original:</strong>
                <span>{originalData.Cantidad} kg</span>
              </div>
              <div>
                <strong>Nueva cantidad:</strong>
                <span>{formData.Cantidad} kg</span>
              </div>
              <div>
                <strong>Diferencia:</strong>
                <span className={calcularDiferencia() > 0 ? 'positive' : 'negative'}>
                  {calcularDiferencia()} kg
                </span>
              </div>
              <div>
                <strong>Stock disponible:</strong>
                <span>{stockDisponible} kg</span>
              </div>
            </div>
          </div>
        )}

        

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
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarAbastecimiento;