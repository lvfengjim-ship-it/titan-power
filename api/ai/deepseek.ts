// DeepSeek API client — OpenAI-compatible protocol (same API format as sensor-hx)
// baseURL: https://api.deepseek.com  model: deepseek-chat

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

function apiKey() {
  return process.env.DEEPSEEK_API_KEY ?? "";
}

export function hasDeepSeekKey() {
  return apiKey().length > 0;
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

/** Non-streaming call, returns full text (video summaries etc.) */
export async function deepseekChat(messages: ChatMessage[], maxTokens = 600): Promise<string> {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey()}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek error: ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

/** Streaming call, returns the upstream SSE response (forwarded to frontend as-is) */
export async function deepseekChatStream(messages: ChatMessage[], maxTokens = 2400): Promise<Response> {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey()}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      max_tokens: maxTokens,
      temperature: 0.4,
      stream: true,
    }),
  });
  if (!res.ok || !res.body) throw new Error(`DeepSeek stream error: ${res.status}`);
  return res;
}
