/*
  Warnings:

  - You are about to drop the `GoogleDrive` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GoogleDrive" DROP CONSTRAINT "GoogleDrive_user_id_fkey";

-- DropTable
DROP TABLE "GoogleDrive";

-- CreateTable
CREATE TABLE "Drive" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "base_folder_id" TEXT NOT NULL,
    "text_folder_id" TEXT NOT NULL,
    "file_folder_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Drive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drive_user_id_key" ON "Drive"("user_id");

-- AddForeignKey
ALTER TABLE "Drive" ADD CONSTRAINT "Drive_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
