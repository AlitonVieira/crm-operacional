import type { Lead } from "@/types/lead";

import { LeadCard } from "./LeadCard";

// Props da seção
type LeadSectionProps = {
  title: string;

  description: string;

  leads: Lead[];

  selectedLeadId: number;

  onSelectLead: (lead: Lead) => void;
};

// Seção da fila operacional
export function LeadSection({
  title,
  description,
  leads,
  selectedLeadId,
  onSelectLead,
}: LeadSectionProps) {
  return (
    <div className="space-y-4">

      {/* Cabeçalho */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-3">

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {leads.length}
        </span>

      </div>

      {/* Estado vazio */}
      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-4">

          <p className="text-sm text-slate-500">
            Nenhum lead nesta seção
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              isSelected={
                selectedLeadId === lead.id
              }
              onSelectLead={onSelectLead}
            />
          ))}

        </div>
      )}
    </div>
  );
}