import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "Íris - Sistema Gestor",
  description: "Sistema de Gestão para Clínicas focadas no atendimento de crianças altistas não verbais.",
  keywords: ["altismo", "altista", "criança", "criança altista", "criança com altismo", "clinica", "clinica para altistas", "clinica para crianças"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
      <Toaster position="top-right" richColors />
    </html>
  );
}
