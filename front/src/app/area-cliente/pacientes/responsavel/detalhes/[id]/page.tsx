'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import { ResponsavelI } from "@/utils/types/responsaveis";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "sonner";

export default function DetalhesResponsavel() {
    const router = useRouter();
    const params = useParams();
    const responsavelId = params.id as string;
    
    const [responsavel, setResponsavel] = useState<ResponsavelI | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<ResponsavelI | null>(null);
    const [saving, setSaving] = useState(false);

    // Funções de formatação
    const formatarCPF = (cpf: string) => {
        return cpf
            .replace(/\D/g, '') // Remove tudo que não é dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre os primeiros 3 dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre os próximos 3 dígitos
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Coloca hífen entre os 9º e 10º dígitos
            .trim(); // Remove espaços em branco
    };

    const formatarTelefone = (telefone: string) => {
        return telefone
            .replace(/\D/g, '') // Remove tudo que não é dígito
            .replace(/^(\d{2})(\d)/, '($1) $2') // Coloca parênteses e espaço
            .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen entre os 5º e 6º dígitos
            .trim(); // Remove espaços em branco
    };

    const handleNumberInput = (e: ChangeEvent<HTMLInputElement>, field: string): void => {
        const inputValue = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito

        let formattedValue;

        // Verifica se é o campo de telefone
        if (field === 'telefone1' || field === 'telefone2') {
            formattedValue = formatarTelefone(inputValue); // Formata telefone
        } else if (field === 'cpf') {
            formattedValue = formatarCPF(inputValue); // Formata CPF
        } else {
            formattedValue = inputValue;
        }

        // Atualiza o valor no estado
        handleInputChange(field, formattedValue);
    };

    // Função para buscar os dados do responsável
    const fetchResponsavel = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Buscar os dados completos do responsável
            const responsavelResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveis/${responsavelId}`);
            
            if (!responsavelResponse.ok) {
                throw new Error('Erro ao buscar dados do responsável');
            }
            
            const responsavelData = await responsavelResponse.json();
            setResponsavel(responsavelData);
            setEditForm(responsavelData);
            
        } catch (error) {
            console.error('Erro ao buscar responsável:', error);
            setError(error instanceof Error ? error.message : 'Erro ao carregar os dados do responsável');
        } finally {
            setLoading(false);
        }
    };

    // Função para salvar as alterações
    const handleSave = async () => {
        if (!editForm) return;
        
        try {
            setSaving(true);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveis/${responsavel?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm),
            });
            
            if (!response.ok) {
                throw new Error('Erro ao salvar alterações');
            }
            
            const updatedResponsavel = await response.json();
            setResponsavel(updatedResponsavel);
            setIsEditing(false);
            toast.success('Dados salvos com sucesso!');
            
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao salvar alterações. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    // Função para cancelar a edição
    const handleCancel = () => {
        setEditForm(responsavel);
        setIsEditing(false);
    };

    // Função para atualizar o formulário
    const handleInputChange = (field: string, value: string) => {
        if (!editForm) return;
        
        if (field.startsWith('endereco.')) {
            const enderecoField = field.split('.')[1];
            setEditForm({
                ...editForm,
                endereco: {
                    ...editForm.endereco!,
                    [enderecoField]: value,
                },
            });
        } else {
            setEditForm({
                ...editForm,
                [field]: value,
            });
        }
    };

    useEffect(() => {
        if (responsavelId) {
            fetchResponsavel();
        }
    }, [responsavelId]);

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
                                <img src="./../../../../../../logo.png" alt="Icone do Sistema Íris" className="w-32" />
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
                                Dados do Responsável
                            </h1>
                        </div>
                        <div className="flex justify-center gap-3 items-center mt-5 mb-5 me-10">
                            <button
                                onClick={() => router.back()}
                                className={`flex justify-center w-[150px] border-2 font-semibold items-center bg-gray-500 p-3 text-white text-sm rounded-lg ${inter.className}`}
                            >
                                Voltar
                            </button>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={`flex justify-center w-[150px] border-2 font-semibold items-center bg-[#6D9CE3] p-3 text-white text-sm rounded-lg ${inter.className}`}
                                >
                                    Editar
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className={`flex justify-center w-[150px] border-2 font-semibold items-center bg-red-500 p-3 text-white text-sm rounded-lg ${inter.className}`}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className={`flex justify-center w-[150px] border-2 font-semibold items-center bg-green-500 p-3 text-white text-sm rounded-lg ${inter.className} disabled:opacity-50`}
                                    >
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center mt-10">
                            <p className={`text-xl text-gray-600 ${inter.className}`}>
                                Carregando dados do responsável...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-center items-center mt-10">
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
                                <p className={`text-lg ${inter.className}`}>
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {!loading && !error && responsavel && (
                        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nome */}
                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                        Nome Completo
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm?.nome || ''}
                                            onChange={(e) => handleInputChange('nome', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                            {responsavel.nome}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                        E-mail
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editForm?.email || ''}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                            {responsavel.email}
                                        </p>
                                    )}
                                </div>

                                {/* CPF */}
                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                        CPF
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm?.cpf || ''}
                                            onChange={(e) => handleNumberInput(e, 'cpf')}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            maxLength={14}
                                            placeholder="000.000.000-00"
                                        />
                                    ) : (
                                        <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                            {responsavel.cpf}
                                        </p>
                                    )}
                                </div>

                                {/* Gênero */}
                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                        Gênero
                                    </label>
                                    {isEditing ? (
                                        <select
                                            value={editForm?.genero || ''}
                                            onChange={(e) => handleInputChange('genero', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Selecione</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    ) : (
                                        <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                            {responsavel.genero}
                                        </p>
                                    )}
                                </div>

                                {/* Telefone 1 */}
                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                        Telefone Principal
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm?.telefone1 || ''}
                                            onChange={(e) => handleNumberInput(e, 'telefone1')}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            maxLength={15}
                                            placeholder="(00) 00000-0000"
                                        />
                                    ) : (
                                        <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                            {responsavel.telefone1 || 'Não informado'}
                                        </p>
                                    )}
                                </div>

                                {/* Telefone 2 */}
                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                        Telefone Secundário
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm?.telefone2 || ''}
                                            onChange={(e) => handleNumberInput(e, 'telefone2')}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            maxLength={15}
                                            placeholder="(00) 00000-0000"
                                        />
                                    ) : (
                                        <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                            {responsavel.telefone2 || 'Não informado'}
                                        </p>
                                    )}
                                </div>

                                {/* Estado Civil */}
                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                        Estado Civil
                                    </label>
                                    {isEditing ? (
                                        <select
                                            value={editForm?.estadoCivil || ''}
                                            onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Selecione</option>
                                            <option value="Solteiro(a)">Solteiro(a)</option>
                                            <option value="Casado(a)">Casado(a)</option>
                                            <option value="Divorciado(a)">Divorciado(a)</option>
                                            <option value="Viúvo(a)">Viúvo(a)</option>
                                            <option value="União Estável">União Estável</option>
                                        </select>
                                    ) : (
                                        <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                            {responsavel.estadoCivil || 'Não informado'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Endereço */}
                            {responsavel.endereco && (
                                <div className="mt-8">
                                    <h3 className={`text-xl font-semibold text-gray-800 mb-4 ${inter.className}`}>
                                        Endereço
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* CEP */}
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                                CEP
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm?.endereco?.cep || ''}
                                                    onChange={(e) => handleInputChange('endereco.cep', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                                    {responsavel.endereco.cep || 'Não informado'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Logradouro */}
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                                Logradouro
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm?.endereco?.logradouro || ''}
                                                    onChange={(e) => handleInputChange('endereco.logradouro', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                                    {responsavel.endereco.logradouro || 'Não informado'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Número */}
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                                Número
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm?.endereco?.numero || ''}
                                                    onChange={(e) => handleInputChange('endereco.numero', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                                    {responsavel.endereco.numero || 'Não informado'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Bairro */}
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                                Bairro
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm?.endereco?.bairro || ''}
                                                    onChange={(e) => handleInputChange('endereco.bairro', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                                    {responsavel.endereco.bairro || 'Não informado'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Cidade */}
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                                Cidade
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm?.endereco?.cidade || ''}
                                                    onChange={(e) => handleInputChange('endereco.cidade', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                                    {responsavel.endereco.cidade || 'Não informado'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Estado */}
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-700 mb-2 ${inter.className}`}>
                                                Estado
                                            </label>
                                            {isEditing ? (
                                                <select
                                                    value={editForm?.endereco?.estado || ''}
                                                    onChange={(e) => handleInputChange('endereco.estado', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Selecione</option>
                                                    <option value="Acre">Acre</option>
                                                    <option value="Alagoas">Alagoas</option>
                                                    <option value="Amapá">Amapá</option>
                                                    <option value="Amazonas">Amazonas</option>
                                                    <option value="Bahia">Bahia</option>
                                                    <option value="Ceará">Ceará</option>
                                                    <option value="Distrito Federal">Distrito Federal</option>
                                                    <option value="Espírito Santo">Espírito Santo</option>
                                                    <option value="Goiás">Goiás</option>
                                                    <option value="Maranhão">Maranhão</option>
                                                    <option value="Mato Grosso">Mato Grosso</option>
                                                    <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
                                                    <option value="Minas Gerais">Minas Gerais</option>
                                                    <option value="Pará">Pará</option>
                                                    <option value="Paraíba">Paraíba</option>
                                                    <option value="Paraná">Paraná</option>
                                                    <option value="Pernambuco">Pernambuco</option>
                                                    <option value="Piauí">Piauí</option>
                                                    <option value="Rio de Janeiro">Rio de Janeiro</option>
                                                    <option value="Rio Grande do Norte">Rio Grande do Norte</option>
                                                    <option value="Rio Grande do Sul">Rio Grande do Sul</option>
                                                    <option value="Rondônia">Rondônia</option>
                                                    <option value="Roraima">Roraima</option>
                                                    <option value="Santa Catarina">Santa Catarina</option>
                                                    <option value="São Paulo">São Paulo</option>
                                                    <option value="Sergipe">Sergipe</option>
                                                    <option value="Tocantins">Tocantins</option>
                                                </select>
                                            ) : (
                                                <p className={`p-3 bg-gray-50 rounded-lg ${inter.className}`}>
                                                    {responsavel.endereco.estado || 'Não informado'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
