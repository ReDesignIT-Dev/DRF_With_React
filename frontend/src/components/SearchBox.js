import { useState } from "react";
import "./SearchBox.scss";
import { ReactComponent as SearchIcon } from "images/search.svg";
import { FRONTEND_SEARCH_URL } from "config";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();


    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = (event) => {
        event.stopPropagation();
        const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
        navigate(`${FRONTEND_SEARCH_URL}?string=${encodedSearchTerm}`);
      };

    return (
        <div className="search-box d-flex flex-row align-items-center gap-2">
            <input
                className="search-input flex-fill p-3"
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
            />
            <button  className="search-btn btn btn-primary d-flex justify-content-center align-items-center" onClick={(event) => handleSearchClick(event)}><SearchIcon /></button>
        </div>
    );
}
