/*
  Warnings:

  - You are about to drop the column `terapeutaId` on the `legendas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "legendas" DROP CONSTRAINT "legendas_terapeutaId_clinicaId_fkey";

-- DropIndex
DROP INDEX "legendas_terapeutaId_clinicaId_key";

-- AlterTable
ALTER TABLE "legendas" DROP COLUMN "terapeutaId";

-- CreateTable
CREATE TABLE "legendas_terapeutas" (
    "legendaId" INTEGER NOT NULL,
    "terapeutaId" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,

    CONSTRAINT "legendas_terapeutas_pkey" PRIMARY KEY ("legendaId","terapeutaId","clinicaId")
);

-- AddForeignKey
ALTER TABLE "legendas_terapeutas" ADD CONSTRAINT "legendas_terapeutas_legendaId_fkey" FOREIGN KEY ("legendaId") REFERENCES "legendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legendas_terapeutas" ADD CONSTRAINT "legendas_terapeutas_terapeutaId_clinicaId_fkey" FOREIGN KEY ("terapeutaId", "clinicaId") REFERENCES "terapeutas"("id", "clinicaId") ON DELETE RESTRICT ON UPDATE CASCADE;
