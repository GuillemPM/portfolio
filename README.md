# Guillermo Padilla Martin

Personal site and blog at [guillem.pm](https://www.guillem.pm): software architecture, Microsoft Business Central, and applied AI. Available in Spanish (default), English, and Catalan.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS
- Markdown blog posts under `content/blog/{locale}/`
- Three.js hero (`@react-three/fiber`)
- [Giscus](https://giscus.app) comments on posts
- Deployed on [Vercel](https://vercel.com)

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build   # production build
pnpm lint    # eslint
```

## Content

Blog posts are Markdown files with frontmatter (`id`, `title`, `description`, `date`, `author`). Same logical post across locales shares the same `id`.

```
content/blog/
  es/
  en/
  ca/
```

## Links

- Site: [guillem.pm](https://www.guillem.pm)
- LinkedIn: [gpadillam](https://www.linkedin.com/in/gpadillam)
- GitHub: [GuillemPM](https://github.com/GuillemPM)
- Support: [Buy Me a Coffee](https://buymeacoffee.com/guillempm)
