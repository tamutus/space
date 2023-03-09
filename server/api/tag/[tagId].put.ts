import { H3Event } from "h3";
import { Prisma, PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

type TagUpdate = {
  name?: string;
  info?: string;
};
const putTag = async function (event: H3Event) {
  const id = event.context.params.tagId;
  if (/\d/.test(id)) {
    const body = await readBody(event),
      tag = body.tag;
    if (await reqHasScope(event, "create:content")) {
      const tagUpdate: TagUpdate = {
        info: tag.info,
      };
      if (tag.name) {
        tagUpdate.name = tag.name;
      }
      return await prisma.tag.update({
        where: {
          id: Number(id),
        },
        data: {
          ...tagUpdate,
        },
      });
    }

    return "You aren't able to edit tag descriptions";
  }
  return "Non-integer id provided to [tagId].put";
};

export default defineEventHandler(putTag);
