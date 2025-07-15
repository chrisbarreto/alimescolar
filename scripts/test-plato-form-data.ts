import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPlatoFormData() {
  console.log('🧪 Verificando datos para el formulario de platos...\n');

  try {
    // 1. Verificar tipos de platos
    const tiposPlato = await prisma.tipoPlato.findMany({
      orderBy: { orden: 'asc' }
    });
    console.log(`📋 Tipos de plato disponibles: ${tiposPlato.length}`);
    tiposPlato.forEach(tipo => {
      console.log(`  ${tipo.idTipoPlato}: ${tipo.nombre} - ${tipo.descripcion}`);
    });

    // 2. Verificar niveles escolares
    const nivelesEscolares = await prisma.nivelEscolar.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' }
    });
    console.log(`\n🎓 Niveles escolares disponibles: ${nivelesEscolares.length}`);
    nivelesEscolares.forEach(nivel => {
      console.log(`  ${nivel.idNivelEscolar}: ${nivel.nombre} - ${nivel.descripcion}`);
    });

    // 3. Verificar unidades de medida
    const unidadesMedida = await prisma.unidadMedida.findMany({
      orderBy: { idUnidadMedida: 'asc' },
      take: 10 // Solo las primeras 10 para no saturar
    });
    console.log(`\n📏 Unidades de medida disponibles (primeras 10): ${unidadesMedida.length}`);
    unidadesMedida.forEach(unidad => {
      console.log(`  ${unidad.idUnidadMedida}: ${unidad.abreviatura} - ${unidad.descUnidadMedida}`);
    });

    // 4. Verificar unidad para porciones (ID 19)
    const unidadPorciones = await prisma.unidadMedida.findUnique({
      where: { idUnidadMedida: 19 }
    });
    if (unidadPorciones) {
      console.log(`\n✅ Unidad para porciones: ${unidadPorciones.abreviatura} - ${unidadPorciones.descUnidadMedida}`);
    } else {
      console.log('\n❌ No se encontró la unidad para porciones (ID 19)');
    }

    console.log('\n✅ Verificación completada. El formulario debería funcionar correctamente.');

  } catch (error) {
    console.error('❌ Error al verificar datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPlatoFormData();
