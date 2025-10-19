// Componente de diagnóstico para el análisis de logs
import React, { useState } from 'react';
import LogsService from '../../services/logsService';

const DiagnosticoLogs = ({ onClose }) => {
  const [resultados, setResultados] = useState(null);
  const [ejecutando, setEjecutando] = useState(false);

  const ejecutarDiagnostico = async () => {
    setEjecutando(true);
    setResultados(null);

    const diagnosticos = [];

    try {
      // Probar estadísticas generales
      try {
        const response = await LogsService.obtenerEstadisticasGenerales();
        diagnosticos.push({
          nombre: 'Estadísticas Generales',
          estado: 'success',
          datos: response.data,
          mensaje: '✅ Funcionando correctamente'
        });
      } catch (error) {
        diagnosticos.push({
          nombre: 'Estadísticas Generales',
          estado: 'error',
          error: error.message,
          mensaje: '❌ Error: ' + error.message
        });
      }

      // Probar logs de auth
      try {
        const response = await LogsService.obtenerLogsAuth();
        diagnosticos.push({
          nombre: 'Logs de Autenticación',
          estado: 'success',
          datos: response.data,
          mensaje: '✅ Funcionando correctamente'
        });
      } catch (error) {
        diagnosticos.push({
          nombre: 'Logs de Autenticación',
          estado: 'error',
          error: error.message,
          mensaje: '❌ Error: ' + error.message
        });
      }

      // Probar logs de errores
      try {
        const response = await LogsService.obtenerLogsErrores();
        diagnosticos.push({
          nombre: 'Logs de Errores',
          estado: 'success',
          datos: response.data,
          mensaje: '✅ Funcionando correctamente'
        });
      } catch (error) {
        diagnosticos.push({
          nombre: 'Logs de Errores',
          estado: 'error',
          error: error.message,
          mensaje: '❌ Error: ' + error.message
        });
      }

      // Probar logs de requests
      try {
        const response = await LogsService.obtenerLogsRequests();
        diagnosticos.push({
          nombre: 'Logs de Requests',
          estado: 'success',
          datos: response.data,
          mensaje: '✅ Funcionando correctamente'
        });
      } catch (error) {
        diagnosticos.push({
          nombre: 'Logs de Requests',
          estado: 'error',
          error: error.message,
          mensaje: '❌ Error: ' + error.message
        });
      }

      // Probar logs de responses
      try {
        const response = await LogsService.obtenerLogsResponses();
        diagnosticos.push({
          nombre: 'Logs de Responses',
          estado: 'success',
          datos: response.data,
          mensaje: '✅ Funcionando correctamente'
        });
      } catch (error) {
        diagnosticos.push({
          nombre: 'Logs de Responses',
          estado: 'error',
          error: error.message,
          mensaje: '❌ Error: ' + error.message
        });
      }

      setResultados(diagnosticos);

    } catch (error) {
      console.error('Error en diagnóstico:', error);
    } finally {
      setEjecutando(false);
    }
  };

  return (
    <div className="diagnostico-logs-overlay">
      <div className="diagnostico-logs-modal">
        <div className="modal-header">
          <h2>🔍 Diagnóstico del Sistema de Logs</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-content">
          <p>Este diagnóstico probará todas las rutas de logs para identificar problemas.</p>
          
          <button 
            onClick={ejecutarDiagnostico} 
            disabled={ejecutando}
            className="btn btn-primary"
          >
            {ejecutando ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
          </button>

          {resultados && (
            <div className="resultados-diagnostico">
              <h3>Resultados del Diagnóstico</h3>
              {resultados.map((resultado, index) => (
                <div key={index} className={`resultado-item ${resultado.estado}`}>
                  <div className="resultado-header">
                    <h4>{resultado.nombre}</h4>
                    <span className="estado">{resultado.mensaje}</span>
                  </div>
                  
                  {resultado.datos && (
                    <div className="resultado-datos">
                      <h5>Datos recibidos:</h5>
                      <pre>{JSON.stringify(resultado.datos, null, 2)}</pre>
                    </div>
                  )}
                  
                  {resultado.error && (
                    <div className="resultado-error">
                      <h5>Error:</h5>
                      <p>{resultado.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticoLogs;
