import Link from "next/link";
import { inter, cairo } from "@/utils/fonts";

export default function AreaCliente() {

    return (
        <>
            <div className="w-60 h-[900px] left-0 top-0 absolute bg-[#f2f2f2] border-r border-[#252d39]" />
            <div className="left-0 top-[138px] absolute flex-col justify-start items-start gap-2 inline-flex">
                <div className="pl-11 justify-center items-center inline-flex">
                    <div className={`text-[#192333] text-[15px] font-medium ${inter.className}`}>Menu Principal</div>
                </div>
                <div className="w-60 pl-11 py-2 bg-[#eaeaea] border-r-8 border-[#6d9ce3] justify-start gap-3 items-center inline-flex">
                    <img className="w-5 h-5" src="https://via.placeholder.com/20x20" />
                    <div className={`text-[#192333] text-[15px] font-normal ${inter.className}`}>Visão Geral</div>
                </div>
                <Link href="/" className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="https://via.placeholder.com/20x20" />
                    <div className={`w-16 text-[#798391] text-[15px] font-normal ${inter.className}`}>Agenda</div>
                </Link>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="https://via.placeholder.com/20x20" />
                    <div className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>Relatórios</div>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="https://via.placeholder.com/20x20" />
                    <div className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>Mensagens</div>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="https://via.placeholder.com/20x20" />
                    <div className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>Mundo das Emoções</div>
                </div>
            </div>
            <div className="left-0 top-[430px] absolute flex-col justify-start items-start gap-2 inline-flex">
                <div className="pl-11 justify-center items-center gap-2.5 inline-flex">
                    <div className={`text-[#192333] text-[15px] font-medium ${inter.className}`}>Gestão Interna</div>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="https://via.placeholder.com/20x20" />
                    <div className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>Funcionários</div>
                </div>
                <div className="pl-11 py-2 justify-between items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="https://via.placeholder.com/20x20" />
                    <div className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>Pacientes</div>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="https://via.placeholder.com/20x20" />
                    <div className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>Connect</div>
                </div>
            </div>
            <div className="left-0 top-[630px] absolute flex-col justify-start items-start gap-2 inline-flex">
                <div className="pl-11 justify-center items-center gap-2.5 inline-flex">
                    <div className={`text-[#192333] text-[15px] font-medium ${inter.className}`}>Ajuda e Configurações</div>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="https://via.placeholder.com/20x20" />
                    <div className={`text-[#737f8f] text-[15px] font-normal ${inter.className}`}>Suporte</div>
                </div>
                <div className="pl-11 py-2 justify-start items-center gap-3 inline-flex">
                    <img className="w-5 h-5" src="https://via.placeholder.com/20x20" />
                    <div className={`text-[#798391] text-[15px] font-normal ${inter.className}`}>Configurações</div>
                </div>
            </div>
            <Link href="/">
                <img className="w-[148px] h-[81px] left-[43px] top-[15px] absolute" src="/logo.png" />
            </Link>
        </>
    )
}