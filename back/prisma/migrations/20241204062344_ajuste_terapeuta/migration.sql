/*
  Warnings:

  - You are about to drop the column `createdAt` on the `funcionarios` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `funcionarios` table. All the data in the column will be lost.
  - The primary key for the `terapeutas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `terapeutaId` on the `terapeutas` table. All the data in the column will be lost.
  - Added the required column `cpfCnpj` to the `terapeutas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `terapeutas` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `terapeutas` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `nome` to the `terapeutas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `terapeutas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone1` to the `terapeutas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `terapeutas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_clinicaId_terapeutaId_fkey";

-- DropForeignKey
ALTER TABLE "terapeutas" DROP CONSTRAINT "terapeutas_terapeutaId_fkey";

-- AlterTable
ALTER TABLE "funcionarios" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "terapeutas" DROP CONSTRAINT "terapeutas_pkey",
DROP COLUMN "terapeutaId",
ADD COLUMN     "codigoRecuperacao" INTEGER,
ADD COLUMN     "cpfCnpj" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" VARCHAR(36) NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "senha" TEXT NOT NULL,
ADD COLUMN     "telefone1" TEXT NOT NULL,
ADD COLUMN     "telefone2" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "terapeutas_pkey" PRIMARY KEY ("id", "clinicaId");

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_terapeutaId_clinicaId_fkey" FOREIGN KEY ("terapeutaId", "clinicaId") REFERENCES "terapeutas"("id", "clinicaId") ON DELETE RESTRICT ON UPDATE CASCADE;
