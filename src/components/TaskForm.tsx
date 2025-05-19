import { useCategoryStore } from "@/store/categoryStore";
import { useModalStore } from "@/store/modalStore";
import { useTaskStore } from "@/store/taskStore";
import React, { useState } from "react";
import CategorySelect from "./CategorySelect";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// interface Props {
//   onTaskAdded?: () => void;
// }

const TaskForm: React.FC = React.memo(() => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addCategory, categories, fetchCategory } = useCategoryStore();
  const { addTask } = useTaskStore();
  const closeModal = useModalStore((state) => state.close);

  console.log("TaskForm rendered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let categoryId: number | undefined = undefined;
      const found = categories.find((cat) => cat.name === category?.trim());
      if (found) {
        categoryId = found.id;
      } else if (category && category.trim() !== "") {
        try {
          categoryId = await addCategory(category.trim());
        } catch (e) {
          console.error("カテゴリの作成に失敗しました:", e);
          throw new Error("カテゴリの作成に失敗しました");
        }
      }
      const fetchedCategory = await fetchCategory(categoryId as number);
      setCategory(fetchedCategory?.name || null);

      await addTask({
        title,
        description,
        dueDate,
        completed: false,
        category: fetchedCategory,
      });

      setTitle("");
      setDescription("");
      setDueDate("");
      setCategory("");
      closeModal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 w-full" onSubmit={handleSubmit}>
      <Input
        name="title"
        placeholder="タイトル"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
      <Textarea
        name="description"
        placeholder="説明"
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full"
      />
      <Input
        name="dueDate"
        type="date"
        required
        value={dueDate.split("T")[0]}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full"
      />
      <CategorySelect value={category || ""} onChange={setCategory} />
      <Button type="submit" className="w-full" disabled={loading}>
        タスクを追加
      </Button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </form>
  );
});

TaskForm.displayName = "TaskForm";

export default TaskForm;
