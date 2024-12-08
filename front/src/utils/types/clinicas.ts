import { DadosUsuarioI } from "./dadosUsuarios"
import { DependenteClinicaI } from "./dependenteClinicas"
import { DependenteI } from "./dependentes"
import { HorarioI } from "./horarios"
import { LegendaI } from "./legendas"
import { TerapeutaI } from "./terapeutas"

export interface ClinicaI {
    id: string,
    dadosUsuario: DadosUsuarioI,
    dadosUsuarioId: number,
    Legendas: LegendaI[],
    Terapeuta: TerapeutaI[],
    DependenteClinica: DependenteClinicaI[],
    Horarios: HorarioI[]
}

export interface ClinicaZustandI {
    id: string,
    nome: string,
    token: string
}

