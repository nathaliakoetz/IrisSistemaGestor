'use client'

import { inter, cairo } from "@/utils/fonts";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useTerapeutaStore } from "@/context/terapeuta";
import { pause } from "@/utils/functions/pause";
import Cookies from "js-cookie";

export function TopBarMedico() {
    const { terapeuta, deslogaTerapeuta } = useTerapeutaStore();
    const [currentDate, setCurrentDate] = useState('');
    const [currentDay, setCurrentDay] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const date = new Date();
        const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
        const formattedDate = date.toLocaleDateString('pt-BR', dateOptions);
        const formattedDay = date.toLocaleDateString('pt-BR', dayOptions);
        setCurrentDate(formattedDate);
        setCurrentDay(formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1));
    }, []);

    async function sairTerapeuta() {
        Cookies.remove("authID")
        Cookies.remove("authToken")
        Cookies.remove("authClinicaId")
        sessionStorage.removeItem("logged")
        sessionStorage.removeItem("authToken")
        window.location.href = "/signin"
        await pause(1)
        deslogaTerapeuta()
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
                    <img className="w-[38px] h-[38px] rounded-full" src='/avatar.png' />
                    <div className="justify-start items-center gap-1 flex">
                        <h1 className={`text-black text-2xl font-bold ${cairo.className}`}>
                            {isClient && terapeuta?.nome ? terapeuta.nome : 'Funcionário'}
                        </h1>
                        <div className="w-5 h-5 relative" />
                    </div>
                </div>
                <Link href="/">
                    <img className="w-6 h-6" src="/icon_signout.png" onClick={sairTerapeuta} />
                </Link>
            </div>
        </div>
    )
}
