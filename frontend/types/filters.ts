export type FilterType = "select" | "search" | "date-range" | "tabs" | "switch";

export interface FilterOption {
  id: string | number;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[];
  defaultValue?: unknown;
  /** Extra props for specific components (e.g. Tabs variant, Switch size) */
  props?: Record<string, unknown>;
}

export interface RegistryEntry {
  key: string;
  filters: FilterConfig[];
}

export interface DynamicFilterRendererProps {
  config: FilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  isLoading?: boolean;
}

