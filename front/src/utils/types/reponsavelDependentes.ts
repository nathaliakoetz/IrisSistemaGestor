import { DependenteI } from "./dependentes"
import { ResponsavelI } from "./responsaveis"

export interface ResponsavelDependenteI {
    responsavel: ResponsavelI
    responsavelId: string,
    dependente: DependenteI,
    dependenteId: string,
}