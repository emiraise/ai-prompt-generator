"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const TIPS = [
  "ChatGPTは2022年11月のリリースからわずか5日でユーザー数が100万人を突破しました。",
  "GPT-4の学習に使われたデータ量は、人間が一生かけて読める量の数千倍以上と言われています。",
  "AIは1秒間に人間の約100万倍以上の速度でテキストを処理できます。",
  "「プロンプトエンジニアリング」は2022年頃から急速に注目を集め始めた職種です。",
  "Geminiの名前は双子座（ふたご座）に由来し、テキストと画像を同時に扱う「二刀流」を表しています。",
  "AIエージェントとは、ゴールだけ与えると自分でタスクを分解して実行するAIシステムのことです。",
  "Chain of Thoughtという手法でAIに「考える過程」を出力させると正答率が大幅に上がります。",
  "大規模言語モデルは「次の単語を予測する」という単純なタスクを繰り返すことで文章を生成しています。",
];

const STEPS = [
  "入力内容を解析中...",
  "最適なアイデアを考案中...",
  "提案を整理しています...",
  "もうすぐ完成です...",
];

type Props = { message?: string };

export default function LoadingScreen({ message = "AIがアイデアを生成中" }: Props) {
  const [tipIndex,  setTipIndex]  = useState(() => Math.floor(Math.random() * TIPS.length));
  const [stepIndex, setStepIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => { setTipIndex(p => (p + 1) % TIPS.length); setTipVisible(true); }, 350);
    }, 3500);
    const stepTimer = setInterval(() => {
      setStepIndex(p => Math.min(p + 1, STEPS.length - 1));
    }, 1800);
    return () => { clearInterval(tipTimer); clearInterval(stepTimer); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 animate-fade-up">

      {/* スピナー */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border-4 border-green-100 border-t-green-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={24} className="text-green-500" />
        </div>
      </div>

      {/* ステータステキスト */}
      <p className="text-lg font-bold text-gray-800 mb-2">{message}</p>
      <p className="text-sm text-green-600 font-medium mb-10 h-5 transition-all">
        {STEPS[stepIndex]}
      </p>

      {/* プログレスバー */}
      <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-12">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-[1800ms] ease-out"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* AI豆知識 */}
      <div className="w-full max-w-md bg-green-50 border border-green-100 rounded-2xl px-6 py-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">💡</span>
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest">AI 豆知識</span>
        </div>
        <p
          className="text-sm text-gray-700 leading-relaxed transition-opacity duration-350"
          style={{ opacity: tipVisible ? 1 : 0 }}
        >
          {TIPS[tipIndex]}
        </p>
      </div>
    </div>
  );
}
