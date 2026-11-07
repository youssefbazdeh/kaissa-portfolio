import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * One media item. Leave image/video/embed empty and the site shows a styled
 * placeholder, so a project can go live before its visuals are ready.
 * Paths are relative to /public (e.g. "/media/ysir/teaser-01.jpg").
 */
const media = z.object({
  image: z.string().optional(),
  video: z.string().optional(), // muted autoplay loop (mp4/webm)
  poster: z.string().optional(), // still frame shown before the video loads
  embed: z.string().optional(), // YouTube / Vimeo embed URL
  alt: z.string().default(''),
  caption: z.string().optional(),
  label: z.string().optional(), // text shown on the placeholder
});

/** Case-study building blocks. Any project can use any blocks, in any order. */
const block = z.discriminatedUnion('type', [
  // [LABEL] value pairs: Momentum, Brief, Approach, Our move, Goal, Idea...
  z.object({ type: z.literal('brief'), items: z.array(z.object({ label: z.string(), value: z.string() })) }),
  // A longer paragraph with a bracket label.
  z.object({ type: z.literal('context'), label: z.string().optional(), text: z.string() }),
  // Big statement in display type.
  z.object({ type: z.literal('statement'), text: z.string() }),
  // Bulleted deliverables.
  z.object({ type: z.literal('execution-list'), label: z.string().default('Execution'), items: z.array(z.string()) }),
  // Row of tags.
  z.object({ type: z.literal('channels'), label: z.string().default('Channels'), items: z.array(z.string()) }),
  // A word repeating in rows behind one visual ("TEASER TEASER TEASER").
  z.object({ type: z.literal('repeat-word-band'), word: z.string(), media: media.optional() }),
  // A grid of images / videos / embeds.
  z.object({
    type: z.literal('media-grid'),
    label: z.string().optional(),
    columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
    // Cell shape: "4 / 3" (default), "16 / 9", "1 / 1"... or "auto" to keep each image's own proportions.
    ratio: z.string().default('4 / 3'),
    items: z.array(media),
  }),
]);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    client: z.string(),
    title: z.string(),
    // How the big title breaks on the case page; defaults to `title`.
    titleLines: z.array(z.string()).optional(),
    role: z.string(),
    order: z.number().default(99),
    featured: z.boolean().default(true), // true = Selected works grid
    draft: z.boolean().default(false), // true = hidden everywhere
    tone: z.string().default('#005BFF'), // placeholder colour until real media exists
    cover: media.default({ alt: '' }),
    intro: z.string(),
    sections: z.array(block).default([]),
    credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
  }),
});

export const collections = { projects };
