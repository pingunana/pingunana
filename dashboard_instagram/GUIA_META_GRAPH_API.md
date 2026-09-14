# 🔗 Guia de Conexão Direta: Power BI + Meta Graph API (Método 1)

Este guia orienta o passo a passo para obter o **ID da Conta do Instagram** e o **Token de Acesso Permanente de Página** da Meta, permitindo que o Power BI se conecte **100% direto na nuvem** sem abrir navegador e sem gerar CSVs intermediários.

---

## ⚡ Pré-requisitos
1. Uma conta de **Instagram Profissional / Criador de Conteúdo** (Gratuito).
2. Uma **Página do Facebook** vinculada à sua conta de Instagram (Gratuito).

---

## 🚀 Passo a Passo (Obtenção das Credenciais Meta)

### Passo 1: Criar uma Aplicação Gratuita no Meta for Developers
1. Acesse o portal [developers.facebook.com](https://developers.facebook.com/) e faça o login com sua conta do Facebook.
2. Clique em **Meus Apps** -> **Criar App**.
3. Escolha o tipo de aplicativo **Outro** ou **Empresarial / Negócios**.
4. Defina um nome para seu app (ex: `Power BI Instagram Integration`) e conclua a criação.

---

### Passo 2: Gerar o Token de Acesso no Graph API Explorer
1. No menu superior do Meta Developers, acesse **Ferramentas** -> **Graph API Explorer** (ou acesse diretamente `developers.facebook.com/tools/explorer`).
2. No painel à direita, em **Meta App**, selecione a aplicação criada no Passo 1.
3. Em **Permissões** (Permissions), adicione as seguintes permissões:
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_read_engagement`
   - `pages_show_list`
4. Clique em **Generate Access Token** (Gerar Token de Acesso) e autorize com sua conta.

---

### Passo 3: Descobrir o ID da Conta do Instagram (`pInstagramID`)
No **Graph API Explorer**, execute a seguinte consulta HTTP GET:
```http
GET v20.0/me/accounts?fields=name,instagram_business_account
```
* O retorno JSON exibirá o `instagram_business_account.id` (ex: `17841400000000000`). Este é o valor do parâmetro **`pInstagramID`**!

---

### Passo 4: Gerar o Token Permanente de Página (`pAccessToken`)
1. No Graph API Explorer, execute a chamada para obter o token estendido da página:
   ```http
   GET v20.0/me/accounts?fields=access_token
   ```
2. Copie a string do `access_token` retornado para a sua página. Este é um **Token de Acesso Permanente de Página**!
3. Copie este valor para o parâmetro **`pAccessToken`** no Power BI.

---

## 🎛️ Configuração no Power BI Desktop

1. Abra o arquivo do projeto [`instagram_pingunana.pbip`](file:///c:/Users/Admin/Documents/Pingunana/dashboard_instagram/instagram_pingunana.pbip) no Power BI Desktop.
2. Clique em **Página Inicial** -> **Transformar Dados** -> **Editar Parâmetros**.
3. Preencha:
   - **`pInstagramID`**: Cole o ID da conta obtido no Passo 3.
   - **`pAccessToken`**: Cole a string do Token obtido no Passo 4.
4. Clique em **Aplicar Alterações** e depois em **Atualizar** (Refresh).

---

## 🎉 Pronto!
Agora o seu Power BI busca as métricas diretamente dos servidores da Meta via HTTPS **sem abrir nenhum navegador e sem rodar scripts manuais**!
