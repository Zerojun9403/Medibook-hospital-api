import Header from "@/components/sections/Header";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import DepartmentsSection from "@/components/sections/DepartmentsSection";
import DoctorsSection from "@/components/sections/DoctorsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <DepartmentsSection />
      <DoctorsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
