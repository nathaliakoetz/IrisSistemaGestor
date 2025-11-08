'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importando o CSS padrão do react-calendar
import { useEffect, useState } from 'react';
import { useClinicaStore } from "@/context/clinica";
import { ClinicaI } from "@/utils/types/clinicas";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DependenteClinicaI } from "@/utils/types/dependenteClinicas";
import { HorarioI } from "@/utils/types/horarios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ConsultaI } from "@/utils/types/consultas";

type InputsAddConsulta = {
    terapeutaId: string,
    pacienteId: string,
    hora: string
}

type InputsAddHorario = {
    hora: string
}


export default function AreaCliente() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isLogged, setIsLogged] = useState(true);
    const [horariosPorData, setHorariosPorData] = useState<string[]>([]);
    const [isAddConsultaOpen, setisAddConsultaOpen] = useState(false);
    const { clinica } = useClinicaStore();
    const [dadosClinica, setDadosClinica] = useState<ClinicaI>();
    const [dependentes, setDependentes] = useState<DependenteClinicaI[]>([]);
    const [consultas, setConsultas] = useState<ConsultaI[]>([]);
    const [horarios, setHorarios] = useState<{ [key: string]: string[] }>({});
    const router = useRouter();
    const { register, handleSubmit, reset } = useForm<InputsAddConsulta>()
    const [consultasFinalizadas, setConsultasFinalizadas] = useState<ConsultaI[]>([]);
    const [isAddHorarioModalOpen, setIsAddHorarioModalOpen] = useState(false);
    const [isDesmarcarModalOpen, setIsDesmarcarModalOpen] = useState(false);
    const [consultaParaDesmarcar, setConsultaParaDesmarcar] = useState<ConsultaI | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [terapeutaFiltro, setTerapeutaFiltro] = useState<string>("");

    // Função auxiliar para converter data para string YYYY-MM-DD
    // Usa horário local do navegador para datas selecionadas no calendário
    // Usa UTC para datas vindas do banco de dados
    const toDateString = (date: Date | string, useLocal: boolean = true): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        if (useLocal) {
            // Para datas do calendário (seleção do usuário), usa horário local
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } else {
            // Para datas do banco (em UTC), usa UTC
            const year = dateObj.getUTCFullYear();
            const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getUTCDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    };

    async function buscaConsultas(id: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/${id}`, {
            method: "GET"
        })

        if (response.status == 200) {
            const dados = await response.json()
            setConsultas(dados)
        }
    }

    async function buscaHorarios(id: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clinicas/horarios/${id}`, {
            method: "GET"
        })

        if (response.status == 200) {
            const dados = await response.json()
            console.log(dados)
            const horariosMap = dados.reduce((acc: { [key: string]: string[] }, horario: HorarioI) => {
                const dateKey = toDateString(horario.data, false); // false = usar UTC (dados do banco)
                acc[dateKey] = horario.horarios
                return acc
            }, {})
            console.log(horariosMap)
            setHorarios(horariosMap)
        }
    }

    useEffect(() => {
        // Inicializar data atual
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    }, []);

    useEffect(() => {
        // Verificar login no cliente
        if (typeof window !== 'undefined') {
            const logged = sessionStorage.getItem("logged");
            if (!logged) {
                setIsLogged(false);
                return;
            }
            setIsLogged(true);
        }

        async function buscaClinica(id: string) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clinicas/${id}`, {
                method: "GET"
            })

            if (response.status == 200) {
                const dados = await response.json()
                setDadosClinica(dados)
            } else if (response.status == 400) {
                Cookies.remove('logged')
                if (typeof window !== 'undefined') sessionStorage.removeItem("logged")
                router.push("/area-cliente/error")
            }
        }

        async function buscaDependentes(id: string) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dependentesClinicas/${id}`, {
                method: "GET"
            })

            if (response.status == 200) {
                const dados = await response.json()
                setDependentes(dados)
            }
        }

        if (!clinica.id && !Cookies.get("authID")) {
            if (typeof window !== 'undefined') sessionStorage.removeItem("logged");
        } else if (Cookies.get("authID")) {
            const authID = Cookies.get("authID") as string;
            buscaClinica(authID);
            buscaDependentes(authID);
            buscaConsultas(authID);
            buscaHorarios(authID);
        } else {
            buscaClinica(clinica.id);
            buscaDependentes(clinica.id);
            buscaConsultas(clinica.id);
            buscaHorarios(clinica.id);
        }

    }, []);

    useEffect(() => {
        if (selectedDate) {
            const formattedSelectedDate = toDateString(selectedDate, true); // true = usar horário local
            
            if (horarios[formattedSelectedDate]) {
                // Ordenar horários de forma crescente (00:00, 01:00, 02:00, etc.)
                const horariosOrdenados = [...horarios[formattedSelectedDate]].sort((a, b) => {
                    return a.localeCompare(b);
                });
                setHorariosPorData(horariosOrdenados);
            } else {
                setHorariosPorData([]);
            }
        }
    }, [selectedDate, horarios]);

    useEffect(() => {
        const filteredConsultas = consultas.filter(consulta => {
            const consultaDate = consulta.dataInicio ? new Date(consulta.dataInicio).toDateString() : '';
            const selectedDateString = selectedDate?.toDateString();
            return consultaDate === selectedDateString && consulta.dataFim;
        });
        setConsultasFinalizadas(filteredConsultas);
    }, [selectedDate, consultas]);

    const handleAddConsultaOpening = () => {
        setisAddConsultaOpen(!isAddConsultaOpen);
    };

    async function addConsulta(data: InputsAddConsulta) {
        setisAddConsultaOpen(!isAddConsultaOpen);

        const formattedSelectedDate = selectedDate ? toDateString(selectedDate, true) : toDateString(new Date(), true);
        const dataHora = String(formattedSelectedDate) + " " + String(data.hora);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clinicaId: dadosClinica?.id,
                terapeutaId: data.terapeutaId,
                pacienteId: data.pacienteId,
                dataInicio: dataHora
            })
        })

        if (response.status == 201) {
            toast.success("Consulta adicionada com sucesso!", { duration: 2000 })
            await buscaConsultas(dadosClinica!.id);
            await buscaHorarios(dadosClinica!.id);
            reset()
        } else if (response.status == 400) {
            const errorData = await response.json();
            toast.error(errorData.erro || "Erro ao adicionar consulta!", { duration: 2000 });
        } else {
            toast.error("Erro ao adicionar consulta!", { duration: 2000 })
        }
    };

    const tileClassName = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === currentDate.toDateString();

            if (isSelected) {
                return 'highlight-selected';
            } else if (isToday) {
                return 'remove-today-highlight';
            }
            return '';
        }
        return '';
    };

    const consultasDoDia = consultas
        .filter(consulta => {
            const consultaDateString = toDateString(consulta.dataInicio, false); // false = UTC (dados do banco)
            const selectedDateString = selectedDate ? toDateString(selectedDate, true) : null; // true = local (seleção do usuário)
            
            const matchesDate = consultaDateString === selectedDateString && !consulta.dataFim;
            const matchesTerapeuta = !terapeutaFiltro || consulta.terapeutaId === terapeutaFiltro;
            return matchesDate && matchesTerapeuta;
        })
        .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());

    const openDetailsPage = (consultaId: number) => {
        router.push(`/area-cliente/detalhes-consulta/${consultaId}?origem=geral`);
    };

    const handleAddHorarioOpening = () => {
        setIsAddHorarioModalOpen(true);
    };

    const handleAddHorarioClosing = () => {
        setIsAddHorarioModalOpen(false);
        reset();
    };

    async function addHorario(data: InputsAddHorario) {
        handleAddHorarioClosing();

        const formattedSelectedDate = selectedDate ? toDateString(selectedDate, true) : toDateString(new Date(), true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clinicas/horario`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clinicaId: dadosClinica?.id,
                data: formattedSelectedDate,
                horario: data.hora
            })
        })

        if (response.status == 201) {
            toast.success("Horário adicionado com sucesso!", { duration: 2000 })
            await buscaConsultas(dadosClinica!.id);
            await buscaHorarios(dadosClinica!.id);
            reset()
        } else {
            toast.error("Erro ao adicionar horário!", { duration: 2000 })
        }
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
                toast.success("Consulta desmarcada com sucesso!", { duration: 2000 });
                await buscaConsultas(dadosClinica!.id);
                await buscaHorarios(dadosClinica!.id);
            } else {
                toast.error("Erro ao desmarcar consulta!", { duration: 2000 });
            }
        } catch {
            toast.error("Erro ao desmarcar consulta!", { duration: 2000 });
        }
    };

    const DesmarcarConsultaModal = ({ isOpen, onClose, consulta, onConfirm }: { isOpen: boolean, onClose: () => void, consulta: ConsultaI | null, onConfirm: () => void }) => {
        if (!isOpen || !consulta) return null;

        return (
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
                        <p><strong>Paciente:</strong> {consulta.paciente?.nome}</p>
                        <p><strong>Terapeuta:</strong> {consulta.terapeuta.nome}</p>
                        <p><strong>Hora de Início:</strong> {consulta.dataInicio.split(' ')[1]}</p>
                        <div className="flex items-center justify-between mt-5">
                            <button onClick={onClose} className="bg-gray-300 text-black rounded-lg py-2 px-4">Cancelar</button>
                            <button onClick={onConfirm} className="bg-red-500 text-white rounded-lg py-2 px-4">Desmarcar</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (!isLogged) {
            const timer = setTimeout(() => {
                router.push("/signin");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [router]);

    if (!isLogged) {
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

        const filteredConsultasFinalizadas = consultasFinalizadas.filter((consulta) => {
            const pacienteNome = consulta.paciente?.nome.toLowerCase() || "";
            const terapeutaNome = consulta.terapeuta.nome.toLowerCase();
            const search = searchTerm.toLowerCase();
            return pacienteNome.includes(search) || terapeutaNome.includes(search);
        });

        return (
            <>
            <div className="flex">
                <SideBar activeLink="geral" />
                <div className="flex flex-col flex-1">
                    <TopBar />
                    <div className="flex-1 p-4 bg-[#f2f2f2]">
                        <div id="barra_agenda" className="flex justify-between">
                            <div className={`text-[#252d39] ms-10 text-xl font-extrabold ${cairo.className}`}>
                                Bem vindo de volta, Clinica Alfa
                            </div>
                            <div className="flex justify-between gap-10 me-10">
                                <select 
                                    className={`bg-white border border-gray-300 font-bold text-black rounded-lg px-2 ${cairo.className}`}
                                    value={terapeutaFiltro}
                                    onChange={(e) => setTerapeutaFiltro(e.target.value)}
                                >
                                    <option value="">Todos os Terapeutas</option>
                                    {dadosClinica?.Terapeuta.map((terapeuta) => (
                                        <option key={terapeuta.id} value={terapeuta.id}>{terapeuta.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-5 flex items-cen                                                <option key={index}>{horario}</option>
                                            ))}ter justify-center gap-60">
                            <div className="w-2/5 bg-white rounded-lg shadow-lg p-3">
                                <div className="text-lg text-center font-bold text-[#252d39] pb-3">
                                    Próximos Atendimentos
                                </div>
                                <div className="border-b border-gray-300 mb-3" />
                                <div className="max-h-[405px] overflow-y-auto">
                                    {consultasDoDia.length === 0 ? (
                                        <p className="text font-bold text-2xl text-center mb-2">Não há atendimentos para serem exibidos.</p>
                                    ) : (consultasDoDia.map((consulta, index) => (
                                        <div
                                            key={index}
                                            className={`cursor-pointer relative ${index !== 0 ? '-mt-4' : ''}`}
                                            onClick={() => openDesmarcarModal(consulta)}
                                        >
                                            <div className={`flex items-center justify-between rounded-b-2xl border-b border-gray-500 ${index == 0 ? 'pt-2' : 'pt-6'} pb-2 shadow-lg
                                                ${index == 0
                                                    ? 'bg-prox-atendimento-3'
                                                    : index == 1
                                                        ? 'bg-prox-atendimento-2'
                                                        : 'bg-prox-atendimento-1'}`}
                                                style={{ position: 'relative', zIndex: 500 - index }}
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-16 h-16 ms-3 bg-[#F2F2F2] rounded-lg flex flex-col items-center justify-center text-white">
                                                        <div className="text-xl font-bold text-black">{new Date(consulta.dataInicio).getDate()}</div>
                                                        <div className="text-sm text-black">{new Date(consulta.dataInicio).toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}</div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className={`text-md font-bold text-white ${cairo.className}`}>
                                                            Paciente: {consulta.paciente?.nome}
                                                        </p>
                                                        <p className={`text-md font-bold text-white ${cairo.className}`}>
                                                            Terapeuta: {consulta.terapeuta.nome}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center me-3">
                                                    <div className="border-l-2 border-white h-16 mx-4" />
                                                    <p className={`text-lg font-bold text-white ${cairo.className}`}>
                                                        {new Date(consulta.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )))}
                                </div>
                            </div>
                            <DesmarcarConsultaModal
                                isOpen={isDesmarcarModalOpen}
                                onClose={closeDesmarcarModal}
                                consulta={consultaParaDesmarcar}
                                onConfirm={desmarcarConsulta}
                            />
                            <div className="w-[365px] flex flex-col">
                                <div className="w-auto bg-white rounded-lg shadow-lg p-3">
                                    <Calendar
                                        key={selectedDate?.toISOString()}
                                        onChange={(value) => setSelectedDate(value as Date)}
                                        value={selectedDate || currentDate}
                                        tileClassName={tileClassName}
                                        locale="pt-BR"
                                    />
                                </div>
                                <div className="flex flex-col items-center justify-center gap-4 mt-6">
                                    <button
                                        className="w-full flex items-center justify-center gap-2 font-medium bg-[#252d39] text-white rounded-lg py-2 pe-[19px]"
                                        onClick={handleAddHorarioOpening}
                                    >
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
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 w-[80%] mx-auto bg-white rounded-lg shadow-lg mb-10">
                            <div className="flex justify-between items-center bg-[#6D9CE3] p-2 rounded-t-lg mb-2">
                                <h2 className={`text-lg text-white my-2 font-bold ${cairo.className}`}>Histórico de Consultas</h2>
                                <div className="relative w-1/3">
                                    <img src="/icon_connectmenu.png" alt="Buscar" className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar por terapeuta ou paciente"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border border-gray-300 rounded-lg pl-10 pr-2 py-1 w-full outline-none"
                                    />
                                </div>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto">
                                {filteredConsultasFinalizadas.length === 0 ? (
                                    <p className="text font-bold text-2xl text-center mb-2">Não há atendimentos para serem exibidos.</p>
                                ) : (filteredConsultasFinalizadas.map((consulta, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 mb-1 mx-2 border border-gray-300 shadow-lg">
                                        <div className="border-l-4 me-2 border-[#6D9CE3] h-12" />
                                        <div className="flex-1">
                                            <p className="font-bold">{consulta.paciente?.nome}</p>
                                            <p className="text-sm font-medium text-gray-600">Terapeuta: {consulta.terapeuta.nome}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-sm">{new Date(consulta.dataInicio).toLocaleDateString('pt-BR')}</p>
                                            <button
                                                className="text-blue-500 text-sm flex items-center justify-center gap-1"
                                                onClick={() => openDetailsPage(consulta.id)}
                                            >
                                                <svg width="13" height="13" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.298 12.5714L13.374 8.50015L12.373 7.52415L9.298 10.5991L6.223 7.52415L5.22675 8.50015L9.298 12.5714ZM9.30025 18.7981C8.01442 18.7981 6.80558 18.5538 5.67375 18.0651C4.54175 17.5763 3.55708 16.913 2.71975 16.0751C1.88258 15.2373 1.22 14.2536 0.732 13.1239C0.244 11.9941 0 10.7869 0 9.5024C0 8.21657 0.244333 7.00773 0.733 5.8759C1.22183 4.7439 1.88517 3.75923 2.723 2.9219C3.56083 2.08473 4.54458 1.42215 5.67425 0.934148C6.80408 0.446148 8.01125 0.202148 9.29575 0.202148C10.5816 0.202148 11.7904 0.446482 12.9222 0.935149C14.0542 1.42398 15.0389 2.08731 15.8763 2.92515C16.7134 3.76298 17.376 4.74673 17.864 5.8764C18.352 7.00623 18.596 8.2134 18.596 9.4979C18.596 10.7837 18.3517 11.9926 17.863 13.1244C17.3742 14.2564 16.7108 15.2411 15.873 16.0784C15.0352 16.9156 14.0514 17.5781 12.9218 18.0661C11.7919 18.5541 10.5848 18.7981 9.30025 18.7981ZM9.29775 17.3991C11.4959 17.3991 13.362 16.6323 14.896 15.0986C16.43 13.5648 17.197 11.6987 17.197 9.5004C17.197 7.30223 16.4302 5.43615 14.8965 3.90215C13.3627 2.36815 11.4966 1.60115 9.29825 1.60115C7.10008 1.60115 5.234 2.36798 3.7 3.90165C2.166 5.43548 1.399 7.30156 1.399 9.4999C1.399 11.6981 2.16583 13.5641 3.6995 15.0981C5.23333 16.6321 7.09942 17.3991 9.29775 17.3991Z" fill="#6D9CE3" />
                                                </svg>
                                                Detalhes
                                            </button>
                                        </div>
                                    </div>
                                )))}
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
                                    <form className="mx-16" onSubmit={handleSubmit(addConsulta)}>
                                        <select
                                            className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-4"
                                            required
                                            {...register("pacienteId")}
                                        >
                                            <option value="">Selecione o Paciente</option>
                                            {dependentes?.map((dependente: DependenteClinicaI) => (
                                                <option key={dependente.dependente.id} value={dependente.dependente.id}>{dependente.dependente.nome}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-4"
                                            required
                                            {...register("terapeutaId")}
                                        >
                                            <option value="">Selecione o Terapeuta</option>
                                            {dadosClinica?.Terapeuta.map((terapeuta) => (
                                                <option key={terapeuta.id} value={terapeuta.id}>{terapeuta.nome}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-8"
                                            required
                                            {...register("hora")}
                                        >
                                            <option value="">Selecione o Horário</option>
                                            {horariosPorData.map((horario, index) => (
                                                <option key={index}>{horario}</option>
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
                        {isAddHorarioModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center z-[600]">
                                <div className="absolute inset-0 bg-black opacity-50" onClick={handleAddHorarioClosing}></div>
                                <div className="bg-white rounded-lg shadow-lg z-10 w-[500px]">
                                    <h2 className={`flex text-2xl font-bold mb-8 items-center justify-center text-white bg-[#6D9CE3] py-1 mt-5 ${inter.className}`}>
                                        <svg className="me-3" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.7359 24.5233H17.3008V17.2642H24.5232V14.6994H17.3008V7.47696H14.7359V14.6994H7.47684V17.2642H14.7359V24.5233ZM3.87479 31.2503C3.00854 31.2503 2.27124 30.9459 1.66288 30.3373C1.05421 29.7289 0.749878 28.9916 0.749878 28.1253V3.87492C0.749878 3.00867 1.05421 2.27136 1.66288 1.663C2.27124 1.05433 3.00854 0.75 3.87479 0.75H28.1252C28.9915 0.75 29.7288 1.05433 30.3371 1.663C30.9458 2.27136 31.2501 3.00867 31.2501 3.87492V28.1253C31.2501 28.9916 30.9458 29.7289 30.3371 30.3373C29.7288 30.9459 28.9915 31.2503 28.1252 31.2503H3.87479ZM3.87892 28.6854H28.1211C28.2623 28.6854 28.3915 28.6266 28.5088 28.509C28.6265 28.3916 28.6853 28.2624 28.6853 28.1212V3.87904C28.6853 3.73787 28.6265 3.60863 28.5088 3.49129C28.3915 3.37365 28.2623 3.31483 28.1211 3.31483H3.87892C3.73775 3.31483 3.6085 3.37365 3.49117 3.49129C3.37353 3.60863 3.31471 3.73787 3.31471 3.87904V28.1212C3.31471 28.2624 3.37353 28.3916 3.49117 28.509C3.6085 28.6266 3.73775 28.6854 3.87892 28.6854Z" fill="#E8EAED" />
                                        </svg>
                                        Adicionar Horário
                                    </h2>
                                    <form className="mx-16" onSubmit={handleSubmit(addHorario)}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">Horário</label>
                                            <input
                                                type="time"
                                                className="border-2 border-gray-300 bg-blue-100 rounded-lg p-2 w-full mb-4"
                                                {...register("hora", { required: true })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mb-8">
                                            <button
                                                type="button"
                                                onClick={handleAddHorarioClosing}
                                                className="bg-[#F2F2F2] border-2 border-gray-300 text-black rounded-lg py-2 w-[115px]"
                                            >
                                                Cancelar
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
            </>
        )
    }
}