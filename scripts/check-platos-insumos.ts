import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPlatosInsumos() {
  console.log('🔍 Verificando platos, recetas e insumos...\n');

  try {
    // 1. Verificar si hay platos
    const totalPlatos = await prisma.plato.count();
    console.log(`📊 Total de platos en la base de datos: ${totalPlatos}`);

    // 2. Verificar platos con recetas
    const platosConRecetas = await prisma.plato.findMany({
      include: {
        recetaPlato: {
          include: {
            insumo: {
              include: {
                tipoInsumo: true,
                unidadMedida: true
              }
            },
            unidadMedida: true
          }
        }
      }
    });

    console.log(`📊 Platos con recetas: ${platosConRecetas.filter(p => p.recetaPlato.length > 0).length} de ${totalPlatos}`);

    // 3. Mostrar detalles de algunos platos
    console.log('\n📋 Detalles de los primeros 5 platos:');
    for (let i = 0; i < Math.min(5, platosConRecetas.length); i++) {
      const plato = platosConRecetas[i];
      console.log(`\n  🍽️  Plato: ${plato.nombre} (ID: ${plato.idPlato})`);
      console.log(`      Tipo ID: ${plato.idTipoPlato || 'Sin tipo'}`);
      console.log(`      Recetas: ${plato.recetaPlato.length}`);
      
      if (plato.recetaPlato.length > 0) {
        console.log('      Insumos:');
        plato.recetaPlato.forEach((receta, idx) => {
          console.log(`        ${idx + 1}. ${receta.insumo.nombreInsumo} - ${receta.cantidadPorRacion} ${receta.unidadMedida.abreviatura}`);
        });
      } else {
        console.log('      ⚠️  Sin insumos configurados');
      }
    }

    // 4. Verificar menús y sus platos
    console.log('\n🗓️ Verificando menús semanales...');
    const menus = await prisma.menuSemanal.findMany({
      include: {
        escuela: true,
        menuDia: {
          include: {
            menuDiaPlato: {
              include: {
                plato: {
                  include: {
                    recetaPlato: {
                      include: {
                        insumo: true,
                        unidadMedida: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      take: 3 // Solo los primeros 3 menús
    });

    console.log(`📊 Total de menús semanales: ${menus.length}`);

    for (const menu of menus) {
      console.log(`\n  📅 Menú: Semana ${menu.semana.toISOString().split('T')[0]} - ${menu.escuela.nombre}`);
      console.log(`      ID: ${menu.idMenuSemanal}`);
      console.log(`      Días: ${menu.menuDia.length}`);
      
      let totalPlatosEnMenu = 0;
      let platosConInsumos = 0;
      
      for (const dia of menu.menuDia) {
        console.log(`\n    📆 Día: ${dia.fecha.toISOString().split('T')[0]} (${dia.cantidadRaciones} raciones)`);
        console.log(`        Platos: ${dia.menuDiaPlato.length}`);
        
        for (const menuPlato of dia.menuDiaPlato) {
          totalPlatosEnMenu++;
          const plato = menuPlato.plato;
          const tieneInsumos = plato.recetaPlato.length > 0;
          if (tieneInsumos) platosConInsumos++;
          
          console.log(`          - ${plato.nombre} ${tieneInsumos ? '✅' : '❌'} (${plato.recetaPlato.length} insumos)`);
        }
      }
      
      console.log(`\n    📊 Resumen del menú:`);
      console.log(`        Total platos: ${totalPlatosEnMenu}`);
      console.log(`        Platos con insumos: ${platosConInsumos}`);
      console.log(`        Porcentaje con insumos: ${totalPlatosEnMenu > 0 ? Math.round((platosConInsumos / totalPlatosEnMenu) * 100) : 0}%`);
    }

    // 5. Verificar insumos disponibles
    console.log('\n🥕 Verificando insumos...');
    const totalInsumos = await prisma.insumo.count();
    const totalRecetas = await prisma.recetaPlato.count();
    
    console.log(`📊 Total de insumos: ${totalInsumos}`);
    console.log(`📊 Total de recetas (plato-insumo): ${totalRecetas}`);

    if (totalInsumos === 0) {
      console.log('⚠️  No hay insumos en la base de datos. Esto explica por qué el cálculo retorna vacío.');
    }

    if (totalRecetas === 0) {
      console.log('⚠️  No hay recetas configuradas (relación plato-insumo). Los platos no tienen insumos asignados.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPlatosInsumos();
