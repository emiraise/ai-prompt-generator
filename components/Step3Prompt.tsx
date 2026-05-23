"use client";

import { Category, Proposal } from "@/types";
import { Check, Copy, RotateCcw } from "lucide-react";
import { useState } from "react";

type Props = {
  category: Category;
  selectedProposal: Proposal;
  generatedPrompt: string;
  onRestart: () => void;
};

export default function Step3Prompt({ category, selectedProposal, generatedPrompt, onRestart }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
          <span>{category.icon}</span>
          <span>{category.label}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">プロンプトが完成しました</h1>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">「{selectedProposal.title}」</span> のプロンプト
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-medium text-gray-500">生成されたプロンプト</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            {copied ? (
              <><Check size={14} className="text-green-500" /><span className="text-green-600">コピーしました</span></>
            ) : (
              <><Copy size={14} /><span>コピー</span></>
            )}
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
            {generatedPrompt}
          </pre>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mb-3"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "コピーしました！" : "プロンプトをコピーする"}
      </button>

      <button
        onClick={onRestart}
        className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw size={16} />
        最初からやり直す
      </button>
    </div>
  );
}
