import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateIfCategoryExists } from "services/shopServices/apiRequestsShop";
import ProductList from "components/ProductList";
import CategoryTree from "components/CategoryTree";
import CategoryTopBar from "components/CategoryTopBar";
import "./Category.css";
import NotFound from "./NotFound";

export default function Category() {
  const params = useParams<Record<string, string>>(); 
  const [isValidCategory, setIsValidCategory] = useState<boolean>(false);
  const [categoryNotFound, setCategoryNotFound] = useState<boolean>(false);

  useEffect(() => {
    const checkCategory = async () => {
      try {
        if (params.slug) {
          const exists = await validateIfCategoryExists(params.slug);
          if (exists) {
            setIsValidCategory(true);
          } else {
            setCategoryNotFound(true);
          }
        } else {
          setCategoryNotFound(true); // Handle the case where `slug` is not present
        }
      } catch (error) {
        console.error("Error checking category:", error);
        setCategoryNotFound(true);
      }
    };

    checkCategory();
  }, [params.slug]); // Dependency array should only include `params.slug`

  if (categoryNotFound) {
    return <NotFound />;
  }

  return (
    <>
      {isValidCategory && params.slug && (
        <div className='category-view-container d-flex flex-column mx-auto gap-3'>
          <CategoryTopBar className="bg-secondary mt-3 p-2" currentCategory={params.slug}/>
          <div className='d-flex align-items-start gap-3'>
            <CategoryTree className="bg-secondary category-tree-basis p-2" />
            <ProductList className="bg-secondary product-list-basis p-2 flex-grow-1" />
          </div>
        </div>
      )}
    </>
  );
}