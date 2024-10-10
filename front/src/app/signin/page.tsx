import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";

export default function SignIn() {
    return (
        <section className="bg-[url('/bg_login.jpeg')] bg-cover bg-no-repeat h-full flex justify-center items-center">
            <div className="flex justify-center items-center mt-8">
                <div className="max-w-lg mt-9 mb-10 border border-gray-400 bg-white rounded-3xl shadow flex flex-col items-center h-auto overflow-hidden">
                    <div className="flex flex-row w-full items-center justify-center mt-5">
                        <img src="./logo.png" alt="Icone do Sistema Íris" className="w-1/5" />
                        <h1 className={`text-6xl ms-1 text-color-logo ${cairo.className}`}>
                            ÍRIS
                        </h1>
                    </div>
                    <form className="max-w-lg mx-auto mt-10">
                        <div className="mb-5">
                            <input
                                type="email"
                                id="email"
                                className="bg-form border-user text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-72 p-2.5"
                                placeholder="Nome de Usuário ou e-mail"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="password"
                                id="password"
                                className="bg-form border-user border-gray-700 text-gray-900 placeholder:text-header-selected text-sm rounded-2xl block w-full p-2.5"
                                placeholder="Senha"
                                required
                            />
                        </div>
                        <div className="flex items-start mb-5">
                            <Link href="/" className="hover:underline">
                                <p className="text-sm text-color-logo">
                                    Esqueceu a senha?
                                </p>
                            </Link>
                        </div>
                        <button type="submit" className="text-white font-bold bg-footer-email rounded-2xl text-sm w-full min-h-10 text-center">
                            Entrar
                        </button>
                        <p className="text-center mt-3 mb-3">----------------&nbsp;&nbsp;&nbsp;ou&nbsp;&nbsp;&nbsp;----------------</p>
                        <button type="submit" className="text-black min-h-10 mb-5 bg-form rounded-2xl px-3 text-sm w-full text-center flex justify-center items-center">
                            <img src="/icon_google.png" alt="Logar com Google" className="h-5 me-3" />
                            Continuar com Google
                        </button>
                    </form>
                    <p>
                        Não é usuário,&nbsp;
                        <span>
                            Cadastre-se
                        </span>
                    </p>
                </div>
            </div>
        </section >
    )
}