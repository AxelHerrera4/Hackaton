import ExcelJS from 'exceljs';
import pptxgen from 'pptxgenjs';

export interface ReportGenerationData {
  type: 'general' | 'foundation';
  period: string;
  kpis: Array<{
    indicador: string;
    descripcion: string;
    valor: string;
    eje: string;
    mes: string;
    evidencias?: string[];
  }>;
  foundation?: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  totalBeneficiarios: number;
  proyectosActivos: number;
  metricasPorEje?: {
    [eje: string]: {
      total: number;
      crecimiento: number;
      evidencias: number;
    };
  };
}

export class ReportGenerator {
  
  // Generar archivo Excel con gráficos reales
  async generateExcel(data: ReportGenerationData): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Fundación Favorita';
    workbook.created = new Date();

    // Hoja de resumen
    const summarySheet = workbook.addWorksheet('Resumen Ejecutivo');
    
    // Configurar columnas
    summarySheet.columns = [
      { header: 'Métrica', key: 'metric', width: 30 },
      { header: 'Valor', key: 'value', width: 20 },
      { header: 'Período', key: 'period', width: 15 }
    ];

    // Agregar título
    summarySheet.mergeCells('A1:C1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = data.type === 'general' 
      ? 'Reporte General - Fundación Favorita'
      : `Reporte ${data.foundation?.nombre} - Fundación Favorita`;
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF0066CC' } };
    titleCell.alignment = { horizontal: 'center' };

    // Agregar datos de resumen
    summarySheet.addRow({
      metric: 'Período de Reporte',
      value: data.period,
      period: new Date().toLocaleDateString()
    });

    summarySheet.addRow({
      metric: 'Total Beneficiarios',
      value: data.totalBeneficiarios,
      period: data.period
    });

    summarySheet.addRow({
      metric: 'Proyectos Activos',
      value: data.proyectosActivos,
      period: data.period
    });

    // Hoja de KPIs detallados
    const kpiSheet = workbook.addWorksheet('KPIs Detallados');
    
    kpiSheet.columns = [
      { header: 'Eje Estratégico', key: 'eje', width: 20 },
      { header: 'Indicador', key: 'indicador', width: 40 },
      { header: 'Descripción', key: 'descripcion', width: 50 },
      { header: 'Valor Alcanzado', key: 'valor', width: 15 },
      { header: 'Mes', key: 'mes', width: 12 },
      { header: 'Evidencias', key: 'evidencias', width: 15 }
    ];

    // Agregar datos de KPIs
    data.kpis.forEach(kpi => {
      kpiSheet.addRow({
        eje: kpi.eje,
        indicador: kpi.indicador,
        descripcion: kpi.descripcion,
        valor: kpi.valor,
        mes: kpi.mes,
        evidencias: kpi.evidencias?.length || 0
      });
    });

    // Formatear tabla de KPIs (simplificado para evitar errores de tipos)
    kpiSheet.getCell('A1').value = 'Eje Estratégico';
    kpiSheet.getCell('B1').value = 'Indicador';
    kpiSheet.getCell('C1').value = 'Descripción';
    kpiSheet.getCell('D1').value = 'Valor Alcanzado';
    kpiSheet.getCell('E1').value = 'Mes';
    kpiSheet.getCell('F1').value = 'Evidencias';
    
    // Estilo de headers
    ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'].forEach(cell => {
      const headerCell = kpiSheet.getCell(cell);
      headerCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };
    });

    // Hoja de métricas por eje (si existe)
    if (data.metricasPorEje) {
      const metricsSheet = workbook.addWorksheet('Métricas por Eje');
      
      metricsSheet.columns = [
        { header: 'Eje Estratégico', key: 'eje', width: 25 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Crecimiento (%)', key: 'crecimiento', width: 18 },
        { header: 'Evidencias', key: 'evidencias', width: 15 }
      ];

      Object.entries(data.metricasPorEje).forEach(([eje, metrics]) => {
        metricsSheet.addRow({
          eje,
          total: metrics.total,
          crecimiento: `${metrics.crecimiento}%`,
          evidencias: metrics.evidencias
        });
      });

      // Crear gráfico simple (texto porque ExcelJS tiene limitaciones con gráficos)
      metricsSheet.addRow({});
      metricsSheet.addRow({ eje: '--- GRÁFICO DE BARRAS (Totales por Eje) ---' });
      
      Object.entries(data.metricasPorEje).forEach(([eje, metrics]) => {
        const barLength = Math.floor(metrics.total / 10);
        const bar = '█'.repeat(Math.min(barLength, 50));
        metricsSheet.addRow({
          eje: eje.substring(0, 15),
          total: bar + ` ${metrics.total}`
        });
      });
    }

    // Convertir a blob
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  // Generar presentación PowerPoint real
  async generatePowerPoint(data: ReportGenerationData): Promise<Blob> {
    const pres = new pptxgen();
    
    // Configuración de la presentación
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'Fundación Favorita';
    pres.company = 'Fundación Favorita';
    pres.subject = `Reporte ${data.type} - ${data.period}`;
    pres.title = data.type === 'general' 
      ? 'Reporte General - Fundación Favorita'
      : `Reporte ${data.foundation?.nombre}`;

    // Slide 1: Portada
    const slide1 = pres.addSlide();
    slide1.background = { fill: '0066CC' };
    
    slide1.addText('Fundación Favorita', {
      x: 1, y: 1, w: 8, h: 1,
      fontSize: 32,
      color: 'FFFFFF',
      bold: true,
      align: 'center'
    });

    slide1.addText(data.type === 'general' 
      ? 'Reporte General de Impacto'
      : `Reporte de Impacto - ${data.foundation?.nombre}`, {
      x: 1, y: 2.5, w: 8, h: 1,
      fontSize: 24,
      color: 'FFFFFF',
      align: 'center'
    });

    slide1.addText(`Período: ${data.period}`, {
      x: 1, y: 4, w: 8, h: 0.8,
      fontSize: 18,
      color: 'FFFFFF',
      align: 'center'
    });

    slide1.addText(`Generado: ${new Date().toLocaleDateString()}`, {
      x: 1, y: 5, w: 8, h: 0.5,
      fontSize: 14,
      color: 'FFFFFF',
      align: 'center'
    });

    // Slide 2: Resumen Ejecutivo
    const slide2 = pres.addSlide();
    slide2.addText('Resumen Ejecutivo', {
      x: 0.5, y: 0.3, w: 9, h: 0.8,
      fontSize: 28,
      bold: true,
      color: '0066CC'
    });

    // Métricas principales como texto en lugar de tabla
    slide2.addText('📊 Métricas Principales:', {
      x: 1, y: 1.3, w: 8, h: 0.5,
      fontSize: 18,
      bold: true,
      color: '0066CC'
    });

    slide2.addText(`• Total Beneficiarios: ${data.totalBeneficiarios}`, {
      x: 1.5, y: 2, w: 6, h: 0.4,
      fontSize: 16,
      color: '333333'
    });

    slide2.addText(`• Proyectos Activos: ${data.proyectosActivos}`, {
      x: 1.5, y: 2.5, w: 6, h: 0.4,
      fontSize: 16,
      color: '333333'
    });

    slide2.addText(`• KPIs Monitoreados: ${data.kpis.length}`, {
      x: 1.5, y: 3, w: 6, h: 0.4,
      fontSize: 16,
      color: '333333'
    });

    slide2.addText(`• Período: ${data.period}`, {
      x: 1.5, y: 3.5, w: 6, h: 0.4,
      fontSize: 16,
      color: '333333'
    });

    // Slide 3: KPIs por Eje
    const slide3 = pres.addSlide();
    slide3.addText('Indicadores por Eje Estratégico', {
      x: 0.5, y: 0.3, w: 9, h: 0.8,
      fontSize: 24,
      bold: true,
      color: '0066CC'
    });

    // Agrupar KPIs por eje
    const kpisByEje: { [eje: string]: typeof data.kpis } = {};
    data.kpis.forEach(kpi => {
      if (!kpisByEje[kpi.eje]) {
        kpisByEje[kpi.eje] = [];
      }
      kpisByEje[kpi.eje].push(kpi);
    });

    let currentY = 1.5;
    Object.entries(kpisByEje).forEach(([eje, kpis]) => {
      slide3.addText(`${eje}:`, {
        x: 0.5, y: currentY, w: 9, h: 0.4,
        fontSize: 16,
        bold: true,
        color: '333333'
      });
      
      currentY += 0.5;
      
      kpis.slice(0, 3).forEach(kpi => { // Máximo 3 KPIs por eje para no saturar
        slide3.addText(`• ${kpi.indicador}: ${kpi.valor}`, {
          x: 1, y: currentY, w: 8, h: 0.3,
          fontSize: 12,
          color: '666666'
        });
        currentY += 0.4;
      });
      
      currentY += 0.2;
    });

    // Slide 4: Desglose detallado (solo si hay métricas por eje)
    if (data.metricasPorEje) {
      const slide4 = pres.addSlide();
      slide4.addText('Métricas Detalladas por Eje', {
        x: 0.5, y: 0.3, w: 9, h: 0.8,
        fontSize: 24,
        bold: true,
        color: '0066CC'
      });

      // Métricas como texto en lugar de tabla
      let currentDetailY = 1.5;
      
      Object.entries(data.metricasPorEje).forEach(([eje, metrics]) => {
        slide4.addText(`📈 ${eje}:`, {
          x: 0.5, y: currentDetailY, w: 9, h: 0.4,
          fontSize: 16,
          bold: true,
          color: '0066CC'
        });
        
        currentDetailY += 0.5;
        
        slide4.addText(`   Total: ${metrics.total} | Crecimiento: ${metrics.crecimiento}% | Evidencias: ${metrics.evidencias}`, {
          x: 1, y: currentDetailY, w: 8, h: 0.4,
          fontSize: 14,
          color: '333333'
        });
        
        currentDetailY += 0.7;
      });
    }

    // Slide final: Conclusiones
    const slideFinal = pres.addSlide();
    slideFinal.addText('Conclusiones y Próximos Pasos', {
      x: 0.5, y: 0.3, w: 9, h: 0.8,
      fontSize: 24,
      bold: true,
      color: '0066CC'
    });

    slideFinal.addText(`✓ Se monitorearon ${data.kpis.length} indicadores clave`, {
      x: 1, y: 1.5, w: 8, h: 0.5,
      fontSize: 16,
      color: '333333'
    });

    slideFinal.addText(`✓ Alcanzamos ${data.totalBeneficiarios} beneficiarios directos`, {
      x: 1, y: 2.2, w: 8, h: 0.5,
      fontSize: 16,
      color: '333333'
    });

    slideFinal.addText(`✓ ${data.proyectosActivos} proyectos activos en ejecución`, {
      x: 1, y: 2.9, w: 8, h: 0.5,
      fontSize: 16,
      color: '333333'
    });

    slideFinal.addText('Continuamos trabajando por un Ecuador mejor 🇪🇨', {
      x: 1, y: 4, w: 8, h: 0.8,
      fontSize: 18,
      bold: true,
      color: '0066CC',
      align: 'center'
    });

    // Generar y retornar blob
    const pptxData = await pres.write({ outputType: 'blob' });
    return pptxData as Blob;
  }

  // Generar URL de dashboard de Metabase con parámetros reales
  generateMetabaseDashboard(data: ReportGenerationData): string {
    const baseUrl = 'http://localhost:3030'; // URL de tu Metabase
    
    // Parámetros para el dashboard
    const params = new URLSearchParams({
      period: data.period,
      foundation_id: data.foundation?.id?.toString() || 'all',
      type: data.type,
      total_beneficiarios: data.totalBeneficiarios.toString(),
      proyectos_activos: data.proyectosActivos.toString()
    });

    if (data.type === 'general') {
      return `${baseUrl}/dashboard/1-reporte-general?${params.toString()}`;
    } else {
      return `${baseUrl}/dashboard/2-reporte-fundacion?${params.toString()}`;
    }
  }
}

export const reportGenerator = new ReportGenerator();