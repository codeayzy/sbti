import { serve } from "bun";

const server = serve({
  port: process.env.PORT || 8080,
  async fetch(req) {
    const url = new URL(req.url);

    // API routes
    if (url.pathname === "/api/hello") {
      return Response.json({ message: "Hello, world!", method: req.method });
    }

    // Serve static files from public/
    if (url.pathname.startsWith("/images/")) {
      const file = Bun.file(`./public${url.pathname}`);
      if (await file.exists()) return new Response(file);
    }

    // Bundle and serve TSX/TS entrypoints for dev
    if (url.pathname.endsWith(".tsx") || url.pathname.endsWith(".ts")) {
      const filePath = `./src${url.pathname}`;
      const file = Bun.file(filePath);
      if (await file.exists()) {
        const build = await Bun.build({
          entrypoints: [filePath],
          target: "browser",
          sourcemap: "inline",
          define: { "process.env.NODE_ENV": JSON.stringify("development") },
        });
        if (build.success && build.outputs[0]) {
          return new Response(build.outputs[0], {
            headers: { "Content-Type": "text/javascript; charset=utf-8" },
          });
        }
        return new Response(build.logs.join("\n"), {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        });
      }
    }

    // Serve CSS files from src/
    if (url.pathname.endsWith(".css")) {
      const file = Bun.file(`./src${url.pathname}`);
      if (await file.exists()) {
        return new Response(file, {
          headers: { "Content-Type": "text/css; charset=utf-8" },
        });
        }
    }

    // Serve index.html for all other routes (SPA)
    return new Response(Bun.file("./src/index.html"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});

console.log(`🚀 Server running at ${server.url}`);
