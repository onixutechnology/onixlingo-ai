"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Download, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInitiallyShown, setHasInitiallyShown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (!deferredPrompt) return;

    const token = Cookies.get("access_token");
    const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');

    if (!token || isAuthPage) {
      setShowPrompt(false);
      return;
    }

    if (!hasInitiallyShown) {
      // Mostrar por primera vez después de 2 segundos
      const timer = setTimeout(() => {
        setShowPrompt(true);
        setHasInitiallyShown(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (!showPrompt) {
      // Reaparecer cada 3 minutos (180000 ms) si está cerrado
      const timer = setTimeout(() => setShowPrompt(true), 180000);
      return () => clearTimeout(timer);
    }
  }, [deferredPrompt, pathname, showPrompt, hasInitiallyShown]);

  if (!showPrompt) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    // We can't use the prompt again
    setDeferredPrompt(null);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[100] w-[90%] max-w-[340px] bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 flex flex-row items-center gap-3 text-slate-800 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-teal-50 text-teal-600 p-2.5 rounded-xl shrink-0">
        <Download size={20} strokeWidth={2.5} />
      </div>
      <div className="flex-1 text-left">
        <h4 className="font-bold text-sm text-slate-900 tracking-tight">¡Lleva OnixLingo contigo!</h4>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Instala la app y úsala directo desde tu inicio.</p>
      </div>
      <div className="flex gap-1.5 shrink-0 items-center">
        <button 
          onClick={handleInstall}
          className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          Instalar
        </button>
        <button 
          onClick={() => setShowPrompt(false)}
          className="hover:bg-gray-100 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors active:scale-95"
          aria-label="Cerrar"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
