export const bucketScope = function (bucketName: string): string {
  if (bucketName === "homepage-gallery") {
    return "read:content";
  } else if (bucketName === "adult-gallery") {
    return "access:adult";
  }
  return "";
};
