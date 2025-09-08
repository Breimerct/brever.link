import LinkCard from "@components/link-card/LinkCard";
import type { Link } from "@/types/link.type";

interface Props {
  links: Link[];
}

export default function LinkList({ links }: Props) {
  return (
    <section className="w-full">
      <ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4"
        role="list"
      >
        {links.map((link) => (
          <LinkCard link={link} key={link.id} className="col-span-1" />
        ))}
      </ul>
    </section>
  );
}
