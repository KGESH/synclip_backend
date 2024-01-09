-- CreateTable
CREATE TABLE "Shortcuts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "shortcuts" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Shortcuts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shortcuts_user_id_key" ON "Shortcuts"("user_id");

-- AddForeignKey
ALTER TABLE "Shortcuts" ADD CONSTRAINT "Shortcuts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
