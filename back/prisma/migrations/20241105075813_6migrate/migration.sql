/*
  Warnings:

  - A unique constraint covering the columns `[cpfCnpj]` on the table `dados_usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dados_usuarios_cpfCnpj_key" ON "dados_usuarios"("cpfCnpj");
