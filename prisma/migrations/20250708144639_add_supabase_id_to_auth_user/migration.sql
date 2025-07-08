/*
  Warnings:

  - A unique constraint covering the columns `[supabase_id]` on the table `auth_user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "auth_user" ADD COLUMN     "supabase_id" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_supabase_id_key" ON "auth_user"("supabase_id");
