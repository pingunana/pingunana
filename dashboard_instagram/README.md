# 📊 Dashboard de Métricas do Instagram

Este diretório contém o projeto Power BI, os CSVs de entrada e um protótipo de coleta com Playwright. O modelo atualmente lê CSVs locais em `data/<conta>/`; a integração direta pela Meta Graph API permanece documentada como uma alternativa a implementar e validar.

> **Estado atual:** `collector.js` ainda gera dados de demonstração por `generateExtractedMetrics()`. Não trate sua saída como métrica real e não a use em materiais comerciais. Use os exports verificados em `../metricas/` até que a extração real seja concluída.

---

## 📁 Estrutura de Arquivos da Pasta `dashboard_instagram`

```
dashboard_instagram/
├── README.md                       # Documentação Principal e Guia de Conexão Direta
├── GUIA_META_GRAPH_API.md          # Passo a Passo de Obtenção das Credenciais da Meta (Tokens & ID)
├── DOCUMENTACAO_RASPAGEM.md        # Documentação Técnica do Coletor Alternativo em Playwright/CDP
├── KNOWLEDGE_BASE.md               # Base de Conhecimento RAG, Lições Aprendidas e Solução de Erros TMDL
├── instagram_pingunana.pbip        # Arquivo do Power BI Project
├── instagram_pingunana.Report/     # Definição visual das páginas e cartões de KPI
└── instagram_pingunana.SemanticModel/ # Modelo Semântico TMDL para o Power BI
    └── definition/
        ├── model.tmdl              # Configuração do Modelo Semântico (pt-BR)
        ├── database.tmdl           # Configuração do Motor VertiPaq
        ├── relationships.tmdl      # Relacionamentos (Calendario -> Fatos)
        ├── expressions.tmdl        # Parâmetros M (pInstagramID, pAccessToken, pAccountName)
        └── tables/                 # Definições TMDL por Tabela e Medidas DAX (Web.Contents Meta API)
            ├── Alcance.tmdl
            ├── Interacoes.tmdl
            ├── Seguidores.tmdl
            ├── Visitas_Cliques.tmdl
            └── Calendario.tmdl
```

---

## ⚡ Integração direta pela Meta Graph API (planejada)

1. A implementação planejada conecta o Power BI aos servidores da Meta via chamadas HTTPS `Web.Contents` usando os parâmetros **`pAccessToken`** e **`pInstagramID`**.
2. Quando implementada e validada, ela poderá atualizar métricas sem navegador ou CSV intermediário.

---

## 🚀 Como Configurar em 4 Passos Rápidos

Siga o guia detalhado [`GUIA_META_GRAPH_API.md`](file:///c:/Users/Admin/Documents/Pingunana/dashboard_instagram/GUIA_META_GRAPH_API.md):

1. Acesse o portal [developers.facebook.com](https://developers.facebook.com/) e crie um aplicativo gratuito.
2. Gere o `pInstagramID` e o `pAccessToken` (Token Permanente de Página) no Graph API Explorer.
3. No Power BI Desktop ([`instagram_pingunana.pbip`](file:///c:/Users/Admin/Documents/Pingunana/dashboard_instagram/instagram_pingunana.pbip)), vá em **Transformar Dados** -> **Editar Parâmetros**.
4. Cole o seu `pInstagramID` e `pAccessToken` e clique em **Atualizar**!

---

## 📖 Dicionário de Medidas DAX

| Tabela | Nome da Medida | Fórmula DAX | Descrição |
| :--- | :--- | :--- | :--- |
| **Alcance** | `Total Alcance` | `SUM(Alcance[Alcance])` | Soma total do alcance de pessoas únicas no período. |
| **Alcance** | `Engajamento %` | `DIVIDE([Total Interacoes], [Total Alcance], 0)` | Taxa média de engajamento relativa ao alcance total. |
| **Alcance** | `Media Alcance Diario` | `AVERAGE(Alcance[Alcance])` | Média diária de alcance. |
| **Interações** | `Total Interacoes` | `SUM(Interacoes[Interacoes])` | Total de interações (curtidas, comentários, salvamentos). |
| **Seguidores** | `Novos Seguidores` | `SUM(Seguidores[Seguidores])` | Novos seguidores no período. |
| **Visitas_Cliques** | `Total Visitas ao Perfil` | `SUM(Visitas_Cliques[Visitas])` | Total de visitas à página do perfil. |
| **Visitas_Cliques** | `Total Cliques no Link` | `SUM(Visitas_Cliques[Clicks])` | Cliques registrados no link da bio. |
| **Visitas_Cliques** | `Taxa Conversao Bio %` | `DIVIDE([Total Cliques no Link], [Total Visitas ao Perfil], 0)` | % de visitantes que clicaram no link da bio. |
