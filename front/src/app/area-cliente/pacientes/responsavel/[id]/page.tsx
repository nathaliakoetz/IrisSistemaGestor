'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import { ResponsavelI } from "@/utils/types/responsaveis";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Dependente {
    id: string;
    nome: string;
    genero: string;
}

interface ResponsavelDependente {
    responsavelId: string;
    dependenteId: string;
    responsavel: ResponsavelI;
    dependente: Dependente;
}

export default function ResponsaveisPaciente() {
    const router = useRouter();
    const params = useParams();
    const dependenteId = params.id as string;
    
    const [responsaveisDependente, setResponsaveisDependente] = useState<ResponsavelDependente[]>([]);
    const [dependente, setDependente] = useState<Dependente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);

    // Buscar dependente e seus responsáveis
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Buscar dependente
            const dependenteResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dependentes/${dependenteId}`);
            if (!dependenteResponse.ok) {
                throw new Error('Erro ao buscar dados do paciente');
            }
            const dependenteData = await dependenteResponse.json();
            setDependente(dependenteData);

            // Buscar responsáveis do dependente
            const responsaveisResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveisDependentes/dependente/${dependenteId}`);
            if (!responsaveisResponse.ok) {
                throw new Error('Erro ao buscar responsáveis do paciente');
            }
            const responsaveisData = await responsaveisResponse.json();
            setResponsaveisDependente(responsaveisData);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setError('Erro ao carregar os dados');
        } finally {
            setLoading(false);
        }
    };

    // Remover responsável do paciente
    const handleRemoveResponsavel = async (responsavelId: string) => {
        if (responsaveisDependente.length <= 1) {
            toast.error("Não é possível remover o último responsável do paciente.", { duration: Number(process.env.NEXT_PUBLIC_URL_API) });
            return;
        }

        // Usar toast para confirmação ao invés de window.confirm
        toast("Tem certeza que deseja remover este responsável?", {
            action: {
                label: "Confirmar",
                onClick: () => executeRemoveResponsavel(responsavelId)
            },
            cancel: {
                label: "Cancelar",
                onClick: () => {}
            }
        });
    };

    // Função para executar a remoção do responsável
    const executeRemoveResponsavel = async (responsavelId: string) => {

        try {
            setRemovingId(responsavelId);

            // Encontrar a relação responsável-dependente
            const relacao = responsaveisDependente.find(rd => rd.responsavel.id === responsavelId);
            if (!relacao) {
                throw new Error('Relação não encontrada');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveisDependentes/${relacao.responsavelId}/${relacao.dependenteId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao remover responsável');
            }

            toast.success("Responsável removido com sucesso!", { duration: Number(process.env.NEXT_PUBLIC_URL_API) });
            
            // Recarregar os dados
            await fetchData();

        } catch (error) {
            console.error('Erro ao remover responsável:', error);
            toast.error("Erro ao remover responsável. Tente novamente.", { duration: Number(process.env.NEXT_PUBLIC_URL_API) });
        } finally {
            setRemovingId(null);
        }
    };

    // Ver detalhes do responsável
    const handleViewResponsavel = (responsavelId: string) => {
        router.push(`/area-cliente/pacientes/responsavel/detalhes/${responsavelId}`);
    };

    useEffect(() => {
        if (dependenteId) {
            fetchData();
        }
    }, [dependenteId]);

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
                                <img src="./../../../../logo.png" alt="Icone do Sistema Íris" className="w-32" />
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
        );
    }

    return (
        <div className="flex">
            <SideBar activeLink="pacientes" />
            <div className="flex flex-col flex-1">
                <TopBar />
                <div className="flex-1 p-4 bg-[#f2f2f2]">
                    <div className="flex justify-between items-center gap-3 bg-[#EBEBEB] border-2 border-gray-300 p-2 rounded-md mb-6">
                        <div className="flex justify-between gap-3 items-center ms-10 mt-5 mb-5">
                            <svg width="34" height="20" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14V16C14.4 16 18 12.4 18 8H22V18C22 19.1 21.1 20 20 20S18 19.1 18 18V16H16V18C16 20.2 17.8 22 20 22S24 20.2 24 18V8C24 6.9 23.1 6 22 6H15.2C14.2 3.6 11.8 2 9 2C5.7 2 3 4.7 3 8S5.7 14 9 14C10.4 14 11.7 13.5 12.7 12.6L21 9Z" fill="#6D9CE3" />
                            </svg>
                            <h1 className={`text-3xl text-dark font-semibold ${inter.className}`}>
                                Responsáveis - {dependente?.nome || 'Carregando...'}
                            </h1>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center mt-10">
                            <p className={`text-xl text-gray-600 ${inter.className}`}>
                                Carregando responsáveis...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-center items-center mt-10">
                            <p className={`text-xl text-red-600 ${inter.className}`}>
                                {error}
                            </p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            {responsaveisDependente.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className={`text-lg text-gray-600 mb-4 ${inter.className}`}>
                                        Nenhum responsável encontrado para este paciente.
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <div className="space-y-4">
                                        {responsaveisDependente.map((rd) => (
                                            <div key={rd.responsavel.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex-1">
                                                        <h3 className={`text-lg font-semibold text-gray-800 ${inter.className}`}>
                                                            {rd.responsavel.nome}
                                                        </h3>
                                                        <p className={`text-sm text-gray-600 ${inter.className}`}>
                                                            CPF: {rd.responsavel.cpf}
                                                        </p>
                                                        {rd.responsavel.telefone1 && (
                                                            <p className={`text-sm text-gray-600 ${inter.className}`}>
                                                                Telefone: {rd.responsavel.telefone1}
                                                            </p>
                                                        )}
                                                        {rd.responsavel.email && (
                                                            <p className={`text-sm text-gray-600 ${inter.className}`}>
                                                                Email: {rd.responsavel.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 ml-4">
                                                        <button
                                                            onClick={() => handleViewResponsavel(rd.responsavel.id)}
                                                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm ${inter.className}`}
                                                        >
                                                            Ver Dados
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveResponsavel(rd.responsavel.id)}
                                                            disabled={responsaveisDependente.length <= 1 || removingId === rd.responsavel.id}
                                                            className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm ${inter.className}`}
                                                        >
                                                            {removingId === rd.responsavel.id ? 'Removendo...' : 'Remover Responsável'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-4 justify-center mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => router.push('/area-cliente/pacientes')}
                                    className={`px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors ${inter.className}`}
                                >
                                    Voltar
                                </button>

                                <button
                                    onClick={() => router.push(`/area-cliente/pacientes/responsavel/vincular?dependenteId=${dependenteId}`)}
                                    className={`px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${inter.className}`}
                                >
                                    Vincular Responsável
                                </button>
                            </div>

                            {responsaveisDependente.length <= 1 && responsaveisDependente.length > 0 && (
                                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                                    <p className={`text-sm text-yellow-800 ${inter.className}`}>
                                        <strong>Atenção:</strong> Não é possível remover o último responsável do paciente. 
                                        Cadastre outro responsável antes de remover este.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
