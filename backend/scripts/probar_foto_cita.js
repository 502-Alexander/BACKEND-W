// Script para probar el sistema de fotos de citas
// Ejecutar con: node scripts/probar_foto_cita.js

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function probarFotoCita() {
  console.log('🧪 Probando sistema de fotos de citas...\n');
  
  try {
    // Crear un archivo de prueba (usando el logo como ejemplo)
    const logoPath = path.join(__dirname, '../uploads/logo.jpg');
    
    if (!fs.existsSync(logoPath)) {
      console.error('❌ Error: No se encontró el archivo logo.jpg para la prueba');
      console.log('💡 Copia una imagen a backend/uploads/logo.jpg para probar');
      return;
    }
    
    console.log('1. Preparando archivo de prueba...');
    console.log(`📸 Archivo: ${logoPath}`);
    
    // Crear FormData
    const formData = new FormData();
    formData.append('foto_cliente', fs.createReadStream(logoPath));
    
    console.log('2. Enviando foto al backend...');
    
    // Enviar al endpoint de upload
    const response = await axios.post('http://localhost:4000/api/upload/cita', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 10000
    });
    
    if (response.data.success) {
      console.log('✅ Foto subida exitosamente');
      console.log(`📧 URL completa: ${response.data.data.foto_url}`);
      console.log(`📁 Ruta relativa: ${response.data.data.ruta_relativa}`);
      
      // Verificar que la imagen se puede acceder
      console.log('3. Verificando acceso a la imagen...');
      
      try {
        const imageResponse = await axios.get(response.data.data.foto_url, {
          timeout: 5000,
          responseType: 'arraybuffer'
        });
        
        if (imageResponse.status === 200) {
          console.log('✅ Imagen accesible correctamente');
          console.log(`📏 Tamaño: ${imageResponse.data.length} bytes`);
        }
      } catch (imageError) {
        console.error('❌ Error accediendo a la imagen:', imageError.message);
      }
      
      // Probar crear cita con foto
      console.log('4. Probando creación de cita con foto...');
      
      const citaData = {
        nombre_cliente: 'Cliente de Prueba',
        apellidos_cliente: 'Con Foto',
        telefono: '+502 1234-5678',
        correo: 'cliente@prueba.com',
        fecha_cita: '2024-12-31',
        hora_cita: '10:00:00',
        servicio_nombre: 'Corte',
        tipo_cliente: 'Nuevo',
        foto_cliente: response.data.data.ruta_relativa
      };
      
      const citaResponse = await axios.post('http://localhost:4000/api/citas', citaData);
      
      if (citaResponse.data.success) {
        console.log('✅ Cita creada con foto exitosamente');
        console.log(`🆔 ID de cita: ${citaResponse.data.cita_id}`);
        
        // Verificar que la cita se guardó con la foto
        console.log('5. Verificando cita en la base de datos...');
        
        const citasResponse = await axios.get('http://localhost:4000/api/citas');
        const ultimaCita = citasResponse.data.data[citasResponse.data.data.length - 1];
        
        if (ultimaCita.foto_cliente) {
          console.log('✅ Foto guardada en la base de datos');
          console.log(`📸 Ruta en BD: ${ultimaCita.foto_cliente}`);
        } else {
          console.log('⚠️ Foto no encontrada en la base de datos');
        }
      } else {
        console.error('❌ Error creando cita:', citaResponse.data.error);
      }
      
    } else {
      console.error('❌ Error subiendo foto:', response.data.mensaje);
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Asegúrate de que el servidor backend esté corriendo en puerto 4000');
    }
  }
}

// Ejecutar la prueba
probarFotoCita().then(() => {
  console.log('\n🏁 Prueba completada');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
