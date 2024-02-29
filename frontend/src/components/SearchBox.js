import { useState } from "react";
import "./SearchBox.scss";
import { ReactComponent as SearchIcon } from "images/search.svg";

export default function SearchBox() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        // TODO API QUERY
        console.log("Search term:", searchTerm);
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
            <button  className="search-btn btn btn-primary d-flex justify-content-center align-items-center" onClick={handleSearch}><SearchIcon /></button>
        </div>
    );
}
