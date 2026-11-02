import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center text-center font-mono">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400 text-xl font-bold">
            !
          </div>
          <h1 className="text-base font-bold text-white mb-2">Сбой Синхронизации Терминала</h1>
          <p className="text-xs text-zinc-400 mb-6 max-w-xs leading-relaxed">
            Обнаружена ошибка данных в локальном хранилище. Нажмите кнопку ниже для сброса кеша и перезапуска.
          </p>
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] text-zinc-500 max-w-sm overflow-x-auto mb-6 text-left w-full">
            {this.state.error?.message || 'Неизвестная ошибка'}
          </div>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-transform"
          >
            Сбросить кеш и восстановить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
