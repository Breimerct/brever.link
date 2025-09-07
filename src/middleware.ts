import { defineMiddleware } from "astro:middleware";
import { getLinkBySlug, incrementClickCount } from "./services/link.service";

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, redirect } = context;
  const url = new URL(request.url);
  const slug = url.pathname.split("/").pop();

  if (!slug || slug === "/") {
    return next();
  }

  if (slug) {
    const { data: link, success } = await getLinkBySlug(slug);

    if (!link || !success) {
      return redirect("/");
    }

    await incrementClickCount(slug);

    return Response.redirect(link.url, 302);
  }

  return next();
});
