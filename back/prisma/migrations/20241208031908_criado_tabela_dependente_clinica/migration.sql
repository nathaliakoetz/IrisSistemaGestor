-- CreateTable
CREATE TABLE "dependentes_clinicas" (
    "id" SERIAL NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "dependenteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "dependentes_clinicas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dependentes_clinicas" ADD CONSTRAINT "dependentes_clinicas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependentes_clinicas" ADD CONSTRAINT "dependentes_clinicas_dependenteId_fkey" FOREIGN KEY ("dependenteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
