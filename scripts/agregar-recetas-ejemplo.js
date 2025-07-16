// Script para agregar recetas de ejemplo a los platos existentes
// Esto solucionará temporalmente el problema del cálculo de insumos

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function agregarRecetasEjemplo() {
  console.log('🍽️ Agregando recetas de ejemplo a los platos existentes...\n');

  try {
    // 1. Obtener platos existentes
    const platos = await prisma.plato.findMany({
      include: {
        tipoPlato: true,
        recetaPlato: true
      }
    });

    console.log(`Platos encontrados: ${platos.length}`);

    // 2. Obtener algunos insumos básicos disponibles
    const insumos = await prisma.insumo.findMany({
      include: {
        tipoInsumo: true,
        unidadMedida: true
      },
      take: 10 // Solo tomar los primeros 10 insumos
    });

    console.log(`Insumos disponibles: ${insumos.length}`);

    if (insumos.length === 0) {
      console.log('❌ No hay insumos disponibles en la base de datos');
      return;
    }

    // 3. Para cada plato sin receta, agregar ingredientes básicos
    let recetasCreadas = 0;

    for (const plato of platos) {
      // Si ya tiene recetas, saltarlo
      if (plato.recetaPlato.length > 0) {
        console.log(`⏭️ Plato "${plato.nombre}" ya tiene recetas, saltando...`);
        continue;
      }

      console.log(`\n🔨 Creando receta para: "${plato.nombre}"`);

      // Seleccionar entre 2-4 insumos al azar para cada plato
      const numIngredientes = Math.floor(Math.random() * 3) + 2; // Entre 2 y 4
      const insumosSeleccionados = insumos
        .sort(() => Math.random() - 0.5) // Mezclar aleatoriamente
        .slice(0, numIngredientes);

      // Crear recetas para este plato
      for (const insumo of insumosSeleccionados) {
        // Cantidad aleatoria entre 0.05 y 0.5 por ración
        const cantidadPorRacion = (Math.random() * 0.45 + 0.05).toFixed(3);
        
        try {
          await prisma.recetaPlato.create({
            data: {
              idPlato: plato.idPlato,
              idInsumo: insumo.idInsumo,
              cantidadPorRacion: parseFloat(cantidadPorRacion),
              idUnidadMedida: insumo.idUnidadMedida, // Usar la misma unidad del insumo
              pesoBruto: null,
              pesoNeto: null
            }
          });

          console.log(`  ✅ Agregado: ${insumo.nombreInsumo} - ${cantidadPorRacion} ${insumo.unidadMedida.abreviatura}/ración`);
          recetasCreadas++;
        } catch (error) {
          console.log(`  ❌ Error agregando ${insumo.nombreInsumo}:`, error.message);
        }
      }
    }

    console.log(`\n🎉 Proceso completado!`);
    console.log(`📊 Recetas creadas: ${recetasCreadas}`);
    console.log(`🍽️ Platos con recetas: ${platos.filter(p => p.recetaPlato.length === 0).length}`);

    // 4. Verificar el resultado
    const platosConRecetas = await prisma.plato.findMany({
      include: {
        _count: {
          select: {
            recetaPlato: true
          }
        }
      }
    });

    console.log('\n📋 Resumen final:');
    platosConRecetas.forEach(plato => {
      console.log(`  "${plato.nombre}": ${plato._count.recetaPlato} ingredientes`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  agregarRecetasEjemplo();
}

module.exports = { agregarRecetasEjemplo };
