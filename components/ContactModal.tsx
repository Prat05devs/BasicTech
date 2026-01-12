import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create email body with form data
    const emailBody = `Hello,

I'm interested in discussing a project with Basic Tech.

Contact Details:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone}

Message:
${formData.message}

Looking forward to hearing from you.
${formData.name}`;

    // Encode the email body for mailto link
    const encodedBody = encodeURIComponent(emailBody);
    const encodedSubject = encodeURIComponent('New Project Inquiry from Basic Tech Website');
    
    // Create mailto link
    const mailtoLink = `mailto:axolotlcommunications@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Reset form and close modal after a short delay
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      onClose();
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-lg bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-2xl p-8 md:p-10 overflow-hidden"
            >
                {/* Decorative background gradients for glass depth */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors text-slate-500 z-20"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10">
                    <h2 className="text-3xl font-semibold text-slate-900 mb-2">Let's Build It.</h2>
                    <p className="text-slate-500 mb-8 font-light">Tell us about your project. We'll get back to you within 24 hours.</p>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Your Name</label>
                            <input 
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className="w-full bg-white/40 border border-white/60 focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/10 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <input 
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@company.com"
                                required
                                className="w-full bg-white/40 border border-white/60 focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/10 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="phone" className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                            <input 
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 123-4567"
                                required
                                className="w-full bg-white/40 border border-white/60 focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/10 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm"
                            />
                        </div>

                         <div className="space-y-1.5">
                            <label htmlFor="message" className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">The Challenge</label>
                            <textarea 
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Briefly describe what you need help with..."
                                required
                                className="w-full bg-white/40 border border-white/60 focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/10 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm resize-none"
                            />
                        </div>

                        <button type="submit" className="w-full bg-brand-blue text-white font-medium py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group mt-2">
                            <span>Send Request</span>
                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};