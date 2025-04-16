export type CreateLinkAction = {
  url: string;
  slug: string;
};

export type CreateLink = {
  url: string;
  slug: string;
  qrCode?: string | null;
  shortLink: string;
};

export type Link = CreateLink & {
  id: string;
  createdAt: Date;
  clickCount: number;
};

export type PaginatedLinks = {
  links: Link[];
  totalLinks: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type FilterLinks = {
  search: string;
};
