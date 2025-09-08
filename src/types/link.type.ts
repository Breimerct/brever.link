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

export type FilterLinks = {
  search: string;
};
