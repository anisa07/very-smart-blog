import type { Prompt } from "../promptForm/PromptForm";
import { PromptForm } from "../promptForm/PromptForm";
import type { Article } from "../articleForm/ArticleForm";
import { ArticleForm } from "../articleForm/ArticleForm";
import type { FC } from "react";
import { Loader } from "../loader/Loader";
import { useGenerate } from "../../hooks/useGenerate";

interface ManageArticle {
  loading: boolean,
  manageArticle: (data: Article) => void,
  articleToEdit?: Article

}

export const ManageArticle: FC<ManageArticle> = ({ loading, manageArticle, articleToEdit }) => {
  const { generating, generationError, onGenerate, topic, generatedData} = useGenerate();

  const currentArticle = {
    title: generatedData.title || articleToEdit?.title || '',
    img:  generatedData.img || articleToEdit?.img || '',
    text: generatedData.text || articleToEdit?.text || '',
    shortText: generatedData.shortText || articleToEdit?.shortText || ''
  };

  const handleGenerate = async (prompt: Prompt) => {
    await onGenerate(prompt);
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
