import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPorcionesEjemplo() {
  console.log('🌱 Seeding porciones de ejemplo...');

  // Obtener los niveles escolares
  const nivelesEscolares = await prisma.nivelEscolar.findMany({
    orderBy: { orden: 'asc' }
  });

  // Obtener una unidad de medida (gramos)
  const unidadGramos = await prisma.unidadMedida.findFirst({
    where: { abreviatura: 'g' }
  });

  if (!unidadGramos) {
    console.error('❌ No se encontró la unidad de medida "gramos"');
    return;
  }

  // Obtener la primera escuela disponible
  const escuela = await prisma.escuela.findFirst();
  if (!escuela) {
    console.error('❌ No se encontró ninguna escuela');
    return;
  }

  // Obtener tipo de plato "Almuerzo"
  const tipoAlmuerzo = await prisma.tipoPlato.findFirst({
    where: { nombre: 'Almuerzo' }
  });
  if (!tipoAlmuerzo) {
    console.error('❌ No se encontró el tipo de plato "Almuerzo"');
    return;
  }

  const plato = await prisma.plato.create({
    data: {
      nombre: 'Salsa de Legumbres con Arroz quesú',
      descripcion: 'Salsa de legumbres con arroz y queso',
      esEjemplo: true,
      idTipoPlato: tipoAlmuerzo.idTipoPlato,
      idEscuela: escuela.idEscuela
    }
  });

  // Crear las porciones por nivel escolar
  const porcionesData = [
    { nivelNombre: 'INICIAL', cantidad: 170.00 },           // 70g salsa + 100g arroz
    { nivelNombre: 'PRIMER_SEGUNDO_CICLO', cantidad: 230.00 }, // 100g salsa + 130g arroz
    { nivelNombre: 'TERCER_CICLO', cantidad: 300.00 }          // 130g salsa + 170g arroz
  ];

  for (const porcionData of porcionesData) {
    const nivel = nivelesEscolares.find(n => n.nombre === porcionData.nivelNombre);
    if (nivel) {
      await prisma.porcionNivelEscolar.create({
        data: {
          idPlato: plato.idPlato,
          idNivelEscolar: nivel.idNivelEscolar,
          cantidad: porcionData.cantidad,
          idUnidadMedida: unidadGramos.idUnidadMedida,
          observaciones: `Porción para ${nivel.descripcion}`
        }
      });
    }
  }

  console.log('✅ Porciones de ejemplo seeded successfully');
  console.log(`📋 Plato creado: ${plato.nombre}`);
  console.log(`📊 Porciones creadas para ${porcionesData.length} niveles escolares`);
}

// Ejecutar directamente si es llamado como script
if (require.main === module) {
  seedPorcionesEjemplo()
    .catch((e) => {
      console.error('❌ Error seeding porciones:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
