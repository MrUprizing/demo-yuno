import Firecrawl from "@mendable/firecrawl-js";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });

export type ChatMessage = UIMessage;

export async function POST(req: Request) {
  const body = await req.json();
  const messages: ChatMessage[] = body.messages;

  const tools = {
    scrapeTool: tool({
      description: "Scrape content from a URL",
      inputSchema: z.object({
        url: z.string().describe("URL to scrape content from"),
      }),
      execute: async ({ url }) => {
        const content = await firecrawl.scrape(url, {
          formats: ["branding", "markdown", "screenshot"],
        });
        return content;
      },
    }),
    updateCheckoutUI: tool({
      description: "Update the CheckOuts UI component",
      inputSchema: z.object({
        uiObject: z
          .object()
          .describe("The updated UI code for the CheckOuts component"),
      }),
      execute: async ({ uiObject }) => {
        const response = await fetch(
          "https://drinksdepot.online:443/api/payments/style",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: uiObject,
          },
        );
        return response;
      },
    }),
  };

  const result = streamText({
    model: "anthropic/claude-haiku-4.5",
    maxRetries: 2,
    system:
      "You are an AI App CheckOuts Builder. Generate CheckOuts ui. The existing app is in the /template directory. Please edit the app how the user wants and commit the changes incrementally." +
      "Try to avoid generate multiple componets, try to use only page.tsx",
    // + docsYunoSdkDemo,
    messages: convertToModelMessages(messages),
    tools,
    abortSignal: AbortSignal.timeout(120000),
    stopWhen: stepCountIs(100),
  });

  return result.toUIMessageStreamResponse();
}
