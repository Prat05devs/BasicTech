import React, { createContext, useContext, useState, useCallback } from 'react';

interface ContactState {
  isOpen: boolean;
  context?: string;
  open: (context?: string) => void;
  close: () => void;
}

const ContactCtx = createContext<ContactState | null>(null);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<string | undefined>(undefined);

  // Guard: existing callers use `onClick={open}`, which passes a MouseEvent.
  // Only a real string is treated as a lead-source tag.
  const open = useCallback((ctx?: string) => {
    setContext(typeof ctx === 'string' ? ctx : undefined);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    setContext(undefined);
  }, []);

  return (
    <ContactCtx.Provider value={{ isOpen, context, open, close }}>
      {children}
    </ContactCtx.Provider>
  );
};

export function useContact(): ContactState {
  const ctx = useContext(ContactCtx);
  if (!ctx) throw new Error('useContact must be used within a ContactProvider');
  return ctx;
}
