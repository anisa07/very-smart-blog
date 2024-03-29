import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type { Article } from "@prisma/client";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`
      };
    }),

  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: {
          id: input.userId
        }
      });
    }),

  getArticleById: protectedProcedure
    .input(z.object({ articleId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.article.findFirst({
        where: {
          id: input.articleId
        }
      });
    }),

  getArticles: publicProcedure.input(
    z.object({
      limit: z.number(),
      prevCursor: z.string().optional(),
      // cursor is a reference to the last item in the previous batch
      // it's used to fetch the next batch
      cursor: z.string().nullish(),
      skip: z.number().optional()
    })).query(async ({ ctx, input }) => {
    const { limit, cursor, skip, prevCursor } = input;
    const articles: Article[] = await ctx.prisma.article.findMany({
      take: limit + 1,
      skip,
      cursor: cursor ? { id: cursor } : undefined
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (articles.length > limit) {
      const nextItem = articles.pop(); // return the last item from the array
      nextCursor = nextItem?.id;
    }
    return {
      articles,
      nextCursor,
      prevCursor
    };
  }),

  createArticle: protectedProcedure.input(z.object({
    title: z.string(),
    img: z.string(),
    shortText: z.string(),
    text: z.string(),
    authorId: z.string()
  })).mutation(async ({ ctx, input }) => {
    try {
      const newArticle = await ctx.prisma.article.create({ data: input });
      return newArticle.id
    } catch (e: unknown) {
      throw "Error creating article";
    }
  }),

  editArticle: protectedProcedure.input(z.object({
    title: z.string(),
    img: z.string(),
    shortText: z.string(),
    text: z.string(),
    authorId: z.string(),
    id: z.string()
  })).mutation(async ({ ctx, input }) => {
    try {
      const id = input.id;
      await ctx.prisma.article.updateMany({ data: { text: input.text, img: input.img, title: input.title, shortText: input.shortText },
        where: { id, AND: { authorId: input.authorId } } });
    } catch (e: unknown) {
      throw "Error updating article";
    }
  }),

  deleteArticle: protectedProcedure.input(z.object({
    authorId: z.string(),
    id: z.string()
  })).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.article.deleteMany({ where: { id: input.id, AND: { authorId: input.authorId } }})
    } catch (e: unknown) {
      throw "Error deleting article";
    }
  })
});
