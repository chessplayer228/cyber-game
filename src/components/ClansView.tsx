import React, { useEffect, useState } from 'react';
import {
  Coins,
  Plus,
  Shield,
  Users,
} from 'lucide-react';

export interface ClanMember {
  id: string;
  username: string;
  role: 'Commander' | 'Executive' | 'Operative';
  reputationPoints: number;
  contributedCredits: number;
}

export interface SyndicateClan {
  id: string;
  tag: string;
  name: string;
  motto: string;
  level: number;
  treasuryCredits: number;
  nextLevelTargetCredits: number;
  memberCount: number;
  maxMembers: number;
  totalReputation: number;
  perkLabel: string;
  members: ClanMember[];
}

export const INITIAL_SYNDICATE_CLANS: SyndicateClan[] = [
  {
    id: 'clan_blackwall',
    tag: 'BLK',
    name: 'Blackwall Sovereign Directorate',
    motto: 'Autonomous grid supremacy through cryptographic containment.',
    level: 6,
    treasuryCredits: 2450,
    nextLevelTargetCredits: 3000,
    memberCount: 24,
    maxMembers: 30,
    totalReputation: 38400,
    perkLabel: '+8% Resource Yield · +10% Defense Rating',
    members: [
      {
        id: 'm-1',
        username: 'valkyrie_zero',
        role: 'Commander',
        reputationPoints: 1640,
        contributedCredits: 820,
      },
      {
        id: 'm-2',
        username: 'kael_blackwall',
        role: 'Executive',
        reputationPoints: 1490,
        contributedCredits: 640,
      },
      {
        id: 'm-3',
        username: 'nyx_protocol',
        role: 'Operative',
        reputationPoints: 1320,
        contributedCredits: 410,
      },
    ],
  },
  {
    id: 'clan_aegis',
    tag: 'AEG',
    name: 'Aegis Orbital Defense Corp',
    motto: 'Hardened perimeter security and zero-breach infrastructure.',
    level: 5,
    treasuryCredits: 1780,
    nextLevelTargetCredits: 2400,
    memberCount: 19,
    maxMembers: 25,
    totalReputation: 29150,
    perkLabel: '+12% Base Defense · -5% Upgrade Time',
    members: [
      {
        id: 'm-4',
        username: 'soren_vanguard',
        role: 'Commander',
        reputationPoints: 1180,
        contributedCredits: 590,
      },
      {
        id: 'm-5',
        username: 'cipher_ghost',
        role: 'Executive',
        reputationPoints: 1090,
        contributedCredits: 430,
      },
    ],
  },
  {
    id: 'clan_zk_cartel',
    tag: 'ZKC',
    name: 'Zero-Knowledge Liquidity Cartel',
    motto: 'Offshore dark-pool arbitrage and high-frequency credit minting.',
    level: 4,
    treasuryCredits: 1120,
    nextLevelTargetCredits: 1800,
    memberCount: 15,
    maxMembers: 25,
    totalReputation: 21800,
    perkLabel: '+10% Credit Minting · +8% PvP Siphon',
    members: [
      {
        id: 'm-6',
        username: 'vex_ledger',
        role: 'Commander',
        reputationPoints: 1260,
        contributedCredits: 520,
      },
    ],
  },
];

const CLANS_STORAGE_KEY = 'cyber_syndicate_clans_v1';

export interface UseClansSystemOptions {
  username: string;
  playerReputation: number;
  playerCredits: number;
  onDeductCredits: (amount: number) => void;
  onGrantReputation: (rpAmount: number, toastMsg: string) => void;
}

