'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useClinicaStore } from "@/context/clinica";
import { ResponsavelI } from "@/utils/types/responsaveis";
import { toast } from 'sonner';

export default function CadastrarPaciente() {
    const { clinica } = useClinicaStore();
    const router = useRouter();
    const [responsaveis, setResponsaveis] = useState<ResponsavelI[]>([]);
    const [isLogged, setIsLogged] = useState(true);
    const [selectedResponsavel, setSelectedResponsavel] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Buscar responsáveis da clínica
    const fetchResponsaveis = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveisClinicas/${clinica.id}`);
            
            if (response.ok) {
                const responsaveisClinicas = await response.json();
                const responsaveisData = responsaveisClinicas.map((rc: { responsavel: { id: string; nome: string; email: string } }) => rc.responsavel);
                setResponsaveis(responsaveisData);
            }
        } catch (error) {
            console.error('Erro ao buscar responsáveis:', error);
        } finally {
            setLoading(false);
        }
    };

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

        if (clinica?.id) {
            fetchResponsaveis();
        }
    }, [clinica?.id]);

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

    const handleConfirmarSelecao = () => {
        if (selectedResponsavel) {
            // Salvar o responsável selecionado no sessionStorage e redirecionar
            sessionStorage.setItem('responsavelSelecionado', selectedResponsavel);
            router.push('/area-cliente/pacientes/cadastrar/dados');
        } else {
            toast.error("Por favor, selecione um responsável.", { duration: 2000 });
        }
    };

    const handleAdicionarResponsavel = () => {
        router.push('/area-cliente/pacientes/responsavel/cadastrar');
    };

    const responsaveisFiltrados = responsaveis.filter(responsavel =>
        responsavel.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        responsavel.cpf.includes(searchTerm)
    );

    const responsavelSelecionadoObj = responsaveis.find(r => r.id === selectedResponsavel);

    const handleSelectResponsavel = (responsavelId: string) => {
        setSelectedResponsavel(responsavelId);
        setShowDropdown(false);
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
                                <img src="./../../logo.png" alt="Icone do Sistema Íris" className="w-32" />
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
            <div className="flex">
                <SideBar activeLink="pacientes" />
                <div className="flex flex-col flex-1">
                    <TopBar />
                    <div className="flex-1 p-4 bg-[#f2f2f2]">
                        <div className="flex justify-center items-center gap-3 bg-[#EBEBEB] border-2 border-gray-300 p-2 rounded-md mb-2">
                            <svg width="34" height="20" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14V16C14.4 16 18 12.4 18 8H22V18C22 19.1 21.1 20 20 20S18 19.1 18 18V16H16V18C16 20.2 17.8 22 20 22S24 20.2 24 18V8C24 6.9 23.1 6 22 6H15.2C14.2 3.6 11.8 2 9 2C5.7 2 3 4.7 3 8S5.7 14 9 14C10.4 14 11.7 13.5 12.7 12.6L21 9Z" fill="#6D9CE3" />
                            </svg>
                            <h1 className={`text-3xl text-dark font-semibold ${inter.className}`}>
                                Cadastro de Paciente - Seleção de Responsável
                            </h1>
                        </div>
                        
                        <div className="flex justify-center items-center mt-10">
                            <h1 className={`text-4xl text-[#6D9CE3] font-semibold ${inter.className}`}>
                                Selecione um Responsável
                            </h1>
                        </div>

                        <div className="flex justify-center items-center mt-10">
                            <div className="w-full max-w-lg">
                                <label htmlFor="responsavel" className={`text-lg font-semibold text-gray-700 ${inter.className} block mb-3`}>
                                    Responsável
                                </label>
                                
                                {loading ? (
                                    <p className={`text-gray-600 ${inter.className}`}>Carregando responsáveis...</p>
                                ) : (
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
                                            className={`w-full p-3 border border-gray-300 rounded-md ${inter.className} text-lg`}
                                        />
                                        
                                        {showDropdown && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                {responsaveisFiltrados.length > 0 ? (
                                                    responsaveisFiltrados.map((responsavel) => (
                                                        <div
                                                            key={responsavel.id}
                                                            onClick={() => handleSelectResponsavel(responsavel.id)}
                                                            className={`p-3 cursor-pointer hover:bg-gray-100 ${inter.className}`}
                                                        >
                                                            {responsavel.nome} - {responsavel.cpf}
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
                                )}

                                <div className="flex justify-center gap-4 mt-8">
                                    <button
                                        onClick={handleConfirmarSelecao}
                                        className={`px-8 py-3 bg-[#6D9CE3] text-white rounded-lg hover:bg-blue-600 font-semibold ${inter.className}`}
                                        disabled={!selectedResponsavel || loading}
                                    >
                                        Confirmar Seleção
                                    </button>
                                    
                                    <button
                                        onClick={handleAdicionarResponsavel}
                                        className={`px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold ${inter.className}`}
                                    >
                                        Adicionar Novo Responsável
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
