import React, { useState } from 'react';
import { CheckCircle2, Clock, Gift, ShieldAlert, Sparkles, Terminal, Trophy } from 'lucide-react';
import { LanguageCode } from '../utils/i18n';

export interface QuestItem {
  id: string;
  type: 'daily' | 'story' | 'milestone';
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  progress: number;
  maxProgress: number;
  rewardCredits: number;
  rewardData: number;
  isClaimed: boolean;
  categoryIcon?: string;
}

export const INITIAL_QUESTS: QuestItem[] = [
  {
    id: 'q-daily-1',
    type: 'daily',
    title: 'Decrypt Target Node',
    titleRu: 'Взлом сетевого узла',
    description: 'Successfully complete 1 Icebreaker or Data-Node hacking minigame.',
    descriptionRu: 'Успешно завершите хотя бы 1 мини-игру со взломом.',
    progress: 0,
    maxProgress: 1,
    rewardCredits: 150,
    rewardData: 80,
    isClaimed: false,
  },
  {
    id: 'q-daily-2',
    type: 'daily',
    title: 'Sub-level Expansion',
    titleRu: 'Модернизация периметра',
    description: 'Upgrade any base structure or core module to the next tier.',
    descriptionRu: 'Повысьте уровень любого модуля базы.',
    progress: 1,
    maxProgress: 1,
    rewardCredits: 200,
    rewardData: 100,
    isClaimed: false,
  },
  {
    id: 'q-story-1',
    type: 'story',
    title: 'Mainframe Overclock',
    titleRu: 'Разгон главного сервера',
    description: 'Upgrade the Main Server Frame to Level 2 or higher.',
    descriptionRu: 'Улучшите Главный Серверный Узел до уровня 2.',
    progress: 1,
    maxProgress: 2,
    rewardCredits: 500,
    rewardData: 350,
    isClaimed: false,
  },
  {
    id: 'q-story-2',
    type: 'story',
    title: 'Corporation Allegiance',
    titleRu: 'Синдикатный контракт',
    description: 'Select or pledge your loyalty to one of the 5 Megacorps.',
    descriptionRu: 'Выберите мегакорпорацию для получения технологических бонусов.',
    progress: 1,
    maxProgress: 1,
    rewardCredits: 300,
    rewardData: 150,
    isClaimed: false,
  },
  {
    id: 'q-milestone-1',
    type: 'milestone',
    title: 'Grid Dominance: PvP',
    titleRu: 'Сетевое доминирование',
    description: 'Win 3 PvP rival breach operations against other syndicates.',
    descriptionRu: 'Победите в 3 сетевых PvP-рейдах против других игроков.',
    progress: 1,
    maxProgress: 3,
    rewardCredits: 1000,
    rewardData: 600,
    isClaimed: false,
  },
];

interface QuestsViewProps {
  quests: QuestItem[];
  lang: LanguageCode;
  onClaimQuestReward: (questId: string) => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({
  quests,
  lang,
  onClaimQuestReward,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'story' | 'milestone'>('all');

  const filteredQuests = quests.filter((q) =>
    activeTab === 'all' ? true : q.type === activeTab
  );

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase font-mono">
              {lang === 'ru' ? 'Синдикатные Задания' : 'Operational Bounties'}
            </h2>
            <p className="text-xs text-zinc-500">
              {lang === 'ru'
                ? 'Выполняйте контракты и получайте кредиты и пакеты данных'
                : 'Fulfill syndicate contracts to claim credits & data packets'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: lang === 'ru' ? 'Все' : 'All' },
          { id: 'daily', label: lang === 'ru' ? 'Ежедневные' : 'Daily' },
          { id: 'story', label: lang === 'ru' ? 'Сюжетные' : 'Story' },
          { id: 'milestone', label: lang === 'ru' ? 'Рубежи' : 'Milestones' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                isActive
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'bg-zinc-950 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Quest List */}
      <div className="space-y-2.5">
        {filteredQuests.map((quest) => {
          const isCompleted = quest.progress >= quest.maxProgress;
          const progressPct = Math.min(
            100,
            Math.round((quest.progress / quest.maxProgress) * 100)
          );

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-xl border transition-all ${
                quest.isClaimed
                  ? 'bg-zinc-950/40 border-zinc-900 opacity-60'
                  : isCompleted
                  ? 'bg-zinc-950 border-emerald-500/30 shadow-sm'
                  : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
                      {quest.type}
                    </span>
                    <h3 className="text-xs font-semibold text-zinc-100">
                      {lang === 'ru' ? quest.titleRu : quest.title}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {lang === 'ru' ? quest.descriptionRu : quest.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-medium text-emerald-400">
                    +{quest.rewardCredits} CR
                  </div>
                  <div className="text-[10px] font-mono text-sky-400">
                    +{quest.rewardData} Data
                  </div>
                </div>
              </div>

              {/* Progress bar and button */}
              <div className="mt-3 pt-3 border-t border-zinc-900 flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>{lang === 'ru' ? 'Прогресс' : 'Progress'}</span>
                    <span>
                      {quest.progress} / {quest.maxProgress}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCompleted ? 'bg-emerald-500' : 'bg-zinc-600'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  {quest.isClaimed ? (
                    <span className="text-xs font-mono text-zinc-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
                      {lang === 'ru' ? 'Получено' : 'Claimed'}
                    </span>
                  ) : (
                    <button
                      disabled={!isCompleted}
                      onClick={() => onClaimQuestReward(quest.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold cursor-pointer shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      {lang === 'ru' ? 'Забрать' : 'Claim'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
