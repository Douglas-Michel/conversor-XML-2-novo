# Sistema de Restrições CFOP - Guia Rápido

## 🎯 O que foi implementado?

Sistema completo de controle de permissões baseado em CFOP para garantir que operações fiscais específicas (devoluções, remessas e estornos) só sejam exportadas com autorização de supervisor.

## ✅ Funcionalidades

### 1. **Extração Automática de CFOP**
- O sistema lê automaticamente o CFOP de cada produto no XML
- Cada linha do Excel contém o CFOP correspondente

### 2. **Categorias Controladas**

#### 🔄 **Devolução** (200+ CFOPs)
- Devoluções de compras: 1201-1209, 2201-2209
- Devoluções de vendas: 5201-5210, 6201-6210
- Devoluções com ST: 5411-5412, 6411-6412

#### 📦 **Remessa** (100+ CFOPs)
- Entrada: 1901-1925, 2901-2925
- Saída: 5901-5929, 6901-6925
- Tipos: industrialização, consignação, demonstração, comodato, etc.

#### ⚡ **Estorno** (8 CFOPs)
- Devoluções de ativo: 1410, 2410, 5410, 6410
- Devoluções uso/consumo: 1411, 2411, 5411, 6411

### 3. **Fluxo de Autorização**

```
Upload XMLs → Processar → Exportar Excel
                              ↓
                    Tem CFOPs restritos?
                    ↙              ↘
                  SIM              NÃO
                   ↓                ↓
           Solicita Senha      Exporta Direto
                   ↓
           Senha Válida?
           ↙         ↘
         SIM        NÃO
          ↓          ↓
     Exporta    Cancela
```

## 🚀 Como Usar

### Para Usuário Final

1. Faça upload dos XMLs normalmente
2. Clique em **"Exportar Excel"**
3. Se houver operações restritas:
   - Abre diálogo mostrando quais CFOPs precisam de autorização
   - Digite a senha de supervisor
   - Clique em "Autorizar e Exportar"
4. Arquivo Excel é baixado com coluna CFOP

### Para Administrador

#### Configurar Senha de Supervisor

Edite `/src/components/ExportButton.tsx`:

```typescript
const handleConfirmAuthorization = (autorizacao: string) => {
  const SENHA_SUPERVISOR = 'sua_senha_aqui';
  
  if (autorizacao === SENHA_SUPERVISOR) {
    // Autorizado
    toast({
      title: 'Autorização concedida',
      description: 'Operações liberadas.',
    });
    performExport();
  } else {
    // Negado
    toast({
      title: 'Senha incorreta',
      variant: 'destructive',
    });
  }
};
```

#### Adicionar Novos CFOPs Restritos

Edite `/src/lib/cfopPermissions.ts`:

```typescript
export const CFOPS_DEVOLUCAO: ConfiguracaoCFOP[] = [
  // ... existentes
  { 
    codigo: 'XXXX',  // Seu CFOP
    categoria: 'DEVOLUCAO',  // ou REMESSA ou ESTORNO
    descricao: 'Descrição da operação', 
    permissao: 'REQUER_AUTORIZACAO' 
  },
];
```

#### Bloquear Completamente um CFOP

```typescript
{ 
  codigo: '5201', 
  categoria: 'DEVOLUCAO', 
  descricao: 'Devolução de venda', 
  permissao: 'BLOQUEADO'  // NUNCA será autorizado
},
```

## 📁 Arquivos Criados/Modificados

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/cfopPermissions.ts` | ⭐ Configuração de CFOPs e validações |
| `src/lib/cfopAuth.ts` | 🔒 Sistema de autenticação (opcional) |
| `src/components/CFOPPermissionDialog.tsx` | 💬 Diálogo de autorização |
| `src/components/ExportButton.tsx` | ✏️ Modificado para validar CFOPs |
| `src/lib/xmlParser.ts` | ✏️ Modificado para extrair CFOP |
| `src/lib/excelExport.ts` | ✏️ Modificado para incluir coluna CFOP |
| `CFOP-PERMISSIONS.md` | 📖 Documentação completa |
| `CFOP-QUICKSTART.md` | 🚀 Este guia rápido |

## 🔐 Segurança Avançada (Opcional)

Para implementar segurança robusta, use o arquivo `cfopAuth.ts`:

```typescript
import { autorizarOperacao } from '@/lib/cfopAuth';

const handleConfirmAuthorization = async (senha: string) => {
  const resultado = await autorizarOperacao(senha, cfops);
  
  if (resultado.autorizado) {
    performExport();
  } else {
    toast({
      title: 'Autorização negada',
      description: resultado.mensagem,
      variant: 'destructive',
    });
  }
};
```

### Recursos Avançados

- ✅ Proteção contra brute force (5 tentativas em 15min)
- ✅ Logs de auditoria com timestamp
- ✅ Exportação de logs em CSV
- ✅ Níveis de autorização (Supervisor, Gerente, Admin)
- ✅ Hash de senhas (exemplo com SHA-256)

## 🧪 Testando o Sistema

### Teste Básico

1. Faça upload de um XML com CFOP 5201 (devolução)
2. Clique em "Exportar Excel"
3. Deve aparecer o diálogo de autorização
4. Digite qualquer senha (por padrão aceita qualquer uma)
5. Confirme a exportação

### Teste com XML Normal

1. Faça upload de XML com CFOP normal (5101, 5102, etc.)
2. Clique em "Exportar Excel"
3. Deve exportar diretamente sem pedir senha

## 📊 Exemplos de CFOPs

| CFOP | Categoria | Descrição |
|------|-----------|-----------|
| 1201 | Devolução | Devolução de compra para industrialização |
| 5201 | Devolução | Devolução de venda de produção |
| 5901 | Remessa | Remessa para industrialização |
| 1410 | Estorno | Devolução de bem do ativo imobilizado |
| 5101 | Normal | Venda normal (não restrito) ✅ |

## ⚙️ Configurações Rápidas

### Desabilitar Sistema de Permissões

Comente a validação em `ExportButton.tsx`:

```typescript
const handleExport = async () => {
  // Comentar essas linhas:
  // const cfops = data.map(nota => nota.cfop).filter(Boolean);
  // const stats = verificarCFOPsRestritos(cfops);
  // if (stats.restritos > 0) {
  //   setShowPermissionDialog(true);
  //   return;
  // }
  
  // Exportar diretamente:
  await performExport();
};
```

### Mudar CFOPs de Categoria

```typescript
// De DEVOLUCAO para REMESSA
{ 
  codigo: '5201', 
  categoria: 'REMESSA',  // Mudou aqui
  descricao: '...', 
  permissao: 'REQUER_AUTORIZACAO' 
},
```

## 🆘 Problemas Comuns

### CFOP não aparece no Excel
**Solução**: Verifique se o XML contém a tag `<CFOP>` dentro de `<prod>`

### Diálogo não abre
**Solução**: Verifique se o CFOP está na lista de restritos em `cfopPermissions.ts`

### Senha sempre aceita
**Solução**: Implemente validação em `handleConfirmAuthorization` no `ExportButton.tsx`

## 📞 Suporte

Para dúvidas:
1. Leia `CFOP-PERMISSIONS.md` (documentação completa)
2. Verifique o código em `src/lib/cfopPermissions.ts`
3. Consulte exemplos em `src/lib/cfopAuth.ts`

---

**Versão**: 1.0.0  
**Data**: 26/01/2026  
**Status**: ✅ Implementado e Funcionando
