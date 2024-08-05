import { useParams, useNavigate } from "react-router-dom";
import { getAllChildrenOfCategory } from "services/apiRequestsShop";
import { useEffect, useState } from "react";
import { API_CATEGORY_URL } from "config";
import "./CategoryTree.css";

export default function CategoryTree({ className }) {
  const params = useParams();
  const [categoryChildren, setCategoryChildren] = useState([]);
  const [parent, setParent] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const fetchCategoryChildren = async (slug) => {
    try {
      const response = await getAllChildrenOfCategory(slug);
      return response.data
    } catch (error) {
      console.error("Error fetching products:", error);
      return []
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchCategoryChildren(params.slug);
      if (result.children && result.children.length > 0) {
          setCategoryChildren(result.children);
          setSelectedCategory(null);
      } else {
          setSelectedCategory(params.slug);
          const newResult = await fetchCategoryChildren(result.parent.slug)
          setCategoryChildren(newResult.children);
      }
      setParent(result.parent);
  };

  fetchData(); // Call the async function

  }, [params]);

  const handleNavigationClick = (slug, event) => {
    event.stopPropagation();
    navigate(`${API_CATEGORY_URL}/${slug}`);
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
