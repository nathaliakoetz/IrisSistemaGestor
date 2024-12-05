import { DadosUsuarioI } from "./dadosUsuarios"
import { PlanoI } from "./planos"

export interface LogContratoI {
    id: number,
    usuario: DadosUsuarioI,
    usuarioId: string,
    plano: PlanoI,
    planoId: number,
    dataContratacao: Date,
    dataExpiracao: Date
}
