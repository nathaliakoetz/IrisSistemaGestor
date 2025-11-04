'use client'

import { useState } from 'react';

export default function Diagnostico() {
    const [resultado, setResultado] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testarConexao = async () => {
        setLoading(true);
        setResultado('Testando...\n');
        
        try {
            // 1. Verificar variável de ambiente
            const apiUrl = process.env.NEXT_PUBLIC_URL_API;
            setResultado(prev => prev + `✅ URL da API: ${apiUrl}\n\n`);

            // 2. Testar conexão simples
            setResultado(prev => prev + '🔄 Testando conexão...\n');
            const response = await fetch(`${apiUrl}/clinicas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setResultado(prev => prev + `📊 Status: ${response.status}\n`);
            setResultado(prev => prev + `📝 StatusText: ${response.statusText}\n\n`);

            // 3. Tentar ler resposta
            const text = await response.text();
            setResultado(prev => prev + `📄 Resposta (primeiros 500 chars):\n${text.substring(0, 500)}\n\n`);

            // 4. Testar CORS
            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });
            setResultado(prev => prev + `🔐 Headers CORS:\n${JSON.stringify(headers, null, 2)}\n\n`);

            // 5. Testar POST (sem cadastrar de verdade)
            setResultado(prev => prev + '🔄 Testando POST...\n');
            const postResponse = await fetch(`${apiUrl}/clinicas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: 'TESTE',
                    email: 'teste@teste.com',
                    senha: 'teste123',
                    cpfCnpj: '12345678901234',
                    telefone1: '11999999999',
                    telefone2: null
                })
            });

            setResultado(prev => prev + `📊 POST Status: ${postResponse.status}\n`);
            const postText = await postResponse.text();
            setResultado(prev => prev + `📄 POST Resposta:\n${postText}\n\n`);

            setResultado(prev => prev + '✅ Diagnóstico completo!');

        } catch (error) {
            setResultado(prev => prev + `❌ ERRO: ${error instanceof Error ? error.message : 'Erro desconhecido'}\n`);
            setResultado(prev => prev + `Stack: ${error instanceof Error ? error.stack : 'N/A'}\n`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>🔍 Diagnóstico de Conexão com Backend</h1>
            
            <button 
                onClick={testarConexao}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: loading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '20px'
                }}
            >
                {loading ? 'Testando...' : 'Testar Conexão'}
            </button>

            <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '5px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                minHeight: '200px',
                border: '1px solid #ddd'
            }}>
                {resultado || 'Clique no botão para iniciar o diagnóstico...'}
            </pre>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                <h3>📋 Checklist:</h3>
                <ul>
                    <li>✅ Backend está rodando no Render?</li>
                    <li>✅ Variável NEXT_PUBLIC_URL_API está configurada no Vercel?</li>
                    <li>✅ Backend aceita CORS do domínio do Vercel?</li>
                    <li>✅ Banco de dados PostgreSQL está conectado?</li>
                </ul>
            </div>
        </div>
    );
}
