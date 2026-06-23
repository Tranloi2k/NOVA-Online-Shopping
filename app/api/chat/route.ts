import { buildChatSystemPrompt } from "@/app/lib/chat/build-system-prompt";
import { chatTools } from "@/app/lib/chat/tools";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const xai = createOpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.XAI_API_KEY) {
    return new Response("Missing XAI_API_KEY", { status: 500 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();
  const system = await buildChatSystemPrompt();

  const result = streamText({
    model: xai.chat("grok-3-latest"),
    system,
    messages: await convertToModelMessages(messages),
    tools: chatTools,
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (error instanceof Error) return error.message;
      return "Unable to connect to AI. Please try again later.";
    },
  });
}
