import {
  BUILDINGS_CONFIG,
  BuildingConfigEntry,
  getBuildingConfigById,
} from '../config/buildingsConfig';

export type BuildingType = string;
export type UnitType = 'hacker' | 'drone' | 'mercenary';

export const MAIN_SERVER_MAX_LEVEL = 25;
export const MAX_OFFLINE_IDLE_SECONDS = 86400;

export interface ResourceState {
  energy: number;
  data: number;
  crypto: number;
  credits: number;
  energyCap: number;
  dataCap: number;
  cryptoCap: number;
  creditsCap: number;
  lastSyncedAt: number;
}

export interface BuildingState {
  type: BuildingType;
  name: string;
  subtitle: string;
  description: string;
  level: number; // 0 = Not Yet Constructed, 1..25 = Active Level
  isUpgrading: boolean;
  upgradeStartedAt: number | null;
  upgradeFinishesAt: number | null;
}

export interface UnitState {
  type: UnitType;
  name: string;
  role: string;
  quantity: number;
  attack: number;
  defense: number;
  raidCapacity: number;
  cost: {
    energy: number;
    data: number;
    crypto: number;
  };
}

export interface IdleDeltaReport {
  previousSyncedAt: number;
  syncedAt: number;
  rawDeltaSeconds: number;
  clampedDeltaSeconds: number;
  wasCappedByTimeWindow: boolean;
  ratesPerHour: {
    energy: number;
    data: number;
    crypto: number;
    credits: number;
  };
  ratesPerSecond: {
    energy: number;
    data: number;
    crypto: number;
    credits: number;
  };
  earned: {
    energy: number;
    data: number;
    crypto: number;
    credits: number;
  };
  overflowLost: {
    energy: number;
    data: number;
    crypto: number;
    credits: number;
  };
  completedUpgrades: BuildingType[];
  updatedResources: ResourceState;
  updatedBuildings: BuildingState[];
}

/**
 * Exponential Upgrade Timer Formula:
 * - Main Server: Base 5s, Multiplier 1.25 -> Math.floor(5 * Math.pow(1.25, level - 1))
 * - Standard Buildings: Base 3s, Multiplier 1.2 -> Math.floor(3 * Math.pow(1.2, level - 1))
 */
export function calculateUpgradeDurationSeconds(
  type: BuildingType,
  currentLevel: number
): number {
  const level = Math.max(1, currentLevel);
  if (type === 'main_server') {
    return Math.floor(5 * Math.pow(1.25, level - 1));
  }
  return Math.floor(3 * Math.pow(1.2, level - 1));
}

/**
 * Converts raw seconds into a zero-padded readable UI string:
 * - < 60s: "05s"
 * - < 3600s: "02m 15s"
 * - >= 3600s: "01h 20m"
 */
export function formatUpgradeTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const pad2 = (n: number) => String(n).padStart(2, '0');

  if (clamped < 60) {
    return `${pad2(clamped)}s`;
  }

  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;

  if (hours > 0) {
    return `${pad2(hours)}h ${pad2(minutes)}m`;
  }

  return `${pad2(minutes)}m ${pad2(seconds)}s`;
}

export function buildComplete30BuildingsState(
  existing?: BuildingState[]
): BuildingState[] {
  const defaultInitialLevels: Record<string, number> = {
    main_server: 2,
    syndicate_bank: 1,
    mining_rig: 2,
    data_center: 2,
    drone_factory: 1,
  };

  return BUILDINGS_CONFIG.map((cfg: BuildingConfigEntry) => {
    const found = existing?.find((b) => b.type === cfg.id);
    if (found) {
      return {
        ...found,
        level: Math.min(MAIN_SERVER_MAX_LEVEL, found.level),
        name: cfg.name,
        subtitle: cfg.subtitle,
        description: cfg.description,
      };
    }
    return {
      type: cfg.id,
      name: cfg.name,
      subtitle: cfg.subtitle,
      description: cfg.description,
      level: defaultInitialLevels[cfg.id] ?? 0,
      isUpgrading: false,
      upgradeStartedAt: null,
      upgradeFinishesAt: null,
    };
  });
}

