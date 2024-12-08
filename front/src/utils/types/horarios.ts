import { ClinicaI } from "./clinicas"

export interface HorarioI {
    clinicaId: string,
    clinica: ClinicaI,
    data: string,
    horarios: string[]
}