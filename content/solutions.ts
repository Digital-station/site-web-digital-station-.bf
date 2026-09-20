/**
 * Digital Station's own product solutions.
 *
 * Structure only — the name, tagline, description and tags live in
 * messages/<locale>.json under `solutions.items.<id>`, so the page works in
 * both languages.
 *
 * These are products, not client case studies, which is why the navigation
 * calls the page "Nos solutions" / "Our solutions".
 */

export type SolutionMeta = {
  id: string;
  /** Number of tag chips this solution defines in the message files. */
  tagCount: number;
  image: string;
};

export const SOLUTIONS: readonly SolutionMeta[] = [
  {
    id: 'alimgesto',
    tagCount: 3,
    image: '/placeholders/solution-alimgesto.jpg',
  },
  {
    id: 'ticketia',
    tagCount: 3,
    image: '/placeholders/solution-ticketia.jpg',
  },
  {
    id: 'immopilot',
    tagCount: 3,
    image: '/placeholders/solution-immopilot.jpg',
  },
  {
    id: 'edumanager',
    tagCount: 3,
    image: '/placeholders/solution-edumanager.jpg',
  },
] as const;
