import type { FC} from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubmitButton } from "../submitButton/SubmitButton";
import { FormInput } from "../formInput/FormInput";
import { FormText } from "../formText/FormText";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";

const articleSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  shortText: z.string().min(10, { message: "Description is required" }),
  text: z.string().min(100, { message: "Text is required" }),
  img: z.string().min(2, { message: "Image is required" }),
});

export type Article = z.infer<typeof articleSchema>;

interface ArticleForm {
  loading: boolean,
  currentArticle: Article,
  onSend: (aricle: Article) => void
}
export const ArticleForm: FC<ArticleForm> = ({onSend, loading, currentArticle}) => {
  const initRef = useRef('');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Article>({
    mode: "onBlur",
    resolver: zodResolver(articleSchema),
    defaultValues: {
      text: currentArticle.text || '',
      title: currentArticle.title || '',
      img: currentArticle.img || '',
      shortText: currentArticle.shortText || ''
    }
  });

  useEffect(() => {
    if (initRef) {
      currentArticle.text && setValue('text', currentArticle.text)
      currentArticle.title && setValue('title', currentArticle.title)
      currentArticle.img && setValue('img', currentArticle.img)
      currentArticle.shortText && setValue('shortText', currentArticle.shortText)
    }
    initRef.current = "rendered"
  }, [currentArticle])

  const onSubmit: SubmitHandler<Article> = (data) => {
    onSend(data);
    reset();
  };

  return <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
    <FormInput placeholder="Write title of your article here e.g. A spaceship" name="title" error={errors.title?.message} label="Title" register={register} />
    <FormInput placeholder="Put image url here e.g. from https://images.unsplash.com/photo-..." name="img" error={errors.img?.message} label="Image" register={register} />
    <FormInput placeholder="Write a short description of your article" name="shortText" error={errors.shortText?.message} label="Description" register={register} />
    <FormText placeholder="Write your article text here" name="text" error={errors.text?.message} label="Text" register={register} />

    <SubmitButton disabled={loading} label="Submit" />
  </form>
}
