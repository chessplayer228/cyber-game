import React from 'react';
import { Server, Shield, Cpu, Radio, Zap, Terminal } from 'lucide-react';

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
  const getIcon = () => {
    switch (type) {
      case 'main_server':
        return <Server className="w-5 h-5 text-zinc-300" />;
      case 'cooling_plant':
        return <Zap className="w-5 h-5 text-zinc-300" />;
      case 'data_miner':
        return <Cpu className="w-5 h-5 text-zinc-300" />;
      case 'uplink_antenna':
        return <Radio className="w-5 h-5 text-zinc-300" />;
      case 'defense_turret':
        return <Shield className="w-5 h-5 text-zinc-300" />;
      default:
        return <Terminal className="w-5 h-5 text-zinc-300" />;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg">
      <div className="transition-all duration-300">
        {getIcon()}
      </div>
      <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-zinc-950 border border-zinc-800 rounded text-[9px] font-mono text-zinc-400">
        L{level}
      </div>
      {isUpgrading && (
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      )}
    </div>
  );
};
