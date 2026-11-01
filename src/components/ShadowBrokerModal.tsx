import React from 'react';
import { X, ShieldAlert, ArrowRight, Coins } from 'lucide-react';
import { LanguageCode } from '../utils/i18n';

export type ShadowTradeId = 'data_dump' | 'crypto_wash' | 'overcharge_boost';

interface ShadowBrokerModalProps {
  isOpen: boolean;
  resources: {
    energy: number;
    data: number;
    crypto: number;
    credits: number;
  };
  shieldUntilMs: number | null;
  completedTrades: ShadowTradeId[];
  lang: LanguageCode;
  onClose: () => void;
  onExecuteTrade: (id: ShadowTradeId) => void;
}

export const ShadowBrokerModal: React.FC<ShadowBrokerModalProps> = ({
  isOpen,
  resources,
  lang,
  onClose,
  onExecuteTrade,
}) => {
  if (!isOpen) return null;

  const trades: Array<{
    id: ShadowTradeId;
    title: string;
    desc: string;
    cost: string;
    gain: string;
    canExecute: boolean;
  }> = [
    {
      id: 'data_dump',
      title: lang === 'ru' ? 'Сброс данных брокеру' : 'Encrypted Data Dump',
      desc: lang === 'ru' ? 'Обмен сырых данных на кредиты' : 'Offload aggregated raw packets for credits',
      cost: '100 Data',
      gain: '+40 Credits',
      canExecute: resources.data >= 100,
    },
    {
      id: 'crypto_wash',
      title: lang === 'ru' ? 'Конверсия криптоактивов' : 'Crypto Liquidation',
      desc: lang === 'ru' ? 'Быстрая ликвидация токенов' : 'Instant conversion of mined crypto tokens',
      cost: '60 Crypto',
      gain: '+50 Credits',
      canExecute: resources.crypto >= 60,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                {lang === 'ru' ? 'Теневой Брокер' : 'Shadow Broker Nexus'}
              </h3>
              <p className="text-xs text-zinc-500">
                {lang === 'ru' ? 'Неофициальные торговые контракты' : 'Off-grid syndicate trade protocols'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-zinc-200">{trade.title}</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{trade.desc}</div>
                <div className="text-[11px] font-mono text-zinc-400 mt-1 flex items-center gap-1.5">
                  <span>{trade.cost}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                  <span className="text-zinc-200">{trade.gain}</span>
                </div>
              </div>

              <button
                disabled={!trade.canExecute}
                onClick={() => onExecuteTrade(trade.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  trade.canExecute
                    ? 'bg-zinc-100 text-zinc-950 font-semibold hover:bg-white cursor-pointer'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                {lang === 'ru' ? 'Сделка' : 'Execute'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
