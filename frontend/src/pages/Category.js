import ProductList from "components/ProductList";
import CategoryTree from "components/CategoryTree";
import CategoryTopBar from "components/CategoryTopBar";
import "./Category.css";

export default function Category() {
  return (
    <div className='category-view-container d-flex flex-column mx-auto gap-3'>
      <CategoryTopBar className="bg-secondary mt-3 p-2"/>
      <div className='d-flex align-items-start gap-3'>
        <CategoryTree className="bg-secondary category-tree-basis p-2"/>
        <ProductList className="bg-secondary product-list-basis p-2 flex-grow-1"/>
      </div>
    </div>
  );
}
