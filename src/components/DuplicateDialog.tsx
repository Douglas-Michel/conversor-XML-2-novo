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
import { NotaFiscal } from '@/lib/xmlParser';
import { AlertTriangle } from 'lucide-react';

interface DuplicateDialogProps {
  open: boolean;
  duplicates: NotaFiscal[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function DuplicateDialog({ open, duplicates, onConfirm, onCancel }: DuplicateDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle>Produtos Duplicados</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {duplicates.length === 1 ? (
              <span>
                O produto <strong>{duplicates[0]?.produto}</strong> da nota <strong>{duplicates[0]?.danfe}</strong> já foi importado anteriormente.
              </span>
            ) : (
              <span>
                {duplicates.length} produtos já foram importados anteriormente:
              </span>
            )}
          </AlertDialogDescription>
          {duplicates.length > 1 && (
            <div className="mt-3 max-h-48 overflow-y-auto rounded-md border border-border bg-card/50 p-3 shadow-soft">
              <ul className="text-sm space-y-2">
                {duplicates.slice(0, 10).map((nota, idx) => (
                  <li key={idx} className="flex flex-col gap-1 p-2 rounded bg-background/50 border border-border/50">
                    <span className="font-medium text-foreground">{nota.produto}</span>
                    <span className="text-xs text-muted-foreground">NF {nota.danfe}</span>
                  </li>
                ))}
                {duplicates.length > 10 && (
                  <li className="text-xs text-center text-muted-foreground/70 pt-2">
                    ... e mais {duplicates.length - 10} produto(s)
                  </li>
                )}
              </ul>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={onCancel}>
            Cancelar e Revisar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90">
            Importar Mesmo Assim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
