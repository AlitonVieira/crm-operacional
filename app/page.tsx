"use client";

import { useState } from "react";

// Lista temporária de leads para montar a interface inicial da fila
// Neste momento estamos usando dados mockados para visualizar o produto
const leads = [
  {
    id: 1,
    nome: "João Silva",
    empresa: "Clínica Vida",
    status: "Reunião hoje",
    resumo: "Quer aumentar o volume de leads e está sensível a preço.",
    prioridade: "critica",
    proximaAcao: "Realizar reunião às 10:00",
    valorProposta: "R$ 2.500",
    tipoNegocio: "Clínica estética",
    faturamento: "R$ 80k/mês",
    objetivo: "Aumentar geração de leads",
    momento: "Agora",
    responsavel: "closer",
    resumoSdr:
      "Clínica estética, fatura cerca de R$ 80k/mês, quer aumentar leads e demonstrou urgência para começar agora.",
    historico: [
      "Lead entrou pelo formulário",
      "SDR fez o primeiro contato",
      "Reunião agendada para hoje",
    ],
  },
  {
    id: 2,
    nome: "Marina Costa",
    empresa: "Agência Prisma",
    status: "No-show",
    resumo: "Não compareceu na reunião e precisa de contato no mesmo dia.",
    prioridade: "critica",
    proximaAcao: "Entrar em contato hoje",
    valorProposta: "R$ 3.000",
    tipoNegocio: "Agência de marketing",
    faturamento: "R$ 50k/mês",
    objetivo: "Melhorar previsibilidade comercial",
    momento: "Em breve",
    responsavel: "closer",
    resumoSdr:
      "Agência de marketing com faturamento em torno de R$ 50k/mês, busca previsibilidade comercial e demonstrou interesse em avançar em breve.",
    historico: [
      "Lead respondeu com interesse",
      "Reunião agendada",
      "Lead não compareceu",
    ],
  },
  {
    id: 3,
    nome: "Carlos Souza",
    empresa: "Studio Forma",
    status: "Negociação",
    resumo: "Recebeu proposta de R$ 3.000 e ficou de responder.",
    prioridade: "negociacao",
    proximaAcao: "Follow-up em 2 dias",
    valorProposta: "R$ 3.000",
    tipoNegocio: "Estúdio de arquitetura",
    faturamento: "R$ 35k/mês",
    objetivo: "Gerar mais oportunidades qualificadas",
    momento: "Agora",
    responsavel: "closer",
    resumoSdr:
      "Estúdio de arquitetura, faturamento aproximado de R$ 35k/mês, quer gerar mais oportunidades qualificadas e já avançou para negociação.",
    historico: [
      "Lead qualificado pelo SDR",
      "Reunião realizada",
      "Proposta enviada",
    ],
  },
  {
    id: 4,
    nome: "Fernanda Alves",
    empresa: "Odonto Prime",
    status: "Follow-up hoje",
    resumo: "Demonstrou interesse, mas está há 2 dias sem interação.",
    prioridade: "followup",
    proximaAcao: "Falar com a lead hoje às 15:00",
    valorProposta: "Ainda não enviada",
    tipoNegocio: "Clínica odontológica",
    faturamento: "R$ 60k/mês",
    objetivo: "Atrair mais pacientes particulares",
    momento: "Só pesquisando",
    responsavel: "sdr",
    resumoSdr:
      "Clínica odontológica com faturamento em torno de R$ 60k/mês, interesse inicial em atrair mais pacientes particulares, ainda em fase de pesquisa.",
    historico: [
      "Lead entrou pelo Instagram",
      "SDR fez contato inicial",
      "Lead pediu mais informações",
    ],
  },
];

