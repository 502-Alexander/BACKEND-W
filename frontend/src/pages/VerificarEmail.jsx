// Página para verificar el email del usuario
// Esta página se muestra cuando el usuario hace clic en el enlace del correo

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/VerificarEmail.css';

function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('verificando'); // verificando, exito, error
  const [mensaje, setMensaje] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setEstado('error');
      setMensaje('Token de verificación no encontrado');
      return;
    }

    verificarToken();
  }, [token]);

  // Función para verificar el token con el backend
  const verificarToken = async () => {
    try {
      setEstado('verificando');
      
      const response = await fetch(`http://localhost:4000/api/verificacion/verificar-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setEstado('exito');
        setMensaje(data.mensaje);
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setEstado('error');
        setMensaje(data.mensaje || 'Error al verificar el email');
      }
    } catch (error) {
      console.error('Error al verificar token:', error);
      setEstado('error');
      setMensaje('Error de conexión. Intenta de nuevo.');
    }
  };

  // Función para reenviar correo de verificación
  const reenviarCorreo = async () => {
    try {
      const email = prompt('Ingresa tu email para reenviar la verificación:');
      if (!email) return;

      const response = await fetch('http://localhost:4000/api/verificacion/reenviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        alert('Correo de verificación reenviado. Revisa tu bandeja de entrada.');
      } else {
        alert('Error: ' + data.mensaje);
      }
    } catch (error) {
      console.error('Error al reenviar correo:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  return (
    <div className="verificar-email">
      <div className="verificar-container">
        {estado === 'verificando' && (
          <div className="estado-verificando">
            <div className="spinner"></div>
            <h2>Verificando tu cuenta...</h2>
            <p>Por favor espera mientras verificamos tu email.</p>
          </div>
        )}

        {estado === 'exito' && (
          <div className="estado-exito">
            <div className="icono-exito">✅</div>
            <h2>¡Email verificado exitosamente!</h2>
            <p>{mensaje}</p>
            <p>Serás redirigido al inicio en unos segundos...</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Ir al Inicio
            </button>
          </div>
        )}

        {estado === 'error' && (
          <div className="estado-error">
            <div className="icono-error">❌</div>
            <h2>Error en la verificación</h2>
            <p>{mensaje}</p>
            <div className="acciones-error">
              <button 
                className="btn btn-primary"
                onClick={reenviarCorreo}
              >
                Reenviar Correo
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/')}
              >
                Ir al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificarEmail;
