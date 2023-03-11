import { H3Event } from "h3";
import { bucketScope } from "@/utils/googleStorage";
import { reqHasScope } from "@/utils/authUtils";
import {
  GetFilesResponse,
  GetSignedUrlConfig,
  GetSignedUrlResponse,
} from "@google-cloud/storage";

const gcs = require("@google-cloud/storage");

const makeConfig = function (): GetSignedUrlConfig {
  return {
    action: "read",
    expires: Date.now() + 604800,
    version: "v4",
  };
};

// Gets signed file URLs for temporary access to bucket images
export default defineEventHandler(async (event: H3Event) => {
  const bucketName: string = event.context.params.bucket;
  if (!bucketName) {
    return [];
  }

  const requiredScope = bucketScope(bucketName);
  if (!requiredScope) {
    return [];
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
  const storage: Storage = new gcs.Storage({
    projectId: runtimeConfig.public.gcpProjectId,
    credentials: {
      type: "service_account",
      private_key: privKey.split(String.raw`\n`).join("\n"),
      client_email: clientEmail,
    },
  });
  if ((await reqHasScope(event, requiredScope)) === true) {
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
  } else {
    return [];
  }
});
