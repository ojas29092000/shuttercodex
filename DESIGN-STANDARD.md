# ShutterCodex Design Standard

This is the canonical reference for anyone (human or AI model) producing pages, articles, diagrams, or animations for ShutterCodex. Follow it exactly — it exists so that a new article written months from now by a different model is indistinguishable in quality and style from the existing ones.

**How to use this doc:** Read the relevant section *before* starting work, not after. For a new article, read §5 (Article Structure), §6 (Diagram Style Guide), and §9 (Pre-publish Checklist). For UI work, read §2–§4 and §7. For choosing a tool, read §8.

---

## 1. Brand Identity & Hard Constraints

**What the site is:** Engineering analysis of cameras, sensors, and computational photography, written from the perspective of someone who builds camera systems. The authority comes from technical depth, not personality.

**Voice:** Confident, concrete, first-person used sparingly. Explains *why*, not just *what*. Contrarian where the spec-sheet consensus is wrong. Never breathless, never "in this article we will…".

**Hard constraints (never violate):**

- No real name anywhere on the site.
- No employer or company name. The only credential framing allowed: *"software engineer specializing in embedded camera systems and AI vision platforms"* (or close paraphrase, e.g. "I work on embedded camera systems for a living").
- **No personal email address anywhere** (a Gmail address containing a name breaks anonymity). The only public contact is `contact@shuttercodex.com` on the Contact page; every other page links to `/contact` instead of inlining an address.
- Never deploy/push to GitHub unless the user explicitly says to deploy. All review happens on `localhost:4321` first.

---

## 2. Design Tokens

Defined in `src/styles/global.css`. Never introduce a new color without adding it here first.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F2F4F8` | Page background (cool paper gray) |
| `--surface` | `#FFFFFF` | Cards, header |
| `--ink` | `#0E1117` | Headings, body text, dark diagram canvas |
| `--ink-muted` | `#4B5775` | Secondary text, captions |
| `--accent` | `#2151CC` | "AF cobalt" — links, CTAs, software/data concepts |
| `--accent-warm` | `#C4871A` | "Optical amber" — eyebrows, category tags, hardware/control concepts |
| `--border` | `#DDE1ED` | Hairlines, card borders |

**Semantic rule:** cobalt = software / data / interaction. Amber = hardware / control / metadata (eyebrows, tags, annotations). This split is used consistently in the UI *and* inside diagrams — do not swap them.

**Fonts** (loaded in `BaseHead.astro`):

- `--font-display`: **Fraunces** (Georgia fallback) — headings, diagram stage names. Always weight 700 for headings.
- `--font-body`: **Inter** — body text, UI labels.
- `--font-mono`: **JetBrains Mono** — eyebrows, category tags, dates, table headers, diagram annotations. Always uppercase + letter-spacing (0.08–0.18em) when used as a label.

---

## 3. Layout & Signature Elements

- Content column: articles read at `max-width: 68ch`; page shells at `max-width: 1080px`.
- **Signature motif: the viewfinder.** Every decorative device on the site derives from one metaphor — looking through a camera. The approved vocabulary (do not invent outside it):
  - **AF bracket corners** on cards (`.pillar`, `.article-card`): 12px cobalt brackets on hover, top-left + bottom-right only.
  - **Dark band page openers — the system's backbone.** Every page opens with a full-bleed `--ink` band that puts the reader *inside the camera*, matching the dark-canvas diagram language, then transitions to light content through a **film-edge** row of sprocket holes (`rgba(255,255,255,0.22)` strokes on the band's bottom edge; the standalone `.film-divider` on light bg is its homepage sibling). Every band gets the faint white focusing-screen grid (radial-masked) + lens vignette pseudo-elements. Per page:
    - *Homepage hero:* the full treatment — corner brackets (`#5B8CFF`), oversized ambient aperture SVG half-cropped off the right edge (`rgba(91,140,255,0.13)`, opens on load, iris-rotates 45° on scroll), italic `#5B8CFF` accent phrase in the white headline, exposure-readout HUD with pulsing amber dot.
    - *Articles listing:* compact band with eyebrow, white title, and the contact-sheet roll-meta line, then film-edge into the card grid.
    - *Article pages:* the band is the **title card** — a mono `← CONTACT SHEET` crumb, category chip (amber on `rgba(196,135,26,0.14)`), date + true read time (computed from the post body, passed as `body` prop), white title, description with `#5B8CFF` left border, then film-edge into the prose. No brackets/aperture/HUD here — the title is the subject.
    Text on dark always uses the §6.2 dark-canvas tints, never raw `--accent`.
  - **Depth-of-field hover** on card grids: `.grid:has(.card:hover) .card:not(:hover) { opacity: 0.55; filter: blur(1px); }` — focusing one card defocuses its siblings. Pair with a 0.3s ease transition. Grids only, never on text or nav.
  - **Film-strip perforation divider** (`.film-divider`) between homepage sections — sprocket holes flanked by hairlines. Replaces plain `<hr>` on landing surfaces only, never inside articles.
  - **Frame counters** (`FR 04`, mono, top-right) on article cards, with a contact-sheet metadata line under the listing title (`ROLL 001 · 04 FRAMES EXPOSED · EST. 2026`) — numbering is justified because the listing is chronological; newest post gets the highest frame number.
  - **Aperture glyph** (`ApertureMark.astro`) beside the wordmark in header and footer; rotates 60° on wordmark hover.
