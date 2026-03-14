# Cover Spec — Renda Extra Honesta

## Conceito Visual

A capa deve comunicar **confianca, honestidade e acessibilidade**. O visual precisa se destacar num marketplace (Kiwify) lotado de capas gritantes com promessas exageradas. A abordagem e o oposto: clean, profissional, moderna — como um livro de financas pessoais de editora grande (Sextante, Intrínseca).

**Mood:** Clareza, transparencia, crescimento real. Nada de ostentacao.
**Referencia visual:** Capas de livros como "Me Poupe!" (Nathalia Arcuri), "Do Mil ao Milhao" (Thiago Nigro), "O Homem Mais Rico da Babilonia".

---

## Layout

- **Titulo:** parte superior (topo 40% da capa)
- **Subtitulo:** logo abaixo do titulo
- **Tagline:** faixa inferior com fundo accent (laranja dourado)
- **Elemento visual central:** ilustracao abstrata de celular com graficos de crescimento saindo da tela, moedas e icones dos 4 metodos (teclado, engrenagem, megafone, link)
- **Background:** gradiente vertical de azul escuro (#1A365D) no topo para verde (#1B7A4A) na base
- **Badge/selo:** canto superior direito com "4 Metodos Testados" em badge circular

### Posicoes

```
+----------------------------------+
|  [badge: 4 Metodos Testados]     |
|                                  |
|     RENDA EXTRA HONESTA          |  <- Titulo principal (branco, bold)
|     O Metodo de 1 Hora Por Dia   |  <- Subtitulo (branco, light)
|     Para Quem Trabalha CLT       |
|                                  |
|     [ilustracao: celular com     |  <- Elemento visual central
|      graficos de crescimento]    |
|                                  |
| ================================ |
| Renda extra real para gente real |  <- Tagline (fundo accent)
+----------------------------------+
```

---

## Cores

| Elemento | Cor | Hex |
|----------|-----|-----|
| Background topo | Azul escuro | #1A365D |
| Background base | Verde | #1B7A4A |
| Titulo | Branco | #FFFFFF |
| Subtitulo | Branco com opacidade 90% | #FFFFFFE6 |
| Tagline background | Laranja dourado | #E8930C |
| Tagline texto | Branco | #FFFFFF |
| Badge background | Laranja dourado | #E8930C |
| Badge texto | Branco | #FFFFFF |

---

## Tipografia

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|---------|------|
| Titulo principal | Poppins | 72pt | Bold (700) |
| Subtitulo | Poppins | 28pt | Light (300) |
| Tagline | Inter | 20pt | SemiBold (600) |
| Badge | Inter | 14pt | Bold (700) |

---

## Dimensoes

- **Largura:** 1600px
- **Altura:** 2560px
- **DPI:** 300
- **Aspect ratio:** 1:1.6 (padrao ebook Kiwify/Hotmart)

---

## Prompts para Geracao de Imagem de Capa via IA

### Variacao 1 — Celular com Crescimento (Recomendada)

```
Professional ebook cover, clean modern design. Dark blue to green gradient background (#1A365D to #1B7A4A). Center element: a minimalist white smartphone floating at slight angle, screen showing a simple ascending bar chart in green and gold. Small coins and dollar signs floating upward from the phone screen like particles. Subtle geometric patterns in the background. No text on the image. Studio lighting, high contrast, editorial quality. Style: flat design meets 3D illustration, similar to fintech app marketing. 1600x2560px, 300dpi.
```

### Variacao 2 — Caminho/Escada de Crescimento

```
Professional ebook cover illustration, clean modern design. Dark blue to green gradient background. Center element: a minimalist staircase made of coins ascending from bottom-left to top-right, with a small stylized figure at the top holding a phone. Each step has a subtle icon: keyboard, gear, megaphone, chain link. Warm golden light coming from the top. No text. Flat design with subtle 3D depth, editorial fintech style. High contrast, professional quality. 1600x2560px, 300dpi.
```

### Variacao 3 — Mao com Celular e Resultados

```
Professional ebook cover, clean editorial style. Dark blue gradient background (#1A365D). Center: a diverse woman's hand holding a smartphone, screen glowing with a simple green ascending graph. Around the phone: floating minimalist icons — clock (1 hour), phone (mobile), zero/coin (free). Warm golden accent light. Photorealistic hand, flat design icons. No text on image. High-end fintech marketing aesthetic. 1600x2560px, 300dpi.
```

---

## Notas de Producao

1. Gerar a ilustracao central via Midjourney ou DALL-E 3 usando o prompt da Variacao 1
2. Montar a capa final no Canva Pro ou Figma, sobrepondo titulo, subtitulo e tagline conforme layout
3. Exportar em PNG 300dpi (1600x2560px) para upload na Kiwify
4. Criar versao thumbnail (400x640px) para previews em marketplace
5. Criar mockup 3D do ebook usando smartmockups.com ou Canva para pagina de vendas
