/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `funcionarios` table. All the data in the column will be lost.
  - You are about to drop the column `fixed` on the `legendas` table. All the data in the column will be lost.
  - Added the required column `isFixed` to the `legendas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "funcionarios" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "legendas" DROP COLUMN "fixed",
ADD COLUMN     "isFixed" BOOLEAN NOT NULL;
