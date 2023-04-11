import { RuntimeConfig } from "nuxt/schema";
import { Storage } from "@google-cloud/storage";
import { BucketAction } from "@/types/googleStorage";

// Don't store exports here that don't call useGoogleStorage. The google auth module seems to mess things up if you do!

export const useGoogleStorage = function (
  runtimeVars: RuntimeConfig,
  bucketAction: BucketAction
): Storage {
  const privKey =
    bucketAction === "adult-gallery"
      ? runtimeVars.gcpPrivateNsfwKey
      : ["adult-upload", "homepage-upload"].includes(bucketAction)
      ? runtimeVars.gcpEditorKey
      : runtimeVars.gcpPrivateKey;
  const clientEmail =
    bucketAction === "adult-gallery"
      ? runtimeVars.gcpClientNsfwEmail
      : ["adult-upload", "homepage-upload"].includes(bucketAction)
      ? runtimeVars.gcpEditorClientEmail
      : runtimeVars.gcpClientEmail;

  return new Storage({
    projectId: runtimeVars.gcpProjectId,
    credentials: {
      type: "service_account",
      private_key: privKey.split(String.raw`\n`).join("\n"),
      client_email: clientEmail,
    },
  });
};
