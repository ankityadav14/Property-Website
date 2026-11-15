import React from "react";
import "./Filters.css";

export default function FilProperties({
  filters,
  setFilters,
  cities,
  propertyTypes,
  onSearch,
  onClear,
}) {
  return (
    <aside className="filters-f" aria-label="Filter rental properties">
      <div className="property-filter-heading">
        <div>
          <p className="f-p">Refine your search</p>
          <span>Choose what matters to you</span>
        </div>
        <button type="button" className="property-filter-reset" onClick={onClear}>
          Clear
        </button>
      </div>
      <div className="f-container">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <select
            className="form-control"
            id="city"
            value={filters.city}
            onChange={(e) => {
              setFilters({ ...filters, city: e.target.value });
            }}
          >
            <option value="">Any city</option>
            {cities?.map((p) => {
              return <option key={p.value} value={p.value}>{p.label}</option>;
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="ptype">Property Type</label>
          <select
            className="form-control"
            id="ptype"
            value={filters.propertyType}
            onChange={(e) => {
              setFilters({ ...filters, propertyType: e.target.value });
            }}
          >
            <option value="">Any property type</option>
            {propertyTypes?.map((p) => {
              return <option key={p.value} value={p.value}>{p.label}</option>;
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms</label>
          <input
            type="number"
            className="form-control"
            id="bedrooms"
            max={"10"}
            value={filters.Bedrooms}
            onChange={(e) => {
              setFilters({ ...filters, Bedrooms: e.target.value });
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bathrooms">Bathrooms</label>
          <input
            type="number"
            className="form-control"
            id="bathrooms"
            max={"10"}
            value={filters.Bathrooms}
            onChange={(e) => {
              setFilters({ ...filters, Bathrooms: e.target.value });
            }}
          />
        </div>

        <button type="button" className="property-filter-search" onClick={onSearch}>
          Show properties <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </aside>
  );
}
