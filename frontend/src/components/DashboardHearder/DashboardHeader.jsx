import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function DashboardLogs() {
  const [usuarios, setUsuarios] = useState([]);
  const [errores, setErrores] = useState([]);
  const [actividad, setActividad] = useState([]);

  useEffect(() => {
    // Usuarios más activos
    axios.get('http://localhost:3000/api/logs/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));

    // Errores frecuentes
    axios.get('http://localhost:3000/api/logs/errores')
      .then(res => setErrores(res.data))
      .catch(err => console.error(err));

    // Actividad diaria
    axios.get('http://localhost:3000/api/logs/actividad')
      .then(res => setActividad(res.data))
      .catch(err => console.error(err));
  }, []);

  // Datos para gráfico de usuarios (formato recharts)
  const dataUsuarios = usuarios.map(u => ({
    usuario: u.usuario,
    eventos: u.eventos
  }));

  // Datos para gráfico de errores (formato recharts)
  const dataErrores = errores.map(e => ({
    error: e.error,
    veces: e.veces
  }));

  // Datos para gráfico de actividad diaria (formato recharts)
  const dataActividad = actividad.map(a => ({
    dia: a.dia,
    eventos: a.eventos
  }));

  return (
    <div className="dashboard-logs">
      <div className="chart-container">
        <h3>Usuarios más activos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataUsuarios}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="usuario" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="eventos" fill="#36a2eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Errores frecuentes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataErrores}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="error" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="veces" fill="#ff6384" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Actividad diaria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataActividad}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="eventos" stroke="#4bc0c0" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
