import { useEffect } from 'react';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ClusterSetupSection from '@/components/landing/ClusterSetupSection';
import WaitlistSection from '@/components/landing/WaitlistSection';
import Footer from '@/components/landing/Footer';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useReveal } from '@/hooks/useReveal';

const Landing = () => {
  useSmoothScroll();
  const ref = useReveal<HTMLDivElement>();

  useEffect(() => {
    document.title = 'AutoScaleX — Kubernetes deploys without the YAML';
  }, []);

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ClusterSetupSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
