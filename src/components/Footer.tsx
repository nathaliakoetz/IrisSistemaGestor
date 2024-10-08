import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";


export function Footer() {

    return (
        <section className="bg-footer h-full">
            <div className="grid grid-cols-2 gap-10 mt-10 max-w-screen-xl mx-auto">
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <h1 className={`text text-xl font-bold text-white ${cairo.className}`}>
                            ÍRIS, SISTEMA GESTOR
                        </h1>
                    </div>
                    <div className="flex flex-row">
                        <p className={`text text-md text-white ${inter.className}`}>
                            Revolucionando a gestão de clínicas
                        </p>
                    </div>
                    <div className="flex flex-row">
                        <Link href="/">
                            <img src="./media_facebook.png" alt="Ícone do Facebook" className="h-12 w-12" />
                        </Link>
                        <Link href="/">
                            <img src="./media_whats.png" alt="Ícone do WhatsApp" className="h-12 w-12" />
                        </Link>
                        <Link href="/">
                            <img src="./media_insta.png" alt="Ícone do Instagram" className="h-12 w-12" />
                        </Link>
                    </div>
                    <div className="flex flex-row mb-10 mt-5">
                        <form>
                            <p className={`text text-md text-white mb-2 ${inter.className}`}>
                                Receba as novidades e promoções no seu e-mail
                            </p>
                            <div className="relative w-full max-w-md">
                                <img
                                    src="./icon_email.png"
                                    alt="Ícone de cartinha de correio"
                                    className="absolute inset-y-0 left-0 ps-2 h-6 w-8 my-auto"
                                />
                                <input
                                    type="text"
                                    id="email-address-icon"
                                    className="bg-footer-email rounded-md text-gray-900 text-sm block w-full ps-10 pe-11 p-2.5 dark:bg-footer-email dark:placeholder-gray-400 dark:text-white"
                                    placeholder="E-mail"
                                />
                                <button
                                    type="submit"
                                    className="absolute inset-y-0 right-0 pe-3 flex items-center"
                                >
                                    <img
                                        src="./icon_send.png"
                                        alt="Ícone de enviar"
                                        className="h-5 w-5"
                                    />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-7">
                    <div>
                        <h2 className={`text-white text-lg font-bold ${inter.className}`}>Empresa</h2>
                        <ul className="mt-3">
                            <li><Link href="/" className={`text-white text-sm hover:underline ${inter.className}`}>Sobre</Link></li>
                            <li className="mt-2"><Link href="/" className={`text-white text-sm hover:underline ${inter.className}`}>Fale Conosco</Link></li>
                            <li className="mt-2"><Link href="/" className={`text-white text-sm hover:underline ${inter.className}`}>Suporte</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className={`text-white text-lg font-bold ${inter.className}`}>Acesso Rápido</h2>
                        <ul className="mt-3">
                            <li><Link href="/" className={`text-white text-sm hover:underline ${inter.className}`}>Página Inicial</Link></li>
                            <li className="mt-2"><Link href="/" className={`text-white text-sm hover:underline ${inter.className}`}>Login</Link></li>
                            <li className="mt-2"><Link href="/" className={`text-white text-sm hover:underline ${inter.className}`}>Connect</Link></li>
                            <li className="mt-2"><Link href="/" className={`text-white text-sm hover:underline ${inter.className}`}>Adiquira o Íris</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className={`text-white text-lg font-bold ${inter.className}`}>Legal</h2>
                        <ul className="mt-3">
                            <li><Link href="/" className={`text-white text-sm hover:underline ${inter.className}`}>Termos e Condições</Link></li>
                            <li className="mt-2"><Link href="/" className={`text-white text-sm hover:underline ${inter.className}`}>Políticas de Privacidade</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className={`text-white text-lg font-bold ${inter.className}`}>Contato</h2>
                        <ul className="mt-3">
                            <li><p className={`text-white text-sm font-bold ${inter.className}`}>Vendas</p></li>
                            <li><p className={`text-white text-sm ${inter.className}`}>+55 (53) 99900-0000</p></li>
                            <li className="mt-2"><p className={`text-white text-sm font-bold ${inter.className}`}>Suporte</p></li>
                            <li><p className={`text-white text-sm ${inter.className}`}>+55 (53) 99900-0000</p></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}