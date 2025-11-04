'use client'

import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";

export default function SignIn() {

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
                    <div className="max-w-lg mx-auto mt-10 mb-10 min-w-64">
                        <h1 className={`text-center font-bold text-color-logo mb-5 ${inter.className}`}>Logar como Usuário:</h1>
                        <Link href="/signin/iris/clinica">
                            <button type="button" className={`text-white mb-5 font-bold bg-footer-email rounded-2xl text-sm w-full min-h-10 text-center ${inter.className}`}>
                                Clínica
                            </button>
                        </Link>
                        <Link href="/signin/iris/funcionario">
                            <button type="button" className={`text-white font-bold bg-footer-email rounded-2xl text-sm w-full min-h-10 text-center ${inter.className}`}>
                                Funcionário
                            </button>
                        </Link>
                    </div>
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