import { Header } from "@/components/Header";
import { inter } from "@/utils/fonts";

export default function Sobre() {
    return (
        <section>
            <div className="bg-[url('/bg_sobre.jpg')] bg-cover bg-no-repeat bg-bottom h-auto">
                <Header activeLink="sobre"/>
                <div className="max-w-screen-xl mx-auto pt-24 pb-32">
                    <h1 className={`text-5xl text-color-logo dark:text-color-logo font-bold mb-5 text-center ${inter.className}`}>
                        SOBRE&nbsp;&nbsp;ÍRIS
                    </h1>
                    <p className={`text-4xl font-extralight text-color-logo dark:text-color-logo text-center ${inter.className}`}>
                        Um olhar único para o cuidado Emocional
                    </p>
                </div>
            </div>
            <div className="bg-sobre mt-24">
                <div className="max-w-screen-xl mx-auto grid grid-cols-2">
                    <div className="flex justify-start items-start">
                        <img src="fotosobre.png" alt="Foto Sobre Íris" className="ms-52 my-10 h-64" />
                    </div>
                    <div className="flex flex-col justify-center items-start">
                        <h1 className={`text-4xl font-bold ${inter.className}`}>
                            Íris
                        </h1>
                        <p className={`text-md mt-3 font-normal ${inter.className}`}>
                            É um sistema gestor criado para oferecer suporte ao tratamento de crianças autistas não verbais. Ele proporciona uma plataforma completa para que clínicas especializadas possam organizar de forma eficiente pacientes, funcionários, agendas e acompanhar o progresso das crianças por meio de relatórios detalhados.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex my-10 justify-center items-center">
                <h1 className="text-2xl color-puzzle-1">
                    -&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;
                </h1>
                <img src="/icon_puzzle.png" alt="Imagem de uma peça de quebra cabeça" className="ms-8 me-10 h-10" />
                <h1 className="text-2xl color-puzzle-1">
                    -&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;
                </h1>
            </div>
            <div className="bg-sobre">
                <div className="max-w-screen-xl mx-auto grid grid-cols-2">
                    <div className="flex flex-col justify-center items-start">
                        <h1 className={`text-4xl font-bold ${inter.className}`}>
                            Connect
                        </h1>
                        <p className={`text-md mt-3 font-normal ${inter.className}`}>
                            Uma área exclusiva dentro do sistema Íris, criada para facilitar a conexão entre clínicas especializadas e profissionais qualificados. Funcionando como um ponto de encontro digital, a Connect permite que as clínicas encontrem e avaliem profissionais que buscam oportunidades de trabalho no campo do tratamento de crianças autistas.                        </p>
                    </div>
                    <div className="flex justify-start items-start">
                        <img src="connect.png" alt="Foto Sobre Íris" className="ms-52 my-10 h-64" />
                    </div>
                </div>
            </div>
            <div className="flex my-10 justify-center items-center">
                <h1 className="text-2xl color-puzzle-2">
                    -&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;
                </h1>
                <img src="/icon_puzzle.png" alt="Imagem de uma peça de quebra cabeça" className="ms-8 me-10 h-10" />
                <h1 className="text-2xl color-puzzle-2">
                    -&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;-&nbsp;
                </h1>
            </div>
            <div className="bg-sobre mb-24">
                <div className="max-w-screen-xl mx-auto grid grid-cols-2">
                    <div className="flex justify-start items-start">
                        <img src="globo.png" alt="Foto Sobre Íris" className="ms-52 my-10 h-64" />
                    </div>
                    <div className="flex flex-col justify-center items-start">
                        <h1 className={`text-4xl font-bold ${inter.className}`}>
                            Mundo das Emoções
                        </h1>
                        <p className={`text-md mt-3 font-normal ${inter.className}`}>
                            O Mundo das Emoções é o coração do sistema Íris, criado para ajudar crianças autistas não verbais a se conectarem com suas emoções de forma lúdica e interativa. Esse espaço foi desenvolvido para fornecer um ambiente acolhedor onde as crianças podem explorar suas emoções por meio de atividades divertidas e intuitivas, respeitando o ritmo de cada uma.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}