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
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { 
  validarPermissaoCFOP, 
  verificarCFOPsRestritos, 
  obterDescricaoCategoria,
  type CategoriaOperacao,
  type ResultadoValidacao 
} from '@/lib/cfopPermissions';

interface CFOPPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cfops: string[];
  onConfirm: (autorizacao: string) => void;
  onCancel: () => void;
}

export function CFOPPermissionDialog({ 
  open, 
  onOpenChange, 
  cfops,
  onConfirm,
  onCancel,
}: CFOPPermissionDialogProps) {
  const stats = verificarCFOPsRestritos(cfops);
  const detalhes = cfops
    .map(cfop => validarPermissaoCFOP(cfop))
    .filter(r => r.requerAutorizacao);

  // Agrupa por categoria
  const porCategoria = new Map<CategoriaOperacao, ResultadoValidacao[]>();
  detalhes.forEach(det => {
    const lista = porCategoria.get(det.categoria) || [];
    lista.push(det);
    porCategoria.set(det.categoria, lista);
  });

  const handleConfirm = () => {
    // Aqui você pode adicionar lógica de senha/PIN se necessário
    const autorizacao = prompt('Digite a senha de autorização:');
    if (autorizacao) {
      onConfirm(autorizacao);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  if (stats.restritos === 0) {
    // Todas as operações são permitidas
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
            <AlertDialogTitle className="text-xl">
              Autorização Necessária para CFOPs Restritos
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base mt-4">
            {stats.bloqueados > 0 ? (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-destructive font-semibold">
                  <AlertTriangle className="h-5 w-5" />
                  <span>
                    {stats.bloqueados} operação(ões) bloqueada(s) por política de segurança
                  </span>
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <p>
                Foram detectadas <strong className="text-amber-600">{stats.restritos}</strong>{' '}
                operação(ões) fiscal(is) que requerem autorização especial de{' '}
                <strong>{stats.total}</strong> nota(s) no total.
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {Array.from(porCategoria.entries()).map(([categoria, itens]) => (
                  <Badge key={categoria} variant="outline" className="text-sm">
                    {obterDescricaoCategoria(categoria)}: {itens.length}
                  </Badge>
                ))}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-h-[400px] mt-4">
          <div className="space-y-4 pr-4">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Detalhamento dos CFOPs Restritos
            </div>

            {Array.from(porCategoria.entries()).map(([categoria, itens]) => (
              <div key={categoria} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-base">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span>{obterDescricaoCategoria(categoria)}</span>
                  <Badge variant="secondary">{itens.length}</Badge>
                </div>

                <div className="space-y-2">
                  {itens.slice(0, 5).map((item, idx) => (
                    <div 
                      key={`${item.cfop}-${idx}`}
                      className="bg-muted/50 rounded p-3 text-sm"
                    >
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="font-mono shrink-0">
                          {item.cfop}
                        </Badge>
                        <span className="text-muted-foreground flex-1">
                          {item.mensagem.split(':').slice(1).join(':').trim()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {itens.length > 5 && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      + {itens.length - 5} outro(s) CFOP(s) de {obterDescricaoCategoria(categoria).toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {stats.bloqueados === 0 && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900 dark:text-green-100">
                    <p className="font-semibold mb-1">Operações autorizáveis</p>
                    <p>
                      Estas operações podem ser liberadas mediante autorização. 
                      Por favor, confirme com senha de supervisor para prosseguir.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Cancelar Exportação
          </AlertDialogCancel>
          {stats.bloqueados === 0 && (
            <AlertDialogAction onClick={handleConfirm}>
              Autorizar e Exportar
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
