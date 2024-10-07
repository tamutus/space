import { H3Event } from "h3";
import {
  type GetFilesResponse,
  type GetSignedUrlConfig,
  type GetSignedUrlResponse,
  Storage,
} from "@google-cloud/storage";

import { reqHasScope } from "@/utils/authUtils";
import { bucketScope } from "@/types/googleStorage";

const makeConfig = function (): GetSignedUrlConfig {
  return {
    action: "read",
    expires: Date.now() + 604800,
    version: "v4",
  };
};

// Gets signed file URLs for temporary access to bucket images
export default defineEventHandler(async (event: H3Event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }
  const bucketName: string = event.context.params.bucket;
  if (!bucketName) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }

  const requiredScope = bucketScope(bucketName);
  if (!requiredScope) {
    throw createError({
      statusCode: 404,
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
  const runtimeConfig = useRuntimeConfig();
  const privKey =
    bucketName === "adult-gallery"
      ? runtimeConfig.gcpPrivateNsfwKey
      : runtimeConfig.gcpPrivateKey;
  const clientEmail =
    bucketName === "adult-gallery"
      ? runtimeConfig.gcpClientNsfwEmail
      : runtimeConfig.gcpClientEmail;

  const storage: Storage = new Storage({
    projectId: runtimeConfig.public.gcpProjectId,
    credentials: {
      type: "service_account",
      private_key: privKey.split(String.raw`\n`).join("\n"),
      client_email: clientEmail,
    },
  });

  const fileListResponse: GetFilesResponse = await storage
    .bucket(bucketName)
    .getFiles();
  const signedURLs: Array<Promise<GetSignedUrlResponse>> = [];

  const fileList = fileListResponse[0];
  fileList.reduce((urlList, file) => {
    const signedURL = file.getSignedUrl(makeConfig());
    urlList.push(signedURL);
    return urlList;
  }, signedURLs);

  return await Promise.all(signedURLs).then((urlList) =>
    urlList.map((res) => res[0])
  );
});
