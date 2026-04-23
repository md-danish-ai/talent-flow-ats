import { FilterConfig } from "@types";


class FilterRegistry {
  private registry: Map<string, FilterConfig[]> = new Map();

  register(key: string, filters: FilterConfig[]) {
    this.registry.set(key, filters);
  }

  getFilters(key: string): FilterConfig[] {
    return this.registry.get(key) || [];
  }

  getAllKeys(): string[] {
    return Array.from(this.registry.keys());
  }
}

export const filterRegistry = new FilterRegistry();
