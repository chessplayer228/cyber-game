import React from 'react';
import { X, Wrench, Coins } from 'lucide-react';
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h3 className="text-base font-semibold text-zinc-100">
              {lang === 'ru' ? 'Подуровень Базы' : 'Sub-level Facilities'}
            </h3>
            <p className="text-xs text-zinc-500">
              {lang === 'ru' ? 'Оснащение и серверная фурнитура' : 'Hardware fixtures & engineering expansion'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
          {DECOR_ITEMS.map((item) => {
            const isOwned = unlockedDecor.includes(item.id);
            const canAfford = credits >= item.costCredits;

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-200">{item.name}</div>
                    <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 mt-0.5">
                      <Coins className="w-3 h-3 text-zinc-400" />
                      <span>{item.costCredits} Credits</span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={isOwned || !canAfford}
                  onClick={() => onPurchaseDecor(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    isOwned
                      ? 'bg-zinc-900 text-zinc-600 border border-zinc-800/50 cursor-default'
                      : canAfford
                      ? 'bg-zinc-100 text-zinc-950 font-semibold hover:bg-white cursor-pointer'
                      : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                >
                  {isOwned ? (lang === 'ru' ? 'Установлено' : 'Installed') : (lang === 'ru' ? 'Монтаж' : 'Install')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
