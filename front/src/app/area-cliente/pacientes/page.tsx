'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import { useClinicaStore } from "@/context/clinica";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from 'sonner';

interface CardPaciente {
    id: string;
    title: string;
    description: string;
    image: string;
}

export default function GestaoPacientes() {
    const { clinica, carregaClinicaDaStorage } = useClinicaStore();
    const router = useRouter();
    
    const [cards, setCards] = useState<CardPaciente[]>([]);
    const [isLogged, setIsLogged] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [sortedCards, setSortedCards] = useState<CardPaciente[]>([]);
    const [currentSortCriteria, setCurrentSortCriteria] = useState<string>("Nome A-Z");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredCards, setFilteredCards] = useState<CardPaciente[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const sortMenuRef = useRef<HTMLDivElement>(null);
    const cardMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Função para buscar dependentes do banco de dados
    const fetchDependentes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Verificar se existe clínica, se não, tentar carregar do storage
            const clinicaAtual = clinica?.id ? clinica : (() => {
                carregaClinicaDaStorage();
                const clinicaStorage = sessionStorage.getItem('clinica');
                return clinicaStorage ? JSON.parse(clinicaStorage) : null;
            })();
            
            if (!clinicaAtual?.id) {
                setError("ID da clínica não encontrado");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dependentesClinicas/${clinicaAtual.id}`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar pacientes');
            }
            
            const dependentesClinicas = await response.json();
            
            // Converter para o formato dos cards
            const cardsData: CardPaciente[] = dependentesClinicas.map((dependenteClinica: { dependente: { id: string; nome: string; genero: string } }) => ({
                id: dependenteClinica.dependente.id,
                title: dependenteClinica.dependente.nome,
                description: dependenteClinica.dependente.genero,
                image: "/avatar.png"
            }));
            
            setCards(cardsData);
            setSortedCards(cardsData);
            setFilteredCards(cardsData);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
            setError('Erro ao carregar os pacientes');
        } finally {
            setLoading(false);
        }
    };

    const toggleSortMenu = () => {
        setSortMenuVisible((prev) => !prev);
    };

    const sortCards = (criteria: string) => {
        const sorted = [...cards];

        switch (criteria) {
            case "Nome A-Z":
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "Nome Z-A":
                sorted.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                sorted.sort((a, b) => a.title.localeCompare(b.title));
        }

        setSortedCards(sorted);
        setCurrentSortCriteria(criteria);
        setCurrentPage(1); // Resetar para a primeira página após ordenação
        
        // Aplicar filtro na nova ordem
        applySearch(searchTerm, sorted);
    };

    const applySearch = (term: string, cardsToFilter = sortedCards) => {
        if (term.length >= 3) {
            const filtered = cardsToFilter.filter((card) =>
                card.title.toLowerCase().includes(term.toLowerCase()) ||
                card.description.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredCards(filtered);
        } else {
            setFilteredCards(cardsToFilter);
        }
        setCurrentPage(1); // Resetar para a primeira página após filtro
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        applySearch(term);
    };

    const handleSort = (criteria: string) => {
        console.log(`Ordenar por: ${criteria}`);
        sortCards(criteria);
        setSortMenuVisible(false);
    };

    const toggleMenu = (cardId: string) => {
        setMenuVisible((prevState) => ({
            ...prevState,
            [cardId]: !prevState[cardId],
        }));
    };

    const handleEditCard = (cardId: string) => {
        setMenuVisible((prevState) => ({
            ...prevState,
            [cardId]: false,
        }));
        
        // Navegar para a página de edição
        router.push(`/area-cliente/pacientes/editar/${cardId}`);
    };

    const handleViewResponsible = (cardId: string) => {
        setMenuVisible((prevState) => ({
            ...prevState,
            [cardId]: false,
        }));
        
        // Navegar para a página de responsáveis
        router.push(`/area-cliente/pacientes/responsavel/${cardId}`);
    };

    const handleDeleteCard = async (cardId: string) => {
        setMenuVisible((prevState) => ({
            ...prevState,
            [cardId]: false,
        }));
        
        // Usar toast para confirmação ao invés de window.confirm
        toast("Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.", {
            action: {
                label: "Confirmar",
                onClick: () => executeDeleteCard(cardId)
            },
            cancel: {
                label: "Cancelar",
                onClick: () => {}
            }
        });
    };

    // Função para executar a exclusão do paciente
    const executeDeleteCard = async (cardId: string) => {
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dependentes/${cardId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Erro ao excluir paciente');
            }
            
            // Remover o card da lista local
            const updatedCards = cards.filter(card => card.id !== cardId);
            setCards(updatedCards);
            setSortedCards(updatedCards);
            
            // Aplicar filtro novamente nos cards atualizados
            applySearch(searchTerm, updatedCards);
            
            // Ajustar página se necessário
            const newTotalPages = Math.ceil(updatedCards.length / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
            
            toast.success("Paciente excluído com sucesso!", { duration: 2000 });
            
        } catch (error) {
            console.error('Erro ao excluir paciente:', error);
            toast.error("Erro ao excluir paciente. Tente novamente.", { duration: 2000 });
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

        // Carregar a clínica do storage e buscar dependentes
        if (!clinica?.id) {
            carregaClinicaDaStorage();
        }
        // Sempre tentar carregar os dados quando o componente montar
        fetchDependentes();
    }, []);

    useEffect(() => {
        // Carregar dependentes quando a clínica mudar
        if (clinica?.id) {
            fetchDependentes();
        }
    }, [clinica?.id]);

    useEffect(() => {
        // Inicializar a ordenação padrão quando os cards carregarem
        if (cards.length > 0) {
            sortCards("Nome A-Z");
        }
    }, [cards]);

    useEffect(() => {
        // Inicializar cards filtrados
        setFilteredCards(sortedCards);
    }, [sortedCards]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Fechar o menu de ordenação se o clique for fora dele
            if (sortMenuRef.current && !sortMenuRef.current.contains(target)) {
                setSortMenuVisible(false);
            }

            // Fechar os menus dos cards se o clique for fora deles
            setMenuVisible((prevState) => {
                const newState = { ...prevState };
                Object.keys(cardMenuRefs.current).forEach((cardId) => {
                    const ref = cardMenuRefs.current[cardId];
                    if (ref && !ref.contains(target)) {
                        newState[cardId] = false;
                    }
                });
                return newState;
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const itemsPerPage = 6;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCards = filteredCards.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const handleJumpBack = () => {
        setCurrentPage((prev) => Math.max(1, prev - 10));
    };

    const handleJumpForward = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 10));
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
        return (
            <div className="flex">
                <SideBar activeLink="pacientes" />
                <div className="flex flex-col flex-1">
                    <TopBar />
                    <div className="flex-1 p-4 bg-[#f2f2f2]">
                        <div className="flex justify-between items-center gap-3 bg-[#EBEBEB] border-2 border-gray-300 p-2 rounded-md mb-2">
                            <div className="flex justify-between gap-3 items-center ms-10 mt-5 mb-5">
                                <svg width="34" height="20" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14V16C14.4 16 18 12.4 18 8H22V18C22 19.1 21.1 20 20 20S18 19.1 18 18V16H16V18C16 20.2 17.8 22 20 22S24 20.2 24 18V8C24 6.9 23.1 6 22 6H15.2C14.2 3.6 11.8 2 9 2C5.7 2 3 4.7 3 8S5.7 14 9 14C10.4 14 11.7 13.5 12.7 12.6L21 9Z" fill="#6D9CE3" />
                                </svg>
                                <h1 className={`text-3xl text-dark font-semibold ${inter.className}`}>
                                    Pacientes
                                </h1>
                            </div>
                            <div className="flex justify-center gap-3 items-center mt-5 mb-5">
                                <Link href="/area-cliente/pacientes/cadastrar" className="flex">
                                    <button className={`flex justify-center w-[250px] border-2 font-semibold items-center bg-[#6D9CE3] p-3 text-white text-sm rounded-lg ${inter.className}`}>
                                        Cadastrar Paciente
                                    </button>
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={toggleSortMenu}
                                        className={`flex justify-center w-[250px] border-2 font-bold items-center bg-white p-3 text-dark text-sm rounded-lg ${inter.className}`}
                                    >
                                        {currentSortCriteria}
                                    </button>
                                    {sortMenuVisible && (
                                        <div
                                            ref={sortMenuRef}
                                            className="absolute mt-2 w-40 bg-white rounded-md shadow-lg z-10"
                                        >
                                            <button
                                                onClick={() => handleSort("Nome A-Z")}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Nome A-Z
                                            </button>
                                            <button
                                                onClick={() => handleSort("Nome Z-A")}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Nome Z-A
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="relative me-10">
                                    <img src="/icon_connectmenu.png" alt="Buscar" className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Paciente"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="border-2 font-semibold rounded-lg pl-10 p-2.5 w-full outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {loading && (
                            <div className="flex justify-center items-center mt-10">
                                <p className={`text-xl text-gray-600 ${inter.className}`}>
                                    Carregando pacientes...
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
                        
                        {!loading && !error && currentCards.length === 0 && (
                            <div className="flex justify-center items-center mt-10">
                                <p className={`text-xl text-gray-600 ${inter.className}`}>
                                    Nenhum paciente encontrado.
                                </p>
                            </div>
                        )}
                        
                        {!loading && !error && currentCards.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center mt-5 mb-5">
                                    {currentCards.map((card) => (
                                        <div
                                            key={card.id}
                                            className="bg-blue-500 rounded-lg p-4 relative shadow-md w-[350px] h-[350px] flex flex-col items-center justify-center"
                                        >
                                            <div className="absolute top-2 right-2">
                                                <button
                                                    className="text-white text-xl"
                                                    onClick={() => toggleMenu(card.id)}
                                                >
                                                    ...
                                                </button>
                                                {menuVisible[card.id] && (
                                                    <div
                                                        ref={(el) => { cardMenuRefs.current[card.id] = el; }}
                                                        className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg"
                                                    >
                                                        <button
                                                            onClick={() => handleEditCard(card.id)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Editar Paciente
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewResponsible(card.id)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Ver Responsáveis
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCard(card.id)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Excluir Paciente
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Área redonda para imagem */}
                                            <div className="flex justify-center mt-5">
                                                <div className="w-52 h-52 rounded-full bg-white overflow-hidden">
                                                    <img
                                                        src={card.image}
                                                        alt={`Imagem do ${card.title}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            {/* Área de texto abaixo da imagem */}
                                            <div className="text-center mt-4 mb-5">
                                                <h2 className={`text-white text-lg font-semibold ${inter.className}`}>{card.title}</h2>
                                                <p className={`text-white text-lg mt-2 ${inter.className}`}>{card.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center items-center gap-2 mt-4">
                            {/* Botão para a primeira página */}
                            <button
                                onClick={handleFirstPage}
                                disabled={currentPage === 1}
                                className="px-3 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                            >
                                Primeira
                            </button>

                            {/* Botão para pular 10 páginas para trás */}
                            <button
                                onClick={handleJumpBack}
                                disabled={currentPage <= 10}
                                className="px-3 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                            >
                                -10
                            </button>

                            {/* Botão para a página anterior */}
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="px-3 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                            >
                                Anterior
                            </button>

                            {/* Exibir as duas páginas anteriores, a página atual e as duas próximas */}
                            {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
                                .filter((page) => page > 0 && page <= totalPages)
                                .map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 rounded-lg ${page === currentPage
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-300"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                            {/* Botão para a próxima página */}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                            >
                                Próximo
                            </button>

                            {/* Botão para pular 10 páginas para frente */}
                            <button
                                onClick={handleJumpForward}
                                disabled={currentPage > totalPages - 10}
                                className="px-3 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                            >
                                +10
                            </button>

                            {/* Botão para a última página */}
                            <button
                                onClick={handleLastPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                            >
                                Última
                            </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
