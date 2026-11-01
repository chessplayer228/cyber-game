export type LanguageCode = 'en' | 'ru';

export interface Translations {
  commandBaseTitle: string;
  enterBasementBtn: string;
  upgradingStatus: string;
  readyStatus: string;
  insufficientStatus: string;
  skipTimerButton: string;
  upgradeButton: string;
  inspect3dButton: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    commandBaseTitle: 'Command Operations',
    enterBasementBtn: 'Sub-level Facilities',
    upgradingStatus: 'COMPILING UPGRADE',
    readyStatus: 'OPERATIONAL',
    insufficientStatus: 'INSUFFICIENT RESOURCES',
    skipTimerButton: 'Accelerate Cycle',
    upgradeButton: 'Upgrade Module',
    inspect3dButton: 'Inspect Schematics',
  },
  ru: {
    commandBaseTitle: 'Командный Узел',
    enterBasementBtn: 'Подуровень Базы',
    upgradingStatus: 'ИДЕТ УЛУЧШЕНИЕ',
    readyStatus: 'ГОТОВ К УЛУЧШЕНИЮ',
    insufficientStatus: 'НЕДОСТАТОЧНО РЕСУРСОВ',
    skipTimerButton: 'Ускорить цикл',
    upgradeButton: 'Улучшить модуль',
    inspect3dButton: 'Схема узла',
  },
};
