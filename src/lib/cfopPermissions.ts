/**
 * @fileoverview Sistema de permissões baseado em CFOP
 * Gerencia restrições de acesso para operações fiscais específicas
 * 
 * @author Sistema de Gestão Fiscal
 * @version 1.0.0
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Categoria de operação fiscal
 */
export type CategoriaOperacao = 'DEVOLUCAO' | 'REMESSA' | 'ESTORNO' | 'NORMAL';

/**
 * Status de permissão para uma operação
 */
export type StatusPermissao = 'PERMITIDO' | 'BLOQUEADO' | 'REQUER_AUTORIZACAO';

/**
 * Interface para configuração de CFOP
 */
export interface ConfiguracaoCFOP {
  codigo: string;
  categoria: CategoriaOperacao;
  descricao: string;
  permissao: StatusPermissao;
}

/**
 * Interface para resultado de validação
 */
export interface ResultadoValidacao {
  permitido: boolean;
  categoria: CategoriaOperacao;
  cfop: string;
  mensagem: string;
  requerAutorizacao: boolean;
}

// ============================================================================
// CONFIGURAÇÃO DE CFOPs
// ============================================================================

/**
 * Mapeamento completo de CFOPs por categoria
 * Baseado na Tabela de CFOP da Receita Federal
 */
