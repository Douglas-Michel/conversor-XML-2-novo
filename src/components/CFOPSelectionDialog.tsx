import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { useState, useMemo } from 'react';
import { NotaFiscal } from '@/lib/xmlParser';
import { 
  validarPermissaoCFOP, 
  obterDescricaoCategoria,
} from '@/lib/cfopPermissions';

interface CFOPSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notas: NotaFiscal[];
  onConfirm: (notasAprovadas: NotaFiscal[]) => void;
  onCancel: () => void;
}

export function CFOPSelectionDialog({ 
  open, 
  onOpenChange, 
  notas,
  onConfirm,
  onCancel,
}: CFOPSelectionDialogProps) {
  // Proteção: se não houver notas, não renderiza
  if (!notas || notas.length === 0) {
    return null;
  }

  // Separa notas restritas e normais
  const { restritas, normais } = useMemo(() => {
    const restritas: NotaFiscal[] = [];
    const normais: NotaFiscal[] = [];
    
    notas.forEach(nota => {
      const resultado = validarPermissaoCFOP(nota.cfop || '');
      if (resultado.requerAutorizacao) {
        restritas.push(nota);
      } else {
        normais.push(nota);
      }
    });
    
    return { restritas, normais };
  }, [notas]);

  // Estado de seleção (inicialmente todas selecionadas)
  const [notasSelecionadas, setNotasSelecionadas] = useState<Set<string>>(
    new Set(notas.map(n => n.id))
  );

  const handleToggleNota = (notaId: string) => {
    const novoSet = new Set(notasSelecionadas);
    if (novoSet.has(notaId)) {
      novoSet.delete(notaId);
    } else {
      novoSet.add(notaId);
    }
    setNotasSelecionadas(novoSet);
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setNotasSelecionadas(new Set(notas.map(n => n.id)));
    } else {
      setNotasSelecionadas(new Set());
    }
  };

  const handleConfirm = () => {
    // Filtra apenas notas selecionadas
    const notasAprovadas = notas.filter(n => notasSelecionadas.has(n.id));
    onConfirm(notasAprovadas);
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Processa apenas as notas normais (não restritas)
    onConfirm(normais);
    onCancel();
    onOpenChange(false);
  };

  const todasSelecionadas = notasSelecionadas.size === notas.length;
  const algumasSelecionadas = notasSelecionadas.size > 0 && notasSelecionadas.size < notas.length;

  // Se não houver restritas, não mostra o diálogo
  if (restritas.length === 0) {
    return null;
  }

  // Agrupa restritas por categoria
  const porCategoria = useMemo(() => {
    const mapa = new Map<string, NotaFiscal[]>();
    restritas.forEach(nota => {
      const resultado = validarPermissaoCFOP(nota.cfop);
      const categoria = obterDescricaoCategoria(resultado.categoria);
      const lista = mapa.get(categoria) || [];
      lista.push(nota);
      mapa.set(categoria, lista);
    });
    return mapa;
  }, [restritas]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <AlertDialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
            <AlertDialogTitle className="text-xl">
              CFOPs Restritos Detectados - Selecione as Notas
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base mt-4">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-semibold">
                <AlertTriangle className="h-5 w-5" />
                <span>
                  {restritas.length} nota(s) com operações restritas de {notas.length} no total
                </span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                Selecione quais notas deseja processar. Notas com CFOPs restritos requerem autorização.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 p-3 bg-muted rounded">
              <Checkbox
                checked={todasSelecionadas}
                onCheckedChange={handleToggleAll}
                className="data-[state=checked]:bg-primary"
              />
              <span className="font-semibold">
                Selecionar todas ({notasSelecionadas.size}/{notas.length})
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex-1 overflow-y-auto mt-4 pr-2 min-h-0">
          <div className="space-y-6 pb-4">
            {/* Notas Restritas */}
            {Array.from(porCategoria.entries()).map(([categoria, notasCategoria]) => (
              <div key={categoria} className="border rounded-lg p-4 bg-amber-50/50 dark:bg-amber-950/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                    {categoria}
                  </h3>
                  <Badge variant="secondary">{notasCategoria.length}</Badge>
                </div>

                <div className="space-y-2">
                  {notasCategoria.map((nota) => (
                    <div
                      key={nota.id}
                      className={`flex items-start gap-3 p-3 rounded border transition-colors ${
                        notasSelecionadas.has(nota.id)
                          ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700'
                          : 'bg-muted/50 border-muted'
                      }`}
                    >
                      <Checkbox
                        checked={notasSelecionadas.has(nota.id)}
                        onCheckedChange={() => handleToggleNota(nota.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 text-sm">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant="outline" className="font-mono text-xs">
                            CFOP: {nota.cfop}
                          </Badge>
                          <Badge variant="default" className="text-xs">
                            DANFE: {nota.danfe}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {nota.data}
                          </span>
                        </div>
                        <div className="font-medium text-foreground">
                          {nota.cliente || 'Cliente não informado'}
                        </div>
                        <div className="text-muted-foreground">
                          {nota.produto || 'Produto não informado'} - {nota.peso}kg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Notas Normais (se houver) */}
            {normais.length > 0 && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold">
                    Operações Normais
                  </h3>
                  <Badge variant="secondary">{normais.length}</Badge>
                </div>

                <div className="space-y-2">
                  {normais.slice(0, 3).map((nota) => (
                    <div
                      key={nota.id}
                      className={`flex items-start gap-3 p-3 rounded border transition-colors ${
                        notasSelecionadas.has(nota.id)
                          ? 'bg-white dark:bg-slate-900 border-primary'
                          : 'bg-muted/50 border-muted'
                      }`}
                    >
                      <Checkbox
                        checked={notasSelecionadas.has(nota.id)}
                        onCheckedChange={() => handleToggleNota(nota.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 text-sm">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant="outline" className="font-mono text-xs">
                            CFOP: {nota.cfop || 'N/A'}
                          </Badge>
                          <Badge variant="default" className="text-xs">
                            DANFE: {nota.danfe}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {nota.data}
                          </span>
                        </div>
                        <div className="font-medium text-foreground">
                          {nota.cliente || 'Cliente não informado'}
                        </div>
                        <div className="text-muted-foreground">
                          {nota.produto || 'Produto não informado'} - {nota.peso}kg
                        </div>
                      </div>
                    </div>
                  ))}
                  {normais.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      + {normais.length - 3} outra(s) nota(s) normal(is)
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter className="flex-shrink-0 flex-col sm:flex-row gap-2 mt-4">
          <AlertDialogCancel onClick={handleCancel}>
            Processar Apenas Notas Normais ({normais.length})
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={notasSelecionadas.size === 0}
          >
            Autorizar e Processar Selecionadas ({notasSelecionadas.size})
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
