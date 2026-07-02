import apiClient from '@/lib/apiClient';

interface DashboardCache {
  mapRes: any;
  statsRes: any;
  userRes: any;
  leadRes: any;
  timestamp: number;
}

let globalCache: DashboardCache | null = null;
let activePromise: Promise<DashboardCache> | null = null;

const CACHE_DURATION_MS = 1000 * 60 * 5; // 5 minutos de cache

export const fetchDashboardDataCached = async (force = false): Promise<DashboardCache> => {
  const now = Date.now();
  if (!force && globalCache && (now - globalCache.timestamp < CACHE_DURATION_MS)) {
    return globalCache;
  }
  
  if (activePromise && !force) {
    return activePromise;
  }

  activePromise = Promise.allSettled([
    apiClient.get('/progress/map'),
    apiClient.get('/progress/stats'),
    apiClient.get('/users/me'),
    apiClient.get('/progress/leaderboard')
  ]).then((results) => {
    const [mapRes, statsRes, userRes, leadRes] = results.map(r => r.status === 'fulfilled' ? r.value : null);
    
    globalCache = {
      mapRes: mapRes?.data,
      statsRes: statsRes?.data,
      userRes: userRes?.data,
      leadRes: leadRes?.data,
      timestamp: Date.now()
    };
    activePromise = null;
    return globalCache;
  }).catch((e) => {
    activePromise = null;
    throw e;
  });

  return activePromise;
};

export const clearDashboardCache = () => {
  globalCache = null;
};
