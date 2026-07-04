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

// Developer pain UNIUN Inference removes.
export const INFRA_PROBLEMS: string[] = [
  'Different APIs, SDKs, and authentication for every provider.',
  'Different pricing, streaming semantics, and error shapes.',
  'Vendor lock-in and painful migrations when the field moves.',
  'No unified billing, usage tracking, or observability across providers.',
];

// What the layer offers.
export const INFRA_CAPABILITIES: InfraItem[] = [
  {
    title: 'OpenAI-compatible API',
    body: 'Integrate once. Point your existing OpenAI SDK at UNIUN and pick any supported model with a header or model name — no SDK swaps, no rewrites.',
  },
  {
    title: 'Provider routing',
    body: 'One endpoint routes to GPT, Claude, Gemini, Grok, DeepSeek, or a self-hosted model. The client contract stays the same regardless of destination.',
  },
  {
    title: 'Streaming, auth & keys',
    body: 'Server-sent event streaming, scoped API keys, per-key rate limits, and per-request usage records — the plumbing every app otherwise rebuilds by hand.',
  },
  {
    title: 'Unified billing & analytics',
    body: 'One dashboard for cost, tokens, and latency across every provider. Tag requests by app, workspace, or environment.',
  },
  {
    title: 'Hybrid cloud + local',
    body: 'The same endpoint transparently serves cloud providers and self-hosted open models (Llama, Gemma, Qwen, DeepSeek) as we scale the local cluster.',
  },
  {
    title: 'Portable, no lock-in',
    body: 'Bring your own keys (BYOK) or use ours. Swap providers, cache prompts, and fail over automatically without touching client code.',
  },
];

// Short, honest principles — signal seriousness without overclaiming.
export const INFRA_PRINCIPLES: string[] = [
  'Own the critical path; rent only what is genuinely commodity.',
  'Privacy and residency are defaults, not add-ons.',
  'Portability over lock-in — models are swappable, the platform is ours.',
  'One stable public API. The internals can evolve; your integration should not have to.',
];
