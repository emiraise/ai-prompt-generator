"use client";

import { Category, Proposal } from "@/types";
import { ArrowLeft, ChevronRight, Plus, Pencil, X } from "lucide-react";
import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

type Props = {
  category: Category;
  jobDescription: string;
  proposals: Proposal[];
  onSelect: (proposal: Proposal, prompt: string) => void;
  onBack: () => void;
};

const DIFFICULTY_LABEL = ["", "初級", "中級", "上級"];
const DIFFICULTY_COLOR = ["", "text-green-600", "text-yellow-600", "text-red-500"];

function Stars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <span key={i} className={`text-sm ${i <= level ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
    </span>
  );
}

export default function Step2Proposals({ category, jobDescription, proposals: initialProposals, onSelect, onBack }: Props) {
  const [proposals,       setProposals]       = useState<Proposal[]>(initialProposals);
  const [loadingPrompt,   setLoadingPrompt]   = useState(false);
  const [loadingMore,     setLoadingMore]     = useState(false);
  const [error,           setError]           = useState("");
  const [showMorePanel,   setShowMorePanel]   = useState(false);
  const [additionalReq,   setAdditionalReq]   = useState("");

  const handleSelect = async (proposal: Proposal) => {
    setError("");
    setLoadingPrompt(true);
    try {
      const res  = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "prompt", category, jobDescription, selectedProposal: proposal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成に失敗しました");
      onSelect(proposal, data.prompt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
      setLoadingPrompt(false);
    }
  };

  const handleMoreProposals = async () => {
    setShowMorePanel(false);
    setLoadingMore(true);
    setError("");
    try {
      const res  = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "more-proposals",
          category,
          jobDescription,
          additionalRequest: additionalReq,
          existingProposals: proposals,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成に失敗しました");
      setProposals(prev => [...prev, ...data.proposals]);
      setAdditionalReq("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loadingPrompt) {
    return <div className="max-w-3xl mx-auto px-4"><LoadingScreen message="プロンプトを生成中" /></div>;
  }
  if (loadingMore) {
    return <div className="max-w-3xl mx-auto px-4"><LoadingScreen message="追加の提案を生成中" /></div>;
  }

  // 分析仮説は最初の提案のものを代表として使用
  const hypothesis = proposals[0]?.hypothesis ?? "";

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">

      {/* ヘッダー */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
          <span>{category.icon}</span>
          <span>{category.label}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">業務提案</h1>
        <p className="text-sm text-gray-500">解決したい課題を選ぶと、すぐ使えるプロンプトが生成されます</p>
      </div>

      {/* 分析・仮説 */}
      {hypothesis && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 flex gap-3">
          <span className="text-green-500 mt-0.5 flex-shrink-0">🔍</span>
          <div>
            <p className="text-xs font-bold text-green-700 mb-1">分析・仮説</p>
            <p className="text-sm text-gray-700 leading-relaxed">{hypothesis}</p>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      {/* 提案カード一覧 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {proposals.map((proposal, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(proposal)}
            className="group relative bg-white rounded-2xl border-2 border-gray-100 p-5 text-left hover:border-green-400 hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            {/* 左アクセントライン */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />

            {/* 案番号 + 難易度 */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                案{idx + 1}
              </span>
              <div className="flex items-center gap-1.5">
                <Stars level={proposal.difficulty} />
                <span className={`text-[10px] font-bold ${DIFFICULTY_COLOR[proposal.difficulty]}`}>
                  ({DIFFICULTY_LABEL[proposal.difficulty]})
                </span>
              </div>
            </div>

            {/* タイトル */}
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-snug mb-2">
              {proposal.title}
            </h3>

            {/* 説明 */}
            <p className="text-xs text-gray-500 leading-relaxed mb-3">{proposal.description}</p>

            {/* 選択矢印 */}
            <div className="flex items-center justify-end">
              <span className="text-xs text-gray-300 group-hover:text-green-500 transition-colors flex items-center gap-1">
                このアイデアで生成
                <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* ホバー底面グラデーション */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-b-2xl" />
          </button>
        ))}
      </div>

      {/* さらに5案追加パネル */}
      {showMorePanel ? (
        <div className="bg-white border-2 border-green-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Pencil size={14} className="text-green-600" />
              <p className="text-sm font-bold text-gray-800">追加の要望（任意）</p>
            </div>
            <button onClick={() => setShowMorePanel(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            方向性の希望があれば入力してください。空欄のまま生成することもできます。
          </p>
          <textarea
            value={additionalReq}
            onChange={(e) => setAdditionalReq(e.target.value)}
            placeholder="例：もっと初心者でもすぐ使えるものを / SNS発信に特化したものを / コストをかけずにできるものを"
            className="w-full h-24 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 border border-gray-200 rounded-xl p-3 resize-none outline-none focus:border-green-300 transition-colors mb-4"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleMoreProposals}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Pencil size={14} />
              そのまま5案を生成
            </button>
            <button
              onClick={() => setShowMorePanel(false)}
              className="px-5 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowMorePanel(true)}
          className="w-full py-3.5 border-2 border-green-200 text-green-700 rounded-xl font-bold text-sm hover:bg-green-50 transition-all flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={15} />
          さらに5案追加する
          <span className="text-xs text-green-400 font-normal">（現在 {proposals.length} 案）</span>
        </button>
      )}

      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={14} />
        ヒアリングに戻る
      </button>
    </div>
  );
}
