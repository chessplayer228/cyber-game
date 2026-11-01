import React, { useEffect, useRef, useState } from 'react';
import { PvpOpponent } from './PvpBattleModal';
import {
  Activity,
  Check,
  Circle,
  Delete,
  Grid,
  ShieldAlert,
  Terminal,
  Unlock,
  X,
} from 'lucide-react';

export type HackingMinigameType = 'icebreaker' | 'datanode' | 'synapse';

export interface HackingMinigameProps {
  opponent: PvpOpponent | null;
  gameType?: HackingMinigameType;
  onComplete: (victory: boolean) => void;
  onCancel: () => void;
}

interface GuessRecord {
  code: string;
  exactMatches: number;
  misplacedMatches: number;
}

const MAX_ICEBREAKER_ATTEMPTS = 5;

function generateSecret4DigitCode(): string {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const picked: string[] = [];
  while (picked.length < 4) {
    const idx = Math.floor(Math.random() * digits.length);
    picked.push(digits[idx]);
    digits.splice(idx, 1);
  }
  return picked.join('');
}

function evaluateIcebreakerGuess(
  secret: string,
  guess: string
): { exactMatches: number; misplacedMatches: number } {
  let exactMatches = 0;
  let misplacedMatches = 0;

  for (let i = 0; i < 4; i++) {
    if (guess[i] === secret[i]) {
      exactMatches++;
    } else if (secret.includes(guess[i])) {
      misplacedMatches++;
    }
  }
  return { exactMatches, misplacedMatches };
}

