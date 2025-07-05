import { ClinicaI } from "./clinicas"
import { ResponsavelI } from "./responsaveis"

export interface ResponsavelClinicaI {
    clinica: ClinicaI,
    clinicaId: string,
    responsavel: ResponsavelI,
    responsavelId: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
}
