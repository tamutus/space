import { H3Event } from "h3";
import { Prisma, PrismaClient } from "@prisma/client";
import { BlogPost } from ".prisma/client";
import { reqHasScope } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

export default defineEventHandler(async function (event: H3Event) {
  const lavra = await reqHasScope(event, "create:content");
  const publishedOnly: {
    published?: boolean;
  } = {};
  if (lavra !== true) {
    publishedOnly.published = true;
  }

  const query = getQuery(event);
  const queryTags = [];
  const requestTags = query.tags;
  if (typeof requestTags === "string") {
    queryTags.push(String(requestTags));
  } else if (Array.isArray(requestTags)) {
    queryTags.push(...requestTags.map((tagName) => String(tagName)));
  }

  const latestBlogPost: BlogPost | null = await prisma.blogPost.findFirst({
    where: {
      ...publishedOnly,
      AND: queryTags.map((tagName) => {
        return {
          tags: {
            some: {
              tag: {
                name: tagName,
              },
            },
          },
        };
      }),
    },
    orderBy: {
      id: "desc",
    },
  });
  const earliestBlogPost: BlogPost | null = await prisma.blogPost.findFirst({
    where: {
      ...publishedOnly,
      AND: queryTags.map((tagName) => {
        return {
          tags: {
            some: {
              tag: {
                name: tagName,
              },
            },
          },
        };
      }),
    },
    orderBy: {
      id: "asc",
    },
  });
  if (latestBlogPost && earliestBlogPost) {
    return {
      earliest: earliestBlogPost.id,
      latest: latestBlogPost.id,
    };
  }
  return 0;
});
