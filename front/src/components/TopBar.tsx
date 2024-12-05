import { inter, cairo } from "@/utils/fonts";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { ClinicaI } from "@/utils/types/clinicas";
import Cookies from 'js-cookie';

export function TopBar() {
    const [clinica, setClinica] = useState<ClinicaI>();
    const [currentDate, setCurrentDate] = useState('');
    const [currentDay, setCurrentDay] = useState('');

    useEffect(() => {

        async function buscaClinica(id: string) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clinicas/${id}`, {
                method: "GET"
            })

            if (response.status == 200) {
                const dados = await response.json()
                return dados
            } else if (response.status == 400) {
                window.location.href = "/area-cliente/error"
            }
        }

        const clinicaId = Cookies.get("clinica_logado_id");
        if (clinicaId) {
            buscaClinica(clinicaId).then(dados => setClinica(dados));
        }

        const date = new Date();
        const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
        const formattedDate = date.toLocaleDateString('pt-BR', dateOptions);
        const formattedDay = date.toLocaleDateString('pt-BR', dayOptions);
        setCurrentDate(formattedDate);
        setCurrentDay(formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1));
    }, []);

    return (
        <div className="flex items-center justify-between h-20 w-full bg-[#f2f2f2] border-b border-[#192333]">
            <div className={`ms-10 text-[#252d39] text-[25px] font-normal ${inter.className}`}>
                {currentDate} | {currentDay}
            </div>
            <div className="justify-start items-center gap-6 inline-flex me-10">
                <img className="w-7 h-7" src="/icon_notificacoes.png" />
                <p className="w-8 rotate-90 border border-[#252d39]" />
                <div className="justify-start items-center gap-4 flex">
                    <img className="w-[38px] h-[38px] rounded-full" src={clinica?.dadosUsuario?.foto ?? '/default-profile.png'} />
                    <div className="justify-start items-center gap-1 flex">
                        <h1 className={`text-black text-2xl font-bold ${cairo.className}`}>
                            {clinica?.dadosUsuario.nome}
                        </h1>
                        <div className="w-5 h-5 relative" />
                    </div>
                </div>
                <Link href="/">
                    <img className="w-6 h-6" src="/icon_signout.png" />
                </Link>
            </div>
        </div>
    )
}