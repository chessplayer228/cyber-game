import React from 'react';

interface BuildingIsometricArtProps {
  type: string;
  level: number;
  isUpgrading?: boolean;
}

export const BuildingIsometricArt: React.FC<BuildingIsometricArtProps> = ({
  type,
  level,
  isUpgrading = false,
}) => {
  const getVisual = () => {
    switch (type) {
      case 'main_server':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Isometric Pedestal */}
            <polygon points="50,20 85,38 50,56 15,38" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <polygon points="15,38 50,56 50,82 15,64" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
            <polygon points="85,38 50,56 50,82 85,64" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            {/* Central Monolith Tower */}
            <polygon points="50,10 72,22 50,34 28,22" fill="#27272a" stroke="#52525b" strokeWidth="1.2" />
            <polygon points="28,22 50,34 50,58 28,46" fill="#18181b" stroke="#3f3f46" strokeWidth="1.2" />
            <polygon points="72,22 50,34 50,58 72,46" fill="#27272a" stroke="#3f3f46" strokeWidth="1.2" />
            {/* Server LED Slots */}
            <line x1="34" y1="29" x2="44" y2="34" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="34" y1="36" x2="44" y2="41" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="34" y1="43" x2="44" y2="48" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="56" y1="34" x2="66" y2="29" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="56" y1="41" x2="66" y2="36" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Top Core Crystal */}
            <polygon points="50,4 58,9 50,14 42,9" fill="#10b981" opacity="0.9" />
          </svg>
        );

      case 'cooling_plant':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base platform */}
            <polygon points="50,22 85,40 50,58 15,40" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <polygon points="15,40 50,58 50,78 15,60" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
            <polygon points="85,40 50,58 50,78 85,60" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            {/* Cryo Turbine Cylinder */}
            <ellipse cx="50" cy="36" rx="20" ry="10" fill="#27272a" stroke="#38bdf8" strokeWidth="1.5" />
            <path d="M30,36 v22 c0,5.5 9,10 20,10 s20,-4.5 20,-10 v-22" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Internal Frost Core Fan */}
            <ellipse cx="50" cy="36" rx="12" ry="6" fill="#0c4a6e" />
            <line x1="50" y1="30" x2="50" y2="42" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="42" y1="36" x2="58" y2="36" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Cooling pipes */}
            <path d="M22,48 Q32,54 36,46" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
            <path d="M78,48 Q68,54 64,46" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'data_miner':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base slab */}
            <polygon points="50,22 84,39 50,56 16,39" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <polygon points="16,39 50,56 50,76 16,59" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
            <polygon points="84,39 50,56 50,76 84,59" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            {/* ASIC Farm Racks Left */}
            <polygon points="34,18 48,25 38,31 24,24" fill="#27272a" stroke="#f59e0b" strokeWidth="1.2" />
            <polygon points="24,24 38,31 38,50 24,43" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
            <polygon points="48,25 38,31 38,50 48,44" fill="#27272a" stroke="#52525b" strokeWidth="1.2" />
            {/* ASIC Farm Racks Right */}
            <polygon points="62,25 76,32 66,38 52,31" fill="#27272a" stroke="#f59e0b" strokeWidth="1.2" />
            <polygon points="52,31 66,38 66,57 52,50" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
            <polygon points="76,32 66,38 66,57 76,51" fill="#27272a" stroke="#52525b" strokeWidth="1.2" />
            {/* Micro Gold Microchip Matrix */}
            <circle cx="31" cy="34" r="1.5" fill="#f59e0b" />
            <circle cx="31" cy="40" r="1.5" fill="#f59e0b" />
            <circle cx="59" cy="41" r="1.5" fill="#f59e0b" />
            <circle cx="59" cy="47" r="1.5" fill="#f59e0b" />
          </svg>
        );

      case 'uplink_antenna':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Triangular Tripod Pad */}
            <polygon points="50,28 80,44 50,60 20,44" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <polygon points="20,44 50,60 50,78 20,62" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
            <polygon points="80,44 50,60 50,78 80,62" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            {/* Mast Column */}
            <line x1="50" y1="46" x2="50" y2="24" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
            {/* Angled Radar Dish */}
            <ellipse cx="50" cy="20" rx="22" ry="11" transform="rotate(-25 50 20)" fill="#27272a" stroke="#38bdf8" strokeWidth="1.8" />
            <ellipse cx="50" cy="20" rx="14" ry="7" transform="rotate(-25 50 20)" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            {/* Receiver Sub-reflector Horn */}
            <line x1="45" y1="18" x2="38" y2="8" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="38" cy="8" r="2.5" fill="#38bdf8" />
          </svg>
        );

      case 'defense_turret':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Hardened Bunker Hexagon */}
            <polygon points="50,22 84,39 50,56 16,39" fill="#18181b" stroke="#ef4444" strokeWidth="1.2" />
            <polygon points="16,39 50,56 50,78 16,61" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
            <polygon points="84,39 50,56 50,78 84,61" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            {/* Armor Plates */}
            <polygon points="50,14 74,26 50,38 26,26" fill="#27272a" stroke="#71717a" strokeWidth="1.5" />
            <polygon points="26,26 50,38 50,50 26,38" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
            <polygon points="74,26 50,38 50,50 74,38" fill="#27272a" stroke="#52525b" strokeWidth="1.2" />
            {/* Dual Railgun Barrels */}
            <line x1="46" y1="28" x2="20" y2="16" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="54" y1="32" x2="28" y2="20" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            {/* Firewall Core Emitter */}
            <circle cx="50" cy="24" r="3" fill="#ef4444" />
          </svg>
        );

      case 'offensive_rig':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base platform */}
            <polygon points="50,20 86,38 50,56 14,38" fill="#18181b" stroke="#a855f7" strokeWidth="1.5" />
            <polygon points="14,38 50,56 50,78 14,60" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
            <polygon points="86,38 50,56 50,78 86,60" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            {/* Quantum Zero-day Core Pillar */}
            <polygon points="50,12 68,22 50,32 32,22" fill="#27272a" stroke="#a855f7" strokeWidth="1.5" />
            <polygon points="32,22 50,32 50,52 32,42" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
            <polygon points="68,22 50,32 50,52 68,42" fill="#27272a" stroke="#52525b" strokeWidth="1.2" />
            {/* Floating Exploit Prism */}
            <polygon points="50,4 58,10 50,16 42,10" fill="#c084fc" />
            <line x1="50" y1="16" x2="50" y2="22" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="2,2" />
          </svg>
        );

      case 'shadow_terminal':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base Platform */}
            <polygon points="50,22 84,39 50,56 16,39" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <polygon points="16,39 50,56 50,76 16,59" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
            <polygon points="84,39 50,56 50,76 84,59" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            {/* Dark Pool Vault Safe */}
            <polygon points="50,16 70,26 50,36 30,26" fill="#27272a" stroke="#eab308" strokeWidth="1.5" />
            <polygon points="30,26 50,36 50,54 30,44" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
            <polygon points="70,26 50,36 50,54 70,44" fill="#27272a" stroke="#52525b" strokeWidth="1.2" />
            {/* Vault Dial & Holo Screen */}
            <circle cx="40" cy="40" r="4" fill="#18181b" stroke="#eab308" strokeWidth="1.5" />
            <polygon points="60,28 66,25 66,35 60,38" fill="#eab308" opacity="0.8" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="50,22 82,38 50,54 18,38" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <polygon points="18,38 50,54 50,76 18,60" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
            <polygon points="82,38 50,54 50,76 82,60" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <polygon points="50,14 68,23 50,32 32,23" fill="#27272a" stroke="#71717a" strokeWidth="1.2" />
            <polygon points="32,23 50,32 50,48 32,39" fill="#18181b" stroke="#3f3f46" strokeWidth="1.2" />
            <polygon points="68,23 50,32 50,48 68,39" fill="#27272a" stroke="#3f3f46" strokeWidth="1.2" />
          </svg>
        );
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-zinc-950/70 border border-zinc-800/80 rounded-xl overflow-hidden p-1.5 transition-all duration-300 group-hover:border-zinc-700">
      {getVisual()}

      {/* Level Tag */}
      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/85 border border-zinc-800 rounded font-mono text-[9px] text-zinc-300 tracking-wider">
        LVL {level}
      </div>

      {/* Upgrading Status Aura */}
      {isUpgrading && (
        <div className="absolute top-1 right-1 flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded px-1 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-[8px] font-mono text-amber-400 uppercase">UPG</span>
        </div>
      )}
    </div>
  );
};
