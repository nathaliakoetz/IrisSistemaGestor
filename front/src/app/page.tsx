import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { cairo, inter } from "@/utils/fonts";

export default function Home() {
  return (
    <section>
      <Header activeLink="inicio" />
      <div className="max-w-screen-xl mx-auto mt-28 grid grid-cols-2">
        <div className="flex flex-col justify-center">
          <div className="flex flex-row w-full items-center">
            <img src="./logo.png" alt="Icone do Sistema Íris" className="w-2/4" />
            <h1 className={`text-9xl ml-4 text-color-logo dark:text-color-logo ${cairo.className}`}>
              ÍRIS
            </h1>
          </div>
          <p className={`text-3xl mt-2 text-header-selected dark:text-header-selected ${cairo.className}`}>
            &nbsp;&nbsp;
            S&nbsp;&nbsp;
            I&nbsp;&nbsp;
            S&nbsp;&nbsp;
            T&nbsp;&nbsp;
            E&nbsp;&nbsp;
            M&nbsp;&nbsp;
            A&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            G&nbsp;&nbsp;
            E&nbsp;&nbsp;
            S&nbsp;&nbsp;
            T&nbsp;&nbsp;
            O&nbsp;&nbsp;
            R&nbsp;&nbsp;
          </p>
        </div>
        <div className="flex justify-center items-center">
          <img src="./Image_hero.png" alt="Imagem ilutrando mãos segurando um quebra cabeça" className="object-contain" />
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto mt-28 grid grid-cols-2 mb-36">
        <div className="flex flex-col justify-center">
          <div className="flex flex-row w-full items-center">
            <p className={`text-5xl text-color-logo ${inter.className}`}>
              POR QUE ESCOLHER O&nbsp;
              <span className={`text-5xl font-bold text-color-logo ${inter.className}`}>
                SISTEMA GESTOR?
              </span>
            </p>
          </div>
          <div className="flex flex-row w-full mt-8 items-center">
            <span className={`text-2xl font-bold text-color-logo ${inter.className}`}>
              Mundo das Emoções: &nbsp;
              <span className={`text-2xl font-normal text-color-logo ${inter.className}`}>
                Espaço onde a imaginação e o aprendizado se encontram, ajudando as crianças anavegar em suas emoções com confiança e alegria!
              </span>
            </span>
          </div>
          <div className="flex flex-row w-full mt-8 items-center">
            <img src="./icon_check.png" alt="Icone de Check" className="w-10 me-4" />
            <span className={`text-2xl text-header-selected ${inter.className}`}>
              Facilidade de Uso
            </span>
          </div>
          <div className="flex flex-row w-full mt-6 items-center">
            <img src="./icon_check.png" alt="Icone de Check" className="w-10 me-4" />
            <span className={`text-2xl text-header-selected ${inter.className}`}>
              Acesso Rápido
            </span>
          </div>
          <div className="flex flex-row w-full mt-6 items-center">
            <img src="./icon_check.png" alt="Icone de Check" className="w-10 me-4" />
            <span className={`text-2xl text-header-selected ${inter.className}`}>
              Segurança de Dados
            </span>
          </div>
          <div className="flex flex-row w-full mt-6 items-center">
            <img src="./icon_check.png" alt="Icone de Check" className="w-10 me-4" />
            <span className={`text-2xl text-header-selected ${inter.className}`}>
              Suporte ao Usuário
            </span>
          </div>
          <div className="flex flex-row w-full mt-6 items-center">
            <img src="./icon_check.png" alt="Icone de Check" className="w-10 me-4" />
            <span className={`text-2xl text-header-selected ${inter.className}`}>
              Ferramenta de Gestão
            </span>
          </div>
          <div className="flex flex-row w-full mt-6 items-center">
            <img src="./icon_check.png" alt="Icone de Check" className="w-10 me-4" />
            <span className={`text-2xl text-header-selected ${inter.className}`}>
              Organização de Recursos Humanos
            </span>
          </div>
          <div className="flex flex-row w-full mt-6 items-center">
            <img src="./icon_check.png" alt="Icone de Check" className="w-10 me-4" />
            <span className={`text-2xl text-header-selected ${inter.className}`}>
              Geração de Relatórios
            </span>
          </div>
          <div className="flex flex-row w-full mt-6 items-center">
            <img src="./icon_check.png" alt="Icone de Check" className="w-10 me-4" />
            <span className={`text-2xl text-header-selected ${inter.className}`}>
              Aprendizado Interativo
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-row w-full h-52 mb-10 border-connect bg-white rounded-3xl overflow-hidden">
            <div className="w-1/10 bg-connect flex items-center justify-center">
              <img src="./icon_connect.png" alt="teste" width={60} height={60} className="object-cover mx-3" />
            </div>
            <div className="w-11/12 bg-white">
              <h1 className={`text font-bold text-4xl mt-4 ms-3 ${inter.className}`}>
                CONNECT
              </h1>
              <p className={`text font-normal text-xl mt-3 ms-3`}>
                Mostre seu talento para o mercado! Demonstre suas habilidades e experiências profissionais através do seu currículo. As clínicas buscam profissionais qualificados e experientes para compor suas equipes.
              </p>
            </div>
          </div>
          <div className="flex flex-row w-full h-52 mb-10 border-connect bg-white rounded-3xl overflow-hidden">
            <div className="w-1/10 bg-gestao flex items-center justify-center">
              <img src="./icon_gestao.png" alt="teste" width={60} height={60} className="object-cover mx-3" />
            </div>
            <div className="w-11/12 bg-white">
              <h1 className={`text font-bold text-4xl mt-4 ms-3 ${inter.className}`}>
                GESTÃO
              </h1>
              <p className={`text font-normal text-xl mt-3 ms-3`}>
                Sua clínica, mais organizada. Com o sistema Íris, gerencie seus pacientes, funcionários e agende consultas de forma simples e intuitiva. Tenha mais tempo para cuidar do que realmente importa: a saúde dos seus pacientes.
              </p>
            </div>
          </div>
          <div className="flex flex-row w-full h-52 mb-10 border-connect bg-white rounded-3xl overflow-hidden">
            <div className="w-1/10 bg-pacotes flex items-center justify-center">
              <img src="./icon_pacotes.png" alt="teste" width={60} height={60} className="object-cover mx-3" />
            </div>
            <div className="w-11/12 bg-white">
              <h1 className={`text font-bold text-4xl mt-4 ms-3 ${inter.className}`}>
                PACOTES
              </h1>
              <p className={`text font-normal text-xl mt-3 ms-3`}>
                Investir no futuro é investir em Íris. Ofereça o melhor ambiente de aprendizado e desenvolvimento, e aos responsáveis um acompanhamento completo. Adquira agora o sistema Íris e transforme a sua clínica
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section >
  );
}