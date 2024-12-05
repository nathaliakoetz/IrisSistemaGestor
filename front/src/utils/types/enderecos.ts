import { ResponsavelI } from "./responsaveis";

export interface EnderecoI {
    id: number,
    logradouro: string,
    numero: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string,
    Responsavel: ResponsavelI | null
}