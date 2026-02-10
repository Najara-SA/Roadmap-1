
import React, { useState } from 'react';
import { Sparkles, X, Plus, Loader2, Check, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapItem, RoadmapStatus, Priority } from '../types';

interface AISuggestionModalProps {
  onClose: () => void;
  onAddItems: (items: RoadmapItem[]) => void;
}

const AISuggestionModal: React.FC<AISuggestionModalProps> = ({ onClose, onAddItems }) => {
  const [productDesc, setProductDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const generateSuggestions = async () => {
    if (!productDesc.trim()) return;
    setLoading(true);

    try {
      // Fix: Create instance here to use latest API key as per guidelines
      const ai = new GoogleGenAI({ apiKey: (import.meta as any).env?.VITE_GEMINI_API_KEY });
      // Fix: Upgrade to gemini-3-pro-preview for complex strategic reasoning tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `I am building a product: ${productDesc}. Generate 5 strategic roadmap items to include in the backlog. Provide output in JSON format.`,
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

      // Fix: Safely parse response text and provide fallback
      const data = JSON.parse(response.text || '[]');
      setSuggestions(data);
    } catch (error) {
      console.error("AI Generation failed", error);
      alert("Something went wrong with the AI generator. Please try again.");
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
        // Fix: Add missing required RoadmapItem properties
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-bold">AI Strategic Assistant</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {suggestions.length === 0 ? (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 text-sm">
                <p className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  Describe your product, its goals, and target audience to get AI-generated feature ideas aligned with strategic growth.
                </p>
              </div>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
                rows={4}
                value={productDesc}
                onChange={e => setProductDesc(e.target.value)}
                placeholder="e.g. A B2B SaaS for remote team collaboration that focuses on minimizing notification fatigue and maximizing deep work time..."
              />
              <button
                disabled={loading || !productDesc.trim()}
                onClick={generateSuggestions}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {loading ? 'Analyzing Market Trends...' : 'Generate Features'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Proposed Backlog Items</h3>
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleSelection(idx)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedIds.has(idx)
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-gray-100 hover:border-indigo-200 bg-white'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{s.title}</h4>
                    {selectedIds.has(idx) && (
                      <div className="bg-indigo-600 text-white p-0.5 rounded-full">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{s.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                      Value: <span className="text-emerald-600">{s.value}/5</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                      Effort: <span className="text-amber-600">{s.effort}/5</span>
                    </div>
                    <div className="ml-auto flex gap-1">
                      {s.tags.slice(0, 2).map((t: string) => (
                        <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-medium">#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setSuggestions([])}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Try Different Description
                </button>
                <button
                  disabled={selectedIds.size === 0}
                  onClick={handleAddSelected}
                  className="flex-1 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Add {selectedIds.size} Selected to Backlog
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
