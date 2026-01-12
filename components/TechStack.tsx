import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from './ui/Reveal';

interface TechItem {
  name: string;
  icon: string;
}

const TECH_STACK: TechItem[] = [
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'Postgre', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Mongo DB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
  { name: 'Elastic', icon: 'https://www.vectorlogo.zone/logos/elastic/elastic-icon.svg' },
  { name: 'Swift', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg' },
  { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
  { name: 'Android', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
  { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
  { name: 'SCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg' },
  { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
  { name: 'Javascript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
  { name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Nest.js', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nestjs/nestjs-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Laravel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
  { name: 'Electron.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg' },
];

export const TechStack: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="text-center mb-16">
          <Reveal width="100%">
             <h2 className="text-4xl md:text-5xl font-bold text-brand-blue mb-6">Technology Stack</h2>
             <p className="text-slate-500 text-lg max-w-2xl mx-auto mt-4">
               We work across modern, battle-tested technologies to build scalable software products.
             </p>
          </Reveal>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8 md:gap-12">
            {TECH_STACK.map((tech, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex flex-col items-center gap-4 group cursor-default"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center p-4 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-2 group-hover:border-blue-100">
                        <img 
                            src={tech.icon} 
                            alt={tech.name} 
                            className="w-full h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-brand-blue transition-colors">
                        {tech.name}
                    </span>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};