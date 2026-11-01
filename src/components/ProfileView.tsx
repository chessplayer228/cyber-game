import React, { useState } from 'react';
import {
  CHARACTER_SKINS,
  CharacterFullIllustration,
  SkinItem,
} from './CharacterSkins';
import { LanguageCode } from '../utils/i18n';
import {
  Check,
  CheckCircle2,
  Crown,
  Lock,
  Shield,
  Sparkles,
  Star,
  Swords,
  User,
  Zap,
} from 'lucide-react';

interface ProfileViewProps {
  equippedSkinId: string;
  unlockedSkinIds: string[];
  lang: LanguageCode;
  playerAttackPower: number;
  playerDefensePower: number;
  playerReputation: number;
  onEquipSkin: (skinId: string) => void;
  onBuySkinWithStars: (skin: SkinItem) => void;
  onOpenDonateShop: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  equippedSkinId,
  unlockedSkinIds,
  lang,
  playerAttackPower,
  playerDefensePower,
  playerReputation,
  onEquipSkin,
  onBuySkinWithStars,
  onOpenDonateShop,
}) => {
  const [selectedInspectSkinId, setSelectedInspectSkinId] = useState<string>(equippedSkinId);

  const currentInspectSkin =
    CHARACTER_SKINS.find((s) => s.id === selectedInspectSkinId) || CHARACTER_SKINS[0];
  const isUnlocked = unlockedSkinIds.includes(currentInspectSkin.id);
  const isEquipped = equippedSkinId === currentInspectSkin.id;

  return (
    <div className="space-y-4">
      {/* Top Banner with Stats & Donate Shortcut */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700/80 p-1 overflow-hidden relative">
            <CharacterFullIllustration skinId={equippedSkinId} />
            <div className="absolute bottom-0 right-0 p-0.5 bg-black/80 rounded-tl">
              <Crown className="w-2.5 h-2.5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-zinc-100">Operator_Zero</h2>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                PRO
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              {currentInspectSkin.titleRu}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDonateShop}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5 hover:from-amber-500/30 transition-all cursor-pointer shadow-sm"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{lang === 'ru' ? 'Магазин Звёзд' : 'Stars Vault'}</span>
        </button>
      </div>

      {/* Main Full-Height Character Showcase Area (FOMO Fighters Style) */}
      <div className="relative rounded-2xl bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-black border border-zinc-800 p-5 overflow-hidden flex flex-col items-center">
        {/* Glow ambient background based on skin accent */}
        <div
          className="absolute -top-20 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentInspectSkin.accentColor }}
        />

        {/* Character Title & Rarity Badge */}
        <div className="z-10 text-center space-y-1 mb-2">
          <div className="flex items-center justify-center gap-2">
            <span
              className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border tracking-widest font-semibold"
              style={{
                color: currentInspectSkin.accentColor,
                borderColor: `${currentInspectSkin.accentColor}50`,
                backgroundColor: `${currentInspectSkin.accentColor}15`,
              }}
            >
              {currentInspectSkin.rarity}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {currentInspectSkin.gender === 'female' ? 'Женский облик' : 'Мужской облик'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white tracking-wide">
            {currentInspectSkin.nameRu}
          </h3>
          <p className="text-xs text-zinc-400 italic max-w-xs">
            {currentInspectSkin.quoteRu}
          </p>
        </div>

        {/* Full-Height 2D Avatar Figure */}
        <div className="w-48 h-80 my-2 z-10 transition-transform duration-300 hover:scale-105">
          <CharacterFullIllustration skinId={currentInspectSkin.id} />
        </div>

        {/* Perks & Stats */}
        <div className="z-10 w-full max-w-sm p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center space-y-2">
          <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentInspectSkin.bonusTextRu}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-zinc-800/80">
            <div>
              <div className="text-zinc-500 text-[10px]">АТАКА</div>
              <div className="text-zinc-200 font-bold">{playerAttackPower}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px]">ЗАЩИТА</div>
              <div className="text-zinc-200 font-bold">{playerDefensePower}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px]">РЕПУТАЦИЯ</div>
              <div className="text-zinc-200 font-bold">{playerReputation} RP</div>
            </div>
          </div>
        </div>

        {/* Action Button: Equip or Buy for Stars */}
        <div className="z-10 mt-4 w-full max-w-sm">
          {isEquipped ? (
            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs flex items-center justify-center gap-2 cursor-default"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>ОБЛИК ЭКИПИРОВАН</span>
            </button>
          ) : isUnlocked ? (
            <button
              onClick={() => onEquipSkin(currentInspectSkin.id)}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold font-mono text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95"
            >
              <span>НАДЕТЬ ОБЛИК</span>
            </button>
          ) : (
            <button
              onClick={() => onBuySkinWithStars(currentInspectSkin)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold font-mono text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95"
            >
              <Star className="w-4 h-4 fill-zinc-950" />
              <span>РАЗБЛОКИРОВАТЬ ЗА {currentInspectSkin.priceStars} ⭐️ STARS</span>
            </button>
          )}
        </div>
      </div>

      {/* Wardrobe Carousel Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
          <span>ГАРДЕРОБ ОПЕРАТИВНИКА ({CHARACTER_SKINS.length})</span>
          <span className="text-[11px] text-zinc-500">Нажмите для примерки</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {CHARACTER_SKINS.map((skin) => {
            const unlocked = unlockedSkinIds.includes(skin.id);
            const equipped = equippedSkinId === skin.id;
            const isSelected = selectedInspectSkinId === skin.id;

            return (
              <button
                key={skin.id}
                onClick={() => setSelectedInspectSkinId(skin.id)}
                className={`relative p-2 rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-zinc-900 border-zinc-400 shadow-md ring-1 ring-zinc-400'
                    : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="w-10 h-14 relative flex items-center justify-center overflow-hidden">
                  <CharacterFullIllustration skinId={skin.id} size="sm" />
                </div>

                <span className="text-[10px] font-mono font-medium text-zinc-200 truncate w-full text-center">
                  {skin.nameRu}
                </span>

                {equipped ? (
                  <span className="text-[8px] font-mono text-emerald-400 font-bold">
                    АКТИВЕН
                  </span>
                ) : unlocked ? (
                  <span className="text-[8px] font-mono text-zinc-500">
                    ОТКРЫТ
                  </span>
                ) : (
                  <div className="flex items-center gap-0.5 text-[8px] font-mono text-amber-400 font-semibold">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <span>{skin.priceStars}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
