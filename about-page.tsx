import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AboutSection } from "@/components/about/about-section";
import { TeamSection } from "@/components/about/team-section";
import { CTASection } from "@/components/home/cta-section";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <AboutSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
