
import React, { useState } from 'react';
import { Sparkles, X, Plus, Loader2, Check, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapItem, RoadmapStatus, Priority } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface AISuggestionModalProps {
  onClose: () => void;
  onAddItems: (items: RoadmapItem[]) => void;
}

const AISuggestionModal: React.FC<AISuggestionModalProps> = ({ onClose, onAddItems }) => {
  const { t, language } = useTranslation();
  const [productDesc, setProductDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const generateSuggestions = async () => {
    if (!productDesc.trim()) return;
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: (import.meta as any).env?.VITE_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: `I am building a product: ${productDesc}. Generate 5 strategic roadmap items to include in the backlog. Provide output in JSON format. Generate the content in ${language === 'pt' ? 'Portuguese' : language === 'es' ? 'Spanish' : 'English'}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                priority: { type: Type.STRING, description: 'High, Medium, or Low' },
                effort: { type: Type.NUMBER, description: '1 to 5' },
                value: { type: Type.NUMBER, description: '1 to 5' },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['title', 'description', 'priority', 'effort', 'value', 'tags']
            }
          }
        }
      });

      const data = JSON.parse(response.text || '[]');
      setSuggestions(data);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSelected = () => {
    const itemsToAdd: RoadmapItem[] = suggestions
      .filter((_, idx) => selectedIds.has(idx))
      .map(s => ({
        id: Math.random().toString(36).substring(2, 9),
        title: s.title,
        description: s.description,
        status: RoadmapStatus.BACKLOG,
        priority: s.priority as Priority,
        quarter: 'Q1 2024',
        effort: s.effort,
        value: s.value,
        tags: s.tags,
        createdAt: Date.now(),
        teamId: '',
        productId: '',
        dependencies: [],
        subFeatures: [],
        startMonth: 0,
        spanMonths: 1
      }));

    onAddItems(itemsToAdd);
  };

  const toggleSelection = (idx: number) => {
    const next = new Set(selectedIds);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedIds(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500 ring-1 ring-slate-200/50">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-display font-black tracking-tight">{t('aiAssistant')}</h2>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/20 rounded-full transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {suggestions.length === 0 ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 bg-indigo-50/50 border border-indigo-100/50 rounded-[2.5rem] text-indigo-700">
                <p className="flex items-start gap-4 font-medium text-lg">
                  <AlertCircle className="h-6 w-6 mt-1 flex-shrink-0 text-indigo-500" />
                  {t('aiDescription')}
                </p>
              </div>
              <textarea
                className="w-full px-8 py-6 border border-slate-200 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all resize-none text-lg font-medium shadow-sm min-h-[160px]"
                value={productDesc}
                onChange={e => setProductDesc(e.target.value)}
                placeholder={t('aiPlaceholder')}
              />
              <button
                disabled={loading || !productDesc.trim()}
                onClick={generateSuggestions}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-[2rem] hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-4 transition-all shadow-xl shadow-indigo-100 active:scale-95 text-xl tracking-tight"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                {loading ? t('aiAnalyzing') : t('aiGenerate')}
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{t('aiProposed')}</h3>
              </div>
              <div className="grid gap-6">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleSelection(idx)}
                    className={`p-8 border-2 rounded-[2.5rem] cursor-pointer transition-all ${selectedIds.has(idx)
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100/50 scale-[1.02]'
                      : 'border-slate-100 hover:border-indigo-200 bg-white hover:shadow-md'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">{s.title}</h4>
                      {selectedIds.has(idx) && (
                        <div className="bg-indigo-600 text-white p-1.5 rounded-full shadow-lg shadow-indigo-200 animate-in zoom-in">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <p className="text-slate-600 mb-6 font-medium leading-relaxed">{s.description}</p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-black uppercase tracking-widest">
                        {t('value')}: <span className="text-emerald-500 text-sm">{s.value}/5</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-black uppercase tracking-widest">
                        {t('effort')}: <span className="text-amber-500 text-sm">{s.effort}/5</span>
                      </div>
                      <div className="ml-auto flex gap-2">
                        {s.tags.slice(0, 2).map((t: string) => (
                          <span key={t} className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-wider">#{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-100 flex gap-6">
                <button
                  onClick={() => setSuggestions([])}
                  className="px-8 py-4 text-sm font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                >
                  {t('aiTryAgain')}
                </button>
                <button
                  disabled={selectedIds.size === 0}
                  onClick={handleAddSelected}
                  className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 transition-all active:scale-95 text-lg"
                >
                  {t('aiAddSelected')} ({selectedIds.size})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISuggestionModal;
