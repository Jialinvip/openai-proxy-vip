const OPENAI_API_HOST = "api.openai.com";

Deno.serve(async (request) => {
  // 打印接收到的请求信息
  console.log(`Received ${request.method} request for: ${request.url}`);
  console.log("Request details:", {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  });
  
  const url = new URL(request.url);
  url.host = OPENAI_API_HOST;

  const newRequest = new Request(url.toString(), {
    headers: request.headers,
    method: request.method,
    body: request.body,
    redirect: "follow",
  });
  
  return await fetch(newRequest);
});