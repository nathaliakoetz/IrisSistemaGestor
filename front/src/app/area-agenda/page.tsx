'use client'

import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { cairo, inter } from "@/utils/fonts";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importando o CSS padrão do react-calendar
import { useState, useEffect } from 'react';

export default function AreaAgenda() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());

    const tileClassName = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === currentDate.toDateString();

            return isSelected ? 'highlight-selected' : (isToday ? 'remove-today-highlight' : '');
        }
        return '';
    };

    const tileDisabled = ({ date }: { date: Date }) => {
        const day = date.getDay();
        return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
    };

    return (
        <div className="flex">
            <SideBar activeLink="agenda" />
            <div className="flex flex-col flex-1">
                <TopBar />
            </div>
        </div>
    )
}