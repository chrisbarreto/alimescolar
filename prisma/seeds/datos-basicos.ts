import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedUnidadesBasicas() {
  console.log('🌱 Seeding unidades de medida básicas...');

  const unidades = [
    { desc: 'Gramos', abrev: 'g' },
    { desc: 'Kilogramos', abrev: 'kg' },
    { desc: 'Mililitros', abrev: 'ml' },
    { desc: 'Litros', abrev: 'l' },
    { desc: 'Unidades', abrev: 'unid' },
    { desc: 'Tazas', abrev: 'taza' },
    { desc: 'Cucharadas', abrev: 'cdas' },
    { desc: 'Cucharaditas', abrev: 'cditas' }
  ];

  for (const unidad of unidades) {
    const existing = await prisma.unidadMedida.findFirst({
      where: { abreviatura: unidad.abrev }
    });
    
    if (!existing) {
      await prisma.unidadMedida.create({
        data: {
          descUnidadMedida: unidad.desc,
          abreviatura: unidad.abrev
        }
      });
    }
  }

  console.log('✅ Unidades de medida básicas seeded successfully');
}

export async function seedOrganizacionBasica() {
  console.log('🌱 Seeding organización básica...');

  await prisma.organizacion.upsert({
    where: { ruc: '12345678901' },
    update: {},
    create: {
      razonSocial: 'Organización de Prueba',
      ruc: '12345678901',
      direccion: 'Dirección de prueba',
      correo: 'test@organizacion.com',
      telefono: '021-123456'
    }
  });

  console.log('✅ Organización básica seeded successfully');
}

export async function seedEscuelaBasica() {
  console.log('🌱 Seeding escuela básica...');

  const organizacion = await prisma.organizacion.findFirst();
  if (!organizacion) {
    console.error('❌ No se encontró organización');
    return;
  }

  const existingEscuela = await prisma.escuela.findFirst({
    where: { nombre: 'Escuela de Prueba' }
  });

  if (!existingEscuela) {
    await prisma.escuela.create({
      data: {
        nombre: 'Escuela de Prueba',
        direccion: 'Dirección de la escuela',
        idOrganizacion: organizacion.idOrganizacion
      }
    });
  }

  console.log('✅ Escuela básica seeded successfully');
}

// Función principal para ejecutar todos los seeders
export async function seedDatosBasicos() {
  console.log('🌱 Iniciando seeding de datos básicos...');
  
  try {
    await seedUnidadesBasicas();
    await seedOrganizacionBasica();
    await seedEscuelaBasica();
    
    console.log('✅ Todos los datos básicos seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding datos básicos:', error);
  }
}

// Ejecutar directamente si es llamado como script
if (require.main === module) {
  seedDatosBasicos()
    .catch((e) => {
      console.error('❌ Error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
