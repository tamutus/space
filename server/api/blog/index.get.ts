import { H3Event } from "h3";
import { Prisma, PrismaClient } from "@prisma/client";
import { BlogPost } from ".prisma/client";
import { reqHasScope } from "@/utils/authUtils";

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

const trimPost = function (fullPost: any) {
  const trimmedInsert = fullPost?.content?.ops[0]?.insert
    ?.split("\n")
    .map((line: string) =>
      line.length > 99 ? line.slice(0, 100) + "..." : line
    );
  return {
    ...fullPost,
    content: {
      ops: [
        {
          insert:
            trimmedInsert.length > 3
              ? trimmedInsert.slice(0, 3).join("\n") + "\n..." || []
              : trimmedInsert.join("\n"),
        },
      ],
    },
  };
};

const prisma: PrismaClient = new PrismaClient();

const getBlogPostsWithTags = async function (event: H3Event) {
  const query = getQuery(event);
  const queryTags = [];
  const requestTags = query.tags;
  if (typeof requestTags === "string") {
    queryTags.push(String(requestTags));
  } else if (Array.isArray(requestTags)) {
    queryTags.push(...requestTags.map((tagName) => String(tagName)));
  }

  const prismaQuery: Prisma.BlogPostFindManyArgs = {
    take:
      typeof query.take === "string" && /\d/.test(query.take)
        ? Number(query.take)
        : 5,
  };

  if (typeof query.past === "string" && /\d/.test(query.past)) {
    prismaQuery.skip = 1;
    prismaQuery.cursor = {
      id: Number(query.past),
    };
  }
  if (typeof query.take === "string" && /\d/.test(query.take)) {
  }
  const lavra = await reqHasScope(event, "create:content");
  const publishedOnly: {
    published?: boolean;
  } = {};
  if (lavra !== true) {
    publishedOnly.published = true;
  }

  const blogPosts: BlogPostWithTags[] = await prisma.blogPost.findMany({
    ...prismaQuery,
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
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
  return blogPosts.map(trimPost);
};

export type GetBlogPostsWithTags = Prisma.PromiseReturnType<
  typeof getBlogPostsWithTags
>;

export default defineEventHandler(getBlogPostsWithTags);
