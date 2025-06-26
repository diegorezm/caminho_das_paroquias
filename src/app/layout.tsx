import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Caminho das paroquias",
  description: "Encontre a paroquia mais perto de você!",
  icons: [{ rel: "image/ico", url: "https://caminhodasparoquias.netlify.app/favicon.ico" }],
  openGraph: {
    images: ["https://caminhodasparoquias.netlify.app/og.png"]
  }
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
