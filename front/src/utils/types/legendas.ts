import { ClinicaI } from "./clinicas"
import { TerapeutaI } from "./terapeutas"

export interface LegendaI {
    id: number,
    descricao?: string,
    cor: string,
    isFixed: boolean,
    clinica: ClinicaI
    clinicaId: string
    LegendaTerapeuta?: LegendaTerapeutaI[]
}

export interface LegendaTerapeutaI {
    legenda: LegendaI
    legendaId: number
    terapeuta: {
        id: string
        nome: string
        profissao: string
    }
    terapeutaId: string
    clinicaId: string
}
