import type { LeadMoment } from "@/types/lead";

// Dados mínimos de qualificação levantados pelo SDR
export interface LeadQualification {
  tipoNegocio: string;
  faturamento: string;
  objetivo: string;
  momento: LeadMoment;
}