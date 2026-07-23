# Diretrizes de Design & Identidade Visual — Mídia Kit PinguNana

> Documento de Decisões de Design · **Versão 2.0 · 22/07/2026**
> Define o conceito visual, paleta, tipografia, tratamento de imagem e requisitos técnicos da página web e do PDF do Mídia Kit.
> **Substitui a v1.0 ("Cyber-Zine Neon"), descontinuada.**

---

## 1. Conceito Central: "Lilás Onírico" (Dreamy Zine)

Universo visual **lilás, autoral e onírico**, que traduz a PinguNana como **multiartista** — música à frente, arte visual como extensão expressiva, com atitude punk/DIY equilibrada e acolhedora.

Três camadas:
1. **Sonho / Lúdico:** fundo lilás com ondas suaves em gradiente, espirais brancas e estrelas amarelas em outline (de minúsculas a enormes) espalhadas pela composição.
2. **Zine / DIY autoral:** crop de imagem "recortado à mão" com múltiplos contornos deslocados, dando aparência de adesivo/colagem.
3. **Expressivo / artístico:** tom mais artístico do que humorístico (humor presente, porém discreto), coeso e profissional para marcas.

---

## 2. Posicionamento Artístico (define o conteúdo)

| Eixo | Decisão |
|---|---|
| Identidade | **Multiartista** (música + arte visual) |
| Equilíbrio | **Mais música** — música lidera, arte é extensão |
| Estética punk/DIY | **Equilibrada** — punk + acolhedor |
| Customização de instrumentos | **Um diferencial** entre outros (não é mais o hero central) |
| Tom | **Artístico / expressivo** |
| Formas de arte a destacar | **Ilustração digital** e **customização de objetos/instrumentos** |
| Humor | **Sim, discreto** |
| Geografia | **Global + local equilibrado** |
| Rótulo preferido | **Multiartista** |
| Público a enfatizar | **Jovens 18–24 alternativos** |

---

## 3. Paleta de Cores & Efeitos

| Papel | Cor / Hex | Aplicação |
|---|---|---|
| **Fundo principal** | Lilás `#9B6BB1` | Base da página/slides |
| **Ondas em gradiente** | Lilás mais saturado/escuro `#8A5AA0` → `#74468C` → `#5E3576` | Ondulações horizontais suaves sobre o fundo |
| **Roxo profundo** | `#50164A` | Caixas de título escuras, painéis de destaque |
| **Amarelo estrela/contorno** | `#FDD259` | Estrelas em outline, contornos de imagem, bordas das caixas de título |
| **Branco espiral** | `#FFFFFF` | Espirais decorativas (tamanhos variados) e detalhes |
| **Off-white texto** | `#E9DEEE` | Texto sobre roxo profundo |

**Efeitos:** sem sombras pesadas; leveza e planos chapados com transparências suaves.

---

## 4. Tratamento de Imagem (padrão para TODAS as imagens)

Crop em **retângulo de cantos arredondados** com **múltiplos contornos deslocados** (efeito colagem/adesivo):
- Contorno principal em `#FDD259`.
- Mais **3 contornos** deslocados aleatoriamente, alternando **posição, espessura e saturação** (tons de amarelo e lilás).
- Este crop é o **padrão de todas as imagens** do material (foto da criadora, arte, instrumentos, gear).

---

## 5. Caixas & Tipografia

**Caixas de título de seção** — retângulos com **cantos arredondados ao máximo**, em duas variações alternadas:
- **Escura:** preenchimento `#50164A`, texto `#E9DEEE`, contorno `#FDD259`.
- **Clara:** inverte preenchimento/texto da escura (fundo `#E9DEEE`, texto `#50164A`), mantendo contorno `#FDD259`.

**Caixas de texto comum** *(decisão do assistente)* — painel translúcido em roxo profundo (`rgba(80,22,74,0.28)`), contorno amarelo sutil (`rgba(253,210,89,0.35)`), texto off-white `#F2E9F6`. Mantém a família lilás, garante legibilidade sobre o fundo e não compete com as caixas de título.

**Tipografia:**
- **Títulos:** display com personalidade (ex.: `Space Grotesk` ou `Outfit`).
- **Corpo & métricas:** alta legibilidade (ex.: `Inter`).

---

## 6. Layout da Capa

- **Foto** da criadora (com o crop-padrão de múltiplos contornos) ocupando **~1/3 no canto direito**.
- **Logo centralizada** + **mensagem inicial** centralizadas nos **2/3 restantes** (à esquerda).

---

## 7. Arquitetura Técnica

1. **i18n instantâneo:** botão `PT | EN` no topo, troca todo o texto sem recarregar.
2. **Exportação PDF (A4 Paisagem):** `@media print` formatando como slide-deck horizontal; botão "Baixar PDF" em 1 clique; cores preservadas (`print-color-adjust`).
3. **Componentes:** capa (foto + logo + tagline), dashboard de métricas, galeria de arte & instrumentos (crop-padrão), formatos de parceria, brand safety & governança (MEI da mãe, selo LGBTQIA+ friendly, restrições).

---

## 8. Histórico de Decisões

* **22/07/2026 (v2.0):** Nova identidade **"Lilás Onírico"** — fundo lilás `#9B6BB1` com ondas em gradiente, espirais brancas e estrelas amarelas `#FDD259`; crop-padrão de imagem com múltiplos contornos; caixas de título escura/clara com borda amarela; posicionamento como **Multiartista** (mais música, tom artístico, humor discreto, customização como diferencial). Substitui o conceito neon da v1.0.
