import { Prisma } from "@prisma/client";
import { BlogPost } from ".prisma/client";

const blogPostWithTags = Prisma.validator<Prisma.BlogPostArgs>()({
  include: {
    tags: {
      include: {
        tag: true,
      },
    },
  },
});
export type BlogPostWithTags = Prisma.BlogPostGetPayload<
  typeof blogPostWithTags
>;
export type BlogPostWithTagStrings = BlogPost & {
  tags: string[];
};
