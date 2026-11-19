import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./PropertiesMap.css";

const getCoordinates = (property) => {
  const latitude = Number(property?.location?.latitude ?? property?.location?.lat);
  const longitude = Number(property?.location?.longitude ?? property?.location?.lng);
  return Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null;
};

const PropertiesMap = ({ properties }) => {
  const mappedProperties = useMemo(
    () => properties.map((property) => ({ property, coordinates: getCoordinates(property) })).filter((item) => item.coordinates),
    [properties]
  );
  const [selectedId, setSelectedId] = useState(mappedProperties[0]?.property._id || "");
  const selected = mappedProperties.find((item) => item.property._id === selectedId) || mappedProperties[0];

  const mapUrl = useMemo(() => {
    if (!selected) return "";
    const { latitude, longitude } = selected.coordinates;
    const bounds = [longitude - 0.025, latitude - 0.018, longitude + 0.025, latitude + 0.018].join(",");
    const query = new URLSearchParams({ bbox: bounds, layer: "mapnik", marker: `${latitude},${longitude}` });
    return `https://www.openstreetmap.org/export/embed.html?${query.toString()}`;
  }, [selected]);

  if (!mappedProperties.length) {
    return (
      <div className="properties-map-empty" role="status">
        <span aria-hidden="true">⌖</span>
        <h3>No mapped homes yet</h3>
        <p>Map locations will appear here when listing coordinates are available.</p>
      </div>
    );
  }

  return (
    <div className="properties-map-layout">
      <div className="properties-map-list" aria-label="Homes with map locations">
        {mappedProperties.map(({ property }) => (
          <button
            type="button"
            className={`properties-map-list-item${selected?.property._id === property._id ? " selected" : ""}`}
            onClick={() => setSelectedId(property._id)}
            key={property._id}
            aria-pressed={selected?.property._id === property._id}
          >
            <span>{property.title || "Rental property"}</span>
            <small>{property.location?.city || "Location available"}</small>
          </button>
        ))}
      </div>
      <div className="properties-map-frame">
        <iframe
          title={selected ? `Map location for ${selected.property.title || "rental property"}` : "Property locations map"}
          src={mapUrl}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <Link
          className="properties-map-open"
          to={`/details?id=${selected.property._id}`}
          aria-label={`View details for ${selected.property.title || "rental property"}`}
        >
          View selected home <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
};

export default PropertiesMap;
