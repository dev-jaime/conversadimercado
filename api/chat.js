export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Método não permitido" });

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
          messages: [
            { role: "user", content: message }
          ],
          stream: false
        })
      }
    );

    const data = await response.json();

    // Extrair a resposta do modelo
    // Estrutura retornada: data.choices[0].message.content
    const botReply = data?.choices?.[0]?.message?.content || "Sem resposta";

    res.status(200).json({ reply: botReply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
}