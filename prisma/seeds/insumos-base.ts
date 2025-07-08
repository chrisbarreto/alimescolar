import { PrismaClient } from '@prisma/client'

export async function seedInsumosBase(prisma: PrismaClient) {
  console.log('🥬 Creando insumos básicos...')

  // Obtener IDs necesarios
  const organizacion = await prisma.organizacion.findFirst({
    where: { ruc: '80000001-1' }
  })

  const tipoVerdura = await prisma.tipoInsumo.findFirst({
    where: { descTipoInsumo: 'Verduras y Hortalizas' }
  })

  const tipoFruta = await prisma.tipoInsumo.findFirst({
    where: { descTipoInsumo: 'Frutas' }
  })

  const tipoCarne = await prisma.tipoInsumo.findFirst({
    where: { descTipoInsumo: 'Carnes y Aves' }
  })

  const tipoLacteo = await prisma.tipoInsumo.findFirst({
    where: { descTipoInsumo: 'Lácteos y Huevos' }
  })

  const tipoCereal = await prisma.tipoInsumo.findFirst({
    where: { descTipoInsumo: 'Cereales y Granos' }
  })

  const kg = await prisma.unidadMedida.findFirst({
    where: { abreviatura: 'kg' }
  })

  const litro = await prisma.unidadMedida.findFirst({
    where: { abreviatura: 'l' }
  })

  const unidad = await prisma.unidadMedida.findFirst({
    where: { abreviatura: 'u' }
  })

  if (!organizacion || !tipoVerdura || !tipoFruta || !tipoCarne || !tipoLacteo || !tipoCereal || !kg || !litro || !unidad) {
    throw new Error('No se encontraron los tipos o unidades necesarias')
  }

  await prisma.insumo.createMany({
    data: [
      // Verduras y Hortalizas
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Tomate',
        descripcion: 'Tomate fresco',
        idTipoInsumo: tipoVerdura.idTipoInsumo,
        idUnidadMedida: kg.idUnidadMedida,
        codigoBarra: '7891000001',
      },
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Cebolla',
        descripcion: 'Cebolla blanca',
        idTipoInsumo: tipoVerdura.idTipoInsumo,
        idUnidadMedida: kg.idUnidadMedida,
        codigoBarra: '7891000002',
      },
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Zanahoria',
        descripcion: 'Zanahoria fresca',
        idTipoInsumo: tipoVerdura.idTipoInsumo,
        idUnidadMedida: kg.idUnidadMedida,
        codigoBarra: '7891000003',
      },
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Lechuga',
        descripcion: 'Lechuga crespa',
        idTipoInsumo: tipoVerdura.idTipoInsumo,
        idUnidadMedida: unidad.idUnidadMedida,
        codigoBarra: '7891000004',
      },
      
      // Frutas
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Banana',
        descripcion: 'Banana madura',
        idTipoInsumo: tipoFruta.idTipoInsumo,
        idUnidadMedida: kg.idUnidadMedida,
        codigoBarra: '7891000005',
      },
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Naranja',
        descripcion: 'Naranja jugosa',
        idTipoInsumo: tipoFruta.idTipoInsumo,
        idUnidadMedida: kg.idUnidadMedida,
        codigoBarra: '7891000006',
      },
      
      // Carnes
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Carne de Res',
        descripcion: 'Carne de res magra',
        idTipoInsumo: tipoCarne.idTipoInsumo,
        idUnidadMedida: kg.idUnidadMedida,
        codigoBarra: '7891000007',
      },
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Pollo',
        descripcion: 'Pollo entero',
        idTipoInsumo: tipoCarne.idTipoInsumo,
        idUnidadMedida: kg.idUnidadMedida,
        codigoBarra: '7891000008',
      },
      
      // Lácteos
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Leche',
        descripcion: 'Leche entera',
        idTipoInsumo: tipoLacteo.idTipoInsumo,
        idUnidadMedida: litro.idUnidadMedida,
        codigoBarra: '7891000009',
      },
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Huevo',
        descripcion: 'Huevo de gallina',
        idTipoInsumo: tipoLacteo.idTipoInsumo,
        idUnidadMedida: unidad.idUnidadMedida,
        codigoBarra: '7891000010',
      },
      
      // Cereales
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Arroz',
        descripcion: 'Arroz blanco',
        idTipoInsumo: tipoCereal.idTipoInsumo,
        idUnidadMedida: kg.idUnidadMedida,
        codigoBarra: '7891000011',
      },
      {
        idOrganizacion: organizacion.idOrganizacion,
        nombreInsumo: 'Fideos',
        descripcion: 'Fideos largos',
        idTipoInsumo: tipoCereal.idTipoInsumo,
        idUnidadMedida: kg.idUnidadMedida,
        codigoBarra: '7891000012',
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Insumos básicos creados')
}