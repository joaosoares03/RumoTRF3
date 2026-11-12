export type LessonSeed = {
  slug: string;
  /** slug do assunto do edital */
  topic: string;
  title: string;
  minutes: number;
  /** resumo de revisão (curto) */
  summary: string;
  /** aula em Markdown (autoral) */
  content: string;
};
