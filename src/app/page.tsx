import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Stats } from "@/components/landing/stats";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Footer />
    </main>
  );
}
