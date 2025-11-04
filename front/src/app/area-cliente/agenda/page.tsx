'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importando o CSS padrão do react-calendar
import { useEffect, useState } from 'react';
import { useClinicaStore } from "@/context/clinica";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { ClinicaI } from "@/utils/types/clinicas";
import { LegendaI } from "@/utils/types/legendas";
import { ConsultaI } from "@/utils/types/consultas";
import { TerapeutaI } from "@/utils/types/terapeutas";
import { DependenteI } from "@/utils/types/dependentes";

export default function AreaAgenda() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const currentDate = new Date();
    const [legendas, setLegendas] = useState<LegendaI[]>([]);
    const [consultas, setConsultas] = useState<ConsultaI[]>([]);
    const [terapeutas, setTerapeutas] = useState<TerapeutaI[]>([]);
    const [pacientes, setPacientes] = useState<DependenteI[]>([]);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
    const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);
    const [tooltipText, setTooltipText] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
    const [isAddConsultaOpen, setisAddConsultaOpen] = useState(false);
    const [isDesmarcarModalOpen, setIsDesmarcarModalOpen] = useState(false);
    const [consultaParaDesmarcar, setConsultaParaDesmarcar] = useState<ConsultaI | null>(null);
    const [dadosClinica, setDadosClinica] = useState<ClinicaI>();
    const [formData, setFormData] = useState({
        pacienteId: '',
        terapeutaId: '',
        data: '',
        horario: ''
    });
    const { clinica } = useClinicaStore();
    const router = useRouter();

    async function buscaLegendas(clinicaId: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/legendas/clinica/${clinicaId}`, {
                method: "GET"
            })

            if (response.status === 200) {
                const legendasData = await response.json()
                setLegendas(legendasData)
            }
        } catch (error) {
            console.error('Erro ao buscar legendas:', error)
        }
    }

    async function buscaConsultas(clinicaId: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/${clinicaId}`, {
                method: "GET"
            })

            if (response.status === 200) {
                const consultasData = await response.json()
                console.log('Consultas carregadas:', consultasData)
                setConsultas(consultasData)
            }
        } catch (error) {
            console.error('Erro ao buscar consultas:', error)
        }
    }

    async function buscaTerapeutas(clinicaId: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/terapeutas/clinica/${clinicaId}`, {
                method: "GET"
            })

            if (response.status === 200) {
                const terapeutasData = await response.json()
                setTerapeutas(terapeutasData)
            }
        } catch (error) {
            console.error('Erro ao buscar terapeutas:', error)
        }
    }

    async function buscaPacientes(clinicaId: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dependentesClinicas/${clinicaId}`, {
                method: "GET"
            })

            if (response.status === 200) {
                const dependentesClinicasData = await response.json()
                // Extrair apenas os dependentes do array de dependenteClinica
                const pacientesData = dependentesClinicasData.map((dc: { dependente: DependenteI }) => dc.dependente)
                setPacientes(pacientesData)
            }
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error)
        }
    }

    async function buscaHorariosDisponiveis(clinicaId: string, data: string) {
        try {
            // Primeiro, buscar todos os horários da clínica para essa data
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clinicas/horarios/${clinicaId}`, {
                method: "GET"
            })

            if (response.status === 200) {
                const horariosData = await response.json()
                // Encontrar horários para a data específica
                const horarioParaData = horariosData.find((h: { data: string }) => {
                    const dataHorario = new Date(h.data).toISOString().split('T')[0]
                    return dataHorario === data
                })

                if (horarioParaData) {
                    // Filtrar horários já ocupados por consultas
                    if (consultas.length > 0) {
                        const horariosOcupados = consultas
                            .filter(consulta => {
                                const consultaDate = new Date(consulta.dataInicio).toISOString().split('T')[0]
                                return consultaDate === data && !consulta.dataFim
                            })
                            .map(consulta => {
                                const hora = new Date(consulta.dataInicio).toTimeString().slice(0, 5)
                                return hora
                            })
                        const horariosDisponiveis = horarioParaData.horarios.filter((horario: string) => !horariosOcupados.includes(horario))
                        setHorariosDisponiveis(horariosDisponiveis)
                    } else {
                        setHorariosDisponiveis(horarioParaData.horarios)
                    }
                } else {
                    // Se não há horários cadastrados para essa data, não exibir nenhum horário
                    setHorariosDisponiveis([])
                }
            }
        } catch (error) {
            console.error('Erro ao buscar horários disponíveis:', error)
            // Em caso de erro, não exibir horários
            setHorariosDisponiveis([])
        }
    }

    useEffect(() => {
        async function buscaClinica(id: string) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clinicas/${id}`, {
                method: "GET"
            })

            if (response.status == 200) {
                const dados = await response.json()
                setDadosClinica(dados)
                
                // Buscar legendas da clínica
                await buscaLegendas(id)
                // Buscar consultas da clínica
                await buscaConsultas(id)
                // Buscar terapeutas da clínica
                await buscaTerapeutas(id)
                // Buscar pacientes da clínica
                await buscaPacientes(id)
            } else if (response.status == 400) {
                Cookies.remove('logged')
                sessionStorage.removeItem("logged")
                router.push("/area-cliente/error")
            }
        }

        if (!clinica.id && !Cookies.get("authID")) {
            sessionStorage.removeItem("logged")
            //router.push("/area-cliente/error")
        } else if (Cookies.get("authID")) {
            const authID = Cookies.get("authID") as string
            buscaClinica(authID)
        } else {
            buscaClinica(clinica.id)
        }
    }, [])

    // useEffect para atualizar horários disponíveis quando consultas mudarem
    useEffect(() => {
        if (formData.data && dadosClinica?.id) {
            buscaHorariosDisponiveis(dadosClinica.id, formData.data);
        }
    }, [consultas, formData.data, dadosClinica?.id]);

    const handleAddConsultaOpening = () => {
        setisAddConsultaOpen(!isAddConsultaOpen);
        // Limpar formulário ao abrir
        if (!isAddConsultaOpen) {
            setFormData({
                pacienteId: '',
                terapeutaId: '',
                data: '',
                horario: ''
            });
            setHorariosDisponiveis([]);
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Se o campo alterado for a data, buscar horários disponíveis
        if (name === 'data' && value && dadosClinica?.id) {
            await buscaHorariosDisponiveis(dadosClinica.id, value);
        }
    };

    const handleSubmitConsulta = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Combinar data e horário no mesmo formato da área-cliente
            const dataHora = `${formData.data} ${formData.horario}`;

            const consultaData = {
                clinicaId: dadosClinica?.id,
                terapeutaId: formData.terapeutaId,
                pacienteId: formData.pacienteId,
                dataInicio: dataHora
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(consultaData)
            });

            if (response.status === 201) {
                // Recarregar consultas
                if (dadosClinica?.id) {
                    await buscaConsultas(dadosClinica.id);
                    // Recarregar horários disponíveis para a data selecionada
                    if (formData.data) {
                        await buscaHorariosDisponiveis(dadosClinica.id, formData.data);
                    }
                }
                // Fechar modal e limpar formulário
                setisAddConsultaOpen(false);
                setFormData({
                    pacienteId: '',
                    terapeutaId: '',
                    data: '',
                    horario: ''
                });
                toast.success('Consulta adicionada com sucesso!');
            } else {
                const errorData = await response.json();
                toast.error(`Erro ao adicionar consulta: ${errorData.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao adicionar consulta:', error);
            toast.error('Erro ao adicionar consulta. Tente novamente.');
        }
    };

    const toggleExpand = (index: number) => {
        setExpandedAppointment(expandedAppointment === index ? null : index);
    };

    const openDesmarcarModal = (consulta: ConsultaI) => {
        setConsultaParaDesmarcar(consulta);
        setIsDesmarcarModalOpen(true);
    };

    const closeDesmarcarModal = () => {
        setIsDesmarcarModalOpen(false);
        setConsultaParaDesmarcar(null);
    };

    const desmarcarConsulta = async () => {
        if (!consultaParaDesmarcar) return;
        closeDesmarcarModal();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/desmarcar/${consultaParaDesmarcar.id}`, {
                method: 'DELETE'
            });

            if (response.status === 200) {
                toast.success("Consulta desmarcada com sucesso!");
                if (dadosClinica?.id) {
                    await buscaConsultas(dadosClinica.id);
                }
            } else {
                toast.error("Erro ao desmarcar consulta!");
            }
        } catch {
            toast.error("Erro ao desmarcar consulta!");
        }
    };

    // Função para obter a cor do terapeuta
    const getCorTerapeuta = (terapeutaId: string): string => {
        for (const legenda of legendas) {
            const legendaTerapeuta = legenda.LegendaTerapeuta?.find(lt => lt.terapeutaId === terapeutaId);
            if (legendaTerapeuta) {
                return legenda.cor;
            }
        }
        return '#999999'; // Cor padrão se não encontrar
    };

    // Função para obter consultas de um dia específico
    const getConsultasDoDia = (data: Date): ConsultaI[] => {
        const dataString = data.toISOString().split('T')[0];
        return consultas.filter(consulta => {
            const consultaData = new Date(consulta.dataInicio).toISOString().split('T')[0];
            return consultaData === dataString;
        });
    };

    // Função para obter consultas de uma hora específica em um dia
    const getConsultasHoraDia = (data: Date, hora: number): ConsultaI[] => {
        const consultasDoDia = getConsultasDoDia(data);
        const consultasHora = consultasDoDia.filter(consulta => {
            const horaConsulta = new Date(consulta.dataInicio).getHours();
            return horaConsulta === hora;
        });
        
        // Ordenar por horário (minutos)
        return consultasHora.sort((a, b) => {
            const horaA = new Date(a.dataInicio).getTime();
            const horaB = new Date(b.dataInicio).getTime();
            return horaA - horaB;
        });
    };

    useEffect(() => {
        if (!sessionStorage.getItem("logged")) {
            const timer = setTimeout(() => {
                router.push("/signin");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [router]);

    // Função para renderizar as consultas em uma célula da tabela
    const renderConsultasCell = (data: Date, hora: number) => {
        const consultasHora = getConsultasHoraDia(data, hora);
        const cellKey = `${data.getTime()}-${hora}`;
        
        if (consultasHora.length === 0) {
            return <td key={cellKey} className={`border-2 bg-[#F2F2F2] border-gray-300 ${cairo.className}`}></td>;
        }

        return (
            <td key={cellKey} className={`border-2 bg-[#F2F2F2] border-gray-300 ${cairo.className}`}>
                <div className="flex flex-col">
                    {consultasHora.map((consulta, consultaIndex) => {
                        const corTerapeuta = getCorTerapeuta(consulta.terapeutaId);
                        const uniqueKey = `${consulta.id}-${consultaIndex}`;
                        
                        return (
                            <div key={uniqueKey}>
                                <div
                                    className={`cursor-pointer p-1 rounded mb-1 ${expandedAppointment === consulta.id ? 'pb-2' : ''}`}
                                    style={{ 
                                        backgroundColor: corTerapeuta + '40', // 40 para opacity
                                        borderLeft: `6px solid ${corTerapeuta}`
                                    }}
                                    onClick={() => toggleExpand(consulta.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="mx-1 text-sm">{consulta.paciente?.nome || 'Paciente não informado'}</span>
                                        <span 
                                            className="mx-1 min-w-3 min-h-3 rounded-full border border-white" 
                                            style={{ backgroundColor: corTerapeuta }} 
                                        />
                                    </div>
                                    {expandedAppointment === consulta.id && (
                                        <div className="mx-1 mt-2 pt-2 border-t border-gray-400">
                                            <div className="text-[12px]">Terapeuta: {consulta.terapeuta.nome}</div>
                                            <div className="text-[12px] mb-2">
                                                Horário: {new Date(consulta.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {consulta.dataFim ? (
                                                <div className="text-[10px] text-green-600 font-semibold">
                                                    ✓ Finalizada
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDesmarcarModal(consulta);
                                                    }}
                                                    className="text-[10px] bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                                                >
                                                    Desmarcar
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </td>
        );
    };

    const tileClassName = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === currentDate.toDateString();

            return isSelected ? 'highlight-selected' : (isToday ? 'remove-today-highlight' : '');
        }
        return '';
    };

    const renderWeekRange = (date: Date | null) => {
        if (!date) return '';

        const startOfWeek = new Date(date);
        // Ajustar para segunda-feira como primeiro dia da semana
        const currentDay = startOfWeek.getDay();
        const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
        startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Se a semana começa na segunda, termina no domingo

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
        // Ajustar para segunda-feira como primeiro dia da semana
        const currentDay = startOfWeek.getDay();
        const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
        startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Se a semana começa na segunda, termina no domingo

        // Formatar dias e meses sem o ano
        const options = { day: '2-digit', month: '2-digit' } as const;
        const formattedStart = startOfWeek.toLocaleDateString('pt-BR', options);
        const formattedEnd = endOfWeek.toLocaleDateString('pt-BR', options);

        return `${formattedStart} - ${formattedEnd}`;
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
    } else {

        return (
            <>
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
                                    <h2>Terapeutas</h2>
                                </div>
                                <ul>
                                    {legendas.map((legenda, index) => 
                                        legenda.LegendaTerapeuta?.map((legendaTerapeuta, terapeutaIndex) => (
                                            <li key={`${index}-${terapeutaIndex}`} className="flex items-center mb-1">
                                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: legenda.cor }}></span>
                                                <span
                                                    className="text-ellipsis overflow-hidden whitespace-nowrap"
                                                    style={{ color: legenda.cor, maxWidth: 'calc(100% - 20px)' }}
                                                    onMouseEnter={(e) => {
                                                        setTooltipText(`${legendaTerapeuta.terapeuta.nome} - ${legendaTerapeuta.terapeuta.profissao}`);
                                                        setTooltipPosition({ x: e.clientX, y: e.clientY });
                                                    }}
                                                    onMouseLeave={() => {
                                                        setTooltipText(null);
                                                        setTooltipPosition(null);
                                                    }}
                                                >
                                                    {legendaTerapeuta.terapeuta.nome}
                                                </span>
                                            </li>
                                        ))
                                    )}
                                </ul>
                                {tooltipText && tooltipPosition && (
                                    <div
                                        className="absolute bg-gray-700 text-white text-sm rounded p-2"
                                        style={{
                                            top: tooltipPosition.y + 10,
                                            left: tooltipPosition.x + 10,
                                            zIndex: 1000,
                                            pointerEvents: 'none',
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
                                                {Array(7).fill(null).map((_, dayIndex) => {
                                                    // Calcular a data para este dia da semana
                                                    if (!selectedDate) return <td key={dayIndex} className={`border-2 bg-[#F2F2F2] border-gray-300 ${cairo.className}`}></td>;
                                                    
                                                    const startOfWeek = new Date(selectedDate);
                                                    // Ajustar para segunda-feira (1) como primeiro dia da semana
                                                    const currentDay = startOfWeek.getDay(); // 0 = domingo, 1 = segunda, etc.
                                                    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Se domingo, volta 6 dias; senão, volta (dia atual - 1)
                                                    startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);
                                                    
                                                    const currentDayDate = new Date(startOfWeek);
                                                    currentDayDate.setDate(startOfWeek.getDate() + dayIndex); // Add dayIndex to get the correct day
                                                    
                                                    return renderConsultasCell(currentDayDate, hora);
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
                            <form className="mx-16" onSubmit={handleSubmitConsulta}>
                                <select 
                                    name="pacienteId"
                                    value={formData.pacienteId}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-4" 
                                    required
                                >
                                    <option value="">Selecione o Paciente</option>
                                    {pacientes.map((paciente) => (
                                        <option key={paciente.id} value={paciente.id}>
                                            {paciente.nome}
                                        </option>
                                    ))}
                                </select>
                                <select 
                                    name="terapeutaId"
                                    value={formData.terapeutaId}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-4" 
                                    required
                                >
                                    <option value="">Selecione o Terapeuta</option>
                                    {terapeutas.map((terapeuta) => (
                                        <option key={terapeuta.id} value={terapeuta.id}>
                                            {terapeuta.nome} - {terapeuta.profissao}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    name="data"
                                    value={formData.data}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-4"
                                    required
                                />
                                <select 
                                    name="horario"
                                    value={formData.horario}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-8" 
                                    required
                                >
                                    <option value="">
                                        {horariosDisponiveis.length > 0 
                                            ? "Selecione o Horário" 
                                            : formData.data 
                                                ? "Nenhum horário disponível para esta data" 
                                                : "Selecione primeiro uma data"
                                        }
                                    </option>
                                    {horariosDisponiveis.map((horario) => (
                                        <option key={horario} value={horario}>
                                            {horario}
                                        </option>
                                    ))}
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
                {isDesmarcarModalOpen && consultaParaDesmarcar && (
                    <div className="fixed inset-0 flex items-center justify-center z-[600]">
                        <div className="absolute inset-0 bg-black opacity-50" onClick={closeDesmarcarModal}></div>
                        <div className="bg-white rounded-lg shadow-lg z-10 w-[400px] p-6">
                            <h2 className={`text-2xl font-bold mb-4 ${inter.className}`}>
                                Desmarcar Consulta
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Tem certeza que deseja desmarcar a consulta de {consultaParaDesmarcar.paciente?.nome}?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={closeDesmarcarModal}
                                    className="bg-[#F2F2F2] border-2 border-gray-300 text-black rounded-lg py-2 px-4"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={desmarcarConsulta}
                                    className="bg-red-500 text-white rounded-lg py-2 px-4"
                                >
                                    Desmarcar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isDesmarcarModalOpen && consultaParaDesmarcar && (
                    <div className="fixed inset-0 flex items-center justify-center z-[600]">
                        <div className="absolute inset-0 bg-black opacity-50" onClick={closeDesmarcarModal}></div>
                        <div className="bg-white rounded-lg shadow-lg z-10 w-[500px]">
                            <h2 className={`flex text-2xl font-bold mb-8 items-center justify-center text-white bg-[#6D9CE3] py-1 mt-5 ${inter.className}`}>
                                <svg className="me-3" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.4 24.3807L16 17.7808L22.6 24.3807L24.3893 22.6001L17.7893 16.0001L24.3893 9.40012L22.6 7.61079L16 14.2108L9.4 7.61079L7.61938 9.40012L14.2194 16.0001L7.61938 22.6001L9.4 24.3807ZM3.87479 31.2502C3.00854 31.2502 2.27124 30.9459 1.66288 30.3372C1.05421 29.7289 0.749878 28.9916 0.749878 28.1253V3.87492C0.749878 3.00867 1.05421 2.27136 1.66288 1.663C2.27124 1.05433 3.00854 0.75 3.87479 0.75H28.1252C28.9915 0.75 29.7288 1.05433 30.3371 1.663C30.9458 2.27136 31.2501 3.00867 31.2501 3.87492V28.1253C31.2501 28.9916 30.9458 29.7289 30.3371 30.3372C29.7288 30.9459 28.9915 31.2502 28.1252 31.2502H3.87479ZM3.87892 28.6854H28.1211C28.2623 28.6854 28.3915 28.6266 28.5088 28.509C28.6265 28.3916 28.6853 28.2624 28.6853 28.1212V3.87904C28.6853 3.73787 28.6265 3.60862 28.5088 3.49129C28.3915 3.37365 28.2623 3.31483 28.1211 3.31483H3.87892C3.73775 3.31483 3.6085 3.37365 3.49117 3.49129C3.37353 3.60862 3.31471 3.73787 3.31471 3.87904V28.1212C3.31471 28.2624 3.37353 28.3916 3.49117 28.509C3.6085 28.6266 3.73775 28.6854 3.87892 28.6854Z" fill="#E8EAED" />
                                </svg>
                                Desmarcar Consulta
                            </h2>
                            <div className="mx-16 mb-8">
                                <p className="mb-4">Tem certeza que deseja desmarcar a consulta?</p>
                                <p><strong>Paciente:</strong> {consultaParaDesmarcar.paciente?.nome}</p>
                                <p><strong>Terapeuta:</strong> {consultaParaDesmarcar.terapeuta.nome}</p>
                                <p><strong>Hora de Início:</strong> {new Date(consultaParaDesmarcar.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                <div className="flex items-center justify-between mt-5">
                                    <button onClick={closeDesmarcarModal} className="bg-gray-300 text-black rounded-lg py-2 px-4">Cancelar</button>
                                    <button onClick={desmarcarConsulta} className="bg-red-500 text-white rounded-lg py-2 px-4">Desmarcar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
                <style jsx global>{`
                    .react-calendar {
                        border-radius: 8px;
                        transition: all 0.3s ease-in-out;
                    }

                    .react-calendar__tile {
                        border-radius: 50%;
                        transition: all 0.3s ease-in-out;
                    }

                    .react-calendar__tile:hover {
                        background-color: #a0c4ff !important;
                        transform: scale(1.05);
                    }

                    .react-calendar__tile--active {
                        background-color: #6D9CE3 !important;
                        color: white !important;
                    }

                    .highlight-selected {
                        background-color: #6D9CE3 !important;
                        color: white !important;
                        font-weight: bold;
                    }

                    .remove-today-highlight {
                        background-color: transparent !important;
                    }

                    .react-calendar__month-view__days__day--weekend {
                        color: #ff8c42;
                    }

                    .react-calendar__navigation button:hover {
                        background-color: #e0e0e0;
                        border-radius: 5px;
                    }
                `}</style>
            </>
        )
    }
}