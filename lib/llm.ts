/**
 * LLM Client
 *
 * A thin wrapper around the mock LLM service's OpenAI-compatible API.
 * The mock LLM runs as a Docker container and responds to chat completion
 * requests at the URL defined by the LLM_BASE_URL environment variable.
 */

const LLM_BASE_URL = process.env.LLM_BASE_URL || "http://localhost:11434";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmResponse {
  content: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Send a chat completion request to the LLM service.
 *
 * Requirements:
 *   - POST to `${LLM_BASE_URL}/v1/chat/completions`
 *   - Include messages array in request body
 *   - Parse OpenAI-compatible response format
 *   - Handle errors: service unreachable -> throw, invalid JSON -> throw, timeout (5s) -> throw
 *
 * @param messages - Array of chat messages (system + user)
 * @param options  - Optional: model name, temperature
 * @returns        - The parsed LLM response
 * @throws         - On network error, timeout, or invalid response
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options?: { model?: string; temperature?: number },
): Promise<LlmResponse> {
  void messages;
  void options;
  void LLM_BASE_URL;
  // TODO: Implement
  throw new Error("chatCompletion not implemented");
}
