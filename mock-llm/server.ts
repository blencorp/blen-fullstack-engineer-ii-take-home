/**
 * Mock LLM Server
 *
 * Provides an OpenAI-compatible chat completions API that returns
 * deterministic responses based on the system prompt. No API key needed.
 *
 * Endpoints:
 *   POST /v1/chat/completions  — OpenAI-compatible chat completion
 *   GET  /health               — Health check
 *
 * The mock analyzes the system prompt to determine what kind of response
 * to generate (categorize, summarize, or suggest priority).
 *
 * DO NOT MODIFY THIS FILE — it's part of the test infrastructure.
 */

import { createServer, IncomingMessage, ServerResponse } from "http";

const PORT = 11434;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequest {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
}

// ---------------------------------------------------------------------------
// Response generators — deterministic based on input content
// ---------------------------------------------------------------------------

function categorizeTask(userContent: string): string {
  const lower = userContent.toLowerCase();

  if (
    lower.includes("bug") ||
    lower.includes("fix") ||
    lower.includes("error") ||
    lower.includes("broken") ||
    lower.includes("crash")
  ) {
    return JSON.stringify({ category: "bug", confidence: 0.92 });
  }
  if (
    lower.includes("add") ||
    lower.includes("new") ||
    lower.includes("implement") ||
    lower.includes("create") ||
    lower.includes("build")
  ) {
    return JSON.stringify({ category: "feature", confidence: 0.88 });
  }
  if (
    lower.includes("refactor") ||
    lower.includes("clean") ||
    lower.includes("optimize") ||
    lower.includes("improve") ||
    lower.includes("update")
  ) {
    return JSON.stringify({ category: "improvement", confidence: 0.85 });
  }
  if (
    lower.includes("doc") ||
    lower.includes("readme") ||
    lower.includes("comment") ||
    lower.includes("guide") ||
    lower.includes("write")
  ) {
    return JSON.stringify({ category: "documentation", confidence: 0.9 });
  }

  return JSON.stringify({ category: "feature", confidence: 0.6 });
}

function suggestPriority(userContent: string): string {
  const lower = userContent.toLowerCase();

  if (
    lower.includes("security") ||
    lower.includes("crash") ||
    lower.includes("data loss") ||
    lower.includes("production down") ||
    lower.includes("urgent")
  ) {
    return JSON.stringify({
      priority: "critical",
      reasoning:
        "Security or stability issue requiring immediate attention",
    });
  }
  if (
    lower.includes("block") ||
    lower.includes("important") ||
    lower.includes("deadline") ||
    lower.includes("customer")
  ) {
    return JSON.stringify({
      priority: "high",
      reasoning: "Blocking issue or customer-facing impact",
    });
  }
  if (
    lower.includes("nice to have") ||
    lower.includes("minor") ||
    lower.includes("cosmetic") ||
    lower.includes("later")
  ) {
    return JSON.stringify({
      priority: "low",
      reasoning: "Non-urgent improvement with no immediate impact",
    });
  }

  return JSON.stringify({
    priority: "medium",
    reasoning: "Standard task with moderate impact",
  });
}

function summarizeProject(userContent: string): string {
  // Count task-like patterns in the content
  const lines = userContent.split("\n").filter((l) => l.trim().length > 0);
  const taskCount = lines.length;

  const hasCompleted = userContent.toLowerCase().includes("completed");
  const hasInProgress =
    userContent.toLowerCase().includes("in_progress") ||
    userContent.toLowerCase().includes("in progress");
  const hasOpen = userContent.toLowerCase().includes("open");

  let summary = `Project has ${taskCount} tasks described. `;
  if (hasCompleted) summary += "Some work has been completed. ";
  if (hasInProgress) summary += "Active work is in progress. ";
  if (hasOpen) summary += "There are open items awaiting attention. ";

  if (!hasCompleted && !hasInProgress && !hasOpen) {
    summary +=
      "Unable to determine project status from the provided information. ";
  }

  return JSON.stringify({
    summary: summary.trim(),
    taskCount,
    health: hasInProgress
      ? "on_track"
      : hasOpen
        ? "needs_attention"
        : "completed",
  });
}

function generateResponse(messages: ChatMessage[]): string {
  const systemPrompt =
    messages.find((m) => m.role === "system")?.content || "";
  const userContent = messages.find((m) => m.role === "user")?.content || "";
  const lowerSystem = systemPrompt.toLowerCase();

  if (
    lowerSystem.includes("categorize") ||
    lowerSystem.includes("classify")
  ) {
    return categorizeTask(userContent);
  }
  if (
    lowerSystem.includes("priority") ||
    lowerSystem.includes("urgency")
  ) {
    return suggestPriority(userContent);
  }
  if (
    lowerSystem.includes("summarize") ||
    lowerSystem.includes("summary")
  ) {
    return summarizeProject(userContent);
  }

  // Default: echo back a generic response
  return JSON.stringify({
    message: "No matching handler for the given system prompt.",
  });
}

// ---------------------------------------------------------------------------
// HTTP Server
// ---------------------------------------------------------------------------

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // Health check
  if (req.url === "/health" && req.method === "GET") {
    return sendJson(res, 200, { status: "ok", model: "mock-llm-v1" });
  }

  // Chat completions (OpenAI-compatible)
  if (req.url === "/v1/chat/completions" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const request: ChatRequest = JSON.parse(body);

      if (!request.messages || !Array.isArray(request.messages)) {
        return sendJson(res, 400, { error: "messages array is required" });
      }

      const content = generateResponse(request.messages);

      // OpenAI-compatible response format
      return sendJson(res, 200, {
        id: `mock-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: request.model || "mock-llm-v1",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content,
            },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: body.length,
          completion_tokens: content.length,
          total_tokens: body.length + content.length,
        },
      });
    } catch {
      return sendJson(res, 400, { error: "Invalid request body" });
    }
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Mock LLM server running on http://0.0.0.0:${PORT}`);
  console.log(`  POST /v1/chat/completions  — Chat completions`);
  console.log(`  GET  /health               — Health check`);
});
