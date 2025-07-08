import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedNivelesEscolares() {
  console.log('🌱 Seeding niveles escolares...');

  // Crear los niveles escolares
  const nivelesEscolares = [
    {
      nombre: 'INICIAL',
      descripcion: 'Nivel inicial - Educación preescolar',
      edadMinima: 3,
      edadMaxima: 5,
      orden: 1
    },
    {
      nombre: 'PRIMER_SEGUNDO_CICLO',
      descripcion: 'Primer y segundo ciclo de la EEB (1° a 6° grado)',
      edadMinima: 6,
      edadMaxima: 11,
      orden: 2
    },
    {
      nombre: 'TERCER_CICLO',
      descripcion: 'Tercer ciclo de la EEB (7° a 9° grado)',
      edadMinima: 12,
      edadMaxima: 14,
      orden: 3
    }
  ];

  for (const nivel of nivelesEscolares) {
    await prisma.nivelEscolar.upsert({
      where: { nombre: nivel.nombre },
      update: nivel,
      create: nivel
    });
  }

  console.log('✅ Niveles escolares seeded successfully');
}

// Ejecutar directamente si es llamado como script
if (require.main === module) {
  seedNivelesEscolares()
    .catch((e) => {
      console.error('❌ Error seeding niveles escolares:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
