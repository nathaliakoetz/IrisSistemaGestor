'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import { ResponsavelI } from "@/utils/types/responsaveis";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface Dependente {
    id: string;
    nome: string;
    genero: string;
}

export default function VincularResponsavel() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dependenteId = searchParams.get('dependenteId') as string;
    
    const [dependente, setDependente] = useState<Dependente | null>(null);
    const [responsaveisDisponiveis, setResponsaveisDisponiveis] = useState<ResponsavelI[]>([]);
    const [selectedResponsavel, setSelectedResponsavel] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vinculando, setVinculando] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Buscar dependente e responsáveis disponíveis
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

            // Buscar responsáveis já vinculados ao dependente
            const responsaveisVinculadosResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveisDependentes/dependente/${dependenteId}`);
            const responsaveisVinculados = responsaveisVinculadosResponse.ok ? await responsaveisVinculadosResponse.json() : [];
            const idsVinculados = responsaveisVinculados.map((rv: any) => rv.responsavel.id);

            // Buscar todos os responsáveis da clínica
            const todosResponsaveisResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveisClinicas`);
            if (!todosResponsaveisResponse.ok) {
                throw new Error('Erro ao buscar responsáveis');
            }
            const responsaveisClinicas = await todosResponsaveisResponse.json();
            
            // Filtrar responsáveis da clínica atual (assumindo que você tem acesso ao ID da clínica)
            const clinicaId = sessionStorage.getItem('clinica') ? JSON.parse(sessionStorage.getItem('clinica')!).id : null;
            const responsaveisClinicaAtual = responsaveisClinicas
                .filter((rc: any) => rc.clinica.id === clinicaId)
                .map((rc: any) => rc.responsavel);

            // Filtrar responsáveis que não estão vinculados ao dependente
            const responsaveisDisponiveis = responsaveisClinicaAtual.filter((resp: ResponsavelI) => 
                !idsVinculados.includes(resp.id)
            );
            
            setResponsaveisDisponiveis(responsaveisDisponiveis);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setError('Erro ao carregar os dados');
        } finally {
            setLoading(false);
        }
    };

    // Vincular responsável ao paciente
    const handleVincularResponsavel = async () => {
        if (!selectedResponsavel) {
            toast.error("Selecione um responsável para vincular.");
            return;
        }

        try {
            setVinculando(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveisDependentes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    responsavelId: selectedResponsavel,
                    dependenteId: dependenteId
                })
            });

            if (response.status === 201) {
                toast.success("Responsável vinculado com sucesso!");
                router.push(`/area-cliente/pacientes/responsavel/${dependenteId}`);
            } else if (response.status === 409) {
                // Erro de duplicação (responsável já vinculado)
                const errorData = await response.json();
                toast.error(errorData.erro || "Este responsável já está vinculado a este paciente.");
            } else {
                const errorData = await response.json();
                toast.error(errorData.erro || 'Erro ao vincular responsável');
            }

        } catch (error) {
            console.error('Erro ao vincular responsável:', error);
            toast.error(error instanceof Error ? error.message : "Erro ao vincular responsável. Tente novamente.");
        } finally {
            setVinculando(false);
        }
    };

    // Navegar para cadastro de novo responsável
    const handleCadastrarNovoResponsavel = () => {
        router.push(`/area-cliente/pacientes/responsavel/cadastrar?dependenteId=${dependenteId}&redirect=responsaveis`);
    };

    useEffect(() => {
        if (dependenteId) {
            fetchData();
        }
    }, [dependenteId]);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const responsaveisFiltrados = responsaveisDisponiveis.filter(responsavel =>
        responsavel.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        responsavel.cpf.includes(searchTerm) ||
        responsavel.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const responsavelSelecionadoObj = responsaveisDisponiveis.find(r => r.id === selectedResponsavel);

    const handleSelectResponsavel = (responsavelId: string) => {
        setSelectedResponsavel(responsavelId);
        setShowDropdown(false);
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
                                Vincular Responsável - {dependente?.nome || 'Carregando...'}
                            </h1>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center mt-10">
                            <p className={`text-xl text-gray-600 ${inter.className}`}>
                                Carregando dados...
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
                        <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
                            <div className="mb-8">
                                <h2 className={`text-xl font-semibold text-gray-800 mb-4 ${inter.className}`}>
                                    Selecionar Responsável Existente
                                </h2>
                                
                                {responsaveisDisponiveis.length > 0 ? (
                                    <>
                                        <label className={`block text-lg font-semibold text-gray-700 mb-2 ${inter.className}`}>
                                            Escolha um responsável para vincular:
                                        </label>
                                        <div className="relative" ref={dropdownRef}>
                                            <input
                                                type="text"
                                                value={responsavelSelecionadoObj ? `${responsavelSelecionadoObj.nome} - ${responsavelSelecionadoObj.cpf}` : searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setShowDropdown(true);
                                                    if (responsavelSelecionadoObj) {
                                                        setSelectedResponsavel("");
                                                    }
                                                }}
                                                onFocus={() => setShowDropdown(true)}
                                                placeholder="Digite para buscar um responsável..."
                                                className={`w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${inter.className}`}
                                            />
                                            
                                            {showDropdown && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                    {responsaveisFiltrados.length > 0 ? (
                                                        responsaveisFiltrados.map((responsavel) => (
                                                            <div
                                                                key={responsavel.id}
                                                                onClick={() => handleSelectResponsavel(responsavel.id)}
                                                                className={`p-3 cursor-pointer hover:bg-gray-100 ${inter.className}`}
                                                            >
                                                                {responsavel.nome} - {responsavel.cpf} - {responsavel.email}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className={`p-3 text-gray-500 ${inter.className}`}>
                                                            Nenhum responsável encontrado
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <button
                                            onClick={handleVincularResponsavel}
                                            disabled={!selectedResponsavel || vinculando}
                                            className={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-6 mt-4 ${inter.className}`}
                                        >
                                            {vinculando ? 'Vinculando...' : 'Confirmar Vínculo'}
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center py-6 mb-6">
                                        <p className={`text-lg text-gray-600 ${inter.className}`}>
                                            Não há responsáveis disponíveis para vincular. Todos os responsáveis cadastrados já estão vinculados a este paciente.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-300 pt-6">
                                <h2 className={`text-xl font-semibold text-gray-800 mb-4 ${inter.className}`}>
                                    Ou Cadastrar Novo Responsável
                                </h2>
                                <p className={`text-gray-600 mb-4 ${inter.className}`}>
                                    Se o responsável não existe no sistema, você pode cadastrá-lo agora:
                                </p>
                                <button
                                    onClick={handleCadastrarNovoResponsavel}
                                    className={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${inter.className}`}
                                >
                                    Adicionar Novo Responsável
                                </button>
                            </div>

                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => router.push(`/area-cliente/pacientes/responsavel/${dependenteId}`)}
                                    className={`px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors ${inter.className}`}
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
