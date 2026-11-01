import React from 'react';

export interface SkinItem {
  id: string;
  name: string;
  nameRu: string;
  title: string;
  titleRu: string;
  gender: 'female' | 'male';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  priceStars: number;
  priceCredits?: number;
  descriptionRu: string;
  quoteRu: string;
  bonusTextRu: string;
  accentColor: string;
}

export const CHARACTER_SKINS: SkinItem[] = [
  {
    id: 'skin_valkyrie_zero',
    name: 'Valkyrie Zero',
    nameRu: 'Валькирия-0',
    title: 'Void Operative',
    titleRu: 'Элитный оперативник Бездны',
    gender: 'female',
    rarity: 'legendary',
    priceStars: 150,
    descriptionRu: 'Голографический боевой комбинезон, импланты нейро-рефлексов и стилизованный фиолетовый визор.',
    quoteRu: '«Шифрование взломано за доли секунды. Приготовься к отключению питания.»',
    bonusTextRu: '+15% скорость хакинга · +10% защита базы',
    accentColor: '#c084fc',
  },
  {
    id: 'skin_nyx_phantom',
    name: 'Nyx Phantom',
    nameRu: 'Никс «Фантом»',
    title: 'Neural Syndicate Empress',
    titleRu: 'Теневой брокер Черного Рынка',
    gender: 'female',
    rarity: 'legendary',
    priceStars: 250,
    descriptionRu: 'Элегантный кибер-корсет из углеродного волокна, платиновые волосы и светящиеся золотые нано-нити.',
    quoteRu: '«Каждая транзакция оставляет след. Я владею всеми этими следами.»',
    bonusTextRu: '+20% доход кредитов · +15% криптодобыча',
    accentColor: '#f59e0b',
  },
  {
    id: 'skin_cipher_kassandra',
    name: 'Kassandra Void',
    nameRu: 'Кассандра Войд',
    title: 'Zero-Day Architect',
    titleRu: 'Сетевой диверсант Мегакорпораций',
    gender: 'female',
    rarity: 'epic',
    priceStars: 95,
    descriptionRu: 'Укороченная кожаная тактическая куртка, неоновый изумрудный кибер-глаз и стильная каре-стрижка.',
    quoteRu: '«Фаерволлы для дилетантов. Для меня это просто открытая дверь.»',
    bonusTextRu: '+10% атака в PvP-рейдах',
    accentColor: '#10b981',
  },
  {
    id: 'skin_neon_siren',
    name: 'Siren 0.9',
    nameRu: 'Сирена 0.9',
    title: 'Subnet Glitch Diva',
    titleRu: 'Сетевая дива темного сектора',
    gender: 'female',
    rarity: 'rare',
    priceStars: 50,
    descriptionRu: 'Минималистичный аугментированный образ с розовым тактическим козырьком и стильными перчатками.',
    quoteRu: '«Музыка битов заглушит любые тревоги.»',
    bonusTextRu: '+5% лимит хранилищ',
    accentColor: '#f43f5e',
  },
  {
    id: 'skin_default_agent',
    name: 'Operative Zero',
    nameRu: 'Оператор Зеро',
    title: 'Grid Initiate',
    titleRu: 'Базовый терминальный агент',
    gender: 'male',
    rarity: 'common',
    priceStars: 0,
    priceCredits: 0,
    descriptionRu: 'Стандартный защитный монохромный костюм кибер-наемника с базовым интерфейсом тактического шлема.',
    quoteRu: '«Приказ принят. Подключаюсь к протоколу.»',
    bonusTextRu: 'Базовые характеристики',
    accentColor: '#71717a',
  },
];

