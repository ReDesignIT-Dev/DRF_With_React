import { generatePath, useNavigate } from "react-router-dom";
import { useEffect, useState, MouseEvent } from "react";
import { FRONTEND_CATEGORY_URL, FRONTEND_SHOP_URL } from "config";
import useQueryParams from "hooks/useQueryParams";
import "./CategoryAssociatedTree.css";
import { getAllSearchAssociatedCategories } from "services/shopServices/apiRequestsShop";

const CategoryAssociatedTree: React.FC = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  useEffect(() => {
    const fetchAssociatedCategoriesTree = async () => {
      try {
        const response = await getAllSearchAssociatedCategories(queryParams.string);
        if (response && response.data && response.data) {
          setCategories(response.data);
        } else {
          console.error("No categories found in response");
        }
      } catch (error) {
        console.error("Error fetching associated categories:", error);
      }
    };

    fetchAssociatedCategoriesTree();
  }, [queryParams]);

  const handleNavigationClick = (slug: string, event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const categoryPath = generatePath(FRONTEND_CATEGORY_URL, { slug });
    navigate(categoryPath);
  };

  const CategoryTree: React.FC<{ category: CategoryNode }> = ({ category }) => {
    return (
      <div className="category-tree">
        <div onClick={(event) => handleNavigationClick(category.slug, event)} className="associated-category">
          <span className="category-name">{category.name}</span>
          <span className="category-count">{category.productCount}</span>
        </div>
        {category.children && category.children.length > 0 && (
          <div className="category-children">
            {category.children.map((childCategory) => (
              <CategoryTree key={childCategory.slug} category={childCategory} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const listAssociatedCategories = () => {
    return (
      <>
        {categories.map((category) => (
          <CategoryTree key={category.slug} category={category} />
        ))}
      </>
    );
  };

  return (
    <div className={`d-flex flex-column gap-2`}>
      <h3>Subcategories:</h3>
      {listAssociatedCategories()}
    </div>
  );
};

export default CategoryAssociatedTree;
