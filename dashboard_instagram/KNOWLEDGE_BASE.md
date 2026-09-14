# 🧠 Base de Conhecimento & RAG do Projeto (Lições Aprendidas e Arquitetura)

Este documento centraliza todas as decisões arquiteturais, soluções de erros de compilação TMDL, dicas de sintaxe no PowerShell, comportamento do motor Power BI e manipulação em tempo real via MCP.

---

## 1. Decisões Arquiteturais e Escolha de Métodos

### Por que a Abordagem 2 (Dashboard Modelo Parametrizado)?
* **Isolamento de Dados**: Permite que relatórios de contas diferentes permaneçam totalmente separados.
* **Agilidade na Troca**: Altera-se apenas o parâmetro `pAccountName` (ex: de `"pingunana"` para `"outra_conta"`) nas configurações do Power Query, recarregando todas as tabelas e visuais instantaneamente.
* **Escalabilidade**: Reutiliza 100% das medidas DAX e visualizações sem precisar refazer relatórios.

### Comparativo: Meta Graph API vs. Playwright CDP
* **Meta Graph API**: Método oficial direto via `Web.Contents` no Power Query. Requer vinculação da conta do Instagram a uma Página do Facebook, criação de Meta App e gerenciamento de Tokens de Longa Duração (60 dias).
* **Playwright via CDP**: Método desacoplado e 100% gratuito que se conecta ao navegador Chromium Ungoogled já logado na porta 9222. Não exige aprovação de apps na Meta nem renovação de tokens de API.

---

## 2. Regras Críticas e Solução de Erros no TMDL (Power BI)

Durante o desenvolvimento base-código do modelo semântico em **TMDL (Tabular Model Definition Language)**, identificamos regras rígidas do parser do Power BI que devem ser seguidas:

### ⚠️ Erro 1: Propriedade `description:` em Medidas DAX
* **Sintoma**: `TMDL Format Error: Parsing error type - UnknownKeyword / Detailed error - Unsupported property - description is not a supported property`.
* **Causa**: O parser TMDL não aceita a propriedade `description:` diretamente indentada no bloco de definição da medida DAX.
* **Solução**: Remover a propriedade `description:` das medidas dentro dos arquivos `.tmdl` ou utilizá-la apenas com anotações/comentários doc-strings `///`.

### ⚠️ Erro 2: Referência a `queryGroup:` Inexistente
* **Sintoma**: `Cannot resolve all the paths while de-serializing Database / Property QueryGroup of object refers to an object which cannot be found`.
* **Causa**: Adicionar `queryGroup: Parametros` em `expressions.tmdl` sem ter declarado a tabela/grupo de consulta no arquivo principal.
* **Solução**: Omitir a linha `queryGroup:` nas expressões M simples para garantir compilação sem pendências.

---

## 3. Manipulação do Power BI em Tempo Real via MCP (`powerbi-modeling`)

O MCP de Power BI permite inspecionar e alterar o modelo semântico em **tempo real** enquanto o Power BI Desktop está aberto:

### Como Funciona:
1. Ao abrir o arquivo `.pbip`, o Power BI Desktop inicia um motor Analysis Services (SSAS) local numa porta dinâmica (ex: `localhost:51114`).
2. O MCP executa a operação `ListLocalInstances` para descobrir o processo e a porta.
3. Conecta-se via `Connect` e permite executar operações `measure_operations` (criar/editar medidas instantaneamente na memória) e `dax_query_operations`.

---

## 4. Solução de Problemas no PowerShell & Bypass de Automação

### ⚠️ Erro de Sintaxe no PowerShell (`--` inesperado)
* **Sintoma**: `O operador '--' funciona apenas em variáveis ou propriedades`.
* **Causa**: No PowerShell, passar argumentos iniciando com `--` após um caminho entre aspas exige o operador de chamada `&`.
* **Solução**: Usar a sintaxe:
  ```powershell
  & "C:\Users\Admin\AppData\Local\Chromium\Application\chrome.exe" --remote-debugging-port=9222
  ```

### ⚠️ Bloqueio de Bot do Instagram (`--enable-automation`)
* **Sintoma**: O navegador abre com a mensagem *"Sinaliz. linha de comando não suportada"* e o login entra em loop.
* **Causa**: O Instagram bloqueia a autenticação em instâncias isoladas com flags de automação ativas.
* **Solução**: Executar o coletor com o parâmetro `--cdp` (`node collector.js --account pingunana --cdp`). O Playwright conecta-se à sessão já autenticada e confiável do seu Chromium Ungoogled.
