"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; // tailwind用class結合関数
import { useCategoryStore } from "@/store/categoryStore";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import * as React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CategorySelect: React.FC<Props> = ({
  value,
  onChange,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const { deleteCategory, categories } = useCategoryStore();

  //   React.useEffect(() => {
  //     fetchCategories();
  //   }, [fetchCategories]);

  //カテゴリー一覧をフィルター、""カテゴリーは表示しない
  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(inputValue.toLowerCase()) && c.name !== ""
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setInputValue(val);
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
    // await fetchCategories(); // ← 状態の同期を保証
    setInputValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("w-full justify-between", className)}
        >
          {value || "カテゴリを選択または入力"}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="カテゴリを検索"
            value={inputValue}
            onValueChange={(val) => setInputValue(val)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSelect(inputValue);
              }
            }}
          />
          <CommandEmpty
            className="text-center text-sm py-2 px-4"
            onClick={() => handleSelect(inputValue)}
          >
            {`${inputValue}をカテゴリに追加`}
          </CommandEmpty>
          <CommandGroup>
            {filtered.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-4"
              >
                <CommandItem
                  value={cat.name}
                  onSelect={handleSelect}
                  className="py-2 px-4"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cat.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {cat.name}
                </CommandItem>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDelete(cat.id);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                  tabIndex={-1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default CategorySelect;