export function useClansSystem({
  username,
  playerReputation,
  playerCredits,
  onDeductCredits,
  onGrantReputation,
}: UseClansSystemOptions) {
  const [clans, setClans] = useState<SyndicateClan[]>(() => {
    try {
      const saved = localStorage.getItem(CLANS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.clans) && parsed.clans.length > 0) {
          return parsed.clans;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_SYNDICATE_CLANS;
  });

  const [joinedClanId, setJoinedClanId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(CLANS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.joinedClanId ?? 'clan_blackwall';
      }
    } catch {
      // Fallback
    }
    return 'clan_blackwall';
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        CLANS_STORAGE_KEY,
        JSON.stringify({ clans, joinedClanId })
      );
    } catch {
      // Ignore storage write errors
    }
  }, [clans, joinedClanId]);

  const activeClan = clans.find((c) => c.id === joinedClanId) || null;

  const joinClan = (clanId: string) => {
    setJoinedClanId(clanId);
    const target = clans.find((c) => c.id === clanId);
    if (target) {
      onGrantReputation(0, `Joined Clan [${target.tag}] ${target.name}`);
    }
  };

  const leaveClan = () => {
    if (!activeClan) return;
    const prevName = activeClan.name;
    setJoinedClanId(null);
    onGrantReputation(0, `Departed ${prevName}`);
  };

  const contributeToClanTreasury = (creditAmount: number) => {
    if (!activeClan || playerCredits < creditAmount || creditAmount <= 0) return;

    onDeductCredits(creditAmount);
    const rpEarned = Math.max(5, Math.round(creditAmount * 0.4));

    setClans((prev) =>
      prev.map((c) => {
        if (c.id !== activeClan.id) return c;
        const nextTreasury = c.treasuryCredits + creditAmount;
        const leveledUp = nextTreasury >= c.nextLevelTargetCredits;
        const nextLevel = leveledUp ? c.level + 1 : c.level;
        const nextTarget = leveledUp
          ? Math.round(c.nextLevelTargetCredits * 1.45)
          : c.nextLevelTargetCredits;

        const existingSelf = c.members.find((m) => m.username === username);
        const updatedMembers: ClanMember[] = existingSelf
          ? c.members.map((m) =>
              m.username === username
                ? {
                    ...m,
                    reputationPoints: playerReputation + rpEarned,
                    contributedCredits: m.contributedCredits + creditAmount,
                  }
                : m
            )
          : [
              ...c.members,
              {
                id: 'self-member',
                username,
                role: 'Operative',
                reputationPoints: playerReputation + rpEarned,
                contributedCredits: creditAmount,
              },
            ];

        return {
          ...c,
          level: nextLevel,
          treasuryCredits: leveledUp
            ? nextTreasury - c.nextLevelTargetCredits
            : nextTreasury,
          nextLevelTargetCredits: nextTarget,
          totalReputation: c.totalReputation + rpEarned,
          members: updatedMembers,
        };
      })
    );

    onGrantReputation(
      rpEarned,
      `Clan Treasury Contribution: -${creditAmount} CR · +${rpEarned} RP`
    );
  };

  const createNewClan = (tag: string, name: string, motto: string): boolean => {
    const CREATE_COST = 100;
    if (playerCredits < CREATE_COST) return false;
    const cleanTag = tag.trim().toUpperCase().slice(0, 4);
    const cleanName = name.trim();
    if (!cleanTag || !cleanName) return false;

    onDeductCredits(CREATE_COST);

    const newClan: SyndicateClan = {
      id: `clan_custom_${Date.now()}`,
      tag: cleanTag,
      name: cleanName,
      motto:
        motto.trim() || 'Independent corporate syndicate operating on the grid.',
      level: 1,
      treasuryCredits: 0,
      nextLevelTargetCredits: 1000,
      memberCount: 1,
      maxMembers: 20,
      totalReputation: playerReputation + 25,
      perkLabel: '+5% Resource Yield · +5% Defense Rating',
      members: [
        {
          id: 'self-commander',
          username,
          role: 'Commander',
          reputationPoints: playerReputation + 25,
          contributedCredits: CREATE_COST,
        },
      ],
    };

    setClans((prev) => [newClan, ...prev]);
    setJoinedClanId(newClan.id);
    onGrantReputation(
      25,
      `Founded Syndicate Clan [${newClan.tag}] ${newClan.name} (+25 RP)`
    );
    return true;
  };

  return {
    clans,
    activeClan,
    joinedClanId,
    joinClan,
    leaveClan,
    contributeToClanTreasury,
    createNewClan,
  };
}

export interface ClansViewProps {
  clans: SyndicateClan[];
  activeClan: SyndicateClan | null;
  playerCredits: number;
  onJoinClan: (clanId: string) => void;
  onLeaveClan: () => void;
  onContributeCredits: (amount: number) => void;
  onCreateClan: (tag: string, name: string, motto: string) => boolean;
}

