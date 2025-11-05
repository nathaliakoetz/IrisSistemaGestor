'use client'

import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react"
import { toast } from 'sonner'
import Cookies from "js-cookie";

import { useTerapeutaStore } from "@/context/terapeuta";

type Inputs = {
    email: string
    senha: string
}

export default function SignIn() {
    const { register, handleSubmit, setFocus } = useForm<Inputs>()
    const router = useRouter();
    const { logaTerapeuta } = useTerapeutaStore()
    const [rememberMe, setRememberMe] = useState<boolean>(false)

    useEffect(() => {
        setFocus("email")
    }, [])

    async function verificaLogin(data: Inputs) {

        toast.info("Verificando informações... Aguarde.")

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/terapeutas/login`, {
            method: "POST",
            headers: { "Content-type": "Application/json" },
            body: JSON.stringify({ email: data.email, senha: data.senha })
        })

        if (response.status == 200) {
            const { token, ...terapeuta } = await response.json()
            logaTerapeuta(terapeuta)
            sessionStorage.setItem("logged", "true")
            
            // Armazenar o token
            if (token) {
                sessionStorage.setItem("authToken", token)
            }

            if (rememberMe) {
                Cookies.set("authID", terapeuta.id)
                if (token) {
                    Cookies.set("authToken", token)
                }
            }

            toast.success("Login realizado com sucesso!");
            router.push("/signin/carregando-medico")
        } else if (response.status == 400) {
            toast.error("Erro... Login ou senha incorretos")
        }
    }

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
                    <form className="max-w-lg mx-auto mt-10" onSubmit={handleSubmit(verificaLogin)}>
                        <div className="mb-5">
                            <input
                                type="email"
                                id="email"
                                className={`bg-form border-user text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-80 p-2.5 ${inter.className}`}
                                placeholder="E-mail"
                                {...register("email")}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="password"
                                id="password"
                                className={`bg-form border-user border-gray-700 text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-full p-2.5 ${inter.className}`}
                                placeholder="Senha"
                                {...register("senha")}
                                required
                            />
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    className="mr-2"
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="rememberMe" className={`text-sm text-color-logo ${inter.className}`}>
                                    Lembrar de mim
                                </label>
                            </div>
                            <Link href="/" className="hover:underline">
                                <p className={`text-sm text-color-logo ${inter.className}`}>
                                    Esqueceu a senha?
                                </p>
                            </Link>
                        </div>
                        <button type="submit" className={`text-white font-bold bg-footer-email rounded-2xl text-sm w-full min-h-10 text-center ${inter.className}`}>
                            Entrar
                        </button>
                        <div className="flex justify-center items-center">
                            <img src="/line.png" alt="linha" className="w-24" />
                            <p className={`text-center mt-3 mb-3 ${inter.className}`}>&nbsp;&nbsp;&nbsp;ou&nbsp;&nbsp;&nbsp;</p>
                            <img src="/line.png" alt="linha" className="w-24" />
                        </div>
                        <Link href="#">
                            <button type="button" className={`text-black border border-gray-400 min-h-10 mb-5 bg-form rounded-2xl px-3 text-sm w-full text-center flex justify-center items-center ${inter.className}`}>
                                <img src="/icon_google.png" alt="Logar com Google" className="h-5 me-3" />
                                Continuar com Google
                            </button>
                        </Link>
                    </form>
                    <p className={`text-sm text-color-logo mb-14 ${inter.className}`}>
                        Não é usuário,&nbsp;
                        <Link href="/signup">
                            <span className="font-bold text-color-logo hover:underline">
                                Cadastre-se
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </section >
    )
}