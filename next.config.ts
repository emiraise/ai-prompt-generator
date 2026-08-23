import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // クリックジャッキング対策（他サイトのiframeに埋め込ませない）
          { key: "X-Frame-Options", value: "DENY" },
          // MIMEタイプ偽装対策
          { key: "X-Content-Type-Options", value: "nosniff" },
          // 外部リンク先に自サイトのURL詳細を渡さない
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // 使わないブラウザ機能を明示的に無効化
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
