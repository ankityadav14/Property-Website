import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getSavedPropertyIds } from '../utils/savedProperties';
import './Properties.css';
import Property from './Property';
import Navbar from '../components/Navbar';
import './SavedProperties.css';

const baseurl = process.env.REACT_APP_BASE_URL;

const SavedProperties = () => {
  const [savedIds, setSavedIds] = useState(() => getSavedPropertyIds());
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadSavedProperties = useCallback(() => {
    const currentSavedIds = getSavedPropertyIds();
    setSavedIds(currentSavedIds);

    if (currentSavedIds.length === 0) {
      setProperties([]);
      setLoadError('');
      setIsLoading(false);
      return;
    }

    if (!baseurl) {
      console.error('Saved properties are unavailable because REACT_APP_BASE_URL is not configured.');
      setLoadError('Saved homes are unavailable because the property service is not configured.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError('');
    axios.get(`${baseurl}/properties`)
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new TypeError('Expected the properties API to return an array.');
        }
        const savedIdSet = new Set(currentSavedIds);
        setProperties(response.data.filter((property) => property?._id && savedIdSet.has(String(property._id))));
      })
      .catch((error) => {
        console.error('Could not load saved properties.', error);
        setLoadError('We couldn’t load your saved homes. Please try again.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadSavedProperties();
  }, [loadSavedProperties]);

  const handleSavedChange = (propertyId, isSaved) => {
    if (isSaved) return;
    setSavedIds((currentIds) => currentIds.filter((savedId) => savedId !== propertyId));
    setProperties((currentProperties) => currentProperties.filter((property) => String(property._id) !== propertyId));
  };

  return (
    <>
      <Navbar />
      <div className="property-listing saved-properties-page">
        <main className="property-page-content saved-properties-content">
          <header className="saved-properties-heading">
            <div>
              <p className="property-page-eyebrow"><span aria-hidden="true" /> Your shortlist</p>
              <h1>Saved homes.</h1>
              <p>Keep the places you love close while you explore your next move.</p>
            </div>
            <Link className="saved-properties-browse" to="/properties">
              Browse rentals <span aria-hidden="true">→</span>
            </Link>
          </header>

          {loadError ? (
            <div className="property-message saved-properties-message" role="alert">
              <h2>We couldn’t open your shortlist.</h2>
              <p>{loadError}</p>
              <button type="button" onClick={loadSavedProperties}>Try again</button>
            </div>
          ) : isLoading ? (
            <div className="property-grid property-grid-loading" role="status" aria-label="Loading saved homes">
              {[0, 1, 2].map((item) => (
                <div className="property-skeleton" key={item}><span /><div><i /><i /><i /></div></div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <section className="property-grid saved-property-grid" aria-label="Your saved rental homes">
              {properties.map((property) => (
                <Property key={property._id} data={property} onSavedChange={handleSavedChange} />
              ))}
            </section>
          ) : (
            <section className="saved-properties-empty" aria-labelledby="saved-properties-empty-title">
              <span className="saved-properties-heart" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
              </span>
              <p className="saved-properties-empty-eyebrow">{savedIds.length > 0 ? 'Your shortlist' : 'Make it yours'}</p>
              <h2 id="saved-properties-empty-title">
                {savedIds.length > 0 ? 'No active homes in this list.' : 'Your shortlist starts here.'}
              </h2>
              <p>
                {savedIds.length > 0
                  ? 'These saved listings may no longer be available. Explore current rentals to find another fit.'
                  : 'Tap the heart on any rental that catches your eye and it will be waiting here.'}
              </p>
              <Link className="saved-properties-browse" to="/properties">
                Explore available homes <span aria-hidden="true">→</span>
              </Link>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default SavedProperties;
