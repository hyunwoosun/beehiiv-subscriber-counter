export default async function handler(req, res) {
  const API_KEY = process.env.BEEHIIV_API_KEY;
  const PUB_ID = process.env.BEEHIIV_PUBLICATION_ID;

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUB_ID}/stats`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY
        }
      }
    );

    const data = await response.json();
    const count = data.active_subscribers?.toLocaleString() || "—";

    const html = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              font-family: sans-serif;
              font-size: 16px;
              padding: 8px;
            }
          </style>
        </head>
        <body>
          <strong>${count}</strong> subscribers
        </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);

  } catch (e) {
    res.status(500).send("Error loading subscriber count");
  }
}
