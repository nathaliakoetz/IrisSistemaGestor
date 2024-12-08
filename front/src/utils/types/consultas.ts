import { DependenteI } from "./dependentes"
import { TerapeutaI } from "./terapeutas"

export interface ConsultaI {
    id: number,
    terapeuta: TerapeutaI
    clinicaId: string,
    terapeutaId: string,
    paciente: DependenteI | null,
    pacienteId: string | null,
    dataInicio: string,
    dataFim: string | null,
    detalhes: string | null
}