import { ConsultaI } from "./consultas"
import { DependenteClinicaI } from "./dependenteClinicas"
import { ResponsavelDependenteI } from "./reponsavelDependentes"

export interface DependenteI {
    id: string
    nome: string,
    cpf: string
    genero: string,
    dataNascimento: string,
    ResponsavelDependente: ResponsavelDependenteI[],
    Consulta: ConsultaI[]
    DependenteClinica: DependenteClinicaI[]
}