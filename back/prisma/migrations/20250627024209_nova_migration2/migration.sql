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
    "genero" TEXT,
    "estadoCivil" TEXT,
    "dataNascimento" TEXT,
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dados_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinicas" (
    "id" VARCHAR(36) NOT NULL,
    "dadosUsuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "clinicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissionais" (
    "id" VARCHAR(36) NOT NULL,
    "dadosUsuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "profissionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terapeutas" (
    "id" VARCHAR(36) NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "codigoRecuperacao" INTEGER,
    "cpfCnpj" TEXT NOT NULL,
    "telefone1" TEXT NOT NULL,
    "telefone2" TEXT,
    "clinicaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terapeutas_pkey" PRIMARY KEY ("id","clinicaId")
);

-- CreateTable
CREATE TABLE "legendas" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "isFixed" BOOLEAN NOT NULL,
    "clinicaId" TEXT NOT NULL,

    CONSTRAINT "legendas_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "enderecos" (
    "id" SERIAL NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsaveis" (
    "id" VARCHAR(36) NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone1" TEXT NOT NULL,
    "telefone2" TEXT,
    "genero" TEXT NOT NULL,
    "estadoCivil" TEXT NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "enderecoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "responsaveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" VARCHAR(36) NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsaveis_dependentes" (
    "responsavelId" TEXT NOT NULL,
    "dependenteId" TEXT NOT NULL,

    CONSTRAINT "responsaveis_dependentes_pkey" PRIMARY KEY ("responsavelId","dependenteId")
);

-- CreateTable
CREATE TABLE "consultas" (
    "id" SERIAL NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "terapeutaId" TEXT NOT NULL,
    "pacienteId" TEXT,
    "dataInicio" TEXT NOT NULL,
    "dataFim" TEXT,
    "detalhes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dependentes_clinicas" (
    "clinicaId" TEXT NOT NULL,
    "dependenteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "dependentes_clinicas_pkey" PRIMARY KEY ("clinicaId","dependenteId")
);

-- CreateTable
CREATE TABLE "horarios" (
    "clinicaId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horarios" TEXT[],

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("clinicaId","data")
);

-- CreateIndex
CREATE UNIQUE INDEX "dados_usuarios_email_key" ON "dados_usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dados_usuarios_cpfCnpj_key" ON "dados_usuarios"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "clinicas_dadosUsuarioId_key" ON "clinicas"("dadosUsuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "profissionais_dadosUsuarioId_key" ON "profissionais"("dadosUsuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "responsaveis_enderecoId_key" ON "responsaveis"("enderecoId");

-- AddForeignKey
ALTER TABLE "clinicas" ADD CONSTRAINT "clinicas_dadosUsuarioId_fkey" FOREIGN KEY ("dadosUsuarioId") REFERENCES "dados_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissionais" ADD CONSTRAINT "profissionais_dadosUsuarioId_fkey" FOREIGN KEY ("dadosUsuarioId") REFERENCES "dados_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terapeutas" ADD CONSTRAINT "terapeutas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legendas" ADD CONSTRAINT "legendas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_contratos" ADD CONSTRAINT "log_contratos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "dados_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_contratos" ADD CONSTRAINT "log_contratos_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "planos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsaveis" ADD CONSTRAINT "responsaveis_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsaveis_dependentes" ADD CONSTRAINT "responsaveis_dependentes_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "responsaveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsaveis_dependentes" ADD CONSTRAINT "responsaveis_dependentes_dependenteId_fkey" FOREIGN KEY ("dependenteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_terapeutaId_clinicaId_fkey" FOREIGN KEY ("terapeutaId", "clinicaId") REFERENCES "terapeutas"("id", "clinicaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependentes_clinicas" ADD CONSTRAINT "dependentes_clinicas_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependentes_clinicas" ADD CONSTRAINT "dependentes_clinicas_dependenteId_fkey" FOREIGN KEY ("dependenteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
