import { PrismaClient } from '@prisma/client';
import { createPlatoWithPorciones, getPlatos, getPlatoById } from '@/lib/services/platoService-new';
import { MenuService } from '@/lib/services/menuService';

const prisma = new PrismaClient();

export async function ejemploCompletoMenu() {
  console.log('🚀 Iniciando ejemplo completo de menú...');

  try {
    // 1. Obtener datos base
    const escuela = await prisma.escuela.findFirst({
      include: {
        organizacion: true
      }
    });
    const nivelesEscolares = await prisma.nivelEscolar.findMany({ orderBy: { orden: 'asc' } });
    const unidadGramos = await prisma.unidadMedida.findFirst({ where: { abreviatura: 'g' } });
    const tiposPlato = await prisma.tipoPlato.findMany({ orderBy: { orden: 'asc' } });

    if (!escuela || !unidadGramos || tiposPlato.length === 0) {
      console.error('❌ Faltan datos base');
      return;
    }

    const tipoAlmuerzo = tiposPlato.find(t => t.nombre === 'Almuerzo');
    const tipoEnsalada = tiposPlato.find(t => t.nombre === 'Ensalada');

    if (!tipoAlmuerzo || !tipoEnsalada) {
      console.error('❌ No se encontraron los tipos de plato necesarios');
      return;
    }

    // 2. Crear platos con porciones
    console.log('📋 Creando platos...');
    
    const platosData = [
      {
        platoData: {
          nombre: 'Salsa de Legumbres con Arroz quesú',
          descripcion: 'Salsa de legumbres con arroz y queso',
          esEjemplo: true,
          idTipoPlato: tipoAlmuerzo.idTipoPlato,
          idEscuela: escuela.idEscuela
        },
        porciones: [
          { idNivelEscolar: nivelesEscolares[0].idNivelEscolar, cantidad: 170, idUnidadMedida: unidadGramos.idUnidadMedida },
          { idNivelEscolar: nivelesEscolares[1].idNivelEscolar, cantidad: 230, idUnidadMedida: unidadGramos.idUnidadMedida },
          { idNivelEscolar: nivelesEscolares[2].idNivelEscolar, cantidad: 300, idUnidadMedida: unidadGramos.idUnidadMedida }
        ]
      },
      {
        platoData: {
          nombre: 'Fideo con Salsa de pollo',
          descripcion: 'Fideos con salsa de pollo',
          esEjemplo: true,
          idTipoPlato: tipoAlmuerzo.idTipoPlato,
          idEscuela: escuela.idEscuela
        },
        porciones: [
          { idNivelEscolar: nivelesEscolares[0].idNivelEscolar, cantidad: 150, idUnidadMedida: unidadGramos.idUnidadMedida },
          { idNivelEscolar: nivelesEscolares[1].idNivelEscolar, cantidad: 220, idUnidadMedida: unidadGramos.idUnidadMedida },
          { idNivelEscolar: nivelesEscolares[2].idNivelEscolar, cantidad: 280, idUnidadMedida: unidadGramos.idUnidadMedida }
        ]
      },
      {
        platoData: {
          nombre: 'Ensalada de vegetales',
          descripcion: 'Ensalada fresca de vegetales',
          esEjemplo: true,
          idTipoPlato: tipoEnsalada.idTipoPlato,
          idEscuela: escuela.idEscuela
        },
        porciones: [
          { idNivelEscolar: nivelesEscolares[0].idNivelEscolar, cantidad: 50, idUnidadMedida: unidadGramos.idUnidadMedida },
          { idNivelEscolar: nivelesEscolares[1].idNivelEscolar, cantidad: 70, idUnidadMedida: unidadGramos.idUnidadMedida },
          { idNivelEscolar: nivelesEscolares[2].idNivelEscolar, cantidad: 90, idUnidadMedida: unidadGramos.idUnidadMedida }
        ]
      }
    ];

    const platosCreados = [];
    for (const platoInfo of platosData) {
      const plato = await createPlatoWithPorciones(platoInfo.platoData, platoInfo.porciones);
      platosCreados.push(plato);
      console.log(`✅ Plato creado: ${plato.nombre}`);
    }

    // 3. Crear menú semanal
    console.log('📅 Creando menú semanal...');
    
    const menuSemanalResult = await MenuService.createMenuSemanal({
      semana: '2024-01-08', // Semana 2
      idEscuela: escuela.idEscuela,
      idOrganizacion: escuela.organizacion.idOrganizacion,
      observaciones: 'Menú semanal de ejemplo'
    });

    if (!menuSemanalResult.success || !menuSemanalResult.data) {
      console.error('❌ Error creando menú semanal:', menuSemanalResult.error);
      return;
    }

    const menuSemanal = menuSemanalResult.data;
    console.log(`✅ Menú semanal creado: ${menuSemanal.idMenuSemanal}`);

    // 4. Crear menús diarios
    console.log('📋 Creando menús diarios...');
    
    const menusDiarios = [
      {
        fecha: '2024-01-08', // Lunes
        cantidadRaciones: 150,
        platos: [
          { idPlato: platosCreados[0].idPlato, orden: 1 }, // Salsa de Legumbres
          { idPlato: platosCreados[2].idPlato, orden: 2 }  // Ensalada
        ]
      },
      {
        fecha: '2024-01-09', // Martes
        cantidadRaciones: 150,
        platos: [
          { idPlato: platosCreados[1].idPlato, orden: 1 }, // Fideo con pollo
          { idPlato: platosCreados[2].idPlato, orden: 2 }  // Ensalada
        ]
      }
    ];

    for (const menuDiaData of menusDiarios) {
      const { platos, ...menuDiaInfo } = menuDiaData;
      const result = await MenuService.createMenuDiaWithPlatos(
        menuSemanal.idMenuSemanal,
        menuDiaInfo,
        platos
      );

      if (result.success) {
        console.log(`✅ Menú diario creado para: ${menuDiaInfo.fecha}`);
      } else {
        console.error(`❌ Error creando menú diario para ${menuDiaInfo.fecha}:`, result.error);
      }
    }

    // 5. Obtener menú semanal completo
    console.log('📊 Obteniendo menú semanal completo...');
    
    const menuCompleto = await MenuService.getMenuSemanalCompleto(menuSemanal.idMenuSemanal);
    
    if (menuCompleto) {
      console.log('\n🎉 MENÚ SEMANAL COMPLETO:');
      console.log(`Escuela: ${menuCompleto.escuela.nombre}`);
      console.log(`Semana: ${menuCompleto.semana}`);
      console.log(`Organización: ${menuCompleto.organizacion.razonSocial}`);
      
      menuCompleto.menuDias.forEach(dia => {
        console.log(`\n📅 ${dia.fecha} - ${dia.cantidadRaciones} raciones:`);
        dia.platos.forEach(plato => {
          console.log(`  ${plato.orden}. ${plato.nombre} (${plato.tipo})`);
          plato.porciones.forEach(porcion => {
            console.log(`     - ${porcion.nivelEscolar}: ${porcion.cantidad}${porcion.unidadMedida}`);
          });
        });
      });
    }

    console.log('\n✅ Ejemplo completo finalizado exitosamente!');

  } catch (error) {
    console.error('❌ Error en ejemplo completo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  ejemploCompletoMenu();
}
