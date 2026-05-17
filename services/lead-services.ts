import type {
  Lead,
  LeadUpdateData,
} from "@/types/lead";

// Atualiza qualquer informação do lead
export function updateLead(
  lead: Lead,
  data: LeadUpdateData
): Lead {
  return {
    ...lead,
    ...data,
  };
}

// Adiciona interação ao histórico
export function registerLeadInteraction(
  lead: Lead,
  action: string
): Lead {
  return {
    ...lead,

    historico: [
      action,
      ...lead.historico,
    ],
  };
}

// Faz transferência SDR -> closer
export function transferLeadToCloser(
  lead: Lead
): Lead {
  return {
    ...lead,

    status: "Reunião agendada",

    prioridade: "critica",

    proximaAcao:
      "Closer deve assumir a reunião",

    responsavel: "closer",

    resumoSdr: `${lead.qualificacao.tipoNegocio}, fatura ${lead.qualificacao.faturamento}, busca ${lead.qualificacao.objetivo.toLowerCase()} e está no momento ${lead.qualificacao.momento.toLowerCase()}.`,

    historico: [
      "SDR agendou reunião e transferiu o lead",
      ...lead.historico,
    ],
  };
}

// Marca lead como ganho
export function markLeadAsWon(
  lead: Lead
): Lead {
  return {
    ...lead,

    status: "Fechado",

    prioridade: "negociacao",

    proximaAcao:
      "Contrato fechado",

    historico: [
      "Lead marcado como ganho",
      ...lead.historico,
    ],
  };
}

// Agenda follow-up
export function scheduleLeadFollowUp(
  lead: Lead
): Lead {
  return {
    ...lead,

    status: "Follow-up agendado",

    prioridade: "followup",

    proximaAcao:
      "Follow-up em 2 dias",

    historico: [
      "Follow-up agendado",
      ...lead.historico,
    ],
  };
}