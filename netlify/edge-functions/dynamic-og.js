export default async (request, context) => {
  const url = new URL(request.url);
  const isMehndi = url.searchParams.get("mehndi") === "true";

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();
  const origin = url.origin;

  if (isMehndi) {
    const mehndiTitle = "\uD83D\uDC9B You\u2019re Invited to Our Mehndi Celebration";
    const mehndiDesc = "Join us for a colorful Mehndi celebration filled with music, laughter, traditions, and unforgettable memories.";
    const mehndiImage = origin + "/assets/img/og-mehndi.png";
    const mehndiUrl = origin + "/?mehndi=true";

    html = replaceMeta(html, {
      title: mehndiTitle,
      desc: mehndiDesc,
      image: mehndiImage,
      url: mehndiUrl,
      siteName: "Bakhtawar & Khizar Mehndi Invitation"
    });
  } else {
    const wedTitle = "\uD83D\uDC8D You\u2019re Invited to Our Wedding";
    const wedDesc = "Join us as we celebrate the beginning of our forever. Your presence will make our special day even more memorable.";
    const wedImage = origin + "/assets/img/og-wedding.png";
    const wedUrl = origin + "/";

    html = replaceMeta(html, {
      title: wedTitle,
      desc: wedDesc,
      image: wedImage,
      url: wedUrl,
      siteName: "Bakhtawar & Khizar Wedding Invitation"
    });
  }

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
    <meta property="og:image:type" content="image/png">
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
