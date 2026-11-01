import React, { useState, useEffect } from 'react';
import { CommandBase } from './components/CommandBase';
import { FactionSelection, FactionId } from './components/5MegacorpFactions';
import { PvpMatchmakingView } from './components/PvpMatchmakingView';
import { ClansView, useClansSystem } from './components/ClansView';
import { HackingMinigame, HackingMinigameType } from './components/HackingMinigame';
import { QuestsView, INITIAL_QUESTS, QuestItem } from './components/QuestsView';
import { MOCK_RIVALS, PvpOpponent } from './components/PvpBattleModal';
import { LanguageCode } from './utils/i18n';
import {
  buildComplete30BuildingsState,
  calculateProductionMetrics,
  BuildingState,
  ResourceState,
} from './utils/idleResourceEngine';
import {
  Shield,
  Swords,
  Users,
  Building2,
  Zap,
  Database,
  Cpu,
  Coins,
  Trophy,
} from 'lucide-react';

const STORAGE_KEY_RESOURCES = 'cyber_syndicate_resources_v1';
const STORAGE_KEY_BUILDINGS = 'cyber_syndicate_buildings_v1';
const STORAGE_KEY_FACTION = 'cyber_syndicate_faction_v1';
const STORAGE_KEY_QUESTS = 'cyber_syndicate_quests_v1';
const STORAGE_KEY_DECOR = 'cyber_syndicate_decor_v1';

