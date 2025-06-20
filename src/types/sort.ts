export type SortDirection = "asc" | "desc" | null;

export interface SortOption {
  key: string; // e.g., 'name', 'email'
  direction: SortDirection;
}
