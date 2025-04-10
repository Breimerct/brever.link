import { FormProvider, useForm } from "react-hook-form";
import Button from "@components/button/Button";
import Input from "@components/input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { actions } from "astro:actions";
import type { CreateLinkForm } from "@/types/link.type";
import { shorLinkSchema } from "@/schemas/short-link.schema";
import { navigate } from "astro:transitions/client";

export default function ShortLinkForm() {
  const methods = useForm<CreateLinkForm>({
    resolver: zodResolver(shorLinkSchema),
    mode: "onChange",
  });

  const randomizeSlug = () => {
    const randomSlug = Math.random().toString(36).substring(2, 8);

    methods.setValue("slug", randomSlug);
    methods.trigger("slug");
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    const response = await actions.shortenAction.shortenLink(data);

    if (response.error) {
      return;
    }

    methods.reset();
    navigate("/", { history: "push" });
  });

  return (
    <FormProvider {...methods}>
      <form
        className="p-8 w-full shadow-md flex flex-col gap-6 rounded-md bg-slate-50 dark:bg-slate-700"
        onSubmit={handleSubmit}
      >
        <div>
          <Input
            label="URL"
            name="url"
            type="url"
            placeholder="https://example.com"
          />
        </div>

        <div className="flex w-full items-end gap-2">
          <div className="flex-1">
            <Input
              autoComplete="off"
              id="slug"
              label="Slug"
              name="slug"
              type="text"
              placeholder="example"
            />
          </div>

          <div>
            <Button
              className="mt-4"
              type="button"
              id="randomize-slug"
              onClick={randomizeSlug}
            >
              <span className="text-xs">Randomize</span>
            </Button>
          </div>
        </div>

        <Button className="mt-4" type="submit" fullWidth>
          short it
        </Button>
      </form>
    </FormProvider>
  );
}
