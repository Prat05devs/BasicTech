export interface InfraItem {
  title: string;
  body: string;
}

// Why we run our own inference layer. Conceptual value props (real copy).
export const INFRA_VALUES: InfraItem[] = [
  {
    title: 'Control & reliability',
    body: 'Owning the inference path means no surprise rate limits, deprecations, or outages dictated by a third party. We tune the stack end to end for the workloads we ship.',
  },
  {
    title: 'Cost efficiency at scale',
    body: 'Running our own infra lets us drive down per-request cost as volume grows, instead of paying a margin on every token to an external provider.',
  },
  {
    title: 'Data privacy & residency',
    body: 'Customer data stays within infrastructure we control, with clear residency boundaries — a direct answer to the data-handling questions European and US clients ask first.',
  },
  {
    title: 'No vendor lock-in',
    body: 'A portable, model-agnostic layer keeps us free to adopt the best models as the field moves, without rewrites or contractual handcuffs.',
  },
];

// What the layer offers. TODO: replace with concrete, real capabilities/specs.
export const INFRA_CAPABILITIES: InfraItem[] = [
  { title: 'TODO: Dedicated inference endpoints', body: 'TODO: describe the serving capability, supported model families, and throughput.' },
  { title: 'TODO: Workload-tuned hardware', body: 'TODO: describe the hardware/orchestration story.' },
  { title: 'TODO: Observability & guardrails', body: 'TODO: describe monitoring, evals, and safety controls.' },
];

// Short, honest principles — signal seriousness without overclaiming.
export const INFRA_PRINCIPLES: string[] = [
  'Own the critical path; rent only what is genuinely commodity.',
  'Privacy and residency are defaults, not add-ons.',
  'Portability over lock-in — models are swappable, the platform is ours.',
];
