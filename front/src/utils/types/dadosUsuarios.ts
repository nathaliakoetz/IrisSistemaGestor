import { LogContratoI } from "./logContratos";

export interface DadosUsuarioI {
    id: number,
    nome: string,
    email: string,
    senha: string,
    codigoRecuperacao: string | null,
    cpfCnpj: string,
    telefone1: string,
    telefone2: string | null,
    genero: string | null,
    estadoCivil: string | null,
    dataNascimento: string | null,
    foto: string | null,
    LogContrato: LogContratoI[]
}