export const IcebreakerMinigame: React.FC<{
  onResult: (won: boolean) => void;
}> = ({ onResult }) => {
  const [secretCode, setSecretCode] = useState<string>(() => generateSecret4DigitCode());
  const [currentInput, setCurrentInput] = useState<string>('');
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  useEffect(() => {
    setSecretCode(generateSecret4DigitCode());
    setCurrentInput('');
    setHistory([]);
    setStatus('playing');
  }, []);

  const handleDigitPress = (digit: string) => {
    if (status !== 'playing' || currentInput.length >= 4 || currentInput.includes(digit)) return;
    setCurrentInput((prev) => prev + digit);
  };

  const handleBackspace = () => {
    if (status !== 'playing') return;
    setCurrentInput((prev) => prev.slice(0, -1));
  };

  const handleSubmitGuess = () => {
    if (status !== 'playing' || currentInput.length !== 4) return;

    const { exactMatches, misplacedMatches } = evaluateIcebreakerGuess(
      secretCode,
      currentInput
    );
    const nextHistory = [
      ...history,
      { code: currentInput, exactMatches, misplacedMatches },
    ];
    setHistory(nextHistory);
    setCurrentInput('');

    if (exactMatches === 4) {
      setStatus('won');
      setTimeout(() => onResult(true), 850);
    } else if (nextHistory.length >= MAX_ICEBREAKER_ATTEMPTS) {
      setStatus('lost');
      setTimeout(() => onResult(false), 1100);
    }
  };

  const attemptsRemaining = MAX_ICEBREAKER_ATTEMPTS - history.length;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono">
        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Exact</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-500 inline-block" />
            <span>Wrong Place</span>
          </span>
        </div>
        <span className="font-bold text-zinc-900 dark:text-zinc-100">
          {attemptsRemaining}/{MAX_ICEBREAKER_ATTEMPTS} Tries
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {Array.from({ length: MAX_ICEBREAKER_ATTEMPTS }).map((_, rowIdx) => {
          const record = history[rowIdx];
          const isCurrentRow = rowIdx === history.length && status === 'playing';

          const pegs: Array<'exact' | 'misplaced' | 'none'> = [];
          if (record) {
            for (let i = 0; i < record.exactMatches; i++) pegs.push('exact');
            for (let i = 0; i < record.misplacedMatches; i++) pegs.push('misplaced');
            while (pegs.length < 4) pegs.push('none');
          } else {
            pegs.push('none', 'none', 'none', 'none');
          }

          return (
            <div
              key={rowIdx}
              className={`px-3 py-2 rounded-xl border flex items-center justify-between transition-colors ${
                isCurrentRow
                  ? 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-200'
                  : record
                  ? 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800'
                  : 'bg-zinc-50/50 dark:bg-zinc-950/40 border-zinc-200/60 dark:border-zinc-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono text-zinc-400 w-5">
                  #{rowIdx + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const digitChar = record
                      ? record.code[slotIdx]
                      : isCurrentRow
                      ? currentInput[slotIdx] || ''
                      : '';

                    return (
                      <div
                        key={slotIdx}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center font-mono text-sm font-bold tabular-nums ${
                          record
                            ? 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50'
                            : isCurrentRow && digitChar
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent'
                            : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {digitChar || '·'}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                {pegs.map((pegType, pegIdx) => {
                  if (pegType === 'exact') {
                    return (
                      <span
                        key={pegIdx}
                        className="w-3 h-3 rounded-full bg-emerald-500 inline-block"
                      />
                    );
                  }
                  if (pegType === 'misplaced') {
                    return (
                      <span
                        key={pegIdx}
                        className="w-3 h-3 rounded-full border-2 border-amber-500 inline-block"
                      />
                    );
                  }
                  return (
                    <Circle
                      key={pegIdx}
                      className="w-3 h-3 text-zinc-300 dark:text-zinc-700"
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {status !== 'playing' && (
        <div
          className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-between ${
            status === 'won'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            {status === 'won' ? (
              <>
                <Unlock className="w-4 h-4" />
                CIPHER CRACKED
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                LOCKOUT · CODE WAS {secretCode}
              </>
            )}
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 pt-1 select-none">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => {
          const isUsedInDraft = currentInput.includes(digit);
          return (
            <button
              key={digit}
              type="button"
              disabled={isUsedInDraft || status !== 'playing'}
              onClick={() => handleDigitPress(digit)}
              className={`h-12 rounded-xl font-mono text-base font-bold border transition-colors ${
                isUsedInDraft
                  ? 'bg-zinc-100 dark:bg-zinc-950 text-zinc-300 dark:text-zinc-700 border-zinc-200 dark:border-zinc-800 cursor-not-allowed'
                  : 'bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-[0.98] text-zinc-950 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-2xs'
              }`}
            >
              {digit}
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleBackspace}
          disabled={status !== 'playing' || currentInput.length === 0}
          className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
        >
          <Delete className="w-4 h-4" />
          <span>DEL</span>
        </button>

        <button
          type="button"
          disabled={currentInput.includes('0') || status !== 'playing'}
          onClick={() => handleDigitPress('0')}
          className={`h-12 rounded-xl font-mono text-base font-bold border transition-colors ${
            currentInput.includes('0')
              ? 'bg-zinc-100 dark:bg-zinc-950 text-zinc-300 dark:text-zinc-700 border-zinc-200 dark:border-zinc-800 cursor-not-allowed'
              : 'bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-[0.98] text-zinc-950 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-2xs'
          }`}
        >
          0
        </button>

        <button
          type="button"
          onClick={handleSubmitGuess}
          disabled={status !== 'playing' || currentInput.length !== 4}
          className="h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-mono font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-35"
        >
          <Check className="w-4 h-4" />
          <span>ENTER</span>
        </button>
      </div>
    </div>
  );
};

export const DataNodeMinigame: React.FC<{
  onResult: (won: boolean) => void;
}> = ({ onResult }) => {
  const SEQUENCE_LENGTH = 4;
  const [sequence, setSequence] = useState<number[]>([]);
  const [activeFlashNode, setActiveFlashNode] = useState<number | null>(null);
  const [phase, setPhase] = useState<'memorize' | 'input' | 'won' | 'lost'>('memorize');
  const [userSelection, setUserSelection] = useState<number[]>([]);

  useEffect(() => {
    const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const picked: number[] = [];
    while (picked.length < SEQUENCE_LENGTH) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool[idx]);
      pool.splice(idx, 1);
    }
    setSequence(picked);
    setUserSelection([]);
    setPhase('memorize');

    const timers: number[] = [];
    picked.forEach((nodeId, stepIdx) => {
      timers.push(
        window.setTimeout(() => setActiveFlashNode(nodeId), 450 + stepIdx * 650)
      );
      timers.push(
        window.setTimeout(() => setActiveFlashNode(null), 450 + stepIdx * 650 + 420)
      );
    });

    timers.push(
      window.setTimeout(() => {
        setActiveFlashNode(null);
        setPhase('input');
      }, 450 + picked.length * 650 + 150)
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const handleTileTap = (nodeIdx: number) => {
    if (phase !== 'input' || userSelection.includes(nodeIdx)) return;

    const expectedNode = sequence[userSelection.length];
    const nextSelection = [...userSelection, nodeIdx];
    setUserSelection(nextSelection);

    if (nodeIdx !== expectedNode) {
      setPhase('lost');
      setTimeout(() => onResult(false), 950);
      return;
    }

    if (nextSelection.length === SEQUENCE_LENGTH) {
      setPhase('won');
      setTimeout(() => onResult(true), 850);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
        <span className="text-zinc-600 dark:text-zinc-400">
          {phase === 'memorize'
            ? 'Memorize flashing node sequence...'
            : phase === 'input'
            ? 'Tap nodes in exact sequence'
            : phase === 'won'
            ? 'DATA-NODE SYNCHRONIZED'
            : 'SEQUENCE CORRUPTED'}
        </span>
        <span className="font-bold text-zinc-950 dark:text-zinc-50">
          {userSelection.length}/{SEQUENCE_LENGTH}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {Array.from({ length: 9 }).map((_, idx) => {
          const isFlashing = activeFlashNode === idx;
          const pickedOrder = userSelection.indexOf(idx);
          const isPicked = pickedOrder !== -1;

          return (
            <button
              key={idx}
              type="button"
              disabled={phase !== 'input' || isPicked}
              onClick={() => handleTileTap(idx)}
              className={`h-20 rounded-2xl border font-mono text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all select-none ${
                isFlashing
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent scale-[1.03]'
                  : isPicked
                  ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-700 dark:text-emerald-300'
                  : 'bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer'
              }`}
            >
              <span>N-0{idx + 1}</span>
              {isPicked && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 text-[10px]">
                  #{pickedOrder + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const SynapseMinigame: React.FC<{
  onResult: (won: boolean) => void;
}> = ({ onResult }) => {
  const TOTAL_STAGES = 3;
  const [stage, setStage] = useState<number>(1);
  const [cursorPos, setCursorPos] = useState<number>(10);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const posRef = useRef<number>(10);
  const dirRef = useRef<1 | -1>(1);

  const targetStart = stage === 1 ? 36 : stage === 2 ? 40 : 43;
  const targetEnd = stage === 1 ? 64 : stage === 2 ? 60 : 57;

  useEffect(() => {
    if (status !== 'playing') return;

    let animId: number;
    let lastTime = performance.now();
    const speedPerSec = stage === 1 ? 85 : stage === 2 ? 115 : 145;

    const step = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      let next = posRef.current + dirRef.current * speedPerSec * dt;
      if (next >= 96) {
        next = 96;
        dirRef.current = -1;
      } else if (next <= 4) {
        next = 4;
        dirRef.current = 1;
      }
      posRef.current = next;
      setCursorPos(next);
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [stage, status]);

  const handleLockSignal = () => {
    if (status !== 'playing') return;
    const hit = cursorPos >= targetStart && cursorPos <= targetEnd;

    if (hit) {
      if (stage >= TOTAL_STAGES) {
        setStatus('won');
        setTimeout(() => onResult(true), 800);
      } else {
        setStage((prev) => prev + 1);
      }
    } else {
      setStatus('lost');
      setTimeout(() => onResult(false), 950);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
        <span className="text-zinc-600 dark:text-zinc-400">
          Lock signal inside target window
        </span>
        <span className="font-bold text-zinc-950 dark:text-zinc-50">
          Stage {stage}/{TOTAL_STAGES}
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
        <div className="relative h-12 w-full rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 overflow-hidden">
          <div
            className="absolute top-0 bottom-0 bg-emerald-500/25 border-x-2 border-emerald-500"
            style={{
              left: `${targetStart}%`,
              width: `${targetEnd - targetStart}%`,
            }}
          />
          <div
            className="absolute top-1 bottom-1 w-2.5 -ml-1.25 rounded-md bg-zinc-950 dark:bg-white shadow-sm"
            style={{ left: `${cursorPos}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((idx) => (
            <span
              key={idx}
              className={`h-2 w-8 rounded-full ${
                idx < stage || status === 'won'
                  ? 'bg-emerald-500'
                  : idx === stage
                  ? 'bg-zinc-900 dark:bg-zinc-100'
                  : 'bg-zinc-300 dark:bg-zinc-800'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={status !== 'playing'}
          onClick={handleLockSignal}
          className="w-full py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-mono font-bold tracking-wider uppercase cursor-pointer"
        >
          {status === 'won'
            ? 'SYNAPSE LOCKED'
            : status === 'lost'
            ? 'SIGNAL MISSED'
            : 'LOCK SIGNAL PULSE'}
        </button>
      </div>
    </div>
  );
};

export const HackingMinigame: React.FC<HackingMinigameProps> = ({
  opponent,
  gameType = 'icebreaker',
  onComplete,
  onCancel,
}) => {
  if (!opponent) return null;

  const metaByGame: Record<
    HackingMinigameType,
    { label: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    icebreaker: { label: 'ICEBREAKER', icon: Terminal },
    datanode: { label: 'DATA-NODE', icon: Grid },
    synapse: { label: 'SYNAPSE', icon: Activity },
  };

  const activeMeta = metaByGame[gameType];
  const HeaderIcon = activeMeta.icon;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hacking-minigame-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl flex flex-col">
        <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
            <HeaderIcon className="w-4 h-4" />
            <span id="hacking-minigame-title">
              {activeMeta.label} · @{opponent.username}
            </span>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          {gameType === 'icebreaker' && <IcebreakerMinigame onResult={onComplete} />}
          {gameType === 'datanode' && <DataNodeMinigame onResult={onComplete} />}
          {gameType === 'synapse' && <SynapseMinigame onResult={onComplete} />}
        </div>
      </div>
    </div>
  );
};