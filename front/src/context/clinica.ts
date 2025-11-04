import { create } from 'zustand'
import { ClinicaZustandI } from '@/utils/types/clinicas'

type ClinicaStore = {
    clinica: ClinicaZustandI
    logaClinica: (clinicaLogado: ClinicaZustandI) => void
    deslogaClinica: () => void
    carregaClinicaDaStorage: () => void
}

// Função para carregar a clínica do sessionStorage
const carregarClinicaDoStorage = (): ClinicaZustandI => {
    if (typeof window !== 'undefined') {
        const clinicaStorage = sessionStorage.getItem('clinica');
        if (clinicaStorage) {
            try {
                return JSON.parse(clinicaStorage);
            } catch (error) {
                console.error('Erro ao parsear clínica do storage:', error);
            }
        }
    }
    return {} as ClinicaZustandI;
}

export const useClinicaStore = create<ClinicaStore>((set) => ({
    clinica: carregarClinicaDoStorage(),
    logaClinica: (clinicaLogado) => {
        set({ clinica: clinicaLogado });
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('clinica', JSON.stringify(clinicaLogado));
        }
    },
    deslogaClinica: () => {
        set({ clinica: {} as ClinicaZustandI });
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('clinica');
        }
    },
    carregaClinicaDaStorage: () => {
        const clinicaStorage = carregarClinicaDoStorage();
        if (clinicaStorage && Object.keys(clinicaStorage).length > 0) {
            set({ clinica: clinicaStorage });
        }
    }
}))