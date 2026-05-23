"use client";

import { useEffect, useState } from "react";

const TIPS = [
  "ChatGPTは2022年11月のリリースからわずか5日でユーザー数が100万人を突破しました。",
  "GPT-4の学習に使われたデータ量は、人間が一生かけて読める量の数千倍以上と言われています。",
  "「プロンプトエンジニアリング」という職種は2022年頃から急速に注目を集め始めました。",
  "AIは1秒間に人間の約100万倍以上の速度でテキストを処理できます。",
  "Geminiの名前は双子座（ふたご座）に由来しており、テキストと画像を同時に扱う「二刀流」を表しています。",
  "大規模言語モデルは実は「次の単語を予測する」という単純なタスクを繰り返すことで文章を生成しています。",
  "AIへの指示を「プロンプト」と呼ぶのは、演劇で舞台袖から俳優に台詞を教える「プロンプター」が語源です。",
  "Chain of Thought（思考の連鎖）という手法で、AIに「考える過程」を出力させると正答率が大幅に上がります。",
  "AIエージェントとは、ゴールだけ与えると自分でタスクを分解して実行するAIシステムのことです。",
  "Transformerというアーキテクチャは2017年のGoogle論文「Attention is All You Need」で発表され、現代AIの基盤となりました。",
];

export default function LoadingTip() {
  const [index,   setIndex]   = useState(() => Math.floor(Math.random() * TIPS.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIndex(p => (p + 1) % TIPS.length); setVisible(true); }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 bg-green-50 rounded-xl px-5 py-4 max-w-lg mx-auto">
      <p className="text-xs font-semibold text-green-600 mb-1">💡 AI豆知識</p>
      <p
        className="text-sm text-green-900 leading-relaxed transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {TIPS[index]}
      </p>
    </div>
  );
}