export const CFOPS_DEVOLUCAO: ConfiguracaoCFOP[] = [
  // Devoluções de compras para industrialização
  { codigo: '1201', categoria: 'DEVOLUCAO', descricao: 'Devolução de compra para industrialização', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1202', categoria: 'DEVOLUCAO', descricao: 'Devolução de compra para comercialização', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1203', categoria: 'DEVOLUCAO', descricao: 'Devolução de compra de bem para o ativo imobilizado', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1204', categoria: 'DEVOLUCAO', descricao: 'Devolução de compra de mercadoria para uso ou consumo', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1208', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria recebida em transferência', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1209', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria recebida em consignação', permissao: 'REQUER_AUTORIZACAO' },
  
  // Devoluções estaduais (2xxx)
  { codigo: '2201', categoria: 'DEVOLUCAO', descricao: 'Devolução de compra para industrialização (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2202', categoria: 'DEVOLUCAO', descricao: 'Devolução de compra para comercialização (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2203', categoria: 'DEVOLUCAO', descricao: 'Devolução de compra de bem para o ativo imobilizado (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2204', categoria: 'DEVOLUCAO', descricao: 'Devolução de compra de mercadoria para uso ou consumo (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2208', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria recebida em transferência (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2209', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria recebida em consignação (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  
  // Devoluções internacionais (3xxx)
  { codigo: '3201', categoria: 'DEVOLUCAO', descricao: 'Devolução de importação (exterior)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '3202', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria importada (exterior)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '3211', categoria: 'DEVOLUCAO', descricao: 'Devolução de compra para industrialização (exterior)', permissao: 'REQUER_AUTORIZACAO' },
  
  // Devoluções de vendas (5xxx e 6xxx)
  { codigo: '5201', categoria: 'DEVOLUCAO', descricao: 'Devolução de venda de produção do estabelecimento', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5202', categoria: 'DEVOLUCAO', descricao: 'Devolução de venda de mercadoria adquirida', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5208', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria vendida em transferência', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5209', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria vendida em consignação', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5210', categoria: 'DEVOLUCAO', descricao: 'Devolução de venda de mercadoria', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5411', categoria: 'DEVOLUCAO', descricao: 'Devolução de venda de produção do estabelecimento em operação com produto sujeito ao regime de substituição tributária', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5412', categoria: 'DEVOLUCAO', descricao: 'Devolução de venda de mercadoria adquirida em operação com mercadoria sujeita ao regime de substituição tributária', permissao: 'REQUER_AUTORIZACAO' },
  
  { codigo: '6201', categoria: 'DEVOLUCAO', descricao: 'Devolução de venda de produção do estabelecimento (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6202', categoria: 'DEVOLUCAO', descricao: 'Devolução de venda de mercadoria adquirida (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6208', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria vendida em transferência (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6209', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria vendida em consignação (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6210', categoria: 'DEVOLUCAO', descricao: 'Devolução de venda de mercadoria (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6411', categoria: 'DEVOLUCAO', descricao: 'Devolução de venda de produção (ST) (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6412', categoria: 'DEVOLUCAO', descricao: 'Devolução de venda de mercadoria (ST) (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  
  // Devoluções relacionadas a operações com exterior
  { codigo: '3211', categoria: 'DEVOLUCAO', descricao: 'Devolução de compra para industrialização do exterior', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5981', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria ou bem recebido para formação de lote de exportação', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6981', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria ou bem recebido para formação de lote de exportação (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6982', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria ou bem recebido do exterior em devolução de exportação', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6983', categoria: 'DEVOLUCAO', descricao: 'Devolução de mercadoria ou bem importado e não aplicado no processo produtivo', permissao: 'REQUER_AUTORIZACAO' },
];

export const CFOPS_REMESSA: ConfiguracaoCFOP[] = [
  // Remessas estaduais (5xxx)
  { codigo: '5901', categoria: 'REMESSA', descricao: 'Remessa para industrialização por encomenda', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5902', categoria: 'REMESSA', descricao: 'Retorno de mercadoria utilizada na industrialização por encomenda', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5903', categoria: 'REMESSA', descricao: 'Retorno de mercadoria recebida para industrialização', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5904', categoria: 'REMESSA', descricao: 'Remessa para venda fora do estabelecimento', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5905', categoria: 'REMESSA', descricao: 'Remessa para depósito fechado ou armazém geral', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5906', categoria: 'REMESSA', descricao: 'Retorno de mercadoria depositada em depósito fechado', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5907', categoria: 'REMESSA', descricao: 'Retorno simbólico de mercadoria depositada', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5908', categoria: 'REMESSA', descricao: 'Remessa de bem por conta de contrato de comodato', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5909', categoria: 'REMESSA', descricao: 'Retorno de bem recebido por conta de contrato de comodato', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5910', categoria: 'REMESSA', descricao: 'Remessa em bonificação, doação ou brinde', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5911', categoria: 'REMESSA', descricao: 'Remessa de amostra grátis', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5912', categoria: 'REMESSA', descricao: 'Remessa de mercadoria ou bem para demonstração', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5913', categoria: 'REMESSA', descricao: 'Retorno de mercadoria ou bem recebido para demonstração', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5914', categoria: 'REMESSA', descricao: 'Remessa de mercadoria ou bem para exposição ou feira', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5915', categoria: 'REMESSA', descricao: 'Remessa de mercadoria ou bem para conserto ou reparo', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5916', categoria: 'REMESSA', descricao: 'Retorno de mercadoria ou bem recebido para conserto ou reparo', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5917', categoria: 'REMESSA', descricao: 'Remessa de mercadoria em consignação mercantil ou industrial', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5918', categoria: 'REMESSA', descricao: 'Devolução de mercadoria recebida em consignação mercantil ou industrial', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5919', categoria: 'REMESSA', descricao: 'Devolução simbólica de mercadoria vendida ou utilizada em processo industrial', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5920', categoria: 'REMESSA', descricao: 'Remessa de vasilhame ou sacaria', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5921', categoria: 'REMESSA', descricao: 'Devolução de vasilhame ou sacaria', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5922', categoria: 'REMESSA', descricao: 'Lançamento efetuado a título de simples faturamento decorrente de compra para recebimento futuro', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5923', categoria: 'REMESSA', descricao: 'Remessa de mercadoria por conta e ordem de terceiros', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5924', categoria: 'REMESSA', descricao: 'Remessa para industrialização por conta e ordem do adquirente da mercadoria', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5925', categoria: 'REMESSA', descricao: 'Retorno de mercadoria recebida para industrialização por conta e ordem do adquirente', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5926', categoria: 'REMESSA', descricao: 'Lançamento efetuado a título de reclassificação de mercadoria decorrente de formação de kit', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5927', categoria: 'REMESSA', descricao: 'Lançamento efetuado a título de baixa de estoque decorrente de perda, roubo ou deterioração', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5928', categoria: 'REMESSA', descricao: 'Lançamento efetuado a título de baixa de estoque decorrente do encerramento da atividade', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5929', categoria: 'REMESSA', descricao: 'Lançamento efetuado em decorrência de emissão de documento fiscal relativo a operação ou prestação também registrada em equipamento Emissor de Cupom Fiscal - ECF', permissao: 'REQUER_AUTORIZACAO' },
  
  // Remessas interestaduais (6xxx)
  { codigo: '6901', categoria: 'REMESSA', descricao: 'Remessa para industrialização por encomenda (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6902', categoria: 'REMESSA', descricao: 'Retorno de mercadoria utilizada na industrialização por encomenda (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6903', categoria: 'REMESSA', descricao: 'Retorno de mercadoria recebida para industrialização (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6904', categoria: 'REMESSA', descricao: 'Remessa para venda fora do estabelecimento (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6905', categoria: 'REMESSA', descricao: 'Remessa para depósito fechado (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6906', categoria: 'REMESSA', descricao: 'Retorno de mercadoria depositada (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6907', categoria: 'REMESSA', descricao: 'Retorno simbólico de mercadoria (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6908', categoria: 'REMESSA', descricao: 'Remessa de bem por conta de contrato de comodato (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6909', categoria: 'REMESSA', descricao: 'Retorno de bem recebido por conta de contrato de comodato (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6910', categoria: 'REMESSA', descricao: 'Remessa em bonificação, doação ou brinde (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6911', categoria: 'REMESSA', descricao: 'Remessa de amostra grátis (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6912', categoria: 'REMESSA', descricao: 'Remessa de mercadoria para demonstração (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6913', categoria: 'REMESSA', descricao: 'Retorno de mercadoria recebida para demonstração (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6914', categoria: 'REMESSA', descricao: 'Remessa para exposição ou feira (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6915', categoria: 'REMESSA', descricao: 'Remessa para conserto ou reparo (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6916', categoria: 'REMESSA', descricao: 'Retorno de mercadoria recebida para conserto (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6917', categoria: 'REMESSA', descricao: 'Remessa de mercadoria em consignação mercantil (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6918', categoria: 'REMESSA', descricao: 'Devolução de mercadoria em consignação (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6919', categoria: 'REMESSA', descricao: 'Devolução simbólica de mercadoria (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6920', categoria: 'REMESSA', descricao: 'Remessa de vasilhame ou sacaria (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6921', categoria: 'REMESSA', descricao: 'Devolução de vasilhame ou sacaria (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6922', categoria: 'REMESSA', descricao: 'Lançamento de simples faturamento (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6923', categoria: 'REMESSA', descricao: 'Remessa por conta e ordem de terceiros (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6924', categoria: 'REMESSA', descricao: 'Remessa para industrialização por conta do adquirente (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6925', categoria: 'REMESSA', descricao: 'Retorno de mercadoria recebida para industrialização (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  
  // Remessas de entrada (1xxx e 2xxx)
  { codigo: '1901', categoria: 'REMESSA', descricao: 'Entrada para industrialização por encomenda', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1902', categoria: 'REMESSA', descricao: 'Retorno de mercadoria remetida para industrialização por encomenda', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1903', categoria: 'REMESSA', descricao: 'Entrada de mercadoria remetida para industrialização', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1904', categoria: 'REMESSA', descricao: 'Retorno de remessa para venda fora do estabelecimento', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1905', categoria: 'REMESSA', descricao: 'Entrada de mercadoria recebida para depósito fechado', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1906', categoria: 'REMESSA', descricao: 'Retorno de mercadoria remetida para depósito fechado', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1907', categoria: 'REMESSA', descricao: 'Retorno simbólico de mercadoria remetida para depósito', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1908', categoria: 'REMESSA', descricao: 'Entrada de bem por conta de contrato de comodato', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1909', categoria: 'REMESSA', descricao: 'Retorno de bem remetido por conta de contrato de comodato', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1910', categoria: 'REMESSA', descricao: 'Entrada de bonificação, doação ou brinde', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1911', categoria: 'REMESSA', descricao: 'Entrada de amostra grátis', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1912', categoria: 'REMESSA', descricao: 'Entrada de mercadoria para demonstração', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1913', categoria: 'REMESSA', descricao: 'Retorno de mercadoria remetida para demonstração', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1914', categoria: 'REMESSA', descricao: 'Retorno de mercadoria remetida para exposição ou feira', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1915', categoria: 'REMESSA', descricao: 'Entrada de mercadoria recebida para conserto ou reparo', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1916', categoria: 'REMESSA', descricao: 'Retorno de mercadoria remetida para conserto ou reparo', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1917', categoria: 'REMESSA', descricao: 'Entrada de mercadoria recebida em consignação mercantil', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1918', categoria: 'REMESSA', descricao: 'Devolução de mercadoria remetida em consignação', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1919', categoria: 'REMESSA', descricao: 'Devolução simbólica de mercadoria vendida', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1920', categoria: 'REMESSA', descricao: 'Entrada de vasilhame ou sacaria', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1921', categoria: 'REMESSA', descricao: 'Retorno de vasilhame ou sacaria', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1922', categoria: 'REMESSA', descricao: 'Lançamento de simples faturamento (entrada)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1923', categoria: 'REMESSA', descricao: 'Entrada de mercadoria por conta e ordem de terceiros', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1924', categoria: 'REMESSA', descricao: 'Entrada para industrialização por conta e ordem do adquirente', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1925', categoria: 'REMESSA', descricao: 'Retorno de mercadoria remetida para industrialização por conta do adquirente', permissao: 'REQUER_AUTORIZACAO' },
  
  { codigo: '2901', categoria: 'REMESSA', descricao: 'Entrada para industrialização por encomenda (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2902', categoria: 'REMESSA', descricao: 'Retorno de mercadoria remetida para industrialização (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2903', categoria: 'REMESSA', descricao: 'Entrada de mercadoria remetida para industrialização (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2904', categoria: 'REMESSA', descricao: 'Retorno de remessa para venda fora do estabelecimento (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2905', categoria: 'REMESSA', descricao: 'Entrada de mercadoria para depósito fechado (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2906', categoria: 'REMESSA', descricao: 'Retorno de mercadoria remetida para depósito (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2907', categoria: 'REMESSA', descricao: 'Retorno simbólico de mercadoria (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2908', categoria: 'REMESSA', descricao: 'Entrada de bem por contrato de comodato (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2909', categoria: 'REMESSA', descricao: 'Retorno de bem por contrato de comodato (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2910', categoria: 'REMESSA', descricao: 'Entrada de bonificação, doação ou brinde (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2911', categoria: 'REMESSA', descricao: 'Entrada de amostra grátis (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2912', categoria: 'REMESSA', descricao: 'Entrada de mercadoria para demonstração (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2913', categoria: 'REMESSA', descricao: 'Retorno de mercadoria para demonstração (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2914', categoria: 'REMESSA', descricao: 'Retorno de mercadoria de exposição ou feira (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2915', categoria: 'REMESSA', descricao: 'Entrada para conserto ou reparo (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2916', categoria: 'REMESSA', descricao: 'Retorno de mercadoria de conserto (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2917', categoria: 'REMESSA', descricao: 'Entrada de mercadoria em consignação (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2918', categoria: 'REMESSA', descricao: 'Devolução de mercadoria em consignação (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2919', categoria: 'REMESSA', descricao: 'Devolução simbólica de mercadoria (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2920', categoria: 'REMESSA', descricao: 'Entrada de vasilhame ou sacaria (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2921', categoria: 'REMESSA', descricao: 'Retorno de vasilhame ou sacaria (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2922', categoria: 'REMESSA', descricao: 'Lançamento de simples faturamento (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2923', categoria: 'REMESSA', descricao: 'Entrada por conta e ordem de terceiros (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2924', categoria: 'REMESSA', descricao: 'Entrada para industrialização por conta do adquirente (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2925', categoria: 'REMESSA', descricao: 'Retorno de mercadoria para industrialização (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
];

export const CFOPS_ESTORNO: ConfiguracaoCFOP[] = [
  // Estornos estaduais (1xxx)
  { codigo: '1410', categoria: 'ESTORNO', descricao: 'Devolução de mercadoria destinada ao ativo imobilizado', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '1411', categoria: 'ESTORNO', descricao: 'Devolução de mercadoria destinada ao uso ou consumo', permissao: 'REQUER_AUTORIZACAO' },
  
  // Estornos interestaduais (2xxx)
  { codigo: '2410', categoria: 'ESTORNO', descricao: 'Devolução de mercadoria destinada ao ativo imobilizado (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '2411', categoria: 'ESTORNO', descricao: 'Devolução de mercadoria destinada ao uso ou consumo (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  
  // Estornos de saída (5xxx e 6xxx)
  { codigo: '5410', categoria: 'ESTORNO', descricao: 'Devolução de bem do ativo imobilizado', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '5411', categoria: 'ESTORNO', descricao: 'Devolução de mercadoria destinada ao uso ou consumo', permissao: 'REQUER_AUTORIZACAO' },
  
  { codigo: '6410', categoria: 'ESTORNO', descricao: 'Devolução de bem do ativo imobilizado (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
  { codigo: '6411', categoria: 'ESTORNO', descricao: 'Devolução de mercadoria para uso/consumo (interestadual)', permissao: 'REQUER_AUTORIZACAO' },
];

/**
 * Mapa completo de todos os CFOPs configurados
 */
export const CFOPS_CONFIG = new Map<string, ConfiguracaoCFOP>();

// Popula o mapa com todos os CFOPs
[...CFOPS_DEVOLUCAO, ...CFOPS_REMESSA, ...CFOPS_ESTORNO].forEach(cfop => {
  CFOPS_CONFIG.set(cfop.codigo, cfop);
});

// ============================================================================
// VALIDAÇÃO DE PERMISSÕES
// ============================================================================

/**
 * Valida se uma operação com determinado CFOP é permitida
 * 
 * @param cfop - Código CFOP da operação
 * @returns Resultado da validação com detalhes
 */
export function validarPermissaoCFOP(cfop: string): ResultadoValidacao {
  if (!cfop) {
    return {
      permitido: true,
      categoria: 'NORMAL',
      cfop: '',
      mensagem: 'CFOP não informado. Operação padrão permitida.',
      requerAutorizacao: false,
    };
  }
  
  const config = CFOPS_CONFIG.get(cfop);
  
  // CFOP não está na lista de restritos = permitido
  if (!config) {
    return {
      permitido: true,
      categoria: 'NORMAL',
      cfop,
      mensagem: `CFOP ${cfop} - Operação normal permitida.`,
      requerAutorizacao: false,
    };
  }
  
  // Verifica permissão
  const permitido = config.permissao === 'PERMITIDO';
  const requerAutorizacao = config.permissao === 'REQUER_AUTORIZACAO';
  const bloqueado = config.permissao === 'BLOQUEADO';
  
  let mensagem = '';
  if (permitido) {
    mensagem = `CFOP ${cfop} - ${config.descricao}: Operação permitida.`;
  } else if (requerAutorizacao) {
    mensagem = `CFOP ${cfop} - ${config.descricao}: Esta operação de ${config.categoria.toLowerCase()} requer autorização especial.`;
  } else if (bloqueado) {
    mensagem = `CFOP ${cfop} - ${config.descricao}: Operação bloqueada por política de segurança.`;
  }
  
  return {
    permitido: permitido || requerAutorizacao,
    categoria: config.categoria,
    cfop,
    mensagem,
    requerAutorizacao,
  };
}

/**
 * Verifica se há notas com CFOPs restritos em um lote
 * 
 * @param cfops - Array de códigos CFOP
 * @returns Objeto com estatísticas de restrições
 */
export function verificarCFOPsRestritos(cfops: string[]): {
  total: number;
  restritos: number;
  bloqueados: number;
  categorias: Map<CategoriaOperacao, number>;
} {
  const categorias = new Map<CategoriaOperacao, number>();
  let restritos = 0;
  let bloqueados = 0;
  
  cfops.forEach(cfop => {
    const resultado = validarPermissaoCFOP(cfop);
    
    if (resultado.requerAutorizacao) {
      restritos++;
      const count = categorias.get(resultado.categoria) || 0;
      categorias.set(resultado.categoria, count + 1);
    }
    
    if (!resultado.permitido) {
      bloqueados++;
    }
  });
  
  return {
    total: cfops.length,
    restritos,
    bloqueados,
    categorias,
  };
}

/**
 * Obtém descrição legível da categoria
 * 
 * @param categoria - Categoria da operação
 * @returns Descrição formatada
 */
export function obterDescricaoCategoria(categoria: CategoriaOperacao): string {
  const descricoes = {
    DEVOLUCAO: 'Devolução',
    REMESSA: 'Remessa',
    ESTORNO: 'Estorno',
    NORMAL: 'Operação Normal',
  };
  
  return descricoes[categoria] || categoria;
}
