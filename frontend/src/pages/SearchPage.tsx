import ProductSearchList from "components/ProductSearchList";
import CategoryAssociatedTree from "components/CategoryAssociatedTree";

import "./SearchPage.css";

export default function SearchPage() {
  return (
    <div className='searchpage-view-container mx-auto gap-3'>
      <div className='d-flex gap-3 mt-3 align-items-start'>
        <CategoryAssociatedTree className="bg-secondary category-tree-basis p-2"/>
        <ProductSearchList className="bg-secondary product-list-basis p-2 flex-grow-1"/>
      </div>
    </div>
  );
}
