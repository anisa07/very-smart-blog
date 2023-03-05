import { api } from "../utils/api";
import { useState } from "react";
import { Author } from "../components/author/Author";
import Image from "next/image";
import Link from "next/link";

const Blog = () => {
  const [page, setPage] = useState(0);
  // TODO implement consistent pagination
  const {
    data,
    hasNextPage,
    fetchNextPage,
  } = api.example.getArticles.useInfiniteQuery({
      limit: 10,
    },
    {
      getNextPageParam: (firstPage) => {
        return firstPage.nextCursor;
      },
    }
  );

  const handleLoadNextData = async () => {
    const newPage = page + 1;
    setPage(newPage);
    const pagesLength = data?.pages?.length;
    if (pagesLength !== undefined && pagesLength <= newPage) {
      await fetchNextPage()
    }
  };

  const handleLoadPrevData = () => {
    const newPage = page - 1;
    setPage(newPage);
  };

  return <div className="py-5 md:py-15 w-11/12 md:w-10/12 lg:w-7/12 mx-auto">
    <h2 className="text-center text-2xl">Articles</h2>

    { data?.pages[page] !== undefined ? <>
      {data.pages[page]?.articles.map((article) => (
        <div key={article.id} className="mb-5 text-ellipsis overflow-hidden animate-appear">
          <div className="flex">
            <Author authorId={article.authorId} articleId={article.id} updatedAt={article.updatedAt} />
          </div>

          <Link href={`/article/${article.id}`} key={article.id}>
            <div className="flex flex-col-reverse md:flex-row mb-10">
              <div className="mr-3">
                <h3 className="text-lg mb-2 ">{article.title}</h3>
                <p className="hidden md:block text-justify text-gray-500 h-24">{article?.shortText}</p>
              </div>
              <Image src={article?.img} alt={"list-image"} width="300" height="100" className="mb-3" />
            </div>
          </Link>
        </div>
      ))}

      <div className="flex justify-center my-5">
        <button
          className="px-4 py-2 font-bold text-white bg-blue-700 rounded hover:bg-blue-500 focus:outline-none disabled:bg-gray-500 focus:shadow-outline mr-2"
          disabled={page === 0}
          onClick={handleLoadPrevData}
        >
          Previous page
        </button>

        <button
          className="px-4 py-2 font-bold text-white bg-blue-700 rounded hover:bg-blue-500 focus:outline-none disabled:bg-gray-500 focus:shadow-outline"
          disabled={!hasNextPage && page >= data.pages.length - 1}
          onClick={handleLoadNextData}
        >
          Next page
        </button>
      </div>
    </> : <></>}
  </div>;
};

export default Blog;
