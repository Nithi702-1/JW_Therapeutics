import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import AboutSection from "../components/AboutSection.jsx";
import ProductSection from "../components/ProductSection.jsx";
import ResearchLeadInSection from "../components/ResearchLeadInSection.jsx";
import NewsCenter from "../components/NewsCenter.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <ProductSection />
        <ResearchLeadInSection />
        <NewsCenter />
      </main>
      <Footer />
    </div>
  );
}
