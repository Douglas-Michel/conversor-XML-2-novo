import { motion } from 'framer-motion';
import { FileText, Package, Weight, DollarSign } from 'lucide-react';
import { NotaFiscal } from '@/lib/xmlParser';

interface SummaryCardsProps {
  data: NotaFiscal[];
}

/**
 * Formata número para moeda brasileira
 */
function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata número com separador de milhares
 */
function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SummaryCards({ data }: SummaryCardsProps) {
  if (data.length === 0) return null;

  // Conta notas únicas (por chaveAcesso) para saber quantas notas foram processadas
  const notasUnicas = new Set(data.map(n => n.chaveAcesso)).size;
  
  const totalLinhas = data.length;
  const totalPeso = data.reduce((sum, n) => sum + n.peso, 0);
  const valorTotalVenda = data.reduce((sum, n) => sum + (n.peso * n.valorUnitario), 0);

  const cards = [
    {
      title: 'Notas Processadas',
      value: notasUnicas.toString(),
      subtitle: `${totalLinhas} linhas de produtos`,
      icon: FileText,
      color: 'primary',
    },
    {
      title: 'Total de Produtos',
      value: totalLinhas.toString(),
      subtitle: 'Linhas individuais',
      icon: Package,
      color: 'accent',
    },
    {
      title: 'Peso Total',
      value: formatNumber(totalPeso),
      subtitle: 'Soma de todos os produtos',
      icon: Weight,
      color: 'success',
    },
    {
      title: 'Valor Total Venda',
      value: formatCurrency(valorTotalVenda),
      subtitle: 'Peso × Valor Unitário',
      icon: DollarSign,
      color: 'success',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`p-5 rounded-xl bg-card border border-border shadow-soft hover:shadow-elevated transition-shadow ${card.color === 'primary' ? 'border-l-4 border-primary/60' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
            <div className={`
              p-2.5 rounded-lg
              ${card.color === 'primary' ? 'bg-primary/10 text-primary' : ''}
              ${card.color === 'success' ? 'bg-success/10 text-success' : ''}
              ${card.color === 'accent' ? 'bg-accent/10 text-accent' : ''}
              ${card.color === 'muted' ? 'bg-muted text-muted-foreground' : ''}
            `}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
