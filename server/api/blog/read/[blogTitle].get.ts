import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";
import { type BlogPostWithTags } from "@/types/models";

const prisma: PrismaClient = new PrismaClient();
const getBlogPostsWithTags = async function (event: H3Event) {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }
  const blogPost: BlogPostWithTags | null = await prisma.blogPost.findFirst({
    where: {
      title: decodeURIComponent(
        event.context.params.blogTitle.replaceAll("_", " ")
      ),
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
  if (!blogPost?.published) {
    if (!(await reqHasScope(event, "create:content"))) {
      throw createError({
        statusCode: 404,
        statusMessage: "Could not find content",
      });
    }
  }
  if (!blogPost) {
    throw createError({
      statusCode: 401,
      statusMessage: "Could not find content",
    });
  }
  return blogPost;
};

export default defineEventHandler(getBlogPostsWithTags);
