export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { company, name, email, tel, target, message } = req.body || {};

    if (!company || !name || !email || !message) {
      return res.status(400).json({
        error: "必須項目を入力してください。"
      });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "西日本ロジNAVI <onboarding@resend.dev>",
        to: ["k_fuchigami@gamigami.email"],
        reply_to: email,
        subject: `【西日本ロジNAVI】新規物流相談｜${company}`,
        text: `
西日本ロジNAVIから新しい物流相談が入りました。

■会社名
${company}

■お名前
${name}

■メールアドレス
${email}

■電話番号
${tel || "未入力"}

■相談したい会社
${target || "GAMIに相談して最適な会社を選びたい"}

■お問い合わせ内容
${message}

--------------------------------
西日本ロジNAVI
一次相談窓口：株式会社GAMI
        `.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return res.status(500).json({
        error: "メール送信に失敗しました。"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "サーバーエラーが発生しました。"
    });
  }
}
