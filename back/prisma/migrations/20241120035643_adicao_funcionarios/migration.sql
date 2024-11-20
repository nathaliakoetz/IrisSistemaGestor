-- DropForeignKey
ALTER TABLE "terapeutas" DROP CONSTRAINT "terapeutas_terapeutaId_fkey";

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" VARCHAR(36) NOT NULL,
    "dadosUsuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_dadosUsuarioId_key" ON "funcionarios"("dadosUsuarioId");

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_dadosUsuarioId_fkey" FOREIGN KEY ("dadosUsuarioId") REFERENCES "dados_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terapeutas" ADD CONSTRAINT "terapeutas_terapeutaId_fkey" FOREIGN KEY ("terapeutaId") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
