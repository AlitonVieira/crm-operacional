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

import { LeadSection } from "@/components/LeadSection";

import { LeadSidebar } from "@/components/LeadSidebar";

import { ViewSwitcher } from "@/components/ViewSwitcher";

import { DashboardSummary } from "@/components/DashboardSummary";

// Página principal do CRM
export default function Home() {
  // Lista atual de leads
  const [leadList, setLeadList] =
    useState<Lead[]>(mockLeads);

  // Lead selecionado
  const [selectedLead, setSelectedLead] =
    useState<Lead>(mockLeads[0]);

  // Filtro ativo
  const [activeFilter, setActiveFilter] =
    useState<LeadFilter>("todos");

  // Visão atual
  const [activeView, setActiveView] =
    useState<LeadView>("closer");

  // Feedback visual temporário
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

  // Agrupamento por responsável
  const { closerLeads, sdrLeads } =
    groupLeadsByOwner(leadList);

  // Agrupamento closer
  const {
    criticalLeads,
    negotiationLeads,
    followUpLeads,
  } = groupLeadsByPriority(closerLeads);

  // Agrupamento SDR
  const {
    criticalLeads: repliedLeads,
    negotiationLeads: qualificationLeads,
    followUpLeads: waitingResponseLeads,
  } = groupLeadsByPriority(sdrLeads);

  // Cards de resumo
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

  // Leitura de prontidão
  const leadReadiness =
    getLeadReadiness(selectedLead);

  // Leads visíveis na visão atual
  const visibleLeads =
    getVisibleLeadsByView(
      activeView,
      closerLeads,
      sdrLeads
    );

  // Verifica se lead ainda existe
  const hasVisibleSelectedLead =
    visibleLeads.some(
      (lead) => lead.id === selectedLead.id
    );

  // Remove feedback visual
  useEffect(() => {
    if (!transferMessage) return;

    const timer = setTimeout(() => {
      setTransferMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [transferMessage]);

  // Mantém lead válido ao trocar visão
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

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 p-6">

        {/* FILA PRINCIPAL */}
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

          {/* TROCA DE VISÃO*/}
          <ViewSwitcher
            activeView={activeView}
            onChangeView={setActiveView}
          />

          {/* RESUMO */}
          <DashboardSummary
            title={
              activeView === "closer"
                ? "Prioridades do Closer"
                : "Prioridades do SDR"
            }
            items={
              activeView === "closer"
                ? closerSummary
                : sdrSummary
            }
          />

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

          {/* FILA */}
          <div className="space-y-8">

            {activeView === "closer" ? (
              <>
                {(activeFilter === "todos" ||
                  activeFilter === "critica") && (
                  <LeadSection
                    title="Ação imediata"
                    description="Leads que pedem atenção agora"
                    leads={criticalLeads}
                    selectedLeadId={
                      selectedLead.id
                    }
                    onSelectLead={
                      setSelectedLead
                    }
                  />
                )}

                {(activeFilter === "todos" ||
                  activeFilter === "negociacao") && (
                  <LeadSection
                    title="Em negociação"
                    description="Oportunidades em andamento"
                    leads={negotiationLeads}
                    selectedLeadId={
                      selectedLead.id
                    }
                    onSelectLead={
                      setSelectedLead
                    }
                  />
                )}

                {(activeFilter === "todos" ||
                  activeFilter === "followup") && (
                  <LeadSection
                    title="Continuidade"
                    description="Leads que precisam de próximo passo"
                    leads={followUpLeads}
                    selectedLeadId={
                      selectedLead.id
                    }
                    onSelectLead={
                      setSelectedLead
                    }
                  />
                )}
              </>
            ) : (
              <>
                {(activeFilter === "todos" ||
                  activeFilter === "critica") && (
                  <LeadSection
                    title="Responder agora"
                    description="Leads engajados esperando retorno"
                    leads={repliedLeads}
                    selectedLeadId={
                      selectedLead.id
                    }
                    onSelectLead={
                      setSelectedLead
                    }
                  />
                )}

                {(activeFilter === "todos" ||
                  activeFilter === "negociacao") && (
                  <LeadSection
                    title="Em qualificação"
                    description="Leads em avanço SDR"
                    leads={
                      qualificationLeads
                    }
                    selectedLeadId={
                      selectedLead.id
                    }
                    onSelectLead={
                      setSelectedLead
                    }
                  />
                )}

                {(activeFilter === "todos" ||
                  activeFilter === "followup") && (
                  <LeadSection
                    title="Aguardando resposta"
                    description="Leads sem retorno recente"
                    leads={
                      waitingResponseLeads
                    }
                    selectedLeadId={
                      selectedLead.id
                    }
                    onSelectLead={
                      setSelectedLead
                    }
                  />
                )}
              </>
            )}

          </div>
        </section>

        {visibleLeads.length &&
        hasVisibleSelectedLead ? (
          <LeadSidebar
            selectedLead={selectedLead}
            activeView={activeView}
            onTransferToCloser={
              handleTransferToCloser
            }
            onRegisterAction={
              handleRegisterAction
            }
            onMarkAsWon={handleMarkAsWon}
            onScheduleFollowUp={
              handleScheduleFollowUp
            }
          />
        ) : (
          <aside className="hidden w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm lg:block">

            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center">

              <p className="text-sm text-slate-500">
                Nenhum lead disponível
              </p>

            </div>
          </aside>
      )}
      </div>
    </main>
  );
}