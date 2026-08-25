/**
 * Single source of truth for the one-pager's sections.
 * The nav renders from this list and each section takes its `id` from it,
 * so an anchor can never drift from the section it points at.
 */
export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "journey", label: "Journey" },
  { id: "vision", label: "Vision" },
];
