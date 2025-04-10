export type CreateLinkForm = {
  url: string;
  slug: string;
};

export type CreateLink = CreateLinkForm & {
  shortLink: string;
};

export type Link = CreateLink & {
  id: string;
  createdAt: Date;
  clickCount: number;
};
