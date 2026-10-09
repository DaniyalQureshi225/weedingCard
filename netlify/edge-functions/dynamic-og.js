export default async (request, context) => {
  const url = new URL(request.url);

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();
  const origin = url.origin;

  const annivTitle = "❤️ You're Invited to Celebrate Our Anniversary";
  const annivDesc = "Join us as we celebrate another year of laughter, countless memories, and a love that grows stronger with every passing day.";
  const annivImage = origin + "/assets/img/romantic_hero_bg.jpg";
  const annivUrl = origin + "/";

  html = replaceMeta(html, {
    title: annivTitle,
    desc: annivDesc,
    image: annivImage,
    url: annivUrl,
    siteName: "Romantic Anniversary Digital Invitation"
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
