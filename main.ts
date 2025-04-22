Deno.serve(() => {
  return new Response("请访问: www.gptvip.cn", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
});