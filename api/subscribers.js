export default async function handler(req, res) {
  const API_KEY = process.env.BEEHIIV_API_KEY;
  const PUB_ID = process.env.BEEHIIV_PUBLICATION_ID;

  if (!API_KEY) {
    res.status(500).send("Missing Beehiiv API key");
    return;
  }

  try {
    // Get all publications (with stats) tied to this API key
    const url = "https://api.beehiiv.com/v2/publications?expand=stats&limit=50";

    const response = await fetch(url, {
      headers: {
        // ✅ Beehiiv API uses Authorization: Bearer <token>
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Beehiiv API error", response.status, text);
      res.status(500).send("Error loading subscriber count");
      return;
    }

    const json = await response.json();
    const publications = json.data || [];

    // Try to find the specific publication by ID; fall back to first one
    const publication =
      publications.find((p) => p.id === PUB_ID) || publications[0];

    const activeSubs =
      publication?.stats?.active_subscriptions ??
      publication?.stats?.active_subscribers ??
      null;

    const count =
      activeSubs !== null && activeSubs !== undefined
        ? activeSubs.toLocaleString()
        : "—";

const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background: transparent;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 15px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.24);
          white-space: nowrap;
        }
        .count {
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <div class="pill">
        <span>현재 구독자 수:</span>
        <span class="count">${count}</span>
      </div>
    </body>
  </html>
`;


    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (e) {
    console.error("Unexpected error", e);
    res.status(500).send("Error loading subscriber count");
  }
}
