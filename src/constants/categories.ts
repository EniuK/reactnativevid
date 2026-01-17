export const CATEGORIES = [
  'React Native',
  'React',
  'TypeScript',
  'JavaScript',
] as const;

export type Category = typeof CATEGORIES[number];