// Função responsável por definir o estilo visual de cada prioridade
// Isso evita repetição de classes e deixa a intenção mais clara no código
function getPriorityStyles(prioridade: string) {
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

// Componente principal da página inicial do sistema
export default function Home() {
  // Estado responsável pela lista de leads exibida na fila
  // Isso permite atualizar status e próximas ações sem recarregar a página
  const [leadList, setLeadList] = useState(leads);

  // Estado responsável por guardar qual lead está selecionado na fila
  // Começamos com o primeiro lead já selecionado para evitar painel vazio
  const [selectedLead, setSelectedLead] = useState(leads[0]);

  // Estado responsável por controlar qual filtro está ativo na fila
  // Isso permite que o usuário veja apenas o grupo que deseja no momento
  const [activeFilter, setActiveFilter] = useState("todos");

  //Estado responsável por alternar entre a visão do closer e a visão do SDR
  //Isso ajuda a validar dois fluxos do produto sem criar outra página agora
  const [activeView, setActiveView] = useState("closer");

  // Função responsável por atualizar o lead selecionado
  // Ela altera a lista da fila e também o conteúdo exibido no card lateral
  function updateSelectedLead(data: {
    status?: string;
    prioridade?: string;
    proximaAcao?: string;
    historico?: string[];
    responsavel?: string;
    resumoSdr?: string;
  }) {
    const updatedLead = {
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

  // Função responsável por registrar uma nova ação no histórico do lead
  // A nova ação é adicionada no topo da lista para aparecer primeiro no card
  function registerAction(actionLabel: string) {
    const updatedHistory = [actionLabel, ...selectedLead.historico];

    updateSelectedLead({
      historico: updatedHistory,
    });
  }

  // Função responsável por transferir o lead do SDR para o closer
  // Ela muda o responsável e monta um resumo mais claro para continuidade da venda
  function transferLeadToCloser() {
    const generatedSummary = `${selectedLead.tipoNegocio}, fatura ${selectedLead.faturamento}, quer ${selectedLead.objetivo.toLowerCase()} e está no momento: ${selectedLead.momento.toLowerCase()}.`;

    updateSelectedLead({
      status: "Reunião agendada",
      prioridade: "critica",
      proximaAcao: "Lead transferido para o closer",
      historico: [
        "Lead transferido do SDR para o closer",
        ...selectedLead.historico,
      ],
      // Os campos abaixo são adicionais e serão mesclados no objeto
      ...( {
        responsavel: "closer",
        resumoSdr: generatedSummary,
      } as Partial<typeof selectedLead> ),
    });
  }

  // Leads que pertencem ao closer
  const closerLeads = leadList.filter((lead) => lead.responsavel === "closer");

  // Leads que pertencem ao SDR
  const sdrLeads = leadList.filter((lead) => lead.responsavel === "sdr");

  // Agrupamento da visão do closer
  const criticalLeads = closerLeads.filter((lead) => lead.prioridade === "critica");
  const negotiationLeads = closerLeads.filter(
    (lead) => lead.prioridade === "negociacao"
  );
  const followUpLeads = closerLeads.filter((lead) => lead.prioridade === "followup");

  // Agrupamento da visão do SDR
  const repliedLeads = sdrLeads.filter((lead) => lead.prioridade === "critica");
  const qualificationLeads = sdrLeads.filter(
    (lead) => lead.prioridade === "negociacao"
  );
  const waitingResponseLeads = sdrLeads.filter(
    (lead) => lead.prioridade === "followup"
  );

  // Função responsável por renderizar uma seção da fila
  // Ela recebe o título da seção, a descrição e a lista de leads daquele grupo
  function renderLeadSection(
    title: string,
    description: string,
    sectionLeads: typeof leadList
  ) {
    return (
      <div className="space-y-4">
        {/* Cabeçalho da seção */}
        <div className="flex items-end justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {sectionLeads.length}
          </span>
        </div>

        {/* Estado vazio da seção */}
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
                  {/* 
                    Barra visual superior para indicar a prioridade do lead
                    Isso ajuda o usuário a identificar urgência rapidamente
                  */}
                  <div
                    className={`mb-4 h-1 w-16 rounded-full ${priorityStyles.barra}`}
                  />

                  {/* Linha superior do card: nome, empresa e status */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {lead.nome}
                      </h3>
                      <p className="text-sm text-slate-600">{lead.empresa}</p>
                    </div>

                    {/* Status do lead com destaque visual de prioridade */}
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

                  {/* Resumo curto do lead */}
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
    // Container principal ocupando toda a altura da tela
    // bg-slate-100 cria um fundo leve para não cansar visualmente
    <main className="min-h-screen bg-slate-100">
      {/*
        Container centralizado da aplicação
        max-w-7xl limita largura para melhor leitura
        flex permite dividir tela em duas áreas (fila + card)
      */}
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 p-6">
        {/*
          SEÇÃO PRINCIPAL (lado esquerdo)
          Aqui ficará a FILA DE EXECUÇÃO (coração do sistema)
        */}
        <section className="flex-1 rounded-2xl bg-white p-6 shadow-sm">
          {/* Cabeçalho da aplicação */}
          <header className="mb-6 border-b border-slate-200 pb-4">
            {/* Título principal */}
            <h1 className="text-2xl font-bold text-slate-900">
              CRM Operacional
            </h1>

            {/* Descrição curta do sistema */}
            <p className="mt-2 text-sm text-slate-600">
              Sistema de execução comercial
            </p>
          </header>

          {/* 
            Seletor de visão da tela
            Permite alternar entre o fluxo do closer e o fluxo do SDR
          */}
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

          {/*
            Bloco de resumo do dia
            Mostra rapidamente o volume de trabalho do usuário
            Isso ajuda o vendedor a entender prioridade sem pensar muito
          */}
          <div className="mb-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">
              {activeView === "closer"
                ? "Você tem 12 ações hoje"
                : "Você tem 9 leads para tratar"}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {activeView === "closer"
                ? "3 críticas • 5 negociações • 4 follow-ups"
                : "3 responderam • 2 para qualificar • 4 aguardando resposta"}
            </p>
          </div>

          {/*
            Área de filtros da fila
            Esses botões ajudam o usuário a focar no tipo de lead que deseja visualizar
          */}
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
              Follow-Up
            </button>
          </div>

          {/* 
            Área da fila de execução organizada por grupos
            Isso ajuda o usuário a entender o dia de trabalho com mais clareza
          */}

          <div className="space-y-8">
            {activeView === "closer" ? (
              <>
                {(activeFilter === "todos" || activeFilter === "critica") &&
                  renderLeadSection(
                    "Críticos",
                    "Leads que exigem ação imediata",
                    criticalLeads
                  )}

                {(activeFilter === "todos" || activeFilter === "negociacao") &&
                  renderLeadSection(
                    "Negociação",
                    "Leads em andamento comercial",
                    negotiationLeads
                  )}

                {(activeFilter === "todos" || activeFilter === "followup") &&
                  renderLeadSection(
                    "Follow-up",
                    "Leads que precisam de continuidade",
                    followUpLeads
                  )}
              </>
            ) : (
              <>
                {(activeFilter === "todos" || activeFilter === "critica") &&
                  renderLeadSection(
                    "Responder agora",
                    "Leads que responderam e exigem ação rápida",
                    repliedLeads
                  )}

                {(activeFilter === "todos" || activeFilter === "negociacao") &&
                  renderLeadSection(
                    "Qualificação",
                    "Leads que precisam avançar na conversa",
                    qualificationLeads
                  )}

                {(activeFilter === "todos" || activeFilter === "followup") &&
                  renderLeadSection(
                    "Aguardando resposta",
                    "Leads que precisam de continuidade do SDR",
                    waitingResponseLeads
                  )}
              </>
            )}
          </div>
        </section>

        {/*
          SEÇÃO LATERAL (lado direito)
          Aqui ficará o CARD DO LEAD

          hidden lg:block:
          - escondido em telas pequenas (mobile)
          - visível em telas maiores (desktop)
        */}
        <aside className="hidden w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm lg:block">
          {/* Cabeçalho do card lateral */}
          <div className="border-b border-slate-200 pb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Lead selecionado
            </p>

            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              {selectedLead.nome}
            </h2>

            <p className="mt-1 text-sm text-slate-600">{selectedLead.empresa}</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Responsável atual: {selectedLead.responsavel}
            </p>
            
          </div>

          {/* Bloco de status atual */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Status atual
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {selectedLead.status}
            </p>
          </div>

          {/* Bloco de resumo */}
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Resumo
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {selectedLead.resumo}
            </p>
          </div>

           {/* Bloco de continuidade SDR -> closer */}
          {activeView === "closer" && selectedLead.resumoSdr && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Resumo do SDR
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {selectedLead.resumoSdr}
              </p>
            </div>
          )}

          {/* 
            Bloco dinâmico do card
            Mostra informações diferentes para closer e SDR
          */}
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
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Tipo de negócio
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedLead.tipoNegocio}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Faturamento
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedLead.faturamento}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Objetivo
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedLead.objetivo}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Momento
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedLead.momento}
                </p>
              </div>
            </div>
          )}

          {/* 
            Área de ações rápidas do lead
            Esse bloco representa o centro de decisão operacional do card
          */}
          <div className="mt-4 rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Ações rápidas
            </p>

            {activeView === "closer" ? (
              <>
                <div className="mt-4 grid gap-3">
                  {/* Botão para marcar lead como fechado */}
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
                    Fechou
                  </button>

                  {/* Botão para manter lead em negociação */}
                  <button
                    onClick={() =>
                      updateSelectedLead({
                        status: "Em negociação",
                        prioridade: "negociacao",
                        proximaAcao: "Aguardar retorno da proposta",
                      })
                    }
                    className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
                  >
                    Em negociação
                  </button>

                  {/* Botão para marcar que não fechou */}
                  <button
                    onClick={() =>
                      updateSelectedLead({
                        status: "Não fechou",
                        prioridade: "followup",
                        proximaAcao: "Reagendar contato",
                      })
                    }
                    className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-700"
                  >
                    Não fechou
                  </button>
                </div>

                {/* Linha de registro rápido de ações */}
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

                {/* Linha de atalhos para follow-up */}
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
                    Agendar reunião
                  </button>

                  <button
                    onClick={() =>
                      updateSelectedLead({
                        status: "Em qualificação",
                        prioridade: "negociacao",
                        proximaAcao: "Continuar conversa com o lead",
                      })
                    }
                    className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
                  >
                    Continuar conversa
                  </button>

                  <button
                    onClick={() =>
                      updateSelectedLead({
                        status: "Desqualificado",
                        prioridade: "followup",
                        proximaAcao: "Sem próxima ação",
                      })
                    }
                    className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-700"
                  >
                    Desqualificar
                  </button>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Registrar ação
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <button
                      onClick={() => registerAction("Mensagem enviada pelo SDR")}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Mensagem
                    </button>

                    <button
                      onClick={() => registerAction("Ligação feita pelo SDR")}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Ligação
                    </button>

                    <button
                      onClick={() => registerAction("Qualificação atualizada")}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Qualificação
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Histórico simples do lead */}
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Histórico
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
        </aside>
      </div>
    </main>
  );
}