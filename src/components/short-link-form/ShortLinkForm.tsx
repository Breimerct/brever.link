import { FormProvider, useForm } from "react-hook-form";
import Button from "@components/button/Button";
import Input from "@components/input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateLinkAction } from "@/types/link.type";

import { actions } from "astro:actions";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { shortLinkFormSchema } from "@/schemas";
import { toast } from "sonner";
import { useState } from "react";

export default function ShortLinkForm() {
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<CreateLinkAction>({
    resolver: zodResolver(shortLinkFormSchema),
    mode: "onChange",
  });

  const randomizeSlug = () => {
    const randomSlug = Math.random().toString(36).substring(2, 8);

    methods.setValue("slug", randomSlug);
    methods.trigger("slug");
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const response = await actions.shortenAction.shortenLink(data);

      if (response.error) {
        throw new Error(response.error.message);
      }

      methods.reset();
      navigate("/", { history: "push" });
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong", {
        description: "Please check the data and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        data-testid="short-link-form"
        className="flex flex-col gap-6"
        onSubmit={handleSubmit}
        aria-label="URL shortener form"
      >
        <fieldset>
          <legend className="sr-only">URL to shorten</legend>
          <div>
            <Input
              required
              id="url"
              label="URL"
              name="url"
              type="url"
              placeholder="https://example.com"
              data-testid="url-input"
              aria-required="true"
              autoComplete="off"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="sr-only">Custom slug</legend>
          <div className="flex w-full items-start gap-2">
            <div className="flex-1">
              <Input
                required
                data-testid="slug-input"
                autoComplete="off"
                id="slug"
                label="Slug"
                name="slug"
                type="text"
                placeholder="example"
              />
            </div>

            <div className="self-start !mt-6">
              <Button
                disabled={isLoading}
                data-testid="randomize-slug-button"
                type="button"
                id="randomize-slug"
                onClick={randomizeSlug}
                aria-label="Generate random slug"
              >
                <span className="text-xs">Randomize</span>
              </Button>
            </div>
          </div>
        </fieldset>

        <Button
          isLoading={isLoading}
          data-testid="short-link-form-submit"
          className="mt-2"
          type="submit"
          fullWidth
        >
          Short it
        </Button>
      </form>
    </FormProvider>
  );
}
