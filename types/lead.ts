// Tipos centrais do domínio de leads

// Prioridades possíveis dentro da fila
export type LeadPriority = "critica" | "negociacao" | "followup";

// Visões possíveis da tela principal
export type LeadView = "closer" | "sdr";

// Filtros disponíveis na fila
export type LeadFilter = "todos" | "critica" | "negociacao" | "followup";

// Responsável atual pelo lead
export type LeadOwner = "closer" | "sdr";

// Momento percebido do lead durante a qualificação
export type LeadMoment = "Agora" | "Em breve" | "Só pesquisando";

// Status do lead no MVP atual
export type LeadStatus =
  | "Reunião hoje"
  | "No-show"
  | "Negociação"
  | "Follow-up hoje"
  | "Reunião agendada"
  | "Em qualificação"
  | "Desqualificado"
  | "Em negociação"
  | "Fechado"
  | "Não fechou"
  | "Follow-up agendado";

// Estrutura principal do lead no domínio atual do MVP
export interface Lead {
  id: number;
  nome: string;
  empresa: string;
  status: LeadStatus;
  resumo: string;
  prioridade: LeadPriority;
  proximaAcao: string;
  valorProposta: string;
  responsavel: LeadOwner;
  resumoSdr: string;
  historico: string[];
  qualificacao: LeadQualification;
}

// Estrutura usada para atualizar parcialmente um lead
export interface LeadUpdateData {
  status?: LeadStatus;
  prioridade?: LeadPriority;
  proximaAcao?: string;
  historico?: string[];
  responsavel?: LeadOwner;
  resumoSdr?: string;
  qualificacao?: LeadQualification;
}

// Estrutura visual de prontidão usada no card do SDR
export interface LeadReadiness {
  label: string;
  bg: string;
  text: string;
}

// Importação de tipo para evitar duplicação conceitual
import type { LeadQualification } from "@/types/lead-qualification";