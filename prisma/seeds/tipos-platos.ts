import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedTiposPlatos() {
  console.log('🍽️ Seeding tipos de platos...');

  const tiposPlatos = [
    {
      idTipoPlato: 1,
      nombre: 'Almuerzo',
      descripcion: 'Plato principal del almuerzo',
      orden: 1,
      activo: true
    },
    {
      idTipoPlato: 2,
      nombre: 'Ensalada',
      descripcion: 'Ensalada como acompañamiento',
      orden: 2,
      activo: true
    },
    {
      idTipoPlato: 3,
      nombre: 'Postre',
      descripcion: 'Postre para finalizar la comida',
      orden: 3,
      activo: true
    }
  ];

  for (const tipoPlato of tiposPlatos) {
    await prisma.tipoPlato.upsert({
      where: { idTipoPlato: tipoPlato.idTipoPlato },
      update: tipoPlato,
      create: tipoPlato,
    });
  }

  console.log('✅ Tipos de platos seeded successfully');
}

// Si se ejecuta directamente este archivo
if (require.main === module) {
  seedTiposPlatos()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
