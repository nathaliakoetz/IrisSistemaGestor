import { ConsultaI } from "./consultas"
import { ResponsavelDependenteI } from "./reponsavelDependentes"

export interface DependenteI {
    id: string
    nome: string,
    cpf: string
    ResponsavelDependente: ResponsavelDependenteI[],
    Consulta: ConsultaI[]
}