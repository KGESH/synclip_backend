-- CreateTable
CREATE TABLE "GoogleDrive" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "base_folder_id" TEXT NOT NULL,
    "text_folder_id" TEXT NOT NULL,
    "file_folder_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "GoogleDrive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleDrive_user_id_key" ON "GoogleDrive"("user_id");

-- AddForeignKey
ALTER TABLE "GoogleDrive" ADD CONSTRAINT "GoogleDrive_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
