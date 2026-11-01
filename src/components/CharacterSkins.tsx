import React from 'react';

export interface SkinItem {
  id: string;
  name: string;
  nameRu: string;
  title: string;
  titleRu: string;
  gender: 'female' | 'male';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  currencyType: 'stars' | 'credits';
  priceStars?: number;
  priceCredits?: number;
  descriptionRu: string;
  quoteRu: string;
  bonusTextRu: string;
  accentColor: string;
  tag?: string;
}

export const CHARACTER_SKINS: SkinItem[] = [
  // ПРЕМИАЛЬНЫЕ ДОНАТНЫЕ ЗА ЗВЕЗДЫ (Пышные, чувственные, эксклюзивные - до 79 звезд)
  {
    id: 'skin_aphrodite_cyber',
    name: 'Aphrodite Neo',
    nameRu: 'Афродита Нео',
    title: 'Divine Neural Prototype',
    titleRu: 'Синтетическая Богиня Эфира',
    gender: 'female',
    rarity: 'legendary',
    currencyType: 'stars',
    priceStars: 79, // Максимальная цена 79 звезд
    tag: 'ЭКСКЛЮЗИВ 18+',
    descriptionRu: 'Пышные соблазнительные формы, микро-бикини из жидкого неонового латекса, открытое декольте и золотые нано-украшения.',
    quoteRu: '«Все серверы перегреваются, когда я подключаюсь к сети.»',
    bonusTextRu: '+25% к добыче всех ресурсов · +15% атака',
    accentColor: '#ec4899',
  },
  {
    id: 'skin_succubus_glitch',
    name: 'Lilith Breach',
    nameRu: 'Лилит «Брич»',
    title: 'Dark Net Seductress',
    titleRu: 'Соблазнительница Темного Сектора',
    gender: 'female',
    rarity: 'legendary',
    currencyType: 'stars',
    priceStars: 59,
    tag: 'ГОРЯЧИЙ ХИТ',
    descriptionRu: 'Смелый полупрозрачный кибер-боди с глубоким вырезом, чулки с подсветкой и неоновые дьявольские рожки.',
    quoteRu: '«Твои пароли отдашь ты сам, даже не заметив этого.»',
    bonusTextRu: '+20% доход кредитов · +10% взлом',
    accentColor: '#f43f5e',
  },
  {
    id: 'skin_eva_swimsuit',
    name: 'Eva Cyber-Bikini',
    nameRu: 'Ева «Пляжный Глитч»',
    title: 'Offshore Protocol Diva',
    titleRu: 'Оффшорная Дива',
    gender: 'female',
    rarity: 'epic',
    currencyType: 'stars',
    priceStars: 39,
    tag: 'КУРОРТНЫЙ СТИЛЬ',
    descriptionRu: 'Минималистичный пляжный кибер-купальник с открытыми бедрами, голографический козырек и шелковая накидка.',
    quoteRu: '«Даже в киберпространстве нужен отдых у бассейна с ликвидностью.»',
    bonusTextRu: '+15% скорость майнинга',
    accentColor: '#06b6d4',
  },

  // ОБЛИКИ ЗА ВНУТРИИГРОВЫЕ КРЕДИТЫ (Очень дорогие, чтобы фармить было тяжело)
  {
    id: 'skin_valkyrie_zero',
    name: 'Valkyrie Zero',
    nameRu: 'Валькирия-0',
    title: 'Void Operative',
    titleRu: 'Элитный оперативник Бездны',
    gender: 'female',
    rarity: 'legendary',
    currencyType: 'credits',
    priceCredits: 25000, // Очень дорого в кредитах
    descriptionRu: 'Анатомический облегающий боевой комбинезон, импланты нейро-рефлексов и стилизованный фиолетовый визор.',
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
    currencyType: 'credits',
    priceCredits: 18000,
    descriptionRu: 'Элегантный кибер-корсет из углеродного волокна, платиновые волосы и светящиеся золотые нано-нити.',
    quoteRu: '«Каждая транзакция оставляет след. Я владею всеми этими следами.»',
    bonusTextRu: '+20% доход кредитов',
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
    currencyType: 'credits',
    priceCredits: 9500,
    descriptionRu: 'Укороченная кожаная тактическая куртка с открытым животом, неоновый кибер-глаз и стильная каре-стрижка.',
    quoteRu: '«Фаерволлы для дилетантов. Для меня это просто открытая дверь.»',
    bonusTextRu: '+10% атака в PvP-рейдах',
    accentColor: '#10b981',
  },
  {
    id: 'skin_default_agent',
    name: 'Operative Zero',
    nameRu: 'Оператор Зеро',
    title: 'Grid Initiate',
    titleRu: 'Базовый агент синдиката',
    gender: 'male',
    rarity: 'common',
    currencyType: 'credits',
    priceCredits: 0,
    descriptionRu: 'Стандартный защитный монохромный костюм кибер-наемника с базовым тактическим шлемом.',
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
      case 'skin_aphrodite_cyber':
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            {/* Glowing Pink/Gold Sensual Aura */}
            <circle cx="100" cy="180" r="95" fill="#ec4899" opacity="0.12" />
            <ellipse cx="100" cy="190" rx="65" ry="95" fill="none" stroke="#f472b6" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
            
            {/* Long Voluminous Pink Waves Hair */}
            <path d="M100,50 Q45,70 55,160 Q60,250 48,310" fill="none" stroke="#f472b6" strokeWidth="16" strokeLinecap="round" />
            <path d="M100,50 Q155,70 145,160 Q140,250 152,310" fill="none" stroke="#f472b6" strokeWidth="16" strokeLinecap="round" />
            <path d="M100,50 Q50,80 62,170 Q66,255 56,315" fill="none" stroke="#fdf2f8" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
            
            {/* Curvaceous Body / Legs with High-Cut Neon Heels */}
            {/* Bare toned legs */}
            <path d="M86,215 C82,240 76,290 75,340 L88,365 L94,305 L96,220 Z" fill="#ffe4e6" stroke="#fbcfe8" strokeWidth="1.2" />
            <path d="M114,215 C118,240 124,290 125,340 L112,365 L106,305 L104,220 Z" fill="#ffe4e6" stroke="#fbcfe8" strokeWidth="1.2" />
            {/* Neon High Heels & Thigh garters */}
            <line x1="72" y1="245" x2="94" y2="245" stroke="#ec4899" strokeWidth="2.5" />
            <line x1="106" y1="245" x2="128" y2="245" stroke="#ec4899" strokeWidth="2.5" />
            <path d="M72,345 L76,365 L88,365" stroke="#ec4899" strokeWidth="2.5" fill="none" />
            <path d="M128,345 L124,365 L112,365" stroke="#ec4899" strokeWidth="2.5" fill="none" />

            {/* Curvaceous Hips & Micro Bikini Bottom */}
            <path d="M76,190 C72,210 82,225 100,225 C118,225 128,210 124,190 Z" fill="#ffe4e6" />
            <polygon points="90,195 110,195 103,218 97,218" fill="#db2777" stroke="#f472b6" strokeWidth="1.2" />
            {/* Hip straps */}
            <line x1="76" y1="192" x2="92" y2="198" stroke="#db2777" strokeWidth="2" />
            <line x1="124" y1="192" x2="108" y2="198" stroke="#db2777" strokeWidth="2" />

            {/* Slender Waist & Navel Piercing */}
            <path d="M82,150 C78,170 76,185 82,200 L118,200 C124,185 122,170 118,150 Z" fill="#ffe4e6" />
            <circle cx="100" cy="182" r="2" fill="#f59e0b" />

            {/* Bust & Plunging Cyber Bra */}
            <path d="M74,125 C70,145 84,165 100,165 C116,165 130,145 126,125 Z" fill="#ffe4e6" />
            <ellipse cx="88" cy="142" rx="14" ry="13" fill="#db2777" stroke="#f472b6" strokeWidth="1.5" />
            <ellipse cx="112" cy="142" rx="14" ry="13" fill="#db2777" stroke="#f472b6" strokeWidth="1.5" />
            <line x1="98" y1="140" x2="102" y2="140" stroke="#fdf2f8" strokeWidth="2" />

            {/* Arms with Gold Cyber Cuffs */}
            <path d="M76,128 L58,185 L64,235" fill="none" stroke="#ffe4e6" strokeWidth="7" strokeLinecap="round" />
            <path d="M124,128 L142,185 L136,235" fill="none" stroke="#ffe4e6" strokeWidth="7" strokeLinecap="round" />
            <rect x="54" y="195" width="10" height="20" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            <rect x="136" y="195" width="10" height="20" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

            {/* Sensual Neck, Head & Hair strands */}
            <rect x="94" y="98" width="12" height="18" fill="#ffe4e6" />
            <ellipse cx="100" cy="85" rx="17" ry="21" fill="#fff1f2" />
            {/* Seductive Eyes with glowing lash */}
            <ellipse cx="94" cy="84" rx="3" ry="2" fill="#db2777" />
            <ellipse cx="106" cy="84" rx="3" ry="2" fill="#db2777" />
            <path d="M96,93 Q100,96 104,93" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" />
            {/* Front Locks framing face */}
            <path d="M82,75 Q88,105 82,128" fill="none" stroke="#f472b6" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M118,75 Q112,105 118,128" fill="none" stroke="#f472b6" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        );

      case 'skin_succubus_glitch':
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            <circle cx="100" cy="180" r="95" fill="#f43f5e" opacity="0.12" />
            
            {/* Demon Cyber Horns */}
            <path d="M86,68 Q75,30 60,35 Q70,55 82,72" fill="#e11d48" stroke="#f43f5e" strokeWidth="1.5" />
            <path d="M114,68 Q125,30 140,35 Q130,55 118,72" fill="#e11d48" stroke="#f43f5e" strokeWidth="1.5" />

            {/* Dark Purple Hair with Twin Tails */}
            <path d="M80,65 Q45,100 40,210 Q40,280 32,320" fill="none" stroke="#881337" strokeWidth="12" strokeLinecap="round" />
            <path d="M120,65 Q155,100 160,210 Q160,280 168,320" fill="none" stroke="#881337" strokeWidth="12" strokeLinecap="round" />
            
            {/* Stockings & Sheer Cyber Bodysuit */}
            <path d="M85,215 L78,335 L74,365 L88,365 L96,305 L96,220 Z" fill="#09090b" stroke="#f43f5e" strokeWidth="1.5" />
            <path d="M115,215 L122,335 L126,365 L112,365 L104,305 L104,220 Z" fill="#09090b" stroke="#f43f5e" strokeWidth="1.5" />

            {/* Sheer Bodysuit with Extreme Plunging Center */}
            <path d="M78,125 C74,155 78,195 84,220 L116,220 C122,195 126,155 122,125 Z" fill="#18181b" stroke="#f43f5e" strokeWidth="1.5" />
            <polygon points="90,125 110,125 104,185 96,185" fill="#fecdd3" />
            <circle cx="100" cy="180" r="2.5" fill="#e11d48" />

            {/* Seductive Bodice Cups */}
            <ellipse cx="86" cy="140" rx="13" ry="12" fill="#be123c" stroke="#f43f5e" strokeWidth="1.5" />
            <ellipse cx="114" cy="140" rx="13" ry="12" fill="#be123c" stroke="#f43f5e" strokeWidth="1.5" />

            {/* Arms with Claw Gloves */}
            <path d="M76,128 L56,185 L60,240" fill="none" stroke="#fecdd3" strokeWidth="7" strokeLinecap="round" />
            <path d="M124,128 L144,185 L140,240" fill="none" stroke="#fecdd3" strokeWidth="7" strokeLinecap="round" />
            <path d="M58,220 L60,245" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
            <path d="M142,220 L140,245" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />

            {/* Seductive Face & Demon Tail */}
            <ellipse cx="100" cy="85" rx="17" ry="21" fill="#fff1f2" />
            <ellipse cx="94" cy="84" rx="3" ry="2" fill="#f43f5e" />
            <ellipse cx="106" cy="84" rx="3" ry="2" fill="#f43f5e" />
            {/* Pointy Cyber Tail */}
            <path d="M100,225 Q145,260 135,320 L150,335 L125,338 Z" fill="#e11d48" stroke="#f43f5e" strokeWidth="1.5" />
          </svg>
        );

      case 'skin_eva_swimsuit':
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            <circle cx="100" cy="180" r="95" fill="#06b6d4" opacity="0.12" />
            {/* Turquoise Ponytail */}
            <path d="M100,55 Q145,55 150,130 Q150,210 140,270" fill="none" stroke="#22d3ee" strokeWidth="14" strokeLinecap="round" />
            
            {/* Beach Bikini & Toned Exposed Figure */}
            <path d="M85,215 L80,335 L76,365 L88,365 L96,305 L96,220 Z" fill="#fed7aa" />
            <path d="M115,215 L120,335 L124,365 L112,365 L104,305 L104,220 Z" fill="#fed7aa" />
            {/* Cyan Thong Bottom */}
            <polygon points="88,195 112,195 104,218 96,218" fill="#0891b2" stroke="#22d3ee" strokeWidth="1.5" />
            
            {/* Bare Midriff & Cyan Top */}
            <path d="M82,150 L118,150 L122,195 L78,195 Z" fill="#fed7aa" />
            <circle cx="100" cy="178" r="2" fill="#0891b2" />
            <ellipse cx="88" cy="142" rx="14" ry="12" fill="#0891b2" stroke="#22d3ee" strokeWidth="1.5" />
            <ellipse cx="112" cy="142" rx="14" ry="12" fill="#0891b2" stroke="#22d3ee" strokeWidth="1.5" />

            {/* Holographic Cyan Beach Visor */}
            <ellipse cx="100" cy="85" rx="17" ry="21" fill="#ffedd5" />
            <polygon points="82,75 118,75 114,86 86,86" fill="#06b6d4" opacity="0.85" />
          </svg>
        );

      case 'skin_valkyrie_zero':
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            <circle cx="100" cy="180" r="90" fill="#a855f7" opacity="0.08" />
            <path d="M100,60 Q145,75 130,135 Q115,180 125,230" fill="none" stroke="#c084fc" strokeWidth="14" strokeLinecap="round" />
            <path d="M85,210 L75,320 L72,360 L85,362 L93,310 L95,220 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <path d="M115,210 L125,320 L128,360 L115,362 L107,310 L105,220 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <path d="M78,125 C75,150 82,190 85,215 L115,215 C118,190 125,150 122,125 Z" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
            <path d="M86,135 Q100,160 114,135 L110,195 Q100,205 90,195 Z" fill="#09090b" stroke="#c084fc" strokeWidth="1.5" />
            <ellipse cx="100" cy="85" rx="18" ry="22" fill="#fce7f3" />
            <polygon points="84,80 116,80 112,90 88,90" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1.5" />
          </svg>
        );

      case 'skin_nyx_phantom':
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            <circle cx="100" cy="180" r="95" fill="#f59e0b" opacity="0.08" />
            <path d="M100,55 Q60,75 70,150 Q75,220 65,270" fill="none" stroke="#f4f4f5" strokeWidth="12" strokeLinecap="round" />
            <path d="M100,55 Q140,75 130,150 Q125,220 135,270" fill="none" stroke="#f4f4f5" strokeWidth="12" strokeLinecap="round" />
            <path d="M78,125 C74,155 80,195 84,220 L116,220 C120,195 126,155 122,125 Z" fill="#18181b" stroke="#f59e0b" strokeWidth="1.8" />
            <polygon points="90,135 110,135 105,195 95,195" fill="#09090b" stroke="#fbbf24" strokeWidth="1.5" />
            <circle cx="100" cy="235" r="9" fill="#f59e0b" opacity="0.9" />
            <ellipse cx="100" cy="85" rx="17" ry="21" fill="#fef2f2" />
          </svg>
        );

      case 'skin_cipher_kassandra':
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            <circle cx="100" cy="180" r="90" fill="#10b981" opacity="0.08" />
            <path d="M80,70 Q100,50 120,70 L125,115 Q100,105 75,115 Z" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
            <path d="M78,125 L122,125 L115,175 L85,175 Z" fill="#09090b" stroke="#10b981" strokeWidth="1.8" />
            <rect x="88" y="175" width="24" height="20" fill="#fed7aa" />
            <path d="M82,207 L76,325 L74,360 L86,360 L94,310 L94,220 Z" fill="#18181b" stroke="#047857" strokeWidth="1.5" />
            <path d="M118,207 L124,325 L126,360 L114,360 L106,310 L106,220 Z" fill="#18181b" stroke="#047857" strokeWidth="1.5" />
            <ellipse cx="100" cy="85" rx="17" ry="21" fill="#ffedd5" />
            <circle cx="94" cy="83" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.5" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 200 380" className="w-full h-full drop-shadow-2xl">
            <circle cx="100" cy="180" r="90" fill="#3f3f46" opacity="0.08" />
            <polygon points="100,50 125,65 120,105 100,115 80,105 75,65" fill="#18181b" stroke="#71717a" strokeWidth="2" />
            <polygon points="85,75 115,75 110,88 90,88" fill="#38bdf8" />
            <polygon points="65,120 135,120 125,190 75,190" fill="#27272a" stroke="#52525b" strokeWidth="2" />
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
