import {test, expect} from '@jest/globals';
import type { AppRouter} from "../../root";
import { appRouter } from "../../root";
import {prisma} from "../../../db";
import type { inferProcedureInput } from "@trpc/server";
import { mockDeep } from "jest-mock-extended";
import type { Article, PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";

test("Hello test", async () => {
  const caller = appRouter.createCaller({session: null, prisma})

  type Input = inferProcedureInput<AppRouter["example"]["hello"]>
  const testInput: Input = {
    text: 'Test0'
  };
  const result = await caller.example.hello(testInput);
  expect(result).toStrictEqual({greeting: 'Hello Test0'})
})

test("getArticles test", async () => {
  const prismaMock = mockDeep<PrismaClient>();
  const mockArticles: Article[] = [
    {id: '1', authorId: '1', updatedAt: new Date(), createdAt: new Date(), text: 'Text1', shortText: 'Short Text1', title: 'Title1', img: 'Img1'},
    {id: '2', authorId: '2', updatedAt: new Date(), createdAt: new Date(), text: 'Text2', shortText: 'Short Text2', title: 'Title2', img: 'Img2'}
  ]
  prismaMock.article.findMany.mockResolvedValue(mockArticles)

  const caller = appRouter.createCaller({session: null, prisma: prismaMock})

  type Input = inferProcedureInput<AppRouter["example"]["getArticles"]>
  const testInput: Input = { limit: 5 };
  const result = await caller.example.getArticles(testInput);

  expect(result.articles.length).toBe(mockArticles.length);
})
test("getArticleById test", async () => {
  const prismaMock = mockDeep<PrismaClient>();
  const mockArticle: Article = {id: '1', authorId: '1', updatedAt: new Date(), createdAt: new Date(), text: 'Text1', shortText: 'Short Text1', title: 'Title1', img: 'Img1'};

  prismaMock.article.findFirst.mockResolvedValue(mockArticle)

  const mockSession: Session = {
    expires: new Date().toISOString(),
    user: { id: '1', name: 'Test User'}
  }

  const caller = appRouter.createCaller({session: mockSession, prisma: prismaMock})

  type Input = inferProcedureInput<AppRouter["example"]["getArticleById"]>
  const testInput: Input = { articleId: '1' };
  const result = await caller.example.getArticleById(testInput);

  expect(result).toStrictEqual(mockArticle);
})
