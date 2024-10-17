import { inter, cairo } from "@/utils/fonts";

export function TopBar() {
    return (
        <div className="flex items-center justify-between h-20 w-full bg-[#f2f2f2] border-b border-[#192333]">
            <div className={`ms-10 text-[#252d39] text-[25px] font-normal ${inter.className}`}>
                30/09/2024 | Segunda-feira
            </div>
            <div className="justify-start items-center gap-6 inline-flex me-10">
                <img className="w-7 h-7" src="/icon_notificacoes.png" />
                <p className="w-8 rotate-90 border border-[#252d39]" />
                <div className="justify-start items-center gap-4 flex">
                    <img className="w-[38px] h-[38px] rounded-full" src="/avatar.png" />
                    <div className="justify-start items-center gap-1 flex">
                        <h1 className={`text-black text-2xl font-bold ${cairo.className}`}>
                            Clinica Alfa
                        </h1>
                        <div className="w-5 h-5 relative" />
                    </div>
                </div>
                <img className="w-6 h-6" src="/icon_signout.png" />
            </div>
        </div>
    )
}