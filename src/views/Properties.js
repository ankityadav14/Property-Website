import React, { useEffect, useState } from "react";
import "./Properties.css";
import Property from "./Property";
import Navbar from '../components/Navbar';
import axios from "axios";
import FilProperties from "../components/FilProperties";

const baseurl = process.env.REACT_APP_BASE_URL;
let minSize = 0;
let maxSize = 50000;
let minPrice = 0;
let maxPrice = 50000;
const FeatureCard = () => {
  const [filters, setFilters] = useState({
    propertyType: "",
    city: "",
    Bedrooms: "",
    Bathrooms: "",
  });
  const [cities, setCities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const getCities = () => {
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
  };
  const getProperties = () => {
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
        setProperties(res.data);
      })
      .catch((e) => {
        console.log(e);
        setLoadError("We couldn’t load the listings. Please try again in a moment.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const searchHandler = () => {
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
      data: { ...filters, minSize, maxSize, maxPrice, minPrice },
    })
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new TypeError("Expected the property search API to return an array.");
        }
        setProperties(res.data);
      })
      .catch((e) => {
        console.log(e);
        setLoadError("We couldn’t load the listings. Please try again in a moment.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const clearHandler = () => {
    minSize = 0;
    maxSize = 50000;
    minPrice = 0;
    maxPrice = 50000;
    setFilters({
      propertyType: "",
      city: "",
      Bedrooms: "",
      Bathrooms: "",
    });
    getProperties();
  };
  const [propertyTypes, setPropertyTypes] = useState([]);
  const getPropertyTypes = () => {
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
  };

  useEffect(() => {
    getCities();
    getProperties();
    getPropertyTypes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="property-listing">
        <main className="property-page-content">
          <header className="property-page-intro">
            <div>
              <p className="property-page-eyebrow">Find a place to call home</p>
              <h1>Properties for rent</h1>
              <p>Explore available homes and narrow your search to fit your needs.</p>
            </div>
            <div className="property-count" aria-live="polite">
              <strong>{isLoading ? "..." : properties.length}</strong>
              <span>{properties.length === 1 ? "rental" : "rentals"} available</span>
            </div>
          </header>
          <div className="body-container">
            <FilProperties
              filters={filters}
              setFilters={setFilters}
              cities={cities}
              propertyTypes={propertyTypes}
              onSearch={searchHandler}
              onClear={clearHandler}
            />
            <section className="property-results" aria-label="Available rental properties">
              <div className="property-results-heading">
                <h2>Available homes</h2>
                {!isLoading && <span>{properties.length} results</span>}
              </div>
              {loadError ? (
                <div className="property-message" role="alert">
                  <h3>We couldn’t load the listings.</h3>
                  <p>{loadError}</p>
                  <button type="button" onClick={getProperties}>Try again</button>
                </div>
              ) : isLoading ? (
                <p className="property-message" role="status">Loading available homes…</p>
              ) : properties.length > 0 ? (
                <div className="property-grid">
                  {properties.map((property) => (
                    <Property key={property._id} data={property} />
                  ))}
                </div>
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