export function calculateProductionMetrics(buildings: BuildingState[]) {
  const getLevel = (type: BuildingType) =>
    buildings.find((b) => b.type === type)?.level ?? 0;

  const mainServerLvl = Math.max(1, getLevel('main_server'));
  const miningRigLvl = Math.max(1, getLevel('mining_rig'));
  const dataCenterLvl = Math.max(1, getLevel('data_center'));
  const droneFactoryLvl = Math.max(1, getLevel('drone_factory'));
  const syndicateBankLvl = Math.max(1, getLevel('syndicate_bank'));

  let energyPerHour = Math.round(120 * Math.pow(1.25, mainServerLvl - 1));
  let dataPerHour = Math.round(95 * Math.pow(1.28, dataCenterLvl - 1));
  let cryptoPerHour = Math.round(45 * Math.pow(1.22, miningRigLvl - 1));
  let creditsPerHour = Number((12 * Math.pow(1.24, syndicateBankLvl - 1)).toFixed(1));
  let extraAttack = 0;
  let extraDefense = 0;

  for (const b of buildings) {
    if (b.level <= 0) continue;
    if (
      b.type === 'main_server' ||
      b.type === 'mining_rig' ||
      b.type === 'data_center' ||
      b.type === 'syndicate_bank'
    ) {
      continue;
    }

    const cfg = getBuildingConfigById(b.type);
    const scale = Math.pow(1.2, b.level - 1);
    if (cfg.hourlyYieldBonus.energy) {
      energyPerHour += Math.round(cfg.hourlyYieldBonus.energy * scale);
    }
    if (cfg.hourlyYieldBonus.data) {
      dataPerHour += Math.round(cfg.hourlyYieldBonus.data * scale);
    }
    if (cfg.hourlyYieldBonus.crypto) {
      cryptoPerHour += Math.round(cfg.hourlyYieldBonus.crypto * scale);
    }
    if (cfg.hourlyYieldBonus.credits) {
      creditsPerHour = Number(
        (creditsPerHour + cfg.hourlyYieldBonus.credits * scale).toFixed(1)
      );
    }
    if (cfg.hourlyYieldBonus.attackBonus) {
      extraAttack += Math.round(cfg.hourlyYieldBonus.attackBonus * scale);
    }
    if (cfg.hourlyYieldBonus.defenseBonus) {
      extraDefense += Math.round(cfg.hourlyYieldBonus.defenseBonus * scale);
    }
  }

  const energyCap = Math.round(5000 * Math.pow(1.32, mainServerLvl - 1));
  const dataCap = Math.round(5000 * Math.pow(1.32, mainServerLvl - 1));
  const cryptoCap = Math.round(2500 * Math.pow(1.32, mainServerLvl - 1));
  const creditsCap = Math.round(1000 * Math.pow(1.35, syndicateBankLvl - 1));

  const trainingEfficiencyPct = 100 + (droneFactoryLvl - 1) * 18;

  return {
    ratesPerHour: {
      energy: energyPerHour,
      data: dataPerHour,
      crypto: cryptoPerHour,
      credits: creditsPerHour,
    },
    ratesPerSecond: {
      energy: energyPerHour / 3600,
      data: dataPerHour / 3600,
      crypto: cryptoPerHour / 3600,
      credits: creditsPerHour / 3600,
    },
    caps: {
      energyCap,
      dataCap,
      cryptoCap,
      creditsCap,
    },
    trainingEfficiencyPct,
    extraAttack,
    extraDefense,
  };
}

