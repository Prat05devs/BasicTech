import React from 'react';
import { motion } from 'framer-motion';
import { TeamMember } from '../../data/team';

export const MemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6 }}
    className="flex flex-col"
  >
    <div className="aspect-square w-full bg-slate-100 rounded-lg mb-4 overflow-hidden">
      {member.photo && <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{member.name}</h3>
    <p className="text-sm text-brand-blue font-medium mb-2">{member.role}</p>
    <p className="text-sm text-slate-600 font-light leading-relaxed mb-3">{member.bio}</p>
    {member.links && member.links.length > 0 && (
      <div className="flex flex-wrap gap-3 mt-auto">
        {member.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-slate-500 hover:text-brand-blue transition-colors">
            {l.label}
          </a>
        ))}
      </div>
    )}
  </motion.div>
);
