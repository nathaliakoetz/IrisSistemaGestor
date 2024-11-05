/*
  Warnings:

  - You are about to drop the `dadosUsuarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logContratos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `responsaveisDependentes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "clinicas" DROP CONSTRAINT "clinicas_dadosUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "logContratos" DROP CONSTRAINT "logContratos_planoId_fkey";

-- DropForeignKey
ALTER TABLE "logContratos" DROP CONSTRAINT "logContratos_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "profissionais" DROP CONSTRAINT "profissionais_dadosUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "responsaveisDependentes" DROP CONSTRAINT "responsaveisDependentes_dependenteId_fkey";

-- DropForeignKey
ALTER TABLE "responsaveisDependentes" DROP CONSTRAINT "responsaveisDependentes_responsavelId_fkey";

-- DropTable
DROP TABLE "dadosUsuarios";

-- DropTable
DROP TABLE "logContratos";

-- DropTable
DROP TABLE "responsaveisDependentes";

-- CreateTable
CREATE TABLE "dados_usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "codigoRecuperacao" INTEGER,
    "cpfCnpj" TEXT NOT NULL,
    "telefone1" TEXT NOT NULL,
    "telefone2" TEXT,
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "dados_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_contratos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "planoId" INTEGER NOT NULL,
    "dataContratacao" TIMESTAMP(3) NOT NULL,
    "dataExpiracao" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsaveis_dependentes" (
    "responsavelId" TEXT NOT NULL,
    "dependenteId" TEXT NOT NULL,

    CONSTRAINT "responsaveis_dependentes_pkey" PRIMARY KEY ("responsavelId","dependenteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "dados_usuarios_email_key" ON "dados_usuarios"("email");

-- AddForeignKey
ALTER TABLE "clinicas" ADD CONSTRAINT "clinicas_dadosUsuarioId_fkey" FOREIGN KEY ("dadosUsuarioId") REFERENCES "dados_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissionais" ADD CONSTRAINT "profissionais_dadosUsuarioId_fkey" FOREIGN KEY ("dadosUsuarioId") REFERENCES "dados_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_contratos" ADD CONSTRAINT "log_contratos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "dados_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_contratos" ADD CONSTRAINT "log_contratos_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "planos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsaveis_dependentes" ADD CONSTRAINT "responsaveis_dependentes_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "responsaveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsaveis_dependentes" ADD CONSTRAINT "responsaveis_dependentes_dependenteId_fkey" FOREIGN KEY ("dependenteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
