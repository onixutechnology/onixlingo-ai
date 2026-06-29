"use client";

import { useState, useEffect } from 'react';
import { Bell, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Cookies from 'js-cookie';

// Función auxiliar para convertir la VAPID key de base64 a un arreglo seguro para la API de suscripción
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Comprobar si el navegador soporta Service Workers y Push API
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error("Error al verificar suscripción push", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeUser = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('access_token');
      if (!token) throw new Error("No hay token de sesión");

      // 1. Obtener la llave pública VAPID del servidor
      const vapidRes = await fetch('/api/v1/push/vapid-public-key', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!vapidRes.ok) throw new Error("No se pudo obtener la VAPID key");
      const { public_key } = await vapidRes.json();

      // 2. Pedir permiso al usuario y suscribir en el navegador
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(public_key)
      });

      // 3. Extraer las llaves y el endpoint
      const subJson = subscription.toJSON();
      
      // 4. Enviar al backend para guardar
      const saveRes = await fetch('/api/v1/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: {
            p256dh: subJson.keys?.p256dh,
            auth: subJson.keys?.auth
          }
        })
      });

      if (saveRes.ok) {
        setIsSubscribed(true);
      } else {
        throw new Error("No se pudo guardar la suscripción en el servidor");
      }
    } catch (error) {
      console.error("Error suscribiendo a push", error);
      alert("No pudimos activar las notificaciones. Asegúrate de dar permisos en tu navegador.");
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeUser = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('access_token');
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Eliminar del servidor
        await fetch(`/api/v1/push/unsubscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Eliminar localmente
        await subscription.unsubscribe();
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Error al cancelar suscripción", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <Bell className="text-slate-400" size={20} />
          <span>Notificaciones Push no soportadas en este navegador o modo privado.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full shrink-0 ${isSubscribed ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
          <Bell size={24} className={isSubscribed ? 'animate-pulse' : ''} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            Notificaciones In-App 
            {isSubscribed ? (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><CheckCircle size={10} /> Activo</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"><XCircle size={10} /> Inactivo</span>
            )}
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md">
            Recibe avisos sobre nuevas lecciones, recompensas y mensajes importantes directamente en tu dispositivo sin necesidad de abrir la app.
          </p>
        </div>
      </div>

      <div>
        {isLoading ? (
          <button disabled className="px-5 py-2.5 bg-slate-100 text-slate-400 rounded-lg font-bold text-sm w-full sm:w-auto flex justify-center items-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Cargando...
          </button>
        ) : isSubscribed ? (
          <button 
            onClick={unsubscribeUser}
            className="px-5 py-2.5 border-2 border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg font-bold text-sm w-full sm:w-auto transition-colors"
          >
            Desactivar
          </button>
        ) : (
          <button 
            onClick={subscribeUser}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm w-full sm:w-auto shadow-sm transition-colors"
          >
            Activar Notificaciones
          </button>
        )}
      </div>
    </div>
  );
}
