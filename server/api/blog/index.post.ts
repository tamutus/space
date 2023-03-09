import { H3Event } from "h3";
import { Prisma, PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

type TagQuery = {
  tag: {
    connectOrCreate: {
      create: {
        name: string;
      };
      where: {
        name: string;
      };
    };
  };
};

export type NewBlogPost = {
  title: string;
  tags: string[];
  content: Prisma.InputJsonValue;
  published: boolean;
};

// Logic may need to be called again, so it needs to be a named function.
const postBlog = async (event: H3Event, prisma: PrismaClient) => {
  if ((await reqHasScope(event, "create:content")) === true) {
    const body = await readBody(event),
      blogPost: Prisma.BlogPostCreateInput = body.blogPost;

    // Verify necessary contents
    if (!blogPost.title) {
      return "Title cannot be empty";
    } else if (!blogPost.content) {
      return "No post!";
    } else if (!Array.isArray(blogPost.tags)) {
      return "Tags must be an array (of strings)";
    }
    const tagAddQueries = blogPost.tags.reduce(
      (tagQueries: TagQuery[], tagName) => {
        if (typeof tagName === "string" && tagName.length > 0) {
          tagQueries.push({
            tag: {
              connectOrCreate: {
                create: {
                  name: tagName,
                },
                where: {
                  name: tagName,
                },
              },
            },
          });
        }
        return tagQueries;
      },
      []
    );

    await prisma.blogPost
      .create({
        data: {
          title: blogPost.title,
          content: blogPost.content,
          tags: {
            create: tagAddQueries,
          },
          published: blogPost.published,
        },
      })
      .catch(async (e: any) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            return postBlog(event, prisma);
          }
        }
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
  }
};

export default defineEventHandler((event: H3Event) => {
  return postBlog(event, prisma);
});
