-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('ANNUAL', 'HOURLY');

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "salaryType" "SalaryType",
ALTER COLUMN "salaryMin" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "salaryMax" SET DATA TYPE DOUBLE PRECISION;
