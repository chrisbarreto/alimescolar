import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable
    lastAutoTable?: { finalY: number }
  }
}

// Función para formatear números: miles con puntos, decimales con comas, máximo 1 decimal
const formatearNumero = (numero: number): string => {
  // Si es un número entero, no mostrar decimales
  if (Number.isInteger(numero)) {
    return numero.toLocaleString('es-ES', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })
  }
  
  // Si tiene decimales, mostrar máximo 1 decimal
  return numero.toLocaleString('es-ES', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 1 
  })
}

interface InsumoCalculado {
  nombreInsumo: string
  tipoInsumo: string
  cantidadTotal: number
  idUnidadMedida?: number
  unidadMedida?: string
  abreviatura?: string
}

interface MenuInfo {
  semana: string
  idMenuSemanal: string
}

interface EscuelaInfo {
  nombre: string
  ciudad?: string
}

export const generarPDFOrdenCompra = async (
  insumos: InsumoCalculado[],
  menu: MenuInfo,
  escuela: EscuelaInfo
): Promise<void> => {
  // Crear el PDF
  const doc = new jsPDF()
  
  // Configurar fuente
  doc.setFont('helvetica')
  
  // Título
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text('ORDEN DE COMPRA - INSUMOS', 20, 25)
  
  // Información del menú
  doc.setFontSize(12)
  doc.setTextColor(80, 80, 80)
  doc.text(`Escuela: ${escuela.nombre || 'N/A'}`, 20, 40)
  doc.text(`Ciudad: ${escuela.ciudad || 'N/A'}`, 20, 48)
  doc.text(`Semana del: ${new Date(menu.semana).toLocaleDateString()}`, 20, 56)
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 64)
  doc.text(`Total de insumos: ${insumos.length}`, 20, 72)

  // Preparar datos para la tabla - mostrar cantidad original y convertida
  const tableData = insumos.map((insumo) => {
    const cantidad = parseFloat(insumo.cantidadTotal.toString()) || 0
    
    // Usar PRIMERO el ID de unidad de medida para clasificar
    const idUnidadMedidaNum = Number(insumo.idUnidadMedida)
    
    // Clasificar por ID de unidad de medida
    const esUnidad = idUnidadMedidaNum === 5 // ID 5 = Unidades
    const esLiquido = idUnidadMedidaNum === 3 || idUnidadMedidaNum === 4 || idUnidadMedidaNum === 11 // IDs 3,4,11 = ml, L, ml
    
    let cantidadFormateada: string
    
    if (esUnidad) {
      // Para unidades: mostrar solo la cantidad sin unidades de peso
      const cantidadOriginal = formatearNumero(cantidad)
      cantidadFormateada = `${cantidadOriginal} unidades`
    } else if (esLiquido) {
      // Para líquidos: mostrar ml y L
      const cantidadOriginal = formatearNumero(cantidad)
      const litros = cantidad / 1000
      const cantidadConvertida = formatearNumero(litros)
      cantidadFormateada = `${cantidadOriginal} ml, ${cantidadConvertida} L`
    } else {
      // Para sólidos (IDs 1,2,10 = g, kg, g): mostrar g y kg
      const cantidadOriginal = formatearNumero(cantidad)
      const kilogramos = cantidad / 1000
      const cantidadConvertida = formatearNumero(kilogramos)
      cantidadFormateada = `${cantidadOriginal} g, ${cantidadConvertida} kg`
    }
    
    return [
      insumo.nombreInsumo || 'Sin nombre',
      insumo.tipoInsumo || 'Sin categoría',
      cantidadFormateada
    ]
  })

  // Configurar la tabla
  autoTable(doc, {
    head: [['Insumo', 'Categoría', 'Cantidad']],
    body: tableData,
    startY: 85,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Azul
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Gris claro
    },
    columnStyles: {
      0: { cellWidth: 65 }, // Insumo (más ancho sin observaciones)
      1: { cellWidth: 50 }, // Categoría (más ancho)
      2: { cellWidth: 70 }  // Cantidad (más ancho para ambas unidades)
    }
  })

  // Agregar resumen total al final
  // Verificar si cada insumo es unidad SOLO por el ID (ID 5 = Unidades)
  const esUnidadFunc = (insumo: InsumoCalculado) => {
    const idUnidadMedidaNum = Number(insumo.idUnidadMedida)
    return idUnidadMedidaNum === 5
  }
  
  // Verificar si es líquido por ID de unidad de medida
  const esLiquidoFunc = (insumo: InsumoCalculado) => {
    const idUnidadMedidaNum = Number(insumo.idUnidadMedida)
    return idUnidadMedidaNum === 3 || idUnidadMedidaNum === 4 || idUnidadMedidaNum === 11 // IDs 3,4,11 = ml, L, ml
  }
  
  // Calcular total de sólidos (excluyendo líquidos y unidades)
  const totalSolidos = insumos.filter(insumo => {
    return !esLiquidoFunc(insumo) && !esUnidadFunc(insumo)
  }).reduce((total, insumo) => total + (parseFloat(insumo.cantidadTotal.toString()) || 0), 0)

  // Calcular total de líquidos
  const totalLiquidos = insumos.filter(insumo => {
    return esLiquidoFunc(insumo)
  }).reduce((total, insumo) => total + (parseFloat(insumo.cantidadTotal.toString()) || 0), 0)

  // Calcular total de unidades
  const totalUnidades = insumos.filter(insumo => {
    return esUnidadFunc(insumo)
  }).reduce((total, insumo) => total + (parseFloat(insumo.cantidadTotal.toString()) || 0), 0)

  const totalKg = totalSolidos / 1000
  const totalLitros = totalLiquidos / 1000

  const finalY = (doc as any).lastAutoTable.finalY || 100
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  
  let yPos = finalY + 15
  if (totalSolidos > 0) {
    doc.text(`TOTAL SÓLIDOS: ${formatearNumero(totalKg)} kg`, 20, yPos)
    yPos += 8
  }
  if (totalLiquidos > 0) {
    doc.text(`TOTAL LÍQUIDOS: ${formatearNumero(totalLitros)} L`, 20, yPos)
    yPos += 8
  }
  if (totalUnidades > 0) {
    doc.text(`TOTAL UNIDADES: ${formatearNumero(totalUnidades)} unidades`, 20, yPos)
    yPos += 8
  }
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total de insumos diferentes: ${insumos.length}`, 20, yPos + 5)

  // Pie de página
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  doc.text('Generado automáticamente por Sistema de Gestión Escolar', 20, doc.internal.pageSize.height - 20)
  doc.text(`ID Menú: ${menu.idMenuSemanal}`, 20, doc.internal.pageSize.height - 15)

  // Guardar el PDF
  const fileName = `orden_compra_${escuela.nombre?.replace(/\s+/g, '_')}_${new Date(menu.semana).toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}
