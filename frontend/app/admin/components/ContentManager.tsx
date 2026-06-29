"use client";

import React, { useState, useEffect } from 'react';
import { Database, FileText, LayoutList, CheckCircle2, Loader2, BookOpen, Crown } from 'lucide-react';

const URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

export default function ContentManager() {
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonsList, setLessonsList] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<{lang: string, id: string} | null>(null);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      const [resStats, resBlog, resLessons] = await Promise.all([
        fetch(`${URL}/api/v1/admin/content-stats`, { headers }),
        fetch(`${URL}/api/v1/admin/blog`, { headers }),
        fetch(`${URL}/api/v1/admin/lessons-list`, { headers })
      ]);
      
      if (resStats.ok) setStats(await resStats.json());
      if (resBlog.ok) setPosts(await resBlog.json());
      if (resLessons.ok) setLessonsList(await resLessons.json());
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const loadLesson = async (lang: string, id: string) => {
    try {
      setSaveStatus(null);
      const res = await fetch(`${URL}/api/v1/admin/lessons-list/${lang}/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedLesson({ lang, id });
        setLessonContent(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveLesson = async () => {
    if (!selectedLesson) return;
    try {
      setIsSaving(true);
      setSaveStatus(null);
      // Validate JSON
      const parsed = JSON.parse(lessonContent);
      
      const res = await fetch(`${URL}/api/v1/admin/lessons-list/${selectedLesson.lang}/${selectedLesson.id}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: parsed })
      });
      
      if (res.ok) {
        setSaveStatus({ type: 'success', msg: 'Guardado exitosamente en producción.' });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus({ type: 'error', msg: 'Error al guardar.' });
      }
    } catch (err: any) {
      setSaveStatus({ type: 'error', msg: 'JSON Inválido: ' + err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-6 md:p-8 border border-indigo-500/30 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-400/20 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-10"></div>
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Database size={28} className="text-indigo-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-shadow-sm">Gestor de Contenido</h2>
            <p className="text-xs text-indigo-200/70 mt-1 font-mono uppercase tracking-widest">Base de Datos de Lecciones y Blog</p>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <BookOpen size={16} />
            <h4 className="text-[10px] uppercase font-black tracking-widest">Lecciones de Inglés</h4>
          </div>
          <p className="text-3xl font-black text-slate-800">{stats.language_lessons?.en || 0}</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <BookOpen size={16} />
            <h4 className="text-[10px] uppercase font-black tracking-widest">Lecciones de Francés</h4>
          </div>
          <p className="text-3xl font-black text-slate-800">{stats.language_lessons?.fr || 0}</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <BookOpen size={16} />
            <h4 className="text-[10px] uppercase font-black tracking-widest">Lecciones de Chino</h4>
          </div>
          <p className="text-3xl font-black text-slate-800">{stats.language_lessons?.zh || 0}</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <Crown size={16} />
            <h4 className="text-[10px] uppercase font-black tracking-widest">Lecciones Ajedrez (Pro)</h4>
          </div>
          <p className="text-3xl font-black text-indigo-900">{stats.chess_lessons || 0}</p>
        </div>
      </div>

      {/* LESSON EDITOR SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {/* Sidebar - File Explorer */}
        <div className="col-span-1 bg-slate-900 border border-slate-700 shadow-xl overflow-hidden rounded-sm flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-700 bg-slate-950">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Archivos JSON</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {lessonsList && Object.entries(lessonsList).map(([lang, files]: [string, any]) => (
              <div key={lang} className="mb-4">
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 border-b border-slate-800">
                  {lang === 'en' ? 'Inglés' : lang === 'fr' ? 'Francés' : 'Chino'}
                </div>
                {files.map((file: string) => (
                  <button
                    key={file}
                    onClick={() => loadLesson(lang, file)}
                    className={`w-full text-left px-3 py-2 text-xs font-mono truncate transition-colors ${
                      selectedLesson?.lang === lang && selectedLesson?.id === file
                        ? 'bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-500'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-l-2 border-transparent'
                    }`}
                  >
                    📄 {file}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="col-span-1 md:col-span-3 bg-[#1e1e1e] border border-slate-700 shadow-xl rounded-sm flex flex-col h-[600px] relative">
          {selectedLesson ? (
            <>
              <div className="p-4 border-b border-slate-700 bg-[#252526] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">
                    app/data/lessons/{selectedLesson.lang}/{selectedLesson.id}
                  </span>
                  {saveStatus && (
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                      saveStatus.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {saveStatus.msg}
                    </span>
                  )}
                </div>
                <button 
                  onClick={saveLesson}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Guardar en Producción
                </button>
              </div>
              <textarea
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 focus:outline-none resize-none"
                spellCheck={false}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">Selecciona un archivo JSON del panel izquierdo</p>
            </div>
          )}
        </div>
      </div>

      {/* BLOG SECTION */}
      <div className="bg-white border border-slate-200 shadow-sm mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800">
            <FileText size={20} className="text-indigo-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">Entradas del Blog</h3>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-colors">
            + Nuevo Post
          </button>
        </div>
        
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <LayoutList size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No hay entradas en el blog aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-500">
                  <th className="p-4 font-black">Título</th>
                  <th className="p-4 font-black">Slug</th>
                  <th className="p-4 font-black">Estado</th>
                  <th className="p-4 font-black">Autor</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{post.title}</td>
                    <td className="p-4 text-xs font-mono text-slate-500">{post.slug}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-black uppercase tracking-wide border ${
                        post.status === 'published' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-600">{post.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
