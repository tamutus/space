import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { ArtWithTags } from "@/types/models";
import {
  GetSignedUrlConfig,
  GetSignedUrlResponse,
} from "@google-cloud/storage";

import { useGoogleStorage } from "@/utils/googleStorage";
import { bucketScope, validBucket } from "@/types/googleStorage";
import { reqHasScope } from "@/utils/authUtils";

const makeConfig = function (): GetSignedUrlConfig {
  return {
    action: "read",
    expires: Date.now() + 604800,
    version: "v4",
  };
};

const prisma: PrismaClient = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }
  // arChar
  // id
  // createdAt
  // updatedAt
  // bucket
  // fileName
  // title
  // info
  // published
  // tags
  const bucketName: string = event.context.params.bucket;
  if (!validBucket(bucketName)) {
    throw createError({
      statusCode: 400,
      statusMessage: "No valid bucket name given",
    });
  }
  const requestedTitle: string = event.context.params.title;
  if (!requestedTitle) {
    throw createError({
      statusCode: 400,
      statusMessage: "No artwork title given",
    });
  }
  const requiredScope = bucketScope(bucketName);
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
        "You aren't authorized to view these images. Log in with Auth0 at the bottom right of the screen.",
    });
  }

  const givenTitle = decodeURIComponent(event.context.params.title).replaceAll(
    "_",
    " "
  );
  console.log(givenTitle);

  const metadata: ArtWithTags | null = await prisma.art.findFirst({
    where: {
      title: givenTitle,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
  if (!metadata) {
    throw createError({
      statusCode: 404,
      statusMessage: "No artwork in that bucket found with that title",
    });
  }
  if (
    !metadata?.published &&
    (await reqHasScope(event, "create:content")) !== true
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: "No artwork in that bucket found with that title",
    });
  }

  const runtimeConfig = useRuntimeConfig();
  const storage = useGoogleStorage(runtimeConfig, bucketName);

  const [signedURL]: GetSignedUrlResponse = await storage
    .bucket(bucketName)
    .file(metadata.fileName)
    .getSignedUrl(makeConfig());
  metadata.url = signedURL;
  return metadata;
});
