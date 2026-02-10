
import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface ProgressCardProps {
    progress: number;
    label?: string;
    target?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ progress, label = 'Q1 PROGRESS', target = 'Target: Core UI Refinement' }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-200/50 flex flex-col gap-6 w-full max-w-sm">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
                    <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-[14px] font-black text-white uppercase tracking-[0.2em]">{label}</span>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-[16px] font-black text-white/90 leading-tight">
                    {target}
                </h3>

                <div className="space-y-2">
                    <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">{t('progress')}</span>
                        <span className="text-[12px] font-black text-white">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressCard;
