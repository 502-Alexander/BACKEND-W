// Modelo para manejar operaciones de productos en MySQL
// Usando la estructura existente del salón Sandra Fajardo
import db from '../database/ConexionBDD.js';

class ProductoModel {

  // Obtener todos los productos con información de inventario
  static async obtenerTodos() {
    try {
      const query = `
        SELECT 
          p.producto_id,
          p.nombre,
          p.marca,
          p.categoria_id,
          p.descripcion,
          p.precio,
          p.foto1 as imagen,
          p.activo,
          c.nombre as categoria_nombre,
          i.stock_actual as stock,
          i.stock_minimo
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id_categoria
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        ORDER BY p.nombre ASC
      `;
      
      const [rows] = await db.query(query);
      console.log('✅ Productos obtenidos de la BD:', rows.length);
      
      const productos = rows.map(row => ({
        producto_id: row.producto_id,
        nombre: row.nombre,
        marca: row.marca,
        categoria_id: row.categoria_id,
        categoria_nombre: row.categoria_nombre,
        descripcion: row.descripcion,
        precio: parseFloat(row.precio),
        imagen: row.imagen || '/images/producto-default.svg',
        stock: row.stock || 0,
        stock_minimo: row.stock_minimo || 0,
        activo: row.activo
      }));
      
      return productos;
    } catch (err) {
      console.error('❌ Error al obtener productos:', err);
      throw err;
    }
  }

  // Obtener productos destacados (los primeros 6 productos)
  static async obtenerDestacados() {
    try {
      const query = `
        SELECT 
          p.producto_id as id,
          p.nombre,
          p.descripcion,
          p.precio,
          p.foto1 as imagen,
          i.stock_actual as stock
        FROM productos p
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        ORDER BY p.producto_id ASC
        LIMIT 6
      `;
      
      const [rows] = await db.query(query);
      console.log('✅ Productos destacados obtenidos de la BD:', rows.length);
      
      const productos = rows.map(row => ({
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio: parseFloat(row.precio),
        categoria: 'Productos del Salón',
        imagen: row.imagen || '/images/producto-default.jpg',
        stock: row.stock || 0
      }));
      
      return productos;
    } catch (err) {
      console.error('❌ Error al obtener productos destacados:', err);
      throw err;
    }
  }

