import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_CATEGORY_URL } from "config";
import useQueryParams from "hooks/useQueryParams";
import "./CategoryTree.css";
import { getAllSearchAssociatedCategories } from "services/apiRequestsShop";

export default function CategoryTree({ className }) {
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

  const listAssociatedCategories = () => {
    return (
      <>
        {categories.map((category) => (
          <p
            key={category.slug}
            onClick={(event) => handleNavigationClick(category.slug, event)}
            className={`associated-category`}
          >
            {category.name}
          </p>
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
