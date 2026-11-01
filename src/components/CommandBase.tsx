import React, { useState } from 'react';
import {
  BuildingCategory,
  getBuildingConfigById,
} from '../config/buildingsConfig';
import {
  BuildingState,
  BuildingType,
  calculateProductionMetrics,
  calculateSkipUpgradeCreditCost,
  formatUpgradeTime,
  getBuildingUpgradeSpec,
  MAIN_SERVER_MAX_LEVEL,
  ResourceState,
} from '../utils/idleResourceEngine';
import { BuildingIsometricArt } from './BuildingIsometricArt';
import { BuildingDetailItem, BuildingDetailView } from './BuildingDetailView';
import { BasementView } from './BasementView';
import { DecorItem } from './DecorShop';
import { ShadowBrokerModal, ShadowTradeId } from './ShadowBrokerModal';
import { LanguageCode, TRANSLATIONS } from '../utils/i18n';
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Coins,
  Cpu,
  Database,
  FastForward,
  Grid,
  Layers,
  Lock,
  ShieldCheck,
  Timer,
  Zap,
} from 'lucide-react';

export interface CommandBaseProps {
  buildings: BuildingState[];
  resources: ResourceState;
  nowMs: number;
  lang: LanguageCode;
  unlockedDecor?: string[];
  shieldUntilMs?: number | null;
  completedBrokerTrades?: ShadowTradeId[];
  onUpgradeBuilding: (type: BuildingType) => void;
  onSkipBuildingTimer: (type: BuildingType) => void;
  onSimulateOfflineDelta?: (seconds: number) => void;
  onPurchaseDecor?: (item: DecorItem) => void;
  onExecuteShadowTrade?: (tradeId: ShadowTradeId) => void;
}

