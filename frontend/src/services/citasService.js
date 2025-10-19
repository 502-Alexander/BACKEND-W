// Servicio para gestión de citas del salón
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Función para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Obtener todas las citas
export const getCitas = async () => {
  try {
    const response = await axios.get(`${API_URL}/citas`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas:', error);
    throw error;
  }
};

// Obtener cita por ID
export const getCita = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/citas/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener cita:', error);
    throw error;
  }
};

// Crear nueva cita (sin autenticación para clientes)
export const createCita = async (citaData) => {
  try {
    // Función para convertir fecha de DD/MM/YYYY a YYYY-MM-DD
    const convertirFecha = (fecha) => {
      if (!fecha) return '2024-01-30';
      if (fecha.includes('/')) {
        const [dia, mes, año] = fecha.split('/');
        return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
      return fecha;
    };

    // Función para convertir hora de 12 horas a 24 horas
    const convertirHora = (hora) => {
      if (!hora) return '10:00:00';
      if (hora.includes('AM') || hora.includes('PM')) {
        const [tiempo, periodo] = hora.split(' ');
        const [horaStr, minuto] = tiempo.split(':');
        let hora24 = parseInt(horaStr);
        
        if (periodo === 'PM' && hora24 !== 12) {
          hora24 += 12;
        } else if (periodo === 'AM' && hora24 === 12) {
          hora24 = 0;
        }
        
        return `${hora24.toString().padStart(2, '0')}:${minuto}:00`;
      }
      return hora;
    };

    // Datos transformados correctamente
    const datosCita = {
      nombre_cliente: citaData.nombre || 'Sin nombre',
      apellidos_cliente: citaData.apellidos || 'Sin apellidos',
      telefono: citaData.telefono || '+502 0000-0000',
      correo: citaData.email || 'test@email.com',
      direccion: citaData.direccion || '',
      fecha_cita: convertirFecha(citaData.fecha),
      hora_cita: convertirHora(citaData.hora),
      servicio_id: null,
      servicio_nombre: citaData.servicio || 'Servicio básico',
      combo_id: null,
      combo_nombre: '',
      tiene_tratamiento_quimico: citaData.tieneTratamientoQuimico ? 1 : 0,
      tipo_tratamiento: citaData.tipoTratamiento || '',
      largo_pelo: citaData.largoPelo || '',
      desea_combo: citaData.deseaCombo ? 1 : 0,
      tipo_cliente: citaData.tipoCliente === 'frecuente' ? 'Frecuente' : 'Nuevo',
      observaciones: citaData.notas || ''
    };

    console.log('📅 Datos originales del formulario:', JSON.stringify(citaData, null, 2));
    console.log('📅 Datos transformados para API:', JSON.stringify(datosCita, null, 2));
    console.log('🌐 URL de la API:', `${API_URL}/citas`);
    
    const response = await axios.post(`${API_URL}/citas`, datosCita);
    console.log('✅ Respuesta exitosa:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear cita:', error);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Data:', error.response.data);
    } else if (error.request) {
      console.error('🌐 Request error:', error.request);
    } else {
      console.error('💬 Message:', error.message);
    }
    
    // Crear un error más específico
    const errorMessage = error.response?.data?.error || error.message || 'Error desconocido';
    throw new Error(errorMessage);
  }
};

// Actualizar cita
export const updateCita = async (id, citaData) => {
  try {
    const response = await axios.put(`${API_URL}/citas/${id}`, citaData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    throw error;
  }
};

// Eliminar cita
export const deleteCita = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/citas/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    throw error;
  }
};

// Obtener servicios disponibles
export const getServicios = async () => {
  try {
    const response = await axios.get(`${API_URL}/citas/servicios`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }
};

// Obtener horarios disponibles para una fecha
export const getHorariosDisponibles = async (fecha) => {
  try {
    const response = await axios.get(`${API_URL}/citas/horarios/${fecha}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    throw error;
  }
};

// Obtener estadísticas de citas
export const getEstadisticasCitas = async () => {
  try {
    const response = await axios.get(`${API_URL}/citas/estadisticas`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de citas:', error);
    throw error;
  }
};

// Subir foto de cita
export const uploadFotoCita = async (id, foto) => {
  try {
    const response = await axios.post(`${API_URL}/citas/${id}/foto`, { foto }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al subir foto de cita:', error);
    throw error;
  }
};

export default {
  getCitas,
  getCita,
  createCita,
  updateCita,
  deleteCita,
  getServicios,
  getHorariosDisponibles,
  getEstadisticasCitas,
  uploadFotoCita
};
