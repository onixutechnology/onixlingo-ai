import { createPortal } from 'react-dom';
import { Loader2, Send, X } from 'lucide-react';

// Re-usando el icono improvisado de MessagingCenter
const BellIcon = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

interface PushPreviewModalProps {
  isOpen: boolean;
  mounted: boolean;
  title: string;
  body: string;
  isSending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PushPreviewModal({ 
  isOpen, mounted, title, body, isSending, onClose, onConfirm 
}: PushPreviewModalProps) {
  
  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-none shadow-[8px_8px_0px_0px_rgba(203,213,225,0.6)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <BellIcon className="text-amber-500" size={24} />
            <h3 className="text-lg font-black text-slate-900">Preview: Push Notification</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-none transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 bg-slate-50 flex justify-center items-center py-12">
          {/* Simulador de teléfono / notificación nativa */}
          <div className="bg-white/90 backdrop-blur-md rounded-[20px] shadow-lg border border-slate-100 w-full max-w-[320px] overflow-hidden">
            <div className="px-4 py-3 bg-slate-900/5 border-b border-slate-900/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-bold">O</div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">OnixLingo</span>
                </div>
                <span className="text-[10px] text-slate-400">Ahora</span>
            </div>
            <div className="px-4 py-4">
              <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
              <p className="text-slate-600 text-xs line-clamp-3">{body}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
          <button 
            onClick={onClose}
            className="py-3 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm uppercase tracking-wider rounded-none transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isSending}
            className="py-3 px-4 bg-amber-500 text-white hover:bg-amber-600 font-bold text-sm uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Confirmar Envío
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
