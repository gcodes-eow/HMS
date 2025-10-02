// lib/eventFilters.ts

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDefinition {
  key: string;
  type: "text" | "select";
  placeholder?: string;
  options?: FilterOption[];
}

/**
 * Returns the combined filters for events and announcements
 */
export function getFilters(): FilterDefinition[] {
  return [
    // Event filters
    { key: "q", type: "text", placeholder: "Search events..." },
    {
      key: "status",
      type: "select",
      options: [
        { label: "All Statuses", value: "" },
        { label: "Planned", value: "PLANNED" },
        { label: "Ongoing", value: "ONGOING" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
    { key: "location", type: "text", placeholder: "Filter by location..." },

    // Announcement filters
    { key: "aq", type: "text", placeholder: "Search announcements..." },
    {
      key: "astatus",
      type: "select",
      options: [
        { label: "All Statuses", value: "" },
        { label: "Draft", value: "DRAFT" },
        { label: "Published", value: "PUBLISHED" },
      ],
    },
  ];
}
