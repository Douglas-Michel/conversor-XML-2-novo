/**
 * @fileoverview Sistema de autenticação para autorizações de CFOP
 * Exemplo de implementação segura com hash de senhas
 * 
 * IMPORTANTE: Este é um exemplo. Em produção, use um backend real
 * com autenticação JWT, OAuth2, ou similar.
 */

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

/**
 * Senhas de supervisor (em produção, use hash e armazene em backend)
 * NUNCA armazene senhas em texto plano no código real!
 */
const SENHAS_AUTORIZADAS = {
  // Exemplo: use bcrypt ou similar em produção
  supervisor: 'sup3rv1s0r@2024',
  gerente: 'g3r3nt3@2024',
  admin: 'adm1n@2024',
};

/**
 * Níveis de autorização por usuário
 */
export enum NivelAutorizacao {
  SUPERVISOR = 'SUPERVISOR',
  GERENTE = 'GERENTE',
  ADMIN = 'ADMIN',
}

/**
 * Interface para log de autorização
 */
interface LogAutorizacao {
  timestamp: Date;
  usuario: string;
  nivel: NivelAutorizacao;
  cfopsAutorizados: string[];
  sucesso: boolean;
  ip?: string;
}

// ============================================================================
// VALIDAÇÃO DE SENHA (EXEMPLO SIMPLES)
// ============================================================================

/**
 * Valida senha e retorna nível de autorização
 * 
 * ⚠️ ATENÇÃO: Este é um exemplo simplificado!
 * Em produção, use:
 * - bcrypt para hash de senhas
 * - Backend/API para validação
 * - JWT para sessões
 * - Rate limiting contra brute force
 * 
 * @param senha - Senha digitada pelo usuário
 * @returns Nível de autorização ou null se inválida
 */
export function validarSenhaAutorizacao(senha: string): NivelAutorizacao | null {
  // Trim da senha
  const senhaTrimmed = senha.trim();
  
  // Valida contra senhas armazenadas
  if (senhaTrimmed === SENHAS_AUTORIZADAS.admin) {
    return NivelAutorizacao.ADMIN;
  }
  if (senhaTrimmed === SENHAS_AUTORIZADAS.gerente) {
    return NivelAutorizacao.GERENTE;
  }
  if (senhaTrimmed === SENHAS_AUTORIZADAS.supervisor) {
    return NivelAutorizacao.SUPERVISOR;
  }
  
  return null;
}

// ============================================================================
// LOGGING E AUDITORIA
// ============================================================================

/**
 * Armazena logs de autorização (em produção, salve em banco de dados)
 */
const logsAutorizacao: LogAutorizacao[] = [];

/**
 * Registra tentativa de autorização
 * 
 * @param log - Dados do log
 */
export function registrarAutorizacao(log: Omit<LogAutorizacao, 'timestamp'>): void {
  const logCompleto: LogAutorizacao = {
    ...log,
    timestamp: new Date(),
  };
  
  logsAutorizacao.push(logCompleto);
  
  // Em produção, envie para API/backend
  console.log('📋 Log de Autorização:', logCompleto);
  
  // Salva em localStorage como backup temporário
  try {
    const logsAntigos = JSON.parse(localStorage.getItem('cfop_auth_logs') || '[]');
    logsAntigos.push(logCompleto);
    
    // Mantém apenas últimos 100 logs
    const logsRecentes = logsAntigos.slice(-100);
    localStorage.setItem('cfop_auth_logs', JSON.stringify(logsRecentes));
  } catch (error) {
    console.error('Erro ao salvar log:', error);
  }
}

/**
 * Recupera logs de autorização
 * 
 * @param limite - Número máximo de logs a retornar
 * @returns Array de logs
 */
export function obterLogsAutorizacao(limite: number = 50): LogAutorizacao[] {
  try {
    const logs = JSON.parse(localStorage.getItem('cfop_auth_logs') || '[]');
    return logs.slice(-limite);
  } catch (error) {
    console.error('Erro ao recuperar logs:', error);
    return [];
  }
}

/**
 * Exporta logs para CSV
 * 
 * @returns String CSV com logs
 */
export function exportarLogsCSV(): string {
  const logs = obterLogsAutorizacao(1000);
  
  const headers = 'Timestamp,Usuário,Nível,CFOPs,Sucesso,IP\n';
  const rows = logs.map(log => 
    `${log.timestamp},${log.usuario},${log.nivel},"${log.cfopsAutorizados.join(', ')}",${log.sucesso},${log.ip || 'N/A'}`
  ).join('\n');
  
  return headers + rows;
}

