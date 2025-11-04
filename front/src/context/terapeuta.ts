import { create } from 'zustand'
import { TerapeutaZustandI } from '@/utils/types/terapeutas'

type TerapeutaStore = {
    terapeuta: TerapeutaZustandI
    logaTerapeuta: (terapeutaLogado: TerapeutaZustandI) => void
    deslogaTerapeuta: () => void
    carregaTerapeutaDaStorage: () => void
}

// Função para carregar o terapeuta do sessionStorage
const carregarTerapeutaDoStorage = (): TerapeutaZustandI => {
    if (typeof window !== 'undefined') {
        const terapeutaStorage = sessionStorage.getItem('terapeuta');
        if (terapeutaStorage) {
            try {
                return JSON.parse(terapeutaStorage);
            } catch (error) {
                console.error('Erro ao parsear terapeuta do storage:', error);
            }
        }
    }
    return {} as TerapeutaZustandI;
}

export const useTerapeutaStore = create<TerapeutaStore>((set) => ({
    terapeuta: {} as TerapeutaZustandI,
    logaTerapeuta: (terapeutaLogado) => {
        set({ terapeuta: terapeutaLogado });
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('terapeuta', JSON.stringify(terapeutaLogado));
        }
    },
    deslogaTerapeuta: () => {
        set({ terapeuta: {} as TerapeutaZustandI });
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('terapeuta');
        }
    },
    carregaTerapeutaDaStorage: () => {
        const terapeutaStorage = carregarTerapeutaDoStorage();
        if (terapeutaStorage && Object.keys(terapeutaStorage).length > 0) {
            set({ terapeuta: terapeutaStorage });
        }
    }
}))
