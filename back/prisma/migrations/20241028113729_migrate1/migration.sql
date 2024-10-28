-- CreateTable
CREATE TABLE "tipoUsuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "tipoUsuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DECIMAL(6,2) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "planos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratosAtivos" (
    "usuarioId" VARCHAR(36) NOT NULL,
    "planoId" INTEGER NOT NULL,
    "dataContratacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataExpiracao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratosAtivos_pkey" PRIMARY KEY ("usuarioId","planoId")
);

-- CreateTable
CREATE TABLE "logContratacoes" (
    "id" SERIAL NOT NULL,
    "usuarioId" VARCHAR(36) NOT NULL,
    "planoId" INTEGER NOT NULL,
    "dataContratacao" TIMESTAMP(3) NOT NULL,
    "dataExpiracao" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logContratacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinicas" (
    "tipoUsuarioId" INTEGER NOT NULL,

    CONSTRAINT "clinicas_pkey" PRIMARY KEY ("tipoUsuarioId")
);

-- CreateTable
CREATE TABLE "profissionais" (
    "tipoUsuarioId" INTEGER NOT NULL,

    CONSTRAINT "profissionais_pkey" PRIMARY KEY ("tipoUsuarioId")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" VARCHAR(36) NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "codigoRecuperacao" INTEGER,
    "cpfCnpj" TEXT NOT NULL,
    "telefone1" TEXT NOT NULL,
    "telefone2" TEXT,
    "foto" TEXT NOT NULL,
    "tipoUsuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terapeutas" (
    "clinicaId" INTEGER NOT NULL,
    "terapeutaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "terapeutas_pkey" PRIMARY KEY ("clinicaId","terapeutaId")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" SERIAL NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
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

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas" (
    "id" SERIAL NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "terapeutaId" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clinicaId" INTEGER,

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historicoConsultas" (
    "id" SERIAL NOT NULL,
    "consultaId" INTEGER NOT NULL,
    "detalhes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historicoConsultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legendas" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "clinicaId" INTEGER NOT NULL,

    CONSTRAINT "legendas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contratosAtivos_usuarioId_key" ON "contratosAtivos"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "contratosAtivos_planoId_key" ON "contratosAtivos"("planoId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "contratosAtivos" ADD CONSTRAINT "contratosAtivos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratosAtivos" ADD CONSTRAINT "contratosAtivos_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "planos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logContratacoes" ADD CONSTRAINT "logContratacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logContratacoes" ADD CONSTRAINT "logContratacoes_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "planos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinicas" ADD CONSTRAINT "clinicas_tipoUsuarioId_fkey" FOREIGN KEY ("tipoUsuarioId") REFERENCES "tipoUsuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissionais" ADD CONSTRAINT "profissionais_tipoUsuarioId_fkey" FOREIGN KEY ("tipoUsuarioId") REFERENCES "tipoUsuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_tipoUsuarioId_fkey" FOREIGN KEY ("tipoUsuarioId") REFERENCES "tipoUsuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terapeutas" ADD CONSTRAINT "terapeutas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("tipoUsuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terapeutas" ADD CONSTRAINT "terapeutas_terapeutaId_fkey" FOREIGN KEY ("terapeutaId") REFERENCES "profissionais"("tipoUsuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_terapeutaId_fkey" FOREIGN KEY ("terapeutaId") REFERENCES "profissionais"("tipoUsuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("tipoUsuarioId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicoConsultas" ADD CONSTRAINT "historicoConsultas_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "consultas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legendas" ADD CONSTRAINT "legendas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("tipoUsuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;
