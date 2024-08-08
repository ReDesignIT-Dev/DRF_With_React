import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_CATEGORY_URL } from "config";
import useQueryParams from "hooks/useQueryParams";
import "./CategoryAssociatedTree.css";
import { getAllSearchAssociatedCategories } from "services/apiRequestsShop";

export default function CategoryAssociatedTree({ className }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  useEffect(() => {
    const fetchAssociatedCategoriesTree = async () => {
      try {
        const response = await getAllSearchAssociatedCategories(queryParams.string);
        setCategories(response.data.categories);
        return response.data
      } catch (error) {
        console.error("Error fetching assosiated categories:", error);
        return []
      }
  };

  fetchAssociatedCategoriesTree();

  }, [queryParams]);

  const handleNavigationClick = (slug, event) => {
    event.stopPropagation();
    navigate(`${API_CATEGORY_URL}/${slug}`);
  };

  const CategoryTree = ({ category }) => {
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
}
