import React from 'react';
import { Hero } from '../components/Hero';
import { Philosophy } from '../components/Philosophy';
import { Services } from '../components/Services';
import { Differentiation } from '../components/Differentiation';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { Process } from '../components/Process';
import { AISection } from '../components/AISection';
import { TechStack } from '../components/TechStack';
import { Seo } from '../components/Seo';
import { useContact } from '../components/layout/ContactContext';

const Home: React.FC = () => {
  const { open } = useContact();
  return (
    <>
      <Seo
        title="Basic Tech | AI-Powered Software Development for Startups & Businesses"
        description="Basic Tech builds web apps, mobile apps, backend systems, and AI-powered products for startups and growing businesses. Elite engineers, AI-driven workflows."
        canonical="https://basictech.in/"
      />
      <Hero onStartProject={open} />
      <Philosophy />
      <Services />
      <Differentiation />
      <TestimonialsSection />
      <Process />
      <AISection />
      <TechStack />
    </>
  );
};

export default Home;
