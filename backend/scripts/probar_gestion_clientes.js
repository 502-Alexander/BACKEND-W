// Script para probar el sistema de gestión de clientes
const axios = require('axios');

async function probarGestionClientes() {
  console.log('🧪 Probando sistema de gestión de clientes...\n');
  
  try {
    console.log('1. Probando endpoint de clientes unificados...');
    
    const response = await axios.get('http://localhost:4000/api/clientes/unificados', {
      timeout: 10000
    });
    
    if (response.data.success) {
      console.log('✅ Clientes unificados obtenidos exitosamente');
      console.log(`📊 Total de clientes: ${response.data.total}`);
      
      if (response.data.data.length > 0) {
        const primerCliente = response.data.data[0];
        console.log(`👤 Primer cliente: ${primerCliente.nombre_completo}`);
        console.log(`📞 Teléfono: ${primerCliente.telefono}`);
        console.log(`📅 Total citas: ${primerCliente.estadisticas.total_citas}`);
        console.log(`🕒 Última cita: ${primerCliente.estadisticas.ultima_cita}`);
        
        // Probar búsqueda
        console.log('\n2. Probando búsqueda de clientes...');
        const busquedaResponse = await axios.get('http://localhost:4000/api/clientes/buscar?termino=' + encodeURIComponent(primerCliente.nombre));
        
        if (busquedaResponse.data.success) {
          console.log('✅ Búsqueda funcionando correctamente');
          console.log(`🔍 Resultados encontrados: ${busquedaResponse.data.total}`);
        }
        
        // Probar estadísticas del cliente
        console.log('\n3. Probando estadísticas del cliente...');
        const statsResponse = await axios.get(
          `http://localhost:4000/api/clientes/${encodeURIComponent(primerCliente.nombre)}/${encodeURIComponent(primerCliente.apellidos)}/${encodeURIComponent(primerCliente.telefono)}/estadisticas`
        );
        
        if (statsResponse.data.success) {
          console.log('✅ Estadísticas obtenidas exitosamente');
          console.log(`📊 Total citas: ${statsResponse.data.data.total_citas}`);
          console.log(`✅ Citas completadas: ${statsResponse.data.data.citas_completadas}`);
          console.log(`📈 Porcentaje asistencia: ${statsResponse.data.data.porcentaje_asistencia}%`);
        }
        
        // Probar historial del cliente
        console.log('\n4. Probando historial del cliente...');
        const historialResponse = await axios.get(
          `http://localhost:4000/api/clientes/${encodeURIComponent(primerCliente.nombre)}/${encodeURIComponent(primerCliente.apellidos)}/${encodeURIComponent(primerCliente.telefono)}/historial`
        );
        
        if (historialResponse.data.success) {
          console.log('✅ Historial obtenido exitosamente');
          console.log(`📋 Total citas en historial: ${historialResponse.data.total}`);
        }
        
      } else {
        console.log('⚠️ No hay clientes en la base de datos');
        console.log('💡 Crea algunas citas primero para probar el sistema');
      }
      
    } else {
      console.error('❌ Error en la respuesta:', response.data.error);
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Asegúrate de que el servidor backend esté corriendo en puerto 4000');
    } else if (error.response) {
      console.log('📋 Detalles del error:', error.response.data);
    }
  }
}

// Ejecutar la prueba
probarGestionClientes().then(() => {
  console.log('\n🏁 Prueba completada');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

