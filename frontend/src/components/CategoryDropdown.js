import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/reducers/categoryReducer";
import "./CategoryDropdown.css";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBContainer,
} from "mdb-react-ui-kit";
import { API_CATEGORY_URL } from "config";

const CategoryDropdown = () => {
  const { categories, isLoading, error } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleItemClick = (slug, event) => {
    event.stopPropagation();
    navigate(`${API_CATEGORY_URL}/${slug}`);
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories.</p>;

  const renderCategories = () => {
    if (!categories || categories.length === 0 || !categories[0].children) {
      return null;
    }
    return (
      <MDBContainer className='d-flex justify-content-center basic'>
        <MDBDropdown animation={false}>
          <MDBDropdownToggle>Categories</MDBDropdownToggle>
          <MDBDropdownMenu>{renderCategoryTree(categories[0].children)}</MDBDropdownMenu>
        </MDBDropdown>
      </MDBContainer>
    );
  };

  const renderCategoryTree = (categories) => {
    return (
      <>
        {categories.map((category) => (
          <MDBDropdownItem
            key={category.slug}
            className='dropdown-item'
            onClick={(event) => handleItemClick(category.slug, event)}
          >
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              {category.name}
              {category.children && category.children.length > 0 && <span>&raquo;</span>}
            </span>
            {category.children && category.children.length > 0 && (
              <ul className='dropdown-menu dropdown-submenu'>
                {category.children.map((child) => (
                  <MDBDropdownItem
                    key={child.slug}
                    className='dropdown-item'
                    onClick={(event) => handleItemClick(child.slug, event)}
                  >
                    <span style={{ display: "flex", justifyContent: "space-between" }}>
                    {child.name} {child.children && child.children.length > 0 && <span>&raquo;</span>}
                    </span>
                    {child.children && child.children.length > 0 && (
                      <ul className='dropdown-menu dropdown-submenu'>
                        {renderCategoryTree(child.children)}
                      </ul>
                    )}
                  </MDBDropdownItem>
                ))}
              </ul>
            )}
          </MDBDropdownItem>
        ))}
      </>
    );
  };

  return <>{renderCategories()}</>;
};

export default CategoryDropdown;
