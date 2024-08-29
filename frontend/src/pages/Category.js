import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateIfCategoryExists } from "services/apiRequestsShop";
import ProductList from "components/ProductList";
import CategoryTree from "components/CategoryTree";
import CategoryTopBar from "components/CategoryTopBar";
import "./Category.css";
import NotFound from "./NotFound";

export default function Category() {
  const params = useParams();
  const [isValidCategory, setIsValidCategory] = useState(false);
  const [categoryNotFound, setCategoryNotFound] = useState(false);

  useEffect(() => {
    const checkCategory = async () => {
      try {
        const exists = await validateIfCategoryExists(params.slug);
        if (exists) {
          setIsValidCategory(true);
        } else {
          setCategoryNotFound(true);
        }
      } catch (error) {
        console.error("Error checking category:", error);
        setCategoryNotFound(true);
      }
    };

    checkCategory();
  }, [params]);

  if (categoryNotFound) {
    return <NotFound />;
  }

  return (
    isValidCategory && (
    <div className='category-view-container d-flex flex-column mx-auto gap-3'>
      <CategoryTopBar className="bg-secondary mt-3 p-2"/>
      <div className='d-flex align-items-start gap-3'>
        <CategoryTree className="bg-secondary category-tree-basis p-2"/>
        <ProductList className="bg-secondary product-list-basis p-2 flex-grow-1"/>
      </div>
    </div>
  ));
}
