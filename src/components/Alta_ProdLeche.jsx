import "../css/a-prodleche.css";
import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Spinner = () => <div className="spinner"></div>;
const usuarioId = "1"; // Sustituir por el ID del usuario real.
const tipoUsuario = 1; // Sustituir por el tipo de usuario real.

const ProduccionLeche = () => {
  const [produccion, setProduccion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({
    id_sector: "",
    cantidad: "",
    fecha: "",
  });

  // Obtener registros de producción de leche
  const fetchProduccion = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/g_proleche", {
        params: {
          id: usuarioId,
          tipo: tipoUsuario,
        },
      });
      if (response.data.success && response.data.data) {
        setProduccion(response.data.data);
      } else {
        setProduccion([]);
        setError(response.data.error || "No hay registros disponibles");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar los registros");
      setProduccion([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduccion();
  }, []);

  const handleAdd = () => {
    setFormValues({ id_sector: "", cantidad: "", fecha: "" });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id_sector: formValues.id_sector,
        cantidad: formValues.cantidad,
        fecha: formValues.fecha,
      };

      const response = await api.post("/api/r_produccion", payload);

      if (response.status >= 200 && response.status < 300) {
        setShowForm(false);
        fetchProduccion();
      } else {
        alert("Error inesperado al guardar los datos.");
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Hubo un error al guardar los datos.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="prod-container">
      <div className="title">Registro Producción de Leche</div>

      <div>
        <button className="add-button" onClick={handleAdd}>
          Añadir Nuevo Registro
        </button>
      </div>

      <div className="custom-table">
        {loading ? (
          <div className="loading-container">
            <Spinner />
            <p>Cargando datos...</p>
          </div>
        ) : (
          <table className="custom-table tabla-produccion">
            <thead>
                <tr>
                  <th>ID Producción</th>
                  <th>Sector</th>
                  <th>Cantidad (Litros)</th>
                  <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
              {produccion.length > 0 ? (
                produccion.map((item) => (
                  <tr key={item.id_L}>
                    <td>{item.id_L}</td>
                    <td>{item.id_Sector}</td>
                    <td>{item.Cantidad}</td>
                    <td>{item.Fecha}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-records">
                    {error || "No se encontraron registros"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Añadir Nuevo Registro</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Sector</label>
                <input
                  type="text"
                  name="id_sector"
                  value={formValues.id_sector}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Cantidad (Litros)</label>
                <input
                  type="number"
                  name="cantidad"
                  value={formValues.cantidad}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Selecciona Fecha Actual</label>
                <input
                  type="date"
                  name="fecha"
                  value={formValues.fecha}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-button" onClick={handleCancel}>
                  Cancelar
                </button>
                <button className="save-button" type="submit">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduccionLeche;
