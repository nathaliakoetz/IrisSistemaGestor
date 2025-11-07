'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ConsultaI } from "@/utils/types/consultas";
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from "sonner";
import Link from "next/link";

export default function DetalhesConsulta() {
    const [consulta, setConsulta] = useState<ConsultaI | null>(null);
    const [detalhes, setDetalhes] = useState("");
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const consultaId = params.id as string;
    const origem = searchParams.get('origem') || 'geral';

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
                    router.push("/area-cliente");
                }
            } catch {
                toast.error("Erro ao carregar detalhes da consulta");
                router.push("/area-cliente");
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

    if (loading) {
        return (
            <div className="flex">
                <SideBar activeLink="geral" />
                <div className="flex flex-col flex-1">
                    <TopBar />
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
                <SideBar activeLink="geral" />
                <div className="flex flex-col flex-1">
                    <TopBar />
                    <div className="flex-1 p-4 bg-[#f2f2f2] flex items-center justify-center">
                        <div className="text-xl">Consulta não encontrada</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <SideBar activeLink="geral" />
            <div className="flex flex-col flex-1">
                <TopBar />                    <div className="flex-1 p-4 detalhes-consulta-page">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <Link href={origem === 'agenda' ? '/area-cliente/agenda' : '/area-cliente'} className="flex items-center text-[#252d39] hover:text-blue-600 btn-voltar">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z" fill="currentColor"/>
                                    </svg>
                                    Voltar
                                </Link>
                                <h1 className={`text-2xl font-bold text-[#252d39] ${cairo.className}`}>
                                    Detalhes da Consulta
                                </h1>
                            </div>
                        </div>

                        {/* Card Principal */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {/* Header do Card */}
                            <div className="bg-[#6D9CE3] p-4">
                                <h2 className={`text-xl font-bold text-white ${inter.className}`}>
                                    Informações da Consulta
                                </h2>
                            </div>

                            {/* Conteúdo do Card */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {/* Informações do Paciente */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className={`text-lg font-semibold text-[#252d39] mb-3 ${cairo.className}`}>
                                            Informações do Paciente
                                        </h3>
                                        <div className="space-y-2">
                                            <p><strong>Nome:</strong> {consulta.paciente?.nome}</p>
                                            <p><strong>CPF:</strong> {consulta.paciente?.cpf}</p>
                                            <p><strong>Gênero:</strong> {consulta.paciente?.genero}</p>
                                            <p><strong>Data de Nascimento:</strong> {consulta.paciente?.dataNascimento ? new Date(consulta.paciente.dataNascimento).toLocaleDateString('pt-BR') : 'Não informado'}</p>
                                        </div>
                                    </div>

                                    {/* Informações do Responsável */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className={`text-lg font-semibold text-[#252d39] mb-3 ${cairo.className}`}>
                                            Informações do Responsável
                                        </h3>
                                        {consulta.paciente?.ResponsavelDependente && consulta.paciente.ResponsavelDependente.length > 0 ? (
                                            <div className="space-y-2">
                                                <p><strong>Nome:</strong> {consulta.paciente.ResponsavelDependente[0].responsavel.nome}</p>
                                                <p><strong>Email:</strong> {consulta.paciente.ResponsavelDependente[0].responsavel.email}</p>
                                                <p><strong>Telefone:</strong> {consulta.paciente.ResponsavelDependente[0].responsavel.telefone1}</p>
                                                <p><strong>CPF:</strong> {consulta.paciente.ResponsavelDependente[0].responsavel.cpf}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic">Nenhum responsável cadastrado</p>
                                        )}
                                    </div>

                                    {/* Informações do Terapeuta */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className={`text-lg font-semibold text-[#252d39] mb-3 ${cairo.className}`}>
                                            Informações do Terapeuta
                                        </h3>
                                        <div className="space-y-2">
                                            <p><strong>Nome:</strong> {consulta.terapeuta.nome}</p>
                                            <p><strong>Profissão:</strong> {consulta.terapeuta.profissao || 'Não informado'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Informações da Consulta */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-8">
                                    <h3 className={`text-lg font-semibold text-[#252d39] mb-3 ${cairo.className}`}>
                                        Dados da Consulta
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                        <div>
                                            <p><strong>Data:</strong> {new Date(consulta.dataInicio).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <div>
                                            <p><strong>Hora de Início:</strong> {new Date(consulta.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <div>
                                            <p><strong>Hora de Fim:</strong> {consulta.dataFim ? new Date(consulta.dataFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Detalhes da Consulta */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className={`text-lg font-semibold text-[#252d39] ${cairo.className}`}>
                                            Detalhes da Consulta
                                        </h3>
                                        {!editando && (
                                            <button
                                                onClick={() => setEditando(true)}
                                                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                                                </svg>
                                                Editar
                                            </button>
                                        )}
                                    </div>
                                    
                                    {editando ? (
                                        <div>
                                            <TextareaAutosize
                                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 detalhes-textarea"
                                                minRows={8}
                                                maxRows={20}
                                                value={detalhes}
                                                onChange={(e) => setDetalhes(e.target.value)}
                                                placeholder="Digite os detalhes da consulta..."
                                            />
                                            <div className="flex items-center justify-end gap-3 mt-4">
                                                <button
                                                    onClick={() => {
                                                        setEditando(false);
                                                        setDetalhes(consulta.detalhes || '');
                                                    }}
                                                    className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={salvarDetalhes}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                                >
                                                    Salvar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="min-h-[200px] p-3 bg-white border border-gray-200 rounded-lg">
                                            {consulta.detalhes ? (
                                                <div className="whitespace-pre-wrap">{consulta.detalhes}</div>
                                            ) : (
                                                <div className="text-gray-500 italic">Nenhum detalhe registrado para esta consulta.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
