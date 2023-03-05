import { type NextPage } from "next";
import { api } from "../utils/api";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

export interface ArticleEntity {
  id: string,
  img: string,
  updatedAt: Date,
  text: string,
  title: string,
  shortText: string,
  authorId: string
}

export interface ArticleType {
  article: ArticleEntity
}

export const ArticleOnDarkBack:FC<ArticleType> = ({ article }) => {
  return (
    <Link href={`/article/${article.id}`}>
      <div className="flex flex-row-reverse md:flex-row mb-10 items-start animate-appear">
        {article?.img ? <Image src={article.img} alt={"list-image"} width="100" height="50" className="mb-3 flex-1" /> : <></>}
        <div className="ml-0 md:ml-3 flex-1">
          <p className="mb-3 text-gray-400 text-sm">{(new Date(article.updatedAt)).toDateString()}</p>
          <h3 className="text-lg mb-2 ">{article.title}</h3>
          {/*<p className="text-justify text-gray-400">{article?.shortText}</p>*/}
        </div>
      </div>
    </Link>
  );
};

export const ArticleOnLightBack:FC<ArticleType> = ({ article }) => {
  return (
    <Link href={`/article/${article.id}`}>
      <div className="flex flex-col mb-10 items-start overflow-hidden animate-appear">
        {article?.img ? <Image src={article?.img} alt={"list-image"} width="300" height="100" className="mb-3 flex-1" /> : <></>}
        <div className="flex-1">
          <p className="mb-3 text-gray-400 text-sm">{(new Date(article.updatedAt)).toDateString()}</p>
          <h3 className="text-lg mb-2 ">{article?.title}</h3>
          <p className="hidden md:block text-justify text-gray-500 h-24">{article?.shortText}</p>
        </div>
      </div>
    </Link>
  );
};

const Home: NextPage = () => {
  const { data } = api.example.getArticles.useInfiniteQuery({
      limit: 8,
    });

  const articlesList: ArticleEntity[] = data?.pages[0]?.articles || [];

  return (
    <div>
      <h1 className="text-5xl md:text-9xl font-extrabold tracking-widest px-10 pb-7 text-white bg-[#15162c]">THE
        BLOG</h1>
      <div className="flex min-h-fit flex-col md:flex-row px-10 text-white bg-[#15162c] pb-10">
          <div className="flex-1 pr-0 md:pr-5 mb-10 md:mb-0 animate-appear">
            {articlesList[0] ? <Link href={`/article/${articlesList[0]?.id}`}>
              <>
              {articlesList[0].img ? <Image src={articlesList[0]?.img} alt={"list-image"} width="700" height="300" className="mb-3" /> : <></>}
                <p className="mb-3 text-gray-400 text-sm">{(new Date(articlesList[0]?.updatedAt)).toDateString()}</p>
                <h3 className="text-3xl mb-2">{articlesList[0]?.title}</h3>
                <p className="text-justify text-gray-400">{articlesList[0]?.shortText}</p>
              </>
            </Link> : <></>}
          </div>
        <div className="flex-1 pl-0 md:pl-5">
          {articlesList.slice(1, 4).map(article => <ArticleOnDarkBack key={article.id} article={article} />)}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-10">
        {articlesList.slice(4).map(article => <ArticleOnLightBack key={article.id} article={article} />)}
      </div>
    </div>
  );
};
// text-white bg-[#15162c]
export default Home;
