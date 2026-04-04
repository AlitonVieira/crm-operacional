import type { LeadQualification } from "@/types/lead-qualification";

// Prioridades da fila
export type LeadPriority = "critica" | "negociacao" | "followup";

// Visões da tela principal
export type LeadView = "closer" | "sdr";

// Filtros da fila
export type LeadFilter = "todos" | "critica" | "negociacao" | "followup";

// Responsável atual
export type LeadOwner = "closer" | "sdr";

// Status usados no MVP atual
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

// Entidade principal do lead no MVP
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

// Atualização parcial de lead
export interface LeadUpdateData {
  status?: LeadStatus;
  prioridade?: LeadPriority;
  proximaAcao?: string;
  historico?: string[];
  responsavel?: LeadOwner;
  resumoSdr?: string;
  qualificacao?: LeadQualification;
}

// Leitura visual do card SDR
export interface LeadReadiness {
  label: string;
  bg: string;
  text: string;
}