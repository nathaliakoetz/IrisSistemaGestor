'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";
import { toast } from "sonner"
import { ChangeEvent } from "react";
import { pause } from "@/utils/functions/pause";
import { useRouter } from "next/navigation";

type Inputs = {
    nome: string;
    razaoSocial: string;
    cpfCnpj: string;
    email: string;
    telefone1: string;
    telefone2: string | null;
    senha: string;
    confirmaSenha: string;
}

export default function SignUp() {

    const { register, handleSubmit } = useForm<Inputs>()
    const [tipoUsuario, setTipoUsuario] = useState("clinica");
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const router = useRouter();

    const formatarCPF = (cpf: string) => {
        return cpf
            .replace(/\D/g, '') // Remove tudo que não é dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre os primeiros 3 dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre os próximos 3 dígitos
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Coloca hífen entre os 9º e 10º dígitos
            .trim(); // Remove espaços em branco
    };

    const formatarCNPJ = (cnpj: string) => {
        return cnpj
            .replace(/\D/g, '') // Remove tudo que não é dígito
            .replace(/^(\d{2})(\d)/, '$1.$2') // Coloca ponto entre os primeiros 2 dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre os próximos 3 dígitos
            .replace(/(\d{3})(\d)/, '$1/$2') // Coloca barra entre os 8º e 9º dígitos
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2') // Coloca hífen entre o 13º e 14º dígitos
            .trim(); // Remove espaços em branco
    };

    const formatarTelefone = (telefone: string) => {
        return telefone
            .replace(/\D/g, '') // Remove tudo que não é dígito
            .replace(/^(\d{2})(\d)/, '($1) $2') // Coloca parênteses e espaço
            .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen entre os 5º e 6º dígitos
            .trim(); // Remove espaços em branco
    };

    function validaSenha(senha: string, senha2: string) {

        if (senha.length < 8) {
            toast.error("Erro... senha deve possuir, no mínimo, 8 caracteres")
            return false
        }

        let pequenas = 0
        let grandes = 0
        let numeros = 0
        let simbolos = 0

        for (const letra of senha) {
            if ((/[a-z]/).test(letra)) {
                pequenas++
            }
            else if ((/[A-Z]/).test(letra)) {
                grandes++
            }
            else if ((/[0-9]/).test(letra)) {
                numeros++
            } else {
                simbolos++
            }
        }

        if (pequenas == 0 || grandes == 0 || numeros == 0 || simbolos == 0) {
            toast.error("Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos")
            return false
        }

        if (senha !== senha2) {
            toast.error("Erro... as senhas não conferem")
            return false
        }

        return true
    }

    async function efetuaRegistro(data: Inputs) {
        if (!isChecked) {
            toast.error("Você precisa concordar com os Termos, Política de Privacidade e Política de Cookies para continuar.");
        } else if (tipoUsuario === 'profissional') {
            toast.info("Cadastro de Profissional em desenvolvimento.");
        } else if (validaSenha(data.senha, data.confirmaSenha)) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clinicas`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            nome: data.nome,
                            email: data.email,
                            senha: data.senha,
                            cpfCnpj: data.cpfCnpj,
                            telefone1: data.telefone1,
                            telefone2: data.telefone2 == "" ? null : data.telefone2
                        })
                    });

                    if (response.status === 201) {
                        toast.success("Cadastro de Clínica realizado com sucesso.");
                        await pause(2)
                        router.push("/signin/iris/clinica");
                    } else {
                        // Mostrar detalhes do erro
                        const errorData = await response.json().catch(() => ({}));
                        console.error('Erro no cadastro:', response.status, errorData);
                        toast.error(`Erro ao cadastrar clínica: ${errorData.message || response.statusText || 'Erro desconhecido'}`);
                    }
                } catch (error) {
                    console.error('Erro na requisição:', error);
                    toast.error(`Erro ao conectar com servidor: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
                }
        }
    }

    const handleNumberInput = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputValue = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito

        let formattedValue;
        if (tipoUsuario === 'profissional') {
            formattedValue = formatarCPF(inputValue); // Formata CPF
        } else {
            formattedValue = formatarCNPJ(inputValue); // Formata CNPJ
        }

        // Verifica se é o campo de telefone
        if (e.target.id === 'telefone1' || e.target.id === 'telefone2') {
            formattedValue = formatarTelefone(inputValue); // Formata telefone
        }

        e.target.value = formattedValue; // Atualiza o valor do input
    };

    return (
        <section className="bg-[url('/bg_login.jpeg')] bg-cover bg-no-repeat flex justify-center items-center h-[1080px]">
            <div className="flex justify-center items-center mt-32 mb-32">
                <div className="max-w-lg border border-gray-400 bg-white rounded-3xl shadow flex flex-col items-center h-auto overflow-hidden">
                    <div className="flex flex-row w-card-login items-center justify-center mt-14">
                        <Link href="/" className="flex">
                            <img src="./logo.png" alt="Icone do Sistema Íris" className="w-32" />
                            <h1 className={`text-7xl ms-1 text-color-logo ${cairo.className}`}>
                                ÍRIS
                            </h1>
                        </Link>
                    </div>
                    <form className="max-w-lg mx-auto mt-10" onSubmit={handleSubmit(efetuaRegistro)}>
                        <div className="mb-5">
                            <input
                                type="text"
                                id={tipoUsuario === "profissional" ? "nome" : "razaoSocial"}
                                className={`bg-form border-user text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-full p-2.5 ${inter.className}`}
                                placeholder={tipoUsuario === "profissional" ? "Nome Completo" : "Razão Social"}
                                required
                                {...register("nome")}
                            />
                        </div>
                        <div className="flex justify-start gap-3 mb-5 w-80">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="tipoUsuario"
                                    value="clinica"
                                    className="mr-2"
                                    defaultChecked
                                    onChange={() => setTipoUsuario("clinica")}
                                    required
                                />
                                Clínica
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="tipoUsuario"
                                    value="profissional"
                                    className="mr-2"
                                    onChange={() => setTipoUsuario("profissional")}
                                    required
                                />
                                Profissional
                            </label>
                        </div>
                        <div className="mb-5">
                            <input
                                type="text"
                                id={tipoUsuario === "profissional" ? "cpf" : "cnpj"}
                                className={`bg-form border-user border-gray-700 text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-full p-2.5 ${inter.className}`}
                                placeholder={tipoUsuario === "profissional" ? "CPF" : "CNPJ"}
                                required
                                onInput={handleNumberInput}
                                maxLength={tipoUsuario === "profissional" ? 14 : 18}
                                {...register("cpfCnpj")}
                            />
                        </div>
                        <div className="mb-5">
                            <input
                                type="email"
                                id="email"
                                className={`bg-form border-user border-gray-700 text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-full p-2.5 ${inter.className}`}
                                placeholder="E-mail"
                                required
                                {...register("email")}
                            />
                        </div>
                        <div className="mb-5">
                            <input
                                type="tel"
                                id="telefone1"
                                className={`bg-form border-user border-gray-700 text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-full p-2.5 ${inter.className}`}
                                placeholder="Telefone 1"
                                required
                                onInput={handleNumberInput}
                                maxLength={15}
                                {...register("telefone1")}
                            />
                        </div>
                        <div className="mb-5">
                            <input
                                type="tel"
                                id="telefone2"
                                className={`bg-form border-user border-gray-700 text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-full p-2.5 ${inter.className}`}
                                placeholder="Telefone 2"
                                onInput={handleNumberInput}
                                maxLength={15}
                                {...register("telefone2")}
                            />
                        </div>
                        <div className="mb-5">
                            <input
                                type="password"
                                id="senha"
                                className={`bg-form border-user border-gray-700 text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-full p-2.5 ${inter.className}`}
                                placeholder="Senha"
                                required
                                {...register("senha")}
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="password"
                                id="confirmaSenha"
                                className={`bg-form border-user border-gray-700 text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-full p-2.5 ${inter.className}`}
                                placeholder="Confirme a Senha"
                                required
                                {...register("confirmaSenha")}
                            />
                        </div>
                        <div className="flex items-center mb-8">
                            <input
                                id="link-checkbox"
                                type="checkbox"
                                value="agreement"
                                className="w-4 h-4 rounded"
                                onChange={() => setIsChecked(!isChecked)}
                            />
                            <label htmlFor="link-checkbox" className={`ms-2 text-sm text-color-logo ${inter.className}`}>Você concorda com nossos&nbsp;
                                <Link href="#" className="text-color-logo font-bold hover:underline">
                                    Termos
                                </Link>,&nbsp;
                                <Link href="#" className="text-color-logo font-bold hover:underline">
                                    Política<br />de Privacidade
                                </Link>&nbsp;e&nbsp;
                                <Link href="#" className="text-color-logo font-bold hover:underline">
                                    Política de Cookies
                                </Link>.
                            </label>
                        </div>
                        <button type="submit" className={`text-white font-bold bg-footer-email rounded-2xl text-sm w-full min-h-10 text-center ${inter.className}`}>
                            Enviar
                        </button>
                    </form>
                    <p className={`text-sm text-color-logo mt-3 mb-14 ${inter.className}`}>
                        Já tem cadastro?&nbsp;
                        <Link href="/signin">
                            <span className="font-bold text-color-logo hover:underline">
                                Entre
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </section >
    )
}