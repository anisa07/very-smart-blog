import { useRouter } from "next/router";
import { api } from "../../utils/api";
import Image from "next/image";
import { Author } from "../../components/author/Author";

const ArticleId = () => {
  const { query } = useRouter();
  const { data: article, isLoading } = api.example.getArticleById.useQuery({
    articleId: query.articleId as string
  })

  if (!isLoading && !article) return <div className="py-5 md:py-15 w-11/12 md:w-10/12 lg:w-7/12 mx-auto text-3xl">Article Not Found</div>

  return <div className="py-5 md:py-15 w-11/12 md:w-10/12 lg:w-7/12 mx-auto animate-appear">
    {article?.img ? <Image src={article?.img} alt={"list-image"} width="700" height="0" className="mx-auto mb-5" /> : <></>}
    <div className="text-3xl text-center mb-5">{article?.title}</div>
    <div className="text-sm text-justify text-gray-500 indent-10 mb-3">{article?.shortText}</div>
    { article ? <Author authorId={article.authorId} articleId={article.id} updatedAt={article.updatedAt} /> : <></>}
    <div className="text text-justify mb-3 indent-10" dangerouslySetInnerHTML={{ __html: article?.text || '' }}></div>
  </div>
}

ArticleId.auth = true

export default ArticleId;
