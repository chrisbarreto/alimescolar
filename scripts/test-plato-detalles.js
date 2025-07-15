// Script para probar el endpoint de platos individuales con ingredientes

const API_BASE_URL = 'http://localhost:3000';

async function testPlatoDetalles() {
  console.log('🍽️ Probando endpoint de detalles de platos...\n');

  try {
    // 1. Primero obtener lista de platos para conseguir un ID
    console.log('1. Obteniendo lista de platos...');
    const platosResponse = await fetch(`${API_BASE_URL}/api/platos`);
    const platosData = await platosResponse.json();
    
    if (!platosData.success || !platosData.data.length) {
      console.log('❌ No hay platos disponibles');
      return;
    }

    const primerPlato = platosData.data[0];
    console.log(`✅ Plato encontrado: "${primerPlato.nombre}" (ID: ${primerPlato.idPlato})`);

    // 2. Obtener detalles completos del plato
    console.log('\n2. Obteniendo detalles del plato...');
    const detallesResponse = await fetch(`${API_BASE_URL}/api/platos/${primerPlato.idPlato}`);
    const detallesData = await detallesResponse.json();

    if (!detallesResponse.ok) {
      console.log('❌ Error al obtener detalles:', detallesData.error);
      return;
    }

    if (!detallesData.success) {
      console.log('❌ Respuesta no exitosa:', detallesData.error);
      return;
    }

    const platoCompleto = detallesData.data;
    console.log(`✅ Detalles obtenidos para: "${platoCompleto.nombre}"`);

    // 3. Verificar estructura de la respuesta
    console.log('\n📊 Estructura del plato:');
    console.log(`  - Nombre: ${platoCompleto.nombre}`);
    console.log(`  - Descripción: ${platoCompleto.descripcion || 'Sin descripción'}`);
    console.log(`  - Tipo: ${platoCompleto.tipoPlato?.nombre || 'N/A'}`);
    console.log(`  - Es ejemplo: ${platoCompleto.esEjemplo ? 'Sí' : 'No'}`);

    // 4. Verificar porciones
    console.log('\n🍽️ Porciones por nivel escolar:');
    if (platoCompleto.porciones && platoCompleto.porciones.length > 0) {
      platoCompleto.porciones.forEach((porcion, index) => {
        console.log(`  ${index + 1}. ${porcion.nivelEscolar?.nombre}: ${porcion.cantidad} ${porcion.unidadMedida?.abreviatura}`);
      });
    } else {
      console.log('  ⚠️ No hay porciones configuradas');
    }

    // 5. Verificar ingredientes (recetaPlato)
    console.log('\n🥘 Ingredientes/Insumos:');
    if (platoCompleto.recetaPlato && platoCompleto.recetaPlato.length > 0) {
      console.log(`  ✅ ${platoCompleto.recetaPlato.length} ingrediente(s) encontrado(s):`);
      
      platoCompleto.recetaPlato.forEach((ingrediente, index) => {
        console.log(`  ${index + 1}. ${ingrediente.insumo?.nombreInsumo || 'Ingrediente desconocido'}`);
        console.log(`      - Cantidad por ración: ${ingrediente.cantidadPorRacion} ${ingrediente.unidadMedida?.abreviatura || 'unid'}`);
        console.log(`      - Tipo: ${ingrediente.insumo?.tipoInsumo?.descTipoInsumo || 'N/A'}`);
        if (ingrediente.pesoBruto) {
          console.log(`      - Peso bruto: ${ingrediente.pesoBruto} g`);
        }
        if (ingrediente.pesoNeto) {
          console.log(`      - Peso neto: ${ingrediente.pesoNeto} g`);
        }
      });
    } else {
      console.log('  ❌ No hay ingredientes configurados');
      console.log('  💡 El plato existe pero no tiene receta. Esto explica por qué el cálculo de insumos falla.');
    }

    console.log('\n🎉 Test completado');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar el test si está en Node.js
if (typeof window === 'undefined') {
  testPlatoDetalles();
}

// Para usar desde el navegador
if (typeof window !== 'undefined') {
  window.testPlatoDetalles = testPlatoDetalles;
}
