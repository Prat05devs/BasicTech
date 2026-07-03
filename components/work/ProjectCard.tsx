import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Project } from '../../types';
import { TYPE_LABELS } from '../../lib/projects';

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6 }}
    className="group"
  >
    <Link to={`/work/${project.slug}`} className="block">
      <div className="relative overflow-hidden aspect-[3/2] bg-slate-100 rounded-sm shadow-sm mb-4">
        <img
          src={project.cover}
          alt={project.name}
          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 text-[10px] font-mono tracking-wider uppercase bg-white/90 text-brand-blue px-2 py-1 rounded-sm">
          {TYPE_LABELS[project.type]}
        </span>
      </div>
      <span className="text-brand-blue font-mono text-[10px] xs:text-xs tracking-wider uppercase">
        {project.vertical}
      </span>
      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight leading-tight mt-1 mb-2 group-hover:text-brand-blue transition-colors">
        {project.name}
      </h3>
      <p className="text-sm text-slate-600 font-light leading-relaxed line-clamp-2">{project.summary}</p>
    </Link>
  </motion.div>
);
