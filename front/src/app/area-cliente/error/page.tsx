'use client'

import { cairo, inter } from "@/utils/fonts";
import { pause } from "@/utils/functions/pause";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';


export default function SignIn() {
    const router = useRouter();
    const [effectExecuted, setEffectExecuted] = useState(false);

    useEffect(() => {
        if (effectExecuted) return;

        async function redireciona() {
            await pause(2)
            router.push("/signin/iris/clinica")
        }
        redireciona()
        setEffectExecuted(true);
    }, [effectExecuted, router])


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
                    <div className="flex justify-center items-center mt-10 mb-10">
                        <p className={`text-2xl text-color-logo ${cairo.className}`}>
                        Erro ao carregar os dados da Clínica...<br/>Redirecionando para a página de login.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}