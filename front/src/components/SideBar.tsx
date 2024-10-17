import Link from "next/link";
import { inter } from "@/utils/fonts";

export function SideBar() {
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
                <div className="w-60 pl-11 py-2 bg-[#eaeaea] border-r-8 border-[#6d9ce3] justify-start gap-3 items-center inline-flex">
                    <img className="w-5 h-5" src="/icon_visaogeral.png" />
                    <p className={`text-[#192333] text-[15px] font-normal ${inter.className}`}>
                        Visão Geral
                    </p>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_agenda.png" />
                    <p className={`w-16 text-[#798391] text-[15px] font-normal ${inter.className}`}>
                        Agenda
                    </p>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_relatorios.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Relatórios
                    </p>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_msgs.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Mensagens
                    </p>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_mundoemoc.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Mundo das Emoções
                    </p>
                </div>
            </div>
            <div className="mt-10 flex-col justify-start items-start gap-2 inline-flex">
                <div className="pl-11 justify-center items-center gap-2.5 inline-flex">
                    <p className={`text-[#192333] text-[15px] font-medium ${inter.className}`}>
                        Gestão Interna
                    </p>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_funcionarios.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Funcionários
                    </p>
                </div>
                <div className="pl-11 py-2 justify-between items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_pacientes.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Pacientes
                    </p>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_connectmenu.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Connect
                    </p>
                </div>
            </div>
            <div className="mt-10 flex-col justify-start items-start gap-2 inline-flex">
                <div className="pl-11 justify-center items-center gap-2.5 inline-flex">
                    <p className={`text-[#192333] text-[15px] font-medium ${inter.className}`}>
                        Ajuda e Configurações
                    </p>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_suporte.png" />
                    <p className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>
                        Suporte
                    </p>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="/icon_config.png" />
                    <p className={`text-[#798391] text-[15px] font-normal ${inter.className}`}>
                        Configurações
                    </p>
                </div>
            </div>
        </div>
    )
}