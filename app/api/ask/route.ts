import { NextResponse } from "next/server";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import OpenAI from "openai";

/* Ask AI backend — relay to the "PrajwalAI" Azure AI Foundry agent.

   This is the newer Foundry agent type, reached through the OpenAI Responses
   protocol: an OpenAI client pointed at the Foundry project endpoint, driving
   conversations + responses with the agent passed as an `agent_reference`. The
   agent already holds its instructions + grounding in the Foundry portal, so
   this route just drives the conversation: create conversation (or reuse one) ->
   respond to the new input.

   Two auth modes, picked by env:
   1. API KEY (AZURE_AI_API_KEY) — the Foundry resource key. Needs only access to
      the resource, NOT Entra ID / app-registration rights. Use this on Vercel.
   2. Entra ID (DefaultAzureCredential) — used when no key is set. Locally this
      rides your `az login`; on Azure it can use a managed identity / service
      principal. Picked automatically as the fallback. */

// Azure SDK needs the Node runtime (not Edge). Agent runs can be slow.
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGE_LEN = 2000;

/* Read an env var, trimming whitespace and any surrounding quotes. Vercel stores
   values verbatim — if a value was pasted with "quotes" they end up in the
   string and break URLs / silently disable the key path. Strip them defensively. */
function env(name: string): string | undefined {
  const raw = process.env[name];
  if (raw == null) return undefined;
  const v = raw.trim().replace(/^['"]|['"]$/g, "").trim();
  return v.length ? v : undefined;
}

// Read env per-request (not at module scope) so values are always the runtime
// ones and never captured at build time.
function config() {
  return {
    endpoint: env("AZURE_AI_PROJECT_ENDPOINT"),
    agentName: env("AZURE_AI_AGENT_NAME"),
    agentVersion: env("AZURE_AI_AGENT_VERSION"),
    apiKey: env("AZURE_AI_API_KEY"),
  };
}

function getOpenAI(cfg: ReturnType<typeof config>): OpenAI {
  const { endpoint, agentName, apiKey } = cfg;
  if (!endpoint || !agentName) {
    throw new Error(
      "Azure agent not configured: set AZURE_AI_PROJECT_ENDPOINT and AZURE_AI_AGENT_NAME",
    );
  }

  if (apiKey) {
    // Key auth — Azure expects the key in the `api-key` header. The `apiKey`
    // field satisfies the OpenAI SDK; the header is what the service reads.
    return new OpenAI({
      baseURL: `${endpoint}/openai/v1`,
      apiKey,
      defaultHeaders: { "api-key": apiKey },
    });
  }
  // Entra ID — let AIProjectClient wire the bearer-token provider + base URL.
  return new AIProjectClient(endpoint, new DefaultAzureCredential()).getOpenAIClient();
}

function agentRef(cfg: ReturnType<typeof config>) {
  return {
    type: "agent_reference" as const,
    name: cfg.agentName,
    ...(cfg.agentVersion ? { version: cfg.agentVersion } : {}),
  };
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  let body: { message?: unknown; conversationId?: unknown };
  try {
    body = await req.json();
  } catch {
    return bad("invalid JSON body");
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  let conversationId =
    typeof body.conversationId === "string" ? body.conversationId : undefined;

  if (!message) return bad("message is required");
  if (message.length > MAX_MESSAGE_LEN) return bad("message too long");

  const cfg = config();
  // Non-secret diagnostic: confirms what the deployed function actually sees.
  console.log("[/api/ask] auth:", cfg.apiKey ? "key" : "entra", {
    hasKey: Boolean(cfg.apiKey),
    hasEndpoint: Boolean(cfg.endpoint),
    hasAgent: Boolean(cfg.agentName),
  });

  try {
    const openai = getOpenAI(cfg);

    // First turn → new conversation; later turns reuse the id for continuity.
    if (!conversationId) {
      const conversation = await openai.conversations.create({});
      conversationId = conversation.id;
    }

    // agent_reference is an Azure Foundry extension to the Responses body — not in
    // the OpenAI types, hence the cast. Top-level works for both auth clients.
    const response = await openai.responses.create({
      conversation: conversationId,
      input: message,
      agent_reference: agentRef(cfg),
    } as never);

    return NextResponse.json({
      answer: response.output_text?.trim() || "(the assistant returned no text)",
      conversationId,
    });
  } catch (err) {
    console.error("[/api/ask]", err);
    return NextResponse.json({ error: "assistant unavailable" }, { status: 500 });
  }
}
