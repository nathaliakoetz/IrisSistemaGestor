/*
  Warnings:

  - The primary key for the `dependentes_clinicas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `dependentes_clinicas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dependentes_clinicas" DROP CONSTRAINT "dependentes_clinicas_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "dependentes_clinicas_pkey" PRIMARY KEY ("clinicaId", "dependenteId");
