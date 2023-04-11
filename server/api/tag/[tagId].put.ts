import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

type TagUpdate = {
  name?: string;
  info?: string;
  nsfw?: boolean;
};
const putTag = async function (event: H3Event) {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }
  const id = event.context.params.tagId;
  if (!/\d/.test(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Non-integer id provided to [tagId].put",
    });
  }
  const body = await readBody(event),
    tag = body?.tag;
  if (!tag) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Make sure the body of your request has a tag property. The API didn't get it.",
    });
  }
  if (!(await reqHasScope(event, "create:content"))) {
    throw createError({
      statusCode: 400,
      statusMessage: "You aren't able to edit tag descriptions",
    });
  }
  const tagUpdate: TagUpdate = {
    info: tag.info,
  };
  if (tag.name) {
    tagUpdate.name = tag.name;
  }
  if (tag.nsfw === false) {
    tagUpdate.nsfw = false;
  }
  if (tag.nsfw === true) {
    tagUpdate.nsfw = true;
  }
  return await prisma.tag.update({
    where: {
      id: Number(id),
    },
    data: {
      ...tagUpdate,
    },
  });
};

export default defineEventHandler(putTag);
