/*
  Warnings:

  - You are about to drop the column `email` on the `pacientes` table. All the data in the column will be lost.
  - You are about to drop the column `telefone1` on the `pacientes` table. All the data in the column will be lost.
  - You are about to drop the column `telefone2` on the `pacientes` table. All the data in the column will be lost.
  - You are about to drop the `funcionarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "pacientes" DROP COLUMN "email",
DROP COLUMN "telefone1",
DROP COLUMN "telefone2";

-- DropTable
DROP TABLE "funcionarios";
