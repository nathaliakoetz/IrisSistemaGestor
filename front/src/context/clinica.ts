import { create } from 'zustand'
import { ClinicaZustandI } from '@/utils/types/clinicas'

type ClinicaStore = {
    clinica: ClinicaZustandI
    logaClinica: (clinicaLogado: ClinicaZustandI) => void
    deslogaClinica: () => void

}

export const useClinicaStore = create<ClinicaStore>((set) => ({
    clinica: {} as ClinicaZustandI,
    logaClinica: (clinicaLogado) => set({ clinica: clinicaLogado }),
    deslogaClinica: () => set({ clinica: {} as ClinicaZustandI }),
}))