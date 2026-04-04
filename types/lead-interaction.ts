// Estrutura futura para interações do lead
// No MVP atual ainda usamos string[] simples, mas este tipo já prepara a evolução
export interface LeadInteraction {
  id: number;
  leadId: number;
  tipo: "mensagem" | "ligacao" | "reuniao" | "qualificacao" | "handoff" | "outro";
  descricao: string;
  createdAt: string;
}