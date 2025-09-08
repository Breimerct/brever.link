import type { Link } from ".";

export type PaginatedLinkResponse = {
  links: Link[];
  totalLinks: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ServiceResponse<T> = {
  data: T;
  error: string | null;
};
