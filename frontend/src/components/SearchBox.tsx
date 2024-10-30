import { useState, ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import "./SearchBox.scss";
import { ReactComponent as SearchIcon } from "assets/images/search.svg";
import { FRONTEND_SEARCH_URL } from "config";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const navigate = useNavigate();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
        navigate(`${FRONTEND_SEARCH_URL}?string=${encodedSearchTerm}`);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearchClick(event as unknown as MouseEvent<HTMLButtonElement>);
        }
    };

    return (
        <div className="search-box d-flex flex-row align-items-center gap-2">
            <input
                className="search-input flex-fill p-3"
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <button className="search-btn btn btn-primary d-flex justify-content-center align-items-center" onClick={handleSearchClick}>
                <SearchIcon />
            </button>
        </div>
    );
}