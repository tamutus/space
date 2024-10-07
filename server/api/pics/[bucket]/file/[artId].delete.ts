import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import type { GetSignedUrlConfig } from "@google-cloud/storage";

import { reqHasScope } from "@/utils/authUtils";
import { useGoogleStorage } from "@/utils/googleStorage";
import {
  bucketScope,
  validBucketAction,
  type BucketAction,
} from "@/types/googleStorage";

const prisma: PrismaClient = new PrismaClient();

const makeConfig = function (): GetSignedUrlConfig {
  return {
    action: "delete",
    expires: Date.now() + 604800,
    version: "v4",
  };
};

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
  const bucketAction: string = event.context.params.bucket,
    bucketName =
      bucketAction === "homepage-upload"
        ? "homepage-gallery"
        : bucketAction === "adult-upload"
        ? "adult-gallery"
        : null;

  if (!bucketName || !validBucketAction(bucketAction)) {
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

  if ((await reqHasScope(event, requiredScope)) !== true) {
    throw createError({
      statusCode: 403,
      statusMessage:
        "You aren't authorized to delete images. If you're Lavra, log in with Auth0 at the bottom right of the screen.",
    });
  }

  const artMeta = await prisma.art.findUnique({
    where: {
      id: artID,
    },
  });
  if (!artMeta || !artMeta.fileName) {
    throw createError({
      statusCode: 404,
      statusMessage: "Prisma could not find the art in question to delete.",
    });
  }

  const runtimeConfig = useRuntimeConfig();
  const storage = useGoogleStorage(runtimeConfig, bucketAction);

  const [deletionResult] = await storage
    .bucket(bucketName)
    .file(artMeta.fileName)
    .delete()
    .catch((err) => {
      console.log(err);
      throw createError({
        statusCode: 404,
        statusMessage: "Could not delete art from Google Storage",
        data: err,
      });
    });
  const artDeletion = await prisma.art.delete({
    where: {
      id: artID,
    },
  });
  return artDeletion;
};

export default defineEventHandler(deleteArt);
