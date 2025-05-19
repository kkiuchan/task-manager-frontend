import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Category {
  id: number;
  name: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategory: (id: number) => Promise<Category | null>;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<number>;
  deleteCategory: (id: number) => Promise<void>;
}

const STORAGE_KEY = "categories";

export const useCategoryStore = create<CategoryState>()(
  devtools(
    (set) => ({
      categories: [],
      loading: false,
      error: null,

      fetchCategory: async (id: number) => {
        const storedData = localStorage.getItem(STORAGE_KEY);
        const categories = storedData ? JSON.parse(storedData) : [];
        return categories.find((cat: Category) => cat.id === id);
      },

      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const storedData = localStorage.getItem(STORAGE_KEY);
          const categories = storedData ? JSON.parse(storedData) : [];
          set({ categories, loading: false });
        } catch (e) {
          set({
            error:
              e instanceof Error ? e.message : "予期せぬエラーが発生しました",
            loading: false,
          });
          console.error("カテゴリの取得に失敗しました:", e);
        }
      },

      addCategory: async (name: string) => {
        try {
          const storedData = localStorage.getItem(STORAGE_KEY);
          const categories = storedData ? JSON.parse(storedData) : [];
          const newCategory = {
            id: Date.now(),
            name,
          };
          const updatedCategories = [...categories, newCategory];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCategories));
          set({ categories: updatedCategories });
          return newCategory.id;
        } catch (e) {
          console.error("カテゴリの作成に失敗しました:", e);
          throw e;
        }
      },

      deleteCategory: async (id: number) => {
        try {
          const storedData = localStorage.getItem(STORAGE_KEY);
          const categories = storedData ? JSON.parse(storedData) : [];
          const updatedCategories = categories.filter(
            (cat: Category) => cat.id !== id
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCategories));
          set({ categories: updatedCategories });
        } catch (e) {
          console.error("カテゴリの削除に失敗しました:", e);
          throw e;
        }
      },
    }),
    {
      name: "category-store",
    }
  )
);
