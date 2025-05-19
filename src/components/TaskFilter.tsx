import { useCategoryStore } from "@/store/categoryStore";
import { useFilterStore } from "@/store/filterStore";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const sortOptions = [
  { label: "期限", value: "dueDate" },
  { label: "作成日", value: "createdAt" },
] as const;
const orderOptions = [
  { label: "昇順", value: "asc" },
  { label: "降順", value: "desc" },
] as const;

// sortOptionsのvalueの型を定義
type SortOption = (typeof sortOptions)[number]["value"];
// orderOptionsのvalueの型を定義
type OrderOption = (typeof orderOptions)[number]["value"];

const TaskFilter: React.FC = () => {
  const { categories } = useCategoryStore();
  const { search, category, completed, sort, order, setFilter } =
    useFilterStore();

  // debounce検索ワード
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter({ search });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, setFilter]);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Input
        placeholder="検索ワード"
        value={search}
        onChange={(e) => setFilter({ search: e.target.value })}
        className="w-32"
      />
      <Select
        value={category}
        onValueChange={(v) => setFilter({ category: v })}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="カテゴリ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          <SelectItem value="none">未分類</SelectItem>
          {categories
            .filter((cat) => cat.name.trim() !== "")
            .map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Select
        value={completed}
        onValueChange={(v) => setFilter({ completed: v })}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="状態" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          <SelectItem value="true">完了</SelectItem>
          <SelectItem value="false">未完了</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={sort}
        onValueChange={(v) => setFilter({ sort: v as SortOption })}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="並び替え" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={order}
        onValueChange={(v) => setFilter({ order: v as OrderOption })}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="順序" />
        </SelectTrigger>
        <SelectContent>
          {orderOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskFilter;
