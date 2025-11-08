'use client'

import { SideBarMedico } from "@/components/SideBarMedico";
import { TopBarMedico } from "@/components/TopBarMedico";
import { cairo, inter } from "@/utils/fonts";
import { useEffect, useState, useRef } from 'react';
import { useTerapeutaStore } from "@/context/terapeuta";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConsultaI } from "@/utils/types/consultas";
import { DependenteI } from "@/utils/types/dependentes";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Cookies from "js-cookie";

export default function RelatoriosMedica() {
    const [pacientes, setPacientes] = useState<DependenteI[]>([]);
    const [isLogged, setIsLogged] = useState(true);
    const [pacienteSelecionado, setPacienteSelecionado] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [consultas, setConsultas] = useState<ConsultaI[]>([]);
    const [loading, setLoading] = useState(false);
    const { terapeuta, carregaTerapeutaDaStorage } = useTerapeutaStore();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            buscaPacientes(authClinicaId);
        } else {
            buscaTerapeuta(terapeuta.id, terapeuta.clinicaId);
            buscaPacientes(terapeuta.clinicaId);
        }
    }, [terapeuta, router, carregaTerapeutaDaStorage]);

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

    async function buscaConsultasPaciente() {
        setLoading(true);
        try {
            let dados: ConsultaI[] = [];
            
            // Buscar por paciente específico
            if (pacienteSelecionado) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/paciente/${pacienteSelecionado}`, {
                    method: "GET"
                });

                if (response.status === 200) {
                    dados = await response.json();
                }
            } 
            // Buscar todas as consultas do terapeuta logado
            else {
                const terapeutaId = terapeuta.id || Cookies.get("authID");
                const clinicaId = terapeuta.clinicaId || Cookies.get("authClinicaId");
                
                if (terapeutaId && clinicaId) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/terapeuta/${terapeutaId}/${clinicaId}`, {
                        method: "GET"
                    });

                    if (response.status === 200) {
                        dados = await response.json();
                    }
                }
            }
            
            // Filtrar por período se datas foram informadas
            if (dataInicio || dataFim) {
                dados = dados.filter(consulta => {
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

            setConsultas(dados);
            
            if (dados.length === 0) {
                toast.info("Nenhuma consulta encontrada para os filtros selecionados");
            } else {
                toast.success(`${dados.length} atendimento(s) encontrado(s)`);
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

        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(18);
        doc.text('Relatório de Atendimentos', 14, 20);
        
        // Informações do Filtro
        doc.setFontSize(12);
        let yPos = 35;
        
        if (paciente) {
            doc.text(`Paciente: ${paciente.nome}`, 14, yPos);
            yPos += 7;
        }
        
        if (dataInicio || dataFim) {
            const periodo = dataInicio && dataFim 
                ? `${formatDate(dataInicio)} a ${formatDate(dataFim)}`
                : dataInicio 
                ? `A partir de ${formatDate(dataInicio)}`
                : `Até ${formatDate(dataFim)}`;
            doc.text(`Período: ${periodo}`, 14, yPos);
            yPos += 7;
        }
        
        doc.text(`Total de Atendimentos: ${consultas.length}`, 14, yPos);
        yPos += 7;
        
        // Tabela de consultas
        const tableData = consultas.map((consulta, index) => [
            (index + 1).toString(),
            formatDateTime(consulta.dataInicio),
            consulta.terapeuta.nome,
            consulta.terapeuta.profissao,
            consulta.dataFim ? formatDateTime(consulta.dataFim) : 'Em andamento',
            consulta.dataFim ? 'Finalizada' : 'Agendada'
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Nº', 'Data/Hora Início', 'Terapeuta', 'Profissão', 'Data/Hora Fim', 'Status']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [109, 156, 227] },
            styles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' }
            }
        });

        // Detalhes das consultas (se houver)
        interface JsPDFWithAutoTable extends jsPDF {
            lastAutoTable: { finalY: number };
        }
        let yPosition = (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 15;
        
        consultas.forEach((consulta, index) => {
            // Adicionar título do atendimento se houver detalhes ou relatório
            const terapeutaLogadoId = terapeuta.id || Cookies.get("authID");
            const temRelatorio = consulta.relatorio && consulta.terapeutaId === terapeutaLogadoId;
            
            if (consulta.detalhes || temRelatorio) {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(`Atendimento ${index + 1} - ${formatDateTime(consulta.dataInicio)}`, 14, yPosition);
                
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                const infoAtendimento = `Terapeuta: ${consulta.terapeuta.nome} | Paciente: ${consulta.paciente?.nome || 'Não informado'}`;
                doc.text(infoAtendimento, 14, yPosition + 5);
                yPosition += 12;
            }
            
            // Adicionar detalhes
            if (consulta.detalhes) {
                doc.setFontSize(9);
                const detalhesLines = doc.splitTextToSize(`Detalhes: ${consulta.detalhes}`, 180);
                doc.text(detalhesLines, 14, yPosition);
                yPosition += (detalhesLines.length * 4);
                
                // Se houver relatório também, praticamente sem espaço entre eles
                if (!temRelatorio) {
                    yPosition += 5;
                }
            }

            // Adicionar relatório apenas se o terapeuta logado for o mesmo que realizou a consulta
            if (temRelatorio) {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(9);
                const relatorioLines = doc.splitTextToSize(`Relatório: ${consulta.relatorio}`, 180);
                doc.text(relatorioLines, 14, yPosition);
                yPosition += (relatorioLines.length * 4) + 5;
            }
        });

        // Salvar PDF
        let nomeArquivo = 'relatorio';
        if (paciente) {
            nomeArquivo += `_${paciente.nome.replace(/\s/g, '_')}`;
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
        paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectPaciente = (pacienteId: string) => {
        setPacienteSelecionado(pacienteId);
        setSearchTerm(pacientes.find(p => p.id === pacienteId)?.nome || "");
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
            <SideBarMedico activeLink="relatorios" />
            <div className="w-full overflow-y-auto">
                <TopBarMedico />
                <div className="mx-5 my-10">
                    <h1 className={`text-3xl font-bold text-color-logo ${cairo.className}`}>
                        Relatórios de Atendimentos
                    </h1>
                    <p className={`text-base text-gray-600 mt-1 mb-8 ${inter.className}`}>
                        Gere relatórios detalhados filtrando por paciente, período ou combine os filtros
                    </p>

                    <div className="bg-white rounded-2xl shadow p-6">
                        {/* Filtros */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* Dropdown de Pacientes com busca integrada */}
                            <div className="relative" ref={dropdownRef}>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                    Paciente (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowDropdown(true);
                                        if (e.target.value === "") {
                                            setPacienteSelecionado("");
                                        }
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    placeholder="Digite para buscar ou selecione..."
                                    className={`w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 ${inter.className}`}
                                />
                                
                                {showDropdown && pacientesFiltrados.length > 0 && (
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
                                
                                {showDropdown && searchTerm && pacientesFiltrados.length === 0 && (
                                    <div className={`absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 text-gray-500 ${inter.className}`}>
                                        Nenhum paciente encontrado
                                    </div>
                                )}
                            </div>

                            {/* Data Início */}
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                    Data Início
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
                                    Data Fim
                                </label>
                                <input
                                    type="date"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    className={`w-full border-2 border-gray-300 rounded-lg p-2 ${inter.className}`}
                                />
                            </div>
                        </div>

                        {/* Botão Buscar */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={buscaConsultasPaciente}
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
                                                <div>
                                                    <p className={`font-semibold text-gray-900 ${inter.className}`}>
                                                        {formatDateTime(consulta.dataInicio)}
                                                        {consulta.dataFim && (
                                                            <span className="ml-2 text-xs text-green-600">
                                                                ✓ Finalizada
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className={`text-sm text-gray-600 ${inter.className}`}>
                                                        Terapeuta: {consulta.terapeuta.nome} ({consulta.terapeuta.profissao})
                                                    </p>
                                                    {consulta.dataFim && (
                                                        <p className={`text-sm text-gray-600 ${inter.className}`}>
                                                            Término: {formatDateTime(consulta.dataFim)}
                                                        </p>
                                                    )}
                                                    {consulta.detalhes && (
                                                        <div className="mt-2">
                                                            <p className={`text-sm font-medium text-gray-700 ${inter.className}`}>
                                                                Detalhes:
                                                            </p>
                                                            <p className={`text-sm text-gray-600 mt-1 ${inter.className}`}>
                                                                {consulta.detalhes}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {consulta.relatorio && consulta.terapeutaId === (terapeuta.id || Cookies.get("authID")) && (
                                                        <div className="mt-2">
                                                            <p className={`text-sm font-medium text-gray-700 ${inter.className}`}>
                                                                Relatório:
                                                            </p>
                                                            <p className={`text-sm text-gray-600 mt-1 ${inter.className}`}>
                                                                {consulta.relatorio}
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

                        {!loading && consultas.length === 0 && pacienteSelecionado && (
                            <div className="text-center py-10">
                                <p className={`text-gray-500 ${inter.className}`}>
                                    Nenhum atendimento encontrado. Clique em &quot;Buscar Atendimentos&quot; para carregar os dados.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
