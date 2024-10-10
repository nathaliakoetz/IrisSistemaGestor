import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";

interface HeaderProps {
    activeLink: string;
}

export function Header({ activeLink }: HeaderProps) {

    return (
        <nav className="border-gray-200">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl pt-4 pb-4">
                <div className="flex items-center space-x-6 rtl:space-x-reverse">
                    {activeLink !== "inicio" && (
                        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse me-16">
                            <img src="./logo.png" className="h-8" alt="Icone do Sistema Íris" />
                            <span className={`self-center text-2xl whitespace-nowrap text-color-logo dark:text-color-logo ${cairo.className}`}>
                                ÍRIS
                            </span>
                        </Link>
                    )}
                    <Link href="/" className={`flex font-bold ${activeLink === "inicio" ? "text-header-selected dark:text-header-selected" : "text-color-logo dark:text-color-logo"} hover:underline ${cairo.className}`}>
                        Início
                    </Link>
                    <Link href="/sobre-iris" className={`flex font-bold ${activeLink === "sobre" ? "text-header-selected dark:text-header-selected" : "text-color-logo dark:text-color-logo"} hover:underline ${cairo.className}`}>
                        Sobre Íris
                    </Link>
                    <Link href="/para-clinica" className={`flex font-bold ${activeLink === "clinica" ? "text-header-selected dark:text-header-selected" : "text-color-logo dark:text-color-logo"} hover:underline ${cairo.className}`}>
                        Para sua Clínica
                    </Link>
                    <Link href="/para-voce" className={`flex font-bold ${activeLink === "voce" ? "text-header-selected dark:text-header-selected" : "text-color-logo dark:text-color-logo"} hover:underline ${cairo.className}`}>
                        Para Você
                    </Link>
                    <Link href="/" className={`flex font-bold ${activeLink === "contato" ? "text-header-selected dark:text-header-selected" : "text-color-logo dark:text-color-logo"} hover:underline ${cairo.className}`}>
                        Contato
                    </Link>
                </div>
                <div className="flex items-center space-x-6 rtl:space-x-reverse mt-2">
                    <Link href="/signin">
                        <button type="button" className="flex btn-area-cliente focus:outline-none font-medium rounded-full text-sm ps-5 pe-6 py-1.5 text-center h-8 me-2 mb-2 dark:btn-area-cliente">
                            <img src="icon_btn.png" className="h-4 mt-0.5" alt="Icone do Botão de Area do Cliente" />
                            &nbsp;&nbsp;
                            <span className={`font-bold ${inter.className}`}>
                                Área do Cliente
                            </span>
                        </button>
                    </Link>
                    <Link href="/">
                        <button type="button" className="flex btn-cadastre-se focus:outline-none font-medium rounded-full text-sm ps-5 pe-6 py-1 text-center h-8 me-2 mb-2 dark:btn-cadastre-se">
                            <span className={`font-bold ${inter.className}`}>
                                Cadastre-se
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}