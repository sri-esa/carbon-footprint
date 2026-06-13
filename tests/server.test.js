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
    assert.equal(response.headers.get("strict-transport-security"), SECURITY_HEADERS["Strict-Transport-Security"]);
    assert.equal(response.headers.get("x-frame-options"), SECURITY_HEADERS["X-Frame-Options"]);
    assert.equal(response.headers.get("cross-origin-resource-policy"), SECURITY_HEADERS["Cross-Origin-Resource-Policy"]);
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

test("serves required JavaScript modules from the allowlist", async () => {
  const { baseUrl, close } = await startServer();

  try {
    const emissionModelResponse = await fetch(`${baseUrl}/emission-model.js`);
    const recommendationModelResponse = await fetch(`${baseUrl}/recommendation-model.js`);

    assert.equal(emissionModelResponse.status, 200);
    assert.equal(recommendationModelResponse.status, 200);
    assert.match(await emissionModelResponse.text(), /DEFAULT_INPUTS/);
    assert.match(await recommendationModelResponse.text(), /RECOMMENDATION_COPY/);
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

test("rejects malformed and oversized URLs safely", async () => {
  const { baseUrl, close } = await startServer();

  try {
    const malformedResponse = await fetch(`${baseUrl}/%E0%A4%A`);
    const oversizedResponse = await fetch(`${baseUrl}/${"a".repeat(2050)}`);

    assert.equal(malformedResponse.status, 400);
    assert.equal(oversizedResponse.status, 414);
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
