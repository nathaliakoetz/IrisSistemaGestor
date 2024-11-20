/*
  Warnings:

  - You are about to drop the column `dadosUsuarioId` on the `funcionarios` table. All the data in the column will be lost.
  - Added the required column `cpfCnpj` to the `funcionarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `funcionarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `funcionarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `funcionarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone1` to the `funcionarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_clinicaId_fkey";

-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_terapeutaId_fkey";

-- DropForeignKey
ALTER TABLE "funcionarios" DROP CONSTRAINT "funcionarios_dadosUsuarioId_fkey";

-- DropIndex
DROP INDEX "funcionarios_dadosUsuarioId_key";

-- AlterTable
ALTER TABLE "funcionarios" DROP COLUMN "dadosUsuarioId",
ADD COLUMN     "codigoRecuperacao" INTEGER,
ADD COLUMN     "cpfCnpj" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "senha" TEXT NOT NULL,
ADD COLUMN     "telefone1" TEXT NOT NULL,
ADD COLUMN     "telefone2" TEXT;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_clinicaId_terapeutaId_fkey" FOREIGN KEY ("clinicaId", "terapeutaId") REFERENCES "terapeutas"("clinicaId", "terapeutaId") ON DELETE RESTRICT ON UPDATE CASCADE;
