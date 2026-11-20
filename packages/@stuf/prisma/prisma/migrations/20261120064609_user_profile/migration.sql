-- CreateEnum
CREATE TYPE "ProfileColor" AS ENUM ('MINT', 'BLUE', 'AMBER', 'CORAL', 'VIOLET');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "profileColor" "ProfileColor" NOT NULL DEFAULT 'BLUE';
