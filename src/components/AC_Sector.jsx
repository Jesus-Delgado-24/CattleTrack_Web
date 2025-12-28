import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";
import "../css/sector.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const usuarioId = "1";
const tipoUsuario = 1;

const Sector = () => {
  const [sectores, setSectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    Nombre: "",
    Ubicacion: "",
    Capacidad: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchSectores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/g_sectores", {
        params: { id: usuarioId, tipo: tipoUsuario },
      });
      setSectores(response.data.data || []);
    } catch (err) {
      setError("Error al cargar los registros");
      setSectores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectores();
  }, []);

  const handleAdd = () => {
    setFormValues({ Nombre: "", Ubicacion: "", Capacidad: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (sector) => {
    setFormValues(sector);
    setEditingId(sector.id_Sector);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/a_sectors/${editingId}`, formValues);
      } else {
        await api.post("/api/r_sector", formValues);
      }
      setShowForm(false);
      fetchSectores();
    } catch {
      alert("Hubo un error al guardar los datos.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="sector-container">
      <h1 className="title">Gestión de Sectores</h1>
      <button className="add-button" onClick={handleAdd}>Añadir Nuevo Sector</button>
      
      <div className="table-container">
        {loading ? (
          <p className="loading">Cargando datos...</p>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Capacidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sectores.map((sector) => (
                <tr key={sector.id_Sector}>
                  <td>{sector.id_Sector}</td>
                  <td>{sector.Nombre}</td>
                  <td>{sector.Ubicacion}</td>
                  <td>{sector.Capacidad}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(sector)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingId ? "Editar Sector" : "Añadir Nuevo Sector"}</h2>
            <form onSubmit={handleSave}>
              <label>Nombre</label>
              <input
                type="text"
                name="Nombre"
                value={formValues.Nombre}
                onChange={handleInputChange}
                required
              />
              <label>Ubicación</label>
              <input
                type="text"
                name="Ubicacion"
                value={formValues.Ubicacion}
                onChange={handleInputChange}
                required
              />
              <label>Capacidad</label>
              <input
                type="number"
                name="Capacidad"
                value={formValues.Capacidad}
                onChange={handleInputChange}
                required
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-button">
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

export default Sector;
