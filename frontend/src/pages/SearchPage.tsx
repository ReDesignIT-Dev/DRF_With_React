import ProductSearchList from "components/ProductSearchList";
import CategoryAssociatedTree from "components/CategoryAssociatedTree";

import "./SearchPage.css";

export default function SearchPage() {
  return (
    <div className='searchpage-view-container mx-auto gap-3'>
      <div className='d-flex gap-3 mt-3 align-items-start'>
        <CategoryAssociatedTree />
        <ProductSearchList />
      </div>
    </div>
  );
}
