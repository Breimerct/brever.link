import type { APIContext, MiddlewareNext } from "astro";
import { getLinkBySlug, incrementClickCount } from "./services/link.service";

export const config = {
  runtime: "edge",
};

export async function onRequest(context: APIContext, next: MiddlewareNext) {
  const { request, redirect } = context;
  const url = new URL(request.url);
  const slug = url.pathname.split("/").pop(); // Extract slug from the URL path

  if (!slug || slug === "/") {
    return next(); // Skip if slug is empty or root path
  }

  if (slug) {
    const { data: link, success } = await getLinkBySlug(slug); // Fetch the link from the database

    if (!link || !success) {
      // redirect to the homepage if the link is not found
      return redirect("/");
    }

    // Increment click count
    await incrementClickCount(slug);

    // Redirect to the original URL
    return Response.redirect(link.url, 302);
  }

  return next();
}
