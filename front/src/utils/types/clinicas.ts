import { DadosUsuarioI } from "./dadosUsuarios"
import { LegendaI } from "./legendas"
import { TerapeutaI } from "./terapeutas"

export interface ClinicaI {
    id: string,
    dadosUsuario: DadosUsuarioI,
    dadosUsuarioId: number,
    Legendas: LegendaI[],
    Terapeuta: TerapeutaI[]
}
