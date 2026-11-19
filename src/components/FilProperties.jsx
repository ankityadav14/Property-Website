import React from "react";
import "./Filters.css";

const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

export default function FilProperties({
  filters,
  setFilters,
  cities,
  propertyTypes,
  onSearch,
  onClear,
}) {
  const setField = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const updateRange = (minField, maxField, key, value, isMinimum) => {
    const nextValue = Number(value);
    setFilters((current) => ({
      ...current,
      [key]: nextValue,
      [isMinimum ? maxField : minField]: isMinimum
        ? Math.max(nextValue, Number(current[maxField]) || 0)
        : Math.min(nextValue, Number(current[minField]) || 0),
    }));
  };

  const minimumPrice = Number(filters.minPrice) || 0;
  const maximumPrice = Number(filters.maxPrice) || 50000;
  const minimumSize = Number(filters.minSize) || 0;
  const maximumSize = Number(filters.maxSize) || 50000;

  return (
    <aside className="filters-f" aria-label="Filter rental properties">
      <div className="property-filter-heading">
        <div>
          <p className="property-filter-kicker">Make it yours</p>
          <p className="f-p">Find your fit</p>
          <span>Refine your search</span>
        </div>
        <button type="button" className="property-filter-reset" onClick={onClear}>Reset</button>
      </div>
      <div className="f-container">
        <div className="form-group">
          <label htmlFor="city">Location</label>
          <input
            className="form-control"
            id="city"
            type="search"
            list="property-city-options"
            placeholder="Any city"
            autoComplete="off"
            value={filters.city}
            onChange={(event) => setField("city", event.target.value)}
          />
          <datalist id="property-city-options">
            {cities?.map((city) => <option key={city.value} value={city.value}>{city.label}</option>)}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="ptype">Property type</label>
          <select
            className="form-control"
            id="ptype"
            value={filters.propertyType}
            onChange={(event) => setField("propertyType", event.target.value)}
          >
            <option value="">Any property type</option>
            {propertyTypes?.map((propertyType) => (
              <option key={propertyType.value} value={propertyType.value}>{propertyType.label}</option>
            ))}
          </select>
        </div>

        <fieldset className="filter-range">
          <legend>Monthly budget</legend>
          <div className="filter-range-labels">
            <span>{formatCurrency(minimumPrice)}</span>
            <span>{formatCurrency(maximumPrice)}</span>
          </div>
          <label className="filter-range-control">
            <span>Minimum monthly rent</span>
            <input
              type="range"
              min="0"
              max="500000"
              step="5000"
              value={minimumPrice}
              onChange={(event) => updateRange("minPrice", "maxPrice", "minPrice", event.target.value, true)}
            />
          </label>
          <label className="filter-range-control">
            <span>Maximum monthly rent</span>
            <input
              type="range"
              min="0"
              max="500000"
              step="5000"
              value={maximumPrice}
              onChange={(event) => updateRange("minPrice", "maxPrice", "maxPrice", event.target.value, false)}
            />
          </label>
        </fieldset>

        <fieldset className="filter-range">
          <legend>Floor area</legend>
          <div className="filter-range-labels">
            <span>{minimumSize.toLocaleString("en-IN")} sqft</span>
            <span>{maximumSize.toLocaleString("en-IN")} sqft</span>
          </div>
          <label className="filter-range-control">
            <span>Minimum floor area</span>
            <input
              type="range"
              min="0"
              max="50000"
              step="250"
              value={minimumSize}
              onChange={(event) => updateRange("minSize", "maxSize", "minSize", event.target.value, true)}
            />
          </label>
          <label className="filter-range-control">
            <span>Maximum floor area</span>
            <input
              type="range"
              min="0"
              max="50000"
              step="250"
              value={maximumSize}
              onChange={(event) => updateRange("minSize", "maxSize", "maxSize", event.target.value, false)}
            />
          </label>
        </fieldset>

        <fieldset className="filter-bedrooms">
          <legend>Bedrooms</legend>
          <div className="filter-chip-list" role="group" aria-label="Filter by bedrooms">
            {["1", "2", "3", "4"].map((bedrooms) => (
              <button
                type="button"
                key={bedrooms}
                className={String(filters.Bedrooms) === bedrooms ? "selected" : ""}
                aria-pressed={String(filters.Bedrooms) === bedrooms}
                onClick={() => setField("Bedrooms", String(filters.Bedrooms) === bedrooms ? "" : bedrooms)}
              >
                {bedrooms} BHK
              </button>
            ))}
          </div>
        </fieldset>

        <div className="form-group">
          <label htmlFor="bathrooms">Bathrooms</label>
          <input
            type="number"
            className="form-control"
            id="bathrooms"
            min="0"
            max="10"
            step="1"
            placeholder="Any"
            value={filters.Bathrooms}
            onChange={(event) => setField("Bathrooms", event.target.value)}
          />
        </div>

        <button type="button" className="property-filter-search" onClick={onSearch}>
          <span>Show homes</span><span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      <p className="property-filter-footnote">The right place is closer than you think.</p>
    </aside>
  );
}
