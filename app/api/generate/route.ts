import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { type, category, jobDescription, selectedProposal, additionalRequest, existingProposals } = await req.json();

    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-3.5-flash" });

    let prompt = "";

    if (type === "proposals" || type === "more-proposals") {
      const existingTitles = existingProposals?.map((p: { title: string }) => p.title).join("、") ?? "";
      const additionalNote = additionalRequest?.trim()
        ? `\n追加の要望: ${additionalRequest.trim()}`
        : "";
      const exclusionNote = existingTitles
        ? `\n以下はすでに提案済みのため、重複しないようにしてください: ${existingTitles}`
        : "";

      prompt = `あなたは店舗運営とAIツール活用の専門家です。
以下の店舗オーナーの悩みに対して、「${category.label}」を活用した解決案を5つ提案してください。${additionalNote}${exclusionNote}

悩み・業務内容: ${jobDescription}

各提案には以下を含めてください：
- 分析仮説: その悩みの根本原因と解決の方向性（60文字以内）
- 案のタイトル: 具体的な解決策（25文字以内）
- 案の説明: 実施方法と効果（70文字以内）
- 難易度: 1（初級）、2（中級）、3（上級）のいずれか

必ず以下のJSON形式のみで返してください（コードブロックや説明文は不要）:
[{"title":"タイトル","description":"説明","hypothesis":"分析仮説","difficulty":1}]`;

    } else if (type === "prompt") {
      prompt = `あなたは店舗運営のAIプロンプト作成の専門家です。
以下のアイデアを実現するための「${category.label}」向けプロンプトを作成してください。

店舗の悩み・業務内容: ${jobDescription}
選択したアイデア: ${selectedProposal.title} - ${selectedProposal.description}

以下の構成でMarkdown形式のプロンプトを作成してください：
- 役割設定（AIに担わせる役割）
- 入力情報（ユーザーが入力する内容）
- 出力形式（AIが返すべき形式・内容）
- 具体的な指示文

コピーしてすぐ使えるよう、プレースホルダー（例：【店舗名】【日付】など）を活用してください。`;

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
