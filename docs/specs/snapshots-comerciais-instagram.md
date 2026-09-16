# Snapshots comerciais do Instagram pela API da Meta

## Problem Statement

Os números usados no mídia kit e nas propostas comerciais da PinguNana não possuem hoje uma origem automatizada e verificável. O coletor existente abre a área de Insights, mas grava dados de demonstração, enquanto a Meta retém métricas de conta por períodos limitados. Isso impede atualizar números sob demanda com segurança e formar um histórico rastreável.

## Solution

Substituir o coletor de demonstração por uma integração sob demanda com a Instagram API oficial. Um único serviço cria um snapshot comercial para uma conta e janela de datas, persiste localmente a resposta bruta sem credenciais, gera dados normalizados para o dashboard e informa indisponibilidades sem sobrescrever snapshots anteriores.

O fluxo utilizará Instagram Login com permissões mínimas de Insights, configurado por um responsável adulto. A atualização ocorrerá somente quando solicitada. Exports históricos oficiais continuarão separados, com origem e período explícitos.

## User Stories

1. Como responsável comercial, quero solicitar uma atualização de métricas do Instagram, para usar números recentes em uma proposta.
2. Como responsável comercial, quero que uma solicitação padrão cubra os últimos 30 dias, para atualizar o mídia kit de forma consistente.
3. Como responsável comercial, quero poder solicitar outra janela de datas quando ela estiver dentro da retenção da Meta, para atender uma necessidade comercial específica.
4. Como responsável comercial, quero ver a data e a hora de corte de cada snapshot, para não apresentar dados como se fossem em tempo real.
5. Como responsável comercial, quero receber alcance, visualizações, interações, novos seguidores, visitas ao perfil e cliques no link quando estiverem disponíveis, para avaliar desempenho da conta.
6. Como responsável comercial, quero ver audiência e conteúdos de melhor desempenho quando as condições da Meta permitirem, para adaptar a narrativa do mídia kit.
7. Como responsável comercial, quero que uma métrica indisponível seja identificada como indisponível, para não confundi-la com zero.
8. Como responsável comercial, quero manter o último snapshot válido quando uma nova consulta falhar, para preservar a evidência já obtida.
9. Como responsável comercial, quero que cada snapshot tenha uma resposta de origem preservada localmente, para poder auditar os dados normalizados.
10. Como responsável comercial, quero que o dashboard leia dados normalizados sem conhecer credenciais da Meta, para separar visualização de acesso à plataforma.
11. Como responsável comercial, quero que o mídia kit use apenas snapshots identificáveis e datados, para sustentar afirmações comerciais verificáveis.
12. Como responsável comercial, quero manter exports oficiais anteriores separados dos snapshots da API, para não mesclar janelas ou origens incompatíveis.
13. Como responsável adulto, quero conceder e renovar acesso à aplicação sem registrar tokens no repositório, para manter o controle das credenciais.
14. Como responsável adulto, quero que a integração use somente permissões necessárias para Insights do Instagram, para limitar o alcance do acesso concedido.
15. Como mantenedor, quero executar o fluxo sem navegador automatizado, para reduzir fragilidade e evitar dependência de raspagem.
16. Como mantenedor, quero uma interface de serviço única para criar snapshots, para testar o comportamento de ponta a ponta sem a Meta nem o Power BI.
17. Como mantenedor, quero dados de exemplo distintos de snapshots reais, para impedir que dados simulados sejam usados em material comercial.
18. Como mantenedor, quero registrar a versão da API, a conta, as métricas e a janela consultadas, para explicar diferenças entre snapshots no futuro.
19. Como mantenedor, quero que respostas vazias sejam tratadas de forma explícita, para não substituir dados válidos por resultados ambíguos.
20. Como revisora de dados, quero poder rastrear cada valor normalizado à consulta que o originou, para verificar a integridade do dashboard.

## Implementation Decisions

- A Instagram API oficial é a origem dos novos snapshots; a integração não usa raspagem, CDP nem dados aleatórios.
- Um serviço de criação de snapshot é o único ponto de integração. Ele recebe uma conta e intervalo, busca dados, valida a resposta, persiste a evidência e produz o formato normalizado.
- Um comando sob demanda aciona o serviço. Não haverá agendamento automático nesta entrega.
- A autenticação usa Instagram Login e as permissões mínimas para leitura de Insights. O responsável adulto administra a aplicação e autoriza o acesso.
- Credenciais ficam em configuração local ignorada pelo Git. Respostas brutas jamais incluem credenciais e também ficam fora do Git.
- O snapshot comercial padrão abrange os 30 dias anteriores à data da consulta, com suporte a outra janela quando a API permitir.
- O conjunto normalizado inclui métricas de conta disponíveis, audiência disponível e desempenho de conteúdos relevantes, além de metadados de corte, origem, janela e versão da API.
- Um resultado vazio, atraso de dados ou falha de API gera indisponibilidade explícita. O processo não converte ausência em zero nem substitui o último snapshot válido.
- Exports históricos manuais permanecem como evidências separadas. Nenhuma combinação automática com snapshots da API é feita.
- O dashboard continua consumindo dados locais normalizados e não executa chamadas à Meta diretamente.

## Testing Decisions

- O serviço de criação de snapshot será testado como a principal interface pública, com respostas de API simuladas e sistema de arquivos temporário.
- Os testes verificarão comportamento observável: construção da janela padrão, normalização das métricas, metadados do snapshot, persistência da evidência, preservação de dados válidos e retorno de indisponibilidade.
- Os testes não dependem de uma conta Meta, token, navegador ou Power BI.
- Respostas válidas, parciais, vazias, atrasadas e com erro de autorização ou rede devem ser cobertas.
- Os testes confirmarão que dados de demonstração não são apresentados como snapshots reais e que nenhuma credencial é persistida.

## Out of Scope

- Atualização automática diária, semanal ou por webhook.
- Twitch, TikTok, YouTube ou outras plataformas.
- Importação automática e combinação de exports históricos.
- Publicação ou alteração automática do mídia kit.
- Painel web para solicitar snapshots.
- Renovação automática de tokens ou gestão de múltiplas contas.
- Métricas de Stories que já tenham expirado na plataforma.

## Further Notes

- Métricas de conta possuem retenção limitada pela Meta; cada solicitação cria o próprio histórico a partir da data de implantação.
- Métricas podem levar até 48 horas para estabilizar; o snapshot deve exibir sua data de corte.
- Métricas de mídia individual possuem retenção diferente das métricas agregadas de conta.
- A pesquisa oficial que fundamenta as retenções e requisitos está em `docs/research/instagram-insights-retencao-e-snapshots.md`.
