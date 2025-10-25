'use client'

import { SideBarMedico } from "@/components/SideBarMedico";
import { TopBarMedico } from "@/components/TopBarMedico";
import { cairo, inter } from "@/utils/fonts";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from 'react';
import { useTerapeutaStore } from "@/context/terapeuta";
import { useRouter } from "next/navigation";
import { ConsultaI } from "@/utils/types/consultas";
import Cookies from "js-cookie";
import Link from "next/link";

export default function AgendaMedica() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [consultas, setConsultas] = useState<ConsultaI[]>([]);
    const { terapeuta } = useTerapeutaStore();
    const router = useRouter();

    async function buscaConsultas(terapeutaId: string, clinicaId: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/terapeuta/${terapeutaId}/${clinicaId}`, {
                method: "GET"
            })

            if (response.status === 200) {
                const consultasData = await response.json()
                setConsultas(consultasData)
            }
        } catch (error) {
            console.error('Erro ao buscar consultas:', error)
        }
    }

    useEffect(() => {
        if (terapeuta.id && terapeuta.clinicaId) {
            buscaConsultas(terapeuta.id, terapeuta.clinicaId)
        }
    }, [terapeuta])

    const tileClassName = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();

            // Verificar se há consultas neste dia
            const temConsultas = consultas.some(consulta => {
                const consultaDate = new Date(consulta.dataInicio).toDateString();
                return consultaDate === date.toDateString();
            });

            if (temConsultas) {
                return isSelected ? 'highlight-selected has-appointments' : 'has-appointments';
            }

            return isSelected ? 'highlight-selected' : (isToday ? 'remove-today-highlight' : '');
        }
        return '';
    };

    const consultasDoDia = consultas
        .filter(consulta => {
            const consultaDate = new Date(consulta.dataInicio).toDateString();
            const selectedDateString = selectedDate?.toDateString();
            return consultaDate === selectedDateString;
        })
        .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());

    const consultasAgendadas = consultasDoDia.filter(c => !c.dataFim);
    const consultasFinalizadas = consultasDoDia.filter(c => c.dataFim);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const openDetailsPage = (consultaId: number) => {
        router.push(`/area-medica/detalhes-consulta/${consultaId}`);
    };

    if (!sessionStorage.getItem("logged")) {
        return (
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
                                Acesso negado.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <main className="w-full h-screen flex overflow-hidden bg-[#f7f7f7]">
            <SideBarMedico activeLink="agenda" />
            <div className="w-full overflow-y-auto">
                <TopBarMedico />
                <div className="mx-5 my-10">
                    <h1 className={`text-3xl font-bold text-color-logo ${cairo.className}`}>
                        Minha Agenda
                    </h1>
                    <p className={`text-base text-gray-600 mt-1 ${inter.className}`}>
                        Visualize e gerencie suas consultas
                    </p>

                    <div className="flex gap-8 mt-8">
                        {/* Coluna Esquerda - Calendário */}
                        <div className="w-96">
                            <div className="bg-white rounded-2xl shadow p-6">
                                <h2 className={`text-xl font-bold text-color-logo mb-4 ${cairo.className}`}>
                                    Calendário
                                </h2>
                                <Calendar
                                    onChange={(value) => setSelectedDate(value as Date)}
                                    value={selectedDate}
                                    tileClassName={tileClassName}
                                    locale="pt-BR"
                                />
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                        <span className={`text-gray-600 ${inter.className}`}>Dias com consultas</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coluna Direita - Lista de Consultas */}
                        <div className="flex-1">
                            <div className="bg-white rounded-2xl shadow p-6 mb-6">
                                <h2 className={`text-xl font-bold text-color-logo mb-4 ${cairo.className}`}>
                                    Consultas Agendadas - {selectedDate ? formatDate(selectedDate.toISOString()) : 'Hoje'}
                                </h2>

                                {consultasAgendadas.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className={`text-gray-500 ${inter.className}`}>
                                            Nenhuma consulta agendada para este dia
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {consultasAgendadas.map((consulta) => (
                                            <div
                                                key={consulta.id}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                                                onClick={() => openDetailsPage(consulta.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-blue-100 rounded-full p-3">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#6D9CE3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold text-gray-900 ${inter.className}`}>
                                                            {consulta.paciente?.nome || "Sem paciente"}
                                                        </p>
                                                        <p className={`text-sm text-gray-500 ${inter.className}`}>
                                                            {consulta.dataInicio.split(' ')[1].slice(0, 5)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                        Agendada
                                                    </span>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 18L15 12L9 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {consultasFinalizadas.length > 0 && (
                                <div className="bg-white rounded-2xl shadow p-6">
                                    <h2 className={`text-xl font-bold text-color-logo mb-4 ${cairo.className}`}>
                                        Consultas Finalizadas
                                    </h2>
                                    <div className="space-y-3">
                                        {consultasFinalizadas.map((consulta) => (
                                            <div
                                                key={consulta.id}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                                                onClick={() => openDetailsPage(consulta.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-green-100 rounded-full p-3">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold text-gray-900 ${inter.className}`}>
                                                            {consulta.paciente?.nome || "Sem paciente"}
                                                        </p>
                                                        <p className={`text-sm text-gray-500 ${inter.className}`}>
                                                            {consulta.dataInicio.split(' ')[1].slice(0, 5)} - {consulta.dataFim?.split(' ')[1].slice(0, 5)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                        Finalizada
                                                    </span>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 18L15 12L9 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .react-calendar {
                    width: 100% !important;
                    border: none !important;
                    font-family: inherit;
                }

                .react-calendar__tile {
                    padding: 1em 0.5em;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .react-calendar__tile:hover {
                    background-color: #e5f0ff !important;
                }

                .react-calendar__tile--active {
                    background-color: #6D9CE3 !important;
                    color: white !important;
                }

                .highlight-selected {
                    background-color: #6D9CE3 !important;
                    color: white !important;
                }

                .has-appointments {
                    position: relative;
                }

                .has-appointments::after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 6px;
                    background-color: #60A5FA;
                    border-radius: 50%;
                }

                .highlight-selected.has-appointments::after {
                    background-color: white;
                }

                .remove-today-highlight {
                    background-color: transparent !important;
                }

                .react-calendar__month-view__days__day--weekend {
                    color: #d87d4a;
                }

                .react-calendar__navigation button {
                    font-size: 1.1em;
                    font-weight: 600;
                    color: #192333;
                }

                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background-color: #e5f0ff;
                }
            `}</style>
        </main>
    )
}
