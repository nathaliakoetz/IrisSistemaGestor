-- CreateTable
CREATE TABLE "horarios" (
    "clinicaId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horarios" TEXT[],

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("clinicaId","data")
);
