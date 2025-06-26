import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Caminho das Paróquias | Encontre Paróquias em Taubaté e Vale do Paraíba",
  description: "Encontre facilmente paróquias em Taubaté, Tremembé, Pindamonhangaba, e em todo o Vale do Paraíba. Busque e filtre igrejas católicas próximas a você para horários de missa, eventos e mais. Seu guia completo para igrejas na região.",
  icons: [{ rel: "icon", url: "https://caminhodasparoquias.netlify.app/favicon.ico" }], // Changed rel to "icon"
  openGraph: {
    title: "Caminho das Paróquias | Encontre Igrejas em Taubaté e Vale do Paraíba",
    description: "Seu guia para encontrar paróquias em Taubaté, Tremembé, Pindamonhangaba e todo o Vale do Paraíba. Horários de missa, eventos e muito mais.",
    url: "https://caminhodasparoquias.netlify.app",
    type: "website",
    images: [{
      url: "https://caminhodasparoquias.netlify.app/og.png",
      alt: "Caminho das Paróquias - Encontre igrejas e paróquias na sua região"
    }]
  },
  keywords: ["paróquias Taubaté", "igrejas Taubaté", "missas Taubaté", "paróquias Vale do Paraíba", "igrejas Vale do Paraíba", "horários de missa", "igrejas católicas", "encontrar paróquia", "Tremembé", "Pindamonhangaba", "Guaratinguetá", "Lorena"], // Added relevant keywords
  authors: [{ name: "Seu Nome/Nome da Equipe", url: "https://caminhodasparoquias.netlify.app" }],
  creator: "Seu Nome/Nome da Equipe",
  publisher: "Caminho das Paróquias",
  robots: "index, follow",
  alternates: {
    canonical: "https://caminhodasparoquias.netlify.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
