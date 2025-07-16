import { PrismaClient } from '@prisma/client';
import { getPlatos, getTiposPlato } from '@/lib/services/platoService';

const prisma = new PrismaClient();

async function testPlatoService() {
  console.log('🧪 Probando el servicio de platos...');
  
  try {
    // Probar obtener tipos de plato
    console.log('1. Obteniendo tipos de plato...');
    const tipos = await getTiposPlato();
    console.log(`✅ ${tipos.length} tipos de plato encontrados:`, tipos.map(t => t.nombre));
    
    // Probar obtener platos
    console.log('2. Obteniendo platos...');
    const platos = await getPlatos();
    console.log(`✅ ${platos.length} platos encontrados:`);
    
    platos.forEach(plato => {
      console.log(`   - ${plato.nombre} (${plato.tipoPlato.nombre}) - ${plato.porciones.length} porciones`);
    });
    
    console.log('✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Si se ejecuta directamente este archivo
if (require.main === module) {
  testPlatoService();
}
