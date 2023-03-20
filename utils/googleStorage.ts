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
