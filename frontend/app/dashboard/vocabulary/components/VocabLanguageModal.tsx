'use client';

import { motion } from 'framer-motion';
import { X, Languages } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VocabLanguageModalProps {
  activeLanguage: string;
  setLanguage: (lang: 'en' | 'fr' | 'zh') => void;
  onClose: () => void;
}

export const VocabLanguageModal = ({
  activeLanguage,
  setLanguage,
  onClose
}: VocabLanguageModalProps) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="bg-white border border-slate-200 rounded-none p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-700 hover:text-black transition-colors p-1"
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex bg-orange-50 text-slate-700 p-2.5 mb-3 border border-slate-200">
            <Languages size={22} />
          </div>
          <h2 className="text-lg font-black text-black tracking-tight uppercase font-serif italic mb-1">
            Idioma de Vocabulario
          </h2>
          <p className="text-slate-700 text-[8px] font-black uppercase tracking-[0.2em]">
            Selecciona el diccionario ejecutivo que deseas practicar
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {[
            { id: 'en', label: 'Inglés', native: 'English', flag: '🇺🇸' },
            { id: 'fr', label: 'Francés', native: 'Français', flag: '🇫🇷' },
            { id: 'zh', label: 'Chino Mandarín', native: '中文', flag: '🇨🇳' }
          ].map((langOpt) => {
            const isCurrent = activeLanguage === langOpt.id;
            return (
              <button
                key={langOpt.id}
                onClick={() => {
                  setLanguage(langOpt.id as 'en' | 'fr' | 'zh');
                  onClose();
                  localStorage.setItem('vocab_lang_modal_seen', 'true');
                }}
                className={`
                  w-full p-4 border text-left flex items-center justify-between transition-all rounded-none bg-white hover:border-black hover:bg-orange-50/10
                  ${isCurrent ? 'border-black ring-1 ring-slate-500/20 bg-orange-50/5' : 'border-slate-200'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{langOpt.flag}</span>
                  <div>
                    <h4 className="font-black text-black text-xs uppercase tracking-wider leading-none mb-1">
                      {langOpt.label}
                    </h4>
                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none">
                      {langOpt.native}
                    </p>
                  </div>
                </div>
                {isCurrent ? (
                  <span className="bg-black text-slate-900 text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none">
                    Seleccionado
                  </span>
                ) : (
                  <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">
                    Seleccionar
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 border border-slate-200 hover:border-black hover:bg-orange-50 text-slate-700 text-[9px] font-black uppercase tracking-widest transition-all rounded-none active:scale-[0.98]"
          >
            Regresar al Dashboard
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black hover:bg-slate-700 text-slate-900 text-[9px] font-black uppercase tracking-widest transition-all rounded-none active:scale-[0.98]"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