export const CommandBase: React.FC<CommandBaseProps> = ({
  buildings,
  resources,
  nowMs,
  lang,
  unlockedDecor = [],
  shieldUntilMs = null,
  completedBrokerTrades = [],
  onUpgradeBuilding,
  onSkipBuildingTimer,
  onPurchaseDecor = () => {},
  onExecuteShadowTrade = () => {},
}) => {
  const [selectedBuildingType, setSelectedBuildingType] = useState<BuildingType | null>(
    null
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | BuildingCategory>(
    'all'
  );
  const [isBasementOpen, setIsBasementOpen] = useState<boolean>(false);
  const [isShadowBrokerOpen, setIsShadowBrokerOpen] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];
  const productionMetrics = calculateProductionMetrics(buildings);
  const mainServerLevel = buildings.find((b) => b.type === 'main_server')?.level ?? 1;
  const isShieldActive = Boolean(shieldUntilMs && shieldUntilMs > nowMs);

  const preparedItems: BuildingDetailItem[] = buildings.map((building) => {
    const cfg = getBuildingConfigById(building.type);
    const spec = getBuildingUpgradeSpec(building, mainServerLevel);

    const canAfford =
      resources.energy >= spec.energyCost &&
      resources.data >= spec.dataCost &&
      resources.crypto >= spec.cryptoCost &&
      resources.credits >= spec.creditsCost;

    let status: BuildingDetailItem['status'] = 'insufficient';
    if (building.isUpgrading) {
      status = 'upgrading';
    } else if (spec.isMaxLevel || building.level >= MAIN_SERVER_MAX_LEVEL) {
      status = 'max_level';
    } else if (spec.requiresMainServerUpgrade) {
      status = 'locked';
    } else if (canAfford) {
      status = 'affordable';
    }

    const remainingSec =
      building.isUpgrading && building.upgradeFinishesAt
        ? Math.max(0, Math.ceil((building.upgradeFinishesAt - nowMs) / 1000))
        : 0;

    const totalDurationSec =
      building.isUpgrading && building.upgradeStartedAt && building.upgradeFinishesAt
        ? Math.max(
            1,
            Math.round((building.upgradeFinishesAt - building.upgradeStartedAt) / 1000)
          )
        : spec.durationSec;

    const elapsedPct = building.isUpgrading
      ? Math.min(
          100,
          Math.max(0, Math.round(((totalDurationSec - remainingSec) / totalDurationSec) * 100))
        )
      : 0;

    const skipCreditCost = calculateSkipUpgradeCreditCost(remainingSec);

    let productionSummary =
      lang === 'ru' ? cfg.passiveOutputLabelRu : cfg.passiveOutputLabel;

    if (building.type === 'main_server') {
      productionSummary = `+${productionMetrics.ratesPerHour.energy} Energy/hr · Cap ${productionMetrics.caps.energyCap.toLocaleString()}`;
    } else if (building.type === 'syndicate_bank') {
      productionSummary = `+${productionMetrics.ratesPerHour.credits} Credits/hr · Cap ${productionMetrics.caps.creditsCap.toLocaleString()} CR`;
    } else if (building.type === 'mining_rig') {
      productionSummary = `+${productionMetrics.ratesPerHour.crypto} Crypto/hr`;
    } else if (building.type === 'data_center') {
      productionSummary = `+${productionMetrics.ratesPerHour.data} Data/hr`;
    }

    return {
      type: building.type,
      code: cfg.code,
      category: cfg.category,
      name: lang === 'ru' ? cfg.nameRu : cfg.name,
      subtitle: lang === 'ru' ? cfg.subtitleRu : cfg.subtitle,
      description: lang === 'ru' ? cfg.descriptionRu : cfg.description,
      lore: lang === 'ru' ? cfg.descriptionRu : cfg.description,
      level: building.level,
      status,
      productionSummary,
      cost: {
        energy: spec.energyCost,
        data: spec.dataCost,
        crypto: spec.cryptoCost,
        credits: spec.creditsCost,
        durationSec: spec.durationSec,
      },
      remainingSec,
      elapsedPct,
      skipCreditCost,
      requiredMainServerLevel: spec.requiredMainServerLevel,
    };
  });

  const visibleItems =
    activeCategoryFilter === 'all'
      ? preparedItems
      : preparedItems.filter((item) => item.category === activeCategoryFilter);

  const activeDetailBuilding =
    preparedItems.find((item) => item.type === selectedBuildingType) || null;

  const builtCount = preparedItems.filter((b) => b.level > 0).length;

  return (
    <section className="flex flex-col gap-4 relative">
      {/* Header & Action Row */}
      <div className="flex flex-col gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                {t.commandBaseTitle}
              </h1>
              <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                {builtCount}/30 Structures Active · MS LVL {mainServerLevel}
              </p>
            </div>
            {isShieldActive && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                SHIELD
              </span>
            )}
          </div>
        </div>

        {/* Enter Basement & Shadow Broker Trigger Row */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setIsBasementOpen(true)}
            className="col-span-2 py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Grid className="w-4 h-4 shrink-0" />
            <span>{t.enterBasementBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsShadowBrokerOpen(true)}
            className="py-3 px-3 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{lang === 'ru' ? 'Брокер' : 'Broker'}</span>
          </button>
        </div>

        {/* 30-Building Division Filter Tabs (Scrollbar Hidden) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {[
            { id: 'all', label: `All (${preparedItems.length})` },
            { id: 'core', label: 'Core' },
            { id: 'extraction', label: 'Extraction' },
            { id: 'warfare', label: 'Warfare' },
            { id: 'finance', label: 'Finance' },
          ].map((tab) => {
            const active = activeCategoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveCategoryFilter(tab.id as 'all' | BuildingCategory)
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Strict Vertical Stack of Clean Matte 2D Facility Cards (All 30 Structures) */}
      <div className="flex flex-col gap-3.5">
        {visibleItems.map((item) => {
          const isUnbuilt = item.level === 0;
          const cardBorderClasses =
            item.status === 'upgrading'
              ? 'border-amber-500/60 bg-white dark:bg-zinc-900 shadow-sm'
              : item.status === 'affordable'
              ? 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 shadow-sm'
              : 'border-zinc-200 dark:border-zinc-800/90 bg-white/90 dark:bg-zinc-900/75';

          return (
            <div
              key={item.type}
              onClick={() => setSelectedBuildingType(item.type)}
              className={`rounded-2xl border p-4 flex flex-col gap-3 transition-colors cursor-pointer ${cardBorderClasses}`}
            >
              <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                {item.status === 'upgrading' && (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5" />
                    {t.upgradingStatus} · {formatUpgradeTime(item.remainingSec)}
                  </span>
                )}
                {item.status === 'max_level' && (
                  <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold">
                    {lang === 'ru' ? 'МАКС. УРОВЕНЬ' : 'MAX LEVEL'}
                  </span>
                )}
                {item.status === 'affordable' && (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isUnbuilt ? 'READY TO CONSTRUCT' : t.readyStatus} ·{' '}
                    {formatUpgradeTime(item.cost.durationSec)}
                  </span>
                )}
                {item.status === 'insufficient' && (
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    {t.insufficientStatus} · {formatUpgradeTime(item.cost.durationSec)}
                  </span>
                )}
                {item.status === 'locked' && (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    REQ. MAIN SERVER LVL {item.requiredMainServerLevel}
                  </span>
                )}

                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold">
                  {item.code} ·{' '}
                  {isUnbuilt
                    ? 'UNBUILT'
                    : `LVL ${item.level}/${MAIN_SERVER_MAX_LEVEL}`}
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-24 h-24 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-1.5 shrink-0">
                  <BuildingIsometricArt
                    type={item.type}
                    level={item.level}
                    isUpgrading={item.status === 'upgrading'}
                  />
                </div>

                <div className="min-w-0 flex-1 flex flex-col gap-1">
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {item.subtitle}
                  </div>
                  <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 truncate tracking-tight">
                    {item.name}
                  </h2>
                  <div className="text-[11px] font-mono tabular-nums text-zinc-600 dark:text-zinc-300 font-medium line-clamp-2">
                    {item.productionSummary}
                  </div>
                </div>
              </div>

              <div
                className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                {item.status === 'max_level' ? (
                  <div className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    <span>{lang === 'ru' ? 'МАКС. УРОВЕНЬ' : 'MAX LEVEL'}</span>
                    <span>LVL {MAIN_SERVER_MAX_LEVEL}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-1 text-[11px] font-mono tabular-nums text-zinc-700 dark:text-zinc-300">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500 shrink-0" /> {item.cost.energy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3 text-sky-500 shrink-0" /> {item.cost.data}
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-emerald-500 shrink-0" /> {item.cost.crypto}
                    </span>
                    <span className="flex items-center gap-1 text-zinc-900 dark:text-zinc-100 font-bold">
                      <Coins className="w-3 h-3 text-amber-500 shrink-0" /> {item.cost.credits} CR
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {item.status === 'upgrading' ? (
                    <button
                      type="button"
                      onClick={() => onSkipBuildingTimer(item.type)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                      {t.skipTimerButton} ({item.skipCreditCost} CR)
                    </button>
                  ) : item.status === 'max_level' ? (
                    <button
                      type="button"
                      disabled
                      className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-mono font-bold tracking-wider uppercase cursor-not-allowed whitespace-nowrap"
                    >
                      {lang === 'ru' ? 'МАКС. УРОВЕНЬ' : 'MAX LEVEL'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUpgradeBuilding(item.type)}
                      disabled={item.status !== 'affordable'}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        item.status === 'affordable'
                          ? 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 cursor-pointer'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      {item.status === 'locked'
                        ? `Requires Main Server LVL ${item.requiredMainServerLevel}`
                        : isUnbuilt
                        ? `Construct → Lvl 1 (${formatUpgradeTime(item.cost.durationSec)})`
                        : `${t.upgradeButton} → Lvl ${item.level + 1} (${formatUpgradeTime(
                            item.cost.durationSec
                          )})`}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedBuildingType(item.type)}
                    className="px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                    <span>{t.inspect3dButton}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shadow Broker Dynamic NPC Modal */}
      <ShadowBrokerModal
        isOpen={isShadowBrokerOpen}
        resources={{
          energy: resources.energy,
          data: resources.data,
          crypto: resources.crypto,
          credits: resources.credits,
        }}
        shieldUntilMs={shieldUntilMs}
        completedTrades={completedBrokerTrades}
        lang={lang}
        onExecuteTrade={onExecuteShadowTrade}
        onClose={() => setIsShadowBrokerOpen(false)}
      />

      {/* Full-Screen Interactive Isometric/Pixel Basement Room + 30-Building Matrix */}
      <BasementView
        isOpen={isBasementOpen}
        isDetailOpen={Boolean(activeDetailBuilding)}
        buildings={preparedItems}
        mainServerLevel={mainServerLevel}
        credits={resources.credits}
        unlockedDecor={unlockedDecor}
        lang={lang}
        onClose={() => setIsBasementOpen(false)}
        onSelectBuilding={(type) => setSelectedBuildingType(type)}
        onPurchaseDecor={onPurchaseDecor}
      />

      {/* Full-Screen 2D Architectural Detail View Modal */}
      <BuildingDetailView
        building={activeDetailBuilding}
        currentResources={{
          energy: resources.energy,
          data: resources.data,
          crypto: resources.crypto,
          credits: resources.credits,
        }}
        lang={lang}
        onClose={() => setSelectedBuildingType(null)}
        onUpgrade={onUpgradeBuilding}
        onSkipTimer={onSkipBuildingTimer}
      />
    </section>
  );
};