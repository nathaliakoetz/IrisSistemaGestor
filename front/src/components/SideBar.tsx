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
                    <img className="w-5 h-5" src="/icon_visaogeral.png" />
                    <p className={activeLink == "geral" ? `text-[#192333] text-[15px] font-normal ${inter.className}` : `text-[#798391] text-[15px] font-normal ${inter.className}`}>
                        Visão Geral
                    </p>
                </Link>
                <Link href="/area-agenda" className={activeLink == "agenda" ? "w-60 pl-11 py-2 bg-[#eaeaea] border-r-8 border-[#6d9ce3] justify-start gap-3 items-center inline-flex" : "pl-11 py-2 justify-start items-center gap-3 inline-flex"}>
                    <img className="w-5 h-5" src="/icon_agenda.png" />
                    <p className={activeLink == "agenda" ? `text-[#192333] text-[15px] font-normal ${inter.className}` : `text-[#798391] text-[15px] font-normal ${inter.className}`}>
                        Agenda
                    </p>
                </Link>
                <Link href="#" className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_relatorios.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Relatórios
                    </p>
                </Link>
                <Link href="#" className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_msgs.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Mensagens
                    </p>
                </Link>
                <Link href="#" className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <rect width="20" height="20" fill="url(#pattern0_283_2061)" />
                        <defs>
                            <pattern id="pattern0_283_2061" patternContentUnits="objectBoundingBox" width="1" height="1">
                                <use xlinkHref="#image0_283_2061" transform="scale(0.0125)" />
                            </pattern>
                            <image id="image0_283_2061" width="80" height="80" xlinkHref="data:image/png;base64,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" />
                        </defs>
                    </svg>
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Mundo das Emoções
                    </p>
                </Link>
            </div>
            <div className="mt-10 flex-col justify-start items-start gap-2 inline-flex">
                <div className="pl-11 justify-center items-center gap-2.5 inline-flex">
                    <p className={`text-[#192333] text-[15px] font-medium ${inter.className}`}>
                        Gestão Interna
                    </p>
                </div>
                <Link href="#" className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_funcionarios.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Funcionários
                    </p>
                </Link>
                <Link href="#" className="pl-11 py-2 justify-between items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_pacientes.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
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