function SearchBar({ search, setSearch }) {
  return (
    <div className="search-box">
      <span>🔎</span>

      <input
        type="text"
        placeholder="Search destination or package..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;