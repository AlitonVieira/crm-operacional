import type { Lead, LeadView } from "@/types/lead";

import { getLeadReadiness } from "@/lib/leads";

// Props do painel lateral
type LeadSidebarProps = {
  selectedLead: Lead;

  activeView: LeadView;

  onTransferToCloser: () => void;

  onRegisterAction: (
    action: string
  ) => void;

  onMarkAsWon: () => void;

  onScheduleFollowUp: () => void;
};

// Painel lateral do lead
export function LeadSidebar({
  selectedLead,
  activeView,
  onTransferToCloser,
  onRegisterAction,
  onMarkAsWon,
  onScheduleFollowUp,
}: LeadSidebarProps) {
  // Leitura rápida de prontidão
  const leadReadiness =
    getLeadReadiness(selectedLead);

  return (
    <aside className="hidden w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm lg:block">

      {/* TOPO */}
      <div className="border-b border-slate-200 pb-4">

        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Lead em foco
        </p>

        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          {selectedLead.nome}
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          {selectedLead.empresa}
        </p>

      </div>

      {/* CONTEXTO */}
      <div className="mt-6 rounded-xl bg-slate-50 p-4">

        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Contexto
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-700">
          {selectedLead.resumo}
        </p>

      </div>

      {/* VISÃO SDR */}
      {activeView === "sdr" && (
        <div className="mt-4 space-y-4">

          {/* PRONTIDÃO */}
          <div className="rounded-xl border border-slate-200 p-4">

            <div className="flex items-center justify-between gap-3">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Prontidão
              </p>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${leadReadiness.bg} ${leadReadiness.text}`}
              >
                {leadReadiness.label}
              </span>

            </div>
          </div>

          {/* QUALIFICAÇÃO */}
          <div className="grid gap-4">

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Tipo de negócio
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {
                  selectedLead.qualificacao
                    .tipoNegocio
                }
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Faturamento
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {
                  selectedLead.qualificacao
                    .faturamento
                }
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Objetivo
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {
                  selectedLead.qualificacao
                    .objetivo
                }
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Momento
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {
                  selectedLead.qualificacao
                    .momento
                }
              </p>

            </div>
          </div>

          {/* AÇÕES SDR */}
          <div className="rounded-xl border border-slate-200 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Ações rápidas
            </p>

            <div className="mt-4 grid gap-3">

              <button
                onClick={onTransferToCloser}
                className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700"
              >
                Passar para reunião
              </button>

              <button
                onClick={() =>
                  onRegisterAction(
                    "Mensagem enviada pelo SDR"
                  )
                }
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Registrar mensagem
              </button>

            </div>
          </div>
        </div>
      )}

      {/* VISÃO CLOSER */}
      {activeView === "closer" && (
        <div className="mt-4 space-y-4">

          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-sky-700">
              Resumo SDR
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {selectedLead.resumoSdr}
            </p>

          </div>

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Proposta
            </p>

            <p className="mt-2 text-sm font-medium text-slate-900">
              {selectedLead.valorProposta}
            </p>

          </div>

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Próxima ação
            </p>

            <p className="mt-2 text-sm font-medium text-slate-900">
              {selectedLead.proximaAcao}
            </p>

          </div>

          {/* AÇÕES */}
          <div className="rounded-xl border border-slate-200 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Ações rápidas
            </p>

            <div className="mt-4 grid gap-3">

              <button
                onClick={onMarkAsWon}
                className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Marcar como ganho
              </button>

              <button
                onClick={onScheduleFollowUp}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Agendar follow-up
              </button>

            </div>
          </div>
        </div>
      )}

      {/* HISTÓRICO */}
      <div className="mt-4 rounded-xl bg-slate-50 p-4">

        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Últimas interações
        </p>

        <div className="mt-3 space-y-3">

          {selectedLead.historico.map(
            (item, index) => (
              <div
                key={`${selectedLead.id}-${index}`}
                className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700"
              >
                {item}
              </div>
            )
          )}

        </div>
      </div>
    </aside>
  );
}