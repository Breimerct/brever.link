import { FormProvider, useForm } from "react-hook-form";
import Input from "../input/Input.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { navigate } from "astro:transitions/client";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import type { Link } from "@/types/link.type.ts";
import { FilterLinksSchema } from "@/schemas";

interface Props {
  datalist: Link[];
}

export default function FilterLinks({ datalist }: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const methods = useForm({
    resolver: zodResolver(FilterLinksSchema),
    defaultValues: {
      search: "",
    },
  });

  const { handleSubmit, watch } = methods;

  const onSubmit = handleSubmit((data) => {
    const { search } = data;
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("search", search);
    queryParams.set("page", "1");
    navigate(`?${queryParams.toString()}`);
  });

  useEffect(() => {
    watch((data) => {
      const { search } = data;

      setSearch(search || "");
    });

    return () => {
      setSearch("");
    };
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    if (!debouncedSearch) {
      queryParams.delete("search");
      navigate(`?${queryParams.toString()}`);
      return;
    }

    queryParams.set("search", debouncedSearch);
    queryParams.set("page", "1");

    navigate(`?${queryParams.toString()}`);

    return () => {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.delete("search");
      navigate(`?${queryParams.toString()}`);
    };
  }, [debouncedSearch]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="mb-4">
          <Input
            name="search"
            label="Slug"
            placeholder="Search by slug"
            autoComplete="off"
            datalist={datalist}
            disabled={datalist.length === 0}
          />
        </form>
      </FormProvider>
    </>
  );
}
