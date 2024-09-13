import "./CategoryTopBar.css";
import CategoryParentTree from "./CategoryParentTree";
import { useState } from "react";

interface CategoryTopBarProps {
  className?: string;
  currentCategory: string;
}

export default function CategoryTopBar({ className, currentCategory }: CategoryTopBarProps) {
  const [categoryName, setCategoryName] = useState<string>("");

  return (
    <div className={`${className}`}>
      <h1>{categoryName}</h1>
      <CategoryParentTree currentCategory={currentCategory} />
    </div>
  );
}