// Tipos base para o domínio de leads do CRM operacional

// Prioridades possíveis dentro da fila
export type LeadPriority = "critica" | "negociacao" | "followup";

// Visões possíveis da tela principal
export type LeadView = "closer" | "sdr";

// Filtros disponíveis na fila
export type LeadFilter = "todos" | "critica" | "negociacao" | "followup";

// Responsável atual pelo lead
export type LeadOwner = "closer" | "sdr";

// Estrutura visual de prontidão usada no card do SDR
export interface LeadReadiness {
  label: string;
  bg: string;
  text: string;
}

// Estrutura principal do lead no MVP atual
export interface Lead {
  id: number;
  nome: string;
  empresa: string;
  status: string;
  resumo: string;
  prioridade: LeadPriority;
  proximaAcao: string;
  valorProposta: string;
  tipoNegocio: string;
  faturamento: string;
  objetivo: string;
  momento: string;
  responsavel: LeadOwner;
  resumoSdr: string;
  historico: string[];
}

// Estrutura usada para atualizar parcialmente um lead
export interface LeadUpdateData {
  status?: string;
  prioridade?: LeadPriority;
  proximaAcao?: string;
  historico?: string[];
  responsavel?: LeadOwner;
  resumoSdr?: string;
}