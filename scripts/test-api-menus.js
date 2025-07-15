// Script para probar la API de menús después de la corrección
const API_BASE_URL = 'http://localhost:3000';

async function testMenusAPI() {
  console.log('🧪 Probando API de menús después de la corrección...\n');

  try {
    // Primero obtener escuelas disponibles
    console.log('1. Obteniendo escuelas disponibles...');
    const escuelasResponse = await fetch(`${API_BASE_URL}/api/menus?action=escuelas`);
    const escuelasData = await escuelasResponse.json();
    
    if (!escuelasData.success || !escuelasData.data.length) {
      console.log('❌ No hay escuelas disponibles');
      return;
    }

    const escuela = escuelasData.data[0];
    console.log(`✅ Escuela encontrada: ${escuela.nombre} (ID: ${escuela.idEscuela})`);

    // Obtener menús de esa escuela
    console.log('\n2. Obteniendo menús de la escuela...');
    const menusResponse = await fetch(`${API_BASE_URL}/api/menus?idEscuela=${escuela.idEscuela}`);
    const menusData = await menusResponse.json();

    if (!menusData.success) {
      console.log('❌ Error al obtener menús:', menusData.error);
      return;
    }

    if (!menusData.data.length) {
      console.log('⚠️ No hay menús para esta escuela');
      return;
    }

    console.log(`✅ ${menusData.data.length} menú(s) encontrado(s)`);

    // Verificar estructura de cada menú
    menusData.data.forEach((menu, index) => {
      console.log(`\n--- Menú ${index + 1} ---`);
      console.log(`ID: ${menu.idMenuSemanal}`);
      console.log(`Semana: ${menu.semana}`);
      console.log(`Escuela: ${menu.escuela.nombre}`);
      console.log(`Organización: ${menu.organizacion.razonSocial}`);
      
      // Verificar que tenga menuDias
      if (menu.menuDias) {
        console.log(`✅ menuDias encontrado: ${menu.menuDias.length} día(s)`);
        
        menu.menuDias.forEach((dia, diaIndex) => {
          console.log(`  Día ${diaIndex + 1}:`);
          console.log(`    - ID: ${dia.idMenuDia}`);
          console.log(`    - Fecha: ${dia.fecha}`);
          console.log(`    - Raciones: ${dia.cantidadRaciones}`);
          console.log(`    - Platos: ${dia._count?.menuDiaPlato || 0}`);
        });
      } else {
        console.log('❌ menuDias NO encontrado en la respuesta');
      }

      // Verificar si tiene menuDia (campo anterior)
      if (menu.menuDia) {
        console.log('⚠️ Aún contiene campo menuDia (debería estar eliminado)');
      }
    });

    console.log('\n🎉 Test completado exitosamente');

  } catch (error) {
    console.error('❌ Error en el test:', error.message);
  }
}

// Ejecutar el test si está en Node.js
if (typeof window === 'undefined') {
  testMenusAPI();
}
