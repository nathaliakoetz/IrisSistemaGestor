'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Link from "next/link";

export default function GestaoFuncionarios() {
    if (!sessionStorage.getItem("logged")) {
        return (
            <section className="bg-[url('/bg_login.jpeg')] bg-cover bg-no-repeat flex justify-center items-center h-[1080px]">
                <div className="flex justify-center items-center mt-32 mb-32">
                    <div className="max-w-lg border border-gray-400 bg-white rounded-3xl shadow flex flex-col items-center h-auto overflow-hidden">
                        <div className="flex flex-row w-card-login items-center justify-center mt-14">
                            <Link href="/" className="flex">
                                <img src="./../logo.png" alt="Icone do Sistema Íris" className="w-32" />
                                <h1 className={`text-7xl ms-1 text-color-logo ${cairo.className}`}>
                                    ÍRIS
                                </h1>
                            </Link>
                        </div>
                        <div className="flex justify-center items-center mt-10 mb-10">
                            <p className={`text-2xl text-color-logo ${cairo.className}`}>
                                Acesso negado.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    } else {
        return (
            <div className="flex">
                <SideBar activeLink="funcionario" />
                <div className="flex flex-col flex-1">
                    <TopBar />
                    <div className="flex-1 p-4 bg-[#f2f2f2]">
                        <div className="flex justify-between items-center gap-3 bg-[#EBEBEB] border-2 border-gray-300 p-2 rounded-md mb-2">
                            <div className="flex justify-between gap-3 items-center ms-10 mt-5 mb-5">
                                <svg width="34" height="20" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.912354 29.8266V25.9682C0.912354 24.8776 1.18718 23.9201 1.73683 23.0958C2.28649 22.2712 3.07051 21.6372 4.08892 21.1938C6.33405 20.2063 8.37642 19.4694 10.216 18.9833C12.0556 18.4972 14.1146 18.2542 16.3931 18.2542C18.6712 18.2542 20.7202 18.4972 22.54 18.9833C24.3594 19.4694 26.4014 20.2052 28.666 21.1906C29.6729 21.6372 30.4577 22.2726 31.0202 23.0969C31.5823 23.9208 31.8634 24.878 31.8634 25.9682V29.8266H0.912354ZM35.2629 29.8266V26.0443C35.2629 24.2082 34.8278 22.675 33.9577 21.4448C33.0872 20.2149 31.9644 19.2115 30.5894 18.4344C32.4165 18.7229 34.1485 19.0927 35.7853 19.5438C37.4221 19.9951 38.7988 20.4922 39.9155 21.0349C40.8724 21.5901 41.6464 22.2927 42.2374 23.1427C42.828 23.9931 43.1233 24.9582 43.1233 26.038V29.8266H35.2629ZM16.3931 14.1531C14.391 14.1531 12.753 13.5161 11.479 12.2422C10.2051 10.9682 9.56808 9.33038 9.56808 7.32865C9.56808 5.32656 10.2051 3.69184 11.479 2.42448C12.753 1.15712 14.391 0.523438 16.3931 0.523438C18.3948 0.523438 20.0294 1.15712 21.2967 2.42448C22.5641 3.69184 23.1978 5.32656 23.1978 7.32865C23.1978 9.33038 22.5641 10.9682 21.2967 12.2422C20.0294 13.5161 18.3948 14.1531 16.3931 14.1531ZM32.5608 7.31562C32.5608 9.30486 31.9271 10.9375 30.6598 12.2135C29.3924 13.4892 27.7554 14.1271 25.7488 14.1271C25.5158 14.1271 25.2756 14.1139 25.028 14.0875C24.7808 14.0608 24.5433 14.0069 24.3155 13.926C25.0669 13.1337 25.6308 12.179 26.0071 11.062C26.3832 9.94532 26.5712 8.70278 26.5712 7.33438C26.5712 5.97084 26.3735 4.7566 25.978 3.69167C25.5828 2.62639 25.0287 1.63316 24.3155 0.711979C24.5158 0.660937 24.7516 0.616841 25.0228 0.579688C25.294 0.542188 25.5349 0.523438 25.7457 0.523438C27.7544 0.523438 29.3924 1.16007 30.6598 2.43333C31.9271 3.70625 32.5608 5.33368 32.5608 7.31562ZM3.19569 27.5427H29.5801V25.9776C29.5801 25.4092 29.4174 24.8846 29.092 24.4036C28.767 23.9231 28.32 23.5266 27.7509 23.2141C25.5467 22.1898 23.6288 21.4875 21.9973 21.1073C20.3657 20.7274 18.5033 20.5375 16.4103 20.5375C14.3117 20.5375 12.4339 20.7274 10.7769 21.1073C9.12034 21.4875 7.19899 22.1898 5.01287 23.2141C4.41982 23.5266 3.96878 23.9254 3.65975 24.4104C3.35037 24.8958 3.19569 25.4151 3.19569 25.9682V27.5427ZM16.3795 11.8698C17.6893 11.8698 18.7724 11.4425 19.629 10.588C20.4856 9.73351 20.9139 8.65139 20.9139 7.34167C20.9139 6.03229 20.4867 4.94913 19.6321 4.09219C18.7776 3.23559 17.6957 2.80729 16.3863 2.80729C15.0766 2.80729 13.9934 3.23455 13.1368 4.08906C12.2799 4.94358 11.8514 6.02569 11.8514 7.33542C11.8514 8.64479 12.2788 9.72795 13.1337 10.5849C13.9882 11.4415 15.0702 11.8698 16.3795 11.8698Z" fill="#6D9CE3" />
                                </svg>
                                <h1 className={`text-3xl text-dark font-semibold ${inter.className}`}>
                                    Funcionários
                                </h1>
                            </div>
                            <div className="flex justify-center gap-3 items-center mt-5 mb-5">
                                <button className={`flex justify-center w-[250px] border-2 font-semibold items-center bg-[#6D9CE3] p-3 text-white text-sm rounded-lg ${inter.className}`}>
                                    Cadastrar Funcionário
                                </button>
                                <button className={`flex justify-center w-[250px] border-2 font-semibold items-center bg-white p-3 text-dark text-sm rounded-lg ${inter.className}`}>
                                    Filtrar
                                </button>
                                <button className={`flex justify-center w-[250px] border-2 font-semibold items-center bg-white p-3 text-dark text-sm rounded-lg ${inter.className}`}>
                                    Ordenar Por
                                </button>
                                <div className="relative me-10">
                                    <img src="/icon_connectmenu.png" alt="Buscar" className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Funcionário"
                                        // value={searchTerm}
                                        // onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border-2 font-semibold rounded-lg pl-10 p-2.5 w-full outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Card Aqui */}
                    </div>
                </div>
            </div>
        )
    }
}