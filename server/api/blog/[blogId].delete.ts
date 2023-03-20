import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

const deleteBlog = async (event: H3Event) => {
  if ((await reqHasScope(event, "create:content")) === true) {
    if (!event.context.params) {
      return "No params given";
    }
    const blogID = parseInt(event.context.params.blogId) as number;
    if (!Number.isInteger(blogID)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Blog ID should be an integer",
      });
    }
    const postDeletion = await prisma.blogPost.delete({
      where: {
        id: blogID,
      },
    });
    console.log(postDeletion);
    return postDeletion;
  } else {
    return;
  }
};

export default defineEventHandler(deleteBlog);
