import { H3Event } from "h3";
import { Prisma, PrismaClient } from "@prisma/client";
import { reqHasScope } from "@/utils/authUtils";

const prisma: PrismaClient = new PrismaClient();

type TagAddQuery = {
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
type TagRemoveQuery = {
  postId_tagId: {
    postId: number;
    tagId: number;
  };
};

// Logic may need to be called again, so it needs to be a named function.
const putBlog = async function (event: H3Event) {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "No params given",
    });
  }
  // Validate blog id
  const blogID = parseInt(event.context.params.blogId) as number;
  if (!Number.isInteger(blogID)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Blog ID should be an integer",
    });
  }

  // Check for Lavra
  if ((await reqHasScope(event, "create:content")) !== true) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only Lavra can edit blog entries",
    });
  }

  // Query pre-existing version to determine which tags in the update are additions/removals
  const oldVersion = await prisma.blogPost.findUnique({
    where: {
      id: blogID,
    },
    select: {
      published: true,
      tags: {
        include: {
          tag: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
  if (!oldVersion) {
    throw createError({
      statusCode: 404,
      statusMessage: "API received a put request using an incorrect blog ID",
    });
  }

  const body = await readBody(event),
    blogPost = body.blogPost;
  // Verify necessary contents
  if (!blogPost.title) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title cannot be empty",
    });
  } else if (!blogPost.content) {
    throw createError({
      statusCode: 400,
      statusMessage: "No post!",
    });
  } else if (!Array.isArray(blogPost.tags)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Tags must be an array (of strings)",
    });
  }
  if (blogPost.published === undefined) {
    blogPost.published = oldVersion.published;
  }
  const tagAddQueries = blogPost.tags
    .map((name: string) => name.toLowerCase())
    .reduce((tagQueries: TagAddQuery[], tagName: string) => {
      if (typeof tagName === "string" && tagName.length > 0) {
        if (!oldVersion.tags.find((tag) => tag.tag.name === tagName))
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
    }, []);

  const tagRemoveQueries = oldVersion.tags.reduce(
    (tagQueries: TagRemoveQuery[], tag) => {
      if (!blogPost.tags.includes(tag.tag.name)) {
        tagQueries.push({
          postId_tagId: {
            postId: blogID,
            tagId: tag.tag.id,
          },
        });
      }
      return tagQueries;
    },
    []
  );

  const updatedPost = await prisma.blogPost
    .update({
      where: {
        id: blogID,
      },
      data: {
        title: blogPost.title,
        content: blogPost.content,
        tags: {
          create: tagAddQueries,
          delete: tagRemoveQueries,
        },
        published: blogPost.published,
      },
    })
    .catch(async (e: any) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          return putBlog(event);
        }
      }
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
  return "success";
};

export default defineEventHandler(putBlog);
