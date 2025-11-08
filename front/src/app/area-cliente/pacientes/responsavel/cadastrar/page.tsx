'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner"
import { ChangeEvent, useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useClinicaStore } from "@/context/clinica";

type Inputs = {
    nome: string;
    email: string;
    cpf: string;
    telefone1: string;
    telefone2: string | null;
    genero: string;
    estadoCivil: string;
    dataNascimento: string;
    // Endereço
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

function CadastrarResponsavelContent() {

    const { register, handleSubmit } = useForm<Inputs>()
    const { clinica } = useClinicaStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dependenteId = searchParams.get('dependenteId');
    const redirect = searchParams.get('redirect');
    const [isLogged, setIsLogged] = useState(true);

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

    const formatarCEP = (cep: string) => {
        return cep
            .replace(/\D/g, '') // Remove tudo que não é dígito
            .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen entre os 5º e 6º dígitos
            .trim(); // Remove espaços em branco
    };

    const handleNumberInput = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputValue = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito

        let formattedValue;

        // Verifica se é o campo de telefone
        if (e.target.id === 'telefone1' || e.target.id === 'telefone2') {
            formattedValue = formatarTelefone(inputValue); // Formata telefone
        } else if (e.target.id === 'cep') {
            formattedValue = formatarCEP(inputValue); // Formata CEP
        } else {
            formattedValue = formatarCPF(inputValue); // Formata CPF
        }

        e.target.value = formattedValue; // Atualiza o valor do input
    };

    async function efetuaRegistro(data: Inputs) {
        try {
            // Primeiro criar o endereço
            const enderecoResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/enderecos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    logradouro: data.logradouro,
                    numero: data.numero,
                    complemento: data.complemento || null,
                    bairro: data.bairro,
                    cidade: data.cidade,
                    estado: data.estado,
                    cep: data.cep
                })
            });

            if (!enderecoResponse.ok) {
                toast.error("Erro ao cadastrar endereço.", { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
                return;
            }

            const endereco = await enderecoResponse.json();

            // Depois criar o responsável
            const responsavelResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveis`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: data.nome,
                    email: data.email,
                    cpf: data.cpf,
                    telefone1: data.telefone1,
                    telefone2: data.telefone2 == "" ? null : data.telefone2,
                    genero: data.genero,
                    estadoCivil: data.estadoCivil,
                    dataNascimento: data.dataNascimento,
                    enderecoId: endereco.id,
                    clinicaId: clinica.id
                })
            });

            if (responsavelResponse.status === 409) {
                // Erro de duplicação (CPF ou e-mail já existente)
                const errorData = await responsavelResponse.json();
                toast.error(errorData.erro || "Já existe um responsável cadastrado com estes dados.", { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
                return;
            } else if (!responsavelResponse.ok) {
                const errorData = await responsavelResponse.json();
                toast.error(errorData.erro || "Erro ao cadastrar responsável.", { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
                return;
            }

            const responsavel = await responsavelResponse.json();

            // Criar a relação responsável-clínica
            const responsavelClinicaResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveisClinicas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clinicaId: clinica.id,
                    responsavelId: responsavel.id
                })
            });

            if (responsavelClinicaResponse.ok) {
                // Se veio da página de responsáveis, fazer o vínculo automático
                if (dependenteId && redirect === 'responsaveis') {
                    try {
                        const vinculoResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/responsaveisDependentes`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                responsavelId: responsavel.id,
                                dependenteId: dependenteId
                            })
                        });

                        if (vinculoResponse.status === 201) {
                            toast.success("Responsável cadastrado e vinculado ao paciente com sucesso.", { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
                            setTimeout(() => {
                                router.push(`/area-cliente/pacientes/responsavel/${dependenteId}`);
                            }, 2000);
                        } else if (vinculoResponse.status === 409) {
                            // Erro de duplicação (responsável já vinculado)
                            const errorData = await vinculoResponse.json();
                            toast.error(`Responsável cadastrado, mas ${errorData.erro || "já está vinculado ao paciente"}.`, { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
                            setTimeout(() => {
                                router.push(`/area-cliente/pacientes/responsavel/${dependenteId}`);
                            }, 2000);
                        } else {
                            const errorData = await vinculoResponse.json();
                            toast.error(`Responsável cadastrado, mas erro ao vincular: ${errorData.erro || "Erro desconhecido"}.`, { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
                            setTimeout(() => {
                                router.push(`/area-cliente/pacientes/responsavel/vincular?dependenteId=${dependenteId}`);
                            }, 2000);
                        }
                    } catch {
                        toast.error("Responsável cadastrado, mas erro ao vincular ao paciente.", { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
                        setTimeout(() => {
                            router.push(`/area-cliente/pacientes/responsavel/vincular?dependenteId=${dependenteId}`);
                        }, 2000);
                    }
                } else {
                    // Fluxo normal - redirecionar para cadastro do paciente
                    toast.success("Cadastro de Responsável realizado com sucesso.", { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
                    setTimeout(() => {
                        sessionStorage.setItem('responsavelSelecionado', responsavel.id);
                        router.push("/area-cliente/pacientes/cadastrar/dados");
                    }, 2000);
                }
            } else {
                toast.error("Erro ao vincular responsável à clínica.", { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
            }
        } catch {
            toast.error("Erro ao cadastrar responsável.", { duration: Number(process.env.NEXT_PUBLIC_TOAST_DURATION) });
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
                                Cadastro de Responsável
                            </h1>
                        </div>
                        <div className="flex justify-center items-center mt-10">
                            <h1 className={`text-4xl text-[#6D9CE3] font-semibold ${inter.className}`}>
                                Dados do Responsável
                            </h1>
                        </div>
                        <div className="flex justify-center items-center mt-20">
                            <form className="grid grid-cols-10 gap-4 w-full max-w-4xl" onSubmit={handleSubmit(efetuaRegistro)}>
                                
                                {/* Nome Completo */}
                                <div className="flex flex-col col-span-10">
                                    <label htmlFor="nome" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="nome"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Digite o nome completo"
                                        {...register("nome")}
                                        required
                                    />
                                </div>

                                {/* E-mail */}
                                <div className="flex flex-col col-span-10">
                                    <label htmlFor="email" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Digite o e-mail"
                                        required
                                        {...register("email")}
                                    />
                                </div>

                                {/* CPF */}
                                <div className="flex flex-col col-span-5">
                                    <label htmlFor="cpf" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        id="cpf"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Digite o CPF"
                                        onInput={handleNumberInput}
                                        {...register("cpf")}
                                        maxLength={14}
                                        required
                                    />
                                </div>

                                {/* Data de Nascimento */}
                                <div className="flex flex-col col-span-5">
                                    <label htmlFor="dataNascimento" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Data de Nascimento
                                    </label>
                                    <input
                                        type="date"
                                        id="dataNascimento"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        {...register("dataNascimento")}
                                        required
                                    />
                                </div>

                                {/* Telefone 1 e Telefone 2 */}
                                <div className="flex flex-col col-span-5">
                                    <label htmlFor="telefone1" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Telefone 1
                                    </label>
                                    <input
                                        type="text"
                                        id="telefone1"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Digite o telefone 1"
                                        required
                                        maxLength={15}
                                        onInput={handleNumberInput}
                                        {...register("telefone1")}
                                    />
                                </div>
                                <div className="flex flex-col col-span-5">
                                    <label htmlFor="telefone2" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Telefone 2
                                    </label>
                                    <input
                                        type="text"
                                        id="telefone2"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Digite o telefone 2"
                                        onInput={handleNumberInput}
                                        maxLength={15}
                                        {...register("telefone2")}
                                    />
                                </div>

                                {/* Gênero e Estado Civil */}
                                <div className="flex flex-col col-span-5">
                                    <label htmlFor="genero" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Gênero
                                    </label>
                                    <select
                                        id="genero"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        {...register("genero")}
                                        required
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>
                                <div className="flex flex-col col-span-5">
                                    <label htmlFor="estadoCivil" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Estado Civil
                                    </label>
                                    <select
                                        id="estadoCivil"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        {...register("estadoCivil")}
                                        required
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Solteiro">Solteiro</option>
                                        <option value="Casado">Casado</option>
                                        <option value="Divorciado">Divorciado</option>
                                        <option value="Viúvo">Viúvo</option>
                                        <option value="União Estável">União Estável</option>
                                    </select>
                                </div>

                                {/* Título do Endereço */}
                                <div className="col-span-10 mt-6">
                                    <h2 className={`text-2xl text-[#6D9CE3] font-semibold ${inter.className}`}>
                                        Endereço
                                    </h2>
                                </div>

                                {/* Logradouro */}
                                <div className="flex flex-col col-span-8">
                                    <label htmlFor="logradouro" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Logradouro
                                    </label>
                                    <input
                                        type="text"
                                        id="logradouro"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Digite o logradouro"
                                        {...register("logradouro")}
                                        required
                                    />
                                </div>

                                {/* Número */}
                                <div className="flex flex-col col-span-2">
                                    <label htmlFor="numero" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Número
                                    </label>
                                    <input
                                        type="text"
                                        id="numero"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Nº"
                                        {...register("numero")}
                                        required
                                    />
                                </div>

                                {/* Complemento */}
                                <div className="flex flex-col col-span-5">
                                    <label htmlFor="complemento" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Complemento
                                    </label>
                                    <input
                                        type="text"
                                        id="complemento"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Digite o complemento"
                                        {...register("complemento")}
                                    />
                                </div>

                                {/* Bairro */}
                                <div className="flex flex-col col-span-5">
                                    <label htmlFor="bairro" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Bairro
                                    </label>
                                    <input
                                        type="text"
                                        id="bairro"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Digite o bairro"
                                        {...register("bairro")}
                                        required
                                    />
                                </div>

                                {/* Cidade */}
                                <div className="flex flex-col col-span-4">
                                    <label htmlFor="cidade" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Cidade
                                    </label>
                                    <input
                                        type="text"
                                        id="cidade"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Digite a cidade"
                                        {...register("cidade")}
                                        required
                                    />
                                </div>

                                {/* Estado */}
                                <div className="flex flex-col col-span-3">
                                    <label htmlFor="estado" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        Estado
                                    </label>
                                    <select
                                        id="estado"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        {...register("estado")}
                                        required
                                    >
                                        <option value="">UF</option>
                                        <option value="AC">AC</option>
                                        <option value="AL">AL</option>
                                        <option value="AP">AP</option>
                                        <option value="AM">AM</option>
                                        <option value="BA">BA</option>
                                        <option value="CE">CE</option>
                                        <option value="DF">DF</option>
                                        <option value="ES">ES</option>
                                        <option value="GO">GO</option>
                                        <option value="MA">MA</option>
                                        <option value="MT">MT</option>
                                        <option value="MS">MS</option>
                                        <option value="MG">MG</option>
                                        <option value="PA">PA</option>
                                        <option value="PB">PB</option>
                                        <option value="PR">PR</option>
                                        <option value="PE">PE</option>
                                        <option value="PI">PI</option>
                                        <option value="RJ">RJ</option>
                                        <option value="RN">RN</option>
                                        <option value="RS">RS</option>
                                        <option value="RO">RO</option>
                                        <option value="RR">RR</option>
                                        <option value="SC">SC</option>
                                        <option value="SP">SP</option>
                                        <option value="SE">SE</option>
                                        <option value="TO">TO</option>
                                    </select>
                                </div>

                                {/* CEP */}
                                <div className="flex flex-col col-span-3">
                                    <label htmlFor="cep" className={`text-sm font-semibold text-gray-700 ${inter.className}`}>
                                        CEP
                                    </label>
                                    <input
                                        type="text"
                                        id="cep"
                                        className={`mt-1 p-2 border border-gray-300 rounded-md ${inter.className}`}
                                        placeholder="Digite o CEP"
                                        onInput={handleNumberInput}
                                        maxLength={9}
                                        {...register("cep")}
                                        required
                                    />
                                </div>

                                {/* Botão de Enviar */}
                                <div className="col-span-10 flex justify-end mt-6">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Cadastrar Responsável
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default function CadastrarResponsavel() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <CadastrarResponsavelContent />
        </Suspense>
    );
}
