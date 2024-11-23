import { useParams, useNavigate } from "react-router-dom";
import { getAllChildrenOfCategory } from "services/shopServices/apiRequestsShop";
import { useEffect, useState } from "react";
import { API_CATEGORY_URL, FRONTEND_CATEGORY_URL, FRONTEND_SHOP_URL } from "config";
import "./CategoryTree.css";

interface Params {
  [key: string]: string | undefined; 
  slug?: string;
}
 
interface CategoryTreeProps {
  className?: string;
}

export default function CategoryTree({ className }: CategoryTreeProps) {
  const params = useParams<Params>();
  const [categoryChildren, setCategoryChildren] = useState<Category[]>([]);
  const [parent, setParent] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCategoryChildren = async (slug: string): Promise<Category> => {
    try {
      const response = await getAllChildrenOfCategory(slug);
      if (response && response.data) {
        return response.data;
      }
      return {} as Category;
    } catch (error) {
      console.error("Error fetching products:", error);
      return {} as Category;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!params.slug) return;
      const result = await fetchCategoryChildren(params.slug);
      if (result.children && result.children.length > 0) {
        setCategoryChildren(result.children);
        setSelectedCategory(null);
      } else {
        setSelectedCategory(params.slug);
        if (result.parent) {
          const newResult = await fetchCategoryChildren(result.parent.slug);
          setCategoryChildren(newResult.children || []);
        }
      }
      setParent(result.parent || null);
    };

    fetchData(); // Call the async function
  }, [params]);

  const handleNavigationClick = (slug: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    navigate(`${FRONTEND_SHOP_URL}${FRONTEND_CATEGORY_URL}/${slug}`);
  };

  const listCategoryChildren = () => {
    return (
      <>
        {categoryChildren.map((child) => (
          <p
            key={child.slug}
            onClick={(event) => handleNavigationClick(child.slug, event)}
            className={`category-child ${selectedCategory === child.slug ? "selected" : ""}`}
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
      {parent && parent.slug ? (
        <p>
          <span>Go back to </span>
          <span
            onClick={(event) => handleNavigationClick(parent.slug, event)}
            className='parent-link'
          >
            {parent.name}
          </span>
        </p>
      ) : null}
      {listCategoryChildren()}
    </div>
  );
}