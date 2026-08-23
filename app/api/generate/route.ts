import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

// ツール種別ごとの提案指針（店舗ビジネス向け）
const CATEGORY_GUIDES: Record<string, string> = {
  "google-ai-studio": `このツールは「Google AI Studioでコピペしてすぐ使えるステップ式プロンプト」です。
提案は、店舗オーナーがチャットにプロンプトを貼るだけで完結するもの（原稿作成、企画立案、分析、チェックリスト作成など）に限定してください。外部システム連携が必要なものは提案しないでください。`,
  "nano-banana": `このツールは「Nano Banana向けの画像生成」です。
提案は、店舗ビジネスで使う画像制作（SNS投稿画像、広告クリエイティブ、店内POP、メニュー表、キャンペーンバナー、ビフォーアフター風イメージなど）に限定してください。`,
  "agent-skill": `このツールは「エージェントスキル（AIに繰り返し使う手順を覚えさせる仕組み）」です。
提案は、店舗で毎回同じ形式・同じ手順で行う業務（週次レポート作成、投稿原稿のフォーマット化、面接評価シート作成、チェックリスト運用など）をスキル化するものにしてください。`,
  "agent-app": `このツールは「エージェントアプリ（AIが自律的に複数ステップの作業をこなすアプリ）」です。
提案は、調査・分析・作成を組み合わせた複数ステップの業務（競合調査→レポート化、応募者情報の整理→質問案作成など）をAIに任せるものにしてください。`,
  "schedule-task": `このツールは「スケジュールタスク（AIエージェントの定期自動実行）」です。
提案は、毎日・毎週・毎月決まったタイミングで回す業務（日次売上チェック、週次の口コミ確認、月次の競合広告調査、シフト作成リマインドなど）を定期実行するものにしてください。`,
};

// 店舗ビジネスの相方としての共通システムプロンプト
const STORE_EXPERT_CONTEXT = `あなたは店舗ビジネス（サロン・スタジオ・治療院・飲食店など）の経営に伴走する「経営の相方」であり、AIツール活用の専門家です。
以下の店舗経営の重要ポイントを踏まえて提案してください：
- 新規集客：SNS発信、Meta広告、MEO・口コミ、体験予約への導線（CPA・体験成約率が鍵）
- 採用・育成：求人原稿、応募対応、面接での見極め、マニュアル化・研修（人が定着しないと店は回らない）
- 数字管理：売上・利益率、客単価、リピート率、稼働率、LTV（どんぶり勘定からの脱却）
- リピート・ファン化：アフターフォロー、次回予約、顧客情報の活用（新規獲得より低コスト）
- オペレーション：予約管理、在庫、清掃品質、業務の棚卸しと仕組み化（オーナーの時間を生み出す）`;

export async function POST(req: NextRequest) {
  try {
    const { type, category, jobDescription, selectedProposal, additionalRequest, existingProposals } = await req.json();

    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-3.5-flash" });

    let prompt = "";
    const categoryGuide = CATEGORY_GUIDES[category?.id] ?? "";

    if (type === "proposals" || type === "more-proposals") {
      const existingTitles = existingProposals?.map((p: { title: string }) => p.title).join("、") ?? "";
      const additionalNote = additionalRequest?.trim()
        ? `\n追加の要望: ${additionalRequest.trim()}`
        : "";
      const exclusionNote = existingTitles
        ? `\n以下はすでに提案済みのため、重複しないようにしてください: ${existingTitles}`
        : "";

      prompt = `${STORE_EXPERT_CONTEXT}

以下の店舗オーナーの悩みに対して、「${category.label}」を活用した解決案を5つ提案してください。
${categoryGuide}${additionalNote}${exclusionNote}

悩み・業務内容: ${jobDescription}

提案のルール：
- 5案は難易度や切り口を散らし、「今日から試せる初級案」を必ず1つ以上含める
- 店舗経営の数字（時間削減、リピート率、成約率など）につながる効果を意識する
- 抽象論ではなく、明日から動ける具体的な内容にする

各提案には以下を含めてください：
- 分析仮説: その悩みの根本原因と解決の方向性（60文字以内）
- 案のタイトル: 具体的な解決策（25文字以内）
- 案の説明: 実施方法と効果（70文字以内）
- 期待効果: 数字で伝わる効果の目安（例：週2時間削減、返信作業ゼロに）（15文字以内）
- 難易度: 1（初級）、2（中級）、3（上級）のいずれか

必ず以下のJSON形式のみで返してください（コードブロックや説明文は不要）:
[{"title":"タイトル","description":"説明","hypothesis":"分析仮説","effect":"期待効果","difficulty":1}]`;

    } else if (type === "prompt") {
      prompt = `${STORE_EXPERT_CONTEXT}

あなたはさらに、店舗運営のAIプロンプト作成の専門家でもあります。
以下のアイデアを実現するための「${category.label}」向けプロンプトを作成してください。
${categoryGuide}

店舗の悩み・業務内容: ${jobDescription}
選択したアイデア: ${selectedProposal.title} - ${selectedProposal.description}

以下の構成でMarkdown形式のプロンプトを作成してください：
- 役割設定（AIに担わせる役割。店舗ビジネスの文脈を理解した専門家として設定する）
- 入力情報（ユーザーが入力する内容。店舗オーナーが手元にある情報だけで埋められるようにする）
- 出力形式（AIが返すべき形式・内容。そのまま業務に使える粒度にする）
- 具体的な指示文

プロンプト作成のルール：
- コピーしてすぐ使えるよう、プレースホルダー（例：【店舗名】【業種】【日付】など）を活用する
- 専門用語を避け、AIに不慣れな店舗オーナーでも使える言葉にする
- 出力が「そのまま使える成果物」（原稿、リスト、シートなど）になるよう指示する`;

    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    if (type === "proposals" || type === "more-proposals") {
      const cleaned   = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const proposals = JSON.parse(cleaned);
      return NextResponse.json({ proposals });
    } else {
      return NextResponse.json({ prompt: text });
    }
  } catch (error) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
