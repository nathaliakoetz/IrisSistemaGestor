-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "clinicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
