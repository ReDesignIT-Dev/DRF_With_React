import { useNavigate, generatePath } from "react-router-dom";
import { useEffect, useState } from "react";
import { FRONTEND_CATEGORY_URL, FRONTEND_SHOP_URL } from "config";
import "./CategoryTree.css";
import { useSelector } from "react-redux";
import { selectParentCategoryById } from "reduxComponents/reduxShop/Categories/selectors";
import { RootState } from "reduxComponents/store";

interface CategoryTreeProps {
  categoryTree: CategoryNode | null;
}

export default function CategoryTree({ categoryTree }: CategoryTreeProps) {
  const parentCategory = useSelector((state: RootState) => (categoryTree ? selectParentCategoryById(state, categoryTree.id) : null));
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryToMap, setCategoryToMap] = useState<CategoryNode | null>(categoryTree);
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryTree) {
      if (categoryTree.children) {
        setCategoryToMap(categoryTree);
        setSelectedCategory(null);
      } else {
        setCategoryToMap(parentCategory);
        setSelectedCategory(categoryTree.id);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [categoryTree]);

  const handleNavigationClick = (slug: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const categoryPath = generatePath(FRONTEND_CATEGORY_URL, { slug });
    navigate(categoryPath);
  };

  const listCategoryChildren = () => {
    if (!categoryToMap || !categoryToMap.children) return null;
    return (
      <>
        {categoryToMap.children.map((child) => (
          <p
            key={child.id}
            onClick={(event) => handleNavigationClick(child.slug, event)}
            className={`category-child ${selectedCategory === child.id ? "selected" : ""}`}
          >
            {child.name}
          </p>
        ))}
      </>
    );
  };

  return (
    <div className={`d-flex flex-column gap-2`}>
      <h3>Subcategories:</h3>
      {parentCategory && parentCategory.slug ? (
        <p>
          <span>Go back to </span>
          <span onClick={(event) => handleNavigationClick(parentCategory.slug, event)} className="parent-link">
            {parentCategory.name}
          </span>
        </p>
      ) : null}
      {listCategoryChildren()}
    </div>
  );
}
