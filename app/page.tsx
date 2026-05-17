"use client";

import { useEffect, useState } from "react";

import type {
  Lead,
  LeadFilter,
  LeadUpdateData,
  LeadView,
} from "@/types/lead";

import { mockLeads } from "@/data/mock-leads";

import {
  getLeadReadiness,
  getPriorityStyles,
  getVisibleLeadsByView,
  groupLeadsByOwner,
  groupLeadsByPriority,
} from "@/lib/leads";

import {
  markLeadAsWon,
  registerLeadInteraction,
  scheduleLeadFollowUp,
  transferLeadToCloser,
  updateLead,
} from "@/services/lead-service";

// Página principal do CRM
export default function Home() {
  // Lista atual de leads
  const [leadList, setLeadList] =
    useState<Lead[]>(mockLeads);

  // Lead selecionado
  const [selectedLead, setSelectedLead] =
    useState<Lead>(mockLeads[0]);

  // Filtro atual
  const [activeFilter, setActiveFilter] =
    useState<LeadFilter>("todos");

  // Visão atual
  const [activeView, setActiveView] =
    useState<LeadView>("closer");

  // Feedback visual
  const [transferMessage, setTransferMessage] =
    useState("");

  // Atualiza lead na lista e no painel
  function syncLead(updatedLead: Lead) {
    setSelectedLead(updatedLead);

    setLeadList((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === updatedLead.id
          ? updatedLead
          : lead
      )
    );
  }

  // Atualiza qualquer dado do lead
  function handleUpdateLead(
    data: LeadUpdateData
  ) {
    const updatedLead = updateLead(
      selectedLead,
      data
    );

    syncLead(updatedLead);
  }

  // Registra interação
  function handleRegisterAction(
    action: string
  ) {
    const updatedLead =
      registerLeadInteraction(
        selectedLead,
        action
      );

    syncLead(updatedLead);
  }

  // Passa lead para closer
  function handleTransferToCloser() {
    const updatedLead =
      transferLeadToCloser(selectedLead);

    syncLead(updatedLead);

    setActiveView("closer");

    setTransferMessage(
      `Lead ${selectedLead.nome} enviado para o closer`
    );
  }

  // Marca lead como ganho
  function handleMarkAsWon() {
    const updatedLead =
      markLeadAsWon(selectedLead);

    syncLead(updatedLead);
  }

  // Agenda follow-up
  function handleScheduleFollowUp() {
    const updatedLead =
      scheduleLeadFollowUp(selectedLead);

    syncLead(updatedLead);
  }

  // Agrupa leads por responsável
  const { closerLeads, sdrLeads } =
    groupLeadsByOwner(leadList);

  // Agrupa leads closer
  const {
    criticalLeads,
    negotiationLeads,
    followUpLeads,
  } = groupLeadsByPriority(closerLeads);

  // Agrupa leads SDR
  const {
    criticalLeads: repliedLeads,
    negotiationLeads: qualificationLeads,
    followUpLeads: waitingResponseLeads,
  } = groupLeadsByPriority(sdrLeads);

  // Resumo do topo
  const closerSummary = [
    {
      label: "Críticos",
      value: criticalLeads.length,
    },
    {
      label: "Negociação",
      value: negotiationLeads.length,
    },
    {
      label: "Follow-up",
      value: followUpLeads.length,
    },
  ];

  const sdrSummary = [
    {
      label: "Responder agora",
      value: repliedLeads.length,
    },
    {
      label: "Qualificação",
      value: qualificationLeads.length,
    },
    {
      label: "Aguardando resposta",
      value: waitingResponseLeads.length,
    },
  ];

  // Prontidão do lead
  const leadReadiness =
    getLeadReadiness(selectedLead);

  // Leads visíveis
  const visibleLeads =
    getVisibleLeadsByView(
      activeView,
      closerLeads,
      sdrLeads
    );

  // Verifica se lead atual ainda existe
  const hasVisibleSelectedLead =
    visibleLeads.some(
      (lead) => lead.id === selectedLead.id
    );

  // Remove mensagem automática
  useEffect(() => {
    if (!transferMessage) return;

    const timer = setTimeout(() => {
      setTransferMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [transferMessage]);

  // Mantém lead válido
  useEffect(() => {
    if (visibleLeads.length === 0) return;

    const selectedLeadStillVisible =
      visibleLeads.some(
        (lead) => lead.id === selectedLead.id
      );

    if (!selectedLeadStillVisible) {
      setSelectedLead(visibleLeads[0]);
    }
  }, [
    activeView,
    visibleLeads,
    selectedLead.id,
  ]);

  // Renderiza seção da fila
  function renderLeadSection(
    title: string,
    description: string,
    sectionLeads: Lead[]
  ) {
    return (
      <div className="space-y-4">
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
            {sectionLeads.length}
          </span>
        </div>

        {sectionLeads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-4">
            <p className="text-sm text-slate-500">
              Nenhum lead nesta seção
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sectionLeads.map((lead) => {
              const priorityStyles =
                getPriorityStyles(
                  lead.prioridade
                );

              return (
                <div
                  key={lead.id}
                  onClick={() =>
                    setSelectedLead(lead)
                  }
                  className={`cursor-pointer rounded-xl border bg-white p-4 transition hover:border-slate-300 ${
                    priorityStyles.borda
                  } ${
                    selectedLead.id === lead.id
                      ? "ring-2 ring-slate-300"
                      : ""
                  }`}
                >
                  <div
                    className={`mb-4 h-1 w-16 rounded-full ${priorityStyles.barra}`}
                  />

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

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {lead.resumo}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 p-6">

        {/* FILA */}
        <section className="flex-1 rounded-2xl bg-white p-6 shadow-sm">

          {/* TOPO */}
          <header className="mb-6 border-b border-slate-200 pb-4">

            <h1 className="text-2xl font-bold text-slate-900">
              CRM Operacional
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Sistema de execução comercial
            </p>

          </header>

          {/* FEEDBACK */}
          {transferMessage && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm font-medium text-emerald-700">
                {transferMessage}
              </p>
            </div>
          )}

          {/* VISÃO */}
          <div className="mb-6 flex flex-wrap gap-3">

            <button
              onClick={() =>
                setActiveView("closer")
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeView === "closer"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Visão Closer
            </button>

            <button
              onClick={() =>
                setActiveView("sdr")
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeView === "sdr"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Visão SDR
            </button>

          </div>

          {/* RESUMO */}
          <div className="mb-6 rounded-2xl bg-slate-50 p-4">

            <p className="text-sm font-medium text-slate-800">
              {activeView === "closer"
                ? "Prioridades do Closer"
                : "Prioridades do SDR"}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">

              {(activeView === "closer"
                ? closerSummary
                : sdrSummary
              ).map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>

                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}

            </div>
          </div>

          {/* FILTROS */}
          <div className="mb-6 flex flex-wrap gap-3">

            {[
              {
                value: "todos",
                label: "Todos",
              },
              {
                value: "critica",
                label: "Críticos",
              },
              {
                value: "negociacao",
                label: "Negociação",
              },
              {
                value: "followup",
                label: "Follow-up",
              },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() =>
                  setActiveFilter(
                    filter.value as LeadFilter
                  )
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter.value
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}

          </div>

          {/* SEÇÕES */}
          <div className="space-y-8">

            {activeView === "closer" ? (
              <>
                {(activeFilter === "todos" ||
                  activeFilter === "critica") &&
                  renderLeadSection(
                    "Ação imediata",
                    "Leads que pedem atenção agora",
                    criticalLeads
                  )}

                {(activeFilter === "todos" ||
                  activeFilter === "negociacao") &&
                  renderLeadSection(
                    "Em negociação",
                    "Oportunidades em andamento",
                    negotiationLeads
                  )}

                {(activeFilter === "todos" ||
                  activeFilter === "followup") &&
                  renderLeadSection(
                    "Continuidade",
                    "Leads que precisam de próximo passo",
                    followUpLeads
                  )}
              </>
            ) : (
              <>
                {(activeFilter === "todos" ||
                  activeFilter === "critica") &&
                  renderLeadSection(
                    "Responder agora",
                    "Leads engajados esperando retorno",
                    repliedLeads
                  )}

                {(activeFilter === "todos" ||
                  activeFilter === "negociacao") &&
                  renderLeadSection(
                    "Em qualificação",
                    "Leads em avanço SDR",
                    qualificationLeads
                  )}

                {(activeFilter === "todos" ||
                  activeFilter === "followup") &&
                  renderLeadSection(
                    "Aguardando resposta",
                    "Leads sem retorno recente",
                    waitingResponseLeads
                  )}
              </>
            )}

          </div>
        </section>

        {/* CARD LATERAL */}
        <aside className="hidden w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm lg:block">

          {!visibleLeads.length ||
          !hasVisibleSelectedLead ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center">
              <p className="text-sm text-slate-500">
                Nenhum lead disponível
              </p>
            </div>
          ) : (
            <>
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

              {/* SDR */}
              {activeView === "sdr" && (
                <div className="mt-4 space-y-4">

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
                        onClick={
                          handleTransferToCloser
                        }
                        className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700"
                      >
                        Passar para reunião
                      </button>

                      <button
                        onClick={() =>
                          handleRegisterAction(
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

              {/* CLOSER */}
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

                  {/* AÇÕES CLOSER */}
                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Ações rápidas
                    </p>

                    <div className="mt-4 grid gap-3">

                      <button
                        onClick={handleMarkAsWon}
                        className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                      >
                        Marcar como ganho
                      </button>

                      <button
                        onClick={
                          handleScheduleFollowUp
                        }
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
            </>
          )}
        </aside>
      </div>
    </main>
  );
}