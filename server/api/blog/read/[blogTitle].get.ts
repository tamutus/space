import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";
import { BlogPostWithTags } from "@/types/models";

const prisma: PrismaClient = new PrismaClient();
const getBlogPostsWithTags = async function (event: H3Event) {
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
      return "Unauthorized";
    }
  }
  return blogPost;
};

export default defineEventHandler(getBlogPostsWithTags);
