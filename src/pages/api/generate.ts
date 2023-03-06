import type { ParseEvent } from "eventsource-parser";
import { createParser } from "eventsource-parser";

interface Payload {
  model: string,
  prompt: string,
  temperature: number,
  max_tokens: number,
  top_p: number,
  frequency_penalty: number,
  presence_penalty: number,
  stream: boolean,
  n: number
}

export const generateChatGPT = (payload: Payload) => {
  return fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function OpenAIStream(payload: Payload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await generateChatGPT(payload);

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParseEvent): void {
        const event2 = event as { type: 'event', data: string }
        if (event2.type === "event") {
          const data: string = event2.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json: unknown = JSON.parse(data);
            const choices: unknown[] = json && typeof json === 'object' && 'choices' in json && Array.isArray(json.choices) ? json.choices : [];
            const text = choices[0] && typeof choices[0] === 'object' && 'text' in choices[0] ? choices[0].text : ''

            if (typeof text !== 'string') {
              return;
            }

            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const parser: unknown = createParser(onParse);
      if (res.body) {
        const body = res.body as unknown as Iterable<ReadableStream<string>>;
        for await (const chunk of body) {
          if (parser && typeof parser === "object" && 'feed' in parser && typeof parser['feed'] === "function") {
            parser.feed(decoder.decode(chunk as unknown as BufferSource | undefined));
          }
        }
      }
    },
  });

  return stream;
}
export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt } = (await req.json()) as {
    prompt: string;
  };

  const payload: Payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
    max_tokens: 3000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;

