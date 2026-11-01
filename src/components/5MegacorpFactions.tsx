import React from 'react';
import {
  Check,
  Coins,
  Cpu,
  EyeOff,
  Shield,
  Swords,
} from 'lucide-react';
import { LanguageCode } from '../utils/i18n';

export type FactionId =
  | 'aegis_security'
  | 'neuro_sync'
  | 'void_syndicate'
  | 'neon_cartel'
  | 'ghost_proxies';

export interface FactionConfig {
  id: FactionId;
  code: string;
  name: string;
  nameRu: string;
  bonus: string;
  bonusRu: string;
  description: string;
  descriptionRu: string;
  icon: React.ComponentType<{ className?: string }>;
  multipliers: {
    baseDefenseMult: number;
    resourceGenMult: number;
    pvpLootMult: number;
    creditGenMult: number;
    upgradeTimeMult: number;
  };
}

export const FACTIONS_CONFIG: FactionConfig[] = [
  {
    id: 'aegis_security',
    code: 'CORP-AEGIS',
    name: 'Aegis Security',
    nameRu: 'Эгида Секьюрити',
    bonus: '+10% Base Defense',
    bonusRu: '+10% к Защите Базы',
    description:
      'Private military contractors specializing in hardened subterranean perimeters and automated Black-ICE defense grids.',
    descriptionRu:
      'Частный военный подрядчик, специализирующийся на укреплении периметра и защите бункеров.',
    icon: Shield,
    multipliers: {
      baseDefenseMult: 1.1,
      resourceGenMult: 1.0,
      pvpLootMult: 1.0,
      creditGenMult: 1.0,
      upgradeTimeMult: 1.0,
    },
  },
  {
    id: 'neuro_sync',
    code: 'CORP-NEURO',
    name: 'Neuro-Sync',
    nameRu: 'Нейро-Синк',
    bonus: '+5% Resource Generation',
    bonusRu: '+5% к Выработке Ресурсов',
    description:
      'Biotech and neural-grid conglomerate optimizing passive Energy, Data, and Crypto throughput across all facilities.',
    descriptionRu:
      'Биотехнологический конгломерат, оптимизирующий пассивную выработку Энергии, Данных и Крипты.',
    icon: Cpu,
    multipliers: {
      baseDefenseMult: 1.0,
      resourceGenMult: 1.05,
      pvpLootMult: 1.0,
      creditGenMult: 1.0,
      upgradeTimeMult: 1.0,
    },
  },
  {
    id: 'void_syndicate',
    code: 'CORP-VOID',
    name: 'Void Syndicate',
    nameRu: 'Синдикат Пустоты',
    bonus: '+10% PvP Loot',
    bonusRu: '+10% к Добыче в PvP',
    description:
      'Covert strike collective utilizing high-bandwidth siphon drones to extract maximum vault reserves during base raids.',
    descriptionRu:
      'Ударный синдикат, извлекающий максимум ресурсов из хранилищ противника при рейдах.',
    icon: Swords,
    multipliers: {
      baseDefenseMult: 1.0,
      resourceGenMult: 1.0,
      pvpLootMult: 1.1,
      creditGenMult: 1.0,
      upgradeTimeMult: 1.0,
    },
  },
  {
    id: 'neon_cartel',
    code: 'CORP-CARTEL',
    name: 'Neon Cartel',
    nameRu: 'Неоновый Картель',
    bonus: '+10% Credit Generation',
    bonusRu: '+10% к Генерации Кредитов',
    description:
      'Offshore liquidity brokers controlling dark-pool clearinghouses and accelerating passive Credit minting.',
    descriptionRu:
      'Офшорные брокеры ликвидности, ускоряющие пассивную чеканку премиальных Кредитов.',
    icon: Coins,
    multipliers: {
      baseDefenseMult: 1.0,
      resourceGenMult: 1.0,
      pvpLootMult: 1.0,
      creditGenMult: 1.1,
      upgradeTimeMult: 1.0,
    },
  },
  {
    id: 'ghost_proxies',
    code: 'CORP-GHOST',
    name: 'Ghost Proxies',
    nameRu: 'Прокси-Призраки',
    bonus: '-10% Upgrade Time',
    bonusRu: '-10% Время Улучшения',
    description:
      'Autonomous engineering collective deploying distributed nano-assemblers to compress construction and upgrade timers.',
    descriptionRu:
      'Инженерная сеть, использующая нано-сборщики для сокращения времени строительства и улучшений.',
    icon: EyeOff,
    multipliers: {
      baseDefenseMult: 1.0,
      resourceGenMult: 1.0,
      pvpLootMult: 1.0,
      creditGenMult: 1.0,
      upgradeTimeMult: 0.9,
    },
  },
];

export function getFactionConfig(factionId?: FactionId): FactionConfig {
  return (
    FACTIONS_CONFIG.find((f) => f.id === factionId) || FACTIONS_CONFIG[0]
  );
}

export interface FactionSelectionProps {
  selectedFaction: FactionId;
  lang?: LanguageCode;
  onSelectFaction: (factionId: FactionId) => void;
}

export const FactionSelection: React.FC<FactionSelectionProps> = ({
  selectedFaction,
  lang = 'en',
  onSelectFaction,
}) => {
  const activeFaction = getFactionConfig(selectedFaction);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {lang === 'ru' ? 'Корпоративная Принадлежность' : 'Megacorp Allegiance'}
          </div>
          <h2 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mt-0.5">
            {lang === 'ru' ? 'Выбор Фракции Синдиката' : 'Syndicate Faction Protocol'}
          </h2>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
          {activeFaction.code}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {FACTIONS_CONFIG.map((faction) => {
          const isSelected = selectedFaction === faction.id;
          const IconComponent = faction.icon;

          return (
            <button
              key={faction.id}
              type="button"
              onClick={() => onSelectFaction(faction.id)}
              aria-pressed={isSelected}
              className={`w-full p-3.5 rounded-xl border text-left transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 shadow-xs'
                  : 'bg-zinc-50 dark:bg-zinc-950/80 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-white/15 dark:bg-black/15 border-white/20 dark:border-black/20 text-white dark:text-zinc-950'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold tracking-tight">
                      {lang === 'ru' ? faction.nameRu : faction.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isSelected
                          ? 'bg-white/20 dark:bg-black/15 text-white dark:text-zinc-950'
                          : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {lang === 'ru' ? faction.bonusRu : faction.bonus}
                    </span>
                  </div>

                  <p
                    className={`text-[11px] leading-relaxed mt-1 ${
                      isSelected
                        ? 'text-zinc-200 dark:text-zinc-700'
                        : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {lang === 'ru' ? faction.descriptionRu : faction.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-center">
                {isSelected ? (
                  <span className="w-6 h-6 rounded-lg bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                    {lang === 'ru' ? 'ВЫБРАТЬ' : 'SELECT'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};