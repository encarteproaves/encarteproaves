import Footer from "./components/Footer";

export const metadata = {
  title: "Encarteproaves",
  description: "Tecnologia e Qualidade Para o Melhor Encarte de Canto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        
        {/* CONTEÚDO DO SITE */}
        <div style={{ minHeight: "80vh", position: "relative", zIndex: 1 }}>
  {children}
</div>

        {/* RODAPÉ */}
        <Footer />

      </body>
    </html>
  );
}
