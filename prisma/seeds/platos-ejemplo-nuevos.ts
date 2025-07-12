import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPlatosEjemplo() {
  console.log('🍽️ Seeding platos de ejemplo...');

  // Obtener la escuela, tipos de plato y niveles escolares
  const escuela = await prisma.escuela.findFirst();
  if (!escuela) {
    throw new Error('No hay escuelas disponibles');
  }

  const tiposPlato = await prisma.tipoPlato.findMany({
    orderBy: { orden: 'asc' }
  });

  const nivelesEscolares = await prisma.nivelEscolar.findMany({
    orderBy: { orden: 'asc' }
  });

  const unidadGramos = await prisma.unidadMedida.findFirst({
    where: { abreviatura: 'g' }
  });

  if (!unidadGramos) {
    throw new Error('No se encontró la unidad de medida en gramos');
  }

  // Crear platos de ejemplo
  const platosEjemplo = [
    {
      nombre: 'Arroz con Pollo',
      descripcion: 'Arroz amarillo con trozos de pollo y verduras',
      esEjemplo: true,
      idTipoPlato: tiposPlato.find(t => t.nombre === 'Almuerzo')?.idTipoPlato || 1,
      idEscuela: escuela.idEscuela
    },
    {
      nombre: 'Ensalada Verde',
      descripcion: 'Mezcla fresca de lechugas, tomate y pepino',
      esEjemplo: true,
      idTipoPlato: tiposPlato.find(t => t.nombre === 'Ensalada')?.idTipoPlato || 2,
      idEscuela: escuela.idEscuela
    },
    {
      nombre: 'Gelatina de Frutas',
      descripcion: 'Gelatina con trozos de frutas variadas',
      esEjemplo: true,
      idTipoPlato: tiposPlato.find(t => t.nombre === 'Postre')?.idTipoPlato || 3,
      idEscuela: escuela.idEscuela
    }
  ];

  for (const platoData of platosEjemplo) {
    // Crear el plato
    const plato = await prisma.plato.create({
      data: platoData
    });

    // Crear porciones por nivel escolar
    for (const nivel of nivelesEscolares) {
      let cantidad: number;
      
      // Asignar cantidad según el tipo de plato y nivel escolar
      if (platoData.idTipoPlato === 1) { // Almuerzo
        cantidad = nivel.orden === 1 ? 150 : nivel.orden === 2 ? 200 : 250; // INICIAL, PRIMER_SEGUNDO, TERCER_CICLO
      } else if (platoData.idTipoPlato === 2) { // Ensalada
        cantidad = nivel.orden === 1 ? 50 : nivel.orden === 2 ? 75 : 100;
      } else { // Postre
        cantidad = nivel.orden === 1 ? 80 : nivel.orden === 2 ? 100 : 120;
      }

      await prisma.porcionNivelEscolar.create({
        data: {
          idPlato: plato.idPlato,
          idNivelEscolar: nivel.idNivelEscolar,
          cantidad: cantidad,
          idUnidadMedida: unidadGramos.idUnidadMedida,
          observaciones: `Porción para nivel ${nivel.nombre}`
        }
      });
    }

    console.log(`✅ Plato "${plato.nombre}" creado con porciones por nivel escolar`);
  }

  console.log('✅ Platos de ejemplo seeded successfully');
}

// Si se ejecuta directamente este archivo
if (require.main === module) {
  seedPlatosEjemplo()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
