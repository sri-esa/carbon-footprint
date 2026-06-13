import assert from "node:assert/strict";
import test from "node:test";
import { once } from "node:events";
import { createStaticServer, SECURITY_HEADERS } from "../server.mjs";

test("serves the app with security headers", async () => {
  const { baseUrl, close } = await startServer();

  try {
    const response = await fetch(baseUrl);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /Carbon Footprint Awareness Platform/);
    assert.equal(response.headers.get("x-content-type-options"), SECURITY_HEADERS["X-Content-Type-Options"]);
    assert.equal(response.headers.get("referrer-policy"), SECURITY_HEADERS["Referrer-Policy"]);
    assert.match(response.headers.get("content-security-policy"), /default-src 'self'/);
    assert.match(response.headers.get("permissions-policy"), /geolocation=\(\)/);
  } finally {
    await close();
  }
});

test("blocks unsupported methods and non-public files", async () => {
  const { baseUrl, close } = await startServer();

  try {
    const postResponse = await fetch(baseUrl, { method: "POST" });
    const packageResponse = await fetch(`${baseUrl}/package.json`);
    const traversalResponse = await fetch(`${baseUrl}/../package.json`);

    assert.equal(postResponse.status, 405);
    assert.equal(postResponse.headers.get("allow"), "GET, HEAD");
    assert.equal(packageResponse.status, 403);
    assert.equal(traversalResponse.status, 403);
  } finally {
    await close();
  }
});

test("supports HEAD requests without a response body", async () => {
  const { baseUrl, close } = await startServer();

  try {
    const response = await fetch(baseUrl, { method: "HEAD" });
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.equal(body, "");
  } finally {
    await close();
  }
});

async function startServer() {
  const server = createStaticServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const { port } = server.address();
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    })
  };
}
