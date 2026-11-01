import React from 'react';
import { X, ArrowUpRight, Clock, Zap, Database, Cpu, Coins } from 'lucide-react';
import { LanguageCode } from '../utils/i18n';

export interface BuildingDetailItem {
  type: string;
  code: string;
  name: string;
  subtitle: string;
  description: string;
  lore: string;
  category: 'core' | 'extraction' | 'warfare' | 'finance';
  level: number;
  status: 'operational' | 'upgrading' | 'requires_server' | 'cannot_afford';
  remainingSec: number;
  skipCreditCost: number;
  passiveLabel: string;
  cost: {
    energy: number;
    data: number;
    crypto: number;
    credits: number;
    durationSec: number;
  };
  requiredServerLevel: number;
}

interface BuildingDetailViewProps {
  building: BuildingDetailItem | null;
  currentResources: {
    energy: number;
    data: number;
    crypto: number;
    credits: number;
  };
  lang: LanguageCode;
  onClose: () => void;
  onUpgrade: (type: string) => void;
}

export const BuildingDetailView: React.FC<BuildingDetailViewProps> = ({
  building,
  currentResources,
  lang,
  onClose,
  onUpgrade,
}) => {
  if (!building) return null;

  const canAfford =
    currentResources.energy >= building.cost.energy &&
    currentResources.data >= building.cost.data &&
    currentResources.crypto >= building.cost.crypto &&
    currentResources.credits >= building.cost.credits;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              {building.code} · Level {building.level}
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-100">{building.name}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{building.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">{building.description}</p>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs">
            <span className="text-zinc-500 font-mono block mb-1">
              {lang === 'ru' ? 'Выработка' : 'Yield / Output'}
            </span>
            <span className="text-zinc-200 font-medium">{building.passiveLabel}</span>
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-500 mb-2">
              {lang === 'ru' ? 'Стоимость модернизации' : 'Upgrade Requirements'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <Zap className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-300">{building.cost.energy} Energy</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <Database className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-300">{building.cost.data} Data</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-300">{building.cost.crypto} Crypto</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <Coins className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-300">{building.cost.credits} Credits</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{building.cost.durationSec}s</span>
          </div>
          <button
            disabled={!canAfford || building.status === 'upgrading'}
            onClick={() => {
              onUpgrade(building.type);
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              canAfford && building.status !== 'upgrading'
                ? 'bg-zinc-100 hover:bg-white text-zinc-950 font-semibold cursor-pointer'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <span>{lang === 'ru' ? 'Модернизировать' : 'Upgrade Module'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
