import { H3Event } from "h3";
import { Prisma, PrismaClient } from "@prisma/client";
import { reqUserPayload } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  const lode = await reqUserPayload(event);
  console.log(lode);
  return lode;
});
