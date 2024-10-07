import { H3Event } from "h3";
import { Prisma, PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";
import type {
  ArtWithTags,
  UpdateArt,
  TagAddQuery,
  TagRemoveQuery,
} from "@/types/models";
import { bucketScope } from "@/types/googleStorage";

// Instantiating outside event handler lets you use it multiple times while the serverless function is warm
const prisma: PrismaClient = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }
  // Validate route ID and bucket

  const artID = parseInt(event.context.params.artId) as number;
  if (!Number.isInteger(artID)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Art ID should be an integer",
    });
  }

  const bucketAction: string = event.context.params.bucket,
    bucketName =
      bucketAction === "homepage-upload"
        ? "homepage-gallery"
        : bucketAction === "adult-upload"
        ? "adult-gallery"
        : null;

  if (!bucketName) {
    throw createError({
      statusCode: 400,
      statusMessage: "No proper bucket name given",
    });
  }

  const requiredScope = bucketScope(bucketAction);
  if (!requiredScope) {
    throw createError({
      statusCode: 401,
      statusMessage:
        "Couldn't determine what permissions the provided bucket requires, so you couldn't be authorized.",
    });
  }

  // Verify body contents
  const body = await readBody(event);
  if (!body.art) {
    throw createError({
      statusCode: 400,
      statusMessage: "No art information was provided",
    });
  }
  if (!Array.isArray(body.art.tags)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Tags must be an array of strings",
    });
  }
  const art: UpdateArt = {
    id: artID,
    title: body.art.title,
    info: body.art.info || null,
    published: body.art.published,
    tags: body.art.tags.reduce((tagArr: Array<string>, name: any) => {
      if (typeof name === "string") {
        tagArr.push(name.toLowerCase());
      }
      return tagArr;
    }, []),
  };
  if (!art.title) {
    throw createError({
      statusCode: 400,
      statusMessage: "Each piece of art needs a title",
    });
  }

  // Check for Lavra
  if ((await reqHasScope(event, "create:content")) !== true) {
    throw createError({
      statusCode: 403,
      statusMessage: "This is Lavra's gallery, not yours",
    });
  }

  // Query pre-existing version to determine which tags in the update are additions/removals
  const oldVersion = await prisma.art.findUnique({
    where: {
      id: artID,
    },
    select: {
      published: true,
      tags: {
        include: {
          tag: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
  if (!oldVersion) {
    throw createError({
      statusCode: 404,
      statusMessage: "API received a put request using an incorrect art ID",
    });
  }

  if (art.published === undefined) {
    art.published = oldVersion.published;
  }
  const tagAddQueries = art.tags.reduce(
    (tagQueries: TagAddQuery[], tagName: string) => {
      if (typeof tagName === "string" && tagName.length > 0) {
        if (!oldVersion.tags.find((tagJoin) => tagJoin.tag.name === tagName))
          tagQueries.push({
            tag: {
              connectOrCreate: {
                create: {
                  name: tagName,
                },
                where: {
                  name: tagName,
                },
              },
            },
          });
      }
      return tagQueries;
    },
    []
  );

  const tagRemoveQueries = oldVersion.tags.reduce(
    (tagQueries: TagRemoveQuery[], tag) => {
      if (!art.tags.includes(tag.tag.name)) {
        tagQueries.push({
          artId_tagId: {
            artId: artID,
            tagId: tag.tag.id,
          },
        });
      }
      return tagQueries;
    },
    []
  );
  const creation = {
    ...art,
    tags: {
      create: tagAddQueries,
      delete: tagRemoveQueries,
    },
  };
  const artResponse = await putArt(creation);
  return artResponse;
});

// Logic may need to be called again, so it needs to be a named function.

async function putArt(
  art: Prisma.ArtUncheckedUpdateInput
): Promise<ArtWithTags | never> {
  const updatedArt = await prisma.art
    .update({
      where: {
        id: Number(art.id),
      },
      data: art,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
    .catch(async (e: any) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          return await putArt(art);
        }
      } else {
        console.error(e);
        await prisma.$disconnect();
        throw createError({
          statusCode: 502,
          statusMessage: "Prisma faced an error when updating art.",
          data: e,
        });
      }
    });
  if (!updatedArt) {
    throw createError({
      statusCode: 404,
      statusMessage: `No art with ID of ${art.id}`,
    });
  }
  return updatedArt as ArtWithTags;
}
