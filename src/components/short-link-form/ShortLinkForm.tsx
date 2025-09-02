import { FormProvider, useForm } from "react-hook-form";
import Button from "@components/button/Button";
import Input from "@components/input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateLinkAction } from "@/types/link.type";

import { actions } from "astro:actions";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { shorLinkActionSchema } from "@/schemas/short-link-action.schema";
import { toast } from "sonner";

export default function ShortLinkForm() {
  const methods = useForm<CreateLinkAction>({
    resolver: zodResolver(shorLinkActionSchema),
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
      toast.error(response.error.message, {
        description: "Please check the data and try again.",
      });
      return;
    }

    methods.reset();
    navigate("/", { history: "push" });
  });

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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

        <Button className="mt-2" type="submit" fullWidth>
          short it
        </Button>
      </form>
    </FormProvider>
  );
}
