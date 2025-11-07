'use client'

import { SideBarMedico } from "@/components/SideBarMedico";
import { TopBarMedico } from "@/components/TopBarMedico";
import { cairo, inter } from "@/utils/fonts";
import { useEffect, useState } from 'react';
import { useTerapeutaStore } from "@/context/terapeuta";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConsultaI } from "@/utils/types/consultas";
import Cookies from "js-cookie";

export default function AreaMedica() {
    const currentDate = new Date();
    const { terapeuta, carregaTerapeutaDaStorage } = useTerapeutaStore();
    const [consultas, setConsultas] = useState<ConsultaI[]>([]);
    const [isLogged, setIsLogged] = useState(true);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    async function buscaConsultas(terapeutaId: string, clinicaId: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/terapeuta/${terapeutaId}/${clinicaId}`, {
            method: "GET"
        })

        if (response.status == 200) {
            const dados = await response.json()
            setConsultas(dados)
        }
    }

    async function buscaTerapeuta(id: string, clinicaId: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/terapeutas/${id}/${clinicaId}`, {
            method: "GET"
        })

        if (response.status == 200) {
            // Terapeuta validado com sucesso
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
        // Verificar login no cliente
        if (typeof window !== 'undefined') {
            const logged = sessionStorage.getItem("logged");
            if (!logged) {
                setIsLogged(false);
                return;
            }
            setIsLogged(true);
        }

        // Recarregar terapeuta do storage se estiver vazio
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

        setIsClient(true);
    }, [terapeuta, router, carregaTerapeutaDaStorage]);

    // Consultas de HOJE (pendentes)
    const consultasHoje = consultas
        .filter(consulta => {
            const consultaDate = new Date(consulta.dataInicio).toISOString().split('T')[0];
            const todayString = currentDate.toISOString().split('T')[0];
            return consultaDate === todayString && !consulta.dataFim;
        })
        .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());

    // Consultas finalizadas HOJE
    const consultasFinalizadasHoje = consultas.filter(consulta => {
        const consultaDate = new Date(consulta.dataInicio).toISOString().split('T')[0];
        const todayString = currentDate.toISOString().split('T')[0];
        return consultaDate === todayString && consulta.dataFim;
    });

    // Todas as consultas de HOJE (finalizadas e não finalizadas)
    const consultasDoDia = consultas
        .filter(consulta => {
            const consultaDate = new Date(consulta.dataInicio).toISOString().split('T')[0];
            const todayString = currentDate.toISOString().split('T')[0];
            return consultaDate === todayString;
        })
        .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());

    const openDetailsPage = (consultaId: number) => {
        router.push(`/area-medica/detalhes-consulta/${consultaId}?origem=geral`);
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
    }

    return (
        <main className="w-full h-screen flex overflow-hidden bg-[#f7f7f7]">
            <SideBarMedico activeLink="geral" />
            <div className="w-full overflow-y-auto">
                <TopBarMedico />
                <div className="mx-5 my-10">
                    <h1 className={`text-3xl font-bold text-color-logo ${cairo.className}`}>
                        Olá{isClient && terapeuta?.nome ? `, ${terapeuta.nome}` : ''}!
                    </h1>
                    <p className={`text-base text-gray-600 mt-1 ${inter.className}`}>
                        Aqui esta o resumo das consultas de hoje
                    </p>

                    <div className="flex gap-8 mt-8">
                        {/* Conteúdo Principal */}
                        <div className="flex-1">
                            {/* Cards de Estatísticas */}
                            <div className="grid grid-cols-2 gap-5 mb-8">
                                <div className="bg-white rounded-2xl shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-sm text-gray-500 ${inter.className}`}>
                                                Consultas Pendentes
                                            </p>
                                            <h2 className={`text-3xl font-bold text-color-logo mt-2 ${cairo.className}`}>
                                                {consultasHoje.length}
                                            </h2>
                                        </div>
                                        <div className="bg-blue-100 rounded-full p-3">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="#6D9CE3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-sm text-gray-500 ${inter.className}`}>
                                                Consultas Finalizadas
                                            </p>
                                            <h2 className={`text-3xl font-bold text-green-600 mt-2 ${cairo.className}`}>
                                                {consultasFinalizadasHoje.length}
                                            </h2>
                                        </div>
                                        <div className="bg-green-100 rounded-full p-3">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de Consultas do Dia */}
                            <div className="bg-white rounded-2xl shadow p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-xl font-bold text-color-logo ${cairo.className}`}>
                                        Consultas de Hoje
                                    </h2>
                                </div>

                                {consultasDoDia.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className={`text-gray-500 ${inter.className}`}>
                                            Nenhuma consulta agendada para este dia
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {consultasDoDia.map((consulta) => (
                                            <div
                                                key={consulta.id}
                                                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition ${
                                                    consulta.dataFim ? 'border-green-300 bg-green-50' : 'border-gray-200'
                                                }`}
                                                onClick={() => openDetailsPage(consulta.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`rounded-full p-2 ${
                                                        consulta.dataFim ? 'bg-green-100' : 'bg-blue-100'
                                                    }`}>
                                                        {consulta.dataFim ? (
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        ) : (
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#6D9CE3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold text-gray-900 ${inter.className}`}>
                                                            {consulta.paciente?.nome || "Sem paciente"}
                                                            {consulta.dataFim && (
                                                                <span className="ml-2 text-xs text-green-600 font-normal">
                                                                    ✓ Finalizada
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className={`text-sm text-gray-500 ${inter.className}`}>
                                                            {consulta.dataInicio.split(' ')[1].slice(0, 5)}
                                                            {consulta.dataFim && ` - ${consulta.dataFim.split(' ')[1].slice(0, 5)}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 18L15 12L9 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
