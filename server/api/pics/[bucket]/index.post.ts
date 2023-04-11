import { H3Event } from "h3";
import {
  GetSignedUrlConfig,
  GetSignedUrlResponse,
  Storage,
} from "@google-cloud/storage";
import { Prisma, PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";
import { useGoogleStorage } from "@/utils/googleStorage";
import {
  bucketScope,
  validBucket,
  validBucketAction,
} from "@/types/googleStorage";
import { NewArt, TagAddQuery } from "@/types/models";

const prisma: PrismaClient = new PrismaClient();

const makeConfig = function (): GetSignedUrlConfig {
  return {
    action: "write",
    expires: Date.now() + 604800,
    version: "v4",
  };
};

// Prisma logic may need to be called again, so it needs to be a named function.
const postToDB = async function (
  art: Prisma.ArtCreateInput,
  prismaClient: PrismaClient
) {
  const creation = await prisma.art
    .create({
      data: {
        bucket: art.bucket,
        fileName: art.fileName,
        title: art.title,
        info: art.info,
        tags: art.tags,
      },
    })
    .catch(async (e: any) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          return postToDB(art, prismaClient);
        }
      } else {
        await prisma.$disconnect();
        throw createError({
          statusCode: 502,
          statusMessage: "Prisma faced an error when updating art.",
          data: e,
        });
      }
    });
  if (creation) {
    return true;
  }
  return false;
};

const postArt = async function (event: H3Event) {
  const params = event.context.params;
  if (!params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }
  const bucketAction: string = params.bucket,
    bucketName =
      bucketAction === "homepage-upload"
        ? "homepage-gallery"
        : bucketAction === "adult-upload"
        ? "adult-gallery"
        : null;

  if (!validBucketAction(bucketAction)) {
    throw createError({
      statusCode: 400,
      statusMessage: "No valid bucket name given",
    });
  }
  if (!validBucket(bucketName)) {
    throw createError({
      statusCode: 400,
      statusMessage: "No valid bucket name given",
    });
  }

  const requiredScope = bucketScope(bucketName);
  if (!requiredScope) {
    throw createError({
      statusCode: 400,
      statusMessage: "Couldn't determine proper scope for the provided bucket.",
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
  if (!body.art.title) {
    throw createError({
      statusCode: 400,
      statusMessage: "Each piece of art needs a title",
    });
  }
  if (!Array.isArray(body.art.tags)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Tags must be an array of strings",
    });
  }

  const art: NewArt = {
    ...body.art,
    tags: body.art.tags.reduce((tagArr: Array<string>, name: any) => {
      if (typeof name === "string") {
        tagArr.push(name.toLowerCase());
      }
      return tagArr;
    }, []),
  };

  if ((await reqHasScope(event, requiredScope)) !== true) {
    throw createError({
      statusCode: 403,
      statusMessage: '"I could not authorize you to post" said the API',
    });
  }
  const existing = await prisma.art.findFirst({
    where: {
      title: art.title,
      bucket: bucketName,
    },
  });
  if (existing) {
    throw createError({
      statusCode: 403,
      statusMessage: `The ${bucketName} bucket already has a file titled ${art.title}. Please rename it, or edit the previously created artwork.`,
    });
  }
  const tagAddQueries = art.tags
    .map((name: string) => name.toLowerCase())
    .reduce((tagQueries: TagAddQuery[], tagName: any) => {
      if (typeof tagName === "string" && tagName.length > 0) {
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
    }, []);
  const runtimeConfig = useRuntimeConfig();

  const storage: Storage = useGoogleStorage(runtimeConfig, bucketAction);
  const artFile = storage.bucket(bucketName).file(body.art.title);
  const [url]: GetSignedUrlResponse = await artFile.getSignedUrl(makeConfig());
  if (!url) {
    throw createError({
      statusCode: 404,
      statusMessage:
        "Couldn't get a Google Cloud Storage URL to upload the picture to",
    });
  }
  const postResult = await postToDB(
    {
      bucket: bucketName,
      fileName: artFile.name,
      title: art.title,
      info: art.info,
      tags: {
        create: tagAddQueries,
      },
    },
    prisma
  );
  if (postResult === true) {
    return url;
  } else {
    throw createError({
      statusCode: 502,
      statusMessage: "Could not create the art for some reason.",
    });
  }
};
// Gets signed file URLs for temporary access to bucket images
export default defineEventHandler(postArt);
