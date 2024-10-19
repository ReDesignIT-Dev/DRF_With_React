import { useNavigate } from "react-router-dom";
import { useEffect, useState, MouseEvent } from "react";
import { API_CATEGORY_URL } from "config";
import useQueryParams from "hooks/useQueryParams";
import "./CategoryAssociatedTree.css";
import { getAllSearchAssociatedCategories } from "services/shopServices/apiRequestsShop";
interface CategoryAssociatedTreeProps {
  className?: string;
}

const CategoryAssociatedTree: React.FC<CategoryAssociatedTreeProps> = ({
  className,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  useEffect(() => {
    const fetchAssociatedCategoriesTree = async () => {
      try {
        const response = await getAllSearchAssociatedCategories(
          queryParams.string
        );
        if (response && response.data && response.data.categories) {
          setCategories(response.data.categories);
        } else {
          console.error("No categories found in response");
        }
      } catch (error) {
        console.error("Error fetching associated categories:", error);
      }
    };

    fetchAssociatedCategoriesTree();
  }, [queryParams]);

  const handleNavigationClick = (
    slug: string,
    event: MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    navigate(`${API_CATEGORY_URL}/${slug}`);
  };

  const CategoryTree: React.FC<{ category: Category }> = ({ category }) => {
    return (
      <div className="category-tree">
        <div
          onClick={(event) => handleNavigationClick(category.slug, event)}
          className="associated-category"
        >
          <span className="category-name">{category.name}</span>
          <span className="category-count">{category.product_count}</span>
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
    <div className={`${className} d-flex flex-column gap-2`}>
      <h3>Subcategories:</h3>
      {listAssociatedCategories()}
    </div>
  );
};

export default CategoryAssociatedTree;
