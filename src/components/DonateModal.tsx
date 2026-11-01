import React from 'react';
import { X, Star, Zap, Database, Cpu, Coins, ShieldCheck, Sparkles } from 'lucide-react';
import { LanguageCode } from '../utils/i18n';

export interface DonatePackage {
  id: string;
  title: string;
  titleRu: string;
  descriptionRu: string;
  stars: number;
  badge?: string;
  rewards: {
    credits?: number;
    crypto?: number;
    energy?: number;
    data?: number;
  };
}

export const DONATE_PACKAGES: DonatePackage[] = [
  {
    id: 'pack_starter',
    title: 'Starter Syndicate Pack',
    titleRu: 'Стартовый Набор Синдиката',
    descriptionRu: 'Быстрый старт для прокачки ключевых серверов базы.',
    stars: 25,
    rewards: {
      credits: 2500,
      energy: 1000,
      data: 1000,
    },
  },
  {
    id: 'pack_crypto_whale',
    title: 'Crypto Extraction Vault',
    titleRu: 'Крипто-Казна Бездны',
    descriptionRu: 'Огромный запас токенов и кредитов для мгновенных апгрейдов.',
    stars: 75,
    badge: 'ПОПУЛЯРНОЕ',
    rewards: {
      credits: 10000,
      crypto: 1500,
      data: 3000,
    },
  },
  {
    id: 'pack_megacorp_titan',
    title: 'Megacorp Overlord Protocol',
    titleRu: 'Пакет Олигарха Мегакорпораций',
    descriptionRu: 'Полный перегруз хранилищ всеми типами ресурсов.',
    stars: 200,
    badge: 'МАКСИМАЛЬНЫЙ',
    rewards: {
      credits: 35000,
      crypto: 5000,
      energy: 5000,
      data: 8000,
    },
  },
];

interface DonateModalProps {
  isOpen: boolean;
  lang: LanguageCode;
  onClose: () => void;
  onBuyPackage: (pkg: DonatePackage) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  lang,
  onClose,
  onBuyPackage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-zinc-100 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'ru' ? 'Банк Telegram Stars' : 'Telegram Stars Vault'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-400">
                  ОФИЦИАЛЬНЫЙ ДОНАТ
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                {lang === 'ru'
                  ? 'Пополнение ресурсов через нативные Telegram Stars'
                  : 'Instant resource extraction backed by Telegram Stars'}
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

        {/* Packages List */}
        <div className="overflow-y-auto space-y-3 mt-4 pr-1">
          {DONATE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{pkg.titleRu}</h4>
                  {pkg.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400">{pkg.descriptionRu}</p>

                {/* Reward breakdown */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                  {pkg.rewards.credits && (
                    <span className="flex items-center gap-1 text-amber-400">
                      <Coins className="w-3 h-3" /> +{pkg.rewards.credits} CR
                    </span>
                  )}
                  {pkg.rewards.crypto && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Cpu className="w-3 h-3" /> +{pkg.rewards.crypto} Crypto
                    </span>
                  )}
                  {pkg.rewards.energy && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Zap className="w-3 h-3" /> +{pkg.rewards.energy} Energy
                    </span>
                  )}
                  {pkg.rewards.data && (
                    <span className="flex items-center gap-1 text-sky-400">
                      <Database className="w-3 h-3" /> +{pkg.rewards.data} Data
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onBuyPackage(pkg)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all shrink-0"
              >
                <Star className="w-4 h-4 fill-zinc-950" />
                <span>{pkg.stars} ⭐️ Stars</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
