import LinkCard from "@components/link-card/LinkCard";
import type { Link } from "@/types/link.type";

interface Props {
  links: Link[];
}

export default function LinkList({ links }: Props) {
  return (
    <>
      {links.length > 0 ? (
        <div className="w-full overflow-y-auto lg:max-h-[500px] pr-2 custom-scrollbar">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} className="col-span-1" />
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center mt-10">
          <h4 className="text-slate-500 text-3xl font-bold">
            No short links found.
            <br /> Create one above!
          </h4>
        </div>
      )}
    </>
  );
}
