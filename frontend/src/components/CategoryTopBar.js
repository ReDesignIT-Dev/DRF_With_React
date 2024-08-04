import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllParentsOfCategory } from "services/apiRequestsShop";
import { API_CATEGORY_URL } from "config";
import "./CategoryTopBar.css";

export default function CategoryTopBar({ className }) {
  const params = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [ancestors, setAncestors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryParents = async () => {
      try {
        const response = await getAllParentsOfCategory(params.slug);
        const ancestors = response.data.ancestors;
        setAncestors(ancestors);
        setCategoryName(ancestors.at(-1).name);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchCategoryParents();
  }, [params]);

  const handleNavigationClick = (slug, event) => {
    event.stopPropagation();
    navigate(`${API_CATEGORY_URL}/${slug}`);
  };

  return (
    <div className={`${className}`}>
      <h1>{categoryName}</h1>
      <nav aria-label='breadcrumb'>
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
    </div>
  );
}
