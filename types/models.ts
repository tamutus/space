import { Prisma } from "@prisma/client";
import { Art, BlogPost, Tag, TagsOnArt, TagsOnPosts } from ".prisma/client";

// const blogPostWithTags = Prisma.validator<Prisma.BlogPostArgs>()({
//   include: {
//     tags: {
//       include: {
//         tag: true,
//       },
//     },
//   },
// });
export type BlogPostWithTags = BlogPost & {
  tags: (TagsOnPosts & {
    tag: Tag;
  })[];
};
export type BlogPostWithTagStrings = BlogPost & {
  tags: string[];
};

export type NewBlogPost = {
  title: string;
  tags: string[];
  content: Prisma.InputJsonValue;
  published: boolean;
};

// const artWithTags = Prisma.validator<Prisma.ArtArgs>()({
//   include: {
//     tags: {
//       include: {
//         tag: true,
//       },
//     },
//   },
// });
// export type ArtWithTags = Art & {
//   tags: (TagsOnArt & {
//     tag: Tag;
//   })[];
// };
export type ArtWithTags = Art & {
  tags: (TagsOnArt & {
    tag: Tag;
  })[];
} & {
  url?: string | undefined;
  artists?: string[] | undefined;
};
export type ArtWithTagStrings = Art & {
  tags: string[];
  url?: string;
  artists?: string[];
};

export type NewArt = {
  title: string;
  info?: string;
  published: boolean;
  tags: string[];
};
export type UpdateArt = {
  id: number;
  title: string;
  info: string | null;
  published: boolean;
  tags: string[];
};

export function validateArtWithTags(obj: any): obj is ArtWithTags {
  if (
    typeof obj.title === "string" &&
    (!obj.info || typeof obj.info === "string") &&
    typeof obj.published === "boolean" &&
    Array.isArray(obj.tags)
  ) {
    return true;
  }
  return false;
}

export type TagAddQuery = {
  tag: {
    connectOrCreate?: {
      create: {
        name: string;
      };
      where: {
        name: string;
      };
    };
  };
};

export type TagRemoveQuery = {
  artId_tagId: {
    artId: number;
    tagId: number;
  };
};

export const validateTag = function (maybeTag: any): maybeTag is Tag {
  if (
    ["id", "name", "info", "nsfw"].every((property) =>
      Object.keys(maybeTag).includes(property)
    )
  ) {
    return true;
  }
  return false;
};
