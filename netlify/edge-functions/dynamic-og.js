export default async (request, context) => {
  const url = new URL(request.url);

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();
  const origin = url.origin;

  const eventTitle = "Qawwali Night | A Soulful Evening Awaits";
  const eventDesc = "You are cordially invited to an exclusive evening of soulful Qawwali, Sufi music, and timeless traditions. Explore the invitation, save the date, and discover the venue.";
  const eventImage = origin + "/assets/images/qawwali-night-og.jpg";
  const eventUrl = origin + "/";

  html = replaceMeta(html, {
    title: eventTitle,
    desc: eventDesc,
    image: eventImage,
    url: eventUrl,
    siteName: "Qawwali Night Digital Invitation"
  });

  return new Response(html, {
    status: response.status,
    headers: response.headers
  });
};

function replaceMeta(html, { title, desc, image, url, siteName }) {
  const ogTags = `
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${esc(image)}">
    <meta property="og:image:secure_url" content="${esc(image)}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="${esc(url)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${esc(siteName)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(desc)}">
    <meta name="twitter:image" content="${esc(image)}">`;

  html = html.replace(
    /<!-- OG-START -->[\s\S]*?<!-- OG-END -->/,
    `<!-- OG-START -->${ogTags}\n    <!-- OG-END -->`
  );

  return html;
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const config = { path: "/" };
