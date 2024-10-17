'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo } from "@/utils/fonts";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importando o CSS padrão do react-calendar
import { useState, useEffect } from 'react';

export default function AreaCliente() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());

    const tileClassName = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === currentDate.toDateString();

            return isSelected ? 'highlight-selected' : (isToday ? 'remove-today-highlight' : '');
        }
        return '';
    };

    const tileDisabled = ({ date }: { date: Date }) => {
        const day = date.getDay();
        return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
    };

    return (
        <div className="flex">
            <SideBar />
            <div className="flex flex-col flex-1">
                <TopBar />
                <div className="flex-1 p-4 bg-[#f2f2f2]">
                    <div id="barra_agenda" className="flex justify-between">
                        <div className={`text-[#252d39] ms-10 text-xl font-extrabold ${cairo.className}`}>
                            Bem vindo de volta, Clinica Alfa
                        </div>
                        <div className="flex justify-between gap-10 me-10">
                            <div className="px-4 py-1 bg-[#252d39] rounded-lg justify-start items-center gap-1  inline-flex">
                                <div className={`text-white text-xl font-semibold ${cairo.className}`}>
                                    Semanal
                                </div>
                            </div>
                            <div className="px-4 bg-white rounded-lg border border-gray-400 justify-start items-center gap-7 inline-flex">
                                <div className={`text-black text-xl font-semibold ${cairo.className}`}>
                                    Filtrar por Profissionais
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center justify-center gap-60">
                        <div className="w-2/5 bg-white rounded-lg shadow-lg p-3">
                            <div className="text-lg text-center font-bold text-[#252d39] pb-3">
                                Próximos Atendimentos
                            </div>
                            <div className="border-b border-gray-300 mb-3" />
                            <div className="max-h-[405px] overflow-y-auto">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
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
                                                    <p className={`text-md font-bold text-white ${cairo.className}`}>
                                                        Paciente: Fulano de Tal
                                                    </p>
                                                    <p className={`text-md font-bold text-white ${cairo.className}`}>
                                                        Terapeuta: Ciclano de Tal
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center me-3">
                                                <div className="border-l-2 border-white h-16 mx-4" />
                                                <p className={`text-lg font-bold text-white ${cairo.className}`}>
                                                    22:00
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-[365px] flex flex-col">
                            <div className="w-auto bg-white rounded-lg shadow-lg p-3">
                                <Calendar
                                    onChange={(value) => setSelectedDate(value as Date)}
                                    value={selectedDate || currentDate}
                                    tileClassName={tileClassName}
                                    tileDisabled={tileDisabled}
                                    locale="pt-BR"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center gap-4 mt-6">
                                <button className="w-full flex items-center justify-center gap-2 font-medium bg-[#252d39] text-white rounded-lg py-2 pe-[19px]">
                                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.7359 24.5233H17.3008V17.2642H24.5232V14.6994H17.3008V7.47696H14.7359V14.6994H7.47684V17.2642H14.7359V24.5233ZM3.87479 31.2503C3.00854 31.2503 2.27124 30.9459 1.66288 30.3373C1.05421 29.7289 0.749878 28.9916 0.749878 28.1253V3.87492C0.749878 3.00867 1.05421 2.27136 1.66288 1.663C2.27124 1.05433 3.00854 0.75 3.87479 0.75H28.1252C28.9915 0.75 29.7288 1.05433 30.3371 1.663C30.9458 2.27136 31.2501 3.00867 31.2501 3.87492V28.1253C31.2501 28.9916 30.9458 29.7289 30.3371 30.3373C29.7288 30.9459 28.9915 31.2503 28.1252 31.2503H3.87479ZM3.87892 28.6854H28.1211C28.2623 28.6854 28.3915 28.6266 28.5088 28.509C28.6265 28.3916 28.6853 28.2624 28.6853 28.1212V3.87904C28.6853 3.73787 28.6265 3.60863 28.5088 3.49129C28.3915 3.37365 28.2623 3.31483 28.1211 3.31483H3.87892C3.73775 3.31483 3.6085 3.37365 3.49117 3.49129C3.37353 3.60863 3.31471 3.73787 3.31471 3.87904V28.1212C3.31471 28.2624 3.37353 28.3916 3.49117 28.509C3.6085 28.6266 3.73775 28.6854 3.87892 28.6854Z" fill="#E8EAED" />
                                    </svg>
                                    Adicionar Horário
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 font-medium bg-[#252d39] text-white rounded-lg py-2 pe-[10px]">
                                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.7359 24.5233H17.3008V17.2642H24.5232V14.6994H17.3008V7.47696H14.7359V14.6994H7.47684V17.2642H14.7359V24.5233ZM3.87479 31.2503C3.00854 31.2503 2.27124 30.9459 1.66288 30.3373C1.05421 29.7289 0.749878 28.9916 0.749878 28.1253V3.87492C0.749878 3.00867 1.05421 2.27136 1.66288 1.663C2.27124 1.05433 3.00854 0.75 3.87479 0.75H28.1252C28.9915 0.75 29.7288 1.05433 30.3371 1.663C30.9458 2.27136 31.2501 3.00867 31.2501 3.87492V28.1253C31.2501 28.9916 30.9458 29.7289 30.3371 30.3373C29.7288 30.9459 28.9915 31.2503 28.1252 31.2503H3.87479ZM3.87892 28.6854H28.1211C28.2623 28.6854 28.3915 28.6266 28.5088 28.509C28.6265 28.3916 28.6853 28.2624 28.6853 28.1212V3.87904C28.6853 3.73787 28.6265 3.60863 28.5088 3.49129C28.3915 3.37365 28.2623 3.31483 28.1211 3.31483H3.87892C3.73775 3.31483 3.6085 3.37365 3.49117 3.49129C3.37353 3.60863 3.31471 3.73787 3.31471 3.87904V28.1212C3.31471 28.2624 3.37353 28.3916 3.49117 28.509C3.6085 28.6266 3.73775 28.6854 3.87892 28.6854Z" fill="#E8EAED" />
                                    </svg>
                                    Adicionar Consulta
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 font-medium bg-[#252d39] text-white rounded-lg py-2 px-4">
                                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.4 24.3807L16 17.7808L22.6 24.3807L24.3893 22.6001L17.7893 16.0001L24.3893 9.40012L22.6 7.61079L16 14.2108L9.4 7.61079L7.61938 9.40012L14.2194 16.0001L7.61938 22.6001L9.4 24.3807ZM3.87479 31.2502C3.00854 31.2502 2.27124 30.9459 1.66288 30.3372C1.05421 29.7289 0.749878 28.9916 0.749878 28.1253V3.87492C0.749878 3.00867 1.05421 2.27136 1.66288 1.663C2.27124 1.05433 3.00854 0.75 3.87479 0.75H28.1252C28.9915 0.75 29.7288 1.05433 30.3371 1.663C30.9458 2.27136 31.2501 3.00867 31.2501 3.87492V28.1253C31.2501 28.9916 30.9458 29.7289 30.3371 30.3372C29.7288 30.9459 28.9915 31.2502 28.1252 31.2502H3.87479ZM3.87892 28.6854H28.1211C28.2623 28.6854 28.3915 28.6266 28.5088 28.509C28.6265 28.3916 28.6853 28.2624 28.6853 28.1212V3.87904C28.6853 3.73787 28.6265 3.60862 28.5088 3.49129C28.3915 3.37365 28.2623 3.31483 28.1211 3.31483H3.87892C3.73775 3.31483 3.6085 3.37365 3.49117 3.49129C3.37353 3.60862 3.31471 3.73787 3.31471 3.87904V28.1212C3.31471 28.2624 3.37353 28.3916 3.49117 28.509C3.6085 28.6266 3.73775 28.6854 3.87892 28.6854Z" fill="#E8EAED" />
                                    </svg>
                                    Desmarcar Consulta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}