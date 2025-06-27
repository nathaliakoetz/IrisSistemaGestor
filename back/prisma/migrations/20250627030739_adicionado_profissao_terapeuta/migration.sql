/*
  Warnings:

  - Added the required column `profissao` to the `terapeutas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "terapeutas" ADD COLUMN     "profissao" TEXT NOT NULL;
