import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTiposPlatos() {
  try {
    console.log('🔍 Verificando tipos de platos...');
    
    const tiposPlatos = await prisma.tipoPlato.findMany({
      orderBy: { orden: 'asc' }
    });
    
    console.log('\n📋 Tipos de platos encontrados:');
    tiposPlatos.forEach(tipo => {
      console.log(`${tipo.idTipoPlato}. ${tipo.nombre} - ${tipo.descripcion}`);
    });
    
    console.log(`\n✅ Total: ${tiposPlatos.length} tipos de platos`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTiposPlatos();
