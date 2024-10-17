import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";

export default function AreaCliente() {

    return (
        <div className="flex">
            <SideBar />
            <div className="flex flex-col flex-1">
                <TopBar />
                <div className="flex-1 p-4 bg-white">
                    <h1 className="text-2xl font-bold">
                        Conteúdo Principal
                    </h1>
                    <p>
                        Este é o espaço para o conteúdo que ficará à direita da sidebar e abaixo da topbar.
                    </p>
                </div>
            </div>
        </div>
    )
}