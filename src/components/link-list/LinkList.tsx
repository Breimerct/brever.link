import LinkCard from "@components/link-card/LinkCard";
import type { Link } from "@/types/link.type";

interface Props {
  links: Link[];
}

export default function LinkList({ links }: Props) {
  return (
    <>
      <div className="w-full">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} className="col-span-1" />
          ))}
        </ul>
      </div>
    </>
  );
}
