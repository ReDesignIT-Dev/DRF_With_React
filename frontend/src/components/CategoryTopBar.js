import "./CategoryTopBar.css";
import CategoryParentTree from "./CategoryParentTree";
import { useState } from "react";

export default function CategoryTopBar({ className }) {
  const [categoryName, setCategoryName] = useState("");

  return (
    <div className={`${className}`}>
      <h1>{categoryName}</h1>
      <CategoryParentTree currentCategory={setCategoryName}/>
    </div>
  );
}