export function evaluateIdleResourceDelta(
  resources: ResourceState,
  buildings: BuildingState[],
  nowMs: number = Date.now()
): IdleDeltaReport {
  const completedUpgrades: BuildingType[] = [];

  const updatedBuildings = buildings.map((b) => {
    if (b.isUpgrading && b.upgradeFinishesAt && b.upgradeFinishesAt <= nowMs) {
      completedUpgrades.push(b.type);
      return {
        ...b,
        level: Math.min(MAIN_SERVER_MAX_LEVEL, b.level + 1),
        isUpgrading: false,
        upgradeStartedAt: null,
        upgradeFinishesAt: null,
      };
    }
    return b;
  });

  const rawDeltaSeconds = Math.max(0, (nowMs - resources.lastSyncedAt) / 1000);
  const clampedDeltaSeconds = Math.min(rawDeltaSeconds, MAX_OFFLINE_IDLE_SECONDS);
  const wasCappedByTimeWindow = rawDeltaSeconds > MAX_OFFLINE_IDLE_SECONDS;

  const metrics = calculateProductionMetrics(updatedBuildings);

  const rawEnergyGenerated = clampedDeltaSeconds * metrics.ratesPerSecond.energy;
  const rawDataGenerated = clampedDeltaSeconds * metrics.ratesPerSecond.data;
  const rawCryptoGenerated = clampedDeltaSeconds * metrics.ratesPerSecond.crypto;
  const rawCreditsGenerated = clampedDeltaSeconds * metrics.ratesPerSecond.credits;

  const nextEnergy = Math.min(
    metrics.caps.energyCap,
    Number((resources.energy + rawEnergyGenerated).toFixed(2))
  );
  const nextData = Math.min(
    metrics.caps.dataCap,
    Number((resources.data + rawDataGenerated).toFixed(2))
  );
  const nextCrypto = Math.min(
    metrics.caps.cryptoCap,
    Number((resources.crypto + rawCryptoGenerated).toFixed(2))
  );
  const nextCredits = Math.min(
    metrics.caps.creditsCap,
    Number(((resources.credits ?? 120) + rawCreditsGenerated).toFixed(2))
  );

  const earned = {
    energy: Number(Math.max(0, nextEnergy - resources.energy).toFixed(2)),
    data: Number(Math.max(0, nextData - resources.data).toFixed(2)),
    crypto: Number(Math.max(0, nextCrypto - resources.crypto).toFixed(2)),
    credits: Number(Math.max(0, nextCredits - (resources.credits ?? 120)).toFixed(2)),
  };

  const overflowLost = {
    energy: Number(Math.max(0, rawEnergyGenerated - earned.energy).toFixed(2)),
    data: Number(Math.max(0, rawDataGenerated - earned.data).toFixed(2)),
    crypto: Number(Math.max(0, rawCryptoGenerated - earned.crypto).toFixed(2)),
    credits: Number(Math.max(0, rawCreditsGenerated - earned.credits).toFixed(2)),
  };

  const updatedResources: ResourceState = {
    energy: nextEnergy,
    data: nextData,
    crypto: nextCrypto,
    credits: nextCredits,
    energyCap: metrics.caps.energyCap,
    dataCap: metrics.caps.dataCap,
    cryptoCap: metrics.caps.cryptoCap,
    creditsCap: metrics.caps.creditsCap,
    lastSyncedAt: nowMs,
  };

  return {
    previousSyncedAt: resources.lastSyncedAt,
    syncedAt: nowMs,
    rawDeltaSeconds: Number(rawDeltaSeconds.toFixed(1)),
    clampedDeltaSeconds: Number(clampedDeltaSeconds.toFixed(1)),
    wasCappedByTimeWindow,
    ratesPerHour: metrics.ratesPerHour,
    ratesPerSecond: metrics.ratesPerSecond,
    earned,
    overflowLost,
    completedUpgrades,
    updatedResources,
    updatedBuildings,
  };
}

export function getBuildingUpgradeSpec(
  building: BuildingState,
  mainServerLevel: number
) {
  const cfg = getBuildingConfigById(building.type);
  const base = cfg.baseCosts;
  const effectiveLvl = Math.max(1, building.level);
  const scale = building.level === 0 ? 1 : Math.pow(1.42, effectiveLvl - 1);

  const isMaxLevel = building.level >= MAIN_SERVER_MAX_LEVEL;

  const energyCost = isMaxLevel ? 0 : Math.round(base.energy * scale);
  const dataCost = isMaxLevel ? 0 : Math.round(base.data * scale);
  const cryptoCost = isMaxLevel ? 0 : Math.round(base.crypto * scale);
  const creditsCost = isMaxLevel
    ? 0
    : Math.round(
        base.credits * (building.level === 0 ? 1 : Math.pow(1.32, effectiveLvl - 1))
      );

  const durationSec = isMaxLevel
    ? 0
    : calculateUpgradeDurationSeconds(building.type, effectiveLvl);

  const requiredMainServerForNext =
    building.type === 'main_server'
      ? 1
      : Math.max(cfg.requiredMainServerLevel, building.level + 1);

  const requiresMainServerUpgrade =
    !isMaxLevel &&
    building.type !== 'main_server' &&
    mainServerLevel < requiredMainServerForNext;

  return {
    nextLevel: Math.min(MAIN_SERVER_MAX_LEVEL, building.level + 1),
    isMaxLevel,
    energyCost,
    dataCost,
    cryptoCost,
    creditsCost,
    durationSec,
    formattedDuration: formatUpgradeTime(durationSec),
    requiresMainServerUpgrade,
    requiredMainServerLevel: requiredMainServerForNext,
  };
}

export function calculateSkipUpgradeCreditCost(remainingSeconds: number): number {
  if (remainingSeconds <= 0) return 0;
  return Math.max(5, Math.ceil(remainingSeconds / 3));
}