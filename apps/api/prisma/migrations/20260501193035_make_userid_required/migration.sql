/*
  Warnings:

  - Made the column `userId` on table `job_applications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "job_applications" DROP CONSTRAINT "job_applications_userId_fkey";

-- AlterTable
ALTER TABLE "job_applications" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