export const ClansView: React.FC<ClansViewProps> = ({
  clans,
  activeClan,
  playerCredits,
  onJoinClan,
  onLeaveClan,
  onContributeCredits,
  onCreateClan,
}) => {
  const [subView, setSubView] = useState<'my_clan' | 'directory' | 'create'>(
    activeClan ? 'my_clan' : 'directory'
  );
  const [newTag, setNewTag] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newMotto, setNewMotto] = useState<string>('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onCreateClan(newTag, newName, newMotto);
    if (ok) {
      setNewTag('');
      setNewName('');
      setNewMotto('');
      setSubView('my_clan');
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              CORPORATE COALITION LEDGER
            </div>
            <h1 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Syndicate Clans
            </h1>
          </div>

          {activeClan && (
            <span className="px-2.5 py-1 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-mono font-bold">
              [{activeClan.tag}] LVL {activeClan.level}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setSubView('my_clan')}
            className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              subView === 'my_clan'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Clan HQ
          </button>
          <button
            type="button"
            onClick={() => setSubView('directory')}
            className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              subView === 'directory'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Directory
          </button>
          <button
            type="button"
            onClick={() => setSubView('create')}
            className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              subView === 'create'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            + Charter
          </button>
        </div>
      </div>

      {subView === 'my_clan' && (
        <>
          {!activeClan ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center gap-3">
              <Users className="w-8 h-8 text-zinc-400" />
              <div>
                <h2 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
                  No Active Syndicate Clan
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Enlist in an existing corporate syndicate or charter your own to unlock shared passive perks.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubView('directory')}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-mono font-bold cursor-pointer"
              >
                Browse Clan Directory
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        [{activeClan.tag}]
                      </span>
                      <span>·</span>
                      <span>TIER {activeClan.level} SYNDICATE</span>
                    </div>
                    <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mt-0.5">
                      {activeClan.name}
                    </h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      {activeClan.motto}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onLeaveClan}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-rose-500 cursor-pointer shrink-0"
                  >
                    Leave
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>ACTIVE PERK</span>
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {activeClan.perkLabel}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                    <span className="text-zinc-500">
                      Clan Treasury → Level {activeClan.level + 1}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {activeClan.treasuryCredits.toLocaleString()} /{' '}
                      {activeClan.nextLevelTargetCredits.toLocaleString()} CR
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-950 border border-zinc-300/60 dark:border-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (activeClan.treasuryCredits /
                              activeClan.nextLevelTargetCredits) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-zinc-500">
                    Fund Treasury (Earns RP)
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[25, 100].map((amt) => {
                      const canAfford = playerCredits >= amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          disabled={!canAfford}
                          onClick={() => onContributeCredits(amt)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                            canAfford
                              ? 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 cursor-pointer'
                              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                          }`}
                        >
                          <Coins className="w-3 h-3 text-amber-500" />
                          <span>+{amt} CR</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    EXECUTIVE ROSTER
                  </span>
                  <span className="text-zinc-500">
                    {activeClan.memberCount}/{activeClan.maxMembers} Operatives
                  </span>
                </div>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {activeClan.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-3.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-zinc-950 dark:text-zinc-50">
                          @{member.username}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          {member.role} · {member.reputationPoints.toLocaleString()} RP
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100">
                          {member.contributedCredits} CR
                        </div>
                        <div className="text-[10px] text-zinc-500">Contributed</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {subView === 'directory' && (
        <div className="flex flex-col gap-3">
          {clans.map((clan) => {
            const isMember = activeClan?.id === clan.id;
            return (
              <div
                key={clan.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        [{clan.tag}]
                      </span>
                      <span>·</span>
                      <span>LVL {clan.level}</span>
                      <span>·</span>
                      <span>
                        {clan.memberCount}/{clan.maxMembers} Members
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mt-0.5">
                      {clan.name}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {clan.motto}
                    </p>
                  </div>

                  <div className="text-right font-mono tabular-nums shrink-0">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {clan.totalReputation.toLocaleString()} RP
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      {clan.perkLabel.split('·')[0]}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-500">
                    Treasury: {clan.treasuryCredits.toLocaleString()} CR
                  </span>

                  <button
                    type="button"
                    disabled={isMember}
                    onClick={() => {
                      onJoinClan(clan.id);
                      setSubView('my_clan');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-colors ${
                      isMember
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 cursor-default'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 cursor-pointer'
                    }`}
                  >
                    {isMember ? 'Enlisted' : 'Enlist'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {subView === 'create' && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3.5"
        >
          <div>
            <h2 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
              Charter New Syndicate Clan
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Register a new corporate syndicate on the global ledger. Requires 100 Credits.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono text-zinc-500">
              CLAN TAG (3-4 CHARS)
            </label>
            <input
              type="text"
              maxLength={4}
              required
              placeholder="SYN"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value.toUpperCase())}
              className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-mono font-bold text-zinc-950 dark:text-zinc-50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono text-zinc-500">
              CORPORATE DESIGNATION
            </label>
            <input
              type="text"
              maxLength={36}
              required
              placeholder="Apex Grid Collective"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs font-bold text-zinc-950 dark:text-zinc-50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono text-zinc-500">
              OPERATIONAL DIRECTIVE / MOTTO
            </label>
            <input
              type="text"
              maxLength={80}
              placeholder="Zero-latency dominance across all sectors."
              value={newMotto}
              onChange={(e) => setNewMotto(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-950 dark:text-zinc-50"
            />
          </div>

          <button
            type="submit"
            disabled={playerCredits < 100 || !newTag.trim() || !newName.trim()}
            className={`w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
              playerCredits >= 100 && newTag.trim() && newName.trim()
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 cursor-pointer'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Register Syndicate Charter (100 CR)</span>
          </button>
        </form>
      )}
    </section>
  );
};