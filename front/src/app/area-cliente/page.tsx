'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importando o CSS padrão do react-calendar
import { useState, useEffect } from 'react';
import { toast } from "sonner";

export default function AreaCliente() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAddConsultaOpen, setisAddConsultaOpen] = useState(false);

    const handleAddConsultaOpening = () => {
        setisAddConsultaOpen(!isAddConsultaOpen);
    };

    const tileClassName = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === currentDate.toDateString();

            return isSelected ? 'highlight-selected' : (isToday ? 'remove-today-highlight' : '');
        }
        return '';
    };

    const atendimentos = [
        { id: 1, paciente: "Fulano de Tal", terapeuta: "Ciclano de Tal", data: "30/09/2024", detalhes: "Detalhes da consulta 1" },
        { id: 2, paciente: "Maria da Silva", terapeuta: "João de Souza", data: "29/09/2024", detalhes: "Detalhes da consulta 2" },
        { id: 3, paciente: "Ana Pereira", terapeuta: "Roberto Carlos", data: "28/09/2024", detalhes: "Detalhes da consulta 3" },
        { id: 4, paciente: "Carlos Eduardo", terapeuta: "Fernanda Lima", data: "27/09/2024", detalhes: "Detalhes da consulta 4" },
        { id: 5, paciente: "Juliana Costa", terapeuta: "Mariana Santos", data: "26/09/2024", detalhes: "Detalhes da consulta 5" },
        { id: 6, paciente: "Juliana Costa", terapeuta: "Mariana Santos", data: "26/09/2024", detalhes: "Detalhes da consulta 5" },
        { id: 7, paciente: "Juliana Costa", terapeuta: "Mariana Santos", data: "26/09/2024", detalhes: "Detalhes da consulta 5" },
        { id: 8, paciente: "Juliana Costa", terapeuta: "Mariana Santos", data: "26/09/2024", detalhes: "Detalhes da consulta 5" },
        { id: 9, paciente: "Juliana Costa", terapeuta: "Mariana Santos", data: "26/09/2024", detalhes: "Detalhes da consulta 5" },
        { id: 10, paciente: "Juliana Costa", terapeuta: "Mariana Santos", data: "26/09/2024", detalhes: "Detalhes da consulta 5" },
    ];

    return (
        <div className="flex">
            <SideBar activeLink="geral"/>
            <div className="flex flex-col flex-1">
                <TopBar />
                <div className="flex-1 p-4 bg-[#f2f2f2]">
                    <div id="barra_agenda" className="flex justify-between">
                        <div className={`text-[#252d39] ms-10 text-xl font-extrabold ${cairo.className}`}>
                            Bem vindo de volta, Clinica Alfa
                        </div>
                        <div className="flex justify-between gap-10 me-10">
                            <select className={`bg-[#252d39] text-white font-bold rounded-lg px-2 ${cairo.className}`}>
                                <option value="Semanal">Semanal</option>
                                <option value="Mensal">Mensal</option>
                            </select>
                            <select className={`bg-white border border-gray-300 font-bold text-black rounded-lg px-2 ${cairo.className}`}>
                                <option value="">Filtrar por Profissionais</option>
                                <option value="Terapeuta 1">Terapeuta 1</option>
                                <option value="Terapeuta 2">Terapeuta 2</option>
                                <option value="Terapeuta 3">Terapeuta 3</option>
                            </select>
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
                                            style={{ position: 'relative', zIndex: 500 - index }}
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
                                <button
                                    className="w-full flex items-center justify-center gap-2 font-medium bg-[#252d39] text-white rounded-lg py-2 pe-[10px]"
                                    onClick={handleAddConsultaOpening}
                                >
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
                    <div className="mt-10 w-[80%] mx-auto bg-white rounded-lg shadow-lg mb-10">
                        <div className="flex justify-between items-center bg-[#6D9CE3] p-2 rounded-t-lg mb-2">
                            <h2 className={`text-lg text-white my-2 font-bold ${cairo.className}`}>Histórico de Consultas</h2>
                            <div className="relative w-1/3">
                                <img src="/icon_connectmenu.png" alt="Buscar" className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5" /> {/* Ícone de busca */}
                                <input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    className="border border-gray-300 rounded-lg pl-10 pr-2 py-1 w-full outline-none"
                                />
                            </div>
                        </div>
                        <div className="max-h-[350px] overflow-y-auto">
                            {atendimentos.map(atendimento => (
                                <div key={atendimento.id} className="flex items-center justify-between p-2 mb-1 mx-2 border border-gray-300 shadow-lg">
                                    <div className="border-l-4 me-2 border-[#6D9CE3] h-12" />
                                    <div className="flex-1">
                                        <p className="font-bold">{atendimento.paciente}</p>
                                        <p className="text-sm font-medium text-gray-600">Terapeuta: {atendimento.terapeuta}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm">{atendimento.data}</p>
                                        <button className="text-blue-500 text-sm flex items-center justify-center gap-1">
                                            <svg width="13" height="13" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.298 12.5714L13.374 8.50015L12.373 7.52415L9.298 10.5991L6.223 7.52415L5.22675 8.50015L9.298 12.5714ZM9.30025 18.7981C8.01442 18.7981 6.80558 18.5538 5.67375 18.0651C4.54175 17.5763 3.55708 16.913 2.71975 16.0751C1.88258 15.2373 1.22 14.2536 0.732 13.1239C0.244 11.9941 0 10.7869 0 9.5024C0 8.21657 0.244333 7.00773 0.733 5.8759C1.22183 4.7439 1.88517 3.75923 2.723 2.9219C3.56083 2.08473 4.54458 1.42215 5.67425 0.934148C6.80408 0.446148 8.01125 0.202148 9.29575 0.202148C10.5816 0.202148 11.7904 0.446482 12.9222 0.935149C14.0542 1.42398 15.0389 2.08731 15.8763 2.92515C16.7134 3.76298 17.376 4.74673 17.864 5.8764C18.352 7.00623 18.596 8.2134 18.596 9.4979C18.596 10.7837 18.3517 11.9926 17.863 13.1244C17.3742 14.2564 16.7108 15.2411 15.873 16.0784C15.0352 16.9156 14.0514 17.5781 12.9218 18.0661C11.7919 18.5541 10.5848 18.7981 9.30025 18.7981ZM9.29775 17.3991C11.4959 17.3991 13.362 16.6323 14.896 15.0986C16.43 13.5648 17.197 11.6987 17.197 9.5004C17.197 7.30223 16.4302 5.43615 14.8965 3.90215C13.3627 2.36815 11.4966 1.60115 9.29825 1.60115C7.10008 1.60115 5.234 2.36798 3.7 3.90165C2.166 5.43548 1.399 7.30156 1.399 9.4999C1.399 11.6981 2.16583 13.5641 3.6995 15.0981C5.23333 16.6321 7.09942 17.3991 9.29775 17.3991Z" fill="#6D9CE3" />
                                            </svg>
                                            Detalhes
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {isAddConsultaOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-[600]">
                            <div className="absolute inset-0 bg-black opacity-50" onClick={handleAddConsultaOpening}></div>
                            <div className="bg-white rounded-lg shadow-lg z-10 w-[500px]">
                                <h2 className={`flex text-2xl font-bold mb-8 items-center justify-center text-white bg-[#6D9CE3] py-1 mt-5 ${inter.className}`}>
                                    <svg className="me-3" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.7359 24.5233H17.3008V17.2642H24.5232V14.6994H17.3008V7.47696H14.7359V14.6994H7.47684V17.2642H14.7359V24.5233ZM3.87479 31.2503C3.00854 31.2503 2.27124 30.9459 1.66288 30.3373C1.05421 29.7289 0.749878 28.9916 0.749878 28.1253V3.87492C0.749878 3.00867 1.05421 2.27136 1.66288 1.663C2.27124 1.05433 3.00854 0.75 3.87479 0.75H28.1252C28.9915 0.75 29.7288 1.05433 30.3371 1.663C30.9458 2.27136 31.2501 3.00867 31.2501 3.87492V28.1253C31.2501 28.9916 30.9458 29.7289 30.3371 30.3373C29.7288 30.9459 28.9915 31.2503 28.1252 31.2503H3.87479ZM3.87892 28.6854H28.1211C28.2623 28.6854 28.3915 28.6266 28.5088 28.509C28.6265 28.3916 28.6853 28.2624 28.6853 28.1212V3.87904C28.6853 3.73787 28.6265 3.60863 28.5088 3.49129C28.3915 3.37365 28.2623 3.31483 28.1211 3.31483H3.87892C3.73775 3.31483 3.6085 3.37365 3.49117 3.49129C3.37353 3.60863 3.31471 3.73787 3.31471 3.87904V28.1212C3.31471 28.2624 3.37353 28.3916 3.49117 28.509C3.6085 28.6266 3.73775 28.6854 3.87892 28.6854Z" fill="#E8EAED" />
                                    </svg>
                                    Adicionar Consulta
                                </h2>
                                <form className="mx-16" onSubmit={handleAddConsultaOpening}>
                                    <select className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-4" required>
                                        <option value="">Selecione o Paciente</option>
                                        <option value="Paciente 1">Paciente 1</option>
                                        <option value="Paciente 2">Paciente 2</option>
                                        <option value="Paciente 3">Paciente 3</option>
                                    </select>
                                    <select className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-4" required>
                                        <option value="">Selecione o Terapeuta</option>
                                        <option value="Terapeuta 1">Terapeuta 1</option>
                                        <option value="Terapeuta 2">Terapeuta 2</option>
                                        <option value="Terapeuta 3">Terapeuta 3</option>
                                    </select>
                                    <input
                                        type="date"
                                        className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-4"
                                        required
                                    />
                                    <select className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-8" required>
                                        <option value="">Selecione o Horário</option>
                                        <option value="08:00">08:00</option>
                                        <option value="09:00">09:00</option>
                                        <option value="10:00">10:00</option>
                                        <option value="11:00">11:00</option>
                                        <option value="12:00">12:00</option>
                                        <option value="13:00">13:00</option>
                                        <option value="14:00">14:00</option>
                                        <option value="15:00">15:00</option>
                                        <option value="16:00">16:00</option>
                                        <option value="17:00">17:00</option>
                                        <option value="18:00">18:00</option>
                                    </select>
                                    <div className="flex items-center justify-between mb-8">
                                        <button
                                            type="button"
                                            onClick={handleAddConsultaOpening}
                                            className="bg-[#F2F2F2] border-2 border-gray-300 text-black rounded-lg py-2 w-[115px]"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white rounded-lg py-2 w-[115px]"
                                        >
                                            Concluir
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}