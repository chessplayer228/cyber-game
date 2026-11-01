import React, { useState, useEffect } from 'react';
import { CommandBase } from './components/CommandBase';
import { FactionsView } from './components/5MegacorpFactions';
import { PvpMatchmakingView } from './components/PvpMatchmakingView';
import { ClansView } from './components/ClansView';
import { HackingMinigame, HackingMinigameType } from './components/HackingMinigame';
import { MOCK_RIVALS, PvpOpponent } from './components/PvpBattleModal';
import { LanguageCode } from './utils/i18n';
import {
  initializeBuildings,
  calculateProductionMetrics,
  BuildingState,
  ResourceState,
} from './utils/idleResourceEngine';
import {
  Terminal,
  Shield,
  Swords,
  Users,
  Building2,
  Zap,
  Database,
  Cpu,
  Coins,
  Globe,
} from 'lucide-react';

export const App: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>('ru');
  const [activeTab, setActiveTab] = useState<'base' | 'factions' | 'pvp' | 'clans' | 'hack'>('base');

  const [resources, setResources] = useState<ResourceState>({
    energy: 500,
    data: 450,
    crypto: 200,
    credits: 1200,
    energyCap: 2000,
    dataCap: 2000,
    cryptoCap: 1000,
    creditsCap: 10000,
    lastSyncedAt: Date.now(),
  });

  const [buildings, setBuildings] = useState<BuildingState[]>(() => initializeBuildings());
  const [unlockedDecor, setUnlockedDecor] = useState<string[]>(['rack-unit-01']);
  const [activeHackingOpponent, setActiveHackingOpponent] = useState<PvpOpponent | null>(null);
  const [activeHackingType, setActiveHackingType] = useState<HackingMinigameType>('icebreaker');
  const [nowMs, setNowMs] = useState<number>(Date.now());

  // Passive production ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setNowMs(now);

      setResources((prev) => {
        const deltaSec = (now - prev.lastSyncedAt) / 1000;
        if (deltaSec < 1) return prev;

        const metrics = calculateProductionMetrics(buildings);
        const energyGain = (metrics.energyPerHour / 3600) * deltaSec;
        const dataGain = (metrics.dataPerHour / 3600) * deltaSec;
        const cryptoGain = (metrics.cryptoPerHour / 3600) * deltaSec;
        const creditsGain = (metrics.creditsPerHour / 3600) * deltaSec;

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
            className="ml-2 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white"
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

        {activeTab === 'factions' && (
          <FactionsView
            selectedFactionId="aegis_security"
            lang={lang}
            onSelectFaction={() => {}}
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
            currentClan={null}
            userCredits={resources.credits}
            onJoinClan={() => {}}
            onCreateClan={() => {}}
            onDonateCredits={() => {}}
          />
        )}

        {activeTab === 'hack' && (
          <HackingMinigame
            opponent={activeHackingOpponent}
            gameType={activeHackingType}
            onComplete={(victory) => {
              if (victory) {
                setResources((r) => ({ ...r, credits: r.credits + 250, data: r.data + 150 }));
              }
              setActiveTab('pvp');
            }}
            onCancel={() => setActiveTab('pvp')}
          />
        )}
      </main>

      {/* Minimal Bottom TabBar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-900 bg-black/95 backdrop-blur-md">
        <div className="max-w-md mx-auto grid grid-cols-5 py-2 px-2">
          {[
            { id: 'base', label: lang === 'ru' ? 'База' : 'Base', icon: Building2 },
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
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  isActive ? 'text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
                <span className="text-[10px] mt-1 font-mono tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
