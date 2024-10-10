import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header"
import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";

interface ParaClinicaProps {
    activeLink: string;
}

export default function ParaClinica({ activeLink }: ParaClinicaProps) {

    let ativo

    if (activeLink == "voce") {
        ativo = activeLink
    } else {
        ativo = 'clinica'
    }

    return (
        <section>
            <Header activeLink={ativo} />
            <div className="max-w-screen-xl mx-auto mt-20 mb-20">
                <h1 className={`text-5xl font-bold ${cairo.className}`}>
                    Pacotes Íris
                </h1>
                <div className="flex justify-center items-center mt-8">
                    <div className="max-w-sm mt-9 mb-10 border border-gray-400 bg-white rounded-s-3xl shadow flex flex-col items-center h-auto">
                        <img className="rounded-t-3xl h-60 w-60 mt-14 mb-7" src="/pacote_essencial.png" alt="" />
                        <div className="p-5">
                            <h5 className={`mb-2 text-3xl text-center font-bold tracking-tight text-color-logo ${cairo.className}`}>
                                Essencial Íris
                            </h5>
                            <p className={`text-sm text-center text-color-corp font-bold mt-8 mb-8 ${cairo.className}`}>
                                R$&nbsp;&nbsp;&nbsp;
                                <span className="text-4xl text-center text-color-corp font-bold">
                                    110,00
                                </span>
                            </p>
                            <ul>
                                <li className={`text-sm text-black ${inter.className}`}>&bull;&nbsp;&nbsp;Acesso completo à gestão de pacientes, agendamento e relatórios.</li>
                                <li className={`text-sm text-black mt-5 ${inter.className}`}>&bull;&nbsp;&nbsp;Jogos interativos para o desenvolvimento das crianças.</li>
                                <li className={`text-sm text-black mt-5 mb-5 ${inter.className}`}>&bull;&nbsp;&nbsp;Acompanhamento gratuito para os pais, sem custos adicionais.</li>
                            </ul>
                            <div className="flex justify-center">
                                <Link href="#" className="inline-flex items-center px-20 py-3 text-sm font-medium text-center text-white bg-footer-email rounded-3xl hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                    Assinar Agora
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-gestao rounded-t-2xl pt-3 pb-2.5 text-white text-sm text-center font-bold">
                            Mais Vendido
                        </div>
                        <div className="max-w-sm mb-12 bg-white border-corp border-4 rounded-br-3xl shadow flex flex-col items-center h-auto">
                            <img className="h-60 w-72 mt-14 mb-7" src="/pacote_corporativo.png" alt="" />
                            <div className="p-5">
                                <h5 className={`mb-2 text-3xl text-center font-bold tracking-tight text-color-corp ${cairo.className}`}>
                                    Corporativo Íris
                                </h5>
                                <p className={`text-sm text-center text-color-corp font-bold mt-8 mb-8 ${cairo.className}`}>
                                    R$&nbsp;&nbsp;&nbsp;
                                    <span className="text-4xl text-center text-color-corp font-bold">
                                        180,00
                                    </span>
                                </p>
                                <ul>
                                    <li className={`text-sm text-black ${inter.className}`}>&bull;&nbsp;&nbsp;Pacote <span className={`text-sm text-color-logo font-bold ${inter.className}`}>Essencial Íris</span></li>
                                    <li className={`text-sm text-black mt-10 ${inter.className}`}>&bull;&nbsp;&nbsp;Maior capacidade de armazenamento e relatórios detalhados.</li>
                                    <li className={`text-sm text-black mt-5 mb-5 ${inter.className}`}>&bull;&nbsp;&nbsp;Suporte técnico prioritário e atendimento exclusivo.</li>
                                </ul>
                                <div className="flex justify-center">
                                    <Link href="#" className="inline-flex items-center px-20 py-3 text-sm font-medium text-center text-white bg-footer-email rounded-3xl hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                        Assinar Agora
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="pacotes-connect" className="max-w-screen-xl mx-auto mt-20 mb-20">
                <h1 className={`text-5xl font-bold ${cairo.className}`}>
                    Pacotes Connect
                </h1>
                <div className="grid grid-cols-3 mt-10">
                    <div className="flex flex-col bg-sobre rounded-s-2xl py-8">
                        <div className="flex items-center justify-center mx-3">
                            <h1 className={`text-8xl text-footer font-bold text-center ${inter.className}`}>
                                1
                            </h1>
                            <p className={`text-lg text-footer ms-2 ${inter.className}`}>
                                Aumente sua visibilidade entre clínicas que buscam profissionais qualificados
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col bg-sobre py-8">
                        <div className="flex items-center justify-center mx-3">
                            <h1 className={`text-8xl text-footer font-bold text-center ${inter.className}`}>
                                2
                            </h1>
                            <p className={`text-lg text-footer ms-2 ${inter.className}`}>
                                Receba recomendações de vagas alinhadas à sua especialização e experiências
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col bg-sobre rounded-e-2xl py-8">
                        <div className="flex items-center justify-center mx-3">
                            <h1 className={`text-8xl text-footer font-bold text-center ${inter.className}`}>
                                3
                            </h1>
                            <p className={`text-lg text-footer ms-2 ${inter.className}`}>
                                Atualize seu currículo de forma simples, mantendo suas qualificações acessíveis para as clínicas
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-screen-xl mx-auto my-20">
                <div className="flex justify-center items-center mt-8">
                    <div className="max-w-sm mt-9 mb-10 border border-gray-400 bg-white rounded-s-3xl shadow flex flex-col items-center h-auto">
                        <img className="rounded-t-3xl h-60 w-60 mt-14" src="/connect_mensal.png" alt="" />
                        <div className="p-5">
                            <h5 className={`text-3xl text-center font-bold tracking-tight text-color-logo ${cairo.className}`}>
                                Connect
                            </h5>
                            <p className={`text-lg text-center text-color-logo font-normal mb-8 ${cairo.className}`}>
                                Renovação Mensal
                            </p>
                            <p className={`text-sm text-center text-color-corp font-bold mt-8 mb-14 ${cairo.className}`}>
                                R$&nbsp;&nbsp;&nbsp;
                                <span className="text-4xl text-center text-color-corp font-bold">
                                    40,00
                                </span>
                                <span className="text-sm text-center text-color-logo">
                                    &nbsp;&nbsp;&nbsp;por mês
                                </span>
                            </p>
                            <div className="flex justify-center">
                                <Link href="#" className="inline-flex items-center px-20 py-3 text-sm font-medium text-center text-white bg-footer-email rounded-3xl hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                    Assinar Agora
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-gestao rounded-t-2xl pt-3 pb-2.5 text-white text-sm text-center font-bold">
                            Mais Vendido
                        </div>
                        <div className="max-w-sm mb-12 bg-white border-corp border-4 shadow flex flex-col items-center h-auto">
                            <img className="h-60 w-60 mt-14" src="/connect_semestral.png" alt="" />
                            <div className="p-5">
                                <h5 className={`text-3xl text-center font-bold tracking-tight text-color-logo ${cairo.className}`}>
                                    Connect
                                </h5>
                                <p className={`text-lg text-center text-color-logo font-normal mb-8 ${cairo.className}`}>
                                    Renovação Semestral
                                </p>
                                <p className={`text-sm text-center text-color-corp font-bold mt-8 ${cairo.className}`}>
                                    R$&nbsp;&nbsp;&nbsp;
                                    <span className="text-4xl text-center text-color-corp font-bold">
                                        33,00
                                    </span>
                                    <span className="text-sm text-center text-color-logo">
                                        &nbsp;&nbsp;&nbsp;por mês
                                    </span>
                                </p>
                                <p className={`text-md text-center font-bold mb-8 ${inter.className}`}>
                                    R$ 198,00 ao Total
                                </p>
                                <div className="flex justify-center">
                                    <Link href="#" className="inline-flex items-center px-20 py-3 text-sm font-medium text-center text-white bg-footer-email rounded-3xl hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                        Assinar Agora
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-sm mt-9 mb-10 border border-gray-400 bg-white rounded-e-3xl shadow flex flex-col items-center h-auto">
                        <img className="rounded-t-3xl h-60 w-60 mt-14" src="/connect_anual.png" alt="" />
                        <div className="p-5">
                            <h5 className={`text-3xl text-center font-bold tracking-tight text-color-logo ${cairo.className}`}>
                                Connect
                            </h5>
                            <p className={`text-lg text-center text-color-logo font-normal mb-8 ${cairo.className}`}>
                                Renovação Anual
                            </p>
                            <p className={`text-sm text-center text-color-corp font-bold mt-8 ${cairo.className}`}>
                                R$&nbsp;&nbsp;&nbsp;
                                <span className="text-4xl text-center text-color-corp font-bold">
                                    25,00
                                </span>
                                <span className="text-sm text-center text-color-logo">
                                    &nbsp;&nbsp;&nbsp;por mês
                                </span>
                            </p>
                            <p className={`text-md text-center font-bold mb-8 ${inter.className}`}>
                                R$ 300,00 ao Total
                            </p>
                            <div className="flex justify-center">
                                <Link href="#" className="inline-flex items-center px-20 py-3 text-sm font-medium text-center text-white bg-footer-email rounded-3xl hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                    Assinar Agora
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    )
}