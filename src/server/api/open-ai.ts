import { Configuration, OpenAIApi } from "openai";

const aiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

export const createAiRequest = (request: string) => ({
    model: "text-davinci-003",
    prompt: `${request}`,
    temperature: 0,
    max_tokens: 3000,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0
  }
);

export const openai = new OpenAIApi(aiConfiguration);
