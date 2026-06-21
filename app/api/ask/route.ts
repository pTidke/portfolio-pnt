import { NextResponse } from "next/server";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

/* Ask AI backend — relay to the "PrajwalAI" Azure AI Foundry agent.

   This is the newer Foundry agent type, reached through the OpenAI Responses
   protocol: AIProjectClient.getOpenAIClient() -> conversations + responses, with
   the agent passed as an `agent_reference`. The agent already holds its
   instructions + grounding in the Foundry portal, so this route just drives the
   conversation: create conversation (or reuse one) -> respond to the new input.

   Auth is Entra ID via DefaultAzureCredential. Off-Azure (e.g. Vercel) it reads
   a service principal from AZURE_TENANT_ID / AZURE_CLIENT_ID / AZURE_CLIENT_SECRET.
   That principal needs an RBAC role (Azure AI User) on the Foundry resource. */

// Azure SDK needs the Node runtime (not Edge). Agent runs can be slow.
export const runtime = "nodejs";
export const maxDuration = 60;

const endpoint = process.env.AZURE_AI_PROJECT_ENDPOINT;
const agentName = process.env.AZURE_AI_AGENT_NAME;
// Optional: pin a published version. Omit to use the agent's latest/active version.
const agentVersion = process.env.AZURE_AI_AGENT_VERSION;

const MAX_MESSAGE_LEN = 2000;

let client: AIProjectClient | null = null;

function getClient(): AIProjectClient {
  if (!endpoint || !agentName) {
    throw new Error(
      "Azure agent not configured: set AZURE_AI_PROJECT_ENDPOINT and AZURE_AI_AGENT_NAME",
    );
  }
  // Reuse one client + credential across invocations (token caching).
  client ??= new AIProjectClient(endpoint, new DefaultAzureCredential());
  return client;
}

function agentRef() {
  return {
    type: "agent_reference" as const,
    name: agentName,
    ...(agentVersion ? { version: agentVersion } : {}),
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

  try {
    const openai = getClient().getOpenAIClient();

    // First turn → new conversation; later turns reuse the id for continuity.
    if (!conversationId) {
      const conversation = await openai.conversations.create({});
      conversationId = conversation.id;
    }

    const response = await openai.responses.create(
      { conversation: conversationId, input: message },
      { body: { agent_reference: agentRef() } },
    );

    return NextResponse.json({
      answer: response.output_text?.trim() || "(the assistant returned no text)",
      conversationId,
    });
  } catch (err) {
    console.error("[/api/ask]", err);
    return NextResponse.json({ error: "assistant unavailable" }, { status: 500 });
  }
}
