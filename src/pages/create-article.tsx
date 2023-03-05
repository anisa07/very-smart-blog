import { api } from "../utils/api";
import type { Article} from "../components/articleForm/ArticleForm";
import { useSession } from "next-auth/react";
import { ManageArticle } from "../components/manageArticle/ManageArticle";
import { Loader } from "../components/loader/Loader";
import { useRouter } from "next/router";

const CreateArticle = () => {
  const router = useRouter();
  const session = useSession();

  const {mutate: createArticle, error: createArticleError, isLoading: creating} = api.example.createArticle.useMutation({
    onSuccess: (data) => {
      console.log('Article created')
      void router.push(`/article/${data}`)
      // queryClient.invalidateQueries({ queryKey: ['posts', id, 'comments'] })
    }
  })
  const handleCreateNewArticle = (data: Article) => {
      createArticle({
        title: data.title,
        img: data.img || '',
        shortText: data.shortText,
        text: data.text,
        authorId: session.data?.user.id as string
      })
  }

  return <div className="py-5 md:py-15 w-11/12 md:w-10/12 lg:w-7/12 mx-auto">
    <h2 className="text-center text-2xl">Create Article</h2>
    {creating &&
      <div className="flex items-center">
        <h3>Creating article</h3>
        <Loader />
      </div>
    }
    {createArticleError?.message && <h3 className="text-red-500">{createArticleError?.message}</h3>}
    <ManageArticle loading={creating} manageArticle={handleCreateNewArticle} />
  </div>
}

CreateArticle.auth = true

export default CreateArticle;
