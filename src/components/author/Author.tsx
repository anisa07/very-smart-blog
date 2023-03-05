import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";

interface Author {
  updatedAt: Date,
  articleId: string,
  authorId: string,
}
export const Author: FC<Author> = ({ updatedAt, articleId, authorId, }) => {
  const { data: sessionData } = useSession();

  const { data: user } = api.example.getUserById.useQuery({
    userId: authorId
  }, { enabled: !!articleId})

  return (
    <div className="flex items-center justify-center mb-3">
      {user?.image ? <Image src={user?.image} alt={"user-image"} width="35" height="0" className="rounded-full" /> : <></>}
      <div className="ml-3">
        <p>Name {user?.name}</p>
        <p className="mb-3 text-gray-400 text-sm">Updated {(new Date(updatedAt || '')).toDateString()}</p>
        {sessionData?.user.id === user?.id && <Link href={`/edit-article/${articleId}`} className="text-sm bg-blue-700 text-white p-2 rounded">Edit Article</Link>}
      </div>
    </div>
  )
}
