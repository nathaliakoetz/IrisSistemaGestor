'use client'

import { useState, useEffect } from 'react';
import { cairo, inter } from '@/utils/fonts';
import { useTerapeutaStore } from '@/context/terapeuta';

interface Card {
    id: number;
    emoji: string;
    emotion: string;
    isFlipped: boolean;
    isMatched: boolean;
}

interface JogoMemoriaProps {
    consultaId: number;
    pacienteNome: string;
    tempoLimiteMinutos: number;
    onClose: () => void;
}

const emocoes = [
    { emoji: '😊', name: 'Feliz' },
    { emoji: '😢', name: 'Triste' },
    { emoji: '😡', name: 'Bravo' },
    { emoji: '😱', name: 'Medo' },
    { emoji: '🥰', name: 'Amor' },
    { emoji: '😴', name: 'Cansado' },
    { emoji: '🤔', name: 'Pensativo' },
    { emoji: '😲', name: 'Surpreso' },
];

export function JogoMemoria({ consultaId, pacienteNome, tempoLimiteMinutos, onClose }: JogoMemoriaProps) {
    const { terapeuta } = useTerapeutaStore();
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [tentativas, setTentativas] = useState(0);
    const [paresEncontrados, setParesEncontrados] = useState(0);
    const [tempo, setTempo] = useState(0);
    const [jogoIniciado, setJogoIniciado] = useState(false);
    const [jogoFinalizado, setJogoFinalizado] = useState(false);
    const [podeJogar, setPodeJogar] = useState(true);
    const [sessaoFinalizada, setSessaoFinalizada] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(tempoLimiteMinutos * 60); // em segundos
    const [partidasJogadas, setPartidasJogadas] = useState(0);
    const [modoEscuro, setModoEscuro] = useState(false); // Modo claro por padrão
    
    // Estados para modais de confirmação
    const [modalFecharAberto, setModalFecharAberto] = useState(false);
    const [modalFinalizarAberto, setModalFinalizarAberto] = useState(false);
    const [senhaDigitada, setSenhaDigitada] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [pausarTimerSessao, setPausarTimerSessao] = useState(false);
    const [validandoSenha, setValidandoSenha] = useState(false);

    // Estados para rastreamento de dados da sessão
    interface PartidaData {
        tentativas: number;
        acertos: number;
        tempo: number;
    }
    
    const [historicoPartidas, setHistoricoPartidas] = useState<PartidaData[]>([]);
    const [acertosPorEmocao, setAcertosPorEmocao] = useState<Record<string, number>>({});
    const [confusoesPorEmocao, setConfusoesPorEmocao] = useState<Record<string, Record<string, number>>>({});
    const [temposEntreEscolhas, setTemposEntreEscolhas] = useState<number[]>([]);
    const [ultimoTempoEscolha, setUltimoTempoEscolha] = useState<number>(0);

    // Inicializar o jogo
    useEffect(() => {
        inicializarJogo();
    }, []);

    // Timer do jogo individual
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (jogoIniciado && !jogoFinalizado && !sessaoFinalizada) {
            interval = setInterval(() => {
                setTempo(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [jogoIniciado, jogoFinalizado, sessaoFinalizada]);

    // Timer da sessão (tempo restante)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!sessaoFinalizada && !pausarTimerSessao && jogoIniciado && !jogoFinalizado) {
            interval = setInterval(() => {
                setTempoRestante(prev => {
                    if (prev <= 1) {
                        setSessaoFinalizada(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [sessaoFinalizada, pausarTimerSessao, jogoIniciado, jogoFinalizado]);

    // Pausar timer da sessão quando o jogo finaliza
    useEffect(() => {
        setPausarTimerSessao(jogoFinalizado);
    }, [jogoFinalizado]);

    const inicializarJogo = () => {
        if (sessaoFinalizada) return; // Não permite reiniciar se a sessão acabou

        // Incrementa partidas jogadas apenas se já tiver jogado antes
        const jaJogou = jogoIniciado || jogoFinalizado || partidasJogadas > 0;
        
        // Criar pares de cartas
        const cardPairs: Card[] = [];
        emocoes.forEach((emocao, index) => {
            cardPairs.push(
                {
                    id: index * 2,
                    emoji: emocao.emoji,
                    emotion: emocao.name,
                    isFlipped: false,
                    isMatched: false,
                },
                {
                    id: index * 2 + 1,
                    emoji: emocao.emoji,
                    emotion: emocao.name,
                    isFlipped: false,
                    isMatched: false,
                }
            );
        });

        // Embaralhar
        const shuffled = cardPairs.sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setFlippedCards([]);
        setTentativas(0);
        setParesEncontrados(0);
        setTempo(0);
        setJogoIniciado(false);
        setJogoFinalizado(false);
        setPodeJogar(true);
        
        // Incrementa partidas jogadas se não for a primeira vez
        if (jaJogou) {
            setPartidasJogadas(prev => prev + 1);
        }
    };

    const handleCardClick = (cardId: number) => {
        if (!podeJogar || flippedCards.length >= 2 || sessaoFinalizada) return;

        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        // Rastrear tempo entre escolhas
        if (jogoIniciado && ultimoTempoEscolha > 0) {
            const tempoDecorrido = tempo - ultimoTempoEscolha;
            setTemposEntreEscolhas(prev => [...prev, tempoDecorrido]);
        }
        setUltimoTempoEscolha(tempo);

        // Iniciar o jogo no primeiro clique (apenas a primeira vez)
        if (!jogoIniciado && partidasJogadas === 0) {
            setJogoIniciado(true);
            setPartidasJogadas(1); // Primeira partida
            setUltimoTempoEscolha(0); // Reset no início
        } else if (!jogoIniciado) {
            // Ao reiniciar, apenas marca como iniciado
            setJogoIniciado(true);
            setUltimoTempoEscolha(0); // Reset ao reiniciar
        }

        const newCards = cards.map(c =>
            c.id === cardId ? { ...c, isFlipped: true } : c
        );
        setCards(newCards);

        const newFlippedCards = [...flippedCards, cardId];
        setFlippedCards(newFlippedCards);

        // Se virou duas cartas
        if (newFlippedCards.length === 2) {
            setTentativas(prev => prev + 1);
            setPodeJogar(false);

            const [firstId, secondId] = newFlippedCards;
            const firstCard = newCards.find(c => c.id === firstId);
            const secondCard = newCards.find(c => c.id === secondId);

            if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
                // Encontrou um par! Registrar acerto
                setTimeout(() => {
                    const matchedCards = newCards.map(c =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isMatched: true }
                            : c
                    );
                    setCards(matchedCards);
                    setFlippedCards([]);
                    setPodeJogar(true);
                    
                    // Registrar acerto da emoção
                    setAcertosPorEmocao(prev => ({
                        ...prev,
                        [firstCard.emoji]: (prev[firstCard.emoji] || 0) + 1
                    }));
                    
                    setParesEncontrados(prev => {
                        const novoPares = prev + 1;
                        if (novoPares === emocoes.length) {
                            // Salvar dados da partida ao finalizar
                            setHistoricoPartidas(prevHistorico => [
                                ...prevHistorico,
                                {
                                    tentativas: tentativas + 1, // +1 porque o state ainda não atualizou
                                    acertos: novoPares,
                                    tempo: tempo
                                }
                            ]);
                            setJogoFinalizado(true);
                        }
                        return novoPares;
                    });
                }, 500);
            } else {
                // Não combinou - Registrar confusão
                if (firstCard && secondCard) {
                    setConfusoesPorEmocao(prev => {
                        const newConfusoes = { ...prev };
                        
                        // Registrar que firstCard foi confundida com secondCard
                        if (!newConfusoes[firstCard.emoji]) {
                            newConfusoes[firstCard.emoji] = {};
                        }
                        newConfusoes[firstCard.emoji][secondCard.emoji] = 
                            (newConfusoes[firstCard.emoji][secondCard.emoji] || 0) + 1;
                        
                        // Registrar o inverso também
                        if (!newConfusoes[secondCard.emoji]) {
                            newConfusoes[secondCard.emoji] = {};
                        }
                        newConfusoes[secondCard.emoji][firstCard.emoji] = 
                            (newConfusoes[secondCard.emoji][firstCard.emoji] || 0) + 1;
                        
                        return newConfusoes;
                    });
                }
                
                setTimeout(() => {
                    const unflippedCards = newCards.map(c =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isFlipped: false }
                            : c
                    );
                    setCards(unflippedCards);
                    setFlippedCards([]);
                    setPodeJogar(true);
                }, 1000);
            }
        }
    };

    const formatarTempo = (segundos: number) => {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatarTempoRestante = (segundos: number) => {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        
        if (mins === 0 && secs <= 10) {
            return { texto: `${secs}s`, alerta: true };
        }
        
        return { 
            texto: mins > 0 ? `${mins}min ${secs}s` : `${secs}s`,
            alerta: mins === 0 && secs <= 60
        };
    };

    const gerarRelatorio = async () => {
        try {
            // Calcular estatísticas
            const totalPartidas = historicoPartidas.length;
            
            // Tempo médio das partidas
            const tempoMedio = totalPartidas > 0 
                ? historicoPartidas.reduce((acc, p) => acc + p.tempo, 0) / totalPartidas 
                : 0;
            
            // Tempo médio entre escolhas
            const tempoMedioEscolhas = temposEntreEscolhas.length > 0
                ? temposEntreEscolhas.reduce((acc, t) => acc + t, 0) / temposEntreEscolhas.length
                : 0;
            
            // Ordenar emoções por acertos (decrescente)
            const emocoesOrdenadas = Object.entries(acertosPorEmocao)
                .sort(([, a], [, b]) => b - a)
                .map(([emoji, quantidade]) => {
                    const emocao = emocoes.find(e => e.emoji === emoji);
                    return `${emoji} ${emocao?.name}: ${quantidade} acertos`;
                });
            
            // Identificar principais confusões
            const confusoesTexto: string[] = [];
            Object.entries(confusoesPorEmocao).forEach(([emoji1, confusoes]) => {
                const emocao1 = emocoes.find(e => e.emoji === emoji1);
                Object.entries(confusoes)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 2) // Top 2 confusões por emoção
                    .forEach(([emoji2, quantidade]) => {
                        const emocao2 = emocoes.find(e => e.emoji === emoji2);
                        if (quantidade > 0) {
                            confusoesTexto.push(`${emoji1} ${emocao1?.name} ↔ ${emoji2} ${emocao2?.name}: ${quantidade}x`);
                        }
                    });
            });
            
            // Criar texto do relatório formatado
            const novoRelatorio = `
═══════════════════════════════════════════════════════════════
🎮 RELATÓRIO DO JOGO DA MEMÓRIA - MUNDO DAS EMOÇÕES
═══════════════════════════════════════════════════════════════

📅 Data/Hora: ${new Date().toLocaleString('pt-BR')}
👤 Paciente: ${pacienteNome}
👨‍⚕️ Terapeuta: ${terapeuta.nome}
⏱️ Tempo Limite da Sessão: ${tempoLimiteMinutos} minutos

───────────────────────────────────────────────────────────────
📊 ESTATÍSTICAS GERAIS
───────────────────────────────────────────────────────────────

🎯 Quantidade de Partidas: ${totalPartidas}

${totalPartidas > 0 ? `
📋 Detalhes por Partida:
${historicoPartidas.map((p, i) => `
   Partida ${i + 1}:
   • Tentativas: ${p.tentativas}
   • Pares Encontrados: ${p.acertos}
   • Tempo: ${formatarTempo(p.tempo)}
   • Taxa de Acerto: ${((p.acertos / p.tentativas) * 100).toFixed(1)}%`).join('\n')}

⏱️ Tempo Médio por Partida: ${formatarTempo(Math.round(tempoMedio))}

⚡ Tempo Médio Entre Escolhas: ${tempoMedioEscolhas.toFixed(1)} segundos

───────────────────────────────────────────────────────────────
😊 RECONHECIMENTO DE EMOÇÕES
───────────────────────────────────────────────────────────────

✅ Emoções Acertadas (ordem decrescente):
${emocoesOrdenadas.length > 0 ? emocoesOrdenadas.map(e => `   • ${e}`).join('\n') : '   (Nenhum acerto registrado)'}

${confusoesTexto.length > 0 ? `
❌ Principais Confusões Observadas:
${confusoesTexto.map(c => `   • ${c}`).join('\n')}` : ''}
` : 'Nenhuma partida foi completada nesta sessão.'}

═══════════════════════════════════════════════════════════════
`;

            // Buscar relatório existente da consulta específica
            const responseGet = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/detalhes/${consultaId}`, {
                method: "GET",
                headers: { "Content-type": "Application/json" }
            });

            if (responseGet.ok) {
                const consultaAtual = await responseGet.json();
                
                let relatorioCompleto = novoRelatorio;
                
                // Se já existe relatório, adicionar separador
                if (consultaAtual?.relatorio) {
                    relatorioCompleto = consultaAtual.relatorio + '\n\n' + novoRelatorio;
                }
                
                console.log("📝 Salvando relatório para consulta ID:", consultaId);
                console.log("📊 Relatório anterior existe:", !!consultaAtual?.relatorio);
                console.log("📏 Tamanho do relatório completo:", relatorioCompleto.length);
                
                // Atualizar consulta com o relatório
                const responsePatch = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/consultas/finalizar/${consultaId}`, {
                    method: "PATCH",
                    headers: { "Content-type": "Application/json" },
                    body: JSON.stringify({ 
                        relatorio: relatorioCompleto
                    })
                });

                if (responsePatch.ok) {
                    const resultado = await responsePatch.json();
                    console.log("✅ Relatório salvo com sucesso!", resultado);
                } else {
                    const erro = await responsePatch.text();
                    console.error("❌ Erro ao salvar relatório:", erro);
                }
            } else {
                console.error("❌ Erro ao buscar consulta:", responseGet.status);
            }
        } catch (error) {
            console.error("Erro ao gerar/salvar relatório:", error);
        }
    };

    const abrirModalFechar = () => {
        setSenhaDigitada('');
        setErroSenha('');
        setModalFecharAberto(true);
    };

    const abrirModalFinalizar = () => {
        setSenhaDigitada('');
        setErroSenha('');
        setModalFinalizarAberto(true);
    };

    const fecharModal = () => {
        setModalFecharAberto(false);
        setModalFinalizarAberto(false);
        setSenhaDigitada('');
        setErroSenha('');
        setValidandoSenha(false);
    };

    const validarSenha = async (senha: string): Promise<boolean> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/terapeutas/login`, {
                method: "POST",
                headers: { "Content-type": "Application/json" },
                body: JSON.stringify({ 
                    email: terapeuta.email, 
                    senha: senha 
                })
            });

            return response.status === 200;
        } catch (error) {
            console.error('Erro ao validar senha:', error);
            return false;
        }
    };

    const confirmarFechar = async () => {
        if (senhaDigitada.trim() === '') {
            setErroSenha('Por favor, digite sua senha');
            return;
        }
        
        setValidandoSenha(true);
        setErroSenha('');
        
        const senhaValida = await validarSenha(senhaDigitada);
        
        setValidandoSenha(false);
        
        if (senhaValida) {
            fecharModal();
            onClose();
        } else {
            setErroSenha('Senha incorreta. Tente novamente.');
        }
    };

    const confirmarFinalizar = async () => {
        if (senhaDigitada.trim() === '') {
            setErroSenha('Por favor, digite sua senha');
            return;
        }
        
        setValidandoSenha(true);
        setErroSenha('');
        
        const senhaValida = await validarSenha(senhaDigitada);
        
        if (senhaValida) {
            await gerarRelatorio(); // Aguarda salvar o relatório
            setValidandoSenha(false);
            fecharModal();
            onClose();
        } else {
            setValidandoSenha(false);
            setErroSenha('Senha incorreta. Tente novamente.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
            {/* Cabeçalho Compacto */}
            <div className="bg-gradient-to-r from-[#6d9ce3] to-[#4a7bc0] px-3 py-2 flex-shrink-0">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        {/* Logo do Sistema */}
                        <img 
                            src="/logo.png" 
                            alt="Logo Íris" 
                            className="w-8 h-8 md:w-10 md:h-10 object-contain"
                        />
                        <h2 className={`text-base md:text-xl lg:text-2xl font-bold text-white ${cairo.className}`}>
                            Jogo da Memória
                        </h2>
                        <span className={`hidden md:inline text-white/90 text-xs lg:text-sm ${inter.className}`}>
                            • {pacienteNome}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Botão de Modo Claro/Escuro */}
                        <button
                            onClick={() => setModoEscuro(!modoEscuro)}
                            className="text-white hover:bg-white/20 rounded-lg p-1.5 md:p-2 transition-all"
                            aria-label={modoEscuro ? "Mudar para modo claro" : "Mudar para modo escuro"}
                            title={modoEscuro ? "Modo Claro" : "Modo Escuro"}
                        >
                            <span className="text-lg md:text-xl">
                                {modoEscuro ? '☀️' : '🌙'}
                            </span>
                        </button>
                        
                        {/* Tempo Restante da Sessão */}
                        <div className={`px-2 md:px-3 py-1 rounded-lg ${
                            formatarTempoRestante(tempoRestante).alerta 
                                ? 'bg-red-500 animate-pulse' 
                                : 'bg-white/20'
                        }`}>
                            <span className={`text-white font-bold text-xs md:text-sm ${inter.className}`}>
                                ⏳ {formatarTempoRestante(tempoRestante).texto}
                            </span>
                        </div>
                        {!jogoFinalizado && !sessaoFinalizada && (
                            <button
                                onClick={inicializarJogo}
                                className="text-white hover:bg-white/20 rounded-lg px-2 md:px-3 py-1.5 transition-all flex items-center gap-1.5 text-xs md:text-sm font-semibold"
                                aria-label="Reiniciar jogo"
                            >
                                <span className="text-base md:text-lg">🔄</span>
                                <span className="hidden sm:inline">Reiniciar</span>
                            </button>
                        )}
                        <button
                            onClick={abrirModalFechar}
                            className="text-white hover:bg-white/20 rounded-full p-1.5 transition-all flex-shrink-0"
                            aria-label="Fechar jogo"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Estatísticas Compactas */}
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 flex-shrink-0">
                <div className="grid grid-cols-4 gap-2 max-w-3xl mx-auto">
                    <div className="text-center p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <p className={`text-sm md:text-lg font-bold text-white ${cairo.className}`}>
                            🎯 {partidasJogadas}
                        </p>
                    </div>
                    <div className="text-center p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <p className={`text-sm md:text-lg font-bold text-white ${cairo.className}`}>
                            ⏱️ {formatarTempo(tempo)}
                        </p>
                    </div>
                    <div className="text-center p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <p className={`text-sm md:text-lg font-bold text-white ${cairo.className}`}>
                            🔢 {tentativas}
                        </p>
                    </div>
                    <div className="text-center p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <p className={`text-sm md:text-lg font-bold text-white ${cairo.className}`}>
                            ✨ {paresEncontrados}/{emocoes.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Área do Jogo - Ajustada para caber na tela */}
            <div className={`flex-1 flex flex-col items-center justify-center px-2 py-3 md:px-4 md:py-4 overflow-y-auto min-h-0 transition-colors duration-300 ${
                modoEscuro 
                    ? 'bg-gradient-to-br from-[#192333] to-[#252d39]' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}>
                <div className="w-full max-w-4xl flex flex-col items-center gap-3">
                    {sessaoFinalizada ? (
                        // Tela de Sessão Finalizada
                        <div className="text-center w-full max-w-xl mx-auto">
                            <div className="text-5xl md:text-6xl mb-3">⏰</div>
                            <h3 className={`text-2xl md:text-4xl font-bold ${modoEscuro ? 'text-white' : 'text-gray-800'} mb-3 ${cairo.className}`}>
                                Sessão Finalizada!
                            </h3>
                            <p className={`text-base md:text-xl ${modoEscuro ? 'text-white/90' : 'text-gray-700'} mb-4 ${inter.className}`}>
                                O tempo limite de {tempoLimiteMinutos} minutos foi alcançado.
                            </p>
                            <div className={`${modoEscuro ? 'bg-white/20' : 'bg-gray-800/10'} backdrop-blur-sm rounded-lg p-3 md:p-4 mb-4`}>
                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className={`${modoEscuro ? 'text-white/90' : 'text-gray-700'} text-sm md:text-base ${inter.className}`}>🎯 Partidas Jogadas:</span>
                                        <span className={`font-bold ${modoEscuro ? 'text-white' : 'text-gray-800'} text-base md:text-xl ${cairo.className}`}>
                                            {partidasJogadas}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`${modoEscuro ? 'text-white/90' : 'text-gray-700'} text-sm md:text-base ${inter.className}`}>⏱️ Tempo Total:</span>
                                        <span className={`font-bold ${modoEscuro ? 'text-white' : 'text-gray-800'} text-base md:text-xl ${cairo.className}`}>
                                            {tempoLimiteMinutos} minutos
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`${modoEscuro ? 'text-white/90' : 'text-gray-700'} text-sm md:text-base ${inter.className}`}>👤 Paciente:</span>
                                        <span className={`font-bold ${modoEscuro ? 'text-white' : 'text-gray-800'} text-base md:text-xl ${cairo.className}`}>
                                            {pacienteNome}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={`${modoEscuro ? 'bg-blue-500/20 border-blue-400/50' : 'bg-blue-100 border-blue-300'} border rounded-lg p-3 mb-4`}>
                                <p className={`${modoEscuro ? 'text-white/90' : 'text-gray-800'} text-sm ${inter.className}`}>
                                    📊 <strong>Relatório:</strong> Os dados desta sessão serão salvos automaticamente no prontuário do paciente.
                                </p>
                            </div>
                            <button
                                onClick={abrirModalFinalizar}
                                className={`w-full bg-gradient-to-r from-[#6d9ce3] to-[#4a7bc0] hover:from-[#5a8fd3] hover:to-[#3a6bb0] text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg transition-all duration-300 text-sm md:text-base ${inter.className}`}
                            >
                                ✓ Finalizar e Salvar Relatório
                            </button>
                        </div>
                    ) : !jogoFinalizado ? (
                        // Tabuleiro - Grade 4x4 com tamanho reduzido
                        <div className="grid grid-cols-4 gap-1.5 md:gap-2 lg:gap-3 w-full max-w-xl lg:max-w-2xl mx-auto">
                            {cards.map((card) => (
                                <button
                                    key={card.id}
                                    onClick={() => handleCardClick(card.id)}
                                    disabled={!podeJogar || card.isMatched || card.isFlipped}
                                    className={`
                                        aspect-square rounded-lg md:rounded-xl text-3xl md:text-4xl lg:text-5xl flex items-center justify-center
                                        transition-all duration-300 transform
                                        ${card.isMatched
                                            ? modoEscuro 
                                                ? 'bg-green-900/40 border-2 md:border-4 border-green-500 scale-95 opacity-60'
                                                : 'bg-green-100 border-2 md:border-4 border-green-500 scale-95 opacity-80'
                                            : card.isFlipped
                                                ? modoEscuro
                                                    ? 'bg-white border-2 md:border-4 border-[#6d9ce3] shadow-lg scale-105'
                                                    : 'bg-white border-2 md:border-4 border-[#6d9ce3] shadow-xl scale-105'
                                                : modoEscuro
                                                    ? 'bg-gradient-to-br from-[#6d9ce3] to-[#4a7bc0] hover:scale-105 active:scale-95 cursor-pointer shadow-md'
                                                    : 'bg-gradient-to-br from-blue-400 to-blue-600 hover:scale-105 active:scale-95 cursor-pointer shadow-lg'
                                        }
                                        ${!podeJogar && !card.isFlipped && !card.isMatched ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {card.isFlipped || card.isMatched ? (
                                        <span className="animate-bounce-in">{card.emoji}</span>
                                    ) : (
                                        <span className={`${modoEscuro ? 'text-white' : 'text-white'} text-xl md:text-2xl lg:text-3xl`}>🎴</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        // Tela de conclusão - Compacta
                        <div className="text-center w-full max-w-xl mx-auto">
                            <div className="text-5xl md:text-6xl mb-3 animate-bounce">🎉</div>
                            <h3 className={`text-2xl md:text-4xl font-bold ${modoEscuro ? 'text-white' : 'text-gray-800'} mb-3 ${cairo.className}`}>
                                Parabéns!
                            </h3>
                            <p className={`text-base md:text-xl ${modoEscuro ? 'text-white/90' : 'text-gray-700'} mb-4 ${inter.className}`}>
                                Você completou o jogo!
                            </p>
                            <div className={`${modoEscuro ? 'bg-white/20' : 'bg-gray-800/10'} backdrop-blur-sm rounded-lg p-3 md:p-4 mb-4`}>
                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className={`${modoEscuro ? 'text-white/90' : 'text-gray-700'} text-sm md:text-base ${inter.className}`}>⏱️ Tempo:</span>
                                        <span className={`font-bold ${modoEscuro ? 'text-white' : 'text-gray-800'} text-base md:text-xl ${cairo.className}`}>
                                            {formatarTempo(tempo)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`${modoEscuro ? 'text-white/90' : 'text-gray-700'} text-sm md:text-base ${inter.className}`}>🎯 Tentativas:</span>
                                        <span className={`font-bold ${modoEscuro ? 'text-white' : 'text-gray-800'} text-base md:text-xl ${cairo.className}`}>
                                            {tentativas}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`${modoEscuro ? 'text-white/90' : 'text-gray-700'} text-sm md:text-base ${inter.className}`}>✨ Precisão:</span>
                                        <span className={`font-bold ${modoEscuro ? 'text-white' : 'text-gray-800'} text-base md:text-xl ${cairo.className}`}>
                                            {tentativas > 0 ? Math.round((paresEncontrados / tentativas) * 100) : 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
                                <button
                                    onClick={inicializarJogo}
                                    className={`bg-gradient-to-r from-[#6d9ce3] to-[#4a7bc0] hover:from-[#5a8bd3] hover:to-[#3a6bb0] text-white font-semibold py-2 md:py-3 px-6 md:px-8 rounded-lg transition-all duration-300 text-sm md:text-base ${inter.className}`}
                                >
                                    🔄 Jogar Novamente
                                </button>
                                <button
                                    onClick={abrirModalFinalizar}
                                    className={`${modoEscuro ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-200 hover:bg-gray-300'} backdrop-blur-sm ${modoEscuro ? 'text-white' : 'text-gray-800'} font-semibold py-2 md:py-3 px-6 md:px-8 rounded-lg transition-all duration-300 text-sm md:text-base ${inter.className}`}
                                >
                                    ✓ Finalizar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Confirmação - Fechar */}
            {modalFecharAberto && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className={`text-2xl font-bold text-gray-800 mb-4 ${cairo.className}`}>
                            🔒 Confirmação Necessária
                        </h3>
                        <p className={`text-gray-600 mb-4 ${inter.className}`}>
                            Para fechar o jogo, digite sua senha de acesso:
                        </p>
                        <input
                            type="password"
                            value={senhaDigitada}
                            onChange={(e) => {
                                setSenhaDigitada(e.target.value);
                                setErroSenha('');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !validandoSenha) {
                                    confirmarFechar();
                                }
                            }}
                            placeholder="Digite sua senha"
                            className={`w-full px-4 py-3 border ${erroSenha ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inter.className}`}
                            autoFocus
                            disabled={validandoSenha}
                        />
                        {erroSenha && (
                            <p className={`text-red-500 text-sm mb-4 ${inter.className}`}>
                                {erroSenha}
                            </p>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={fecharModal}
                                className={`flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all ${inter.className}`}
                                disabled={validandoSenha}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarFechar}
                                className={`flex-1 bg-gradient-to-r from-[#6d9ce3] to-[#4a7bc0] hover:from-[#5a8bd3] hover:to-[#3a6bb0] text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${inter.className}`}
                                disabled={validandoSenha}
                            >
                                {validandoSenha ? 'Validando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação - Finalizar e Salvar */}
            {modalFinalizarAberto && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className={`text-2xl font-bold text-gray-800 mb-4 ${cairo.className}`}>
                            🔒 Confirmação Necessária
                        </h3>
                        <p className={`text-gray-600 mb-4 ${inter.className}`}>
                            Para finalizar e salvar o relatório, digite sua senha de acesso:
                        </p>
                        <input
                            type="password"
                            value={senhaDigitada}
                            onChange={(e) => {
                                setSenhaDigitada(e.target.value);
                                setErroSenha('');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !validandoSenha) {
                                    confirmarFinalizar();
                                }
                            }}
                            placeholder="Digite sua senha"
                            className={`w-full px-4 py-3 border ${erroSenha ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inter.className}`}
                            autoFocus
                            disabled={validandoSenha}
                        />
                        {erroSenha && (
                            <p className={`text-red-500 text-sm mb-4 ${inter.className}`}>
                                {erroSenha}
                            </p>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={fecharModal}
                                className={`flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all ${inter.className}`}
                                disabled={validandoSenha}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarFinalizar}
                                className={`flex-1 bg-gradient-to-r from-[#6d9ce3] to-[#4a7bc0] hover:from-[#5a8bd3] hover:to-[#3a6bb0] text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${inter.className}`}
                                disabled={validandoSenha}
                            >
                                {validandoSenha ? 'Validando...' : 'Finalizar e Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
