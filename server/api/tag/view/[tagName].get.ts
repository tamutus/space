import { H3Event } from "h3";
import { Prisma, PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

export default defineEventHandler(async function (event: H3Event) {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }
  const adult = reqHasScope(event, "access:adult");
  const tag = await prisma.tag.findUnique({
    where: {
      name: event.context.params.tagName,
    },
  });
  if (!tag) {
    throw createError({
      statusCode: 404,
      statusMessage: "No tag with that name found",
    });
  }
  if ((await adult) !== true && tag.nsfw === true) {
    throw createError({
      statusCode: 403,
      statusMessage:
        "This is only for adults who've logged in to confirm their age",
    });
  }
  return tag;
});
