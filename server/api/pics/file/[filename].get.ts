import { Storage, GetSignedUrlConfig } from "@google-cloud/storage";
const runtimeConfig = useRuntimeConfig();

const storage = new Storage({
  projectId: runtimeConfig.gcpProjectId,
  credentials: {
    type: "service_account",
    private_key: runtimeConfig.gcpPrivateKey.split(String.raw`\n`).join("\n"),
    client_email: runtimeConfig.gcpClientEmail,
  },
});

const bucketName = "homepage-gallery",
  config: GetSignedUrlConfig = {
    action: "read",
    expires: Date.now() + 604800,
    version: "v4",
  };

export default defineEventHandler(async (event) => {
  const fileName = event.context.params.filename;
  // Downloads the file
  const signedURL = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(config);

  return signedURL;
});
