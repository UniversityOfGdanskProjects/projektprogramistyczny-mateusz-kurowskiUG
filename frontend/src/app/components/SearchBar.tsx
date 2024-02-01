import React, { createRef, useContext, useEffect } from "react";
import loginContext from "../loginContext";
import axios from "axios";

function SearchBar() {
  const { searchTerm, setSearchTerm, setSearchResults } =
    useContext(loginContext);
  const searchRef = createRef<HTMLInputElement>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:3000/api/tmdb/movies/search?query=${searchTerm}`;
        if (!searchTerm) return;
        const searchResult = await axios.get(url);
        if (searchResult.status === 200) {
          setSearchResults(searchResult.data.data);
          return;
        } else {
          setSearchResults([]);
          return;
        }
      } catch (e) {
        setSearchResults([]);
        return;
      }
    };
    const delay = setTimeout(() => {
      if (searchTerm !== "") {
        fetchData();
      } else {
        setSearchResults([]);
      }
    }, 1000);
    return () => {
      clearTimeout(delay);
    };
  }, [searchTerm]);

  const handleSearch = () => {
    if (!searchRef.current) return;
    setSearchTerm(searchRef.current?.value);
  };
  return (
    <div className="form-control">
      <input
        ref={searchRef}
        type="text"
        placeholder="Search"
        onChange={handleSearch}
        className="input input-bordered w-9/12 self-end"
      />
    </div>
  );
}

export default SearchBar;
