export type BucketUploadAction = "homepage-upload" | "adult-upload";
export type Bucket = "homepage-gallery" | "adult-gallery";
export type BucketAction = BucketUploadAction | Bucket;

export const bucketScope = function (bucketName: string): string {
  if (bucketName === "homepage-gallery") {
    return "read:content";
  } else if (bucketName === "adult-gallery") {
    return "access:adult";
  } else if (["homepage-upload", "adult-upload"].includes(bucketName)) {
    return "create:content";
  }
  return "";
};

export function validBucket(bucketName: any): bucketName is Bucket {
  return bucketName === "homepage-gallery" || bucketName === "adult-gallery";
}
export function validBucketAction(bucketName: any): bucketName is BucketAction {
  return [
    "homepage-gallery",
    "adult-gallery",
    "homepage-upload",
    "adult-upload",
  ].includes(bucketName);
}

export const imageFileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon",
];

export const validImageFile = function (file: File): boolean {
  return imageFileTypes.includes(file.type);
};
