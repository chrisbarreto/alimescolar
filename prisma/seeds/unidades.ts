import { PrismaClient } from '@prisma/client'

export async function seedUnidades(prisma: PrismaClient) {
  console.log('⚖️ Creando unidades de medida...')

  await prisma.unidadMedida.createMany({
    data: [
      // Peso
      { descUnidadMedida: 'Kilogramo', abreviatura: 'kg' },
      { descUnidadMedida: 'Gramo', abreviatura: 'g' },
      { descUnidadMedida: 'Libra', abreviatura: 'lb' },
      { descUnidadMedida: 'Onza', abreviatura: 'oz' },
      
      // Volumen
      { descUnidadMedida: 'Litro', abreviatura: 'l' },
      { descUnidadMedida: 'Mililitro', abreviatura: 'ml' },
      { descUnidadMedida: 'Galón', abreviatura: 'gal' },
      
      // Cantidad
      { descUnidadMedida: 'Unidad', abreviatura: 'u' },
      { descUnidadMedida: 'Docena', abreviatura: 'doc' },
      { descUnidadMedida: 'Ciento', abreviatura: 'cto' },
      { descUnidadMedida: 'Paquete', abreviatura: 'paq' },
      { descUnidadMedida: 'Bolsa', abreviatura: 'bolsa' },
      { descUnidadMedida: 'Lata', abreviatura: 'lata' },
      { descUnidadMedida: 'Frasco', abreviatura: 'frasco' },
      
      // Medidas culinarias
      { descUnidadMedida: 'Taza', abreviatura: 'taza' },
      { descUnidadMedida: 'Cucharada', abreviatura: 'cdta' },
      { descUnidadMedida: 'Cucharadita', abreviatura: 'cdita' },
      { descUnidadMedida: 'Pizca', abreviatura: 'pizca' },
      
      // Especiales para carnes
      { descUnidadMedida: 'Porción', abreviatura: 'porción' },
      { descUnidadMedida: 'Pieza', abreviatura: 'pza' },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Unidades de medida creadas')
}