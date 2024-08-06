import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getAllParentsOfCategory } from "services/apiRequestsShop";
import { API_CATEGORY_URL, API_PRODUCT_URL } from "config";
import "./CategoryParentTree.css";
import { getProductParentCategory } from "services/apiRequestsShop";

export default function CategoryParentTree({ className, currentCategory }) {
  const params = useParams();
  const location = useLocation();
  const [ancestors, setAncestors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryParents = async (slug) => {
      try {
        const response = await getAllParentsOfCategory(slug);
        const ancestors = response.data.ancestors;
        setAncestors(ancestors);
        if (typeof currentCategory === 'function') {
          const currentCategoryName = ancestors.at(-1).name;
          currentCategory(currentCategoryName);
        }
      } catch (error) {
        console.error("Error fetching category ancestors:", error);
      }
    };

    const fetchProductCategoryParents = async (slug) => {
      try {
        const response = await getProductParentCategory(slug); // Fetch the category of the product first
        const categorySlug = response.data.parent_category.slug;
        fetchCategoryParents(categorySlug);
      } catch (error) {
        console.error("Error fetching product category:", error);
      }
    };
    if (location.pathname.startsWith(API_CATEGORY_URL)) {
      fetchCategoryParents(params.slug);
    } else if (location.pathname.startsWith(API_PRODUCT_URL)) {
      fetchProductCategoryParents(params.slug);
    }
  }, [params, location.pathname]);

  const handleNavigationClick = (slug, event) => {
    event.stopPropagation();
    navigate(`${API_CATEGORY_URL}/${slug}`);
  };

  return (
    <nav aria-label='breadcrumb' className={`${className}`}>
      <ol className='breadcrumb'>
        {ancestors.map((ancestor, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${ancestor.slug === params.slug ? "active" : ""}`}
          >
            <span role='button' onClick={(event) => handleNavigationClick(ancestor.slug, event)}>
              {ancestor.name}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