  // Obtener un producto por ID
  static async obtenerPorId(id) {
    try {
      const query = `
        SELECT 
          p.producto_id,
          p.nombre,
          p.descripcion,
          p.precio,
          p.foto1 as imagen,
          i.stock_actual as stock,
          i.stock_minimo
        FROM productos p
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        WHERE p.producto_id = ?
      `;
      
      const [rows] = await db.query(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      return {
        producto_id: row.producto_id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio: parseFloat(row.precio),
        categoria: 'Productos del Salón',
        imagen: row.imagen || '/images/producto-default.jpg',
        stock: row.stock || 0,
        stock_minimo: row.stock_minimo || 0
      };
    } catch (err) {
      console.error('Error al obtener producto por ID:', err);
      throw err;
    }
  }

  // Buscar productos por nombre
  static async buscarPorNombre(termino) {
    try {
      const query = `
        SELECT 
          p.producto_id as id,
          p.nombre,
          p.descripcion,
          p.precio,
          p.foto1 as imagen,
          i.stock_actual as stock
        FROM productos p
        LEFT JOIN inventario i ON p.producto_id = i.producto_id
        WHERE p.nombre LIKE ? OR p.descripcion LIKE ?
        ORDER BY p.nombre ASC
      `;
      
      const [rows] = await db.query(query, [`%${termino}%`, `%${termino}%`]);
      
      const productos = rows.map(row => ({
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio: parseFloat(row.precio),
        categoria: 'Productos del Salón',
        imagen: row.imagen || '/images/producto-default.jpg',
        stock: row.stock || 0
      }));
      
      return productos;
    } catch (err) {
      console.error('Error al buscar productos:', err);
      throw err;
    }
  }

  // Obtener categorías desde la base de datos
  static async obtenerCategorias() {
    try {
      const query = `
        SELECT 
          id_categoria as id,
          nombre,
          descripcion,
          activa
        FROM categorias 
        WHERE activa = 1
        ORDER BY nombre ASC
      `;
      
      const [rows] = await db.query(query);
      console.log('✅ Categorías obtenidas de la BD:', rows.length);
      
      const categorias = rows.map(row => ({
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        activa: row.activa
      }));
      
      return categorias;
    } catch (err) {
      console.error('❌ Error al obtener categorías:', err);
      throw err;
    }
  }

  // Crear un nuevo producto
  static async crear(datos) {
    return new Promise((resolve, reject) => {
      const { nombre, marca, categoria_id, descripcion, precio, stock_actual, stock_minimo } = datos;
      
      const query = `
        INSERT INTO productos (nombre, marca, categoria_id, descripcion, precio, activo) 
        VALUES (?, ?, ?, ?, ?, 1)
      `;
      
      db.query(query, [nombre, marca, categoria_id, descripcion, precio], (err, result) => {
        if (err) {
          console.error('❌ Error al crear producto:', err);
          reject(err);
        } else {
          const productoId = result.insertId;
          
          // Crear registro de inventario
          const inventarioQuery = `
            INSERT INTO inventario (producto_id, stock_actual, stock_minimo) 
            VALUES (?, ?, ?)
          `;
          
          db.query(inventarioQuery, [productoId, stock_actual || 0, stock_minimo || 0], (err2) => {
            if (err2) {
              console.error('❌ Error al crear inventario:', err2);
              reject(err2);
            } else {
              console.log('✅ Producto creado exitosamente:', productoId);
              resolve({ id: productoId, ...datos });
            }
          });
        }
      });
    });
  }

  // Actualizar un producto
  static async actualizar(id, datos) {
    return new Promise((resolve, reject) => {
      const { nombre, marca, categoria_id, descripcion, precio, stock_actual, stock_minimo, activo } = datos;
      
      console.log('🔄 Actualizando producto ID:', id);
      console.log('📊 Datos recibidos:', datos);
      console.log('🎯 Estado activo:', activo);
      
      const query = `
        UPDATE productos 
        SET nombre = ?, marca = ?, categoria_id = ?, descripcion = ?, precio = ?, activo = ?
        WHERE producto_id = ?
      `;
      
      db.query(query, [nombre, marca, categoria_id, descripcion, precio, activo, id], (err, result) => {
        if (err) {
          console.error('❌ Error al actualizar producto:', err);
          reject(err);
        } else if (result.affectedRows === 0) {
          console.log('⚠️ No se encontró producto con ID:', id);
          resolve(null);
        } else {
          console.log('✅ Producto actualizado - Filas afectadas:', result.affectedRows);
          console.log('📊 Nuevo estado activo:', activo);
          // Actualizar inventario si se proporciona
          if (stock_actual !== undefined || stock_minimo !== undefined) {
            // Primero verificar si existe el registro en inventario
            const checkQuery = `SELECT inventario_id FROM inventario WHERE producto_id = ?`;
            
            db.query(checkQuery, [id], (errCheck, checkResult) => {
              if (errCheck) {
                console.error('❌ Error verificando inventario:', errCheck);
                reject(errCheck);
                return;
              }
              
              if (checkResult.length > 0) {
                // Actualizar inventario existente
                const inventarioQuery = `
                  UPDATE inventario 
                  SET stock_actual = ?, stock_minimo = ?
                  WHERE producto_id = ?
                `;
                
                db.query(inventarioQuery, [stock_actual, stock_minimo, id], (err2) => {
                  if (err2) {
                    console.error('❌ Error al actualizar inventario:', err2);
                    reject(err2);
                  } else {
                    console.log('✅ Producto e inventario actualizados exitosamente:', id);
                    resolve({ id, ...datos });
                  }
                });
              } else {
                // Crear nuevo registro en inventario
                const insertInventarioQuery = `
                  INSERT INTO inventario (producto_id, stock_actual, stock_minimo)
                  VALUES (?, ?, ?)
                `;
                
                db.query(insertInventarioQuery, [id, stock_actual || 0, stock_minimo || 0], (errInsert) => {
                  if (errInsert) {
                    console.error('❌ Error al crear inventario:', errInsert);
                    reject(errInsert);
                  } else {
                    console.log('✅ Producto actualizado e inventario creado exitosamente:', id);
                    resolve({ id, ...datos });
                  }
                });
              }
            });
          } else {
            console.log('✅ Producto actualizado exitosamente:', id);
            resolve({ id, ...datos });
          }
        }
      });
    });
  }

  // Eliminar un producto (borrado lógico)
  static async eliminar(id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE productos 
        SET activo = 0 
        WHERE producto_id = ?
      `;
      
      db.query(query, [id], (err, result) => {
        if (err) {
          console.error('❌ Error al eliminar producto:', err);
          reject(err);
        } else if (result.affectedRows === 0) {
          resolve(null);
        } else {
          console.log('✅ Producto eliminado exitosamente:', id);
          resolve({ id, activo: 0 });
        }
      });
    });
  }

  // Actualizar imagen de producto
  static async actualizarImagen(id, imagenUrl) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE productos 
        SET foto1 = ? 
        WHERE producto_id = ?
      `;
      
      db.query(query, [imagenUrl, id], (err, result) => {
        if (err) {
          console.error('❌ Error al actualizar imagen:', err);
          reject(err);
        } else if (result.affectedRows === 0) {
          console.log('⚠️ No se encontró el producto con ID:', id);
          resolve(null);
        } else {
          console.log('✅ Imagen actualizada exitosamente para producto ID:', id);
          console.log('🖼️ Nueva URL de imagen:', imagenUrl);
          
          // Obtener el producto actualizado
          this.obtenerPorId(id)
            .then(producto => {
              resolve(producto);
            })
            .catch(error => {
              console.error('❌ Error obteniendo producto actualizado:', error);
              resolve({ producto_id: id, foto1: imagenUrl });
            });
        }
      });
    });
  }
}

export default ProductoModel;
