import { create } from "zustand";

export type SortOption = "dueDate" | "createdAt";
export type OrderOption = "asc" | "desc";

export interface TaskFilterParams {
  search?: string;
  category?: string;
  completed?: string;
  sort?: SortOption;
  order?: OrderOption;
}

interface FilterState extends TaskFilterParams {
  setFilter: (params: Partial<TaskFilterParams>) => void;
  resetFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  category: "all",
  completed: "all",
  sort: "dueDate",
  order: "asc",
  setFilter: (params) => set((state) => ({ ...state, ...params })),
  resetFilter: () =>
    set({
      search: "",
      category: "all",
      completed: "all",
      sort: "dueDate",
      order: "asc",
    }),
}));
