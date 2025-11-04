'use client'

import { SideBarMedico } from "@/components/SideBarMedico";
import { TopBarMedico } from "@/components/TopBarMedico";
import { cairo, inter } from "@/utils/fonts";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from "next/navigation";
import { ConsultaI } from "@/utils/types/consultas";
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from "sonner";
import Link from "next/link";
import { useTerapeutaStore } from "@/context/terapeuta";

export default function DetalhesConsulta() {
    const [consulta, setConsulta] = useState<ConsultaI | null>(null);
    const [detalhes, setDetalhes] = useState("");
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const router = useRouter();
    const params = useParams();
    const consultaId = params.id as string;

    useEffect(() => {
        async function buscaConsulta() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/detalhes/${consultaId}`, {
                    method: "GET"
                });

                if (response.status === 200) {
                    const dados = await response.json();
                    setConsulta(dados);
                    setDetalhes(dados.detalhes || '');
                } else {
                    toast.error("Erro ao carregar detalhes da consulta");
                    router.push("/area-medica");
                }
            } catch {
                toast.error("Erro ao carregar detalhes da consulta");
                router.push("/area-medica");
            } finally {
                setLoading(false);
            }
        }

        if (consultaId) {
            buscaConsulta();
        }
    }, [consultaId, router]);

    const salvarDetalhes = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/detalhes/${consultaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ detalhes })
            });

            if (response.status === 200) {
                toast.success("Detalhes salvos com sucesso!");
                setEditando(false);
                if (consulta) {
                    setConsulta({ ...consulta, detalhes });
                }
            } else {
                toast.error("Erro ao salvar detalhes");
            }
        } catch {
            toast.error("Erro ao salvar detalhes");
        }
    };

    const finalizarConsulta = async () => {
        try {
            // Criar data com fuso horário brasileiro (GMT-3)
            const now = new Date();
            const offset = -3; // GMT-3
            const brasiliaTime = new Date(now.getTime() + (offset * 60 * 60 * 1000));
            const dataFim = brasiliaTime.toISOString().replace('T', ' ').slice(0, 19);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/finalizar/${consultaId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    dataFim,
                    detalhes 
                })
            });

            if (response.status === 200) {
                toast.success("Consulta finalizada com sucesso!");
                router.push("/area-medica");
            } else {
                toast.error("Erro ao finalizar consulta");
            }
        } catch {
            toast.error("Erro ao finalizar consulta");
        }
    };

    useEffect(() => {
        if (!sessionStorage.getItem("logged")) {
            const timer = setTimeout(() => {
                router.push("/signin");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [router]);

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

    if (loading) {
        return (
            <div className="flex">
                <SideBarMedico activeLink="geral" />
                <div className="flex flex-col flex-1">
                    <TopBarMedico />
                    <div className="flex-1 p-4 bg-[#f2f2f2] flex items-center justify-center">
                        <div className="text-xl">Carregando...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!consulta) {
        return (
            <div className="flex">
                <SideBarMedico activeLink="geral" />
                <div className="flex flex-col flex-1">
                    <TopBarMedico />
                    <div className="flex-1 p-4 bg-[#f2f2f2] flex items-center justify-center">
                        <div className="text-xl">Consulta não encontrada</div>
                    </div>
                </div>
            </div>
        );
    }

    const dataConsulta = new Date(consulta.dataInicio);
    const dataFormatada = dataConsulta.toLocaleDateString('pt-BR');
    const horaInicio = consulta.dataInicio.split(' ')[1].slice(0, 5);
    const horaFim = consulta.dataFim ? consulta.dataFim.split(' ')[1].slice(0, 5) : null;

    return (
        <div className="flex">
            <SideBarMedico activeLink="geral" />
            <div className="flex flex-col flex-1">
                <TopBarMedico />
                <div className="flex-1 p-8 bg-[#f2f2f2]">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <Link href="/area-medica">
                                    <button className="mr-4 text-gray-600 hover:text-gray-800">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </Link>
                                <h1 className={`text-3xl font-bold text-color-logo ${cairo.className}`}>
                                    Detalhes da Consulta
                                </h1>
                            </div>
                            {!consulta.dataFim && (
                                <button 
                                    onClick={finalizarConsulta}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                                >
                                    Finalizar Consulta
                                </button>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className={`text-sm text-gray-500 ${inter.className}`}>Paciente</label>
                                    <p className={`text-lg font-semibold text-gray-900 ${inter.className}`}>
                                        {consulta.paciente?.nome || "Sem paciente"}
                                    </p>
                                </div>

                                <div>
                                    <label className={`text-sm text-gray-500 ${inter.className}`}>Data</label>
                                    <p className={`text-lg font-semibold text-gray-900 ${inter.className}`}>
                                        {dataFormatada}
                                    </p>
                                </div>

                                <div>
                                    <label className={`text-sm text-gray-500 ${inter.className}`}>Hora de Início</label>
                                    <p className={`text-lg font-semibold text-gray-900 ${inter.className}`}>
                                        {horaInicio}
                                    </p>
                                </div>

                                {horaFim && (
                                    <div>
                                        <label className={`text-sm text-gray-500 ${inter.className}`}>Hora de Término</label>
                                        <p className={`text-lg font-semibold text-gray-900 ${inter.className}`}>
                                            {horaFim}
                                        </p>
                                    </div>
                                )}

                                {consulta.paciente?.ResponsavelDependente && consulta.paciente.ResponsavelDependente.length > 0 && (
                                    <>
                                        <div>
                                            <label className={`text-sm text-gray-500 ${inter.className}`}>Responsável</label>
                                            <p className={`text-lg font-semibold text-gray-900 ${inter.className}`}>
                                                {consulta.paciente.ResponsavelDependente[0].responsavel.nome}
                                            </p>
                                        </div>

                                        <div>
                                            <label className={`text-sm text-gray-500 ${inter.className}`}>Telefone do Responsável</label>
                                            <p className={`text-lg font-semibold text-gray-900 ${inter.className}`}>
                                                {consulta.paciente.ResponsavelDependente[0].responsavel.telefone1}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-md p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className={`text-xl font-bold text-color-logo ${cairo.className}`}>
                                    Anotações da Consulta
                                </h2>
                                {!editando && !consulta.dataFim && (
                                    <button 
                                        onClick={() => setEditando(true)}
                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                    >
                                        Editar
                                    </button>
                                )}
                                {editando && (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                setEditando(false);
                                                setDetalhes(consulta.detalhes || '');
                                            }}
                                            className="text-gray-600 hover:text-gray-800 font-semibold"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            onClick={salvarDetalhes}
                                            className="text-green-600 hover:text-green-800 font-semibold"
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                )}
                            </div>

                            {editando ? (
                                <TextareaAutosize
                                    value={detalhes}
                                    onChange={(e) => setDetalhes(e.target.value)}
                                    placeholder="Adicione anotações sobre a consulta..."
                                    className={`w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inter.className}`}
                                    minRows={8}
                                />
                            ) : (
                                <div className={`p-4 bg-gray-50 rounded-lg min-h-[200px] ${inter.className}`}>
                                    {detalhes ? (
                                        <p className="whitespace-pre-wrap">{detalhes}</p>
                                    ) : (
                                        <p className="text-gray-400 italic">Nenhuma anotação adicionada</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {consulta.dataFim && (
                            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className={`text-green-800 font-semibold ${inter.className}`}>
                                    ✓ Consulta finalizada em {dataFormatada} às {horaFim}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
