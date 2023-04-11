-- AlterTable
ALTER TABLE "Art" ALTER COLUMN "published" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "nsfw" BOOLEAN NOT NULL DEFAULT false;
