import { useFilterStore } from "@/store/filterStore";
import { Task, useTaskStore } from "@/store/taskStore";
import React, { useCallback, useEffect, useState } from "react";
import TaskItem from "./TaskItem";

const TaskList: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const loading = useTaskStore((state) => state.loading);
  const error = useTaskStore((state) => state.error);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const getTaskCount = useTaskStore((state) => state.getTaskCount);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const search = useFilterStore((state) => state.search);
  const category = useFilterStore((state) => state.category);
  const completed = useFilterStore((state) => state.completed);
  const sort = useFilterStore((state) => state.sort);
  const order = useFilterStore((state) => state.order);

  console.log("TaskList rendered");

  const handleDelete = useCallback(
    async (id: number) => {
      setIsDeleting(true);
      try {
        await deleteTask(id);
        // fetchTasks({ search, category, completed, sort, order });
      } catch (error) {
        console.error("タスクの削除に失敗しました:", error);
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteTask]
  );

  const handleToggle = useCallback(
    async (id: number) => {
      try {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        await updateTask(id, { completed: !task.completed });
        // fetchTasks({ search, category, completed, sort, order });
      } catch (error) {
        console.error("タスクの更新に失敗しました:", error);
      }
    },
    [updateTask, tasks]
  );

  const handleEdit = useCallback(
    async (task: Task): Promise<void> => {
      try {
        await updateTask(task.id, task);
        // fetchTasks({ search, category, completed, sort, order });
      } catch (error) {
        console.error("タスクの更新に失敗しました:", error);
      }
    },
    [updateTask]
  );

  useEffect(() => {
    console.log("TaskList useEffect");
    fetchTasks({ search, category, completed, sort, order });
  }, [fetchTasks, search, category, completed, sort, order]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const count = getTaskCount();

  return (
    <div className="space-y-2">
      <div className="flex gap-4 text-sm text-gray-600 mb-2">
        <span>未完了: {count.incomplete}</span>
        <span>完了: {count.completed}</span>
      </div>
      {tasks.length === 0 ? (
        <div>タスクがありません</div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isDeleting={isDeleting}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggle={handleToggle}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
