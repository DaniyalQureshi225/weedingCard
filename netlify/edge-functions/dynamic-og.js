export default async (request, context) => {
  const url = new URL(request.url);

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();
  
  // Determine actual public protocol and origin
  const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  const origin = `${proto}://${host}`;

  const brideName = "Ayesha";
  const eventTitle = `Dholki Night Invitation | ${brideName}`;
  const eventDesc = "Join us for a colorful Pakistani Dholki Night filled with music, traditions, and celebration.";
  const eventImage = `${origin}/assets/images/dholki-og.jpg`;
  const eventUrl = `${origin}${url.pathname}`;

  html = replaceMeta(html, {
    title: eventTitle,
    desc: eventDesc,
    image: eventImage,
    url: eventUrl,
    siteName: "Dholki Night Invitation"
  });

  // Strip Netlify badge & drawer widgets if present in HTML stream
  html = html
    .replace(/<netlify-drawer[\s\S]*?<\/netlify-drawer>/gi, "")
    .replace(/<div[^>]*class=["'][^"']*netlify-badge[^"']*["'][\s\S]*?<\/div>/gi, "")
    .replace(/<a[^>]*class=["'][^"']*netlify-badge[^"']*["'][\s\S]*?<\/a>/gi, "")
    .replace(/<script[^>]*src=["'][^"']*netlify[^"']*(?:badge|feedback|preview)[^"']*["'][^>]*><\/script>/gi, "");

  return new Response(html, {

    status: response.status,
    headers: response.headers
  });
};

function replaceMeta(html, { title, desc, image, url, siteName }) {
  const ogTags = `
    <link rel="image_src" href="${esc(image)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${esc(url)}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${esc(image)}">
    <meta property="og:image:secure_url" content="${esc(image)}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Pakistani Dholki Night digital invitation card with traditional dholak and marigold flowers">
    <meta property="og:site_name" content="${esc(siteName)}">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Dholki Night Invitation">
    <meta name="twitter:description" content="Celebrate a beautiful Pakistani Dholki Night with us!">
    <meta name="twitter:image" content="${esc(image)}">
    <meta name="twitter:image:alt" content="Pakistani Dholki Night digital invitation card">`;

  html = html.replace(
    /<!-- OG-START -->[\s\S]*?<!-- OG-END -->/,
    `<!-- OG-START -->${ogTags}\n    <!-- OG-END -->`
  );

  return html;
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const config = { path: "/*" };
