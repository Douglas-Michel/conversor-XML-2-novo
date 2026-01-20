import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { NotaFiscal } from './xmlParser';

function getTodayBRDate(): string {
  return format(new Date(), 'dd/MM/yyyy');
}

export function exportToExcel(notas: NotaFiscal[], fileName: string = 'notas_produtos') {
  const today = getTodayBRDate();

  // Prepara os dados para exportação com as novas colunas
  const data = notas.map((nota) => ({
    'DATA': nota.data || today,
    'EMPRESA': nota.empresa?.toUpperCase() || '',
    'VENDEDOR': nota.vendedor?.toUpperCase() || '',
    'REPRESENTANTE': nota.representante?.toUpperCase() || '',
    'SEGMENTO': nota.segmento?.toUpperCase() || '',
    'CTE': nota.cte || '',
    'TRANSPORTADORA': nota.transportadora?.toUpperCase() || '',
    'VALOR DO FRETE': nota.valorFrete || '',
    'CLIENTE': nota.cliente?.toUpperCase() || '',
    'UF': nota.uf?.toUpperCase() || '',
    'DANFE': nota.danfe || '',
    'MATRIZ/MC NF': nota.matrizMcNf?.toUpperCase() || '',
    'PRODUTO': nota.produto?.toUpperCase() || '',
    'TIPOMAT': nota.tipoMat?.toUpperCase() || '',
    'FORNECEDOR': nota.fornecedor?.toUpperCase() || '',
    'LOTE': nota.lote?.toUpperCase() || '',
    'PESO': nota.peso,
    '$ KG - (COMPRA)': nota.valorKgCompra || '',
    '$ KG - (COMPRA) S/IPI': nota.valorKgCompraSemIpi || '',
    'R$ COMPRA': nota.valorCompra || '',
    '$ KG - (VENDA)': nota.valorUnitario,
    '$ KG VENDA - S/IPI': nota.valorKgVendaSemIpi,
    'R$ - VENDA': nota.valorVenda,
    'CUSTO FRETE KG': nota.custoFreteKg || '',
    'NOME': nota.nome?.toUpperCase() || '',
    'COM. REPRESENTANTE': nota.comissaoRepresentante || '',
    'COMISSÃO VENDEDOR': nota.comissaoVendedor || '',
    'COMISSAO MATRIZ/MC NF': '',
    'CMV': nota.cmv || '',
    'RESULTADO': nota.resultado || '',
    'MARGEM': nota.margem || '',
    'TIPO': '',
    'ESTADO': '',
    'VENDA': '',
    'LUCRO': '',
    'EMPRESA (XML)': nota.empresaXml?.toUpperCase() || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Aplicar formatação às colunas
  const ref = worksheet['!ref'];
  if (ref) {
    const range = XLSX.utils.decode_range(ref);
    const currencyHeaders = [
      'VALOR DO FRETE', '$ KG - (COMPRA)', '$ KG - (COMPRA) S/IPI', 'R$ COMPRA', 
      '$ KG - (VENDA)', '$ KG VENDA - S/IPI', 'R$ - VENDA', 'CUSTO FRETE KG',
      'COM. REPRESENTANTE', 'COMISSÃO VENDEDOR', 'COMISSAO MATRIZ/MC NF',
      'CMV', 'RESULTADO'
    ];
    const percentHeaders = ['MARGEM'];
    const numberHeaders = ['PESO', 'CTE', 'DANFE'];
    const dateHeaders = ['DATA'];
    const textHeaders = ['TIPO', 'ESTADO', 'VENDA', 'LUCRO']; // Campos de preenchimento manual
    
    // Centralizar cabeçalhos
    for (let c = range.s.c; c <= range.e.c; c++) {
      const headerAddr = XLSX.utils.encode_cell({ c, r: range.s.r });
      const headerCell = worksheet[headerAddr];
      if (headerCell) {
        if (!headerCell.s) headerCell.s = {};
        headerCell.s.alignment = { horizontal: 'center', vertical: 'center' };
      }
    }
    
    // Formatar valores monetários, números e datas
    for (let c = range.s.c; c <= range.e.c; c++) {
      const headerAddr = XLSX.utils.encode_cell({ c, r: range.s.r });
      const headerCell = worksheet[headerAddr];
      if (!headerCell || !headerCell.v) continue;
      const header = String(headerCell.v);
      
      // Valores monetários
      if (currencyHeaders.includes(header)) {
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          const addr = XLSX.utils.encode_cell({ c, r });
          const cell = worksheet[addr];
          if (cell && typeof cell.v === 'number') {
            cell.z = '[$R$-pt-BR] #,##0.00';
          }
        }
      }
      
      // PESO com formato geral (sem formatação específica)
      if (header === 'PESO') {
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          const addr = XLSX.utils.encode_cell({ c, r });
          const cell = worksheet[addr];
          if (cell && cell.v !== undefined && cell.v !== '') {
            cell.t = 'n';
            cell.z = 'General';
          }
        }
      }
      
      // Percentuais
      if (percentHeaders.includes(header)) {
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          const addr = XLSX.utils.encode_cell({ c, r });
          const cell = worksheet[addr];
          if (cell && typeof cell.v === 'number') {
            cell.z = '0.00"%"';
          }
        }
      }
      
      // Números inteiros (CTE, DANFE)
      if (['CTE', 'DANFE'].includes(header)) {
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          const addr = XLSX.utils.encode_cell({ c, r });
          const cell = worksheet[addr];
          if (cell && cell.v !== undefined && cell.v !== '') {
            cell.t = 'n';
            cell.z = '0';
            if (!cell.s) cell.s = {};
            cell.s.alignment = { horizontal: 'center' };
          }
        }
      }
      
      // Datas
      if (dateHeaders.includes(header)) {
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          const addr = XLSX.utils.encode_cell({ c, r });
          const cell = worksheet[addr];
          if (cell && cell.v) {
            cell.z = 'DD/MM/YYYY';
          }
        }
      }
      
      // Campos de texto (preenchimento manual)
      if (textHeaders.includes(header)) {
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          const addr = XLSX.utils.encode_cell({ c, r });
          const cell = worksheet[addr];
          if (cell && cell.v !== undefined) {
            cell.t = 's'; // Força tipo string
            cell.z = '@'; // Formato texto
          }
        }
      }
    }
  }

  // Larguras das colunas
  const columnWidths = [
    { wch: 12 },  // DATA
    { wch: 35 },  // EMPRESA
    { wch: 20 },  // VENDEDOR
    { wch: 20 },  // REPRESENTANTE
    { wch: 15 },  // SEGMENTO
    { wch: 12 },  // CTE
    { wch: 35 },  // TRANSPORTADORA
    { wch: 15 },  // VALOR DO FRETE
    { wch: 35 },  // CLIENTE
    { wch: 6 },   // UF
    { wch: 12 },  // DANFE
    { wch: 20 },  // MATRIZ/MC NF
    { wch: 50 },  // PRODUTO
    { wch: 15 },  // TIPOMAT
    { wch: 30 },  // FORNECEDOR
    { wch: 15 },  // LOTE
    { wch: 12 },  // PESO
    { wch: 15 },  // $ KG - (COMPRA)
    { wch: 18 },  // $ KG - (COMPRA) S/IPI
    { wch: 15 },  // R$ COMPRA
    { wch: 15 },  // $ KG - (VENDA)
    { wch: 18 },  // $ KG VENDA - S/IPI
    { wch: 15 },  // R$ - VENDA
    { wch: 15 },  // CUSTO FRETE KG
    { wch: 25 },  // NOME
    { wch: 18 },  // COM. REPRESENTANTE
    { wch: 18 },  // COMISSÃO VENDEDOR
    { wch: 20 },  // COMISSAO MATRIZ/MC NF
    { wch: 15 },  // CMV
    { wch: 15 },  // RESULTADO
    { wch: 12 },  // MARGEM
    { wch: 10 },  // TIPO
    { wch: 15 },  // ESTADO
    { wch: 15 },  // VENDA
    { wch: 15 },  // LUCRO
    { wch: 35 },  // EMPRESA (XML)
  ];
  
  worksheet['!cols'] = columnWidths;

  // Cria workbook e adiciona a planilha principal
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos');

  // Aba de resumo
  const notasUnicas = new Set(notas.map(n => n.chaveAcesso)).size;
  const totalPeso = notas.reduce((sum, n) => sum + n.peso, 0);
  const valorTotalVenda = notas.reduce((sum, n) => sum + (n.peso * n.valorUnitario), 0);

  const summaryData = [
    { 'DESCRIÇÃO': 'Total de Notas Processadas', 'VALOR': notasUnicas },
    { 'DESCRIÇÃO': 'Total de Linhas de Produtos', 'VALOR': notas.length },
    { 'DESCRIÇÃO': 'Peso Total (kg)', 'VALOR': totalPeso },
    { 'DESCRIÇÃO': 'Valor Total de Venda', 'VALOR': valorTotalVenda },
    { 'DESCRIÇÃO': '', 'VALOR': '' },
    { 'DESCRIÇÃO': '--- POR TIPO ---', 'VALOR': '' },
    { 'DESCRIÇÃO': 'Notas Fiscais (NF-e)', 'VALOR': notas.filter(n => n.tipo === 'NF-e').length },
    { 'DESCRIÇÃO': 'Conhecimentos de Transporte (CT-e)', 'VALOR': notas.filter(n => n.tipo === 'CT-e').length },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  
  // Formatar valores monetários na aba Resumo
  const sumRef = summarySheet['!ref'];
  if (sumRef) {
    const sumRange = XLSX.utils.decode_range(sumRef);
    
    // Centralizar cabeçalhos
    for (let c = sumRange.s.c; c <= sumRange.e.c; c++) {
      const headerAddr = XLSX.utils.encode_cell({ c, r: sumRange.s.r });
      const headerCell = summarySheet[headerAddr];
      if (headerCell) {
        if (!headerCell.s) headerCell.s = {};
        headerCell.s.alignment = { horizontal: 'center', vertical: 'center' };
      }
    }
    
    for (let c = sumRange.s.c; c <= sumRange.e.c; c++) {
      const headerAddr = XLSX.utils.encode_cell({ c, r: sumRange.s.r });
      const headerCell = summarySheet[headerAddr];
      if (!headerCell || !headerCell.v) continue;
      const header = String(headerCell.v);
      
      if (header === 'VALOR') {
        for (let r = sumRange.s.r + 1; r <= sumRange.e.r; r++) {
          const addr = XLSX.utils.encode_cell({ c, r });
          const cell = summarySheet[addr];
          if (cell && typeof cell.v === 'number' && cell.v > 100) {
            // Valores grandes provavelmente são monetários
            cell.z = '[$R$-pt-BR] #,##0.00';
          }
        }
      }
    }
  }
  
  summarySheet['!cols'] = [{ wch: 35 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

  // Salva o arquivo
  const timestamp = format(new Date(), 'yyyy-MM-dd');
  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`, { cellStyles: true });
}
