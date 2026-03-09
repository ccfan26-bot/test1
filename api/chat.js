export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.poe.com/bot", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.POE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bot: "botGPTraw",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.output || JSON.stringify(data)
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
