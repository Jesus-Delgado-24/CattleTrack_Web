import React, { useState } from 'react';
import axios from 'axios';
import '../css/Usuarios.css';

const AgregarUsuario = () => {
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido_P: '',
    Apellido_M: '',
    Email: '',
    Telefono: '',
    Contraseña: '',
    Tipo_U: '',
    Id_Sector: '',
    Especialidad: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tipoU = Number(formData.Tipo_U);

    const updatedFormData = {
      ...formData,
      Tipo_U: tipoU,
      Id_Sector: tipoU === 4 ? Number(formData.Id_Sector) : null,
      Especialidad: tipoU === 4 ? formData.Especialidad : null
    };

    console.log("Enviando datos:", updatedFormData);

    try {
      const res = await axios.post('http://localhost:5000/api/r_usuario', updatedFormData);
      alert(res.data.mensaje);

      // Limpiar formulario tras éxito
      setFormData({
        Nombre: '',
        Apellido_P: '',
        Apellido_M: '',
        Email: '',
        Telefono: '',
        Contraseña: '',
        Tipo_U: '',
        Id_Sector: '',
        Especialidad: ''
      });
    } catch (err) {
      console.error('Error:', err.response || err);
      alert(err.response?.data?.mensaje || 'Error al crear el usuario');
    }
  };

  return (
    <form className="ac-historial-container" onSubmit={handleSubmit}>
      <h2>Agregar Usuario</h2>

      {/* Grupo: Nombre, Apellido Paterno, Apellido Materno */}
      <div className="form-row">
        {['Nombre', 'Apellido_P', 'Apellido_M'].map(field => (
          <div className="form-group" key={field}>
            <label>{field}</label>
            <input
              name={field}
              type="text"
              value={formData[field]}
              onChange={handleChange}
              placeholder={field}
            />
          </div>
        ))}
      </div>

      {/* Grupo: Email, Teléfono, Contraseña */}
      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input
            name="Email"
            type="email"
            value={formData.Email}
            onChange={handleChange}
            placeholder="Correo electrónico"
          />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input
            name="Telefono"
            type="text"
            value={formData.Telefono}
            onChange={handleChange}
            placeholder="Teléfono"
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            name="Contraseña"
            type="password"
            value={formData.Contraseña}
            onChange={handleChange}
            placeholder="Contraseña"
          />
        </div>
      </div>

      {/* Tipo de usuario */}
      <div className="form-group">
        <label>Tipo de Usuario</label>
        <select
          name="Tipo_U"
          value={formData.Tipo_U}
          onChange={handleChange}
        >
          <option value="">Seleccione Tipo de Usuario</option>
          <option value="1">Tipo 1 Dueño</option>
          <option value="2">Tipo 2 Administrador</option>
          <option value="3">Tipo 3 Empleado</option>
          <option value="4">Tipo 4 Veterinario</option>
        </select>
      </div>

      {/* Solo si es veterinario */}
      {formData.Tipo_U === '4' && (
        <div className="form-row">
          <div className="form-group">
            <label>Sector</label>
            <input
              name="Id_Sector"
              type="text"
              value={formData.Id_Sector}
              onChange={handleChange}
              placeholder="Sector"
            />
          </div>
          <div className="form-group">
            <label>Especialidad</label>
            <input
              name="Especialidad"
              type="text"
              value={formData.Especialidad}
              onChange={handleChange}
              placeholder="Especialidad"
            />
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="submit">Registrar</button>
      </div>
    </form>
  );
};

export default AgregarUsuario;
