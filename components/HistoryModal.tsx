"use client";

import { HistoryEntry } from "@/types";
import { getHistory, clearHistory } from "@/lib/history";
import { X, Trash2, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
};

export default function HistoryModal({ isOpen, onClose, onSelect }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => { if (isOpen) setHistory(getHistory()); }, [isOpen]);

  const handleClear = () => { clearHistory(); setHistory([]); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-900">生成履歴</h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={13} />
                <span>全削除</span>
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Clock size={32} className="mb-2 opacity-40" />
              <p className="text-sm">履歴がありません</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => { onSelect(entry); onClose(); }}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{entry.category.icon}</span>
                    <span className="text-xs font-semibold text-gray-700">{entry.category.label}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(entry.createdAt).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{entry.jobDescription}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">{entry.selectedProposal.title}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
