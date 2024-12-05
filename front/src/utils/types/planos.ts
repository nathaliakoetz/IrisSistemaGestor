import { LogContratoI } from "./logContratos"

export interface PlanoI {
    id: number,
    nome: string,
    valor: number
    LogContrato: LogContratoI[]
}
