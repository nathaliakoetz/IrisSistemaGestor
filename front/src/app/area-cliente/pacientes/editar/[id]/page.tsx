'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner"
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useClinicaStore } from "@/context/clinica";

type Inputs = {
    nome: string;
    cpf: string;
    genero: string;
    dataNascimento: string;
}

export default function EditarPaciente() {
    const { register, handleSubmit, setValue } = useForm<Inputs>();
    const { clinica } = useClinicaStore();
    const router = useRouter();
    const params = useParams();
    const pacienteId = params.id as string;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dependentes`);
                if (response.ok) {
                    const dependentes = await response.json();
                    const paciente = dependentes.find((dep: any) => dep.id === pacienteId);
                    
                    if (paciente) {
                        setValue('nome', paciente.nome);
                        setValue('cpf', paciente.cpf);
                        setValue('genero', paciente.genero);
                        setValue('dataNascimento', paciente.dataNascimento);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados do paciente:', error);
                toast.error('Erro ao carregar dados do paciente');
            } finally {
                setLoading(false);
            }
        };

        if (pacienteId) {
            fetchPaciente();
        }
    }, [pacienteId, setValue]);

    const formatarCPF = (cpf: string) => {
        return cpf
            .replace(/\D/g, '') // Remove tudo que não é dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre os primeiros 3 dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre os próximos 3 dígitos
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Coloca hífen entre os 9º e 10º dígitos
            .trim(); // Remove espaços em branco
    };

    const handleNumberInput = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputValue = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        const formattedValue = formatarCPF(inputValue); // Formata CPF
        e.target.value = formattedValue; // Atualiza o valor do input
    };

    async function efetuaEdicao(data: Inputs) {
        try {
            // Note: Esta é uma implementação básica pois não existe rota PUT no backend
            toast.info("Funcionalidade de edição não implementada no backend ainda.");
            
            // Aqui você implementaria a lógica de atualização quando houver endpoint PUT
            // const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dependentes/${pacienteId}`, {
            //     method: "PUT",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(data)
            // });

            setTimeout(() => {
                router.push("/area-cliente/pacientes");
            }, 2000);
        } catch (error) {
            toast.error("Erro ao editar Paciente.");
        }
    }

    if (!sessionStorage.getItem("logged")) {
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
    }

    if (loading) {
        return (
            <div className="flex">
                <SideBar activeLink="pacientes" />
                <div className="flex flex-col flex-1">
                    <TopBar />
                    <div className="flex-1 p-4 bg-[#f2f2f2] flex justify-center items-center">
                        <p className={`text-xl text-gray-600 ${inter.className}`}>
                            Carregando dados do paciente...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

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
                            Editar Paciente
                        </h1>
                    </div>
                    <div className="flex justify-center items-center mt-10">
                        <h1 className={`text-4xl text-[#6D9CE3] font-semibold ${inter.className}`}>
                            Dados do Paciente
                        </h1>
                    </div>
                    <div className="flex justify-center items-center mt-20">
                        <form className="grid grid-cols-10 gap-4 w-full max-w-3xl" onSubmit={handleSubmit(efetuaEdicao)}>
                            
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

                            {/* Gênero */}
                            <div className="flex flex-col col-span-10">
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

                            {/* Botões */}
                            <div className="col-span-10 flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={() => router.push("/area-cliente/pacientes")}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
