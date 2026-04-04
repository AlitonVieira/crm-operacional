"use client";

import { useEffect, useState } from "react";
import type { Lead, LeadFilter, LeadUpdateData, LeadView } from "@/types/lead";
import { mockLeads } from "@/data/mock-leads";
import {
  getLeadReadiness,
  getPriorityStyles,
  getVisibleLeadsByView,
  groupLeadsByOwner,
  groupLeadsByPriority,
} from "@/lib/leads";

// Página principal do CRM
export default function Home() {
  // Lista atual de leads
  const [leadList, setLeadList] = useState<Lead[]>(mockLeads);

  // Lead atualmente em foco
  const [selectedLead, setSelectedLead] = useState<Lead>(mockLeads[0]);

  // Filtro visível na fila
  const [activeFilter, setActiveFilter] = useState<LeadFilter>("todos");

  // Visão ativa da tela
  const [activeView, setActiveView] = useState<LeadView>("closer");

  // Feedback temporário
  const [transferMessage, setTransferMessage] = useState("");

  // Atualiza lead selecionado
  function updateSelectedLead(data: LeadUpdateData) {
    const updatedLead: Lead = {
      ...selectedLead,
      ...data,
    };

    setSelectedLead(updatedLead);

    setLeadList((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === selectedLead.id ? updatedLead : lead
      )
    );
  }

  // Registra ação simples no histórico
  function registerAction(actionLabel: string) {
    const updatedHistory = [actionLabel, ...selectedLead.historico];

    updateSelectedLead({
      historico: updatedHistory,
    });
  }

  // Passa lead do SDR para o closer
  function transferLeadToCloser() {
    const updatedLead: Lead = {
      ...selectedLead,
      status: "Reunião agendada",
      prioridade: "critica",
      proximaAcao: "Lead transferido para o closer",
      responsavel: "closer",
      resumoSdr: `${selectedLead.qualificacao.tipoNegocio}, fatura ${selectedLead.qualificacao.faturamento}, quer ${selectedLead.qualificacao.objetivo.toLowerCase()} e está no momento: ${selectedLead.qualificacao.momento.toLowerCase()}.`,
      historico: [
        "SDR agendou reunião e transferiu o lead para o closer",
        ...selectedLead.historico,
      ],
    };

    setSelectedLead(updatedLead);

    setLeadList((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === selectedLead.id ? updatedLead : lead
      )
    );

    setActiveView("closer");
    setTransferMessage(
      `Lead ${selectedLead.nome} transferido com sucesso para o closer.`
    );
  }

  // Grupos por responsável
  const { closerLeads, sdrLeads } = groupLeadsByOwner(leadList);

  // Grupos do closer
  const {
    criticalLeads,
    negotiationLeads,
    followUpLeads,
  } = groupLeadsByPriority(closerLeads);

  // Grupos do SDR
  const {
    criticalLeads: repliedLeads,
    negotiationLeads: qualificationLeads,
    followUpLeads: waitingResponseLeads,
  } = groupLeadsByPriority(sdrLeads);

  // Resumo do topo
  const closerSummary = [
    { label: "Críticos", value: criticalLeads.length },
    { label: "Negociação", value: negotiationLeads.length },
    { label: "Follow-up", value: followUpLeads.length },
  ];

  const sdrSummary = [
    { label: "Responder agora", value: repliedLeads.length },
    { label: "Qualificação", value: qualificationLeads.length },
    { label: "Aguardando resposta", value: waitingResponseLeads.length },
  ];

  // Leitura visual do lead
  const leadReadiness = getLeadReadiness(selectedLead);

  // Leads visíveis conforme a visão
  const visibleLeads = getVisibleLeadsByView(
    activeView,
    closerLeads,
    sdrLeads
  );

  // Confirma se o lead selecionado ainda faz sentido
  const hasVisibleSelectedLead = visibleLeads.some(
    (lead) => lead.id === selectedLead.id
  );

  // Limpa mensagem temporária
  useEffect(() => {
    if (!transferMessage) return;

    const timer = setTimeout(() => {
      setTransferMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [transferMessage]);

  // Mantém seleção coerente com a visão atual
  useEffect(() => {
    if (visibleLeads.length === 0) {
      return;
    }

    const selectedLeadStillVisible = visibleLeads.some(
      (lead) => lead.id === selectedLead.id
    );

    if (!selectedLeadStillVisible) {
      setSelectedLead(visibleLeads[0]);
    }
  }, [activeView, visibleLeads, selectedLead.id]);

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
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {sectionLeads.length}
          </span>
        </div>

        {sectionLeads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-4">
            <p className="text-sm text-slate-500">
              Nenhum lead nesta seção no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sectionLeads.map((lead) => {
              const priorityStyles = getPriorityStyles(lead.prioridade);

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`cursor-pointer rounded-xl border bg-white p-4 transition hover:border-slate-300 ${
                    priorityStyles.borda
                  } ${selectedLead.id === lead.id ? "ring-2 ring-slate-300" : ""}`}
                >
                  <div
                    className={`mb-4 h-1 w-16 rounded-full ${priorityStyles.barra}`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {lead.nome}
                      </h3>
                      <p className="text-sm text-slate-600">{lead.empresa}</p>
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
        <section className="flex-1 rounded-2xl bg-white p-6 shadow-sm">
          <header className="mb-6 border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-bold text-slate-900">
              CRM Operacional
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Sistema de execução comercial
            </p>
          </header>

          {transferMessage && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm font-medium text-emerald-700">
                {transferMessage}
              </p>
            </div>
          )}

          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView("closer")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeView === "closer"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Visão Closer
            </button>

            <button
              onClick={() => setActiveView("sdr")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeView === "sdr"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Visão SDR
            </button>
          </div>

          <div className="mb-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">
              {activeView === "closer"
                ? "Prioridades do Closer"
                : "Prioridades do SDR"}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {activeView === "closer"
                ? "Foque no que está mais perto de fechar ou exige continuidade."
                : "Responda rápido, qualifique bem e passe só o que faz sentido."}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(activeView === "closer" ? closerSummary : sdrSummary).map(
                (item) => (
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
                )
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter("todos")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === "todos"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Todos
            </button>

            <button
              onClick={() => setActiveFilter("critica")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === "critica"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Críticos
            </button>

            <button
              onClick={() => setActiveFilter("negociacao")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === "negociacao"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Negociação
            </button>

            <button
              onClick={() => setActiveFilter("followup")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === "followup"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Follow-up
            </button>
          </div>

          <div className="space-y-8">
            {activeView === "closer" ? (
              <>
                {(activeFilter === "todos" || activeFilter === "critica") &&
                  renderLeadSection(
                    "Ação imediata",
                    "Leads que pedem atenção agora",
                    criticalLeads
                  )}

                {(activeFilter === "todos" || activeFilter === "negociacao") &&
                  renderLeadSection(
                    "Em negociação",
                    "Oportunidades em andamento comercial",
                    negotiationLeads
                  )}

                {(activeFilter === "todos" || activeFilter === "followup") &&
                  renderLeadSection(
                    "Continuidade",
                    "Leads que precisam de próximo passo",
                    followUpLeads
                  )}
              </>
            ) : (
              <>
                {(activeFilter === "todos" || activeFilter === "critica") &&
                  renderLeadSection(
                    "Responder agora",
                    "Leads engajados que pedem resposta rápida",
                    repliedLeads
                  )}

                {(activeFilter === "todos" || activeFilter === "negociacao") &&
                  renderLeadSection(
                    "Em qualificação",
                    "Leads que ainda precisam de avanço e contexto",
                    qualificationLeads
                  )}

                {(activeFilter === "todos" || activeFilter === "followup") &&
                  renderLeadSection(
                    "Aguardando retorno",
                    "Leads que precisam de nova tentativa do SDR",
                    waitingResponseLeads
                  )}
              </>
            )}
          </div>
        </section>

        <aside className="hidden w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm lg:block">
          {!visibleLeads.length || !hasVisibleSelectedLead ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center">
              <p className="text-base font-semibold text-slate-900">
                Nenhum lead disponível nesta visão
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Quando houver leads para este papel, o card lateral mostrará o
                contexto e as ações rápidas.
              </p>
            </div>
          ) : (
            <>
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

                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    Responsável: {selectedLead.responsavel}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Situação atual
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedLead.status}
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Contexto rápido
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedLead.resumo}
                </p>
              </div>

              {activeView === "closer" && selectedLead.resumoSdr && (
                <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-sky-700">
                      Contexto enviado pelo SDR
                    </p>

                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                      Recebido pelo closer
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {selectedLead.resumoSdr}
                  </p>
                </div>
              )}

              {activeView === "closer" ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Prontidão para reunião
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-600">
                        Leitura rápida baseada no momento e nos dados já coletados.
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${leadReadiness.bg} ${leadReadiness.text}`}
                      >
                        {leadReadiness.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Tipo de negócio
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {selectedLead.qualificacao.tipoNegocio}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Faturamento
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {selectedLead.qualificacao.faturamento}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Objetivo principal
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {selectedLead.qualificacao.objetivo}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Momento do lead
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {selectedLead.qualificacao.momento}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Próximas ações
                </p>

                {activeView === "closer" ? (
                  <>
                    <div className="mt-4 grid gap-3">
                      <button
                        onClick={() =>
                          updateSelectedLead({
                            status: "Fechado",
                            prioridade: "negociacao",
                            proximaAcao: "Contrato fechado",
                          })
                        }
                        className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                      >
                        Marcar como ganho
                      </button>

                      <button
                        onClick={() =>
                          updateSelectedLead({
                            status: "Em negociação",
                            prioridade: "negociacao",
                            proximaAcao: "Aguardar retorno da proposta",
                          })
                        }
                        className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                      >
                        Manter em negociação
                      </button>

                      <button
                        onClick={() =>
                          updateSelectedLead({
                            status: "Não fechou",
                            prioridade: "followup",
                            proximaAcao: "Reagendar contato",
                          })
                        }
                        className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                      >
                        Marcar como não fechado
                      </button>
                    </div>

                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Registrar ação
                      </p>

                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <button
                          onClick={() => registerAction("Mensagem enviada")}
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Mensagem
                        </button>

                        <button
                          onClick={() => registerAction("Ligação realizada")}
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Ligação
                        </button>

                        <button
                          onClick={() => registerAction("Reunião realizada")}
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Reunião
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Agendar follow-up
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <button
                          onClick={() =>
                            updateSelectedLead({
                              status: "Follow-up agendado",
                              prioridade: "followup",
                              proximaAcao: "Follow-up amanhã",
                            })
                          }
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Amanhã
                        </button>

                        <button
                          onClick={() =>
                            updateSelectedLead({
                              status: "Follow-up agendado",
                              prioridade: "followup",
                              proximaAcao: "Follow-up em 2 dias",
                            })
                          }
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          2 dias
                        </button>

                        <button
                          onClick={() =>
                            updateSelectedLead({
                              status: "Follow-up agendado",
                              prioridade: "followup",
                              proximaAcao: "Follow-up em 7 dias",
                            })
                          }
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          7 dias
                        </button>

                        <button className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500">
                          Definir data
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-4 grid gap-3">
                      <button
                        onClick={transferLeadToCloser}
                        className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700"
                      >
                        Passar para reunião com o closer
                      </button>

                      <button
                        onClick={() =>
                          updateSelectedLead({
                            status: "Em qualificação",
                            prioridade: "negociacao",
                            proximaAcao: "Continuar conversa com o lead",
                          })
                        }
                        className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                      >
                        Continuar qualificação do lead
                      </button>

                      <button
                        onClick={() =>
                          updateSelectedLead({
                            status: "Desqualificado",
                            prioridade: "followup",
                            proximaAcao: "Sem próxima ação",
                          })
                        }
                        className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                      >
                        Marcar como desqualificado
                      </button>
                    </div>

                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Registrar ação
                      </p>

                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <button
                          onClick={() =>
                            registerAction("Mensagem enviada pelo SDR")
                          }
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Mensagem
                        </button>

                        <button
                          onClick={() =>
                            registerAction("Ligação feita pelo SDR")
                          }
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Ligação
                        </button>

                        <button
                          onClick={() =>
                            registerAction("Qualificação atualizada")
                          }
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Qualificação
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Últimas interações
                </p>

                <div className="mt-3 space-y-3">
                  {selectedLead.historico.map((item, index) => (
                    <div
                      key={`${selectedLead.id}-${index}`}
                      className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}