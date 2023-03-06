import type { Prompt } from "../components/promptForm/PromptForm";
import { useState } from "react";
import type { Article } from "../components/articleForm/ArticleForm";

const fetchGeneratedArticle = async (prompt: string) => {
  try {
    const response  = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt
      })
    })
    return response.body;
  } catch (e: unknown) {
    throw "Error generating article"
  }
}
export const useGenerate = () => {
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [generatedData, setGenerationData] = useState<Article>({title: '', text: '', shortText: '', img: ''});

  const onGenerate = async (data: Prompt) => {
    setGenerationError('');
    setGenerating(true);
    setTopic(data.prompt);
    const text = await callGenerateApi(`generate an article about ${data.prompt}`) || '';
    const description = await callGenerateApi(`generate a description of an article about ${data.prompt}`) || '';
    const title = await callGenerateApi(`generate a title for an article about ${data.prompt}`) || '';
    setGenerating(false);
    setTopic("");
    setGenerationData({ text: text.trim(), shortText: description.trim(), title: title.replace(/"/g, ''), img: ''} )
  };

  const callGenerateApi = async (prompt: string) => {
    try {
      let generated = "";
      const data = await fetchGeneratedArticle(prompt);
      if (!data) {
        setGenerationError('Cannot generate data')
        return '';
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        generated += chunkValue;
      }
      return generated;
    } catch (e: unknown) {
      if (typeof e === "string") {
        setGenerationError(e)
      }
    }
  };

  return {
    topic, generationError, generating, onGenerate, generatedData,
  }
};
