import { useEffect, useState, MouseEvent } from "react";
import { useParams, useNavigate, useLocation, Params } from "react-router-dom";
import { getAllParentsOfCategory, getProductParentCategory } from "services/apiRequestsShop";
import { API_CATEGORY_URL, API_PRODUCT_URL } from "config";
import "./CategoryParentTree.css";

interface Ancestor {
  name: string;
  slug: string;
}

interface APIResponse<T> {
  data: T;
}

interface CategoryParentTreeProps {
  className?: string;
  currentCategory?: string;
}

export default function CategoryParentTree({ className, currentCategory }: CategoryParentTreeProps) {
  const params = useParams<Params>();
  const location = useLocation();
  const [ancestors, setAncestors] = useState<Ancestor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryParents = async (slug: string) => {
      try {
        const response = await getAllParentsOfCategory(slug);
        if (response && response.data) {
          const ancestors = (response as APIResponse<{ ancestors: Ancestor[] }>).data.ancestors;
          setAncestors(ancestors);
          if (typeof currentCategory === "function") {
            const currentCategoryName = ancestors.at(-1)?.name || "";
          }
        }
      } catch (error) {
        console.error("Error fetching category ancestors:", error);
      }
    };

    const fetchProductCategoryParents = async (slug: string) => {
      try {
        const response = await getProductParentCategory(slug);
        if (response && response.data) {
          const categorySlug = (response as APIResponse<{ parent_category: { slug: string } }>).data.parent_category.slug;
          fetchCategoryParents(categorySlug);
        }
      } catch (error) {
        console.error("Error fetching product category:", error);
      }
    };

    const slug = params.slug as string;
    if (location.pathname.startsWith(API_CATEGORY_URL)) {
      fetchCategoryParents(slug);
    } else if (location.pathname.startsWith(API_PRODUCT_URL)) {
      fetchProductCategoryParents(slug);
    }
  }, [params, location.pathname, currentCategory]);

  const handleNavigationClick = (slug: string, event: MouseEvent<HTMLSpanElement>) => {
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