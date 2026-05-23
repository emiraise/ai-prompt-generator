"use client";

import { useState } from "react";
import { Category, Proposal } from "@/types";
import { Sparkles } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

const CATEGORIES: Category[] = [
  { id: "google-ai-studio", label: "Google AI Studio ツール",  description: "AI Studioで使えるステップ式プロンプトを生成します", icon: "🤖" },
  { id: "nano-banana",      label: "Nano Banana ツール",       description: "Nano Banana向けの画像生成アプリを設計します",     icon: "🍌" },
  { id: "agent-skill",      label: "Agent Skill ツール",       description: "エージェントスキルを設計します",                 icon: "⚡" },
  { id: "agent-app",        label: "エージェントアプリの活用法", description: "エージェントアプリならではの活用法を提案します",   icon: "📱" },
  { id: "schedule-task",    label: "スケジュールタスクの活用法", description: "AIエージェントを定期実行する設計を提案します",     icon: "📅" },
];

const EXAMPLE_GROUPS = [
  {
    label: "集客・プロモーション",
    note: "一番パワーがかかるところ",
    icon: "📣",
    items: [
      {
        label: "SNS発信・原稿作成",
        icon: "📸",
        text: "店舗集客のためにSNS運用を担当しています。Instagramの投稿文やリール動画の構成案、Meta広告のテキストを毎月作成しています。毎回ゼロから考えるのに時間がかかり、投稿のクオリティもばらつきがちです。もっと効率よく、質の高いコンテンツを継続的に発信したいです。",
      },
      {
        label: "認知拡大・イベント企画",
        icon: "🎯",
        text: "店舗集客のために新規顧客獲得のキャンペーン企画や、地域のイベント出店計画を立てています。何から手をつければいいかわからず毎回場当たり的になっています。集客効果の高い施策を体系立てて考えられるようにしたいです。",
      },
    ],
  },
  {
    label: "予約・来店管理",
    note: "毎日のルーティン",
    icon: "📅",
    items: [
      {
        label: "予約管理・スケジュール調整",
        icon: "🗓️",
        text: "店舗の予約枠の埋まり具合のチェックや、スタッフのシフト配置を毎日行っています。ダブルブッキングのリスクもあり、管理に毎日30分以上かかっています。もっとスムーズに予約とシフトを一元管理できる仕組みが欲しいです。",
      },
      {
        label: "リマインド・キャンセル対策",
        icon: "🔔",
        text: "店舗の予約前日のリマインド連絡やキャンセルへの対応が毎日の業務になっています。ドタキャンが月に数件あり、その対応と防止策に悩んでいます。リマインド送信を自動化してキャンセル率を下げたいです。",
      },
    ],
  },
  {
    label: "顧客体験・ファン化",
    note: "リピート率アップの鍵",
    icon: "💚",
    items: [
      {
        label: "顧客情報の収集・一元管理",
        icon: "📋",
        text: "店舗の来店回数、カルテの内容、LINEでのやり取り履歴がバラバラで管理できていません。顧客ひとりひとりの情報を一元管理して、次回来店時に最適な対応ができるようにしたいです。",
      },
      {
        label: "アフターフォロー・リピート施策",
        icon: "💌",
        text: "店舗の来店後のフォローメッセージや2回目の来店を促すクーポン配布が手動で大変です。リピート率を上げるための仕組みを作りたいのですが、毎回手作業で時間がかかっています。",
      },
      {
        label: "口コミ・レビューの収集",
        icon: "⭐",
        text: "店舗のGoogleマップの口コミや紹介を増やしたいのですが、お客様にお願いするタイミングや方法がわからず口コミがなかなか増えません。MEO対策と口コミ収集を自動化・仕組み化したいです。",
      },
    ],
  },
  {
    label: "売上・財務管理",
    note: "お店の健康診断",
    icon: "💰",
    items: [
      {
        label: "売上・収支の把握",
        icon: "📊",
        text: "店舗の日次・月次の売上集計や経費（家賃・人件費・広告費）の計算、利益率の算出を手動でやっています。どんぶり勘定になりがちで、月末にまとめて計算すると誤差が出ることがあります。",
      },
      {
        label: "競合・市場の分析",
        icon: "🔍",
        text: "店舗の他店の価格設定や広告の動きをチェックして、Meta広告の週次レポートを作成しています。競合分析に毎週2〜3時間かかっており、自店の強みをどう打ち出すか悩んでいます。",
      },
    ],
  },
  {
    label: "店舗メンテナンス",
    note: "クオリティ維持",
    icon: "✨",
    items: [
      {
        label: "備品・在庫の管理",
        icon: "📦",
        text: "店舗のタオルやオイル、物販用商品などの消耗品の在庫チェックと発注を手動でやっています。在庫切れが突然起きることがあり、管理と発注の自動化・省力化をしたいです。",
      },
      {
        label: "清掃・クオリティチェック",
        icon: "🧹",
        text: "店舗のお客様を迎える空間のクオリティを高く保つためのチェックリストを作りたいのですが、現在はスタッフ任せになっており基準が統一されていません。チェックリストと改善の仕組みを整えたいです。",
      },
    ],
  },
];

