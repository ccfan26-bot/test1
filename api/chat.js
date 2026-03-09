export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array required" });
  }

  try {
    const response = await fetch(
      "https://api.poe.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.POE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4.5",
          messages: messages,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("POE ERROR:", data);
      return res.status(response.status).json(data);
    }

    const reply = data.choices?.[0]?.message?.content;

    res.status(200).json({
      reply: reply
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
