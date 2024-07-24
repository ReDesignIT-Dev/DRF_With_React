import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/reducers/categoryReducer";

const CategoryDropdown = () => {
  const {categories, isLoading, error} = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    console.log("Current categories", categories);
  }, [categories]);

  const organizeCategories = (categories) => {
    const map = {};
    const roots = [];
  
    // Create a map of categories and initialize children arrays
    categories.forEach(category => {
      map[category.slug] = { ...category, children: [] };
    });
  
    // Populate the children arrays
    categories.forEach(category => {
      if (category.level === 0) {
        roots.push(map[category.slug]);
      } else {
        const parentSlug = findParentSlug(category, categories, map);
        if (parentSlug) {
          map[parentSlug].children.push(map[category.slug]);
        }
      }
    });
  
    return roots;
  };
  
  const findParentSlug = (category, categories, map) => {
    const parentLevel = category.level - 1;
    const potentialParents = categories.filter(cat => cat.level === parentLevel);
    for (let parent of potentialParents) {
      if (map[parent.slug].children.includes(map[category.slug]) === false) {
        return parent.slug;
      }
    }
    return null;
  };
  



    if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories.</p>;

  const organizedCategories = organizeCategories(categories);

  const renderCategories = (categories) => {
    return categories.map(category => {
      if (category.children.length > 0) {
        return (
          <optgroup label={category.name} key={category.slug}>
            {renderCategories(category.children)}
          </optgroup>
        );
      } else {
        return (
          <option key={category.slug} value={category.slug}>{category.name}</option>
        );
      }
    });
  };

  return (
    
    <select>
      {renderCategories(organizedCategories)}
    </select>
  );
};


export default CategoryDropdown;
