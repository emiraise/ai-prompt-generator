"use client";

import { History } from "lucide-react";

type Props = {
  onHistoryClick: () => void;
  onLogoClick: () => void;
};

export default function Header({ onHistoryClick, onLogoClick }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <button
        onClick={onLogoClick}
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        title="最初の画面に戻る"
      >
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <span className="font-semibold text-gray-900 text-sm">AI Prompt Generator</span>
      </button>
      <div className="flex items-center gap-4">
        <span className="hidden md:inline text-sm text-gray-500">店舗経営の相方 — 集客・採用・数字管理のAIアシスタント</span>
        <button
          onClick={onHistoryClick}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <History size={16} />
          <span>履歴</span>
        </button>
      </div>
    </header>
  );
}
