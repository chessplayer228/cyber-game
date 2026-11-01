import React, { useState } from 'react';
import { X, Wrench, Coins, Shield, Sparkles, Terminal, Cpu, Zap, Activity } from 'lucide-react';
import { BuildingDetailItem } from './BuildingDetailView';
import { DecorItem, DECOR_ITEMS } from './DecorShop';
import { LanguageCode } from '../utils/i18n';

interface BasementViewProps {
  isOpen: boolean;
  isDetailOpen: boolean;
  buildings: BuildingDetailItem[];
  mainServerLevel: number;
  credits: number;
  unlockedDecor: string[];
  lang: LanguageCode;
  onClose: () => void;
  onSelectBuilding: (type: string) => void;
  onPurchaseDecor: (item: DecorItem) => void;
}

export const BasementView: React.FC<BasementViewProps> = ({
  isOpen,
  credits,
  unlockedDecor,
  lang,
  onClose,
  onPurchaseDecor,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'terminal' | 'hardware' | 'cooling' | 'ambient'>('all');

  if (!isOpen) return null;

  const filteredDecor = DECOR_ITEMS.filter((item) =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-zinc-100 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-100 font-mono uppercase tracking-wider">
                  {lang === 'ru' ? 'Бункер Операций Синдиката' : 'Sub-level Bunker Matrix'}
                </h3>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                  SECURE LEVEL 4
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {lang === 'ru'
                  ? 'Кастомизация серверного интерьера и инженерных узлов'
                  : 'Bunker interior layout & auxiliary hardware engineering'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2D Isometric Bunker Schematic Preview */}
        <div className="my-3 p-3 rounded-2xl bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800/80 relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
              Статус Укрепления
            </span>
            <div className="text-xs font-bold text-zinc-200">
              Герметичность: 100% · Охлаждение: Норма
            </div>
            <div className="text-[11px] font-mono text-emerald-400">
              +{unlockedDecor.length * 25} Защита от проникновения
            </div>
          </div>

          <div className="w-24 h-16 z-10 flex items-center justify-center">
            <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow">
              <polygon points="50,5 90,25 50,45 10,25" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="30" y1="20" x2="40" y2="25" stroke="#38bdf8" strokeWidth="2" />
              <line x1="60" y1="25" x2="70" y2="20" stroke="#10b981" strokeWidth="2" />
              <circle cx="50" cy="25" r="4" fill="#38bdf8" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          {[
            { id: 'all', label: 'Все модули' },
            { id: 'hardware', label: 'Оборудование' },
            { id: 'cooling', label: 'Охлаждение' },
            { id: 'terminal', label: 'Терминалы' },
            { id: 'ambient', label: 'Освещение' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-zinc-100 text-zinc-950 font-bold'
                  : 'bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Fixtures list */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1">
          {filteredDecor.map((item) => {
            const isOwned = unlockedDecor.includes(item.id);
            const canAfford = credits >= item.costCredits;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
                    {item.category === 'hardware' ? (
                      <Cpu className="w-4 h-4 text-emerald-400" />
                    ) : item.category === 'cooling' ? (
                      <Zap className="w-4 h-4 text-sky-400" />
                    ) : (
                      <Terminal className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">{item.name}</div>
                    <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Coins className="w-3 h-3 text-amber-400" />
                      <span>{item.costCredits} Credits</span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={isOwned || !canAfford}
                  onClick={() => onPurchaseDecor(item)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    isOwned
                      ? 'bg-zinc-900 text-zinc-600 border border-zinc-800/50 cursor-default'
                      : canAfford
                      ? 'bg-white text-zinc-950 font-bold hover:bg-zinc-200 cursor-pointer shadow-sm'
                      : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                >
                  {isOwned ? (lang === 'ru' ? 'Смонтировано' : 'Installed') : (lang === 'ru' ? 'Установить' : 'Install')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
