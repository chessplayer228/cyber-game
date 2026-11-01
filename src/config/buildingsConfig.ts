export interface BuildingConfigEntry {
  id: string;
  code: string;
  name: string;
  nameRu: string;
  subtitle: string;
  subtitleRu: string;
  description: string;
  descriptionRu: string;
  category: 'core' | 'extraction' | 'warfare' | 'finance';
  requiredMainServerLevel: number;
  passiveOutputLabel: string;
  passiveOutputLabelRu: string;
  baseCosts: {
    energy: number;
    data: number;
    crypto: number;
    credits: number;
  };
  hourlyYieldBonus: {
    energy?: number;
    data?: number;
    crypto?: number;
    credits?: number;
    attackBonus?: number;
    defenseBonus?: number;
  };
}

export type BuildingCategory = 'core' | 'extraction' | 'warfare' | 'finance';

export const BUILDINGS_CONFIG: BuildingConfigEntry[] = [
  {
    id: 'main_server',
    code: 'SRV-01',
    name: 'Main Server Frame',
    nameRu: 'Главный Серверный Узел',
    subtitle: 'Central command & network hub',
    subtitleRu: 'Центральный командный узел',
    description: 'Core computation infrastructure governing base capacity and overall bandwidth.',
    descriptionRu: 'Базовая вычислительная инфраструктура, определяющая лимиты и пропускную способность.',
    category: 'core',
    requiredMainServerLevel: 1,
    passiveOutputLabel: 'Increases base capacity & operations level',
    passiveOutputLabelRu: 'Повышает базовую вместимость и уровень операций',
    baseCosts: { energy: 100, data: 120, crypto: 50, credits: 100 },
    hourlyYieldBonus: { energy: 15, data: 25, credits: 5 },
  },
  {
    id: 'cooling_plant',
    code: 'COOL-02',
    name: 'Cryo Cooling Grid',
    nameRu: 'Криогенная Система Охлаждения',
    subtitle: 'Sub-zero thermal dissipation',
    subtitleRu: 'Термическая стабилизация серверов',
    description: 'High-efficiency thermal control ensuring high stability for overdriven rigs.',
    descriptionRu: 'Эффективный отвод тепла для поддержания стабильности узлов под нагрузкой.',
    category: 'core',
    requiredMainServerLevel: 1,
    passiveOutputLabel: '+Energy Efficiency & System Stability',
    passiveOutputLabelRu: '+Энергоэффективность и стабильность',
    baseCosts: { energy: 80, data: 60, crypto: 30, credits: 60 },
    hourlyYieldBonus: { energy: 40 },
  },
  {
    id: 'data_miner',
    code: 'EXT-01',
    name: 'Neural Miner Array',
    nameRu: 'Нейро-Майнинговый Кластер',
    subtitle: 'Automated block harvest',
    subtitleRu: 'Автоматизированный синтез крипты',
    description: 'Parallel ASICs extracting crypto fragments from distributed ledger pools.',
    descriptionRu: 'Параллельные ASIC-модули, добывающие криптографические фрагменты.',
    category: 'extraction',
    requiredMainServerLevel: 2,
    passiveOutputLabel: '+35 Crypto / hr',
    passiveOutputLabelRu: '+35 Крипты / час',
    baseCosts: { energy: 120, data: 150, crypto: 20, credits: 80 },
    hourlyYieldBonus: { crypto: 35 },
  },
  {
    id: 'uplink_antenna',
    code: 'EXT-02',
    name: 'Orbital Uplink Dish',
    nameRu: 'Спутниковая Антенна Uplink',
    subtitle: 'Encrypted satellite channel',
    subtitleRu: 'Шифрованный канал связи',
    description: 'High-throughput satellite communication channel streaming raw data feeds.',
    descriptionRu: 'Спутниковый канал высокой пропускной способности для сбора данных.',
    category: 'extraction',
    requiredMainServerLevel: 2,
    passiveOutputLabel: '+60 Data / hr',
    passiveOutputLabelRu: '+60 Данных / час',
    baseCosts: { energy: 90, data: 80, crypto: 40, credits: 70 },
    hourlyYieldBonus: { data: 60 },
  },
  {
    id: 'defense_turret',
    code: 'DEF-01',
    name: 'Hardened Firewall Grid',
    nameRu: 'Узел Активного Файрвола',
    subtitle: 'Automated perimeter countermeasure',
    subtitleRu: 'Автоматический периметр защиты',
    description: 'Dynamic packet filtering and active honeypots mitigating intruder attacks.',
    descriptionRu: 'Динамическая фильтрация пакетов и ловушки против несанкционированного доступа.',
    category: 'warfare',
    requiredMainServerLevel: 2,
    passiveOutputLabel: '+25 Base Defense Rating',
    passiveOutputLabelRu: '+25 Защиты базы',
    baseCosts: { energy: 110, data: 100, crypto: 60, credits: 90 },
    hourlyYieldBonus: { defenseBonus: 25 },
  },
  {
    id: 'offensive_rig',
    code: 'ATK-01',
    name: 'Exploit Synth Lab',
    nameRu: 'Лаборатория Эксплойтов',
    subtitle: 'Zero-day payload generation',
    subtitleRu: 'Генерация 0-day сигнатур',
    description: 'Synthesizes specialized penetration payloads and brute-force sequences.',
    descriptionRu: 'Синтез сигнатур проникновения для сетевых рейдов.',
    category: 'warfare',
    requiredMainServerLevel: 3,
    passiveOutputLabel: '+30 Attack Power',
    passiveOutputLabelRu: '+30 Силы атаки',
    baseCosts: { energy: 140, data: 180, crypto: 80, credits: 120 },
    hourlyYieldBonus: { attackBonus: 30 },
  },
  {
    id: 'shadow_terminal',
    code: 'FIN-01',
    name: 'Shadow Exchange Nexus',
    nameRu: 'Теневой Торговый Терминал',
    subtitle: 'Dark pool financial liquidity',
    subtitleRu: 'Шлюз децентрализованной ликвидности',
    description: 'Direct interface to off-grid liquidity pools and syndicate credit contracts.',
    descriptionRu: 'Прямой интерфейс к закрытым пулам ликвидности и синдикатным кредитам.',
    category: 'finance',
    requiredMainServerLevel: 3,
    passiveOutputLabel: '+18 Credits / hr',
    passiveOutputLabelRu: '+18 Кредитов / час',
    baseCosts: { energy: 160, data: 160, crypto: 100, credits: 150 },
    hourlyYieldBonus: { credits: 18 },
  },
];

export function getBuildingConfigById(type: string): BuildingConfigEntry {
  const found = BUILDINGS_CONFIG.find((b) => b.id === type);
  if (found) return found;
  return {
    id: type,
    code: type.slice(0, 4).toUpperCase(),
    name: type.replace(/_/g, ' ').toUpperCase(),
    nameRu: type.replace(/_/g, ' ').toUpperCase(),
    subtitle: 'Modular Grid Component',
    subtitleRu: 'Модульный компонент',
    description: 'Operational auxiliary installation.',
    descriptionRu: 'Вспомогательный рабочий узел.',
    category: 'core',
    requiredMainServerLevel: 1,
    passiveOutputLabel: '+Standard yield',
    passiveOutputLabelRu: '+Стандартная выработка',
    baseCosts: { energy: 50, data: 50, crypto: 25, credits: 50 },
    hourlyYieldBonus: {},
  };
}
