// Estrutura futura da passagem de bastão entre SDR e closer
export interface LeadHandoff {
  leadId: number;
  fromOwner: "sdr";
  toOwner: "closer";
  resumo: string;
  createdAt: string;
}