// ============================================================================
// PROTEÇÃO CONTRA BRUTE FORCE
// ============================================================================

interface TentativaLogin {
  timestamp: number;
  sucesso: boolean;
}

const tentativasLogin = new Map<string, TentativaLogin[]>();

/**
 * Verifica se usuário está bloqueado por tentativas excessivas
 * 
 * @param identificador - IP ou identificador do usuário
 * @returns true se bloqueado
 */
export function verificarBloqueio(identificador: string): boolean {
  const tentativas = tentativasLogin.get(identificador) || [];
  const agora = Date.now();
  const janelaTempo = 15 * 60 * 1000; // 15 minutos
  
  // Remove tentativas antigas
  const tentativasRecentes = tentativas.filter(t => agora - t.timestamp < janelaTempo);
  tentativasLogin.set(identificador, tentativasRecentes);
  
  // Conta falhas recentes
  const falhasRecentes = tentativasRecentes.filter(t => !t.sucesso);
  
  // Bloqueia após 5 tentativas falhas em 15 minutos
  return falhasRecentes.length >= 5;
}

/**
 * Registra tentativa de login
 * 
 * @param identificador - IP ou identificador do usuário
 * @param sucesso - Se a tentativa foi bem-sucedida
 */
export function registrarTentativa(identificador: string, sucesso: boolean): void {
  const tentativas = tentativasLogin.get(identificador) || [];
  tentativas.push({
    timestamp: Date.now(),
    sucesso,
  });
  tentativasLogin.set(identificador, tentativas);
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Gera hash simples de senha (APENAS PARA EXEMPLO!)
 * Em produção use bcrypt, argon2, ou similar
 * 
 * @param senha - Senha em texto plano
 * @returns Hash da senha
 */
export async function gerarHashSenha(senha: string): Promise<string> {
  // ATENÇÃO: Este não é seguro! Use uma biblioteca real!
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Obtém identificador do cliente (IP simulado)
 * Em produção, use o IP real do backend
 * 
 * @returns Identificador único
 */
export function obterIdentificadorCliente(): string {
  // Em produção, obtenha o IP real do backend
  return `browser_${navigator.userAgent.slice(0, 20)}`;
}

// ============================================================================
// EXEMPLO DE USO INTEGRADO
// ============================================================================

/**
 * Função completa de autorização com todas as proteções
 * 
 * @param senha - Senha digitada
 * @param cfops - CFOPs sendo autorizados
 * @returns Objeto com resultado da autorização
 */
export async function autorizarOperacao(
  senha: string,
  cfops: string[]
): Promise<{
  autorizado: boolean;
  nivel: NivelAutorizacao | null;
  mensagem: string;
}> {
  const identificador = obterIdentificadorCliente();
  
  // 1. Verifica bloqueio por tentativas excessivas
  if (verificarBloqueio(identificador)) {
    return {
      autorizado: false,
      nivel: null,
      mensagem: 'Muitas tentativas falhas. Tente novamente em 15 minutos.',
    };
  }
  
  // 2. Valida senha
  const nivel = validarSenhaAutorizacao(senha);
  const sucesso = nivel !== null;
  
  // 3. Registra tentativa
  registrarTentativa(identificador, sucesso);
  
  // 4. Registra log de autorização
  registrarAutorizacao({
    usuario: nivel || 'DESCONHECIDO',
    nivel: nivel || NivelAutorizacao.SUPERVISOR,
    cfopsAutorizados: cfops,
    sucesso,
    ip: identificador,
  });
  
  // 5. Retorna resultado
  if (!sucesso) {
    return {
      autorizado: false,
      nivel: null,
      mensagem: 'Senha incorreta. Verifique suas credenciais.',
    };
  }
  
  return {
    autorizado: true,
    nivel,
    mensagem: `Autorizado com nível ${nivel}. ${cfops.length} CFOPs liberados.`,
  };
}

// ============================================================================
// EXEMPLO DE IMPLEMENTAÇÃO COM BACKEND (RECOMENDADO)
// ============================================================================

/**
 * EXEMPLO: Validação via API backend (RECOMENDADO PARA PRODUÇÃO)
 * 
 * ```typescript
 * export async function validarComBackend(senha: string): Promise<boolean> {
 *   try {
 *     const response = await fetch('/api/auth/validate-supervisor', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ password: senha }),
 *     });
 *     
 *     const data = await response.json();
 *     return data.authorized === true;
 *   } catch (error) {
 *     console.error('Erro na validação:', error);
 *     return false;
 *   }
 * }
 * ```
 */
