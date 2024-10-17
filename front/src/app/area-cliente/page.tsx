import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo } from "@/utils/fonts";

export default function AreaCliente() {

    return (
        <div className="flex">
            <SideBar />
            <div className="flex flex-col flex-1">
                <TopBar />
                <div className="flex-1 p-4 bg-[#f2f2f2]">
                    <div id="barra_agenda" className="flex justify-between">
                        <div className={`text-[#252d39] ms-5 text-xl font-extrabold ${cairo.className}`}>
                            Bem vindo de volta, Clinica Alfa
                        </div>
                        <div className="flex justify-between gap-10 me-10">
                            <div className="px-4 py-1 bg-[#252d39] rounded-lg justify-start items-center gap-1  inline-flex">
                                <div className={`text-white text-xl font-bold ${cairo.className}`}>
                                    Semanal
                                </div>
                            </div>
                            <div className="px-4 bg-white rounded-lg border border-gray-400 justify-start items-center gap-7 inline-flex">
                                <div className={`text-black text-xl font-bold ${cairo.className}`}>
                                    Filtrar por Profissionais
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 ms-5 flex">
                        <div className="w-2/5 bg-white rounded-lg shadow-lg p-4">
                            <div className="text-lg text-center font-bold text-[#252d39] mb-2">
                                Próximos Atendimentos
                            </div>
                            <div className="border-b border-gray-300 mb-3" />
                            <div className="max-h-[325px] overflow-y-auto">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                                    <div key={index} className={`relative ${index !== 0 ? '-mt-4' : ''}`}>
                                        <div
                                            className={`flex items-center justify-between rounded-b-2xl border-b border-gray-500 ${index == 0 ? 'pt-2' : 'pt-6'} pb-2 shadow-lg
                                            ${index == 0
                                                    ? 'bg-prox-atendimento-3'
                                                    : index == 1
                                                        ? 'bg-prox-atendimento-2'
                                                        : 'bg-prox-atendimento-1'}`}
                                            style={{ position: 'relative', zIndex: 200 - index }}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-16 h-16 ms-3 bg-[#F2F2F2] rounded-lg flex flex-col items-center justify-center text-white">
                                                    <div className="text-xl font-bold text-black">30</div>
                                                    <div className="text-sm text-black">SET</div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className={`text-md font-bold text-white ${cairo.className}`}>Paciente: Fulano de Tal</div>
                                                    <div className={`text-md font-bold text-white ${cairo.className}`}>Terapeuta: Ciclano de Tal</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center me-3">
                                                <div className="border-l-2 border-white h-16 mx-4" />
                                                <div className={`text-lg font-bold text-white ${cairo.className}`}>22:00</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}