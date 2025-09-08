import { defineMiddleware } from "astro:middleware";
import { getLinkBySlug, incrementClickCount } from "./services/link.service";

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, redirect } = context;
  const url = new URL(request.url);
  let slug = url.pathname.split("/").pop();

  if (slug?.includes("%")) {
    slug = decodeURIComponent(slug);
  }

  if (
    !slug ||
    slug === "/" ||
    slug === "favicon.ico" ||
    slug === "sitemap.xml" ||
    slug.trim() === ""
  ) {
    return next();
  }

  const { data: link, error } = await getLinkBySlug(slug);

  if (error || !link) {
    return redirect("/");
  }

  await incrementClickCount(slug);
  return Response.redirect(link.url, 302);
});
