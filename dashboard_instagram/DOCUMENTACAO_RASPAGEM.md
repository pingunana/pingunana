# 🛠️ Documentação Técnica de Raspagem CDP e Mapeamento de Parâmetros

Esta documentação descreve em detalhes a solução de conexão **CDP (Chrome DevTools Protocol)** via Playwright, o contorno a bloqueios de automação da Meta, e o mapeamento dos parâmetros extraídos para o formato **TMDL / Power BI**.

---

## 1. Desafio de Automação e Solução via Conexão CDP

### O Problema com Navegadores Automatizados Padrão:
Ao iniciar um navegador controlado via Playwright/Selenium padrão, a Meta (Instagram/Facebook) detecta as seguintes marcas de automação:
1. Presença da flag de linha de comando `--enable-automation`.
2. Variável de contexto `navigator.webdriver = true`.
3. Ausência de cookies e histórico de navegação confiáveis.

Isso causa o bloqueio do redirecionamento pós-login e exibe a mensagem de aviso *"Sinaliz. linha de comando não suportada"*.

---

### A Solução: Conexão CDP ao Chromium Ungoogled Real
Em vez de lançar uma nova instância isolada do navegador, o script `collector.js` conecta-se através da porta **9222** do seu navegador **Chromium Ungoogled** nativo já aberto pelo usuário.

```
┌─────────────────────────────────────────────────────────┐
│   Navegador Real: Chromium Ungoogled (Porta 9222)       │
│   (Sessão confiável do usuário, sem flags de automação) │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │ Conexão CDP (http://localhost:9222)
                            ▼
┌─────────────────────────────────────────────────────────┐
│   Coletor Playwright (collector.js --cdp)               │
│   (Extrai o DOM e gera os CSVs em data/<conta>/)       │
└─────────────────────────────────────────────────────────┘
```

### Implementação da Conexão no `collector.js`:
```javascript
if (useCDP) {
    console.log(`Conectando ao Chromium Ungoogled na porta ${cdpPort}...`);
    browser = await chromium.connectOverCDP(`http://localhost:${cdpPort}`);
    context = browser.contexts()[0] || await browser.newContext();
    const pages = context.pages();
    page = pages.length > 0 ? pages[0] : await context.newPage();
}
```

---

## 2. Comandos de Execução no Windows (PowerShell)

### Abertura do Navegador Real:
No PowerShell, utilize o operador de chamada `&` para passar os argumentos sem erro de sintaxe:
```powershell
& "C:\Users\Admin\AppData\Local\Chromium\Application\chrome.exe" --remote-debugging-port=9222
```

### Disparo da Coleta:
```powershell
node collector.js --account pingunana --cdp
```

---

## 3. Mapeamento de Parâmetros para o Power BI

Os arquivos salvos em `data/<account>/` correspondem diretamente aos parâmetros e Partiçoes M consumidos pelas tabelas TMDL do Power BI:

| Arquivo CSV | Colunas | Métrica Meta Insights | Partição M e Tabela no Power BI |
| :--- | :--- | :--- | :--- |
| `Reach.csv` | `Date,Reach` | Alcance Único Diário | Tabela TMDL `Alcance` |
| `Interactions.csv` | `Date,Interactions` | Interações Totais | Tabela TMDL `Interacoes` |
| `Follows.csv` | `Date,Follows` | Novos Seguidores Obtidos | Tabela TMDL `Seguidores` |
| `Visitas.csv` | `Date,Visits` | Visitas ao Perfil | Tabela TMDL `Visitas_Cliques` |
| `Link_clicks.csv` | `Date,Clicks` | Cliques no Link da Bio | Tabela TMDL `Visitas_Cliques` |
| `Views.csv` | `Date,Views` | Visualizações Totais de Reels | Métrica Complementar de Vídeo |
| `Audience.csv` | `City,Gender,AgeGroup,Percentage` | Demografia do Público | Tabela Demográfica de Público |

---

## 4. Código Power Query M Parametrizado (TMDL)

Cada tabela lê dinamicamente a pasta da conta definida no parâmetro `pAccountName`:

```powerquery
let
    Path = pDataBasePath & "\" & pAccountName & "\Reach.csv",
    Source = Csv.Document(File.Contents(Path), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.None]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{{"Date", type date}, {"Reach", Int64.Type}})
in
    #"Changed Type"
```
