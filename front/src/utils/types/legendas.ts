import { ClinicaI } from "./clinicas"

export interface LegendaI {
    id: number,
    descricao: string,
    cor: string,
    isFixed: boolean,
    clinica: ClinicaI
    clinicaId: string
}
