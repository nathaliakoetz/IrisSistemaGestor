'use client'

import { SideBarMedico } from "@/components/SideBarMedico";
import { TopBarMedico } from "@/components/TopBarMedico";
import { cairo, inter } from "@/utils/fonts";
import { useEffect, useState } from 'react';
import { useTerapeutaStore } from "@/context/terapeuta";
import { useRouter } from "next/navigation";
import { ConsultaI } from "@/utils/types/consultas";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function MundoEmocoes() {
    const currentDate = new Date();
    const { terapeuta, carregaTerapeutaDaStorage } = useTerapeutaStore();
    const [consultas, setConsultas] = useState<ConsultaI[]>([]);
    const [isLogged, setIsLogged] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    async function buscaConsultas(terapeutaId: string, clinicaId: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/terapeuta/${terapeutaId}/${clinicaId}`, {
                method: "GET"
            })

            if (response.status == 200) {
                const dados = await response.json()
                setConsultas(dados)
            }
        } catch (error) {
            console.error("Erro ao buscar consultas:", error)
        } finally {
            setLoading(false)
        }
    }

    async function buscaTerapeuta(id: string, clinicaId: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/terapeutas/${id}/${clinicaId}`, {
            method: "GET"
        })

        if (response.status == 200) {
            await response.json()
        } else if (response.status == 400) {
            Cookies.remove('authID')
            Cookies.remove('authToken')
            Cookies.remove('authClinicaId')
            if (typeof window !== 'undefined') sessionStorage.removeItem("logged")
            router.push("/area-medica/error")
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const logged = sessionStorage.getItem("logged");
            if (!logged) {
                setIsLogged(false);
                router.push("/area-medica/error");
                return;
            }
            setIsLogged(true);
        }

        if (!terapeuta.id) {
            carregaTerapeutaDaStorage();
        }

        if (!terapeuta.id && !Cookies.get("authID")) {
            if (typeof window !== 'undefined') sessionStorage.removeItem("logged");
            setIsLogged(false);
            router.push("/area-medica/error");
        } else if (Cookies.get("authID")) {
            const authID = Cookies.get("authID") as string;
            const authClinicaId = Cookies.get("authClinicaId") as string;
            buscaTerapeuta(authID, authClinicaId);
            buscaConsultas(authID, authClinicaId);
        } else {
            buscaTerapeuta(terapeuta.id, terapeuta.clinicaId);
            buscaConsultas(terapeuta.id, terapeuta.clinicaId);
        }
    }, [terapeuta, router, carregaTerapeutaDaStorage]);

    // Filtrar apenas consultas agendadas (não finalizadas) do dia atual
    const consultasAgendadasHoje = consultas
        .filter(consulta => {
            const consultaDate = new Date(consulta.dataInicio).toISOString().split('T')[0];
            const todayString = currentDate.toISOString().split('T')[0];
            return consultaDate === todayString && !consulta.dataFim;
        })
        .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());

    const formatarHorario = (dataInicio: string) => {
        const data = new Date(dataInicio);
        return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const calcularIdade = (dataNascimento: string) => {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mesAtual = hoje.getMonth();
        const mesNascimento = nascimento.getMonth();

        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return idade;
    };

    const iniciarJogo = (consultaId: number) => {
        // Futuramente será implementado o redirecionamento para o jogo
        console.log("Iniciar jogo para consulta:", consultaId);
        toast.info("Jogo de memória será implementado em breve!", { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
    };

    if (!isLogged) {
        return null;
    } else {
        return (
            <div className="flex">
                <SideBarMedico activeLink="mundo-emocoes" />
                <div className="flex flex-col w-full">
                    <TopBarMedico />
                    <div className="p-8 bg-gray-50 min-h-screen">
                        <div className="max-w-7xl mx-auto">
                            {/* Cabeçalho */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <rect width="20" height="20" fill="url(#pattern0_283_2061)" />
                                        <defs>
                                            <pattern id="pattern0_283_2061" patternContentUnits="objectBoundingBox" width="1" height="1">
                                                <use xlinkHref="#image0_283_2061" transform="scale(0.0125)" />
                                            </pattern>
                                            <image id="image0_283_2061" width="80" height="80" xlinkHref="data:image/png;base64,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" />
                                        </defs>
                                    </svg>
                                    <h1 className={`text-4xl font-bold ms-2 text-[#252d39] ${cairo.className}`}>
                                        Mundo das Emoções
                                    </h1>
                                </div>
                                <p className={`text-gray-600 mt-2 ${inter.className}`}>
                                    Selecione um atendimento agendado para hoje e inicie uma atividade lúdica
                                </p>
                            </div>

                            {/* Loading */}
                            {loading && (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#252d39]"></div>
                                </div>
                            )}

                            {/* Lista de Consultas */}
                            {!loading && (
                                <>
                                    {consultasAgendadasHoje.length === 0 ? (
                                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                            <div className="text-6xl mb-4">📅</div>
                                            <h2 className={`text-2xl font-semibold text-gray-700 mb-2 ${cairo.className}`}>
                                                Nenhum atendimento agendado para hoje
                                            </h2>
                                            <p className={`text-gray-500 ${inter.className}`}>
                                                Quando houver consultas agendadas para o dia atual, elas aparecerão aqui.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {consultasAgendadasHoje.map((consulta) => (
                                                <div
                                                    key={consulta.id}
                                                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                                                >
                                                    <div className="bg-gradient-to-r from-[#192333] to-[#252d39] p-4">
                                                        <div className="flex items-center justify-between text-white">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-2xl">🕐</span>
                                                                <span className={`text-xl font-semibold ${inter.className}`}>
                                                                    {formatarHorario(consulta.dataInicio)}
                                                                </span>
                                                            </div>
                                                            <div className="bg-white/20 px-3 py-1 rounded-full">
                                                                <span className={`text-sm ${inter.className}`}>Hoje</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-6">
                                                        <div className="mb-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-xl">👤</span>
                                                                <h3 className={`text-lg font-semibold text-gray-800 ${cairo.className}`}>
                                                                    {consulta.paciente?.nome || "Paciente não informado"}
                                                                </h3>
                                                            </div>
                                                            {(consulta.paciente?.genero || consulta.paciente?.dataNascimento) && (
                                                                <p className={`text-sm text-gray-500 ml-7 ${inter.className}`}>
                                                                    {consulta.paciente.genero}
                                                                    {consulta.paciente.genero && consulta.paciente.dataNascimento && " • "}
                                                                    {consulta.paciente.dataNascimento && `${calcularIdade(consulta.paciente.dataNascimento)} anos`}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {consulta.detalhes && (
                                                            <div className="mb-4 p-3 bg-gray-50 rounded-md">
                                                                <p className={`text-sm text-gray-600 ${inter.className}`}>
                                                                    {consulta.detalhes.length > 80
                                                                        ? `${consulta.detalhes.substring(0, 80)}...`
                                                                        : consulta.detalhes}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={() => iniciarJogo(consulta.id)}
                                                            className={`w-full bg-gradient-to-r from-[#6d9ce3] to-[#4a7bc0] hover:from-[#5a8bd3] hover:to-[#3a6bb0] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${inter.className}`}
                                                        >
                                                            <span className="text-xl">🎮</span>
                                                            <span>Iniciar Atividade</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Estatísticas do dia */}
                                    {consultasAgendadasHoje.length > 0 && (
                                        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-[#e8f0fa] rounded-lg">
                                                    <div className="text-3xl mb-2">📊</div>
                                                    <p className={`text-2xl font-bold text-[#6d9ce3] ${cairo.className}`}>
                                                        {consultasAgendadasHoje.length}
                                                    </p>
                                                    <p className={`text-sm text-gray-600 ${inter.className}`}>
                                                        Atendimentos Agendados
                                                    </p>
                                                </div>
                                                <div className="text-center p-4 bg-[#f0f4f8] rounded-lg">
                                                    <div className="text-3xl mb-2">⏰</div>
                                                    <p className={`text-2xl font-bold text-[#252d39] ${cairo.className}`}>
                                                        {consultasAgendadasHoje.length > 0
                                                            ? formatarHorario(consultasAgendadasHoje[0].dataInicio)
                                                            : '--:--'}
                                                    </p>
                                                    <p className={`text-sm text-gray-600 ${inter.className}`}>
                                                        Próximo Atendimento
                                                    </p>
                                                </div>
                                                {/* <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                <div className="text-3xl mb-2">🎯</div>
                                                <p className={`text-2xl font-bold text-purple-600 ${cairo.className}`}>
                                                    {consultasAgendadasHoje.length}
                                                </p>
                                                <p className={`text-sm text-gray-600 ${inter.className}`}>
                                                    Atividades Disponíveis
                                                </p>
                                            </div> */}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}
