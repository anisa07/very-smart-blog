import type { Prompt } from "../promptForm/PromptForm";
import { PromptForm } from "../promptForm/PromptForm";
import type { Article } from "../articleForm/ArticleForm";
import { ArticleForm } from "../articleForm/ArticleForm";
import type { FC } from "react";
import { useState } from "react";
import { api } from "../../utils/api";
import { Loader } from "../loader/Loader";

interface ManageArticle {
  loading: boolean,
  manageArticle: (data: Article) => void,
  articleToEdit?: Article

}

export const ManageArticle: FC<ManageArticle> = ({ loading, manageArticle, articleToEdit }) => {
  const [topic, setTopic] = useState("");
  const { data: generatedArticle, fetchStatus: generatingStatus, error: generationError } =
    api.example.generateArticle.useQuery({ prompt: topic }, {
      enabled: !!topic, onSuccess: () => {
        setTopic("");
      }
    });

  const handleGenerate = (data: Prompt) => {
    setTopic(data.prompt);
  };

  const currentArticle = {
    title: generatedArticle?.title || articleToEdit?.title || "",
    img: articleToEdit?.img || "",
    text: generatedArticle?.text || articleToEdit?.text || "",
    shortText: generatedArticle?.shortText || articleToEdit?.shortText || ""
  };

  console.log(generationError)
  return <>
    {generatingStatus === "fetching" &&
      <div className="flex items-center">
        <h3>{`Generating article about ${topic}, please wait`}</h3>
        <Loader />
      </div>
    }
    {generationError?.message && <h3 className="text-red-500">{generationError?.message}</h3>}
    <PromptForm onSend={handleGenerate} loading={generatingStatus === "fetching" || loading} currentTopic={topic} />
    <ArticleForm onSend={manageArticle} loading={generatingStatus === "fetching" || loading}
                 currentArticle={currentArticle} />
  </>;
};
