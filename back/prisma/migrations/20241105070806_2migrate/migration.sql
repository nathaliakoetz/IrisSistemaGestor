/*
  Warnings:

  - The primary key for the `clinicas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tipoUsuarioId` on the `clinicas` table. All the data in the column will be lost.
  - You are about to drop the column `enderecoId` on the `pacientes` table. All the data in the column will be lost.
  - The primary key for the `profissionais` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tipoUsuarioId` on the `profissionais` table. All the data in the column will be lost.
  - The primary key for the `terapeutas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deletedAt` on the `terapeutas` table. All the data in the column will be lost.
  - You are about to drop the `contratosAtivos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historicoConsultas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logContratacoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tipoUsuarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dadosUsuarioId]` on the table `clinicas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dadosUsuarioId]` on the table `profissionais` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dadosUsuarioId` to the `clinicas` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `clinicas` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `clinicas` table without a default value. This is not possible if the table is not empty.
  - Made the column `clinicaId` on table `consultas` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `fixed` to the `legendas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dadosUsuarioId` to the `profissionais` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `profissionais` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `profissionais` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "clinicas" DROP CONSTRAINT "clinicas_tipoUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_clinicaId_fkey";

-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_terapeutaId_fkey";

-- DropForeignKey
ALTER TABLE "contratosAtivos" DROP CONSTRAINT "contratosAtivos_planoId_fkey";

-- DropForeignKey
ALTER TABLE "contratosAtivos" DROP CONSTRAINT "contratosAtivos_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "historicoConsultas" DROP CONSTRAINT "historicoConsultas_consultaId_fkey";

-- DropForeignKey
ALTER TABLE "legendas" DROP CONSTRAINT "legendas_clinicaId_fkey";

-- DropForeignKey
ALTER TABLE "logContratacoes" DROP CONSTRAINT "logContratacoes_planoId_fkey";

-- DropForeignKey
ALTER TABLE "logContratacoes" DROP CONSTRAINT "logContratacoes_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "pacientes" DROP CONSTRAINT "pacientes_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "profissionais" DROP CONSTRAINT "profissionais_tipoUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "terapeutas" DROP CONSTRAINT "terapeutas_clinicaId_fkey";

-- DropForeignKey
ALTER TABLE "terapeutas" DROP CONSTRAINT "terapeutas_terapeutaId_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_tipoUsuarioId_fkey";

-- AlterTable
ALTER TABLE "clinicas" DROP CONSTRAINT "clinicas_pkey",
DROP COLUMN "tipoUsuarioId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dadosUsuarioId" INTEGER NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "id" VARCHAR(36) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "clinicas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "consultas" ADD COLUMN     "detalhes" TEXT,
ALTER COLUMN "pacienteId" DROP NOT NULL,
ALTER COLUMN "terapeutaId" SET DATA TYPE TEXT,
ALTER COLUMN "dataFim" DROP NOT NULL,
ALTER COLUMN "clinicaId" SET NOT NULL,
ALTER COLUMN "clinicaId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "legendas" ADD COLUMN     "fixed" BOOLEAN NOT NULL,
ALTER COLUMN "clinicaId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "pacientes" DROP COLUMN "enderecoId";

-- AlterTable
ALTER TABLE "profissionais" DROP CONSTRAINT "profissionais_pkey",
DROP COLUMN "tipoUsuarioId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dadosUsuarioId" INTEGER NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "id" VARCHAR(36) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "profissionais_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "terapeutas" DROP CONSTRAINT "terapeutas_pkey",
DROP COLUMN "deletedAt",
ALTER COLUMN "clinicaId" SET DATA TYPE TEXT,
ALTER COLUMN "terapeutaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "terapeutas_pkey" PRIMARY KEY ("clinicaId", "terapeutaId");

-- DropTable
DROP TABLE "contratosAtivos";

-- DropTable
DROP TABLE "historicoConsultas";

-- DropTable
DROP TABLE "logContratacoes";

-- DropTable
DROP TABLE "tipoUsuarios";

-- DropTable
DROP TABLE "usuarios";

-- CreateTable
CREATE TABLE "dadosUsuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "codigoRecuperacao" INTEGER,
    "cpfCnpj" TEXT NOT NULL,
    "telefone1" TEXT NOT NULL,
    "telefone2" TEXT,
    "foto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "dadosUsuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logContratos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "planoId" INTEGER NOT NULL,
    "dataContratacao" TIMESTAMP(3) NOT NULL,
    "dataExpiracao" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logContratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsaveis" (
    "id" VARCHAR(36) NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone1" TEXT NOT NULL,
    "telefone2" TEXT,
    "enderecoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "responsaveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsaveisDependentes" (
    "responsavelId" TEXT NOT NULL,
    "dependenteId" TEXT NOT NULL,

    CONSTRAINT "responsaveisDependentes_pkey" PRIMARY KEY ("responsavelId","dependenteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "dadosUsuarios_email_key" ON "dadosUsuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "responsaveis_enderecoId_key" ON "responsaveis"("enderecoId");

-- CreateIndex
CREATE UNIQUE INDEX "clinicas_dadosUsuarioId_key" ON "clinicas"("dadosUsuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "profissionais_dadosUsuarioId_key" ON "profissionais"("dadosUsuarioId");

-- AddForeignKey
ALTER TABLE "clinicas" ADD CONSTRAINT "clinicas_dadosUsuarioId_fkey" FOREIGN KEY ("dadosUsuarioId") REFERENCES "dadosUsuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissionais" ADD CONSTRAINT "profissionais_dadosUsuarioId_fkey" FOREIGN KEY ("dadosUsuarioId") REFERENCES "dadosUsuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terapeutas" ADD CONSTRAINT "terapeutas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terapeutas" ADD CONSTRAINT "terapeutas_terapeutaId_fkey" FOREIGN KEY ("terapeutaId") REFERENCES "profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legendas" ADD CONSTRAINT "legendas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logContratos" ADD CONSTRAINT "logContratos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "dadosUsuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logContratos" ADD CONSTRAINT "logContratos_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "planos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsaveis" ADD CONSTRAINT "responsaveis_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsaveisDependentes" ADD CONSTRAINT "responsaveisDependentes_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "responsaveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsaveisDependentes" ADD CONSTRAINT "responsaveisDependentes_dependenteId_fkey" FOREIGN KEY ("dependenteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_terapeutaId_fkey" FOREIGN KEY ("terapeutaId") REFERENCES "profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
