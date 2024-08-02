import { useParams, useNavigate } from "react-router-dom";
import { getAllChildrenOfCategory } from "services/apiRequestsShop";
import { useEffect, useState } from "react";
import { API_CATEGORY_URL } from "config";
import "./CategoryTree.css";

export default function CategoryTree({ className }) {
  const params = useParams();
  const [categoryChildren, setCategoryChildren] = useState([]);
  const [parent, setParent] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryChildren = async () => {
      try {
        const response = await getAllChildrenOfCategory(params.slug);
        console.log(response.children);
        setCategoryChildren(response.data.children);
        setParent(response.data.parent);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchCategoryChildren();
  }, [params]);

  const handleNavigationClick = (slug, event) => {
    event.stopPropagation();
    navigate(`${API_CATEGORY_URL}/${slug}`);
  };

  const listCategoryChildren = () => {
    return (
      <>
        {categoryChildren.map((child) => (
          <p key={child.slug} onClick={(event) => handleNavigationClick(child.slug, event)} className="category-child">
            {child.name}
          </p>
        ))}
      </>
    );
  };

  return (
    <div className={`${className}`}>
      {parent && parent.slug ? (
        <p>
          <span>Go back to </span>
          <span 
            onClick={(event) => handleNavigationClick(parent.slug, event)} 
            className="parent-link"
          >
            {parent.name}
          </span>
        </p>
      ) : null}
      {listCategoryChildren()}
    </div>
  );
}
