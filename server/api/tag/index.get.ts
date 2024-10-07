import { H3Event } from "h3";
import { Prisma, PrismaClient } from "@prisma/client";
import { type Tag } from ".prisma/client";
import { reqHasScope } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  const adult = await reqHasScope(event, "access:adult");
  const queryOptions: Prisma.TagFindManyArgs = {
    select: {
      id: true,
      name: true,
      nsfw: true,
    },
    orderBy: [{ name: "asc" }],
  };
  if (adult !== true) {
    queryOptions.where = { nsfw: false };
  }
  const tags = await prisma.tag.findMany(queryOptions);
  if (!tags) {
    throw createError({
      statusCode: 404,
      statusMessage: "Couldn't find tags",
    });
  }
  return tags.map((tag: Tag) => {
    return {
      ...tag,
      info: null,
    } as Tag;
  });
});
