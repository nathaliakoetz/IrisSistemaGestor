'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importando o CSS padrão do react-calendar
import { useState } from 'react';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRemoveLegendaModalOpen, setIsRemoveLegendaModalOpen] = useState(false);
    const [legendas, setLegendas] = useState<{ text: string, color: string }[]>([]);
    const [legendaParaRemover, setLegendaParaRemover] = useState<{ text: string, color: string } | null>(null);
    const [legendaIndex, setLegendaIndex] = useState<number | null>(null);

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

    const handleModalOpening = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleRemoveLegendaModalOpening = (index: number) => {
        setLegendaParaRemover(legendas[index]);
        setLegendaIndex(index);
        setIsRemoveLegendaModalOpen(true);
    };

    const handleAddLegenda = (text: string) => {
        const newColor = generateUniqueColor(legendas.map(legenda => legenda.color));
        setLegendas([...legendas, { text, color: newColor }]);
        handleModalOpening();
    };

    const handleDeleteLegenda = (index: number) => {
        setLegendas(legendas.filter((_, i) => i !== index));
        setIsRemoveLegendaModalOpen(false);
    };

    return (
        <div className="flex">
            <SideBar activeLink="agenda" />
            <div className="flex flex-col flex-1">
                <TopBar />
                <div className="flex flex-1">
                    <div className="w-[325px] p-4 border-r-2 border-gray-300">
                        <Calendar
                            onChange={(value) => setSelectedDate(value as Date)}
                            value={selectedDate}
                            tileClassName={tileClassName}
                            tileDisabled={tileDisabled}
                            locale="pt-BR"
                        />
                        <div className="mt-4">
                            <div className="flex justify-start gap-2 text-xl items-center">
                                <h2>Legenda</h2>
                                <button onClick={handleModalOpening} className="text-[#6D 9CE3]">+</button>
                            </div>
                            <ul>
                                {legendas.map((legenda, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: legenda.color }}></span>
                                        <span style={{ color: legenda.color }}>{legenda.text}</span>
                                        <button
                                            onClick={() => handleRemoveLegendaModalOpening(index)}
                                            className="ml-2 text-center text-red-500"
                                        >
                                            -
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex-1 p-4">
                        {/* Conteúdo principal */}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[600]">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={handleModalOpening}></div>
                    <div className="bg-white rounded-function lg shadow-lg z-10 w-[500px]">
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
                                    onClick={handleModalOpening}
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
            {isRemoveLegendaModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[600]">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsRemoveLegendaModalOpen(false)}></div>
                    <div className="bg-white rounded-function lg shadow-lg z-10 w-[500px]">
                        <h2 className={`flex text-2xl font-bold mb-8 items-center justify-center text-white bg-[#6D9CE3] py-1 mt-5 ${inter.className}`}>
                            <svg className="me-3" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.7359 24.5233H17.3008V17.2642H24.5232V14.6994H17.3008V7.47696H14.7359V14.6994H7.47684V17.2642H14.7359V24.5233ZM3.87479 31.2503C3.00854 31.2503 2.27124 30.9459 1.66288 30.3373C1.05421 29.7289 0.749878 28.9916 0.749878 28.1253V3.87492C0.749878 3.00867 1.05421 2.27136 1.66288 1.663C2.27124 1.05433 3.00854 0.75 3.87479 0.75H28.1252C28.9915 0.75 29.7288 1.05433 30.3371 1.663C30.9458 2.27136 31.2501 3.00867 31.2501 3.87492V28.1253C31.2501 28.9916 30.9458 29.7289 30.3371 30.3373C29.7288 30.9459 28.9915 31.2503 28.1252 31.2503H3.87479ZM3.87892 28.6854H28.1211C28.2623 28.6854 28.3915 28.6266 28.5088 28.509C28.6265 28.3916 28.6853 28.2624 28.6853 28.1212V3.87904C28.6853 3.73787 28.6265 3.60863 28.5088 3.49129C28.3915 3.37365 28.2623 3.31483 28.1211 3.31483H3.87892C3.73775 3.31483 3.6085 3.37365 3.49117 3.49129C3.37353 3.60863 3.31471 3.73787 3.31471 3.87904V28.1212C3.31471 28.2624 3.37353 28.3916 3.49117 28.509C3.6085 28.6266 3.73775 28.6854 3.87892 28.6854Z" fill="#E8EAED" />
                            </svg>
                            Remover Legenda
                        </h2>
                        <div className="mx-16">
                            <h2 className="mb-5">
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
            )}
        </div>
    );
}