import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './home.css';

const baseurl = process.env.REACT_APP_BASE_URL;

const spaces = [
  { image: '/imgs/cardImgs/card1.jpg', title: 'A little more breathing room', type: 'Space to settle in' },
  { image: '/imgs/cardImgs/card4.jpg', title: 'The city, right outside', type: 'Made for city living' },
  { image: '/imgs/cardImgs/card7.jpg', title: 'A softer place to land', type: 'Find your own pace' },
  { image: '/imgs/cardImgs/card10.jpg', title: 'Room for what comes next', type: 'Make it feel like yours' },
];

const faqs = [
  {
    question: 'How do I find a rental that fits my needs?',
    answer: 'Start with a city search or browse all homes. On the listings page, narrow the results by location, property type, bedrooms, and bathrooms.',
  },
  {
    question: 'Can I see more details about a property?',
    answer: 'Yes. Select any listing to open its details page, where you can explore the information and photos provided for that home.',
  },
  {
    question: 'How do I list a property?',
    answer: 'Use Add Property in the navigation to get started. You may be asked to sign in before submitting a listing.',
  },
];

const Home = () => {
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!baseurl) return;

    axios.get(`${baseurl}/properties/cities`)
      .then((response) => {
        if (!Array.isArray(response.data)) throw new TypeError('Expected the cities API to return an array.');
        setCities(response.data.map((item) => item.city).filter(Boolean));
      })
      .catch((error) => console.error('Could not load property search cities.', error));

    axios.get(`${baseurl}/propertyTypes`)
      .then((response) => {
        if (!Array.isArray(response.data)) throw new TypeError('Expected the property types API to return an array.');
        setPropertyTypes(response.data.map((item) => ({ id: item._id, title: item.title })));
      })
      .catch((error) => console.error('Could not load property types.', error));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set('city', city.trim());
    if (propertyType) params.set('propertyType', propertyType);
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-');
      params.set('minPrice', minPrice);
      params.set('maxPrice', maxPrice);
    }
    const query = params.toString();
    navigate(`/properties${query ? `?${query}` : ''}`);
  };

  return (
    <div className="home-container">
      <a className="home-skip-link" href="#home-main">Skip to content</a>
      <Navbar />
      <main id="home-main">
        <section className="home-hero" aria-labelledby="home-hero-title">
          <img className="home-hero-image" src="/imgs/bg.jpg" alt="" />
          <div className="home-hero-overlay" />
          <div className="home-shell home-hero-content">
            <div className="home-hero-copy">
              <p className="home-eyebrow"><span /> Find a place that feels like you</p>
              <h1 id="home-hero-title">A good place<br />changes <em>everything.</em></h1>
              <p className="home-hero-description">
                The next chapter starts at home. Explore rental spaces and find the one that feels right.
              </p>
              <div className="home-hero-actions">
                <Link className="home-button home-button-light" to="/properties">Explore homes <span aria-hidden="true">→</span></Link>
                <a className="home-text-link" href="#how-it-works">How it works <span aria-hidden="true">↓</span></a>
              </div>
            </div>

            <form className="home-search" role="search" aria-label="Search rental homes" onSubmit={handleSearch}>
              <div className="home-search-topline">
                <label htmlFor="home-city">Find a home to rent</label>
                <div className="home-intent-toggle" role="group" aria-label="Listing type">
                  <button type="button" className="selected" aria-pressed="true">Rent</button>
                  <button type="button" disabled title="Buying listings are not available yet">Buy <span>Coming soon</span></button>
                  <button type="button" disabled title="Selling listings are not available yet">Sell <span>Coming soon</span></button>
                </div>
              </div>
              <div className="home-search-row">
                <span className="home-search-icon" aria-hidden="true">⌖</span>
                <input
                  id="home-city"
                  type="search"
                  placeholder="Enter a city"
                  list="home-city-options"
                  autoComplete="off"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
                <datalist id="home-city-options">
                  {cities.map((cityName) => <option value={cityName} key={cityName} />)}
                </datalist>
                <button className="home-button home-button-dark" type="submit">
                  Search homes <span aria-hidden="true">→</span>
                </button>
              </div>
              <div className="home-search-options">
                <label htmlFor="home-property-type">Property type
                  <select id="home-property-type" value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                    <option value="">Any type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="townhouse">Townhouse</option>
                    {propertyTypes.map((type) => <option value={type.id} key={type.id}>{type.title}</option>)}
                  </select>
                </label>
                <label htmlFor="home-price-range">Monthly budget
                  <select id="home-price-range" value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
                    <option value="">Any budget</option>
                    <option value="0-25000">Under ₹25,000</option>
                    <option value="25000-50000">₹25,000–₹50,000</option>
                    <option value="50000-500000">₹50,000+</option>
                  </select>
                </label>
              </div>
              <p>Search by city, or leave it blank to see every listing.</p>
            </form>

            <div className="home-hero-caption" aria-hidden="true">
              <span className="home-caption-line" />
              <span>Make space for what matters</span>
            </div>
          </div>
        </section>

        <section className="home-intro home-shell" aria-labelledby="home-intro-title">
          <div className="home-intro-copyblock">
            <div className="home-section-heading">
              <p className="home-section-eyebrow">A more thoughtful search</p>
              <h2 id="home-intro-title">A home is more than<br />an address.</h2>
            </div>
            <div className="home-intro-copy">
              <p>
                It’s where your day begins, where you unwind, and where the little things start to feel like yours.
                Find a place that fits the way you want to live.
              </p>
              <Link className="home-underlined-link" to="/properties">Find your next place <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <figure className="home-intro-visual">
            <img src="/imgs/cardImgs/card12.jpg" alt="" loading="lazy" decoding="async" />
            <figcaption><span /> Find a place to make your own</figcaption>
          </figure>
        </section>

        <section className="home-benefits" aria-label="A simpler way to find a home">
          <div className="home-shell home-benefits-grid">
            <article className="home-benefit">
              <span className="home-benefit-number">01</span>
              <h3>Search with purpose</h3>
              <p>Start with a city, then fine-tune your search with filters that help you focus on what matters.</p>
            </article>
            <article className="home-benefit">
              <span className="home-benefit-number">02</span>
              <h3>Explore the details</h3>
              <p>Compare available spaces and open a listing to see the details shared by its owner.</p>
            </article>
            <article className="home-benefit">
              <span className="home-benefit-number">03</span>
              <h3>Make your next move</h3>
              <p>Found a place that feels right? Get in touch and take the next step toward making it home.</p>
            </article>
          </div>
        </section>

        <section className="home-spaces" aria-labelledby="home-spaces-title">
          <div className="home-shell">
            <div className="home-spaces-heading">
              <div>
                <p className="home-section-eyebrow">Room to imagine</p>
                <h2 id="home-spaces-title">Find your kind of place.</h2>
              </div>
              <Link className="home-underlined-link" to="/properties">See all homes <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="home-spaces-grid">
              {spaces.map((space, index) => (
                <Link className={`home-space-card home-space-card-${index + 1}`} to="/properties" key={space.image}>
                  <img src={space.image} alt="" loading="lazy" decoding="async" />
                  <span className="home-space-shade" />
                  <span className="home-space-copy">
                    <span>{space.type}</span>
                    <strong>{space.title}</strong>
                  </span>
                  <span className="home-space-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="home-how" id="how-it-works" aria-labelledby="home-how-title">
          <div className="home-shell home-how-layout">
            <div className="home-how-copy">
              <p className="home-section-eyebrow">Simple from the start</p>
              <h2 id="home-how-title">A few steps closer to home.</h2>
              <p>Keep the search clear, explore at your own pace, and move forward when you find the right fit.</p>
              <Link className="home-button home-button-dark" to="/properties">Start exploring <span aria-hidden="true">→</span></Link>
            </div>
            <div className="home-steps">
              <article className="home-step">
                <span>01</span>
                <div><h3>Tell us what you’re looking for</h3><p>Choose a city and use the filters to shape your search.</p></div>
              </article>
              <article className="home-step">
                <span>02</span>
                <div><h3>Explore homes that fit</h3><p>Browse photos, compare details, and open the listings that catch your eye.</p></div>
              </article>
              <article className="home-step">
                <span>03</span>
                <div><h3>Connect and take the next step</h3><p>Reach out about a home and start planning what comes next.</p></div>
              </article>
            </div>
          </div>
        </section>

        <section className="home-faq home-shell" aria-labelledby="home-faq-title">
          <div className="home-faq-heading">
            <p className="home-section-eyebrow">Here to help</p>
            <h2 id="home-faq-title">A few things you might be wondering.</h2>
            <Link className="home-underlined-link" to="/contact">Talk to us <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="home-faq-list">
            {faqs.map((item) => (
              <details className="home-faq-item" key={item.question}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="home-final-cta">
          <div className="home-shell home-final-cta-content">
            <div>
              <p className="home-section-eyebrow">Your next chapter awaits</p>
              <h2>Let’s find your place.</h2>
            </div>
            <div className="home-final-cta-actions">
              <Link className="home-button home-button-light" to="/properties">Browse homes <span aria-hidden="true">→</span></Link>
              <Link className="home-cta-secondary" to="/addproperty">List a property <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-shell home-footer-main">
          <div className="home-footer-brand">
            <Link to="/" aria-label="RealSpace home"><img src="/imgs/logo.svg" alt="RealSpace" /></Link>
            <p>Find a place to call your own.</p>
          </div>
          <div className="home-footer-links">
            <Link to="/properties">Explore homes</Link>
            <Link to="/saved">Saved homes</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/addproperty">List a property</Link>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
        <div className="home-shell home-footer-bottom">
          <span>© 2026 RealSpace. All rights reserved.</span>
          <a href="#home-main">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
