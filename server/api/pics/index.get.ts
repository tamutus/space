import { H3Event } from "h3";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  File,
  GetFilesResponse,
  GetSignedUrlConfig,
  GetSignedUrlResponse,
  Storage,
} from "@google-cloud/storage";
import { Bucket } from "@/types/googleStorage";
import { reqHasScope } from "@/utils/authUtils";
import { ArtWithTagStrings } from "@/types/models";

const prisma: PrismaClient = new PrismaClient();

const makeConfig = function (): GetSignedUrlConfig {
  return {
    action: "read",
    expires: Date.now() + 604800,
    version: "v4",
  };
};

const getArtWithTagStrings = async (event: H3Event) => {
  const prismaQuery: Prisma.ArtFindManyArgs = {
    take: 30,
  };

  const userQuery = getQuery(event);
  // let queryTags: string[] = [];

  // userQuery.past
  // userQuery.page
  // userQuery.take
  // userQuery.yes
  // userQuery.no
  // userQuery.maybe
  // userQuery.ratings
  // userQuery.order

  if (typeof userQuery.past === "string" && /\d/.test(userQuery.past)) {
    prismaQuery.skip = 1;
    prismaQuery.cursor = {
      id: Number(userQuery.past),
    };
  }
  if (typeof userQuery.take === "string" && /\d/.test(userQuery.take)) {
    prismaQuery.take = Number(userQuery.take);
  }
  if (typeof userQuery.page === "string" && /\d/.test(userQuery.page)) {
    const pageNo = Number(userQuery.page);
    const take = prismaQuery.take || 1;
    prismaQuery.skip = pageNo * take;
  }
  // if(typeof userQuery.yes === "string" && userQuery.yes.length > 0){
  //   const yesTags = userQuery.yes.split(/[\+\s]/g);
  //   if(yesTags.length > 0){
  //     prismaQuery.where = {
  //       ...prismaQuery.where,
  //       AND: yesTags.map((tagName) => {
  //           return {
  //             tags: {
  //               some: {
  //                 tag: {
  //                   name: tagName
  //                 }
  //               }
  //             }
  //           }
  //         })
  //     };
  //   }
  // }
  // if(typeof userQuery.no === "string" && userQuery.no.length > 0){
  //   const noTags = userQuery.no.split(/[\+\s]/g);
  //   if(noTags.length > 0){
  //     prismaQuery.where = {
  //       ...prismaQuery.where,
  //       NOT: noTags.map((tagName) => {
  //           return {
  //             tags: {
  //               some: {
  //                 tag: {
  //                   name: tagName
  //                 }
  //               }
  //             }
  //           }
  //         })
  //     };
  //   }
  // }

  // if(typeof userQuery.maybe === "string" && userQuery.maybe.length > 0){
  //   const maybeTags = userQuery.maybe.split(/[\+\s]/g);
  //   if(maybeTags.length > 0){
  //     prismaQuery.where = {
  //       ...prismaQuery.where,
  //       OR: maybeTags.map((tagName) => {
  //           return {
  //             tags: {
  //               some: {
  //                 tag: {
  //                   name: tagName
  //                 }
  //               }
  //             }
  //           }
  //         })
  //     };
  //   }
  // }

  ["NOT", "OR", "AND"].forEach((queryKey) => {
    let respectiveSet = "yes";
    switch (queryKey) {
      case "NOT":
        respectiveSet = "no";
        break;
      case "OR":
        respectiveSet = "maybe";
      default:
        break;
    }
    const querySet = userQuery[respectiveSet];
    if (typeof querySet === "string" && querySet.length > 0) {
      const queryTags = querySet.split(/[\+\s]/g);
      if (queryTags.length > 0) {
        prismaQuery.where = {
          ...prismaQuery.where,
          [queryKey]: queryTags.map((tagName) => {
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
        };
      }
    }
  });

  prismaQuery.where = {
    ...prismaQuery.where,
  };
  if (
    userQuery.ratings === "s" ||
    !(await reqHasScope(event, "access:adult"))
  ) {
    prismaQuery.where = {
      ...prismaQuery.where,
      bucket: "homepage-gallery",
    };
  }
  if (typeof userQuery.order === "string") {
    const order = userQuery.order;
    switch (order) {
      case "tagcount":
        prismaQuery.orderBy = {
          tags: {
            _count: "desc",
          },
        };
        break;
      case "tagcount_asc":
        prismaQuery.orderBy = {
          tags: {
            _count: "asc",
          },
        };
        break;
      case "id":
        prismaQuery.orderBy = {
          id: "asc",
        };
        break;
      default:
        prismaQuery.orderBy = {
          id: "desc",
        };
    }
  }
  // Get metadata from Prisma

  const artResponse = await prisma.art.findMany({
    ...prismaQuery,
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
  const artMetadata = artResponse.map((metadata) => {
    return {
      ...metadata,
      tags: metadata.tags.map((tag) => tag.tag.name),
      ext: "",
    };
  });

  let googleFiles: File[] = [];
  const runtimeConfig = useRuntimeConfig();
  const bucketQueries: {
    name: Bucket;
    privKey: string;
    clientEmail: string;
  }[] = [];
  if (
    artMetadata.find((somePiece) => somePiece.bucket === "homepage-gallery")
  ) {
    bucketQueries.push({
      name: "homepage-gallery",
      privKey: runtimeConfig.gcpPrivateKey,
      clientEmail: runtimeConfig.gcpClientEmail,
    });
  }
  if (artMetadata.find((somePiece) => somePiece.bucket === "adult-gallery")) {
    bucketQueries.push({
      name: "adult-gallery",
      privKey: runtimeConfig.gcpPrivateNsfwKey,
      clientEmail: runtimeConfig.gcpClientNsfwEmail,
    });
  }
  for (const buckQuery of bucketQueries) {
    const storage: Storage = new Storage({
      projectId: runtimeConfig.public.gcpProjectId,
      credentials: {
        type: "service_account",
        private_key: buckQuery.privKey.split(String.raw`\n`).join("\n"),
        client_email: buckQuery.clientEmail,
      },
    });
    const [fileListResponse]: GetFilesResponse = await storage
      .bucket(buckQuery.name)
      .getFiles();
    googleFiles = [...googleFiles, ...fileListResponse];
  }
  // Get metadata from Google

  const signedURLs: Array<Promise<GetSignedUrlResponse> | undefined> = [];
  artMetadata.forEach((metadata) => {
    const respectiveFile = googleFiles.find(
      (entry) => entry.name === metadata.fileName
    );
    if (respectiveFile) {
      metadata.ext = respectiveFile.metadata.contentType;
      const signedURL = respectiveFile.getSignedUrl(makeConfig());
      signedURLs.push(signedURL);
    } else {
      signedURLs.push(undefined);
    }
  });

  const allData: Array<ArtWithTagStrings> = [];
  await Promise.all(signedURLs).then((urlList) => {
    for (let i = 0; i < urlList.length; i++) {
      allData.push(artMetadata[i]);
      allData[i].url = urlList[i] ? String(urlList[i]) : undefined;
    }
  });
  return allData;
};

export default defineEventHandler(getArtWithTagStrings);
