import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export default defineEventHandler(async function (event: H3Event) {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }
  return await prisma.tag.findUnique({
    where: {
      name: String(event.context.params.tagName),
    },
  });
});
