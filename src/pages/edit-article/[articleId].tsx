import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import type { Article } from "../../components/articleForm/ArticleForm";
import { ManageArticle } from "../../components/manageArticle/ManageArticle";
import { useRouter } from "next/router";
import { useState } from "react";
import { Loader } from "../../components/loader/Loader";

const EditArticle = () => {
  const [opacityClassName, setOpacityClassName] = useState("opacity-0");
  const [deleteArticleStarted, setDeleteArticleStarted] = useState(false);
  const utils = api.useContext();
  const { query, push } = useRouter();
  const { data: sessionData } = useSession();

  const { data: article, isLoading } = api.example.getArticleById.useQuery({
    articleId: query.articleId as string
  }, { queryKey: ["example.getArticleById", { articleId: query.articleId as string }] });

  const { mutate: editArticle, error: editArticleError, isLoading: editing } = api.example.editArticle.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      console.log("Article updated");
    }
  });

  const {
    mutate: deleteArticle,
    error: deleteArticleError,
    isLoading: deleting
  } = api.example.deleteArticle.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      await push("/blog");
      console.log("Article deleted");
    }
  });
  const handleCreateNewArticle = (data: Article) => {
    if (article) {
      editArticle({
        id: article.id,
        title: data.title,
        img: data.img || "",
        shortText: data.shortText,
        text: data.text,
        authorId: sessionData?.user.id as string
      });
    }
  };

  const toggleDeleteState = () => {
    setOpacityClassName(`${!deleteArticleStarted ? "animate-appear" : "animate-disappear"}`);
    setDeleteArticleStarted(!deleteArticleStarted);
  };

  const handleDeleteArticle = () => {
    if (article) {
      deleteArticle({ id: article.id, authorId: sessionData?.user.id as string });
    }
  };

  return <div className="py-5 md:py-15 w-11/12 md:w-10/12 lg:w-7/12 mx-auto">
    <div className="flex justify-center items-center">
      <h2 className="text-center text-2xl mr-3">Edit Article</h2>
      <button
        className="p-1.5 font-bold text-white bg-red-500 rounded hover:bg-red-200 focus:outline-none disabled:bg-gray-500 focus:shadow-outline self-center"
        disabled={editing || isLoading || deleteArticleStarted || deleting}
        onClick={toggleDeleteState}> Delete
      </button>
    </div>

    <div className={`flex justify-center items-center my-2 ${opacityClassName}`}>
      <p className="mr-3">This article will be deleted. Continue?</p>
      <button className="mr-3 border-b-2 border-b-red-500" onClick={handleDeleteArticle}>Yes</button>
      <button className="border-b-2 border-b-blue-500" onClick={toggleDeleteState}>No</button>
    </div>

    <div className={`${!deleteArticleStarted ? "animate-appear" : "animate-disappear"}`}>
      {editing &&
        <div className="flex items-center">
          <h3>Edit article</h3>
          <Loader />
        </div>}

      {editArticleError?.message && <h3 className="text-red-500">{editArticleError?.message}</h3>}
      {article ?
        <ManageArticle loading={editing || isLoading || deleteArticleStarted || deleting}
                       manageArticle={handleCreateNewArticle} articleToEdit={article} /> :
        <h3>Article not found</h3>}
    </div>
  </div>;
};

EditArticle.auth = true;

export default EditArticle;
