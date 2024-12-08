import { ClinicaI } from "./clinicas"
import { DependenteI } from "./dependentes"

export interface DependenteClinicaI {
    dependente: DependenteI,
    dependenteId: string,
    clinica: ClinicaI,
    clinicaId: string,
}