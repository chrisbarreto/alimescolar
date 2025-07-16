import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUnidades() {
  try {
    console.log('📏 Verificando unidades de medida...');
    
    const unidades = await prisma.unidadMedida.findMany({
      orderBy: { idUnidadMedida: 'asc' }
    });

    console.log(`\n📊 Total de unidades de medida: ${unidades.length}`);
    console.log('\n🏷️ Lista de unidades:');
    
    unidades.forEach(unidad => {
      console.log(`  ${unidad.idUnidadMedida}: ${unidad.abreviatura} - ${unidad.descUnidadMedida}`);
    });

    // Buscar si existe una unidad para porciones o raciones
    const porcionUnidad = unidades.find(u => 
      u.descUnidadMedida.toLowerCase().includes('porcion') || 
      u.descUnidadMedida.toLowerCase().includes('racion') ||
      u.abreviatura.toLowerCase().includes('porcion') ||
      u.abreviatura.toLowerCase().includes('racion')
    );

    if (porcionUnidad) {
      console.log(`\n✅ Unidad para porciones encontrada: ${porcionUnidad.abreviatura} - ${porcionUnidad.descUnidadMedida}`);
    } else {
      console.log('\n❌ No se encontró una unidad específica para porciones');
    }

  } catch (error) {
    console.error('❌ Error al verificar unidades:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUnidades();