export const CharacterFullIllustration: React.FC<{
  skinId: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ skinId, size = 'lg' }) => {
  const skin = CHARACTER_SKINS.find((s) => s.id === skinId) || CHARACTER_SKINS[0];

  const renderCharacterSvg = () => {
    switch (skin.id) {
      case 'skin_valkyrie_zero':
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            {/* Background cyber aura */}
            <circle cx="100" cy="180" r="90" fill="#a855f7" opacity="0.08" />
            <polygon points="100,20 180,180 100,340 20,180" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
            
            {/* Holographic Long Ponytail Hair */}
            <path d="M100,60 Q145,75 130,135 Q115,180 125,230" fill="none" stroke="#c084fc" strokeWidth="14" strokeLinecap="round" />
            <path d="M100,60 Q150,85 135,145 Q125,190 130,240" fill="none" stroke="#e9d5ff" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
            
            {/* Slender Body Silhouette - High-Tech Bodysuit */}
            {/* Legs */}
            <path d="M85,210 L75,320 L72,360 L85,362 L93,310 L95,220 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <path d="M115,210 L125,320 L128,360 L115,362 L107,310 L105,220 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            {/* High-tech Armored Boots */}
            <path d="M70,300 L76,300 L72,360 L86,360 L88,320" fill="#09090b" stroke="#c084fc" strokeWidth="1.5" />
            <path d="M130,300 L124,300 L128,360 L114,360 L112,320" fill="#09090b" stroke="#c084fc" strokeWidth="1.5" />
            
            {/* Torso & Cyber Corset */}
            <path d="M78,125 C75,150 82,190 85,215 L115,215 C118,190 125,150 122,125 Z" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
            <path d="M86,135 Q100,160 114,135 L110,195 Q100,205 90,195 Z" fill="#09090b" stroke="#c084fc" strokeWidth="1.5" />
            {/* Glowing nano-stripes */}
            <line x1="100" y1="135" x2="100" y2="200" stroke="#c084fc" strokeWidth="2.5" />
            <line x1="88" y1="160" x2="112" y2="160" stroke="#c084fc" strokeWidth="1.5" opacity="0.8" />

            {/* Slender Arms & Gauntlets */}
            <path d="M78,125 L55,185 L58,240" fill="none" stroke="#27272a" strokeWidth="8" strokeLinecap="round" />
            <path d="M122,125 L145,185 L142,240" fill="none" stroke="#27272a" strokeWidth="8" strokeLinecap="round" />
            {/* Gauntlets */}
            <rect x="50" y="200" width="12" height="35" rx="3" fill="#18181b" stroke="#c084fc" strokeWidth="1.5" />
            <rect x="138" y="200" width="12" height="35" rx="3" fill="#18181b" stroke="#c084fc" strokeWidth="1.5" />

            {/* Neck & Head */}
            <rect x="94" y="98" width="12" height="15" rx="2" fill="#fbcfe8" />
            <ellipse cx="100" cy="85" rx="18" ry="22" fill="#fce7f3" />
            {/* Visor / Eye augmented glasses */}
            <polygon points="84,80 116,80 112,90 88,90" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1.5" />
            {/* Stylish Hair Front Strands */}
            <path d="M82,75 Q90,105 84,120" fill="none" stroke="#c084fc" strokeWidth="5" strokeLinecap="round" />
            <path d="M118,75 Q110,105 116,120" fill="none" stroke="#c084fc" strokeWidth="5" strokeLinecap="round" />
            <circle cx="100" cy="85" r="2" fill="#ffffff" />
          </svg>
        );

      case 'skin_nyx_phantom':
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            {/* Golden Dark Syndicate Aura */}
            <circle cx="100" cy="180" r="95" fill="#f59e0b" opacity="0.08" />
            <circle cx="100" cy="180" r="75" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6,4" opacity="0.3" />
            
            {/* Platinum Hair Flowing Down */}
            <path d="M100,55 Q60,75 70,150 Q75,220 65,270" fill="none" stroke="#f4f4f5" strokeWidth="12" strokeLinecap="round" />
            <path d="M100,55 Q140,75 130,150 Q125,220 135,270" fill="none" stroke="#f4f4f5" strokeWidth="12" strokeLinecap="round" />
            <path d="M100,55 Q65,85 75,160 Q80,230 70,280" fill="none" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            
            {/* Slender Silhouette in Luxury Trench / Dress */}
            <path d="M85,210 L80,330 L76,365 L88,365 L96,310 L96,220 Z" fill="#09090b" stroke="#71717a" strokeWidth="1.5" />
            <path d="M115,210 L120,330 L124,365 L112,365 L104,310 L104,220 Z" fill="#09090b" stroke="#71717a" strokeWidth="1.5" />
            
            {/* Corset & Gold Embroidered Vest */}
            <path d="M78,125 C74,155 80,195 84,220 L116,220 C120,195 126,155 122,125 Z" fill="#18181b" stroke="#f59e0b" strokeWidth="1.8" />
            <polygon points="90,135 110,135 105,195 95,195" fill="#09090b" stroke="#fbbf24" strokeWidth="1.5" />
            
            {/* Gold Shoulder Mantle */}
            <path d="M68,120 Q100,110 132,120 L128,145 Q100,135 72,145 Z" fill="#27272a" stroke="#f59e0b" strokeWidth="1.5" />
            
            {/* Arms & Holographic Data Orb in hand */}
            <path d="M75,128 L60,190 L75,230" fill="none" stroke="#27272a" strokeWidth="7" strokeLinecap="round" />
            <path d="M125,128 L140,190 L125,230" fill="none" stroke="#27272a" strokeWidth="7" strokeLinecap="round" />
            <circle cx="100" cy="235" r="9" fill="#f59e0b" opacity="0.9" />
            <circle cx="100" cy="235" r="14" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />

            {/* Elegant Face with Visor Choker */}
            <ellipse cx="100" cy="85" rx="17" ry="21" fill="#fef2f2" />
            <line x1="90" y1="98" x2="110" y2="98" stroke="#f59e0b" strokeWidth="3" />
            {/* Eyes */}
            <ellipse cx="94" cy="84" rx="2.5" ry="1.5" fill="#f59e0b" />
            <ellipse cx="106" cy="84" rx="2.5" ry="1.5" fill="#f59e0b" />
          </svg>
        );

      case 'skin_cipher_kassandra':
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            <circle cx="100" cy="180" r="90" fill="#10b981" opacity="0.08" />
            {/* Bob Cut Hair Emerald */}
            <path d="M80,70 Q100,50 120,70 L125,115 Q100,105 75,115 Z" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
            
            {/* Tactical Leather Crop Jacket */}
            <path d="M80,125 L65,190 L70,240" fill="none" stroke="#18181b" strokeWidth="8" strokeLinecap="round" />
            <path d="M120,125 L135,190 L130,240" fill="none" stroke="#18181b" strokeWidth="8" strokeLinecap="round" />
            <path d="M78,125 L122,125 L115,175 L85,175 Z" fill="#09090b" stroke="#10b981" strokeWidth="1.8" />
            {/* Midriff & Tech Belt */}
            <rect x="88" y="175" width="24" height="20" fill="#fed7aa" />
            <rect x="80" y="195" width="40" height="12" rx="2" fill="#27272a" stroke="#10b981" strokeWidth="1.5" />
            
            {/* Slim Cargo Pants */}
            <path d="M82,207 L76,325 L74,360 L86,360 L94,310 L94,220 Z" fill="#18181b" stroke="#047857" strokeWidth="1.5" />
            <path d="M118,207 L124,325 L126,360 L114,360 L106,310 L106,220 Z" fill="#18181b" stroke="#047857" strokeWidth="1.5" />

            {/* Face & Cyber Eyepiece */}
            <ellipse cx="100" cy="85" rx="17" ry="21" fill="#ffedd5" />
            <circle cx="94" cy="83" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.5" />
            <circle cx="106" cy="83" r="2" fill="#18181b" />
          </svg>
        );

      case 'skin_neon_siren':
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            <circle cx="100" cy="180" r="90" fill="#f43f5e" opacity="0.08" />
            {/* Pink Hair Bun */}
            <circle cx="100" cy="55" r="16" fill="#be123c" stroke="#f43f5e" strokeWidth="2" />
            {/* Silhouette */}
            <path d="M82,125 C80,155 84,195 86,220 L114,220 C116,195 120,155 118,125 Z" fill="#18181b" stroke="#f43f5e" strokeWidth="1.5" />
            <ellipse cx="100" cy="85" rx="17" ry="20" fill="#ffe4e6" />
            <polygon points="86,78 114,78 110,88 90,88" fill="#f43f5e" />
            <path d="M85,220 L78,340 L88,360 L96,320 Z" fill="#09090b" stroke="#4c0519" strokeWidth="1.5" />
            <path d="M115,220 L122,340 L112,360 L104,320 Z" fill="#09090b" stroke="#4c0519" strokeWidth="1.5" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            {/* Male Operative Zero Minimalist Armor */}
            <circle cx="100" cy="180" r="90" fill="#3f3f46" opacity="0.08" />
            {/* Tactical Helmet */}
            <polygon points="100,50 125,65 120,105 100,115 80,105 75,65" fill="#18181b" stroke="#71717a" strokeWidth="2" />
            <polygon points="85,75 115,75 110,88 90,88" fill="#38bdf8" />
            {/* Armored Chest & Pauldrons */}
            <polygon points="65,120 135,120 125,190 75,190" fill="#27272a" stroke="#52525b" strokeWidth="2" />
            <rect x="80" y="195" width="40" height="20" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
            {/* Legs */}
            <path d="M78,215 L72,345 L86,365 L94,325 L94,225 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            <path d="M122,215 L128,345 L114,365 L106,325 L106,225 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {renderCharacterSvg()}
    </div>
  );
};
