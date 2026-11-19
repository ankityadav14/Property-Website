import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Properties.css";
import Property from "./Property";
import Navbar from '../components/Navbar';
import axios from "axios";
import FilProperties from "../components/FilProperties";
import { useLocation, useNavigate } from "react-router-dom";
import PropertiesMap from "../components/PropertiesMap";

const baseurl = process.env.REACT_APP_BASE_URL;
const FeatureCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      propertyType: params.get("propertyType") || "",
      city: params.get("city") || "",
      Bedrooms: params.get("Bedrooms") || "",
      Bathrooms: params.get("Bathrooms") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      minSize: params.get("minSize") || "",
      maxSize: params.get("maxSize") || "",
    };
  });
  const [cities, setCities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [sortOrder, setSortOrder] = useState("recommended");
  const [viewMode, setViewMode] = useState("list");
  const initialFilterLoad = useRef(true);
  const filterSearchTimer = useRef(null);
  const requestId = useRef(0);
  const getCities = useCallback(() => {
    if (!baseurl) {
      return;
    }

    axios({
      method: "get",
      url: baseurl + "/properties/cities",
    })
      .then((res) => {
        console.log(res.data);
        if (!Array.isArray(res.data)) {
          throw new TypeError("Expected the cities API to return an array.");
        }
        let temp = res.data?.map((type) => {
          return { label: type.city, value: type.city };
        });
        setCities(temp);
      })
      .catch((e) => {
        console.log(e);
        setCities([]);
      });
  }, []);
  const getProperties = useCallback(() => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setLoadError("");
    if (!baseurl) {
      console.error("Property listings are unavailable because REACT_APP_BASE_URL is not configured.");
      setLoadError("Property listings are unavailable because the API is not configured.");
      setIsLoading(false);
      return;
    }

    axios({
      method: "get",
      url: baseurl + "/properties",
    })
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new TypeError("Expected the properties API to return an array.");
        }
        if (currentRequestId === requestId.current) setProperties(res.data);
      })
      .catch((e) => {
        console.log(e);
        if (currentRequestId === requestId.current) setLoadError("We couldn’t load the listings. Please try again in a moment.");
      })
      .finally(() => {
        if (currentRequestId === requestId.current) setIsLoading(false);
      });
  }, []);

  const searchHandler = useCallback((searchFilters) => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setLoadError("");
    if (!baseurl) {
      console.error("Property search is unavailable because REACT_APP_BASE_URL is not configured.");
      setLoadError("Property search is unavailable because the API is not configured.");
      setIsLoading(false);
      return;
    }

    axios({
      method: "post",
      url: baseurl + "/properties/filter",
      data: {
        ...searchFilters,
        minSize: searchFilters.minSize || 0,
        maxSize: searchFilters.maxSize || 50000,
        minPrice: searchFilters.minPrice || 0,
        maxPrice: searchFilters.maxPrice || 50000,
      },
    })
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new TypeError("Expected the property search API to return an array.");
        }
        if (currentRequestId === requestId.current) setProperties(res.data);
      })
      .catch((e) => {
        console.log(e);
        if (currentRequestId === requestId.current) setLoadError("We couldn’t load the listings. Please try again in a moment.");
      })
      .finally(() => {
        if (currentRequestId === requestId.current) setIsLoading(false);
      });
  }, []);
  const hasActiveFilters = (searchFilters) => Object.values(searchFilters).some((value) => value !== "");
  const runSearch = () => {
    if (filterSearchTimer.current) {
      window.clearTimeout(filterSearchTimer.current);
      filterSearchTimer.current = null;
    }
    if (hasActiveFilters(filters)) {
      searchHandler(filters);
    } else {
      getProperties();
    }
  };
  const clearHandler = () => {
    setFilters({
      propertyType: "",
      city: "",
      Bedrooms: "",
      Bathrooms: "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      maxSize: "",
    });
    navigate("/properties", { replace: true });
  };
  const [propertyTypes, setPropertyTypes] = useState([]);
  const getPropertyTypes = useCallback(() => {
    if (!baseurl) {
      return;
    }

    axios({
      method: "get",
      url: baseurl + "/propertyTypes",
    })
      .then((res) => {
        console.log(res.data);
        if (!Array.isArray(res.data)) {
          throw new TypeError("Expected the property types API to return an array.");
        }
        let temp = res.data?.map((type) => {
          return { label: type.title, value: type._id };
        });
        setPropertyTypes(temp);
      })
      .catch((e) => {
        console.log(e);
        setPropertyTypes([]);
      });
  }, []);

  useEffect(() => {
    getCities();
    getPropertyTypes();
  }, [getCities, getPropertyTypes]);

  useEffect(() => {
    const delay = initialFilterLoad.current ? 0 : 350;
    initialFilterLoad.current = false;
    filterSearchTimer.current = window.setTimeout(() => {
      filterSearchTimer.current = null;
      if (hasActiveFilters(filters)) {
        searchHandler(filters);
      } else {
        getProperties();
      }
    }, delay);
    return () => {
      if (filterSearchTimer.current) {
        window.clearTimeout(filterSearchTimer.current);
        filterSearchTimer.current = null;
      }
    };
  }, [filters, getProperties, searchHandler]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchCity = params.get("city");
    if (searchCity && searchCity !== filters.city) {
      setFilters((current) => ({ ...current, city: searchCity }));
    }
  }, [location.search, filters.city]);

  const sortedProperties = [...properties].sort((first, second) => {
    if (sortOrder === "recommended") return 0;
    const firstPrice = Number(String(first.price || "").replace(/[^\d.]/g, "")) || 0;
    const secondPrice = Number(String(second.price || "").replace(/[^\d.]/g, "")) || 0;
    return sortOrder === "price-low" ? firstPrice - secondPrice : secondPrice - firstPrice;
  });

  return (
    <>
      <Navbar />
      <div className="property-listing">
        <main className="property-page-content">
          <header className="property-page-intro">
            <div className="property-hero-copy">
              <p className="property-page-eyebrow"><span aria-hidden="true" /> A better way to find home</p>
              <h1>Space to live.<br /><span>Room to belong.</span></h1>
              <p>Find a place that feels like yours. Explore thoughtfully listed homes and make your next move with confidence.</p>
              <a className="property-hero-link" href="#available-homes">
                Explore homes <span aria-hidden="true">&darr;</span>
              </a>
            </div>
            <div className="property-hero-note" aria-label="A home for your next chapter">
              <span className="property-hero-note-icon" aria-hidden="true">⌂</span>
              <span>Make room<br />for what’s next.</span>
            </div>
          </header>
          <div className="body-container">
            <FilProperties
              filters={filters}
              setFilters={setFilters}
              cities={cities}
              propertyTypes={propertyTypes}
              onSearch={runSearch}
              onClear={clearHandler}
            />
            <section className="property-results" id="available-homes" aria-label="Available rental properties">
              <div className="property-results-heading">
                <div>
                  <p className="property-results-kicker">Your next chapter</p>
                  <h2>Homes to explore <span className="property-count-inline" aria-live="polite">{isLoading ? "…" : properties.length}</span></h2>
                </div>
                <div className="property-results-actions">
                  <div className="property-view-toggle" role="group" aria-label="Choose listings view">
                    <button type="button" className={viewMode === "list" ? "selected" : ""} aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")}>List</button>
                    <button type="button" className={viewMode === "map" ? "selected" : ""} aria-pressed={viewMode === "map"} onClick={() => setViewMode("map")}>Map</button>
                  </div>
                  <label className="property-sort">
                    <span>Sort by</span>
                    <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sort properties">
                      <option value="recommended">Recommended</option>
                      <option value="price-low">Price: low to high</option>
                      <option value="price-high">Price: high to low</option>
                    </select>
                  </label>
                </div>
              </div>
              {loadError ? (
                <div className="property-message" role="alert">
                  <h3>We couldn’t load the listings.</h3>
                  <p>{loadError}</p>
                  <button type="button" onClick={getProperties}>Try again</button>
                </div>
              ) : isLoading ? (
                <div className="property-grid property-grid-loading" role="status" aria-label="Loading available homes">
                  {[0, 1, 2].map((item) => <div className="property-skeleton" key={item}><span /><div><i /><i /><i /></div></div>)}
                </div>
              ) : sortedProperties.length > 0 ? (
                viewMode === "map" ? (
                  <PropertiesMap properties={sortedProperties} />
                ) : (
                  <div className="property-grid">
                    {sortedProperties.map((property) => <Property key={property._id} data={property} />)}
                  </div>
                )
              ) : (
                <div className="property-message">
                  <h3>No homes match those filters yet.</h3>
                  <p>Try changing a filter or clearing your search to see all available rentals.</p>
                  <button type="button" onClick={clearHandler}>Clear filters</button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default FeatureCard;