type Props = {
  onGenerate: (category: Category, jobDescription: string, proposals: Proposal[]) => void;
};

export default function Step1Hearing({ onGenerate }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[3]);
  const [jobDescription,   setJobDescription]   = useState("");
  const [loading,          setLoading]           = useState(false);
  const [error,            setError]             = useState("");

  const handleGenerate = async (overrideText?: string) => {
    const text = (overrideText ?? jobDescription).trim();
    if (!text) { setError("仕事内容を入力してください"); return; }
    if (overrideText) setJobDescription(overrideText);
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "proposals", category: selectedCategory, jobDescription: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成に失敗しました");
      onGenerate(selectedCategory, text, data.proposals);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // ローディング中は全画面ローディングを表示
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">あなたの仕事を教えてください</h1>
        <p className="text-sm text-gray-500">
          日々のルーティンワークや「面倒だな」と感じる作業を具体的に入力してください。
        </p>
        <p className="text-xs text-gray-400 mt-1">※入力内容は改善のために使用されます。個人情報や機密情報は入力しないでください。</p>
      </div>

      {/* カテゴリ選択 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              selectedCategory.id === cat.id
                ? "border-green-600 bg-green-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">{cat.icon}</span>
              <div>
                <div className={`text-xs font-semibold leading-tight ${selectedCategory.id === cat.id ? "text-green-700" : "text-gray-800"}`}>
                  {cat.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">{cat.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* テキストエリア */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
          placeholder="例：店舗集客のためにSNS運用を担当しています。毎朝10件の投稿案を考えるのが大変で、さらに各投稿のインサイトデータをExcelに転記して週次レポートを作成する作業に毎週3時間かかっています。"
          className="w-full h-28 text-sm text-gray-700 placeholder-gray-400 resize-none outline-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* CTA ボタン */}
      <div className="relative flex flex-col items-center mb-2">
        <div className="mb-3 bg-green-50 border border-green-200 text-green-800 text-xs font-medium px-4 py-2 rounded-full shadow-sm">
          ✨ 面倒な作業、AIに任せてみませんか？
        </div>
        <div className="relative w-full">
          <button
            onClick={() => handleGenerate()}
            className="cta-bounce cta-pulse relative w-full py-4 bg-green-600 text-white rounded-xl font-bold text-base hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
          >
            <Sparkles size={18} />
            アイデアを生成する
            <span className="ml-1 text-green-200 text-sm font-normal">→</span>
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">数秒で悩みを解決するアイデアが届きます</p>
      </div>

      {/* 入力例（グループ別） */}
      <div className="mt-8 space-y-6">
        <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
          💡 <span>入力例（クリックで即アイデア生成）</span>
        </p>

        {EXAMPLE_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{group.icon}</span>
              <span className="text-xs font-bold text-gray-700">{group.label}</span>
              <span className="text-xs text-gray-400">— {group.note}</span>
              <div className="flex-1 h-px bg-gray-100 ml-1" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {group.items.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => handleGenerate(ex.text)}
                  className="p-3 bg-white rounded-xl border border-gray-200 text-left hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{ex.icon}</span>
                    <span className="text-xs font-semibold text-gray-700">{ex.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{ex.text}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
