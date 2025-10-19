// Contexto para manejar la autenticación de usuarios y administradores
// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

// Crear contexto
const AuthContext = createContext();

// Hook para consumir el contexto fácilmente
export const useAuth = () => useContext(AuthContext);

// Provider que envuelve toda la app
export const AuthProvider = ({ children }) => {
  // Estado del usuario
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);

  // Estado para determinar si está autenticado
  const isAuthenticated = !!usuario; // true si hay usuario, false si es null

  // Función para login (recibir datos desde backend)
  const login = (userData) => {
    // Normalizar estructura para carrito: preferir cliente_id numérico cuando exista
    const idPreferido = userData?.cliente_id ?? userData?.id
    const clienteIdNumerico = Number(idPreferido)
    const usuarioNormalizado = {
      id: userData?.id ?? clienteIdNumerico,
      cliente_id: Number.isFinite(clienteIdNumerico) ? clienteIdNumerico : undefined,
      email: userData?.email || '',
      nombre: userData?.nombre || '',
      rol: userData?.rol || 'usuario',
      token: userData?.token
    }
    setUsuario(usuarioNormalizado)
    localStorage.setItem("usuario", JSON.stringify(usuarioNormalizado)) // guardar en localStorage
  }

  // Función para login de administrador
  const loginAdmin = async (email, password) => {
    try {
      const response = await authService.loginAdmin(email, password);
      
      if (response.success) {
        const userData = {
          id: response.usuario.id,
          email: response.usuario.email,
          nombre: response.usuario.nombre,
          rol: 'admin',
          // Forzar sin cliente_id para que el contexto opere en modo local para admin
          cliente_id: undefined
        }
        setUsuario(userData)
        localStorage.setItem("usuario", JSON.stringify(userData))
        localStorage.setItem("token", response.token);
        
        return { success: true };
      } else {
        // Si response.success es false, usar el error del response
        const errorMessage = response.error || 'Error al iniciar sesión como administrador';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Función para logout
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Cargar usuario desde localStorage al iniciar la app
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    } else {
      // Crear usuario invitado invisible para la tienda online
      const usuarioInvitado = {
        id: 'invitado_' + Date.now(),
        nombre: '',
        email: '',
        rol: 'invitado'
      };
      setUsuario(usuarioInvitado);
      localStorage.setItem("usuario", JSON.stringify(usuarioInvitado));
    }
  }, []);

  // Función para verificar si el usuario es administrador
  const isAdmin = () => {
    return usuario && usuario.rol === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated, // booleano para verificar login
        isAdmin, // función para verificar si es admin
        login,
        loginAdmin,
        logout,
        error,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
