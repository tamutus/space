import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

const deleteArt = async (event: H3Event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }

  const artID = parseInt(event.context.params.artId) as number;
  if (!Number.isInteger(artID)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Blog ID should be an integer",
    });
  }
  if ((await reqHasScope(event, "create:content")) !== true) {
    throw createError({
      statusCode: 403,
      statusMessage: "You can't silence me",
    });
  }
  const artDeletion = await prisma.art.delete({
    where: {
      id: artID,
    },
  });
  console.log(artDeletion);
  return artDeletion;
};

export default defineEventHandler(deleteArt);
