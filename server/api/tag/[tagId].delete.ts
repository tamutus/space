import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

export default defineEventHandler(async function (event: H3Event) {
  if ((await reqHasScope(event, "create:content")) !== true) {
    throw createError({
      statusCode: 403,
      statusMessage: "You can't silence me",
    });
  }
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }
  const tagId = parseInt(event.context.params.tagId) as number;
  if (!Number.isInteger(tagId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Non-integer id provided to [tagId].delete",
    });
  }
  const tagDeletion = await prisma.tag.delete({
    where: {
      id: tagId,
    },
  });
  console.log(tagDeletion);
  return tagDeletion;
});
