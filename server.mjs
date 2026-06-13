import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

const PORT = Number(process.env.PORT) || 4173;
const ROOT = resolve(".");
const ALLOWED_METHODS = new Set(["GET", "HEAD"]);
const PUBLIC_FILES = new Set([
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/carbon.js",
  "/storage.js"
]);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

export const SECURITY_HEADERS = Object.freeze({
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' https://images.unsplash.com data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'"
  ].join("; "),
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff"
});

export function createStaticServer({ root = ROOT } = {}) {
  const staticRoot = resolve(root);

  return createServer((request, response) => {
    if (!ALLOWED_METHODS.has(request.method)) {
      send(response, 405, "Method not allowed", { Allow: "GET, HEAD" }, request.method);
      return;
    }

    const url = new URL(request.url || "/", `http://${request.headers.host}`);
    const pathname = safeDecodePath(url.pathname);

    if (!pathname) {
      send(response, 400, "Bad request");
      return;
    }

    const requestedPath = pathname === "/" ? "/index.html" : pathname;
    const filePath = resolve(join(staticRoot, requestedPath));

    if (!PUBLIC_FILES.has(pathname) || isOutsideRoot(staticRoot, filePath)) {
      send(response, 403, "Forbidden");
      return;
    }

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      send(response, 404, "Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": MIME_TYPES[extname(filePath)] || "application/octet-stream",
      "Cache-Control": requestedPath === "/index.html" ? "no-store" : "public, max-age=3600",
      ...SECURITY_HEADERS
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath).pipe(response);
  });
}

if (isDirectRun()) {
  createStaticServer().listen(PORT, () => {
    console.log(`CarbonWise is running at http://localhost:${PORT}`);
  });
}

function isOutsideRoot(root, filePath) {
  const pathFromRoot = relative(root, filePath);
  return pathFromRoot.startsWith(`..${sep}`) || pathFromRoot === ".." || pathFromRoot.startsWith("..");
}

function send(response, status, message, headers = {}, method = "GET") {
  response.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    ...SECURITY_HEADERS,
    ...headers
  });
  response.end(method === "HEAD" ? undefined : message);
}

function safeDecodePath(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return null;
  }
}

function isDirectRun() {
  return process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
}
