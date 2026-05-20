-- AlterTable: make passwordHash nullable (existing rows keep their value)
ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- AlterTable: add googleId column (nullable, will be populated on first Google sign-in)
ALTER TABLE "users" ADD COLUMN "googleId" TEXT;

-- CreateIndex: unique constraint on googleId
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");
