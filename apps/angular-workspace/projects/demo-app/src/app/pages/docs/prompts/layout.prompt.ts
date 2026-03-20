export const LAYOUT_PROMPT = `\
CONTEXT: @andersseen/layout

## Library profile
Pure CSS library — no JavaScript runtime.
Attribute-driven layout composition and typography.
Framework-agnostic. Mobile-first responsive system.
Use HTML attributes as the single source of truth for layout.

## Install
\`\`\`
npm i @andersseen/layout
\`\`\`

## Setup
\`\`\`ts
import '@andersseen/layout/dist/layout.css';
\`\`\`

## Breakpoints (mobile-first, min-width)
| Name | Min-width |
|---|---|
| sm  | 640px  |
| md  | 768px  |
| lg  | 1024px |
| xl  | 1280px |
| 2xl | 1536px |

## Responsive syntax
Every modifier supports responsive variants using \`@breakpoint\`:
\`\`\`html
<div and-layout="vertical vertical@sm horizontal@md gap:sm gap@lg:xl">
<p   and-text="p-sm align:center align@md:left">
\`\`\`

Verified token source:
- Spacing scale: none, xxxs, xxs, xs, sm, md, lg, xl, xxl, xxxl, auto
- Text colors map to CSS variables: --color-primary, --color-secondary,
  --color-accent, --color-muted, --color-destructive, --color-background,
  --color-foreground

---

## \`and-layout\` — layout attribute

### Display / direction
\`\`\`html
<div and-layout="horizontal">   <!-- display:flex; flex-direction:row -->
<div and-layout="vertical">     <!-- display:flex; flex-direction:column -->
<div and-layout="grid">         <!-- display:grid -->
\`\`\`
Both \`horizontal\` and \`vertical\` are responsive: \`horizontal@md\`, \`vertical@lg\`.

### Flex — alignment
\`\`\`
align:start | align:end | align:center | align:baseline | align:stretch
justify:start | justify:end | justify:center | justify:between | justify:around | justify:evenly
wrap:nowrap | wrap:wrap | wrap:wrap-reverse
\`\`\`

### Gap
\`\`\`
gap:{spacing}    gap-x:{spacing}    gap-y:{spacing}
\`\`\`
Spacing scale: none · xxxs · xxs · xs · sm · md · lg · xl · xxl · xxxl · auto

### Grid — columns
Generates \`repeat(N, minmax(0, 1fr))\` for N in 1–12.
\`\`\`html
<div and-layout="grid cols:1 cols@sm:2 cols@lg:3 gap:lg">
\`\`\`

### Grid — column span
Values 1–12 + \`full\` (span all columns).
\`\`\`html
<div and-layout="grid cols:12">
  <header and-layout="span:full">...</header>
  <main   and-layout="span:8 span@lg:9">...</main>
  <aside  and-layout="span:4 span@lg:3">...</aside>
</div>
\`\`\`

### Grid — column start/end
\`col-start:1\`–\`col-start:13\`, \`col-start:auto\`
\`col-end:1\`–\`col-end:13\`, \`col-end:auto\`

### Padding
\`\`\`
p:{s}   p-t:{s}   p-b:{s}   p-l:{s}   p-r:{s}   p-x:{s}   p-y:{s}
\`\`\`

### Margin
\`\`\`
m:{s}   m-t:{s}   m-b:{s}   m-l:{s}   m-r:{s}   m-x:{s}   m-y:{s}
\`\`\`

### Spacing scale
| Token | Value    |
|-------|----------|
| none  | 0        |
| xxxs  | 0.125rem |
| xxs   | 0.25rem  |
| xs    | 0.5rem   |
| sm    | 0.75rem  |
| md    | 1rem     |
| lg    | 1.5rem   |
| xl    | 2rem     |
| xxl   | 3rem     |
| xxxl  | 4rem     |
| auto  | auto     |

---

## \`and-text\` — typography attribute

### Semantic scale
\`\`\`
h1 · h2 · h3 · h4 · h5 · h6 · p · p-sm · p-xs · caption
\`\`\`
| Token  | Font size  | Weight | Line-height |
|--------|-----------|--------|-------------|
| h1     | 3.75rem   | 700    | 1.1         |
| h2     | 3rem      | 700    | 1.1         |
| h3     | 2.25rem   | 600    | 1.2         |
| h4     | 1.875rem  | 600    | 1.2         |
| h5     | 1.5rem    | 500    | 1.3         |
| h6     | 1.25rem   | 500    | 1.3         |
| p      | 1rem      | 400    | 1.5         |
| p-sm   | 0.875rem  | 400    | 1.5         |
| p-xs   | 0.75rem   | 400    | 1.5         |
| caption| 0.75rem   | 400    | — (muted)   |

### Text alignment (responsive)
\`\`\`
align:left | align:center | align:right | align:justify
\`\`\`

### Font weight (responsive)
\`\`\`
weight:thin | weight:light | weight:normal | weight:medium
weight:semibold | weight:bold | weight:extrabold | weight:black
\`\`\`

### Text color (responsive)
\`\`\`
color:primary | color:secondary | color:accent | color:muted
color:destructive | color:foreground | color:background
\`\`\`
Maps to CSS variables: \`var(--color-primary)\`, \`var(--color-foreground)\`, etc.

---

## Complete usage examples

### Responsive page shell
\`\`\`html
<body and-layout="vertical gap:none">
  <nav and-layout="horizontal justify:between align:center p-x:lg p-y:md">
    <a and-text="h6 weight:bold">Logo</a>
    <div and-layout="horizontal gap:sm">
      <a and-text="p-sm">Home</a>
      <a and-text="p-sm">Docs</a>
    </div>
  </nav>

  <main and-layout="vertical gap:xl p:lg p@md:xxl">
    <section and-layout="vertical gap:md">
      <h1 and-text="h1 align:center align@md:left color:foreground">Hero Title</h1>
      <p  and-text="p align:center align@md:left color:muted">Subtitle text</p>
    </section>

    <!-- Card grid -->
    <div and-layout="grid cols:1 cols@sm:2 cols@lg:3 gap:lg">
      <article and-layout="vertical gap:sm p:md">
        <h2 and-text="h5 color:foreground">Card Title</h2>
        <p  and-text="p-sm color:muted">Card description</p>
      </article>
    </div>
  </main>
</body>
\`\`\`

### Sidebar + main layout
\`\`\`html
<div and-layout="horizontal gap:none" style="min-height: 100vh">
  <aside and-layout="vertical gap:md p:md" style="width: 240px">
    <nav and-layout="vertical gap:xs">...</nav>
  </aside>
  <main and-layout="vertical gap:lg p:xl" style="flex: 1">
    <h1 and-text="h2 weight:semibold">Page Title</h1>
  </main>
</div>
\`\`\`

### 12-column grid
\`\`\`html
<section and-layout="grid cols:12 gap:md">
  <div and-layout="span:12 span@md:8">Main content</div>
  <div and-layout="span:12 span@md:4">Sidebar</div>
</section>
\`\`\`

## Rules for LLM output
- Use \`and-layout\` and \`and-text\` attributes as the primary composition mechanism.
- Do not mix a utility CSS framework (Tailwind, Bootstrap) with \`and-layout\` tokens on the same element.
- Responsive tokens use \`@breakpoint\` suffix: \`cols@md:2\`, \`align@lg:left\`.
- Color tokens map to CSS custom properties — do not override with hardcoded values.
- \`caption\` automatically applies a muted color — do not combine with \`color:foreground\`.
`;
