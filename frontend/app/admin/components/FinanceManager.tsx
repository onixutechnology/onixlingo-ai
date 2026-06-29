"use client";

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, DollarSign, TrendingUp, TrendingDown, 
  RefreshCcw, Download, Receipt, Loader2, Search, ArrowUpRight, BarChart3
} from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

interface Transaction {
  id: number;
  email: string;
  amount: number;
  currency: string;
  status: string;
  paddle_id: string;
  tier: string;
  date: string;
}

interface ChartData {
  month: string;
  revenue: number;
}

export default function FinanceManager() {
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFinances = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/admin/finances`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTotalRevenue(data.total_revenue || 0);
        setChartData(data.chart_data || []);
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Error fetching finances:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinances();
  }, []);

  const handleRefresh = () => {
    fetchFinances();
  };

  // Encontrar el valor máximo del chart para escalar las barras de CSS
  const maxRevenue = chartData.length > 0 ? Math.max(...chartData.map(d => d.revenue)) : 0;

  const filteredTransactions = transactions.filter(t => 
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.paddle_id && t.paddle_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SCI-FI STYLING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-6 md:p-8 border border-indigo-500/30 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-400/20 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-10"></div>
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <CreditCard size={28} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-shadow-sm">Finanzas y Facturas</h2>
            <p className="text-xs text-indigo-200/70 mt-1 font-mono uppercase tracking-widest">Motor de Pagos & Webhooks de Paddle</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none text-xs font-black font-mono uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            className="flex items-center gap-3 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-none text-xs font-black font-mono uppercase tracking-widest transition-all shadow-[4px_4px_0_0_rgba(16,185,129,0.4)] hover:shadow-[2px_2px_0_0_rgba(16,185,129,0.4)] hover:translate-y-0.5 hover:translate-x-0.5 active:scale-95"
          >
            <Download size={16} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 flex items-center justify-between group hover:border-emerald-200 transition-colors">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ingreso Bruto Histórico</p>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-4xl font-black text-slate-900 font-mono tracking-tighter">
                {loading ? '--' : `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
              </h3>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full group-hover:scale-110 transition-transform">
            <DollarSign size={24} />
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 flex items-center justify-between group hover:border-indigo-200 transition-colors">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Transacciones Procesadas</p>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-4xl font-black text-slate-900 font-mono tracking-tighter">
                {loading ? '--' : transactions.length}
              </h3>
            </div>
          </div>
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
            <Receipt size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 flex items-center justify-between group hover:border-amber-200 transition-colors">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Salud de Ingresos</p>
            <div className="flex items-end gap-2 mt-2">
              {loading ? (
                 <span className="text-sm font-black font-mono text-slate-400">Calculando...</span>
              ) : chartData.length > 1 && chartData[chartData.length - 1].revenue >= chartData[chartData.length - 2].revenue ? (
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 border border-emerald-100">
                  <TrendingUp size={16} /> <span className="text-xs font-black uppercase tracking-widest">En Crecimiento</span>
                </div>
              ) : chartData.length > 1 ? (
                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 border border-amber-100">
                  <TrendingDown size={16} /> <span className="text-xs font-black uppercase tracking-widest">Baja Mensual</span>
                </div>
              ) : (
                <span className="text-sm font-black font-mono text-slate-400">Insuficiente</span>
              )}
            </div>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-full group-hover:scale-110 transition-transform">
            <BarChart3 size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* CHART WIDGET */}
        <div className="xl:col-span-1 bg-white border border-slate-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-500" /> Ingresos Mensuales
            </h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Histórico de facturación</p>
          </div>
          
          <div className="flex-1 p-6 flex items-end justify-between gap-2 h-64">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <BarChart3 size={32} className="mb-2 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">Sin datos de ingresos</p>
              </div>
            ) : (
              chartData.map((data, idx) => {
                const heightPercentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 group">
                    <div className="w-full relative flex justify-center h-48 items-end">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black py-1 px-2 whitespace-nowrap z-10 pointer-events-none">
                        ${data.revenue.toLocaleString()}
                      </div>
                      {/* Bar */}
                      <div 
                        className="w-full max-w-[40px] bg-indigo-500 hover:bg-indigo-400 transition-all duration-500 rounded-t-sm"
                        style={{ height: `${Math.max(5, heightPercentage)}%` }}
                      ></div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">{data.month.split('-')[1]}/{data.month.split('-')[0].slice(2)}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="xl:col-span-2 bg-white border border-slate-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <Receipt size={16} className="text-emerald-500" /> Registro de Facturas
              </h3>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Últimas transacciones procesadas</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar email o ID..." 
                className="pl-9 pr-4 py-2 text-xs border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-500 font-medium w-full sm:w-64" 
              />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1 max-h-[500px]">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">Usuario / Email</th>
                  <th className="px-6 py-4">Monto</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Estado / ID</th>
                  <th className="px-6 py-4 text-right">Recibo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No hay transacciones registradas</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-xs">{tx.email}</p>
                        <span className="text-[9px] font-black font-mono px-1.5 py-0.5 mt-1 inline-block bg-slate-100 text-slate-500 uppercase">
                          {tx.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black font-mono text-slate-900">${tx.amount.toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-slate-400 ml-1">{tx.currency}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-700">{new Date(tx.date).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(tx.date).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1.5">
                          {tx.status === 'completed' ? (
                            <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-sm">Pagado</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase tracking-widest bg-rose-100 text-rose-700 px-2 py-0.5 rounded-sm">{tx.status}</span>
                          )}
                          <span className="text-[9px] font-mono text-slate-400 truncate max-w-[120px]" title={tx.paddle_id}>{tx.paddle_id || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 transition-colors border border-transparent hover:border-indigo-200 inline-flex items-center gap-1">
                          Factura <ArrowUpRight size={10} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
