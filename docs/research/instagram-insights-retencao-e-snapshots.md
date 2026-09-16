# Instagram Insights: retenção e snapshots comerciais

_Pesquisa em 14 de setembro de 2026, limitada à documentação oficial da Meta._

## Decisão recomendada

Usar a **Instagram API como fonte dos snapshots solicitados**, salvando localmente a resposta bruta, um extrato normalizado e os metadados da consulta (data/hora em UTC, intervalo, versão da API e métricas). Não usá-la como repositório histórico remoto: a própria Meta limita a retenção dos dados de conta. Exports manuais oficiais, quando existirem, devem ser preservados como evidência complementar, mas não substituem a captura periódica ou sob demanda para períodos que a API já não retém.

Com a atualização somente quando solicitada, cada pedido deve criar um snapshot imutável e identificável. A interface deve avisar que dados recém-calculados podem atrasar até 48 horas; assim, uma solicitação não deve ser apresentada como número final do mesmo dia.

## O que a API permite e limita

| Escopo | Uso apropriado | Janela/retenção documentada |
| --- | --- | --- |
| Conta profissional (Business ou Creator) | Alcance, visualizações, interações e outras métricas agregadas por período; aceita `since` e `until` e, sem eles, consulta as últimas 24 h. | Os dados de métricas de usuário são armazenados por até **90 dias**. `online_followers` fica disponível apenas pelos últimos **30 dias**. [Insights](https://developers.facebook.com/documentation/instagram-platform/insights), [Account Insights](https://developers.facebook.com/documentation/instagram-platform/api-reference/instagram-user/insights) |
| Público/demografia da conta | Perfil demográfico de seguidores ou público engajado, usando `period=lifetime` e `timeframe` próprio. | É uma visão agregada de uma janela definida, não uma série histórica livre. Pode exigir 100 seguidores ou 100 engajamentos, conforme a métrica. [Account Insights](https://developers.facebook.com/documentation/instagram-platform/api-reference/instagram-user/insights) |
| Mídia individual (post/reel) | Métricas de cada conteúdo; a resposta é de `lifetime`, portanto não recebe intervalo customizado por mídia. | Dados armazenados por até **2 anos**. [Media Insights](https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media/insights) |
| Stories | Métricas de cada story. | Disponíveis por apenas **24 horas**; webhooks de `story_insights` são o mecanismo indicado para capturá-las antes de expirarem, mas apenas no fluxo Facebook Login. [Media Insights](https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media/insights), [Insights](https://developers.facebook.com/documentation/instagram-platform/insights) |

Portanto, a preocupação com o período é correta: a API não recupera arbitrariamente todo o histórico de **conta**. Ela é adequada para um mídia kit atual, desde que o pedido fique dentro das janelas disponíveis e o projeto guarde as próprias capturas. Para uma proposta que exija, por exemplo, seis meses de alcance diário, só haverá cobertura integral se os snapshots já tiverem sido coletados; exports anteriores podem preencher lacunas apenas na medida em que realmente contenham aquelas métricas.

## Conta versus conteúdo

São consultas diferentes:

- `GET /<instagram-account-id>/insights` retorna métricas da conta profissional do usuário da aplicação. É a fonte para o resumo de período do mídia kit. [Account Insights](https://developers.facebook.com/documentation/instagram-platform/api-reference/instagram-user/insights)
- `GET /<instagram-media-id>/insights` retorna métricas de uma mídia pertencente a essa conta profissional. É a fonte para desempenho de posts e reels. As métricas orgânicas de mídia não incluem interação de anúncios; no fluxo Facebook Login, `total_likes`, `total_comments` e `total_views` incluem promovidos/anúncios. [Media Insights](https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media/insights)

## Acesso necessário

A conta precisa ser profissional (Business ou Creator) e pertencer ao usuário autenticado pela aplicação. A Meta oferece dois fluxos oficiais:

- **Instagram Login**: token de usuário do Instagram e as permissões `instagram_business_basic` e `instagram_business_manage_insights`.
- **Facebook Login**: token de usuário do Facebook e as permissões `instagram_basic`, `instagram_manage_insights` e `pages_read_engagement`; em certos vínculos pelo Business Manager, também `ads_management` e `ads_read`.

Para contas que a aplicação não possui nem administra, a documentação exige Advanced Access; para contas próprias/adicionadas ao painel da aplicação, Standard Access. [Insights](https://developers.facebook.com/documentation/instagram-platform/insights)

## Operação sob demanda

1. No pedido, consultar os indicadores de conta necessários para a janela disponível e os conteúdos relevantes, usando uma versão de API fixada.
2. Registrar a resposta original sem credenciais, junto de data/hora UTC, intervalo solicitado, métricas, conta e versão da API.
3. Gerar o CSV/JSON normalizado que alimenta o dashboard e mostrar no mídia kit a data de corte e a janela dos números.
4. Tratar resposta vazia como “indisponível”, nunca como zero: a Meta informa que o endpoint devolve conjunto vazio quando o dado não existe ou não está disponível. [Insights](https://developers.facebook.com/documentation/instagram-platform/insights)

Essa estratégia combina números atuais e verificáveis com rastreabilidade comercial, sem depender de raspagem ou guardar credenciais no repositório.

## Sobre exports manuais

A documentação de API consultada descreve endpoints, retenções e requisitos, mas não documenta um export de Insights como equivalente completo aos endpoints nem garante a sua janela de dados. Assim, a base deve ser a API para solicitações novas; mantenha qualquer export obtido no painel oficial como anexo de evidência, com origem e data, e não presuma que ele reconstrua automaticamente os 90 dias ou dois anos já expirados da API.
