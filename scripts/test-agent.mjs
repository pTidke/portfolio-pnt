// Standalone Azure Foundry agent smoke test — bypasses Next.js to isolate auth.
// Run: node --env-file=.env.local scripts/test-agent.mjs "your question"
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

const endpoint = process.env.AZURE_AI_PROJECT_ENDPOINT;
const name = process.env.AZURE_AI_AGENT_NAME;
const version = process.env.AZURE_AI_AGENT_VERSION;

if (!endpoint || !name) {
  console.error("Missing AZURE_AI_PROJECT_ENDPOINT or AZURE_AI_AGENT_NAME");
  process.exit(1);
}

const question = process.argv[2] ?? "Who is Prajwal and what does he do?";

const client = new AIProjectClient(endpoint, new DefaultAzureCredential());
const openai = client.getOpenAIClient();

console.log("→ creating conversation…");
const conv = await openai.conversations.create({});
console.log("  conversation:", conv.id);

console.log(`→ asking: ${question}`);
const res = await openai.responses.create(
  { conversation: conv.id, input: question },
  {
    body: {
      agent_reference: { type: "agent_reference", name, ...(version ? { version } : {}) },
    },
  },
);

console.log("\n--- answer ---\n" + (res.output_text ?? "(no text)"));
