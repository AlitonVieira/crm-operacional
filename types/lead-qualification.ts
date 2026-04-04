// Dados mínimos de qualificação levantados pelo SDR
export type LeadMoment = "Agora" | "Em breve" | "Só pesquisando";

export interface LeadQualification {
  tipoNegocio: string;
  faturamento: string;
  objetivo: string;
  momento: LeadMoment;
}