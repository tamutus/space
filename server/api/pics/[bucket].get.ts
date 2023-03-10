import { H3Event } from "h3";
import {
  GetFilesResponse,
  GetSignedUrlConfig,
  GetSignedUrlResponse,
  Storage,
} from "@google-cloud/storage";
import { bucketScope, createGoogleStorage } from "@/utils/googleStorage";
import { reqHasScope } from "@/utils/authUtils";

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
  } else if ((await reqHasScope(event, requiredScope)) === true) {
    const runtimeConfig = useRuntimeConfig();

    const privKey =
      bucketName === "adult-gallery"
        ? runtimeConfig.gcpPrivateNsfwKey
        : runtimeConfig.gcpPrivateKey;
    const clientEmail =
      bucketName === "adult-gallery"
        ? runtimeConfig.gcpClientNsfwEmail
        : runtimeConfig.gcpClientEmail;
    const storage: Storage | null = createGoogleStorage(
      runtimeConfig.gcpProjectId,
      privKey,
      clientEmail
    );
    if (!storage) {
      return [];
    }
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
