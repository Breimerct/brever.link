import IconCopy from "@components/icons/IconCopy";
import { cn, formatDate, getDomain } from "@/helpers";
import { type LiHTMLAttributes } from "react";
import type { Link } from "@/types/link.type";
import { toast } from "sonner";
import Button from "../button/Button";
import IconDownload from "../icons/IconDownload";

interface Props extends LiHTMLAttributes<HTMLLIElement> {
  link: Link;
}

export default function LinkCard({ link, className, ...props }: Props) {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(link.shortLink)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          description: "You can now paste it anywhere.",
        });
      })
      .catch((err) => {
        toast.error("Failed to copy link!", {
          description: "Please try again.",
        });
        console.error("Failed to copy link:", err);
      });
  };

  const handleDownloadQrImg = () => {
    const linkElement = document.createElement("a");
    linkElement.href = link.qrCode!;
    linkElement.download = `${link.slug}.png`;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const formattedDate = formatDate(link.createdAt);
  const isoDate = new Date(link.createdAt).toISOString();

  return (
    <li
      data-testid={`link-card-${link.id}`}
      data-short={link.shortLink}
      data-url={link.url}
      data-slug={link.slug}
      {...props}
      className={cn(
        "p-4 bg-white rounded-lg shadow-md",
        "flex flex-col gap-2",
        "border border-gray-200",
        "dark:bg-gray-700 dark:border-gray-700",
        "dark:text-gray-200",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold w-full text-nowrap overflow-hidden text-ellipsis">
          <span data-testid="domain-name">{getDomain(link.url)}</span>
        </h2>

        <div>
          <button
            id={`copy-link-${link.slug}`}
            aria-label="Copy short link"
            data-testid={`copy-button-${link.slug}`}
            onClick={handleCopy}
            type="button"
            className={cn(
              "btn-copy",
              "text-gray-500 cursor-pointer",
              "hover:text-gray-700 hover:scale-105",
              "transition-all duration-200 ease-in-out",
              "dark:text-gray-400 dark:hover:text-gray-200",
            )}
          >
            <IconCopy />
          </button>
        </div>
      </header>

      <a
        data-testid="short-link"
        href={link.shortLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Short link: ${link.shortLink}`}
        className={cn(
          "text-slate-900 dark:text-slate-200 font-semibold",
          "transition-all duration-200 ease-in-out",
          "hover:underline",
        )}
      >
        <p className="text-lg font-semibold w-full text-nowrap overflow-hidden text-ellipsis">
          <span
            className="bg-gray-200 text-gray-800 font-semibold mr-1 px-1.5 py-0.5 rounded dark:bg-gray-800 dark:text-gray-300 text-sm"
            data-testid="short-link-text"
          >
            {link.shortLink}
          </span>
        </p>
      </a>

      {link.qrCode && (
        <figure
          className="flex items-center gap-2"
          data-testid="qr-code-container"
        >
          <img
            src={link.qrCode}
            alt={`QR code for ${link.shortLink}`}
            data-testid="qr-code-image"
            className="w-16 h-16 rounded-md"
          />
          <figcaption className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">QR Code</span>
            <Button
              id={`download-qr-${link.slug}`}
              data-testid={`download-qr-${link.slug}`}
              type="button"
              aria-label={`Download QR code for ${link.slug}`}
              fullWidth
              className="mt-2 !text-xs"
              appendIcon={<IconDownload />}
              onClick={handleDownloadQrImg}
            >
              Download
            </Button>
          </figcaption>
        </figure>
      )}

      <footer className="flex items-center justify-between gap-2 text-gray-500">
        <small data-testid="creation-date">
          <time dateTime={isoDate}>{formattedDate}</time>
        </small>

        <div aria-label="Click statistics" data-testid="click-stats">
          <span>{link.clickCount}</span>
          <span> clicks</span>
        </div>
      </footer>
    </li>
  );
}
