import type { Lead } from "@/types/lead";

// Dados temporários para validar a experiência do produto sem banco de dados
export const mockLeads: Lead[] = [
  {
    id: 1,
    nome: "João Silva",
    empresa: "Clínica Vida",
    status: "Reunião hoje",
    resumo: "Quer aumentar o volume de leads e está sensível a preço.",
    prioridade: "critica",
    proximaAcao: "Realizar reunião às 10:00",
    valorProposta: "R$ 2.500",
    responsavel: "closer",
    resumoSdr:
      "Clínica estética, fatura cerca de R$ 80k/mês, quer aumentar leads e demonstrou urgência para começar agora.",
    qualificacao: {
      tipoNegocio: "Clínica estética",
      faturamento: "R$ 80k/mês",
      objetivo: "Aumentar geração de leads",
      momento: "Agora",
    },
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
    responsavel: "closer",
    resumoSdr:
      "Agência de marketing com faturamento em torno de R$ 50k/mês, busca previsibilidade comercial e demonstrou interesse em avançar em breve.",
    qualificacao: {
      tipoNegocio: "Agência de marketing",
      faturamento: "R$ 50k/mês",
      objetivo: "Melhorar previsibilidade comercial",
      momento: "Em breve",
    },
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
    responsavel: "closer",
    resumoSdr:
      "Estúdio de arquitetura, faturamento aproximado de R$ 35k/mês, quer gerar mais oportunidades qualificadas e já avançou para negociação.",
    qualificacao: {
      tipoNegocio: "Estúdio de arquitetura",
      faturamento: "R$ 35k/mês",
      objetivo: "Gerar mais oportunidades qualificadas",
      momento: "Agora",
    },
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
    responsavel: "sdr",
    resumoSdr:
      "Clínica odontológica com faturamento em torno de R$ 60k/mês, interesse inicial em atrair mais pacientes particulares, ainda em fase de pesquisa.",
    qualificacao: {
      tipoNegocio: "Clínica odontológica",
      faturamento: "R$ 60k/mês",
      objetivo: "Atrair mais pacientes particulares",
      momento: "Só pesquisando",
    },
    historico: [
      "Lead entrou pelo Instagram",
      "SDR fez contato inicial",
      "Lead pediu mais informações",
    ],
  },
];