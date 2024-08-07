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
        setCategories([]);
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

  const listAssosiatedCategories = () => {
    return (
      <>
        {categories.map((child) => (
          <p
            key={child.slug}
            onClick={(event) => handleNavigationClick(child.slug, event)}
            className={`category-child`}
          >
            {child.name}
          </p>
        ))}
      </>
    );
  };

  return (
    <div className={`${className} d-flex flex-column gap-2`}>
      <h3>Subcategories:</h3>
      {listAssosiatedCategories()}
    </div>
  );
}
