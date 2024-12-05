import { EnderecoI } from "./enderecos"
import { ResponsavelDependenteI } from "./reponsavelDependentes"

export interface ResponsavelI {
    id: string,
    nome: string,
    email: string,
    cpf: string,
    telefone1: string,
    telefone2: string | null,
    endereco: EnderecoI,
    enderecoId: number,
    ResponsavelDependente: ResponsavelDependenteI[]
}