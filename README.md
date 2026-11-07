# Kaissa — portfolio

Astro + GSAP + Lenis. Static output, host anywhere.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs /dist
```

## Where content lives

All content is data. Layout code never needs to change to add or edit work.

| File | What it controls |
|---|---|
| `src/data/site.json` | Name, role, hero lines + script accent, bio, skills, about photo, awards, fun facts marquee, contact section, email, LinkedIn |
| `src/pages/` | Home, `work/` (all projects), `about`, `contact`, and one page per case study |
| `src/content/projects/*.md` | One file per case study (frontmatter only) |
| `src/data/freestyle.json` | The two big Freestyle tiles |
| `src/data/archive.json` | The "Wait, more?" auto-scrolling strip |
| `src/styles/tokens.css` | Colours, fonts, type scale, spacing |
| `public/media/` | Put images and videos here, reference them as `/media/...` |

Anything with no image/video yet renders as a placeholder in the project's `tone` colour, so pages can go live before visuals arrive.

## Adding a project

Copy an existing file in `src/content/projects/`, rename it (the file name becomes the URL: `work/<file-name>/`), and edit the frontmatter. The schema in `src/content.config.ts` validates it at build time, so typos fail loudly.

- `featured: true` shows it in Selected works, `draft: true` hides it everywhere.
- `order` sets the position.
- `cover`: `{ image, video, poster }`. Videos play muted on loop, only while visible. Keep them under ~3 MB (H.264 MP4) with a poster frame.

### Section blocks

Mix these in any order under `sections:`:

| type | Use for |
|---|---|
| `brief` | `[LABEL] value` rows: Momentum, Brief, Approach, Our move, Goal, Idea |
| `context` | A labelled paragraph |
| `statement` | One big sentence in display type, revealed word by word |
| `execution-list` | Numbered deliverables |
| `channels` | Tag pills (Radio, OOH, Social...) |
| `repeat-word-band` | A word repeating in drifting rows behind one visual |
| `media-grid` | 1–3 columns of images / videos / embeds (`embed: https://www.youtube.com/embed/...`) |

New block type: add it to the `block` union in `src/content.config.ts`, then a branch in `src/components/blocks/Block.astro`.

## Motion

All in `src/scripts/motion.ts`, opted into with data attributes (`data-reveal-lines`, `data-script`, `data-fade`, `data-drift`). `prefers-reduced-motion` turns everything off.

## Still to collect from Kaissa

Search the content files for `[Coming]`, `[Intro coming]`, `[Role coming]` and `TODO`.

- Email and LinkedIn (`site.json` → `contact`)
- Confirm or rewrite traits, topics, hero lines
- Cover + visuals for every project, credits (agency, team)
- Roche: intro, brief, idea, her role
- Samsung Z Flip 6 and Tata Motors thumbnails (`archive.json`); the other three archive items are placeholders
- Photography and weird-ideas images for Freestyle

## Fun-fact stickers

`public/stickers/*.webp` are 3D emoji from Microsoft's Fluent Emoji set (MIT licence, via the
`@lobehub/fluent-emoji-3d` package) with a white die-cut edge added. To add one: save any
transparent PNG/WebP in `public/stickers/`, then add `{ "label": "...", "sticker": "stickers/<file>.webp" }`
to `traits` in `site.json`. Placement (side, tilt, size) is picked automatically in `Traits.astro`.