export const App: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>('ru');
  const [activeTab, setActiveTab] = useState<'base' | 'quests' | 'factions' | 'pvp' | 'clans' | 'hack'>('base');

  // Load saved faction
  const [selectedFaction, setSelectedFaction] = useState<FactionId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FACTION);
      if (saved) return saved as FactionId;
    } catch {}
    return 'aegis_security';
  });

  // Load saved resources with offline calculation
  const [resources, setResources] = useState<ResourceState>(() => {
    const defaultRes: ResourceState = {
      energy: 500,
      data: 450,
      crypto: 200,
      credits: 1200,
      energyCap: 2000,
      dataCap: 2000,
      cryptoCap: 1000,
      creditsCap: 10000,
      lastSyncedAt: Date.now(),
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESOURCES);
      if (saved) {
        const parsed: ResourceState = JSON.parse(saved);
        const now = Date.now();
        const deltaSec = Math.max(0, Math.min(86400, (now - (parsed.lastSyncedAt || now)) / 1000));

        // Grant offline production if buildings exist
        const savedBuildings = localStorage.getItem(STORAGE_KEY_BUILDINGS);
        if (savedBuildings) {
          const bList: BuildingState[] = JSON.parse(savedBuildings);
          const metrics = calculateProductionMetrics(bList);
          return {
            ...parsed,
            energy: Math.min(parsed.energyCap, Math.round(parsed.energy + (metrics.ratesPerHour.energy / 3600) * deltaSec)),
            data: Math.min(parsed.dataCap, Math.round(parsed.data + (metrics.ratesPerHour.data / 3600) * deltaSec)),
            crypto: Math.min(parsed.cryptoCap, Math.round(parsed.crypto + (metrics.ratesPerHour.crypto / 3600) * deltaSec)),
            credits: Math.min(parsed.creditsCap, Math.round(parsed.credits + (metrics.ratesPerHour.credits / 3600) * deltaSec)),
            lastSyncedAt: now,
          };
        }
        return { ...parsed, lastSyncedAt: now };
      }
    } catch {}
    return defaultRes;
  });

  // Load saved buildings
  const [buildings, setBuildings] = useState<BuildingState[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BUILDINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return buildComplete30BuildingsState(parsed);
        }
      }
    } catch {}
    return buildComplete30BuildingsState();
  });

  // Load saved decor
  const [unlockedDecor, setUnlockedDecor] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DECOR);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return ['rack-unit-01'];
  });

  // Load saved quests
  const [quests, setQuests] = useState<QuestItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUESTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_QUESTS;
  });

  const [activeHackingOpponent, setActiveHackingOpponent] = useState<PvpOpponent | null>(null);
  const [activeHackingType, setActiveHackingType] = useState<HackingMinigameType>('icebreaker');
  const [nowMs, setNowMs] = useState<number>(Date.now());

  // Save state effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(resources));
    } catch {}
  }, [resources]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUILDINGS, JSON.stringify(buildings));
    } catch {}
  }, [buildings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FACTION, selectedFaction);
    } catch {}
  }, [selectedFaction]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(quests));
    } catch {}
  }, [quests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DECOR, JSON.stringify(unlockedDecor));
    } catch {}
  }, [unlockedDecor]);

  // Integrated clans state hook
  const {
    clans,
    activeClan,
    joinClan,
    leaveClan,
    contributeToClanTreasury,
    createNewClan,
  } = useClansSystem({
    username: 'Operator_Zero',
    playerReputation: 120,
    playerCredits: resources.credits,
    onDeductCredits: (amount: number) => {
      setResources((prev) => ({
        ...prev,
        credits: Math.max(0, prev.credits - amount),
      }));
    },
    onGrantReputation: () => {},
  });

  // Passive production ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setNowMs(now);

      setResources((prev) => {
        const deltaSec = (now - prev.lastSyncedAt) / 1000;
        if (deltaSec < 1) return prev;

        const metrics = calculateProductionMetrics(buildings);
        const energyGain = (metrics.ratesPerHour.energy / 3600) * deltaSec;
        const dataGain = (metrics.ratesPerHour.data / 3600) * deltaSec;
        const cryptoGain = (metrics.ratesPerHour.crypto / 3600) * deltaSec;
        const creditsGain = (metrics.ratesPerHour.credits / 3600) * deltaSec;

        return {
          ...prev,
          energy: Math.min(prev.energyCap, Math.round(prev.energy + energyGain)),
          data: Math.min(prev.dataCap, Math.round(prev.data + dataGain)),
          crypto: Math.min(prev.cryptoCap, Math.round(prev.crypto + cryptoGain)),
          credits: Math.min(prev.creditsCap, Math.round(prev.credits + creditsGain)),
          lastSyncedAt: now,
        };
      });

      // Complete finished building upgrades
      setBuildings((prev) =>
        prev.map((b) => {
          if (b.isUpgrading && b.upgradeFinishesAt && now >= b.upgradeFinishesAt) {
            return {
              ...b,
              level: b.level + 1,
              isUpgrading: false,
              upgradeStartedAt: null,
              upgradeFinishesAt: null,
            };
          }
          return b;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [buildings]);

  const handleUpgradeBuilding = (type: string) => {
    setBuildings((prev) =>
      prev.map((b) => {
        if (b.type === type && !b.isUpgrading) {
          const duration = 15; // 15 seconds demo timer
          return {
            ...b,
            isUpgrading: true,
            upgradeStartedAt: Date.now(),
            upgradeFinishesAt: Date.now() + duration * 1000,
          };
        }
        return b;
      })
    );

    // Update quest progress
    setQuests((prev) =>
      prev.map((q) =>
        q.id === 'q-daily-2' ? { ...q, progress: Math.min(q.maxProgress, q.progress + 1) } : q
      )
    );
  };

  const handleSkipBuildingTimer = (type: string) => {
    setBuildings((prev) =>
      prev.map((b) => {
        if (b.type === type && b.isUpgrading) {
          return {
            ...b,
            level: b.level + 1,
            isUpgrading: false,
            upgradeStartedAt: null,
            upgradeFinishesAt: null,
          };
        }
        return b;
      })
    );
  };

  const startHacking = (opponent: PvpOpponent | null, gameType?: HackingMinigameType) => {
    setActiveHackingOpponent(opponent || MOCK_RIVALS[0]);
    setActiveHackingType(gameType || 'icebreaker');
    setActiveTab('hack');
  };

  const handleClaimQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.isClaimed || quest.progress < quest.maxProgress) return;

    setResources((prev) => ({
      ...prev,
      credits: prev.credits + quest.rewardCredits,
      data: Math.min(prev.dataCap, prev.data + quest.rewardData),
    }));

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q))
    );
  };

  const uncompletedQuestsCount = quests.filter(
    (q) => !q.isClaimed && q.progress >= q.maxProgress
  ).length;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-zinc-800">
      {/* Minimal Top Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-900 bg-black/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            CYBER // SYNDICATE
          </span>
        </div>

        {/* Resources bar */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 text-zinc-400" title="Energy">
            <Zap className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-200">{resources.energy}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400" title="Data">
            <Database className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-200">{resources.data}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400" title="Crypto">
            <Cpu className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-200">{resources.crypto}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400" title="Credits">
            <Coins className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-200">{resources.credits}</span>
          </div>

          <button
            onClick={() => setLang((l) => (l === 'ru' ? 'en' : 'ru'))}
            className="ml-2 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white cursor-pointer"
          >
            {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 overflow-y-auto max-w-4xl w-full mx-auto p-4">
        {activeTab === 'base' && (
          <CommandBase
            buildings={buildings}
            resources={resources}
            nowMs={nowMs}
            lang={lang}
            unlockedDecor={unlockedDecor}
            shieldUntilMs={null}
            completedBrokerTrades={[]}
            onUpgradeBuilding={handleUpgradeBuilding}
            onSkipBuildingTimer={handleSkipBuildingTimer}
            onPurchaseDecor={(item) => {
              if (resources.credits >= item.costCredits) {
                setResources((r) => ({ ...r, credits: r.credits - item.costCredits }));
                setUnlockedDecor((d) => [...d, item.id]);
              }
            }}
          />
        )}

        {activeTab === 'quests' && (
          <QuestsView
            quests={quests}
            lang={lang}
            onClaimQuestReward={handleClaimQuest}
          />
        )}

        {activeTab === 'factions' && (
          <FactionSelection
            selectedFaction={selectedFaction}
            lang={lang}
            onSelectFaction={(factionId) => {
              setSelectedFaction(factionId);
              setQuests((prev) =>
                prev.map((q) =>
                  q.id === 'q-story-2' ? { ...q, progress: 1 } : q
                )
              );
            }}
          />
        )}

        {activeTab === 'pvp' && (
          <PvpMatchmakingView
            rivals={MOCK_RIVALS}
            playerAttackPower={150}
            lastSelectedMinigame={activeHackingType}
            onQuickMatchmake={() => startHacking(MOCK_RIVALS[0])}
            onAttackTarget={(target, forcedType) => startHacking(target, forcedType)}
            onInspectDossier={() => {}}
          />
        )}

        {activeTab === 'clans' && (
          <ClansView
            clans={clans}
            activeClan={activeClan}
            playerCredits={resources.credits}
            onJoinClan={joinClan}
            onLeaveClan={leaveClan}
            onContributeCredits={contributeToClanTreasury}
            onCreateClan={createNewClan}
          />
        )}

        {activeTab === 'hack' && (
          <HackingMinigame
            opponent={activeHackingOpponent}
            gameType={activeHackingType}
            onComplete={(victory) => {
              if (victory) {
                setResources((r) => ({ ...r, credits: r.credits + 250, data: r.data + 150 }));
                setQuests((prev) =>
                  prev.map((q) => {
                    if (q.id === 'q-daily-1') return { ...q, progress: 1 };
                    if (q.id === 'q-milestone-1') return { ...q, progress: Math.min(q.maxProgress, q.progress + 1) };
                    return q;
                  })
                );
              }
              setActiveTab('pvp');
            }}
            onCancel={() => setActiveTab('pvp')}
          />
        )}
      </main>

      {/* Minimal Bottom TabBar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-900 bg-black/95 backdrop-blur-md">
        <div className="max-w-md mx-auto grid grid-cols-6 py-2 px-1">
          {[
            { id: 'base', label: lang === 'ru' ? 'База' : 'Base', icon: Building2 },
            { id: 'quests', label: lang === 'ru' ? 'Квесты' : 'Quests', icon: Trophy, badge: uncompletedQuestsCount },
            { id: 'factions', label: lang === 'ru' ? 'Фракции' : 'Factions', icon: Shield },
            { id: 'pvp', label: 'PvP', icon: Swords },
            { id: 'clans', label: lang === 'ru' ? 'Кланы' : 'Clans', icon: Users },
            { id: 'hack', label: lang === 'ru' ? 'Взлом' : 'Hack', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                  isActive ? 'text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-black">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[9px] mt-1 font-mono tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
