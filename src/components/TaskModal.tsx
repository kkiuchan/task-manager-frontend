import { useModalStore } from "@/store/modalStore";
import React from "react";
import TaskForm from "./TaskForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const TaskModal: React.FC = () => {
  console.log("TaskModal rendered");
  const isOpen = useModalStore((state) => state.isOpen);
  const open = useModalStore((state) => state.open);
  const close = useModalStore((state) => state.close);

  return (
    <Dialog open={isOpen} onOpenChange={(v) => (v ? open() : close())}>
      <DialogTrigger asChild>
        <Button onClick={open}>タスクを追加</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription></DialogDescription>
        <DialogHeader>
          <DialogTitle>新しいタスクを追加</DialogTitle>
        </DialogHeader>
        <TaskForm />
        <DialogClose asChild>
          <Button variant="outline" className="w-full mt-4" onClick={close}>
            閉じる
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

TaskModal.displayName = "TaskModal";

export default TaskModal;
