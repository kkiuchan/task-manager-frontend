import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Category } from "./categoryStore";
import { useFilterStore } from "./filterStore";

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  category: Category | null;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (filter?: TaskFilterParams) => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<number>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  getTaskCount: () => { completed: number; incomplete: number };
}

export interface TaskFilterParams {
  search?: string;
  category?: string;
  completed?: string;
  sort?: string;
  order?: string;
}

const STORAGE_KEY = "tasks";

function filterAndSortTasks(tasks: Task[], filter: TaskFilterParams): Task[] {
  let filteredTasks = [...tasks];
  if (filter) {
    if (filter.search) {
      filteredTasks = filteredTasks.filter(
        (task: Task) =>
          task.title.toLowerCase().includes(filter.search!.toLowerCase()) ||
          task.description.toLowerCase().includes(filter.search!.toLowerCase())
      );
    }
    if (filter.category === "none") {
      filteredTasks = filteredTasks.filter(
        (task: Task) => task.category === null
      );
    } else if (filter.category && filter.category !== "all") {
      filteredTasks = filteredTasks.filter(
        (task: Task) => task.category?.name === filter.category
      );
    }
    if (filter.completed && filter.completed !== "all") {
      const isCompleted = filter.completed === "true";
      filteredTasks = filteredTasks.filter(
        (task: Task) => task.completed === isCompleted
      );
    }
    if (filter.sort) {
      filteredTasks.sort((a: Task, b: Task) => {
        const order = filter.order === "desc" ? -1 : 1;
        if (filter.sort === "dueDate") {
          return (
            (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) *
            order
          );
        }
        const aValue = a[filter.sort as keyof Task];
        const bValue = b[filter.sort as keyof Task];
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1 * order;
        if (bValue === null) return -1 * order;
        return (aValue > bValue ? 1 : -1) * order;
      });
    }
  }
  return filteredTasks;
}

export const useTaskStore = create<TaskState>()(
  devtools(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,

      fetchTasks: async (filter?: TaskFilterParams) => {
        set({ loading: true, error: null });
        try {
          const storedData = localStorage.getItem(STORAGE_KEY);
          let tasks = storedData ? JSON.parse(storedData) : [];

          if (filter) {
            tasks = filterAndSortTasks(tasks, filter);
          }

          set({ tasks, loading: false });
        } catch (e) {
          set({
            error:
              e instanceof Error ? e.message : "予期せぬエラーが発生しました",
            loading: false,
          });
        }
      },

      addTask: async (task: Omit<Task, "id">) => {
        try {
          const storedData = localStorage.getItem(STORAGE_KEY);
          const tasks = storedData ? JSON.parse(storedData) : [];
          const newTask = {
            ...task,
            id: Date.now(),
          };
          const updatedTasks = [...tasks, newTask];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

          const filter = useFilterStore.getState();
          const filteredTasks = filterAndSortTasks(updatedTasks, filter);

          set({ tasks: filteredTasks });
          return newTask.id;
        } catch (e) {
          console.error("タスクの作成に失敗しました:", e);
          throw e;
        }
      },

      updateTask: async (id: number, task: Partial<Task>) => {
        try {
          const storedData = localStorage.getItem(STORAGE_KEY);
          const tasks = storedData ? JSON.parse(storedData) : [];
          const updatedTasks = tasks.map((t: Task) =>
            t.id === id ? { ...t, ...task } : t
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

          const filter = useFilterStore.getState();
          const filteredTasks = filterAndSortTasks(updatedTasks, filter);

          set({ tasks: filteredTasks });
        } catch (e) {
          console.error("タスクの更新に失敗しました:", e);
          throw e;
        }
      },

      deleteTask: async (id: number) => {
        try {
          const storedData = localStorage.getItem(STORAGE_KEY);
          const tasks = storedData ? JSON.parse(storedData) : [];
          const updatedTasks = tasks.filter((t: Task) => t.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

          const filter = useFilterStore.getState();
          const filteredTasks = filterAndSortTasks(updatedTasks, filter);

          set({ tasks: filteredTasks });
        } catch (e) {
          console.error("タスクの削除に失敗しました:", e);
          throw e;
        }
      },

      getTaskCount: () => {
        const tasks = get().tasks;
        return {
          completed: tasks.filter((t) => t.completed).length,
          incomplete: tasks.filter((t) => !t.completed).length,
        };
      },
    }),
    {
      name: "task-store",
    }
  )
);
