import type { Lead, LeadPriority, LeadReadiness, LeadView } from "@/types/lead";

// Estilos visuais por prioridade da fila
export function getPriorityStyles(prioridade: LeadPriority) {
  if (prioridade === "critica") {
    return {
      borda: "border-red-200",
      fundoStatus: "bg-red-100",
      textoStatus: "text-red-700",
      barra: "bg-red-500",
      label: "Crítico",
    };
  }

  if (prioridade === "negociacao") {
    return {
      borda: "border-amber-200",
      fundoStatus: "bg-amber-100",
      textoStatus: "text-amber-700",
      barra: "bg-amber-500",
      label: "Negociação",
    };
  }

  return {
    borda: "border-sky-200",
    fundoStatus: "bg-sky-100",
    textoStatus: "text-sky-700",
    barra: "bg-sky-500",
    label: "Follow-up",
  };
}

// Leitura simples de prontidão para o card do SDR
export function getLeadReadiness(lead: Lead): LeadReadiness {
  if (lead.momento === "Agora" && lead.faturamento !== "Ainda não enviada") {
    return {
      label: "Alto potencial",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
    };
  }

  if (lead.momento === "Em breve") {
    return {
      label: "Médio potencial",
      bg: "bg-amber-100",
      text: "text-amber-700",
    };
  }

  return {
    label: "Em observação",
    bg: "bg-slate-100",
    text: "text-slate-700",
  };
}

// Separa leads por responsável
export function groupLeadsByOwner(leadList: Lead[]) {
  const closerLeads = leadList.filter((lead) => lead.responsavel === "closer");
  const sdrLeads = leadList.filter((lead) => lead.responsavel === "sdr");

  return {
    closerLeads,
    sdrLeads,
  };
}

// Agrupa leads por prioridade
export function groupLeadsByPriority(leadList: Lead[]) {
  const criticalLeads = leadList.filter((lead) => lead.prioridade === "critica");
  const negotiationLeads = leadList.filter(
    (lead) => lead.prioridade === "negociacao"
  );
  const followUpLeads = leadList.filter((lead) => lead.prioridade === "followup");

  return {
    criticalLeads,
    negotiationLeads,
    followUpLeads,
  };
}

// Retorna os leads visíveis conforme a visão atual
export function getVisibleLeadsByView(
  activeView: LeadView,
  closerLeads: Lead[],
  sdrLeads: Lead[]
) {
  return activeView === "closer" ? closerLeads : sdrLeads;
}