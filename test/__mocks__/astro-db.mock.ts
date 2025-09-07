const createMockChain = () => {
  const chain = {
    select: () => chain,
    from: () => chain,
    where: () => chain,
    execute: () => Promise.resolve([]),
    insert: () => chain,
    values: () => chain,
    returning: () => chain,
    update: () => chain,
    set: () => chain,
    orderBy: () => chain,
    limit: () => chain,
    offset: () => chain,
  };
  return chain;
};

export const db = createMockChain();

export const eq = () => {};
export const like = () => {};
export const desc = () => {};
export const count = () => ({ count: 0 });

export const LinkTable = {
  id: "id",
  url: "url",
  slug: "slug",
  shortLink: "shortLink",
  qrCode: "qrCode",
  createdAt: "createdAt",
  clickCount: "clickCount",
};
