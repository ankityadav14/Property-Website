import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PropertiesMap from "../components/PropertiesMap";
import Property from "./Property";
import "./PropertyDetails.css";

const baseurl = process.env.REACT_APP_BASE_URL;

const getPhotoUrl = (photo) => {
  if (!photo) return "/imgs/cardImgs/card8.jpg";
  if (/^https?:\/\//i.test(photo)) return photo;
  return baseurl ? `${baseurl}/${photo.replace(/^\/+/, "")}` : `/${photo.replace(/^\/+/, "")}`;
};

const getOwnerName = (owner) => [owner?.firstName, owner?.lastName].filter(Boolean).join(" ") || "Property owner";

export default function PropertyDetails() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("id");
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setLoadError("");
    setPropertyDetails(null);
    setSimilarProperties([]);
    setActivePhoto(0);

    if (!baseurl || !propertyId) {
      setLoadError(!propertyId ? "This property link is missing its listing ID." : "Property details are unavailable because the API is not configured.");
      setIsLoading(false);
      return () => { isCurrent = false; };
    }

    axios.get(`${baseurl}/properties/${encodeURIComponent(propertyId)}`)
      .then((detailsResponse) => {
        if (!isCurrent) return;
        const details = detailsResponse.data;
        if (!details || typeof details !== "object" || Array.isArray(details)) {
          throw new TypeError("Expected the property API to return a property object.");
        }
        setPropertyDetails(details);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!isCurrent) return;
        console.error("Could not load property details.", error);
        setLoadError("We couldn’t load this property. Please try again or return to the listings.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    axios.get(`${baseurl}/propertyTypes`)
      .then((response) => {
        if (!Array.isArray(response.data)) throw new TypeError("Expected the property types API to return an array.");
        if (isCurrent) setPropertyTypes(response.data);
      })
      .catch((error) => {
        if (isCurrent) console.error("Could not load property types.", error);
      });

    return () => { isCurrent = false; };
  }, [propertyId]);

  useEffect(() => {
    if (!baseurl || !propertyDetails) return undefined;
    let isCurrent = true;
    axios.get(`${baseurl}/properties`)
      .then((response) => {
        if (!Array.isArray(response.data)) throw new TypeError("Expected the properties API to return an array.");
        if (isCurrent) {
          setSimilarProperties(
            response.data
              .filter((property) => property._id !== propertyDetails._id && propertyDetails.location?.city && property.location?.city === propertyDetails.location.city)
              .slice(0, 3)
          );
        }
      })
      .catch((error) => {
        if (isCurrent) console.error("Could not load similar properties.", error);
      });
    return () => { isCurrent = false; };
  }, [propertyDetails]);

  useEffect(() => {
    if (!isGalleryOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsGalleryOpen(false);
      if (event.key === "ArrowRight") setActivePhoto((index) => (index + 1) % (propertyDetails?.photos?.length || 1));
      if (event.key === "ArrowLeft") setActivePhoto((index) => (index - 1 + (propertyDetails?.photos?.length || 1)) % (propertyDetails?.photos?.length || 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen, propertyDetails]);

  const photos = propertyDetails?.photos?.length ? propertyDetails.photos : [null];
  const propertyType = propertyTypes.find((type) => type._id === propertyDetails?.propertyType)?.title;

  return (
    <>
      <Navbar />
      <main className="property-details-page">
        <div className="property-details-shell">
          <Link className="property-details-back" to="/properties">← Back to homes</Link>
          {isLoading ? (
            <div className="property-detail-loading" role="status" aria-label="Loading property details">
              <span /><div><i /><i /><i /></div><aside><i /><i /><i /></aside>
            </div>
          ) : loadError ? (
            <section className="property-detail-message" role="alert">
              <h1>We can’t show this home just yet.</h1>
              <p>{loadError}</p>
              <Link to="/properties">Browse available homes</Link>
            </section>
          ) : propertyDetails ? (
            <>
              <header className="property-detail-heading">
                <div>
                  <p className="property-detail-eyebrow">{propertyType || "Rental home"}{propertyDetails.location?.city ? ` · ${propertyDetails.location.city}` : ""}</p>
                  <h1>{propertyDetails.title || "A place to call home"}</h1>
                  <p>{[propertyDetails.address, propertyDetails.location?.city].filter(Boolean).join(", ")}</p>
                </div>
                <div className="property-detail-price">
                  <strong>{propertyDetails.price ? `₹${propertyDetails.price}` : "Price on request"}</strong>
                  {propertyDetails.price && <span>per month</span>}
                </div>
              </header>

              <section className={`property-detail-gallery${photos.length === 1 ? " single-photo" : ""}`} aria-label="Property photos">
                <button type="button" className="property-gallery-main" onClick={() => setIsGalleryOpen(true)} aria-label="Open full-screen photo gallery">
                  <img src={getPhotoUrl(photos[activePhoto])} alt={`${propertyDetails.title || "Rental property"}, view ${activePhoto + 1}`} />
                  <span className="property-gallery-count">▧ &nbsp;View all {photos.length} photos</span>
                </button>
                <div className="property-gallery-thumbnails">
                  {photos.slice(0, 3).map((photo, index) => (
                    <button
                      type="button"
                      className={index === activePhoto ? "selected" : ""}
                      onClick={() => { setActivePhoto(index); setIsGalleryOpen(true); }}
                      key={`${photo || "fallback"}-${index}`}
                      aria-label={`Open photo ${index + 1}`}
                    >
                      <img src={getPhotoUrl(photo)} alt="" />
                    </button>
                  ))}
                  {photos.length > 3 && (
                    <button type="button" className="property-gallery-more" onClick={() => setIsGalleryOpen(true)}>
                      +{photos.length - 3}<span>more photos</span>
                    </button>
                  )}
                </div>
              </section>

              <div className="property-detail-layout">
                <div className="property-detail-main">
                  <section className="property-detail-specs" aria-label="Property features">
                    {[
                      ["Bedrooms", propertyDetails.Bedrooms],
                      ["Bathrooms", propertyDetails.Bathrooms],
                      ["Area", propertyDetails.Size ? `${propertyDetails.Size} sqft` : ""],
                    ].filter(([, value]) => value !== undefined && value !== "").map(([label, value]) => (
                      <div className="property-detail-spec" key={label}>
                        <span aria-hidden="true">{label === "Bedrooms" ? "⌂" : label === "Bathrooms" ? "◌" : "↗"}</span>
                        <div><strong>{value}</strong><small>{label}</small></div>
                      </div>
                    ))}
                  </section>

                  {propertyDetails.description && (
                    <section className="property-detail-section">
                      <h2>About this home</h2>
                      <p className="property-detail-description">{propertyDetails.description}</p>
                    </section>
                  )}

                  {Array.isArray(propertyDetails.amenities) && propertyDetails.amenities.length > 0 && (
                    <section className="property-detail-section">
                      <h2>What this home offers</h2>
                      <ul className="property-amenities">
                        {propertyDetails.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}
                      </ul>
                    </section>
                  )}

                  {Array.isArray(propertyDetails.floorPlans) && propertyDetails.floorPlans.length > 0 && (
                    <section className="property-detail-section">
                      <h2>Floor plans</h2>
                      <div className="property-floor-plans">
                        {propertyDetails.floorPlans.map((plan, index) => (
                          <a href={getPhotoUrl(typeof plan === "string" ? plan : plan.url)} target="_blank" rel="noopener noreferrer" key={typeof plan === "string" ? plan : plan.url || index}>
                            <img src={getPhotoUrl(typeof plan === "string" ? plan : plan.url)} alt={typeof plan === "string" ? `Floor plan ${index + 1}` : plan.title || `Floor plan ${index + 1}`} loading="lazy" />
                          </a>
                        ))}
                      </div>
                    </section>
                  )}

                  {propertyDetails.location?.latitude != null && propertyDetails.location?.longitude != null && (
                    <section className="property-detail-section">
                      <h2>Where you’ll be</h2>
                      <PropertiesMap properties={[propertyDetails]} />
                    </section>
                  )}

                  {propertyDetails.videoUrl && (
                    <section className="property-detail-section">
                      <h2>Take a virtual tour</h2>
                      <video className="property-detail-video" controls preload="metadata" src={propertyDetails.videoUrl}>
                        Your browser does not support embedded video.
                      </video>
                    </section>
                  )}
                </div>

                <aside className="property-contact-card" aria-label="Contact property owner">
                  <p className="property-contact-eyebrow">Interested in this home?</p>
                  <h2>Take the next step.</h2>
                  <p>Get in touch with the property owner to ask a question or arrange a visit.</p>
                  <div className="property-owner">
                    <span className="property-owner-avatar" aria-hidden="true">{getOwnerName(propertyDetails.owner).charAt(0).toUpperCase()}</span>
                    <div><strong>{getOwnerName(propertyDetails.owner)}</strong><small>Property owner</small></div>
                  </div>
                  {propertyDetails.owner?.mobile && (
                    <a className="property-contact-call" href={`tel:${String(propertyDetails.owner.mobile).replace(/[^\d+]/g, "")}`}>
                      Call owner <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  <Link className="property-contact-message" to="/contact">Ask about this home <span aria-hidden="true">→</span></Link>
                  {propertyDetails.owner?.mobile && <p className="property-contact-phone">{propertyDetails.owner.mobile}</p>}
                </aside>
              </div>

              {similarProperties.length > 0 && (
                <section className="property-related" aria-labelledby="property-related-title">
                  <p className="property-detail-eyebrow">More to explore</p>
                  <h2 id="property-related-title">Homes nearby</h2>
                  <div className="property-related-grid">
                    {similarProperties.map((property) => <Property key={property._id} data={property} />)}
                  </div>
                </section>
              )}
            </>
          ) : null}
        </div>
      </main>

      {isGalleryOpen && (
        <div className="property-lightbox" role="dialog" aria-modal="true" aria-label="Property photo gallery" onClick={() => setIsGalleryOpen(false)}>
          <button type="button" className="property-lightbox-close" onClick={() => setIsGalleryOpen(false)} aria-label="Close gallery">×</button>
          {photos.length > 1 && (
            <button type="button" className="property-lightbox-prev" onClick={(event) => { event.stopPropagation(); setActivePhoto((index) => (index - 1 + photos.length) % photos.length); }} aria-label="Previous photo">‹</button>
          )}
          <img src={getPhotoUrl(photos[activePhoto])} alt={`${propertyDetails?.title || "Rental property"}, view ${activePhoto + 1}`} onClick={(event) => event.stopPropagation()} />
          <span className="property-lightbox-counter">{activePhoto + 1} / {photos.length}</span>
          {photos.length > 1 && (
            <button type="button" className="property-lightbox-next" onClick={(event) => { event.stopPropagation(); setActivePhoto((index) => (index + 1) % photos.length); }} aria-label="Next photo">›</button>
          )}
        </div>
      )}
    </>
  );
}
