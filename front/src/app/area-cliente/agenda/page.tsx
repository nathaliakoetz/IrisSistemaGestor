'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importando o CSS padrão do react-calendar
import { useState } from 'react';
import { useClinicaStore } from "@/context/clinica";
import Link from "next/link";

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        let value;
        value = letters[Math.floor(Math.random() * 16)];
        color += value;
    }
    return color;
}

function generateUniqueColor(existingColors: string[]) {
    let color;
    do {
        color = getRandomColor();
    } while (existingColors.includes(color));
    return color;
}

export default function AreaAgenda() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAddLegendaModalOpen, setisAddLegendaModalOpen] = useState(false);
    const [isRemoveLegendaModalOpen, setIsRemoveLegendaModalOpen] = useState(false);
    const [legendas, setLegendas] = useState<{ text: string, color: string }[]>([]);
    const [legendaParaRemover, setLegendaParaRemover] = useState<{ text: string, color: string } | null>(null);
    const [legendaIndex, setLegendaIndex] = useState<number | null>(null);
    const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);
    const [tooltipText, setTooltipText] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
    const [isAddConsultaOpen, setisAddConsultaOpen] = useState(false);
    const { clinica } = useClinicaStore();

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

    const toggleExpand = (index: number) => {
        setExpandedAppointment(expandedAppointment === index ? null : index);
    };

    const handleAddLegendaModal = () => {
        setisAddLegendaModalOpen(!isAddLegendaModalOpen);
    };

    const handleRemoveLegendaModalOpening = (index: number) => {
        setLegendaParaRemover(legendas[index]);
        setLegendaIndex(index);
        setIsRemoveLegendaModalOpen(true);
    };

    const handleAddLegenda = (text: string) => {
        const newColor = generateUniqueColor(legendas.map(legenda => legenda.color));
        setLegendas([...legendas, { text, color: newColor }]);
        handleAddLegendaModal();
    };

    const handleDeleteLegenda = (index: number) => {
        setLegendas(legendas.filter((_, i) => i !== index));
        setIsRemoveLegendaModalOpen(false);
    };

    const renderWeekRange = (date: Date | null) => {
        if (!date) return '';

        const startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Ajusta para segunda-feira

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Se a semana começa na segunda, termina na sexta

        const formattedStart = startOfWeek.toLocaleDateString('pt-BR');
        const formattedEnd = endOfWeek.toLocaleDateString('pt-BR');

        const startMonth = startOfWeek.toLocaleString('pt-BR', { month: 'long' });
        const endMonth = endOfWeek.toLocaleString('pt-BR', { month: 'long' });
        const startYear = startOfWeek.getFullYear();
        const endYear = endOfWeek.getFullYear();

        const primeiraMaisucula = (dateString: string) => {
            return dateString.charAt(0).toUpperCase() + dateString.slice(1);
        };

        // Verifica se os meses são iguais ou se o ano é diferente
        if (startMonth === endMonth) {
            return `${primeiraMaisucula(startMonth)} ${startYear}`;
        } else if (endYear === startYear) {
            return `${primeiraMaisucula(startMonth)} - ${primeiraMaisucula(endMonth)} ${startYear}`;
        } else {
            return `${primeiraMaisucula(startMonth)} ${startYear} - ${primeiraMaisucula(endMonth)} ${endYear}`;
        }
    };

    const renderWeekDays = (date: Date | null) => {
        if (!date) return '';

        const startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Ajusta para segunda-feira

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Se a semana começa na segunda, termina na sexta

        // Formatar dias e meses sem o ano
        const options = { day: '2-digit', month: '2-digit' } as const;
        const formattedStart = startOfWeek.toLocaleDateString('pt-BR', options);
        const formattedEnd = endOfWeek.toLocaleDateString('pt-BR', options);

        return `${formattedStart} - ${formattedEnd}`;
    };

    return (
        clinica.id ?
        <div className="flex">
            <SideBar activeLink="agenda" />
            <div className="flex flex-col flex-1">
                <TopBar />
                <div className="flex flex-1">
                    <div className="w-[270px] p-4">
                        <Calendar
                            onChange={(value) => setSelectedDate(value as Date)}
                            value={selectedDate}
                            tileClassName={tileClassName}
                            locale="pt-BR"
                        />
                        <div className="mt-4">
                            <div className="flex justify-start gap-2 text-xl items-center">
                                <h2>Legenda</h2>
                                <button onClick={handleAddLegendaModal} className="text-[#6D 9CE3]">+</button>
                            </div>
                            <ul>
                                {legendas.map((legenda, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: legenda.color }}></span>
                                        <span
                                            className="text-ellipsis overflow-hidden whitespace-nowrap"
                                            style={{ color: legenda.color, maxWidth: 'calc(100% - 40px)' }}
                                            onMouseEnter={(e) => {
                                                setTooltipText(legenda.text);
                                                setTooltipPosition({ x: e.clientX, y: e.clientY });
                                            }}
                                            onMouseLeave={() => {
                                                setTooltipText(null);
                                                setTooltipPosition(null);
                                            }}
                                        >
                                            {legenda.text}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveLegendaModalOpening(index)}
                                            className="ml-2 text-center text-red-500"
                                        >
                                            -
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {tooltipText && tooltipPosition && (
                                <div
                                    className="absolute bg-gray-700 text-white text-sm rounded p-2"
                                    style={{
                                        top: tooltipPosition.y + 10, // Adiciona um pequeno deslocamento para baixo
                                        left: tooltipPosition.x + 10, // Adiciona um pequeno deslocamento para a direita
                                        zIndex: 1000,
                                        pointerEvents: 'none', // Para que o mouse não interaja com o tooltip
                                    }}
                                >
                                    {tooltipText}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center border-l-2 border-gray-300">
                            <span className={`ms-5 my-3 text-2xl ${cairo.className}`}>
                                {renderWeekDays(selectedDate)}
                            </span>
                            <div className={`text-2xl ${cairo.className}`}>
                                {renderWeekRange(selectedDate)}
                            </div>
                            <div className="flex items-center justify-center">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="32" height="32" rx="16" fill="#F5F5F5" />
                                    <path d="M22.4842 20.8605L19.8881 18.2644C19.771 18.1473 19.6121 18.0822 19.4455 18.0822H19.021C19.7397 17.163 20.1667 16.0068 20.1667 14.7491C20.1667 11.7573 17.7425 9.33301 14.7506 9.33301C11.7587 9.33301 9.33447 11.7573 9.33447 14.7491C9.33447 17.741 11.7587 20.1653 14.7506 20.1653C16.0083 20.1653 17.1644 19.7382 18.0836 19.0196V19.444C18.0836 19.6107 18.1487 19.7695 18.2659 19.8867L20.862 22.4828C21.1068 22.7275 21.5026 22.7275 21.7447 22.4828L22.4816 21.7459C22.7264 21.5011 22.7264 21.1053 22.4842 20.8605ZM14.7506 18.0822C12.9096 18.0822 11.4176 16.5927 11.4176 14.7491C11.4176 12.9082 12.907 11.4161 14.7506 11.4161C16.5916 11.4161 18.0836 12.9056 18.0836 14.7491C18.0836 16.5901 16.5942 18.0822 14.7506 18.0822Z" fill="#6A778B" />
                                </svg>
                                <button
                                    className={`flex justify-center items-center ms-4 me-5 bg-[#6D9CE3] p-2 text-white text-sm rounded-md ${inter.className}`}
                                    onClick={handleAddConsultaOpening}
                                >
                                    Adicionar Consulta
                                    <svg className="ms-1.5" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.00004 0.333008C3.31725 0.333008 0.333374 3.31688 0.333374 6.99967C0.333374 10.6825 3.31725 13.6663 7.00004 13.6663C10.6828 13.6663 13.6667 10.6825 13.6667 6.99967C13.6667 3.31688 10.6828 0.333008 7.00004 0.333008ZM10.871 7.75236C10.871 7.92978 10.7258 8.07494 10.5484 8.07494H8.07531V10.5481C8.07531 10.7255 7.93015 10.8706 7.75273 10.8706H6.24735C6.06993 10.8706 5.92477 10.7255 5.92477 10.5481V8.07494H3.45165C3.27423 8.07494 3.12907 7.92978 3.12907 7.75236V6.24699C3.12907 6.06957 3.27423 5.92441 3.45165 5.92441H5.92477V3.45129C5.92477 3.27387 6.06993 3.12871 6.24735 3.12871H7.75273C7.93015 3.12871 8.07531 3.27387 8.07531 3.45129V5.92441H10.5484C10.7258 5.92441 10.871 6.06957 10.871 6.24699V7.75236Z" fill="white" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full border-collapse border-l-2 border-t-2 border-gray-300 table-fixed w-full h-full">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 w-[50px]" />
                                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia) => (
                                            <th key={dia} className={`border-2 border-gray-300 w-auto ${cairo.className}`}>{dia}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="h-full">
                                    {Array.from({ length: 12 }, (_, i) => i + 8).map((hora) => (
                                        <tr key={hora}>
                                            <td className={`border-2 border-gray-300 text-center w-auto ${cairo.className}`}>{`${hora.toString().padStart(2, '0')}:00`}</td>
                                            {Array(7).fill(null).map((_, index) => {
                                                if (hora === 8 && index === 1) {
                                                    return (
                                                        <td key={index} className={`border-2 bg-[#F2F2F2] border-gray-300 ${cairo.className}`}>
                                                            <div className="flex flex-col">
                                                                <div
                                                                    className="flex justify-between items-center bg-blue-400 border-l-[6px] border-blue-600 mb-1 cursor-pointer"
                                                                    onClick={() => toggleExpand(0)}
                                                                >
                                                                    <span className="mx-1">João Silva</span>
                                                                    <span className="mx-1 min-w-3 min-h-3 rounded-full border border-white" style={{ backgroundColor: '#FF5733' }} />
                                                                </div>
                                                                {expandedAppointment === 0 && (
                                                                    <div className="mx-1">
                                                                        <div className="text-[12px]">Terapeuta: João Neto</div>
                                                                        <div className="text-[12px]">08:00 - 08:30</div>
                                                                    </div>
                                                                )}
                                                                <div
                                                                    className="flex justify-between items-center bg-green-400 border-l-[6px] border-green-600 mb-1 cursor-pointer"
                                                                    onClick={() => toggleExpand(1)}
                                                                >
                                                                    <span className="mx-1">Pedro Silva</span>
                                                                    <span className="mx-1 min-w-3 min-h-3 rounded-full border border-white" style={{ backgroundColor: '#FF5733' }} />
                                                                </div>
                                                                {expandedAppointment === 1 && (
                                                                    <div className="mx-1">
                                                                        <div className="text-[12px]">Terapeuta: Maria Santos</div>
                                                                        <div className="text-[12px]">08:30 - 09:00</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                return (
                                                    <td key={index} className={`border-2 bg-[#F2F2F2] border-gray-300 ${cairo.className}`}></td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {
                isAddLegendaModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-[600]">
                        <div className="absolute inset-0 bg-black opacity-50" onClick={handleAddLegendaModal}></div>
                        <div className="bg-white rounded-lg shadow-lg z-10 w-[500px]">
                            <h2 className={`flex text-2xl font-bold mb-8 items-center justify-center text-white bg-[#6D9CE3] py-1 mt-5 ${inter.className}`}>
                                <svg className="me-3" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.7359 24.5233H17.3008V17.2642H24.5232V14.6994H17.3008V7.47696H14.7359V14.6994H7.47684V17.2642H14.7359V24.5233ZM3.87479 31.2503C3.00854 31.2503 2.27124 30.9459 1.66288 30.3373C1.05421 29.7289 0.749878 28.9916 0.749878 28.1253V3.87492C0.749878 3.00867 1.05421 2.27136 1.66288 1.663C2.27124 1.05433 3.00854 0.75 3.87479 0.75H28.1252C28.9915 0.75 29.7288 1.05433 30.3371 1.663C30.9458 2.27136 31.2501 3.00867 31.2501 3.87492V28.1253C31.2501 28.9916 30.9458 29.7289 30.3371 30.3373C29.7288 30.9459 28.9915 31.2503 28.1252 31.2503H3.87479ZM3.87892 28.6854H28.1211C28.2623 28.6854 28.3915 28.6266 28.5088 28.509C28.6265 28.3916 28.6853 28.2624 28.6853 28.1212V3.87904C28.6853 3.73787 28.6265 3.60863 28.5088 3.49129C28.3915 3.37365 28.2623 3.31483 28.1211 3.31483H3.87892C3.73775 3.31483 3.6085 3.37365 3.49117 3.49129C3.37353 3.60863 3.31471 3.73787 3.31471 3.87904V28.1212C3.31471 28.2624 3.37353 28.3916 3.49117 28.509C3.6085 28.6266 3.73775 28.6854 3.87892 28.6854Z" fill="#E8EAED" />
                                </svg>
                                Adicionar Legenda
                            </h2>
                            <form
                                className="mx-16"
                                onSubmit={() => {
                                    const legendaText = (document.getElementById('legendaText') as HTMLInputElement).value.trim();
                                    handleAddLegenda(legendaText);
                                }}
                            >
                                <input
                                    type="text"
                                    className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-4"
                                    placeholder="Digite a legenda"
                                    id="legendaText"
                                    required
                                />
                                <div className="flex items-center justify-between mb-8">
                                    <button
                                        type="button"
                                        onClick={handleAddLegendaModal}
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
                )
            }
            {
                isRemoveLegendaModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-[600]">
                        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsRemoveLegendaModalOpen(false)}></div>
                        <div className="bg-white rounded-lg shadow-lg z-10 w-[500px]">
                            <h2 className={`flex text-2xl font-bold mb-8 items-center justify-center text-white bg-[#6D9CE3] py-1 mt-5 ${inter.className}`}>
                                <svg className="me-3" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.4 24.3807L16 17.7808L22.6 24.3807L24.3893 22.6001L17.7893 16.0001L24.3893 9.40012L22.6 7.61079L16 14.2108L9.4 7.61079L7.61938 9.40012L14.2194 16.0001L7.61938 22.6001L9.4 24.3807ZM3.87479 31.2502C3.00854 31.2502 2.27124 30.9459 1.66288 30.3372C1.05421 29.7289 0.749878 28.9916 0.749878 28.1253V3.87492C0.749878 3.00867 1.05421 2.27136 1.66288 1.663C2.27124 1.05433 3.00854 0.75 3.87479 0.75H28.1252C28.9915 0.75 29.7288 1.05433 30.3371 1.663C30.9458 2.27136 31.2501 3.00867 31.2501 3.87492V28.1253C31.2501 28.9916 30.9458 29.7289 30.3371 30.3372C29.7288 30.9459 28.9915 31.2502 28.1252 31.2502H3.87479ZM3.87892 28.6854H28.1211C28.2623 28.6854 28.3915 28.6266 28.5088 28.509C28.6265 28.3916 28.6853 28.2624 28.6853 28.1212V3.87904C28.6853 3.73787 28.6265 3.60862 28.5088 3.49129C28.3915 3.37365 28.2623 3.31483 28.1211 3.31483H3.87892C3.73775 3.31483 3.6085 3.37365 3.49117 3.49129C3.37353 3.60862 3.31471 3.73787 3.31471 3.87904V28.1212C3.31471 28.2624 3.37353 28.3916 3.49117 28.509C3.6085 28.6266 3.73775 28.6854 3.87892 28.6854Z" fill="#E8EAED" />
                                </svg>
                                Remover Legenda
                            </h2>
                            <div className="mx-16">
                                <h2 className={`mb-5 text-center ${inter.className}`}>
                                    Tem certeza que deseja remover a Legenda "{legendaParaRemover?.text}"?
                                </h2>
                                <div className="flex items-center justify-between mb-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsRemoveLegendaModalOpen(false)}
                                        className="bg-[#F2F2F2] border-2 border-gray-300 text-black rounded-lg py-2 w-[115px]"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteLegenda(legendaIndex as number)}
                                        className="bg-blue-500 text-white rounded-lg py-2 w-[115px]"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
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
        </div >
        :
        <section className="bg-[url('/bg_login.jpeg')] bg-cover bg-no-repeat flex justify-center items-center h-[1080px]">
            <div className="flex justify-center items-center mt-32 mb-32">
                <div className="max-w-lg border border-gray-400 bg-white rounded-3xl shadow flex flex-col items-center h-auto overflow-hidden">
                    <div className="flex flex-row w-card-login items-center justify-center mt-14">
                        <Link href="/" className="flex">
                            <img src="./../logo.png" alt="Icone do Sistema Íris" className="w-32" />
                            <h1 className={`text-7xl ms-1 text-color-logo ${cairo.className}`}>
                                ÍRIS
                            </h1>
                        </Link>
                    </div>
                    <div className="flex justify-center items-center mt-10 mb-10">
                        <p className={`text-2xl text-color-logo ${cairo.className}`}>
                            404 - Página não encontrada
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}