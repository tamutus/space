import { Storage, GetSignedUrlConfig } from "@google-cloud/storage";

export type BucketScopes = {
  [key: string]: string;
};

export const bucketScope = function (bucketName: string): string {
  if (bucketName === "homepage-gallery") {
    return "read:content";
  } else if (bucketName === "adult-gallery") {
    return "access:adult";
  }
  return "";
};

export const createGoogleStorage = (bucketName: string) => {
  let requiredScope = bucketScope(bucketName);
  const runtimeConfig = useRuntimeConfig();
  if (requiredScope === "access:adult") {
    return new Storage({
      projectId: runtimeConfig.gcpProjectId,
      credentials: {
        type: "service_account",
        private_key: runtimeConfig.gcpPrivateNsfwKey
          .split(String.raw`\n`)
          .join("\n"),
        client_email: runtimeConfig.gcpClientNsfwEmail,
      },
    });
  } else {
    return new Storage({
      projectId: runtimeConfig.gcpProjectId,
      credentials: {
        type: "service_account",
        private_key: runtimeConfig.gcpPrivateKey
          .split(String.raw`\n`)
          .join("\n"),
        client_email: runtimeConfig.gcpClientEmail,
      },
    });
  }
};

export const gcsSignedUrl = async (
  bucketName: string,
  filename: string,
  minutesToExpiration: number
) => {
  const storage = new Storage();
  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "write",
    expires: Date.now() + minutesToExpiration * 60 * 1000,
  };
  const [url]: [string] = await storage
    .bucket(bucketName)
    .file(filename)
    .getSignedUrl(options);
  return url;
};
