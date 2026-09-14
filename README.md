# PinguNana

Materiais comerciais e operacionais da PinguNana: mídia kit, ativos visuais, análises de métricas e dashboard de Instagram em Power BI.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `06_MediaKit_Beta.html` | Mídia kit atualmente servido pelo projeto. |
| `index.html` | Versão publicada anterior do mídia kit. |
| `imagens/`, `*.jpeg`, `*.svg` | Ativos visuais usados nos materiais. |
| `metricas/` | Exports e evidências históricas usados nas análises. |
| `dashboard_instagram/` | Projeto Power BI, dados de entrada e utilitários de atualização. |
| `01_*.md` a `08_*.md` | Estratégia, decisões, pesquisa e análises de apoio. |
| `docs/agents/` | Convenções para agentes que trabalham neste repositório. |

## Abrir o mídia kit localmente

No Windows, execute `Servir_MidiaKit.bat`. Ele usa Node.js quando disponível e, caso contrário, Python. O endereço padrão é `http://localhost:8080/` e abre `06_MediaKit_Beta.html`.

Também é possível executar:

```powershell
node server.js
```

## Dashboard de métricas

O projeto está em `dashboard_instagram/`. Para instalar as dependências do utilitário local:

```powershell
cd dashboard_instagram
npm ci
```

Abra `instagram_pingunana.pbip` no Power BI Desktop. O modelo lê os CSVs de `dashboard_instagram/data/pingunana/`; confirme o parâmetro `pDataBasePath` quando abrir o projeto em outra máquina.

### Estado do coletor

O `collector.js` ainda é um protótipo: ele abre a área de Insights da Meta, porém escreve CSVs de demonstração gerados localmente. Não use a saída dele como métrica real para mídia kit, proposta comercial ou relatório. As evidências históricas verificadas ficam em `metricas/` até que a extração real seja implementada e validada.

## Versionamento

Código, materiais, documentação, definições do Power BI e snapshots históricos devem ser revisados e versionados. Dependências instaladas, sessões de navegador e caches locais do Power BI são ignorados automaticamente.

Nunca registre tokens, cookies, sessões autenticadas ou outros dados de acesso. Para novas credenciais, use arquivos locais ignorados pelo Git ou parâmetros do Power BI configurados na máquina.
