import type { APIRoute } from "astro";
import { getAllPaginatedLinks } from "@/services/link.service";

export const GET: APIRoute = async () => {
  try {
    // Get total number of pages by fetching with a large page size to count total
    const { totalPages } = await getAllPaginatedLinks(1, 4, "");

    const baseUrl = "https://brever.link";
    const lastmod = new Date().toISOString().split("T")[0] + "T00:00:00+00:00";

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
                    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                    <!-- Main page -->
                    <url>
                        <loc>${baseUrl}/</loc>
                        <lastmod>${lastmod}</lastmod>
                        <changefreq>daily</changefreq>
                        <priority>1.0</priority>
                    </url>`;

    // Add paginated pages
    for (let page = 1; page <= totalPages; page++) {
      sitemap += `
            <url>
                <loc>${baseUrl}/?page=${page}</loc>
                <lastmod>${lastmod}</lastmod>
                <changefreq>daily</changefreq>
                <priority>${page === 1 ? "0.9" : "0.7"}</priority>
            </url>
        `;
    }

    sitemap += `
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://brever.link/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}T00:00:00+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
};
