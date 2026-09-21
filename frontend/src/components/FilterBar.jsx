const CATEGORIES = ['', 'Beach', 'Mountain', 'City', 'Heritage', 'Wildlife', 'Other'];

export default function FilterBar({ filters, setFilters }) {
  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="filter-strip">
      <span className="filter-label">Filter</span>
      <input name="search" placeholder="Search by name" value={filters.search} onChange={handleChange} />
      <input name="country" placeholder="Country" value={filters.country} onChange={handleChange} />
      <select name="category" value={filters.category} onChange={handleChange}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c === '' ? 'All categories' : c}</option>
        ))}
      </select>
      <input name="minPrice" type="number" min="0" placeholder="Min ₹" value={filters.minPrice} onChange={handleChange} />
      <input name="maxPrice" type="number" min="0" placeholder="Max ₹" value={filters.maxPrice} onChange={handleChange} />
    </div>
  );
}
