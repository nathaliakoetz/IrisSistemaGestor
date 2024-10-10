'use client'

import { useEffect } from "react";
import ParaClinica from "../para-clinica/page";

export default function ParaVoce() {

    useEffect(() => {
        const element = document.getElementById('pacotes-connect');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <ParaClinica activeLink="voce"/>
    )
}