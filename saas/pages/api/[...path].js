export default async function handler(req, res) {
  // Get the query parameters
  const { category = "AI Agents" } = req.query;

  // Construct the URL to the FastAPI backend
  const targetUrl = `http://localhost:8000/api?category=${encodeURIComponent(
    category
  )}`;

  try {
    // Forward the request to the FastAPI backend
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "text/event-stream",
      },
    });

    // Set the response headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Pipe the response directly
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        res.write(chunk);
        // No delay needed for proper streaming
      }

      res.end();
    } else {
      res.status(500).json({ error: "No response body from API" });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to connect to API server" });
  }
}
