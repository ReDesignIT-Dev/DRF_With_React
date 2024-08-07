import ProductSearchList from "components/ProductSearchList";
import CategoryAssosiatedTree from "components/CategoryAssosiatedTree";

import "./SearchPage.css";

export default function SearchPage() {

  return (
    <div className='searchpage-view-container d-flex flex-column mx-auto gap-3'>
      <div className='d-flex flex-row gap-3'>
        <CategoryAssosiatedTree className="bg-secondary category-tree-basis p-2"/>
        <ProductSearchList className="bg-secondary product-list-basis p-2"/>
      </div>
    </div>
  );
}
