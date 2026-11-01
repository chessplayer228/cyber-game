import React from 'react';
import { HackingMinigameType } from './HackingMinigame';
import { PvpOpponent } from './PvpBattleModal';
import { Activity, Grid, Swords, Terminal } from 'lucide-react';

export interface PvpMatchmakingViewProps {
  rivals: PvpOpponent[];
  playerAttackPower: number;
  lastSelectedMinigame: HackingMinigameType | null;
  onQuickMatchmake: () => void;
  onAttackTarget: (opponent: PvpOpponent, forcedGameType?: HackingMinigameType) => void;
  onInspectDossier: (opponent: PvpOpponent) => void;
}

const MINIGAME_PROTOCOLS: Array<{
  id: HackingMinigameType;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'icebreaker', label: 'ICEBREAKER', subtitle: '4-Digit Cipher', icon: Terminal },
  { id: 'datanode', label: 'DATA-NODE', subtitle: 'Memory Matrix', icon: Grid },
  { id: 'synapse', label: 'SYNAPSE', subtitle: 'Reflex Pulse', icon: Activity },
];

export const PvpMatchmakingView: React.FC<PvpMatchmakingViewProps> = ({
  rivals,
  playerAttackPower,
  lastSelectedMinigame,
  onQuickMatchmake,
  onAttackTarget,
  onInspectDossier,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h1 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
          PvP Sector Operations
        </h1>
        <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">
          {playerAttackPower.toLocaleString()} ATK
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3.5 shadow-sm">
        <button
          type="button"
          onClick={onQuickMatchmake}
          className="w-full py-4 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold text-sm tracking-tight flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer"
        >
          <Swords className="w-5 h-5" />
          <span>QUICK MATCHMAKE</span>
        </button>

        <div className="flex items-center justify-center gap-3">
          {MINIGAME_PROTOCOLS.map((proto) => {
            const Icon = proto.icon;
            const isHighlighted = lastSelectedMinigame === proto.id;
            return (
              <button
                key={proto.id}
                type="button"
                onClick={() => {
                  const picked = rivals[Math.floor(Math.random() * rivals.length)];
                  if (picked) onAttackTarget(picked, proto.id);
                }}
                title={`${proto.label}: ${proto.subtitle}`}
                className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer select-none ${
                  isHighlighted
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent'
                    : 'bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-mono font-bold tracking-tight">
                  {proto.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {rivals.map((opponent) => {
          const favorable = playerAttackPower >= opponent.defenseRating;
          const estCreditsLoot = Math.max(
            4,
            Math.floor(opponent.vaultBalances.credits * 0.1)
          );

          return (
            <div
              key={opponent.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                    {opponent.equippedTitle} · {opponent.reputationPoints} RP
                  </div>
                  <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                    @{opponent.username}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onInspectDossier(opponent)}
                  className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 underline cursor-pointer"
                >
                  Dossier
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500 block">Defense</span>
                  <span
                    className={`font-bold ${
                      favorable
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {opponent.defenseRating} DEF
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">Est. Credits</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    +{estCreditsLoot} CR
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onAttackTarget(opponent)}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Attack Base</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};