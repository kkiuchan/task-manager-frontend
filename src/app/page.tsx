"use client";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCategoryStore } from "@/store/categoryStore";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { useEffect } from "react";
import TaskFilter from "../components/TaskFilter";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";

export default function Home() {
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  console.log("Home rendered");
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const today = format(new Date(), "yyyy年MM月dd日 (EEE)", { locale: ja });

  return (
    <main className="container mx-auto px-2 sm:px-4 py-4 max-w-lg sm:max-w-2xl flex flex-col gap-4 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-center">
        タスク管理アプリ
      </h1>
      <div className="flex justify-center items-center mb-2">
        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
        <span className="text-xs text-gray-400">{today}</span>
      </div>
      <TaskModal />
      {/* PC用: インライン表示 */}
      <div className="hidden md:block">
        <TaskFilter />
      </div>
      {/* モバイル用: Drawerで表示 */}
      <div className="block md:hidden">
        <div className="fixed bottom-0 left-0 w-full z-40 px-2 pb-4 ">
          <Drawer>
            <DrawerTrigger asChild>
              <div className="flex flex-col items-center w-full bg-white/90 cursor-pointer">
                {/* ハンドル部分 */}
                <div className="bg-gray-300 rounded-full w-12 h-1.5 my-2" />
                {/* ラベル */}
                <span className="text-sm text-gray-600">フィルターを開く</span>
              </div>
            </DrawerTrigger>
            <DrawerContent className="pb-4">
              <DrawerTitle className="text-center py-2">フィルター</DrawerTitle>
              <TaskFilter />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <div className="flex-1 pb-12">
        <TaskList />
      </div>
    </main>
  );
}
