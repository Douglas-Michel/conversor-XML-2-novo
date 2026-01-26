# Sistema de Permissões CFOP

## Visão Geral

Este sistema implementa controle de acesso baseado em CFOP (Código Fiscal de Operações e Prestações) para garantir que operações fiscais específicas só sejam processadas com autorização adequada.

## Categorias de Operações Restritas

### 1. **Devolução**
Operações de devolução de mercadorias (entrada ou saída)

**CFOPs Principais:**
- `1201-1209`: Devoluções de compras (dentro do estado)
- `2201-2209`: Devoluções de compras (interestadual)
- `5201-5210`: Devoluções de vendas (dentro do estado)
- `6201-6210`: Devoluções de vendas (interestadual)
- `5411-5412`: Devoluções com substituição tributária (dentro do estado)
- `6411-6412`: Devoluções com substituição tributária (interestadual)

### 2. **Remessa**
Operações de remessa (industrialização, consignação, demonstração, etc.)

**CFOPs Principais:**
- `1901-1925`: Entradas de remessa (dentro do estado)
- `2901-2925`: Entradas de remessa (interestadual)
- `5901-5929`: Saídas de remessa (dentro do estado)
- `6901-6925`: Saídas de remessa (interestadual)

**Tipos de remessa incluídos:**
- Industrialização por encomenda
- Venda fora do estabelecimento
- Depósito fechado/armazém geral
- Comodato
- Bonificação/doação/brinde
- Amostra grátis
- Demonstração
- Conserto ou reparo
- Consignação mercantil
- Vasilhame ou sacaria

### 3. **Estorno**
Operações de estorno/devolução de ativo imobilizado ou uso/consumo

**CFOPs Principais:**
- `1410-1411`: Devoluções de ativo/uso e consumo (entrada - dentro do estado)
- `2410-2411`: Devoluções de ativo/uso e consumo (entrada - interestadual)
- `5410-5411`: Devoluções de ativo/uso e consumo (saída - dentro do estado)
- `6410-6411`: Devoluções de ativo/uso e consumo (saída - interestadual)

## Como Funciona

### 1. Extração de CFOP
Durante o parsing do XML, o sistema extrai automaticamente o CFOP de cada produto na nota fiscal:

```typescript
// Em xmlParser.ts
const cfop = getTextContent(prod, 'CFOP');
```

### 2. Validação Durante Exportação
Antes de exportar para Excel, o sistema:

1. Coleta todos os CFOPs das notas
2. Verifica se há CFOPs restritos
3. Se houver, exibe diálogo de autorização
4. Aguarda senha de supervisor
5. Só permite exportação após autorização

### 3. Diálogo de Autorização
O componente `CFOPPermissionDialog` exibe:

- Quantidade total de operações restritas
- Categorias detectadas (Devolução, Remessa, Estorno)
- Detalhamento de cada CFOP restrito
- Lista dos 5 primeiros CFOPs de cada categoria
- Botões para autorizar ou cancelar

### 4. Níveis de Permissão

```typescript
export type StatusPermissao = 
  | 'PERMITIDO'           // Liberado automaticamente
  | 'REQUER_AUTORIZACAO'  // Precisa de senha
  | 'BLOQUEADO'          // Nunca permitido
```

## Arquivos Envolvidos

### `/src/lib/cfopPermissions.ts`
Biblioteca principal com:
- Definições de todos os CFOPs restritos
- Função `validarPermissaoCFOP(cfop: string)`
- Função `verificarCFOPsRestritos(cfops: string[])`
- Mapa completo de configurações

### `/src/lib/xmlParser.ts`
- Campo `cfop` adicionado à interface `NotaFiscal`
- Extração de CFOP durante parsing
- CFOP incluído em cada produto parseado

### `/src/lib/excelExport.ts`
- Coluna "CFOP" adicionada ao Excel
- Exibição do CFOP para cada linha de produto

### `/src/components/CFOPPermissionDialog.tsx`
- Componente de UI para autorização
- Exibe estatísticas e detalhes
- Solicita senha de supervisor

### `/src/components/ExportButton.tsx`
- Integração da validação de CFOP
- Fluxo de autorização antes da exportação
- Tratamento de permissões

## Uso do Sistema

### Para Usuário Final

1. **Upload de XMLs**: Faça upload das notas fiscais normalmente
2. **Visualização**: Os dados são carregados na tabela
3. **Exportação**: Ao clicar em "Exportar Excel":
   - Se não houver CFOPs restritos → Exporta imediatamente
   - Se houver CFOPs restritos → Abre diálogo de autorização
