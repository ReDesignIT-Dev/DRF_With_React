import ProductList from "components/ProductList";
import CategoryTree from "components/CategoryTree";

export default function Category() {


  return (
    <div className="category-view-container d-flex flex-row">
      < CategoryTree />
      < ProductList /> 

    </div>
  );
}
