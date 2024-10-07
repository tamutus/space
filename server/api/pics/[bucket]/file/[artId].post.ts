import { H3Event } from "h3";
import { type GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import { PrismaClient } from "@prisma/client";
import { useGoogleStorage } from "@/utils/googleStorage";
import { reqHasScope } from "@/utils/authUtils";
import {
  bucketScope,
  validBucket,
  validBucketAction,
} from "@/types/googleStorage";

const prisma: PrismaClient = new PrismaClient();

const makeConfig = function (): GetSignedUrlConfig {
  return {
    action: "write",
    expires: Date.now() + 604800,
    version: "v4",
  };
};

// Gets signed file URLs for temporary access to bucket images

const getGoogleURL = async function (event: H3Event): Promise<string | never> {
  const params = event.context.params;
  if (!params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }

  // Validate route ID and bucket

  const artID = parseInt(params.artId) as number;
  if (!Number.isInteger(artID)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Art ID should be an integer",
    });
  }
  const bucketAction = String(params.bucket);
  if (!validBucketAction(bucketAction)) {
    throw createError({
      statusCode: 400,
      statusMessage: "No valid bucket name given",
    });
  }

  const bucketName = bucketAction.replace("upload", "gallery");
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

  if ((await reqHasScope(event, requiredScope)) !== true) {
    throw createError({
      statusCode: 403,
      statusMessage: '"I could not authorize you to post" said the API',
    });
  }
  const existing = await prisma.art.findUnique({
    where: {
      id: artID,
    },
    select: {
      fileName: true,
    },
  });
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: `The database does not seem to have a file with id ${artID}, so the API can't send back a signed URL from google cloud storage.`,
    });
  }

  const runtimeConfig = useRuntimeConfig();

  const storage: Storage = useGoogleStorage(runtimeConfig, bucketAction);

  const artFile = storage.bucket(bucketName).file(existing.fileName);
  const [url] = await artFile.getSignedUrl(makeConfig());
  if (!url) {
    throw createError({
      statusCode: 404,
      statusMessage:
        "Couldn't get a Google Cloud Storage URL to upload the picture to",
    });
  }
  return url;
};

export default defineEventHandler(getGoogleURL);