4. **Autorização**: Digite a senha de supervisor
5. **Conclusão**: Arquivo Excel é baixado com coluna CFOP incluída

### Para Desenvolvedor

#### Adicionar Novos CFOPs Restritos

Edite `/src/lib/cfopPermissions.ts`:

```typescript
export const CFOPS_DEVOLUCAO: ConfiguracaoCFOP[] = [
  // Adicione novos CFOPs aqui
  { 
    codigo: '5XXX', 
    categoria: 'DEVOLUCAO', 
    descricao: 'Descrição da operação', 
    permissao: 'REQUER_AUTORIZACAO' 
  },
];
```

#### Mudar Nível de Permissão

```typescript
// De REQUER_AUTORIZACAO para BLOQUEADO
{ 
  codigo: '5201', 
  categoria: 'DEVOLUCAO', 
  descricao: 'Devolução de venda', 
  permissao: 'BLOQUEADO'  // Nunca será permitido
},
```

#### Customizar Validação de Senha

Edite `/src/components/ExportButton.tsx`:

```typescript
const handleConfirmAuthorization = (autorizacao: string) => {
  // Adicione sua lógica de validação aqui
  const senhaCorreta = 'supervisor123';
  
  if (autorizacao === senhaCorreta) {
    // Autorizado
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

## Estatísticas e Relatórios

A função `verificarCFOPsRestritos()` retorna:

```typescript
{
  total: number,           // Total de CFOPs analisados
  restritos: number,       // Quantidade de CFOPs restritos
  bloqueados: number,      // Quantidade de CFOPs bloqueados
  categorias: Map<CategoriaOperacao, number>  // Contagem por categoria
}
```

## Segurança

### Recomendações

1. **Senha Forte**: Implemente validação de senha robusta
2. **Log de Autorizações**: Registre quem autorizou e quando
3. **Auditoria**: Mantenha histórico de operações autorizadas
4. **Níveis de Acesso**: Considere diferentes níveis de supervisor
5. **Timeout**: Implemente timeout de sessão autorizada

### Exemplo de Implementação Segura

```typescript
// Em um arquivo separado auth.ts
export async function validarSenhaAutorizacao(senha: string): Promise<boolean> {
  // Hash da senha
  const hash = await bcrypt.hash(senha, 10);
  
  // Valida contra banco de dados ou API
  const isValid = await api.validateSupervisorPassword(hash);
  
  // Log da tentativa
  await api.logAuthorizationAttempt({
    timestamp: new Date(),
    success: isValid,
    user: getCurrentUser(),
  });
  
  return isValid;
}
```

## Manutenção

### Atualizações de CFOP

A Receita Federal pode alterar CFOPs periodicamente. Para atualizar:

1. Consulte a tabela oficial em: https://www.nfe.fazenda.gov.br/
2. Edite `/src/lib/cfopPermissions.ts`
3. Adicione/remova CFOPs conforme necessário
4. Teste com XMLs reais
5. Documente as mudanças

### Testes

Para testar o sistema:

```typescript
// Teste unitário
import { validarPermissaoCFOP } from '@/lib/cfopPermissions';

test('CFOP 5201 requer autorização', () => {
  const resultado = validarPermissaoCFOP('5201');
  expect(resultado.requerAutorizacao).toBe(true);
  expect(resultado.categoria).toBe('DEVOLUCAO');
});
```

## Troubleshooting

### CFOP não está sendo extraído
- Verifique se o XML contém a tag `<CFOP>` dentro de `<prod>`
- Alguns XMLs podem usar tags diferentes ou namespaces

### Diálogo não aparece
- Verifique se há CFOPs restritos de fato
- Use `console.log()` para debug em `ExportButton.tsx`

### Senha não valida
- Implemente lógica de validação em `handleConfirmAuthorization`
- Por padrão, qualquer senha não-vazia é aceita (apenas para desenvolvimento)

## Referências

- [Tabela CFOP - Receita Federal](https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=/fJ0HWL60Y=)
- [Layout NF-e](http://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=BMPFMBoln3w=)
- Resolução SEFAZ sobre operações fiscais

## Changelog

### v1.0.0 (2026-01-26)
- ✅ Sistema de permissões baseado em CFOP implementado
- ✅ Categorias principais: Devolução, Remessa, Estorno
- ✅ 200+ CFOPs configurados
- ✅ Diálogo de autorização interativo
- ✅ Coluna CFOP no Excel
- ✅ Extração automática de CFOP do XML

## Suporte

Para questões ou problemas, entre em contato com a equipe de desenvolvimento ou consulte a documentação técnica completa.
