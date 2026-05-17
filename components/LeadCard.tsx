import type { Lead } from "@/types/lead";

import {
  getPriorityStyles,
} from "@/lib/leads";

// Tipagem das props do componente
type LeadCardProps = {
  lead: Lead;

  isSelected: boolean;

  onSelectLead: (lead: Lead) => void;
};

// Card individual da fila
export function LeadCard({
  lead,
  isSelected,
  onSelectLead,
}: LeadCardProps) {
  // Estilos visuais da prioridade
  const priorityStyles =
    getPriorityStyles(lead.prioridade);

  return (
    <div
      onClick={() => onSelectLead(lead)}
      className={`cursor-pointer rounded-xl border bg-white p-4 transition hover:border-slate-300 ${
        priorityStyles.borda
      } ${
        isSelected
          ? "ring-2 ring-slate-300"
          : ""
      }`}
    >
      {/* Barra superior */}
      <div
        className={`mb-4 h-1 w-16 rounded-full ${priorityStyles.barra}`}
      />

      {/* Topo */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {lead.nome}
          </h3>

          <p className="text-sm text-slate-600">
            {lead.empresa}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${priorityStyles.fundoStatus} ${priorityStyles.textoStatus}`}
          >
            {priorityStyles.label}
          </span>

          <span className="text-xs text-slate-500">
            {lead.status}
          </span>

        </div>
      </div>

      {/* Resumo */}
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {lead.resumo}
      </p>
    </div>
  );
}