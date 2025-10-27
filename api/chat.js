export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader("Access-Control-Allow-Origin", "https://conversadimercado.web.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Responder preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") 
    return res.status(405).json({ error: "Método não permitido na chamada" });

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [{ role: "user", content: message }],
          stream: false
        })
      }
    );

    const data = await response.json();
    const botReply = data?.choices?.[0]?.message?.content || "Sem resposta";

    res.status(200).json({ reply: botReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
}
