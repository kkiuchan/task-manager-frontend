import { Category, useCategoryStore } from "@/store/categoryStore";
import { useMenuStore } from "@/store/menuStore";
import {
  CheckCircle,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { CategorySelect } from "./CategorySelect";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  category: Category | null;
}

interface Props {
  task: Task;
  onDelete: (id: number) => Promise<void>;
  onEdit: (task: Task) => Promise<void>;
  onToggle: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

const TaskItem: React.FC<Props> = React.memo(
  ({ task, onDelete, onEdit, onToggle, isDeleting }) => {
    console.log("TaskItem rendered:", task.id);

    const isMenuOpen = useMenuStore((state) => state.openMenuId === task.id);
    const setOpenMenuId = useMenuStore((state) => state.setOpenMenuId);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [dueDate, setDueDate] = useState(task.dueDate.split("T")[0]);
    const [category, setCategory] = useState(task.category?.name || "");
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const { addCategory, categories } = useCategoryStore((state) => state);

    const handleEdit = () => {
      setIsEditing(true);
      setOpenMenuId?.(null);
    };

    const handleSave = async () => {
      let categoryId: number | undefined = undefined;
      let finalCategoryName: string | undefined = undefined;

      if (category && category.trim() !== "") {
        const found = categories.find((cat) => cat.name === category.trim());
        if (found) {
          categoryId = found.id;
          finalCategoryName = found.name;
        } else {
          categoryId = await addCategory(category.trim());
          finalCategoryName = category.trim();
        }
      }

      await onEdit({
        id: task.id,
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        completed: task.completed,
        category:
          categoryId && finalCategoryName
            ? { id: categoryId, name: finalCategoryName }
            : null,
      });

      setIsEditing(false);
    };

    const handleCancel = () => {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate.split("T")[0]);
      setCategory(task.category?.name || "");
      setIsEditing(false);
    };

    const isOverdue =
      !task.completed &&
      new Date(task.dueDate).setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0);

    if (isEditing) {
      return (
        <div className="border rounded p-3 bg-white">
          <form className="space-y-3" onSubmit={handleSave}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトル"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="説明"
            />
            <div className="flex gap-4 items-center">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-1/3"
              />
              <div className="flex-1">
                <CategorySelect
                  value={category}
                  onChange={(categoryName) => {
                    setCategory(categoryName);
                    // editedTask.categoryはここで直接セットしない
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div
        className={`border rounded p-3 flex items-center gap-3 transition-colors ${
          task.completed
            ? "bg-green-50 text-gray-400"
            : isOverdue
            ? "bg-red-50 text-red-600"
            : "bg-white text-gray-900"
        }`}
      >
        <button
          onClick={() => {
            onToggle(task.id);
            console.log("TaskItem onToggle");
          }}
          className="focus:outline-none"
          aria-label={task.completed ? "未完了に戻す" : "完了にする"}
        >
          {task.completed ? (
            <CheckCircle className="text-green-500 cursor-pointer" size={24} />
          ) : (
            <Circle className="text-gray-400 cursor-pointer" size={24} />
          )}
        </button>
        <div className="flex-1">
          <div
            className={`font-semibold text-base ${
              task.completed ? "line-through" : ""
            }`}
          >
            {task.title}
          </div>
          <div className="text-sm text-gray-500">{task.description}</div>
          <div className="text-xs flex items-center gap-2">
            <span
              className={isOverdue ? "font-bold text-red-600" : "text-gray-400"}
            >
              期限: {task.dueDate.split("T")[0]}
            </span>
            {task.category?.name ? (
              <Badge variant="secondary">{task.category.name}</Badge>
            ) : (
              <Badge variant="outline">未分類</Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 min-w-[60px]">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 menu-action-button"
              onClick={(e) => {
                e.stopPropagation();
                if (setOpenMenuId) {
                  setOpenMenuId(isMenuOpen ? null : task.id);
                }
              }}
              ref={menuButtonRef}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 min-w-[120px] rounded-md shadow-lg bg-background ring-1 ring-border z-10 menu-content">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-foreground hover:bg-accent flex items-center gap-2 menu-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                    編集
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-destructive hover:bg-accent flex items-center gap-2 menu-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDelete) {
                        onDelete(task.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3 w-3" />
                    {isDeleting ? "削除中..." : "削除"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TaskItem.displayName = "TaskItem";

export default TaskItem;
