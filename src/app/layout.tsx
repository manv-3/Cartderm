import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA Beauty • Powered by CartDerm Skin AI",
  description: "Next-generation beauty e-commerce protected by CartDerm Agentic Barrier Guardian & YouCam AI Skin Analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-rose-100 selection:text-rose-900">
        {children}
      </body>
    </html>
  );
}
