import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getSavedPropertyIds, savePropertyIds } from "../utils/savedProperties";
import "./property.scss";

const baseurl = process.env.REACT_APP_BASE_URL;

const getPhotoUrl = (photo) => {
  if (!photo) return "/imgs/cardImgs/card8.jpg";
  if (/^https?:\/\//i.test(photo)) return photo;
  return baseurl ? `${baseurl}/${photo.replace(/^\/+/, "")}` : `/${photo.replace(/^\/+/, "")}`;
};

const isRecentlyAdded = (property) => {
  const createdAt = Date.parse(property.createdAt || property.created_at || "");
  const daysSinceAdded = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
  return Number.isFinite(daysSinceAdded) && daysSinceAdded >= 0 && daysSinceAdded <= 14;
};

const Property = ({ data, onSavedChange }) => {
  const photos = data?.photos?.length ? data.photos : [null];
  const [activePhoto, setActivePhoto] = useState(0);
  const [isSaved, setIsSaved] = useState(() => getSavedPropertyIds().includes(String(data._id)));
  const isFeatured = Boolean(data?.featured || data?.isFeatured || data?.is_featured);
  const badge = isFeatured ? "Featured" : isRecentlyAdded(data) ? "New" : "For rent";

  const handleSave = () => {
    const savedIds = getSavedPropertyIds();
    const propertyId = String(data._id);
    const nextIsSaved = !isSaved;
    const nextSavedIds = isSaved
      ? savedIds.filter((savedId) => savedId !== propertyId)
      : [...new Set([...savedIds, propertyId])];

    if (savePropertyIds(nextSavedIds)) {
      setIsSaved(nextIsSaved);
      if (onSavedChange) onSavedChange(propertyId, nextIsSaved);
    }
  };

  const stepPhoto = (event, direction) => {
    event.preventDefault();
    event.stopPropagation();
    setActivePhoto((index) => (index + direction + photos.length) % photos.length);
  };

  return (
    <article className="property-card">
      <div className="mb-home__owner-prop__card card-shadow">
        <div className="property-card-photo">
          <Link className="property-card-photo-link" to={`/details?id=${data._id}`} aria-label={`View ${data.title || "rental property"}`}>
            <img
              src={getPhotoUrl(photos[activePhoto])}
              alt={data.title ? `${data.title} rental property` : "Rental property"}
              loading="lazy"
              decoding="async"
            />
          </Link>
          <span className="property-image-label">{badge}</span>
          {data.price && (
            <span className="property-card-price-badge">
              <span className="rupees">₹</span>{data.price}<small> / month</small>
            </span>
          )}
          <button
            type="button"
            className={`property-save-button${isSaved ? " is-saved" : ""}`}
            onClick={handleSave}
            aria-label={isSaved ? "Remove from saved properties" : "Save property"}
            aria-pressed={isSaved}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
          </button>
          {photos.length > 1 && (
            <div className="property-photo-controls" aria-label="Property photos">
              <button type="button" onClick={(event) => stepPhoto(event, -1)} aria-label="Previous photo">&lsaquo;</button>
              <span>{activePhoto + 1} / {photos.length}</span>
              <button type="button" onClick={(event) => stepPhoto(event, 1)} aria-label="Next photo">&rsaquo;</button>
            </div>
          )}
        </div>
        <Link className="property-card-link" to={`/details?id=${data._id}`}>
          <div className="mb-home__owner-prop__card--content">
            <div className="mb-home__owner-prop__card--type">{data.title || "Untitled property"}</div>
            {!data.price && <div className="mb-home__owner-prop__card--price">Price on request</div>}
            <div className="mb-home__owner-prop__card--loc">{data?.location?.city || "Location not specified"}</div>
            <div className="property-card-specs" aria-label="Property features">
              {data.Bedrooms !== undefined && data.Bedrooms !== "" && (
                <span><span aria-hidden="true">⌂</span> {data.Bedrooms} bed</span>
              )}
              {data.Bathrooms !== undefined && data.Bathrooms !== "" && (
                <span><span aria-hidden="true">◌</span> {data.Bathrooms} bath</span>
              )}
              {data.Size && <span><span aria-hidden="true">↗</span> {data.Size} sqft</span>}
            </div>
            <span className="property-card-details">View details <span aria-hidden="true">&rarr;</span></span>
          </div>
        </Link>
      </div>
    </article>
  );
};

export default Property;
