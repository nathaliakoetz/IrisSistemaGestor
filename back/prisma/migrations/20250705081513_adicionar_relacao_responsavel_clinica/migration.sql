-- CreateTable
CREATE TABLE "responsaveis_clinicas" (
    "clinicaId" TEXT NOT NULL,
    "responsavelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "responsaveis_clinicas_pkey" PRIMARY KEY ("clinicaId","responsavelId")
);

-- AddForeignKey
ALTER TABLE "responsaveis_clinicas" ADD CONSTRAINT "responsaveis_clinicas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsaveis_clinicas" ADD CONSTRAINT "responsaveis_clinicas_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "responsaveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
