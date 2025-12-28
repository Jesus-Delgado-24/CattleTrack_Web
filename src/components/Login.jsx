import React, { useState } from "react";
import "../css/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // Importa Link para la navegación
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import loginImage from "../images/Login_fondo2.png";
import miGif from "../images/vaca_360.gif";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await api.post(`/api/login?email=${email}&password=${password}`);

      if (response.data.message == 'Login exitoso') {
        navigate("/inicio2", {
          state: {
            id: response.data.idUsuario,
            tipo: response.data.tipoUsuario
          }
        });
        console.log("id:", response.data.idUsuario);
        
      }else if (response.data.message == 'Credenciales inválidas') {
        setError("Usuario no encontrado. Por favor, verifica tus credenciales.");
      }
    } catch(error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error al iniciar sesión. Por favor, verifica tus credenciales.");
    }
    
  }

  return (
    <div className="login-container">
       <div className="falling-rectangles">
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="rectangle"
        style={{
          left: `${Math.random() * 100}%`, // Posición horizontal aleatoria
          animationDelay: `${Math.random() * 5}s`, // Retraso aleatorio
          animationDuration: `${3 + Math.random() * 5}s`, // Duración aleatoria
        }}
      ></div>
    ))}
  </div>
      <div className="video-container">
        <img 
          src={miGif} 
          alt="Vaca girando" 
          className="login-gif"
        />
      </div>

      <form onSubmit={handleSignIn} className="login-form">
        <img
            src={loginImage}
            alt="Paisaje ganadero"
            className="login-header-image"
        />
        
        <div className="login-content">

          <h2>Inicio de Sesión</h2>

          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@cattletrack.com"
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>

        </div>
      </form>
    </div>
  );
};

export default Login;