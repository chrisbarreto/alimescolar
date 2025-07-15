import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEscuelas() {
  try {
    console.log('🏫 Verificando escuelas disponibles...');
    
    const escuelas = await prisma.escuela.findMany({
      select: {
        idEscuela: true,
        nombre: true,
        direccion: true,
        idOrganizacion: true,
        idCiudad: true
      }
    });

    console.log(`\n📊 Total de escuelas: ${escuelas.length}`);
    
    if (escuelas.length > 0) {
      console.log('\n🏷️ Lista de escuelas:');
      escuelas.forEach(escuela => {
        console.log(`  ${escuela.idEscuela}: ${escuela.nombre}`);
        console.log(`    ID Organización: ${escuela.idOrganizacion}`);
        console.log(`    ID Ciudad: ${escuela.idCiudad || 'No definida'}`);
        console.log('');
      });
      
      console.log(`✅ Usar este UUID para idEscuela: ${escuelas[0].idEscuela}`);
    } else {
      console.log('\n❌ No hay escuelas registradas. Necesitas crear una escuela primero.');
    }

  } catch (error) {
    console.error('❌ Error al verificar escuelas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEscuelas();
