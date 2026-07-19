## Design Standard (read first)

**Before writing any article, diagram, animation, or UI change, read `DESIGN-STANDARD.md` at the repo root.** It defines the brand constraints (no real name, no employer name, credential framing only), design tokens, the SVG diagram style guide, GSAP motion rules, the article structure template, which skill/MCP to use for which task, and the pre-publish checklist. Follow it exactly — it exists so any model produces articles indistinguishable from the existing ones.

Deploy rule: review everything on localhost:4321; never push to GitHub unless explicitly told to deploy.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
