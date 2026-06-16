/**
 * Modular AI description service.
 *
 * Swap `generateTaskDescription` for a real provider call (OpenAI, Anthropic, etc.)
 * by reading OPENAI_API_KEY (or your provider's key) and calling out to it.
 * When no key is configured, a deterministic placeholder generator is used instead,
 * so the feature stays fully functional in local/dev environments without billing.
 */

export interface AiDescriptionResult {
  description: string;
  source: "openai" | "placeholder";
}

export async function generateTaskDescription(
  title: string
): Promise<AiDescriptionResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      return await generateWithOpenAI(title, apiKey);
    } catch (error) {
      console.error("AI provider request failed, falling back to placeholder:", error);
      return { description: buildPlaceholderDescription(title), source: "placeholder" };
    }
  }

  return { description: buildPlaceholderDescription(title), source: "placeholder" };
}

async function generateWithOpenAI(
  title: string,
  apiKey: string
): Promise<AiDescriptionResult> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write concise, actionable task descriptions (2-4 sentences) for a task management app. Do not use markdown.",
        },
        {
          role: "user",
          content: `Write a helpful task description for a task titled: "${title}"`,
        },
      ],
      temperature: 0.6,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const json = await response.json();
  const description: string | undefined = json?.choices?.[0]?.message?.content?.trim();

  if (!description) {
    throw new Error("OpenAI response did not contain a description");
  }

  return { description, source: "openai" };
}

/** Deterministic, dependency-free description generator used when no AI key is configured. */
function buildPlaceholderDescription(title: string): string {
  const trimmedTitle = title.trim().replace(/\.$/, "");

  return [
    `Plan and complete "${trimmedTitle}".`,
    `Break the work into smaller steps, identify any blockers early, and confirm the acceptance criteria before you start.`,
    `Update the task status as you make progress and leave notes for anything that needs follow-up.`,
  ].join(" ");
}
