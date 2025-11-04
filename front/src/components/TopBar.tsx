import { inter, cairo } from "@/utils/fonts";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useClinicaStore } from "@/context/clinica";
import { ClinicaI } from "@/utils/types/clinicas";
import { pause } from "@/utils/functions/pause";
import Cookies from "js-cookie";

export function TopBar() {
    const { clinica, deslogaClinica } = useClinicaStore();
    const [currentDate, setCurrentDate] = useState('');
    const [currentDay, setCurrentDay] = useState('');
    const [dadosClinica, setDadosClinica] = useState<ClinicaI>();

    useEffect(() => {

        async function buscaClinica(id: string) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clinicas/${id}`, {
                method: "GET"
            })

            if (response.status == 200) {
                const dados = await response.json()
                setDadosClinica(dados)
            } else if (response.status == 400) {
                window.location.href = "/area-cliente/error"
            }
        }

        if (!clinica.id && !Cookies.get("authID")) {
            window.location.href = "/area-cliente/error"
        } else if (Cookies.get("authID")) {
            const authID = Cookies.get("authID") as string
            buscaClinica(authID)

            const date = new Date();
            const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
            const formattedDate = date.toLocaleDateString('pt-BR', dateOptions);
            const formattedDay = date.toLocaleDateString('pt-BR', dayOptions);
            setCurrentDate(formattedDate);
            setCurrentDay(formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1));
        } else {
            buscaClinica(clinica.id)
            const date = new Date();
            const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
            const formattedDate = date.toLocaleDateString('pt-BR', dateOptions);
            const formattedDay = date.toLocaleDateString('pt-BR', dayOptions);
            setCurrentDate(formattedDate);
            setCurrentDay(formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1));
        }
    }, []);

    async function sairClinica() {
        Cookies.remove("authID")
        Cookies.remove("authToken")
        sessionStorage.removeItem("logged")
        sessionStorage.removeItem("authToken")
        window.location.href = "/signin"
        await pause(1)
        deslogaClinica()
    }

    return (
        <div className="flex items-center justify-between h-20 w-full bg-[#f2f2f2] border-b border-[#192333]">
            <div className={`ms-10 text-[#252d39] text-[25px] font-normal ${inter.className}`}>
                {currentDate} | {currentDay}
            </div>
            <div className="justify-start items-center gap-6 inline-flex me-10">
                <img className="w-7 h-7" src="/icon_notificacoes.png" />
                <p className="w-8 rotate-90 border border-[#252d39]" />
                <div className="justify-start items-center gap-4 flex">
                    <img className="w-[38px] h-[38px] rounded-full" src={dadosClinica?.dadosUsuario?.foto ?? '/avatar.png'} />
                    <div className="justify-start items-center gap-1 flex">
                        <h1 className={`text-black text-2xl font-bold ${cairo.className}`}>
                            {dadosClinica?.dadosUsuario.nome}
                        </h1>
                        <div className="w-5 h-5 relative" />
                    </div>
                </div>
                <Link href="/">
                    <img className="w-6 h-6" src="/icon_signout.png" onClick={sairClinica} />
                </Link>
            </div>
        </div>
    )
}