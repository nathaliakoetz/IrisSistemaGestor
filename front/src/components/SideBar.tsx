'use client'

import Link from "next/link";
import { inter } from "@/utils/fonts";

interface SideBarProps {
    activeLink: string;
}

export function SideBar({ activeLink }: SideBarProps) {

    return (
        <div className="h-auto w-60 pb-52 bg-[#f2f2f2] border-r border-[#252d39]">
            <Link href="/" className="flex justify-center items-center mt-5">
                <img className="w-[148px] h-[81px]" src="/logo.png" />
            </Link>
            <div className="mt-10 flex-col justify-start items-start gap-2 inline-flex">
                <div className="pl-11 justify-center items-center inline-flex">
                    <p className={`text-[#192333] text-[15px] font-medium ${inter.className}`}>
                        Menu Principal
                    </p>
                </div>
                <Link href="/area-cliente" className={activeLink == "geral" ? "w-60 pl-11 py-2 bg-[#eaeaea] border-r-8 border-[#6d9ce3] justify-start gap-3 items-center inline-flex" : "pl-11 py-2 justify-start items-center gap-3 inline-flex"}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5001 11.667H11.6667V17.5003H17.5001V11.667Z" stroke="#7A8392" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17.5001 3H11.6667V8.83333H17.5001V3Z" stroke="#7A8392" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.33333 11.667H2.5V17.5003H8.33333V11.667Z" stroke="#7A8392" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.33333 3H2.5V8.83333H8.33333V3Z" stroke="#7A8392" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p className={activeLink == "geral" ? `text-[#192333] text-[15px] font-normal ${inter.className}` : `text-[#798391] text-[15px] font-normal ${inter.className}`}>
                        Visão Geral
                    </p>
                </Link>
                <Link href="/area-cliente/agenda" className={activeLink == "agenda" ? "w-60 pl-11 py-2 bg-[#eaeaea] border-r-8 border-[#6d9ce3] justify-start gap-3 items-center inline-flex" : "pl-11 py-2 justify-start items-center gap-3 inline-flex"}>
                    <img className="w-5 h-5" src="/icon_agenda.png" />
                    <p className={activeLink == "agenda" ? `text-[#192333] text-[15px] font-normal ${inter.className}` : `text-[#798391] text-[15px] font-normal ${inter.className}`}>
                        Agenda
                    </p>
                </Link>
                <Link href="/area-cliente/relatorios" className={activeLink == "relatorios" ? "w-60 pl-11 py-2 bg-[#eaeaea] border-r-8 border-[#6d9ce3] justify-start gap-3 items-center inline-flex" : "pl-11 py-2 justify-start items-center gap-3 inline-flex"}>
                    <img className="w-5 h-5" src="/icon_relatorios.png" />
                    <p className={activeLink == "relatorios" ? `text-[#192333] text-[15px] font-normal ${inter.className}` : `text-[#798391] text-[15px] font-normal ${inter.className}`}>
                        Relatórios
                    </p>
                </Link>
                <Link href="#" className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_msgs.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Mensagens
                    </p>
                </Link>
            </div>
            <div className="mt-10 flex-col justify-start items-start gap-2 inline-flex">
                <div className="pl-11 justify-center items-center gap-2.5 inline-flex">
                    <p className={`text-[#192333] text-[15px] font-medium ${inter.className}`}>
                        Gestão Interna
                    </p>
                </div>
                <Link href="/area-cliente/funcionario" className={activeLink == "funcionario" ? "w-60 pl-11 py-2 bg-[#eaeaea] border-r-8 border-[#6d9ce3] justify-start gap-3 items-center inline-flex" : "pl-11 py-2 justify-start items-center gap-3 inline-flex"}>
                    <img className="w-5 h-5" src="/icon_funcionarios.png" />
                    <p className={activeLink == "funcionario" ? `text-[#192333] text-[15px] font-normal ${inter.className}` : `text-[#798391] text-[15px] font-normal ${inter.className}`}>
                        Funcionários
                    </p>
                </Link>
                <Link href="/area-cliente/pacientes" className={activeLink == "pacientes" ? "w-60 pl-11 py-2 bg-[#eaeaea] border-r-8 border-[#6d9ce3] justify-start gap-3 items-center inline-flex" : "pl-11 py-2 justify-start items-center gap-3 inline-flex"}>
                    <img className="w-5 h-5" src="/icon_pacientes.png" />
                    <p className={activeLink == "pacientes" ? `text-[#192333] text-[15px] font-normal ${inter.className}` : `text-[#798391] text-[15px] font-normal ${inter.className}`}>
                        Pacientes
                    </p>
                </Link>
                <Link href="#" className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_connectmenu.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Connect
                    </p>
                </Link>
            </div>
            <div className="mt-10 flex-col justify-start items-start gap-2 inline-flex">
                <div className="pl-11 justify-center items-center gap-2.5 inline-flex">
                    <p className={`text-[#192333] text-[15px] font-medium ${inter.className}`}>
                        Ajuda e Configurações
                    </p>
                </div>
                <Link href="#" className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_suporte.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Suporte
                    </p>
                </Link>
                <Link href="#" className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_config.png" />
                    <p className={`text-[#798391] text-[15px] font-normal ${inter.className}`}>
                        Configurações
                    </p>
                </Link>
            </div>
        </div>
    )
}