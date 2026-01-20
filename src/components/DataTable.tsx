import { motion } from 'framer-motion';
import { NotaFiscal } from '@/lib/xmlParser';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface DataTableProps {
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
 * Formata número para exibição com 2 casas decimais
 */
function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function DataTable({ data }: DataTableProps) {
  if (data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-xl border border-border bg-card shadow-soft overflow-hidden"
    >
      <ScrollArea className="w-full">
        <div className="min-w-[4000px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-center">DATA</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">EMPRESA</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">VENDEDOR</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">REPRESENTANTE</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">SEGMENTO</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-center">CTE</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">TRANSPORTADORA</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">VALOR FRETE</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">CLIENTE</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-center">UF</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-center">DANFE</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">MATRIZ/MC NF</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">PRODUTO</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">FORNECEDOR</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">LOTE</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">PESO</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">$ KG COMPRA</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">$ KG COMPRA S/IPI</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">R$ COMPRA</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">$ KG VENDA</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">$ KG VENDA S/IPI</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">R$ VENDA</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">CUSTO FRETE KG</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">NOME</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">COM. REPRES.</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">COM. VENDEDOR</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">COM. MATRIZ</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">CMV</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">RESULTADO</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">MARGEM %</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-center">TIPO</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">ESTADO</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">VENDA</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap text-right">LUCRO</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">TIPOMAT</TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">EMPRESA (XML)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((nota, index) => (
                <motion.tr
                  key={nota.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-sm text-center whitespace-nowrap">{nota.data}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm" title={nota.empresa}>{nota.empresa}</TableCell>
                  <TableCell className="text-sm">{nota.vendedor}</TableCell>
                  <TableCell className="text-sm">{nota.representante}</TableCell>
                  <TableCell className="text-sm">{nota.segmento}</TableCell>
                  <TableCell className="font-mono text-sm text-center">{nota.cte || '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm" title={nota.transportadora}>{nota.transportadora || '-'}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.valorFrete)}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm" title={nota.cliente}>{nota.cliente}</TableCell>
                  <TableCell className="text-center text-sm font-medium">{nota.uf}</TableCell>
                  <TableCell className="font-mono text-sm text-center">{nota.danfe || '-'}</TableCell>
                  <TableCell className="text-sm">{nota.matrizMcNf}</TableCell>
                  <TableCell className="text-sm">{nota.produto}</TableCell>
                  <TableCell className="text-sm">{nota.fornecedor}</TableCell>
                  <TableCell className="text-sm">{nota.lote}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium whitespace-nowrap">{nota.peso}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.valorKgCompra)}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.valorKgCompraSemIpi)}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.valorCompra)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium whitespace-nowrap">{formatCurrency(nota.valorUnitario)}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.valorKgVendaSemIpi)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium whitespace-nowrap">{formatCurrency(nota.valorVenda)}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.custoFreteKg)}</TableCell>
                  <TableCell className="text-sm">{nota.nome}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.comissaoRepresentante)}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.comissaoVendedor)}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.comissaoMatriz)}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.cmv)}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.resultado)}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatNumber(nota.margem)}%</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={nota.tipo === 'NF-e' ? 'default' : 'secondary'}
                      className="text-xs whitespace-nowrap"
                    >
                      {nota.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{nota.estado}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.venda)}</TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">{formatCurrency(nota.lucro)}</TableCell>
                  <TableCell className="text-sm">{nota.tipoMat}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm" title={nota.empresaXml}>{nota.empresaXml}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
}
