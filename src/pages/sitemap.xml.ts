import type { APIRoute } from "astro";
import { getAllPaginatedLinks } from "@/services/link.service";

function createSitemapContent(content: string = "") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${content}
</urlset>`;
}

function createUrlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
) {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = async () => {
  const baseUrl = "https://brever.link";
  const lastmod = new Date().toISOString().split("T")[0] + "T00:00:00+00:00";

  try {
    const {
      data: { totalPages },
    } = await getAllPaginatedLinks({
      page: 1,
      limit: 4,
      slug: "",
    });

    let urlEntry = createUrlEntry(`${baseUrl}/`, lastmod, "daily", "1.0");

    for (const page of Array.from({ length: totalPages })) {
      urlEntry += createUrlEntry(
        `${baseUrl}/?page=${page}`,
        lastmod,
        "daily",
        page === 1 ? "0.9" : "0.7",
      );
    }

    const sitemapContent = createSitemapContent(urlEntry);

    return new Response(sitemapContent, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    const defaultSitemapEntry = createUrlEntry(
      baseUrl,
      lastmod,
      "daily",
      "1.0",
    );
    const defaultSitemapContent = createSitemapContent(defaultSitemapEntry);

    return new Response(defaultSitemapContent, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
};
