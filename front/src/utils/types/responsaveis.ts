import { EnderecoI } from "./enderecos"
import { ResponsavelDependenteI } from "./reponsavelDependentes"
import { ResponsavelClinicaI } from "./responsavelClinicas"

export interface ResponsavelI {
    id: string,
    nome: string,
    email: string,
    cpf: string,
    telefone1: string,
    telefone2: string | null,
    genero: string,
    estadoCivil: string,
    dataNascimento: string,
    endereco: EnderecoI,
    enderecoId: number,
    ResponsavelDependente: ResponsavelDependenteI[],
    ResponsavelClinica: ResponsavelClinicaI[]
}