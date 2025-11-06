'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import { useEffect, useState, useRef } from 'react';
import { useClinicaStore } from "@/context/clinica";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConsultaI } from "@/utils/types/consultas";
import { DependenteI } from "@/utils/types/dependentes";
import { TerapeutaI } from "@/utils/types/terapeutas";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function RelatoriosCliente() {
    const [pacientes, setPacientes] = useState<DependenteI[]>([]);
    const [isLogged, setIsLogged] = useState(true);
    const [terapeutas, setTerapeutas] = useState<TerapeutaI[]>([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState<string>("");
    const [terapeutaSelecionado, setTerapeutaSelecionado] = useState<string>("");
    const [searchTermPaciente, setSearchTermPaciente] = useState("");
    const [searchTermTerapeuta, setSearchTermTerapeuta] = useState("");
    const [showDropdownPaciente, setShowDropdownPaciente] = useState(false);
    const [showDropdownTerapeuta, setShowDropdownTerapeuta] = useState(false);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [consultas, setConsultas] = useState<ConsultaI[]>([]);
    const [loading, setLoading] = useState(false);
    const { clinica, carregaClinicaDaStorage } = useClinicaStore();
    const router = useRouter();
    const dropdownRefPaciente = useRef<HTMLDivElement>(null);
    const dropdownRefTerapeuta = useRef<HTMLDivElement>(null);

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

        // Carregar clínica do storage se não estiver no estado
        if (!clinica.id) {
            carregaClinicaDaStorage();
        }

        if (clinica.id) {
            buscaPacientes(clinica.id);
            buscaTerapeutas(clinica.id);
        }
    }, [clinica]);

    // Fechar dropdown de paciente ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRefPaciente.current && !dropdownRefPaciente.current.contains(event.target as Node)) {
                setShowDropdownPaciente(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fechar dropdown de terapeuta ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRefTerapeuta.current && !dropdownRefTerapeuta.current.contains(event.target as Node)) {
                setShowDropdownTerapeuta(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function buscaPacientes(clinicaId: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dependentes/clinica/${clinicaId}`, {
                method: "GET"
            });

            if (response.status === 200) {
                const dados = await response.json();
                setPacientes(dados);
            }
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
            toast.error("Erro ao carregar pacientes");
        }
    }

    async function buscaTerapeutas(clinicaId: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/terapeutas/clinica/${clinicaId}`, {
                method: "GET"
            });

            if (response.status === 200) {
                const dados = await response.json();
                setTerapeutas(dados);
            }
        } catch (error) {
            console.error('Erro ao buscar terapeutas:', error);
            toast.error("Erro ao carregar profissionais");
        }
    }

    async function buscaConsultas() {
        if (!pacienteSelecionado && !terapeutaSelecionado) {
            toast.error("Selecione ao menos um paciente ou profissional");
            return;
        }

        setLoading(true);
        try {
            let consultas: ConsultaI[] = [];

            // Buscar por paciente
            if (pacienteSelecionado) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/paciente/${pacienteSelecionado}`, {
                    method: "GET"
                });

                if (response.status === 200) {
                    consultas = await response.json();
                }
            } 
            // Buscar por terapeuta
            else if (terapeutaSelecionado && clinica.id) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/terapeuta/${terapeutaSelecionado}/${clinica.id}`, {
                    method: "GET"
                });

                if (response.status === 200) {
                    consultas = await response.json();
                }
            }

            // Se ambos foram selecionados, filtrar por terapeuta também
            if (pacienteSelecionado && terapeutaSelecionado) {
                consultas = consultas.filter(c => c.terapeutaId === terapeutaSelecionado);
            }

            // Filtrar por período se datas foram informadas
            if (dataInicio || dataFim) {
                consultas = consultas.filter(consulta => {
                    const dataConsulta = new Date(consulta.dataInicio).toISOString().split('T')[0];
                    
                    if (dataInicio && dataFim) {
                        return dataConsulta >= dataInicio && dataConsulta <= dataFim;
                    } else if (dataInicio) {
                        return dataConsulta >= dataInicio;
                    } else if (dataFim) {
                        return dataConsulta <= dataFim;
                    }
                    return true;
                });
            }

            setConsultas(consultas);
            
            if (consultas.length === 0) {
                toast.info("Nenhuma consulta encontrada para os filtros selecionados");
            } else {
                toast.success(`${consultas.length} atendimento(s) encontrado(s)`);
            }
        } catch (error) {
            console.error('Erro ao buscar consultas:', error);
            toast.error("Erro ao buscar consultas");
        } finally {
            setLoading(false);
        }
    }

    function gerarPDF() {
        if (consultas.length === 0) {
            toast.error("Não há consultas para gerar o relatório");
            return;
        }

        const paciente = pacienteSelecionado ? pacientes.find(p => p.id === pacienteSelecionado) : null;
        const terapeuta = terapeutaSelecionado ? terapeutas.find(t => t.id === terapeutaSelecionado) : null;

        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(18);
        doc.text('Relatório de Atendimentos', 14, 20);
        
        // Informações do Filtro
        doc.setFontSize(12);
        let yPosition = 35;
        
        if (paciente) {
            doc.text(`Paciente: ${paciente.nome}`, 14, yPosition);
            yPosition += 7;
        }
        
        if (terapeuta) {
            doc.text(`Profissional: ${terapeuta.nome} (${terapeuta.profissao})`, 14, yPosition);
            yPosition += 7;
        }
        
        if (dataInicio || dataFim) {
            const periodo = dataInicio && dataFim 
                ? `${formatDate(dataInicio)} a ${formatDate(dataFim)}`
                : dataInicio 
                ? `A partir de ${formatDate(dataInicio)}`
                : `Até ${formatDate(dataFim)}`;
            doc.text(`Período: ${periodo}`, 14, yPosition);
            yPosition += 7;
        }
        
        doc.text(`Total de Atendimentos: ${consultas.length}`, 14, yPosition);
        yPosition += 7;
        
        // Tabela de consultas
        const tableData = consultas.map(consulta => [
            formatDateTime(consulta.dataInicio),
            consulta.paciente?.nome || 'N/A',
            consulta.terapeuta.nome,
            consulta.terapeuta.profissao,
            consulta.dataFim ? formatDateTime(consulta.dataFim) : 'Em andamento',
            consulta.dataFim ? 'Finalizada' : 'Agendada'
        ]);

        autoTable(doc, {
            startY: yPosition,
            head: [['Data/Hora Início', 'Paciente', 'Profissional', 'Área', 'Data/Hora Fim', 'Status']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [109, 156, 227] },
            styles: { fontSize: 8 }
        });

        // Detalhes das consultas (se houver)
        interface JsPDFWithAutoTable extends jsPDF {
            lastAutoTable: { finalY: number };
        }
        let detalhesYPosition = (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 15;
        
        consultas.forEach((consulta, index) => {
            if (consulta.detalhes) {
                if (detalhesYPosition > 270) {
                    doc.addPage();
                    detalhesYPosition = 20;
                }
                
                doc.setFontSize(11);
                doc.text(`Atendimento ${index + 1} - ${formatDateTime(consulta.dataInicio)}`, 14, detalhesYPosition);
                detalhesYPosition += 7;
                
                doc.setFontSize(9);
                const detalhesLines = doc.splitTextToSize(`Detalhes: ${consulta.detalhes}`, 180);
                doc.text(detalhesLines, 14, detalhesYPosition);
                detalhesYPosition += (detalhesLines.length * 5) + 5;
            }
        });

        // Salvar PDF
        let nomeArquivo = 'relatorio';
        if (paciente) {
            nomeArquivo += `_${paciente.nome.replace(/\s/g, '_')}`;
        }
        if (terapeuta) {
            nomeArquivo += `_${terapeuta.nome.replace(/\s/g, '_')}`;
        }
        nomeArquivo += `_${new Date().toISOString().split('T')[0]}.pdf`;
        
        doc.save(nomeArquivo);
        toast.success("Relatório gerado com sucesso!");
    }

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatDateTime = (dateTimeString: string) => {
        const [date, time] = dateTimeString.split(' ');
        const [year, month, day] = date.split('-');
        const hora = time ? time.slice(0, 5) : '';
        return `${day}/${month}/${year} ${hora}`;
    };

    const pacientesFiltrados = pacientes.filter(paciente =>
        paciente.nome.toLowerCase().includes(searchTermPaciente.toLowerCase())
    );

    const terapeutasFiltrados = terapeutas.filter(terapeuta =>
        terapeuta.nome.toLowerCase().includes(searchTermTerapeuta.toLowerCase()) ||
        terapeuta.profissao.toLowerCase().includes(searchTermTerapeuta.toLowerCase())
    );

    const pacienteSelecionadoObj = pacientes.find(p => p.id === pacienteSelecionado);
    const terapeutaSelecionadoObj = terapeutas.find(t => t.id === terapeutaSelecionado);

    const handleSelectPaciente = (pacienteId: string) => {
        setPacienteSelecionado(pacienteId);
        setSearchTermPaciente(pacientes.find(p => p.id === pacienteId)?.nome || "");
        setShowDropdownPaciente(false);
    };

    const handleSelectTerapeuta = (terapeutaId: string) => {
        setTerapeutaSelecionado(terapeutaId);
        const terapeuta = terapeutas.find(t => t.id === terapeutaId);
        setSearchTermTerapeuta(terapeuta ? `${terapeuta.nome} (${terapeuta.profissao})` : "");
        setShowDropdownTerapeuta(false);
    };

    const limparFiltros = () => {
        setPacienteSelecionado("");
        setTerapeutaSelecionado("");
        setSearchTermPaciente("");
        setSearchTermTerapeuta("");
        setDataInicio("");
        setDataFim("");
        setConsultas([]);
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
                            <a href="/" className="flex">
                                <img src="./../logo.png" alt="Icone do Sistema Íris" className="w-32" />
                                <h1 className={`text-7xl ms-1 text-color-logo ${cairo.className}`}>
                                    ÍRIS
                                </h1>
                            </a>
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
            <SideBar activeLink="relatorios" />
            <div className="w-full overflow-y-auto">
                <TopBar />
                <div className="mx-5 my-10">
                    <h1 className={`text-3xl font-bold text-color-logo ${cairo.className}`}>
                        Relatórios de Atendimentos
                    </h1>
                    <p className={`text-base text-gray-600 mt-1 mb-8 ${inter.className}`}>
                        Gere relatórios detalhados filtrando por profissional, paciente ou ambos
                    </p>

                    <div className="bg-white rounded-2xl shadow p-6">
                        {/* Filtros */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Dropdown de Profissionais com busca integrada */}
                            <div className="relative" ref={dropdownRefTerapeuta}>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                    Profissional (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={searchTermTerapeuta}
                                    onChange={(e) => {
                                        setSearchTermTerapeuta(e.target.value);
                                        setShowDropdownTerapeuta(true);
                                        if (e.target.value === "") {
                                            setTerapeutaSelecionado("");
                                        }
                                    }}
                                    onFocus={() => setShowDropdownTerapeuta(true)}
                                    placeholder="Digite para buscar..."
                                    className={`w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 ${inter.className}`}
                                />
                                
                                {showDropdownTerapeuta && terapeutasFiltrados.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {terapeutasFiltrados.map((terapeuta) => (
                                            <div
                                                key={terapeuta.id}
                                                onClick={() => handleSelectTerapeuta(terapeuta.id)}
                                                className={`p-2 cursor-pointer hover:bg-blue-50 ${
                                                    terapeutaSelecionado === terapeuta.id ? 'bg-blue-100' : ''
                                                } ${inter.className}`}
                                            >
                                                <div className="font-medium">{terapeuta.nome}</div>
                                                <div className="text-sm text-gray-600">{terapeuta.profissao}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {showDropdownTerapeuta && searchTermTerapeuta && terapeutasFiltrados.length === 0 && (
                                    <div className={`absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 text-gray-500 ${inter.className}`}>
                                        Nenhum profissional encontrado
                                    </div>
                                )}
                            </div>

                            {/* Dropdown de Pacientes com busca integrada */}
                            <div className="relative" ref={dropdownRefPaciente}>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                    Paciente (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={searchTermPaciente}
                                    onChange={(e) => {
                                        setSearchTermPaciente(e.target.value);
                                        setShowDropdownPaciente(true);
                                        if (e.target.value === "") {
                                            setPacienteSelecionado("");
                                        }
                                    }}
                                    onFocus={() => setShowDropdownPaciente(true)}
                                    placeholder="Digite para buscar..."
                                    className={`w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 ${inter.className}`}
                                />
                                
                                {showDropdownPaciente && pacientesFiltrados.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {pacientesFiltrados.map((paciente) => (
                                            <div
                                                key={paciente.id}
                                                onClick={() => handleSelectPaciente(paciente.id)}
                                                className={`p-2 cursor-pointer hover:bg-blue-50 ${
                                                    pacienteSelecionado === paciente.id ? 'bg-blue-100' : ''
                                                } ${inter.className}`}
                                            >
                                                {paciente.nome}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {showDropdownPaciente && searchTermPaciente && pacientesFiltrados.length === 0 && (
                                    <div className={`absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 text-gray-500 ${inter.className}`}>
                                        Nenhum paciente encontrado
                                    </div>
                                )}
                            </div>

                            {/* Data Início */}
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                    Data Início (Opcional)
                                </label>
                                <input
                                    type="date"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    className={`w-full border-2 border-gray-300 rounded-lg p-2 ${inter.className}`}
                                />
                            </div>

                            {/* Data Fim */}
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                    Data Fim (Opcional)
                                </label>
                                <input
                                    type="date"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    className={`w-full border-2 border-gray-300 rounded-lg p-2 ${inter.className}`}
                                />
                            </div>
                        </div>

                        {/* Filtros Selecionados */}
                        {(pacienteSelecionado || terapeutaSelecionado || dataInicio || dataFim) && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className={`text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                    Filtros ativos:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {terapeutaSelecionado && terapeutaSelecionadoObj && (
                                        <span className={`bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm ${inter.className}`}>
                                            Profissional: {terapeutaSelecionadoObj.nome}
                                        </span>
                                    )}
                                    {pacienteSelecionado && pacienteSelecionadoObj && (
                                        <span className={`bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm ${inter.className}`}>
                                            Paciente: {pacienteSelecionadoObj.nome}
                                        </span>
                                    )}
                                    {dataInicio && (
                                        <span className={`bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm ${inter.className}`}>
                                            De: {formatDate(dataInicio)}
                                        </span>
                                    )}
                                    {dataFim && (
                                        <span className={`bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm ${inter.className}`}>
                                            Até: {formatDate(dataFim)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Botões de Ação */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={buscaConsultas}
                                disabled={loading}
                                className={`bg-[#6D9CE3] text-white px-6 py-2 rounded-lg hover:bg-[#5a8bd4] transition-colors ${inter.className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Buscando...' : 'Buscar Atendimentos'}
                            </button>
                            
                            {consultas.length > 0 && (
                                <button
                                    onClick={gerarPDF}
                                    className={`bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors ${inter.className}`}
                                >
                                    Gerar PDF
                                </button>
                            )}

                            {(pacienteSelecionado || terapeutaSelecionado || dataInicio || dataFim) && (
                                <button
                                    onClick={limparFiltros}
                                    className={`bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors ${inter.className}`}
                                >
                                    Limpar Filtros
                                </button>
                            )}
                        </div>

                        {/* Lista de Consultas */}
                        {consultas.length > 0 && (
                            <div>
                                <h2 className={`text-xl font-bold text-color-logo mb-4 ${cairo.className}`}>
                                    Atendimentos Encontrados ({consultas.length})
                                </h2>
                                <div className="space-y-3">
                                    {consultas.map((consulta) => (
                                        <div
                                            key={consulta.id}
                                            className={`p-4 border rounded-lg ${
                                                consulta.dataFim ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className={`font-semibold text-gray-900 ${inter.className}`}>
                                                            {formatDateTime(consulta.dataInicio)}
                                                        </p>
                                                        {consulta.dataFim && (
                                                            <span className="text-xs text-green-600 font-semibold">
                                                                ✓ Finalizada
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={`mt-2 space-y-1 text-sm text-gray-600 ${inter.className}`}>
                                                        <p>
                                                            <span className="font-medium">Paciente:</span> {consulta.paciente?.nome || 'N/A'}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Profissional:</span> {consulta.terapeuta.nome} ({consulta.terapeuta.profissao})
                                                        </p>
                                                        {consulta.dataFim && (
                                                            <p>
                                                                <span className="font-medium">Término:</span> {formatDateTime(consulta.dataFim)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {consulta.detalhes && (
                                                        <div className="mt-3">
                                                            <p className={`text-sm font-medium text-gray-700 ${inter.className}`}>
                                                                Detalhes:
                                                            </p>
                                                            <p className={`text-sm text-gray-600 mt-1 ${inter.className}`}>
                                                                {consulta.detalhes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    consulta.dataFim 
                                                        ? 'bg-green-200 text-green-800' 
                                                        : 'bg-blue-200 text-blue-800'
                                                }`}>
                                                    {consulta.dataFim ? 'Finalizada' : 'Agendada'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && consultas.length === 0 && (pacienteSelecionado || terapeutaSelecionado) && (
                            <div className="text-center py-10">
                                <p className={`text-gray-500 ${inter.className}`}>
                                    Nenhum atendimento encontrado para os filtros selecionados.
                                </p>
                            </div>
                        )}

                        {!loading && !pacienteSelecionado && !terapeutaSelecionado && consultas.length === 0 && (
                            <div className="text-center py-10">
                                <p className={`text-gray-500 ${inter.className}`}>
                                    Selecione ao menos um profissional ou paciente e clique em &quot;Buscar Atendimentos&quot;.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
