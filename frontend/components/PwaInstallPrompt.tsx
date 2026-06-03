"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Download, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
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
    // Only show if we have the install event available
    if (!deferredPrompt) return;

    const token = Cookies.get("access_token");
    const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');

    // Show after login (when token exists and not on auth pages)
    if (token && !isAuthPage) {
      // Small delay for a better user experience after page load
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowPrompt(false);
    }
  }, [deferredPrompt, pathname]);

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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] w-[90%] max-w-md bg-slate-900 border border-teal-500/50 rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-white animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-teal-500/20 p-3 rounded-full text-teal-400 shrink-0">
        <Download size={24} />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h4 className="font-bold text-sm sm:text-base text-teal-50">¡Lleva OnixLingo contigo!</h4>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">Instala nuestra aplicación y vive la experiencia profesional desde tu escritorio o móvil.</p>
      </div>
      <div className="flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
        <button 
          onClick={handleInstall}
          className="flex-1 sm:flex-none bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-teal-500/20 active:scale-95"
        >
          Instalar
        </button>
        <button 
          onClick={() => setShowPrompt(false)}
          className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg text-slate-400 transition-colors active:scale-95"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
