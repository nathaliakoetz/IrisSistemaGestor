'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function GestaoFuncionarios() {

    const cards = [
        { id: 1, title: "Ana Silva", description: "Psicóloga Clínica", image: "/avatar.png" },
        { id: 2, title: "Carlos Santos", description: "Psicólogo Cognitivo-Comportamental", image: "/avatar.png" },
        { id: 3, title: "Marina Costa", description: "Neuropsicóloga", image: "/avatar.png" },
        { id: 4, title: "Pedro Oliveira", description: "Psicólogo Organizacional", image: "/avatar.png" },
        { id: 5, title: "Juliana Ferreira", description: "Psicóloga Infantil", image: "/avatar.png" },
        { id: 6, title: "Roberto Lima", description: "Psicoterapeuta de Casal", image: "/avatar.png" },
        { id: 7, title: "Fernanda Rocha", description: "Psicóloga Escolar", image: "/avatar.png" },
        { id: 8, title: "Thiago Mendes", description: "Psicólogo Social", image: "/avatar.png" },
        { id: 9, title: "Luciana Moreira", description: "Psicóloga Humanista", image: "/avatar.png" },
        { id: 10, title: "André Barbosa", description: "Psicólogo Esportivo", image: "/avatar.png" },
        { id: 11, title: "Renata Alves", description: "Psicóloga Gestalt", image: "/avatar.png" },
        { id: 12, title: "Marcos Pereira", description: "Psicólogo Hospitalar", image: "/avatar.png" },
        { id: 13, title: "Camila Rodrigues", description: "Psicóloga Familiar", image: "/avatar.png" },
        { id: 14, title: "Eduardo Nunes", description: "Psicólogo Junguiano", image: "/avatar.png" },
        { id: 15, title: "Beatriz Araújo", description: "Psicóloga do Adolescente", image: "/avatar.png" },
        { id: 16, title: "Felipe Torres", description: "Psicoanalista", image: "/avatar.png" },
        { id: 17, title: "Patrícia Gomes", description: "Psicóloga Comportamental", image: "/avatar.png" },
        { id: 18, title: "Rafael Cardoso", description: "Psicólogo do Trabalho", image: "/avatar.png" },
        { id: 19, title: "Gabriela Melo", description: "Psicóloga Transpessoal", image: "/avatar.png" },
        { id: 20, title: "Diego Sousa", description: "Psicólogo Forense", image: "/avatar.png" },
        { id: 21, title: "Amanda Castro", description: "Psicóloga Positiva", image: "/avatar.png" },
        { id: 22, title: "Bruno Teixeira", description: "Psicólogo da Terceira Idade", image: "/avatar.png" },
        { id: 23, title: "Larissa Campos", description: "Psicóloga Sistêmica", image: "/avatar.png" },
        { id: 24, title: "Vinícius Ramos", description: "Psicólogo de Reabilitação", image: "/avatar.png" },
        { id: 25, title: "Natália Freitas", description: "Psicóloga Psicodramática", image: "/avatar.png" },
        { id: 26, title: "Gustavo Miranda", description: "Psicólogo EMDR", image: "/avatar.png" },
        { id: 27, title: "Isabella Correia", description: "Psicóloga de Emergências", image: "/avatar.png" },
        { id: 28, title: "Leonardo Dias", description: "Psicólogo Existencial", image: "/avatar.png" },
        { id: 29, title: "Stephanie Vieira", description: "Psicóloga de Grupo", image: "/avatar.png" },
        { id: 30, title: "Henrique Lopes", description: "Psicólogo de Trauma", image: "/avatar.png" },
        { id: 31, title: "Bianca Martins", description: "Psicóloga da Saúde", image: "/avatar.png" },
        { id: 32, title: "Rodrigo Cunha", description: "Psicólogo Hipnoterapeuta", image: "/avatar.png" },
        { id: 33, title: "Vanessa Pinto", description: "Psicóloga Familiar Sistêmica", image: "/avatar.png" },
        { id: 34, title: "Mateus Gonçalves", description: "Psicólogo de Casal", image: "/avatar.png" },
        { id: 35, title: "Priscila Reis", description: "Psicóloga de Ansiedade", image: "/avatar.png" },
        { id: 36, title: "Lucas Monteiro", description: "Psicólogo de Dependência", image: "/avatar.png" },
        { id: 37, title: "Aline Fonseca", description: "Psicóloga Perinatal", image: "/avatar.png" },
        { id: 38, title: "Danilo Morais", description: "Psicólogo Mindfulness", image: "/avatar.png" },
        { id: 39, title: "Caroline Ribeiro", description: "Psicóloga de Luto", image: "/avatar.png" },
        { id: 40, title: "Alexandre Cruz", description: "Psicólogo ACT", image: "/avatar.png" },
        { id: 41, title: "Tatiana Macedo", description: "Psicóloga Sexual", image: "/avatar.png" },
        { id: 42, title: "João Batista", description: "Psicólogo Comunitário", image: "/avatar.png" },
        { id: 43, title: "Bruna Aguiar", description: "Psicóloga DBT", image: "/avatar.png" },
        { id: 44, title: "Ricardo Moura", description: "Psicólogo de Vícios", image: "/avatar.png" },
        { id: 45, title: "Débora Xavier", description: "Psicóloga Transpessoal", image: "/avatar.png" },
        { id: 46, title: "Gabriel Caldeira", description: "Psicólogo Fenomenológico", image: "/avatar.png" },
        { id: 47, title: "Simone Duarte", description: "Psicóloga Arteterapia", image: "/avatar.png" },
        { id: 48, title: "Fábio Nascimento", description: "Psicólogo Musical", image: "/avatar.png" },
        { id: 49, title: "Cristiane Borges", description: "Psicóloga Logoterapia", image: "/avatar.png" },
        { id: 50, title: "Sérgio Azevedo", description: "Psicólogo Reichiano", image: "/avatar.png" },
        { id: 51, title: "Márcia Tavares", description: "Psicóloga TEA", image: "/avatar.png" },
        { id: 52, title: "Fabiano Coelho", description: "Psicólogo TDAH", image: "/avatar.png" },
        { id: 53, title: "Raquel Vargas", description: "Psicóloga de Transtornos", image: "/avatar.png" },
        { id: 54, title: "William Carvalho", description: "Psicólogo de Estresse", image: "/avatar.png" },
        { id: 55, title: "Karina Santana", description: "Psicóloga de Depressão", image: "/avatar.png" },
        { id: 56, title: "Marcelo Brito", description: "Psicólogo de Fobias", image: "/avatar.png" },
        { id: 57, title: "Eliane Medeiros", description: "Psicóloga Preventiva", image: "/avatar.png" },
        { id: 58, title: "Leandro Castro", description: "Psicólogo de Relacionamentos", image: "/avatar.png" },
        { id: 59, title: "Jéssica Rezende", description: "Psicóloga de Autoestima", image: "/avatar.png" },
        { id: 60, title: "Márcio Franco", description: "Psicólogo de Liderança", image: "/avatar.png" },
        { id: 61, title: "Carla Siqueira", description: "Psicóloga de Mudanças", image: "/avatar.png" },
        { id: 62, title: "Everton Mendonça", description: "Psicólogo de Conflitos", image: "/avatar.png" },
        { id: 63, title: "Mônica Bastos", description: "Psicóloga de Adaptação", image: "/avatar.png" },
        { id: 64, title: "César Nogueira", description: "Psicólogo de Carreira", image: "/avatar.png" },
        { id: 65, title: "Adriana Paiva", description: "Psicóloga de Desenvolvimento", image: "/avatar.png" },
        { id: 66, title: "Douglas Antunes", description: "Psicólogo de Motivação", image: "/avatar.png" },
        { id: 67, title: "Valéria Soares", description: "Psicóloga de Criatividade", image: "/avatar.png" },
        { id: 68, title: "Antônio Veloso", description: "Psicólogo de Comunicação", image: "/avatar.png" },
        { id: 69, title: "Claudia Rangel", description: "Psicóloga de Socialização", image: "/avatar.png" },
        { id: 70, title: "Flávio Dourado", description: "Psicólogo de Timidez", image: "/avatar.png" },
        { id: 71, title: "Denise Evangelista", description: "Psicóloga de Confiança", image: "/avatar.png" },
        { id: 72, title: "Robson Figueiredo", description: "Psicólogo de Assertividade", image: "/avatar.png" },
        { id: 73, title: "Luana Toledo", description: "Psicóloga de Empatia", image: "/avatar.png" },
        { id: 74, title: "Otávio Brandão", description: "Psicólogo de Inteligência Emocional", image: "/avatar.png" },
        { id: 75, title: "Silvia Sampaio", description: "Psicóloga de Habilidades Sociais", image: "/avatar.png" },
        { id: 76, title: "Igor Guerreiro", description: "Psicólogo de Resolução de Problemas", image: "/avatar.png" },
        { id: 77, title: "Cintia Valente", description: "Psicóloga de Tomada de Decisões", image: "/avatar.png" },
        { id: 78, title: "Renato Escobar", description: "Psicólogo de Planejamento", image: "/avatar.png" },
        { id: 79, title: "Glória Amaral", description: "Psicóloga de Organização", image: "/avatar.png" },
        { id: 80, title: "Jefferson Silveira", description: "Psicólogo de Produtividade", image: "/avatar.png" },
        { id: 81, title: "Helen Neves", description: "Psicóloga de Concentração", image: "/avatar.png" },
        { id: 82, title: "Caio Ferraz", description: "Psicólogo de Atenção", image: "/avatar.png" },
        { id: 83, title: "Solange Guimarães", description: "Psicóloga de Memória", image: "/avatar.png" },
        { id: 84, title: "Edson Machado", description: "Psicólogo de Aprendizagem", image: "/avatar.png" },
        { id: 85, title: "Viviane Rosa", description: "Psicóloga de Estudos", image: "/avatar.png" },
        { id: 86, title: "Júlio Peixoto", description: "Psicólogo de Performance", image: "/avatar.png" },
        { id: 87, title: "Paula Aragão", description: "Psicóloga de Competição", image: "/avatar.png" },
        { id: 88, title: "Nelson Farias", description: "Psicólogo de Resiliência", image: "/avatar.png" },
        { id: 89, title: "Sabrina Leite", description: "Psicóloga de Superação", image: "/avatar.png" },
        { id: 90, title: "Walter Ramos", description: "Psicólogo de Transformação", image: "/avatar.png" },
        { id: 91, title: "Mariana Senna", description: "Psicóloga de Bem-estar", image: "/avatar.png" },
        { id: 92, title: "Rubens Pacheco", description: "Psicólogo de Felicidade", image: "/avatar.png" },
        { id: 93, title: "Cláudia Horta", description: "Psicóloga de Harmonia", image: "/avatar.png" },
        { id: 94, title: "Rogério Delgado", description: "Psicólogo de Equilíbrio", image: "/avatar.png" },
        { id: 95, title: "Gisele Maciel", description: "Psicóloga de Mindfulness", image: "/avatar.png" },
        { id: 96, title: "Reinaldo Viana", description: "Psicólogo de Meditação", image: "/avatar.png" },
        { id: 97, title: "Célia Portela", description: "Psicóloga de Relaxamento", image: "/avatar.png" },
        { id: 98, title: "Vanderlei Leal", description: "Psicólogo de Yoga Terapia", image: "/avatar.png" },
        { id: 99, title: "Rosana Vieira", description: "Psicóloga de Respiração", image: "/avatar.png" },
        { id: 100, title: "Benedito Furtado", description: "Psicólogo de Autocuidado", image: "/avatar.png" },
    ];

    const [menuVisible, setMenuVisible] = useState<Record<number, boolean>>({});
    const [sortMenuVisible, setSortMenuVisible] = useState(false);

    const sortMenuRef = useRef<HTMLDivElement>(null);
    const cardMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const toggleSortMenu = () => {
        setSortMenuVisible((prev) => !prev);
    };

    const handleSort = (criteria: string) => {
        console.log(`Ordenar por: ${criteria}`);
        setSortMenuVisible(false);
    };

    const toggleMenu = (cardId: number) => {
        setMenuVisible((prevState) => ({
            ...prevState,
            [cardId]: !prevState[cardId],
        }));
    };

    const handleEditCard = (cardId: number) => {
        setMenuVisible((prevState) => ({
            ...prevState,
            [cardId]: false,
        }));
        console.log(`Editar card ${cardId}`);
    };

    const handleDeleteCard = (cardId: number) => {
        setMenuVisible((prevState) => ({
            ...prevState,
            [cardId]: false,
        }));
        console.log(`Excluir card ${cardId}`);
    };

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
                    const ref = cardMenuRefs.current[Number(cardId)];
                    if (ref && !ref.contains(target)) {
                        newState[Number(cardId)] = false;
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCards = cards.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(cards.length / itemsPerPage);

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
            <div className="flex">
                <SideBar activeLink="funcionario" />
                <div className="flex flex-col flex-1">
                    <TopBar />
                    <div className="flex-1 p-4 bg-[#f2f2f2]">
                        <div className="flex justify-between items-center gap-3 bg-[#EBEBEB] border-2 border-gray-300 p-2 rounded-md mb-2">
                            <div className="flex justify-between gap-3 items-center ms-10 mt-5 mb-5">
                                <svg width="34" height="20" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.912354 29.8266V25.9682C0.912354 24.8776 1.18718 23.9201 1.73683 23.0958C2.28649 22.2712 3.07051 21.6372 4.08892 21.1938C6.33405 20.2063 8.37642 19.4694 10.216 18.9833C12.0556 18.4972 14.1146 18.2542 16.3931 18.2542C18.6712 18.2542 20.7202 18.4972 22.54 18.9833C24.3594 19.4694 26.4014 20.2052 28.666 21.1906C29.6729 21.6372 30.4577 22.2726 31.0202 23.0969C31.5823 23.9208 31.8634 24.878 31.8634 25.9682V29.8266H0.912354ZM35.2629 29.8266V26.0443C35.2629 24.2082 34.8278 22.675 33.9577 21.4448C33.0872 20.2149 31.9644 19.2115 30.5894 18.4344C32.4165 18.7229 34.1485 19.0927 35.7853 19.5438C37.4221 19.9951 38.7988 20.4922 39.9155 21.0349C40.8724 21.5901 41.6464 22.2927 42.2374 23.1427C42.828 23.9931 43.1233 24.9582 43.1233 26.038V29.8266H35.2629ZM16.3931 14.1531C14.391 14.1531 12.753 13.5161 11.479 12.2422C10.2051 10.9682 9.56808 9.33038 9.56808 7.32865C9.56808 5.32656 10.2051 3.69184 11.479 2.42448C12.753 1.15712 14.391 0.523438 16.3931 0.523438C18.3948 0.523438 20.0294 1.15712 21.2967 2.42448C22.5641 3.69184 23.1978 5.32656 23.1978 7.32865C23.1978 9.33038 22.5641 10.9682 21.2967 12.2422C20.0294 13.5161 18.3948 14.1531 16.3931 14.1531ZM32.5608 7.31562C32.5608 9.30486 31.9271 10.9375 30.6598 12.2135C29.3924 13.4892 27.7554 14.1271 25.7488 14.1271C25.5158 14.1271 25.2756 14.1139 25.028 14.0875C24.7808 14.0608 24.5433 14.0069 24.3155 13.926C25.0669 13.1337 25.6308 12.179 26.0071 11.062C26.3832 9.94532 26.5712 8.70278 26.5712 7.33438C26.5712 5.97084 26.3735 4.7566 25.978 3.69167C25.5828 2.62639 25.0287 1.63316 24.3155 0.711979C24.5158 0.660937 24.7516 0.616841 25.0228 0.579688C25.294 0.542188 25.5349 0.523438 25.7457 0.523438C27.7544 0.523438 29.3924 1.16007 30.6598 2.43333C31.9271 3.70625 32.5608 5.33368 32.5608 7.31562ZM3.19569 27.5427H29.5801V25.9776C29.5801 25.4092 29.4174 24.8846 29.092 24.4036C28.767 23.9231 28.32 23.5266 27.7509 23.2141C25.5467 22.1898 23.6288 21.4875 21.9973 21.1073C20.3657 20.7274 18.5033 20.5375 16.4103 20.5375C14.3117 20.5375 12.4339 20.7274 10.7769 21.1073C9.12034 21.4875 7.19899 22.1898 5.01287 23.2141C4.41982 23.5266 3.96878 23.9254 3.65975 24.4104C3.35037 24.8958 3.19569 25.4151 3.19569 25.9682V27.5427ZM16.3795 11.8698C17.6893 11.8698 18.7724 11.4425 19.629 10.588C20.4856 9.73351 20.9139 8.65139 20.9139 7.34167C20.9139 6.03229 20.4867 4.94913 19.6321 4.09219C18.7776 3.23559 17.6957 2.80729 16.3863 2.80729C15.0766 2.80729 13.9934 3.23455 13.1368 4.08906C12.2799 4.94358 11.8514 6.02569 11.8514 7.33542C11.8514 8.64479 12.2788 9.72795 13.1337 10.5849C13.9882 11.4415 15.0702 11.8698 16.3795 11.8698Z" fill="#6D9CE3" />
                                </svg>
                                <h1 className={`text-3xl text-dark font-semibold ${inter.className}`}>
                                    Funcionários
                                </h1>
                            </div>
                            <div className="flex justify-center gap-3 items-center mt-5 mb-5">
                                <Link href="/area-cliente/funcionario/cadastrar" className="flex">
                                    <button className={`flex justify-center w-[250px] border-2 font-semibold items-center bg-[#6D9CE3] p-3 text-white text-sm rounded-lg ${inter.className}`}>
                                        Cadastrar Funcionário
                                    </button>
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={toggleSortMenu}
                                        className={`flex justify-center w-[250px] border-2 font-bold items-center bg-white p-3 text-dark text-sm rounded-lg ${inter.className}`}
                                    >
                                        Ordenar Por
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
                                            <button
                                                onClick={() => handleSort("Profissão A-Z")}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profissão A-Z
                                            </button>
                                            <button
                                                onClick={() => handleSort("Profissão Z-A")}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profissão Z-A
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="relative me-10">
                                    <img src="/icon_connectmenu.png" alt="Buscar" className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Funcionário"
                                        // value={searchTerm}
                                        // onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border-2 font-semibold rounded-lg pl-10 p-2.5 w-full outline-none"
                                    />
                                </div>
                            </div>
                        </div>
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
                                                    Editar Card
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCard(card.id)}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Excluir Card
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
                    </div>
                </div>
            </div>
        )
    }
}