- **Drop cap** on the first paragraph of every article (automatic via `BlogPost.astro` CSS).
- **End-of-roll marker**: articles close with a centered mono `— END OF ROLL —` and a "Back to the contact sheet →" link (rendered by the layout — never add it in MDX).
- Eyebrow labels (mono, uppercase, amber) introduce sections and pages.
- Text selection is cobalt/white site-wide (`::selection` in `global.css`).
- Restraint rules: inside article *prose*, no decorative devices beyond drop cap + progress bar — the diagrams are the visual interest there; the dark band and end-of-roll marker live in the layout, not the content. If you add a new device anywhere, it must come from the viewfinder/film metaphor, and you remove one first.

---

## 4. Motion Standard (GSAP)

GSAP + ScrollTrigger via npm, imported in Astro `<script>` blocks (Astro bundles them as modules). Patterns in use: `src/pages/index.astro`, `src/pages/articles/index.astro`, `src/layouts/BlogPost.astro`.

**The rules:**

1. **Register once per script block:** `gsap.registerPlugin(ScrollTrigger)`.
2. **Reduced motion is mandatory.** The CSS `prefers-reduced-motion` rule does NOT affect GSAP (it sets inline styles). Every script block must guard:
   ```js
   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if (!reduceMotion) { /* all decorative animation here */ }
   ```
   The article reading-progress bar is exempt (it only mirrors the user's own scrolling). CSS `@keyframes` ambient effects (the HUD focus dot) are killed by the global reduced-motion CSS rule automatically — no JS guard needed for those.
   **Ambient motion budget: exactly one ambient element per page** (currently the hero HUD dot, 2.4s opacity pulse). Anything else animates on entrance only.
3. **Animate `opacity` and `transform` only** (x/y/scale). Never width/height/top/left.
4. **Tuning window:** duration 0.45–0.65s, ease `power2.out`, stagger 0.08–0.11, distance 14–28px. Entrances only — nothing animates out.
5. **All scroll reveals are one-shot:** `once: true`, start between `top 86%` and `top 90%`. Content must never be hidden from someone who scrolled past fast — batch/`gsap.from` handle this, but if you use `gsap.set` to pre-hide, it must be inside the reduced-motion guard.
6. **No scrub, no pinning, no parallax in articles.** Scrub is allowed in exactly two places: the article reading-progress bar, and one ambient scroll-linked transform on a landing hero (currently the hero aperture's 45° rotation). Both use `ease: 'none'`; the hero one lives inside the reduced-motion guard.
7. **Never leave `markers: true` in committed code.**
8. When writing new GSAP code, invoke the `gsap-skills` plugin skill for the relevant module (e.g. `gsap-scrolltrigger`) rather than working from memory.

**Why so restrained:** the content is the product. Animation exists to make the site feel alive on first contact and reward scrolling — at 200ms+ durations it starts to feel like the site is performing, which undercuts the engineering-authority voice.

---

## 5. Article Structure Template

Explainer articles are 1,500–2,500 words. Structure, in order:

1. **Frontmatter:** `title` (a question or concrete claim, not a topic label), `description` (140–160 chars, includes the contrarian hook), `pubDate`, `category` (one of: `explainer`, `smartphone`, `mirrorless`, `comparison`).
2. **Intro — exactly 3 short paragraphs:** (a) hook stating the invisible/misunderstood thing, (b) the contrarian turn ("almost nobody talks about X — that's a mistake"), (c) the credential line + what the reader gains. The drop cap lands on paragraph 1 automatically.
3. **TL;DR box** — immediately after the intro, an `<aside class="takeaways">` with a mono label and 3–4 bullet takeaways. Readers who bounce still get the thesis; readers who stay get a map.
4. **Body sections:** H2 every 150–300 words. Headings are descriptive claims or stage names, never clever. Use H3 only inside a long H2 section. Bold lead-ins (`**Spatial noise reduction** …`) for parallel concepts instead of extra headings.
5. **Diagram density: at least one diagram per ~500 words.** Every section explaining a *system, spatial concept, or curve* gets one. If a section is pure argument (opinion, buying advice), no diagram. See §6.
6. **Summary table** near the end — one table that compresses the article into scannable rows (e.g. stage → what it fixes → visible failure). Tables are for enumerable facts only.
7. **Closing blockquote** — final element, one or two sentences bridging to the site's wider themes (becomes internal-link bait as more articles publish).

**Prose rules:**

- Concrete numbers over adjectives ("14 stops", not "huge dynamic range").
- Explain the failure mode, not just the mechanism — readers remember "watercolor skin" and "zipper artifacts".
- Short sentences for claims. Longer sentences for mechanism. No paragraph over 5 lines rendered.
- Em-dashes and parentheses for asides; never footnotes.

**MDX pitfalls (these have bitten before):**

- **No HTML comments** (`<!-- -->`) anywhere in `.mdx` — MDX throws `Unexpected character '!'`.
- Hex entities like `&#x2192;` (→) are fine inside SVG text.
- Keep a blank line between an HTML block (`<figure>`, `<aside>`) and surrounding markdown.
- Raw `<` in prose must be escaped or avoided.

---

## 6. Diagram Style Guide (inline SVG)

Diagrams are the site's biggest differentiator. All diagrams are **hand-authored inline SVG inside the MDX** — no external images, no JS. Reference implementations live in `what-is-an-image-signal-processor.mdx`.

### 6.1 Two canvas types

**Dark canvas — systems & architecture** (pipelines, block diagrams, control loops, comparisons):
- Background: `<rect width="W" height="H" rx="8" fill="#0E1117"/>` — full-bleed dark ink.
- viewBox width **860** for full-width diagrams. Height as needed (typically 160–260).
- Node cards: `fill="rgba(255,255,255,0.03)"`, 1px stroke of the semantic color at 0.4–0.6 alpha, `rx="4"`, plus a **4px-wide accent strip** rect on the left edge (semantic color, opacity 0.75–0.8).
- Numbering (mono, 9px, bold, semantic color) when order matters; skip when it doesn't.
- Node names: Fraunces 700, 10.5px (9.5px if a single long word), white.
- Sub-labels: JetBrains Mono 7px, `rgba(255,255,255,0.55)`.
- Section/phase labels: mono 7px, letter-spacing 1.5, semantic color at 0.6 alpha.

**Light canvas — data, curves, grids** (graphs, pixel grids, charts):
- No background rect — sits on the page background inside `<figure>`.
- Axes/gridlines: `#DDE1ED`, 1–1.5px. Axis labels: mono 10px `#4B5775`.
- Data strokes: cobalt `#2151CC` 2.5px. Annotations: amber, dashed 1px leader lines, mono 8.5px labels.
- viewBox width 360–480 (these render narrower than full-width).

### 6.2 Semantic color inside diagrams

- **Amber `#C4871A`:** hardware, control signals, annotations, arrows.
- **Cobalt `#2151CC`** (+ lighter tints `#4B7FFF`, `#5B8CFF`, `#7BA7FF` for legibility on dark): software, data path, results.
- On dark canvas, never use pure `#2151CC` for *text* — use the lighter tints.

### 6.3 Conventions

- Arrows: amber, 1.5px, shared `<marker>` triangle def (`markerUnits="userSpaceOnUse"`). **Marker ids must be unique per SVG** (e.g. `isp-arr`, `loop-arr`) — duplicate ids across SVGs on one page break rendering.
- Dashed strokes mean a *boundary or feedback* (pass boundary, return path), solid means forward data flow.
- Minimum font size 7px at 860 viewBox width. If a label doesn't fit at 7px, shorten the label.
- Every SVG: `role="img"` and a one-sentence `aria-label` describing the whole diagram.
- Every diagram wrapped in `<figure>` + `<figcaption>` (caption is mono, auto-styled). The caption states the *insight*, not just the subject — "Green appears twice per 2×2 block because…" not "The Bayer pattern."

### 6.4 When to add a diagram

| Content type | Diagram? | Canvas |
|---|---|---|
| Multi-stage process / pipeline | Yes — numbered chain | Dark |
| Feedback/control loop | Yes — cycle with return path | Dark |
| A vs B architecture | Yes — two lanes/panels | Dark |
| Curve, mapping, response | Yes — annotated graph | Light |
| Spatial/grid concept (CFA, kernels) | Yes — colored grid | Light or dark |
| Pure opinion / buying advice | No | — |

---

## 7. Page-Level UI Standards

- Header: sticky, 56px, surface white, hairline bottom border. Wordmark in cobalt Fraunces.
- Article pages get a **reading-progress bar**: 3px, fixed top, cobalt, `scaleX` scrubbed to `.prose` scroll extent. This is the only persistent motion on the page.
- Cards: 6px radius, hairline border, hover = cobalt border + soft cobalt shadow + AF brackets. Transitions 0.18s.
- The TL;DR aside (`.takeaways`): surface white, hairline border, amber mono label, cobalt left accent — styled in `BlogPost.astro`.
- Accessibility floor: visible keyboard focus, alt/aria on all imagery, contrast ≥ 4.5:1 for text (check `--ink-muted` on `--bg` stays above this), touch targets ≥ 44px.

---

## 8. Which Skill / MCP to Use, and When

The toolbox, in the order you should reach for it:

| Task | Tool | How |
|---|---|---|
| Research (multi-command, logs, repo state) | **context-mode MCP** (`ctx_batch_execute`, `ctx_search`) | Default for any output > ~10 lines; keeps raw bytes out of context. Process data with `ctx_execute`/`ctx_execute_file` instead of reading files raw. |
| Fetching web docs for research | **context-mode** `ctx_fetch_and_index` | Indexes the page; query with `ctx_search`. Prefer over WebFetch. |
| Writing/modifying GSAP animation | **gsap-skills plugin** (`gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react`) | Invoke the matching skill before writing animation code; follow §4 tuning limits. |
| New page / visual identity / hero design | **frontend-design** (official plugin) | Invoke for any net-new page design; it enforces the brainstorm→critique→build loop. Keep its output within §2 tokens. |
| UX review, palette/typography questions, checklists | **ui-ux-pro-max** | Run its `search.py` with `--domain ux` (guidelines), `--domain typography`, or `--design-system`. Treat results as advisory; §2 tokens always win. |
| Designing a new *diagram* | **design-for-ai** `data-viz` skill | For chart-type selection and data-viz correctness; render per §6. |
| Article prose quality / de-AI-ifying drafts | **oberskills** `write` | Run drafts through it; keep the §1 voice. |
| Web research for article facts | **oberskills** `web-research` | For claims that need sourcing; verify numbers before publishing. |
| Non-trivial code changes / refactors | **code-foundations** (e.g. `planning`, `cc-refactoring-guidance`) | For Astro component or build-system work beyond copy edits. |
| Converting PDFs/pages to markdown | **markitdown MCP** | Spec sheets, whitepapers → research notes. |

Notes:
- oberskills' `browser`/`skill-eval` MCP servers need `bun` (not installed) — the plain skills work, those two MCP features don't.
- Skills are invoked with the `Skill` tool (or `/plugin:skill` by the user). Don't stack multiple design skills on one small task; pick the closest match.

---

## 9. Pre-publish Checklist

Run through this before calling any article or page change done:

1. `astro dev` running (background) — page returns 200, `astro dev logs` shows no MDX/build errors.
2. No `<!--` comments in MDX. All SVG marker ids unique per page.
3. Every diagram has `role="img"`, `aria-label`, `<figcaption>`.
4. TL;DR aside present; summary table present; closing blockquote present.
5. All GSAP code inside the reduced-motion guard (except progress bar); no `markers: true`.
6. Frontmatter description 140–160 chars; category valid; pubDate correct.
7. Voice check: credential framing only (no name/employer); no "in this article".
8. Reviewed visually on `localhost:4321`.
9. **Do not deploy.** Deploy only on explicit instruction.
