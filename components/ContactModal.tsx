import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ChevronDown, Search } from 'lucide-react';
import { COUNTRY_CODES, DEFAULT_COUNTRY, CountryCode } from '../countryCodes';
import { INQUIRY_TYPES, DEFAULT_INQUIRY_TYPE, InquiryType } from '../inquiryTypes';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    inquiryType: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [selectedInquiryType, setSelectedInquiryType] = useState<InquiryType | null>(null);
  const [isInquiryDropdownOpen, setIsInquiryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const inquiryDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine country code with phone number
    const fullPhoneNumber = selectedCountry.dialCode + formData.phone;
    
    // Create email body with form data - comprehensive format
    const inquiryTypeInfo = selectedInquiryType 
      ? `${selectedInquiryType.label}${selectedInquiryType.description ? ` (${selectedInquiryType.description})` : ''}`
      : 'Not specified';
    
    const phoneDisplay = formData.phone 
      ? `${fullPhoneNumber} (${selectedCountry.flag} ${selectedCountry.name})`
      : 'Not provided';
    
    const emailBody = `Hello Basic Tech Team,

I'm interested in discussing a project with Basic Tech.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INQUIRY INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Who is enquiring?
${inquiryTypeInfo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${formData.name}
Email: ${formData.email}
Phone: ${phoneDisplay}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Challenge:
${formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Looking forward to hearing from you.

Best regards,
${formData.name}`;

    // Encode the email body for mailto link
    const encodedBody = encodeURIComponent(emailBody);
    const encodedSubject = encodeURIComponent(`New Project Inquiry - ${selectedInquiryType ? selectedInquiryType.label : 'General Inquiry'}`);
    
    // Create mailto link
    const mailtoLink = `mailto:axolotlcommunications@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Reset form and close modal after a short delay
    setTimeout(() => {
      setFormData({ inquiryType: '', name: '', email: '', phone: '', message: '' });
      setSelectedInquiryType(null);
      setSelectedCountry(DEFAULT_COUNTRY);
      setCountrySearchQuery('');
      setIsInquiryDropdownOpen(false);
      setIsCountryDropdownOpen(false);
      onClose();
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Filter countries based on search query
  const filteredCountries = COUNTRY_CODES.filter(country => {
    const query = countrySearchQuery.toLowerCase();
    return (
      country.name.toLowerCase().includes(query) ||
      country.dialCode.includes(query) ||
      country.code.toLowerCase().includes(query)
    );
  });

  // Handle inquiry type selection
  const handleInquiryTypeSelect = (inquiryType: InquiryType) => {
    setSelectedInquiryType(inquiryType);
    setFormData({ ...formData, inquiryType: inquiryType.id });
    setIsInquiryDropdownOpen(false);
  };

  // Handle country selection
  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    setCountrySearchQuery('');
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = `-${scrollX}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Prevent scroll events on document level
      const preventScroll = (e: WheelEvent | TouchEvent) => {
        const target = e.target as HTMLElement;
        // Check if scrolling within modal or dropdown
        const isInModal = target.closest('[data-modal-content]');
        const isInDropdown = inquiryDropdownRef.current?.contains(target) || countryDropdownRef.current?.contains(target);
        
        // Only prevent if not inside scrollable modal/dropdown areas
        if (!isInModal && !isInDropdown) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };
      
      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement;
        const modalContent = target.closest('[data-modal-content]');
        const isInDropdown = inquiryDropdownRef.current?.contains(target) || countryDropdownRef.current?.contains(target);
        
        // Allow scrolling within modal content or dropdowns
        if (modalContent || isInDropdown) {
          return;
        }
        
        // Prevent all other scrolling
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      const handleTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const modalContent = target.closest('[data-modal-content]');
        const isInDropdown = inquiryDropdownRef.current?.contains(target) || countryDropdownRef.current?.contains(target);
        
        // Allow scrolling within modal content or dropdowns
        if (modalContent || isInDropdown) {
          return;
        }
        
        // Prevent all other scrolling
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // Add event listeners with passive: false to allow preventDefault
      document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
      document.addEventListener('scroll', preventScroll as EventListener, { passive: false, capture: true });
      
      return () => {
        // Remove event listeners
        document.removeEventListener('wheel', handleWheel, { capture: true });
        document.removeEventListener('touchmove', handleTouchMove, { capture: true });
        document.removeEventListener('scroll', preventScroll as EventListener, { capture: true });
        
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(scrollX, scrollY);
      };
    }
  }, [isOpen]);

  // Prevent body scroll when dropdowns are open (additional protection)
  useEffect(() => {
    const hasOpenDropdown = isInquiryDropdownOpen || isCountryDropdownOpen;
    
    if (hasOpenDropdown) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Prevent scroll on wheel events (desktop)
      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement;
        const isInsideInquiryDropdown = inquiryDropdownRef.current?.contains(target);
        const isInsideCountryDropdown = countryDropdownRef.current?.contains(target);
        
        // Allow scrolling within dropdown containers
        if (isInsideInquiryDropdown || isInsideCountryDropdown) {
          // Check if the dropdown container can scroll
          const dropdownContainer = target.closest('[class*="overflow-y-auto"]') as HTMLElement;
          if (dropdownContainer) {
            const { scrollTop, scrollHeight, clientHeight } = dropdownContainer;
            const isAtTop = scrollTop === 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
            
            // Prevent scroll if at top and scrolling up, or at bottom and scrolling down
            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
              e.preventDefault();
              e.stopPropagation();
            }
            // Otherwise allow the dropdown to scroll
            return;
          }
        }
        
        // Prevent body scroll for all other cases
        e.preventDefault();
        e.stopPropagation();
      };
      
      // Prevent scroll on touch events (mobile)
      const handleTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const isInsideInquiryDropdown = inquiryDropdownRef.current?.contains(target);
        const isInsideCountryDropdown = countryDropdownRef.current?.contains(target);
        
        // Only prevent if not inside dropdown containers
        if (!isInsideInquiryDropdown && !isInsideCountryDropdown) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
        
        document.removeEventListener('wheel', handleWheel);
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isInquiryDropdownOpen, isCountryDropdownOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close inquiry dropdown
      if (inquiryDropdownRef.current && !inquiryDropdownRef.current.contains(event.target as Node)) {
        setIsInquiryDropdownOpen(false);
      }
      
      // Close country dropdown
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
        setCountrySearchQuery('');
      }
    };

    if (isInquiryDropdownOpen || isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      
      // Focus search input when country dropdown opens
      if (isCountryDropdownOpen) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInquiryDropdownOpen, isCountryDropdownOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center p-3 xs:p-4 sm:p-5 md:p-6 overflow-y-auto overscroll-contain"
            >
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-full sm:max-w-lg bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden my-auto max-h-[calc(100vh-2rem)] xs:max-h-[calc(100vh-2.5rem)] sm:max-h-[calc(100vh-3rem)] md:max-h-[calc(100vh-4rem)] flex flex-col"
            >
                {/* Decorative background gradients for glass depth */}
                <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-48 h-48 sm:w-64 sm:h-64 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
                <div className="absolute -bottom-16 -left-16 sm:-bottom-24 sm:-left-24 w-48 h-48 sm:w-64 sm:h-64 bg-blue-300/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 xs:top-4 xs:right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 p-1.5 xs:p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors text-slate-500 z-20 touch-manipulation"
                    aria-label="Close modal"
                >
                    <X size={18} className="xs:w-5 xs:h-5" />
                </button>

                {/* Scrollable Content Area */}
                <div 
                  data-modal-content
                  className="relative z-10 flex-1 overflow-y-auto overscroll-contain modal-scroll-container"
                  onWheel={(e) => {
                    // Allow scrolling within modal content, prevent propagation to body
                    e.stopPropagation();
                  }}
                  onTouchMove={(e) => {
                    // Allow scrolling within modal content, prevent propagation to body
                    e.stopPropagation();
                  }}
                >
                    <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10">
                        <h2 className="text-2xl xs:text-2xl sm:text-3xl md:text-3xl font-semibold text-slate-900 mb-1.5 xs:mb-2 pr-8 sm:pr-10">Let's Build It.</h2>
                        <p className="text-sm xs:text-base sm:text-base text-slate-500 mb-5 xs:mb-6 sm:mb-7 md:mb-8 font-light leading-relaxed">Tell us about your project. We'll get back to you within 24 hours.</p>

                        <form className="space-y-3.5 xs:space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                        {/* Inquiry Type Dropdown */}
                        <div className="space-y-1 xs:space-y-1.5">
                            <label htmlFor="inquiryType" className="text-[10px] xs:text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 block">Who is enquiring?</label>
                            <div className="relative" ref={inquiryDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsInquiryDropdownOpen(!isInquiryDropdownOpen)}
                                    className={`w-full flex items-center justify-between gap-2 xs:gap-3 bg-white/40 border ${
                                        selectedInquiryType 
                                            ? 'border-brand-blue/50' 
                                            : 'border-white/60'
                                    } focus:border-brand-blue/50 focus:ring-2 xs:focus:ring-4 focus:ring-brand-blue/10 rounded-lg xs:rounded-xl px-3 xs:px-4 py-2.5 xs:py-3 min-h-[44px] outline-none transition-all shadow-sm hover:bg-white/50 active:bg-white/60 touch-manipulation text-left`}
                                >
                                    <div className="flex items-center flex-1 min-w-0">
                                        {selectedInquiryType ? (
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs xs:text-sm font-medium text-slate-900 block truncate">{selectedInquiryType.label}</span>
                                                {selectedInquiryType.description && (
                                                    <span className="text-[10px] xs:text-xs text-slate-500 block truncate hidden xs:block">{selectedInquiryType.description}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs xs:text-sm text-slate-400">Select inquiry type...</span>
                                        )}
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 xs:w-4 xs:h-4 text-slate-500 transition-transform flex-shrink-0 ${isInquiryDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {isInquiryDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-1.5 xs:mt-2 w-full bg-white/95 backdrop-blur-xl border border-white/60 rounded-lg xs:rounded-xl shadow-2xl z-50 max-h-[min(320px,calc(100vh-280px))] xs:max-h-[min(320px,calc(100vh-320px))] overflow-hidden"
                                        >
                                            <div 
                                                className="overflow-y-auto overscroll-contain max-h-[min(320px,calc(100vh-280px))] xs:max-h-[min(320px,calc(100vh-320px))]"
                                                onWheel={(e) => {
                                                    // Prevent event from bubbling to body
                                                    e.stopPropagation();
                                                }}
                                                onTouchMove={(e) => {
                                                    // Prevent event from bubbling to body
                                                    e.stopPropagation();
                                                }}
                                            >
                                                {INQUIRY_TYPES.map((inquiryType) => (
                                                    <button
                                                        key={inquiryType.id}
                                                        type="button"
                                                        onClick={() => handleInquiryTypeSelect(inquiryType)}
                                                        className={`w-full flex items-center px-3 xs:px-4 py-2.5 xs:py-3 min-h-[44px] hover:bg-brand-blue/5 active:bg-brand-blue/10 transition-colors text-left touch-manipulation ${
                                                            selectedInquiryType?.id === inquiryType.id ? 'bg-brand-blue/10' : ''
                                                        }`}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-xs xs:text-sm font-medium text-slate-900 block">{inquiryType.label}</span>
                                                            {inquiryType.description && (
                                                                <span className="text-[10px] xs:text-xs text-slate-500 block mt-0.5">{inquiryType.description}</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="space-y-1 xs:space-y-1.5">
                            <label htmlFor="name" className="text-[10px] xs:text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 block">Your Name</label>
                            <input 
                                type="text" 
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className="w-full bg-white/40 border border-white/60 focus:border-brand-blue/50 focus:ring-2 xs:focus:ring-4 focus:ring-brand-blue/10 rounded-lg xs:rounded-xl px-3 xs:px-4 py-2.5 xs:py-3 min-h-[44px] outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm text-sm xs:text-base"
                            />
                        </div>

                        <div className="space-y-1 xs:space-y-1.5">
                            <label htmlFor="email" className="text-[10px] xs:text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 block">Email Address</label>
                            <input 
                                type="email" 
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@company.com"
                                required
                                className="w-full bg-white/40 border border-white/60 focus:border-brand-blue/50 focus:ring-2 xs:focus:ring-4 focus:ring-brand-blue/10 rounded-lg xs:rounded-xl px-3 xs:px-4 py-2.5 xs:py-3 min-h-[44px] outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm text-sm xs:text-base"
                            />
                        </div>

                        <div className="space-y-1 xs:space-y-1.5">
                            <label htmlFor="phone" className="text-[10px] xs:text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 block">Phone Number</label>
                            <div className="flex gap-1.5 xs:gap-2">
                                {/* Country Code Selector */}
                                <div className="relative flex-shrink-0" ref={countryDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                        className="flex items-center justify-center xs:justify-start gap-1.5 xs:gap-2 bg-white/40 border border-white/60 focus:border-brand-blue/50 focus:ring-2 xs:focus:ring-4 focus:ring-brand-blue/10 rounded-lg xs:rounded-xl px-2.5 xs:px-3 py-2.5 xs:py-3 min-h-[44px] outline-none transition-all shadow-sm hover:bg-white/50 active:bg-white/60 min-w-[60px] xs:min-w-[80px] sm:min-w-[100px] touch-manipulation"
                                    >
                                        <span className="text-base xs:text-lg flex-shrink-0">{selectedCountry.flag}</span>
                                        <span className="text-xs xs:text-sm font-medium text-slate-900 hidden xs:inline">{selectedCountry.dialCode}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 xs:w-4 xs:h-4 text-slate-500 transition-transform flex-shrink-0 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isCountryDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 mt-1.5 xs:mt-2 w-[calc(100vw-2rem)] xs:w-[280px] sm:w-[320px] bg-white/95 backdrop-blur-xl border border-white/60 rounded-lg xs:rounded-xl shadow-2xl z-50 max-h-[min(300px,calc(100vh-280px))] xs:max-h-[min(300px,calc(100vh-320px))] overflow-hidden flex flex-col"
                                            >
                                                {/* Search Input */}
                                                <div className="p-2.5 xs:p-3 border-b border-slate-200 sticky top-0 bg-white/95 z-10">
                                                    <div className="relative">
                                                        <Search className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 xs:w-4 xs:h-4 text-slate-400" />
                                                        <input
                                                            ref={searchInputRef}
                                                            type="text"
                                                            value={countrySearchQuery}
                                                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                                                            placeholder="Search country or code"
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-8 xs:px-10 py-2 text-xs xs:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/50 min-h-[44px]"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Country List */}
                                                <div 
                                                    className="overflow-y-auto overscroll-contain max-h-[min(240px,calc(100vh-360px))] xs:max-h-[min(240px,calc(100vh-380px))]"
                                                    onWheel={(e) => {
                                                        // Prevent event from bubbling to body
                                                        e.stopPropagation();
                                                    }}
                                                    onTouchMove={(e) => {
                                                        // Prevent event from bubbling to body
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    {filteredCountries.length > 0 ? (
                                                        filteredCountries.map((country) => (
                                                            <button
                                                                key={country.code}
                                                                type="button"
                                                                onClick={() => handleCountrySelect(country)}
                                                                className={`w-full flex items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2 xs:py-2.5 min-h-[44px] hover:bg-brand-blue/5 active:bg-brand-blue/10 transition-colors text-left touch-manipulation ${
                                                                    selectedCountry.code === country.code ? 'bg-brand-blue/10' : ''
                                                                }`}
                                                            >
                                                                <span className="text-lg xs:text-xl flex-shrink-0">{country.flag}</span>
                                                                <span className="text-xs xs:text-sm font-medium text-slate-900 flex-shrink-0 w-12 xs:w-16">{country.dialCode}</span>
                                                                <span className="text-xs xs:text-sm text-slate-600 truncate">{country.name}</span>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-6 text-center text-sm text-slate-500">
                                                            No countries found
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                {/* Phone Number Input */}
                                <input 
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                    className="flex-1 min-w-0 bg-white/40 border border-white/60 focus:border-brand-blue/50 focus:ring-2 xs:focus:ring-4 focus:ring-brand-blue/10 rounded-lg xs:rounded-xl px-3 xs:px-4 py-2.5 xs:py-3 min-h-[44px] outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm text-sm xs:text-base"
                                />
                            </div>
                            <p className="text-[10px] xs:text-xs text-slate-400 ml-1 mt-0.5 line-clamp-1">Selected: {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode})</p>
                        </div>

                         <div className="space-y-1 xs:space-y-1.5">
                            <label htmlFor="message" className="text-[10px] xs:text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 block">The Challenge</label>
                            <textarea 
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Briefly describe what you need help with..."
                                required
                                className="w-full bg-white/40 border border-white/60 focus:border-brand-blue/50 focus:ring-2 xs:focus:ring-4 focus:ring-brand-blue/10 rounded-lg xs:rounded-xl px-3 xs:px-4 py-2.5 xs:py-3 min-h-[100px] xs:min-h-[120px] outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm resize-none text-sm xs:text-base leading-relaxed"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-brand-blue text-white font-medium py-3 xs:py-3.5 sm:py-4 rounded-lg xs:rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:shadow-blue-500/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group mt-1 xs:mt-2 min-h-[44px] touch-manipulation"
                        >
                            <span className="text-sm xs:text-base">Send Request</span>
                            <Send size={16} className="xs:w-[18px] xs:h-[18px] group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </form>
                    </div>
                </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};