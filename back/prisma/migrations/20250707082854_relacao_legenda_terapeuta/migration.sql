/*
  Warnings:

  - You are about to drop the column `descricao` on the `legendas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[terapeutaId,clinicaId]` on the table `legendas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `terapeutaId` to the `legendas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "legendas" DROP COLUMN "descricao",
ADD COLUMN     "terapeutaId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "legendas_terapeutaId_clinicaId_key" ON "legendas"("terapeutaId", "clinicaId");

-- AddForeignKey
ALTER TABLE "legendas" ADD CONSTRAINT "legendas_terapeutaId_clinicaId_fkey" FOREIGN KEY ("terapeutaId", "clinicaId") REFERENCES "terapeutas"("id", "clinicaId") ON DELETE RESTRICT ON UPDATE CASCADE;
