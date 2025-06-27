import { ClinicaI } from "./clinicas"
import { ConsultaI } from "./consultas"

export interface TerapeutaI {
    id: string,
    nome: string,
    email: string,
    senha: string,
    codigoRecuperacao: number | null,
    cpfCnpj: string,
    telefone1: string,
    telefone2: string | null,
    profissao: string,
    clinica: ClinicaI,
    clinicaId: string,
    Consulta: ConsultaI[]
}
