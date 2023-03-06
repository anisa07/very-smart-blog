import type { Prompt } from "../promptForm/PromptForm";
import { PromptForm } from "../promptForm/PromptForm";
import type { Article } from "../articleForm/ArticleForm";
import { ArticleForm } from "../articleForm/ArticleForm";
import type { FC } from "react";
import { useState } from "react";
import { api } from "../../utils/api";
import { Loader } from "../loader/Loader";
import { useGenerate } from "../../hooks/useGenerate";

interface ManageArticle {
  loading: boolean,
  manageArticle: (data: Article) => void,
  articleToEdit?: Article

}

export const ManageArticle: FC<ManageArticle> = ({ loading, manageArticle, articleToEdit }) => {
  const { generating, generationError, onGenerate, topic, generatedData} = useGenerate();
  // const { data: generatedArticle, fetchStatus: generatingStatus, error: generationError } =
  //   api.example.generateArticle.useQuery({ prompt: topic }, {
  //     enabled: !!topic, onSuccess: () => {
  //       setTopic("");
  //     }
  //   });

  const currentArticle = {
    title: articleToEdit?.title || generatedData.title,
    img: articleToEdit?.img || generatedData.img,
    text: articleToEdit?.text || generatedData.text,
    shortText: articleToEdit?.shortText || generatedData.shortText
  };

  const handleGenerate = async (prompt: Prompt) => {
    const data = await onGenerate(prompt);
    // currentArticle.title = data.title;
    // currentArticle.text = data.text;
    // currentArticle.shortText = data.description;
  }

  return <>
    {generating &&
      <div className="flex items-center">
        <h3>{`Generating article about "${topic}", please wait`}</h3>
        <Loader />
      </div>
    }
    {generationError && <h3 className="text-red-500">{generationError}</h3>}
    <PromptForm onSend={handleGenerate} loading={generating || loading} />
    <ArticleForm onSend={manageArticle} loading={generating || loading}
                 currentArticle={currentArticle} />
  </>;
};
