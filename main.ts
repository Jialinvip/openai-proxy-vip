const OPENAI_API_HOST = "api.openai.com";
const ANTHROPIC_API_HOST = "api.anthropic.com";

Deno.serve(async (request) => {
  try {
    const apiKey = Deno.env.get("API_KEY");
    const newHost = Deno.env.get("NEW_HOST") || ANTHROPIC_API_HOST;
    // 打印接收到的请求信息
    console.log(`Received ${request.method} request for: ${request.url}`);
    console.log("Request details:", {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  });

    const url = new URL(request.url);

    // Root path check
    if (url.pathname === "/") {
      return new Response(`Please visit: www.gptvip.cn`, { status: 200 });
    }

    // Extract token from Authorization header (remove "Bearer " prefix)
    const authHeader = request.headers.get("authorization");
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (token === apiKey) {
      // Proxy to Anthropic
      url.hostname = newHost;
      url.pathname = "/v1/messages";
      
      // Create new Headers object
      const headers = new Headers(request.headers);
      
      // Set or override necessary Anthropic headers
      headers.set("x-api-key", apiKey);
      headers.set("anthropic-version", "2023-06-01");
      headers.set("content-type", "application/json");
      
      const newRequest = new Request(url.toString(), {
        method: request.method,
        headers: headers,
        body: request.body,
        redirect: "follow"
      });
      
      return await fetch(newRequest);
    } else {
      // Proxy to OpenAI
      url.hostname = OPENAI_API_HOST;
      const newRequest = new Request(url.toString(), {
        headers: request.headers,
        method: request.method,
        body: request.body,
        redirect: "follow",
      });
      return await fetch(newRequest);
    }
  } catch (e) {
    return new Response(e.stack, { status: 500 });
  }
});